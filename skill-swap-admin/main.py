from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import FileResponse, Response
from db import get_db
from ai_moderation import moderate_skill, ai_ban_reason
import csv

app = FastAPI()

# ======= ADMIN REPORTS AND CHARTS ==========

@app.get("/admin/reports/skills")
def skills_report():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, name, description, ai_moderation_status, ai_moderation_reason, reviewed_by_admin
        FROM skills
    """)
    rows = cur.fetchall()
    csv_lines = ["id,name,description,ai_moderation_status,ai_moderation_reason,reviewed_by_admin"]
    for row in rows:
        row = [str(x).replace("\n", " ") if x is not None else "" for x in row]
        csv_lines.append(",".join(row))
    cur.close()
    conn.close()
    csv_data = "\n".join(csv_lines)
    return Response(content=csv_data, media_type="text/csv")

@app.get("/admin/skills/status_chart")
def skills_status_chart():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT ai_moderation_status, COUNT(*) 
        FROM skills
        GROUP BY ai_moderation_status
    """)
    result = [{"ai_moderation_status": row[0], "count": row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return result

# ======= FLAGGED FOR MODERATION ==========

@app.get("/admin/skills/flagged")
def get_flagged_skills():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, description, ai_moderation_status, ai_moderation_reason, reviewed_by_admin
        FROM skills
        WHERE ai_moderation_status='rejected' AND reviewed_by_admin=FALSE
    """)
    flagged = [
        {
            "id": row[0],
            "description": row[1],
            "ai_moderation_status": row[2],
            "ai_moderation_reason": row[3],
            "reviewed_by_admin": row[4]
        }
        for row in cur.fetchall()
    ]
    cur.close()
    conn.close()
    return flagged

@app.get("/admin/reviews/flagged")
def get_flagged_reviews():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, reviewed_user_id, reviewer_user_id, message, ai_moderation_status, ai_moderation_reason, reviewed_by_admin
        FROM reviews
        WHERE ai_moderation_status='rejected' AND reviewed_by_admin=FALSE
    """)
    flagged = [
        {
            "id": row[0],
            "reviewed_user_id": row[1],
            "reviewer_user_id": row[2],
            "message": row[3],
            "ai_moderation_status": row[4],
            "ai_moderation_reason": row[5],
            "reviewed_by_admin": row[6]
        }
        for row in cur.fetchall()
    ]
    cur.close()
    conn.close()
    return flagged

# ======= USER CREATION WITH AI MODERATION + AUTO BAN ==========

@app.post("/users/create/")
def create_user(name: str, email: str, password: str, skill_name: str, skill_desc: str):
    moderation = moderate_skill(skill_desc)
    if moderation['status'] == "error":
        raise HTTPException(status_code=500, detail=moderation['reason'])
    conn = get_db()
    cur = conn.cursor()
    user_id = None
    auto_banned = False
    ban_reason = None
    try:
        # Create user
        cur.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING id",
            (name, email, password)
        )
        user_id = cur.fetchone()[0]
        # Create default user_profile
        cur.execute(
            "INSERT INTO user_profiles (user_id, bio, location, availability) VALUES (%s, %s, %s, %s)",
            (user_id, "Default bio", "Unknown", "BOTH")
        )
        # Insert skill (since you have no user_id in skills, it will be generic skills list)
        cur.execute(
            "INSERT INTO skills (name, description, ai_moderation_status, ai_moderation_reason) VALUES (%s, %s, %s, %s)",
            (skill_name, skill_desc, moderation['status'], moderation['reason'])
        )
        # Auto-ban if skill is rejected for abuse/spam
        if moderation['status'] == "rejected":
            ban_reason = f"Auto-banned: Skill moderation rejected - {moderation['reason']}"
            cur.execute(
                "UPDATE users SET is_banned=TRUE, ban_reason=%s WHERE id=%s",
                (ban_reason, user_id)
            )
            auto_banned = True
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()
    return {
        "user_id": user_id,
        "name": name,
        "skill_status": moderation['status'],
        "moderation_reason": moderation['reason'],
        "auto_banned": auto_banned,
        "ban_reason": ban_reason if auto_banned else None
    }

# ========== ADMIN BAN/UNBAN (ENHANCED) ==========

@app.post("/admin/user/ban")
def admin_ban_unban_user(data: dict = Body(...)):
    user_id = data.get("user_id")
    action = data.get("action")  # "ban" or "unban"
    reason = data.get("reason", "")

    if not user_id or action not in ("ban", "unban"):
        raise HTTPException(status_code=400, detail="Invalid input.")

    conn = get_db()
    cur = conn.cursor()
    try:
        if action == "ban":
            if not reason.strip():
                raise HTTPException(status_code=400, detail="Ban reason required.")
            cur.execute(
                "UPDATE users SET is_banned=TRUE, ban_reason=%s WHERE id=%s",
                (reason, user_id)
            )
        elif action == "unban":
            cur.execute(
                "UPDATE users SET is_banned=FALSE, ban_reason=NULL WHERE id=%s",
                (user_id,)
            )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
    return {"success": True, "action": action, "user_id": user_id}

# ========== ADMIN SKILL MODERATION ==========

@app.post("/admin/skills/review")
def admin_review_skill(data: dict = Body(...)):
    skill_id = data.get("skill_id")
    decision = data.get("admin_decision")  # "Approve" or "Reject"
    note = data.get("admin_note", "")

    if not skill_id or decision not in ("Approve", "Reject"):
        raise HTTPException(status_code=400, detail="Invalid input.")

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            UPDATE skills
            SET reviewed_by_admin=TRUE,
                ai_moderation_status=%s,
                ai_moderation_reason=%s
            WHERE id=%s
            """,
            (decision.lower(), note, skill_id)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
    return {"success": True, "skill_id": skill_id, "decision": decision}

# ========== ADMIN REVIEW MODERATION ==========

@app.post("/admin/reviews/review")
def admin_review_review(data: dict = Body(...)):
    review_id = data.get("review_id")
    decision = data.get("admin_decision")  # "Approve" or "Reject"
    note = data.get("admin_note", "")

    if not review_id or decision not in ("Approve", "Reject"):
        raise HTTPException(status_code=400, detail="Invalid input.")

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            UPDATE reviews
            SET reviewed_by_admin=TRUE,
                ai_moderation_status=%s,
                ai_moderation_reason=%s
            WHERE id=%s
            """,
            (decision.lower(), note, review_id)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
    return {"success": True, "review_id": review_id, "decision": decision}

# ======= USER CSV EXPORT FIXED =======

@app.get("/admin/download_report/{user_id}")
def download_user_report(user_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT u.id as user_id, u.name, u.email, u.is_banned, u.ban_reason,
               r.id as review_id, r.rating, r.message
        FROM users u
        LEFT JOIN reviews r ON r.reviewed_user_id = u.id
        WHERE u.id = %s
    """, (user_id,))
    rows = cur.fetchall()
    filename = f"user_{user_id}_report.csv"
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([desc[0] for desc in cur.description])
        for row in rows:
            writer.writerow(row)
    cur.close()
    conn.close()
    return FileResponse(filename, media_type='text/csv', filename=filename)
