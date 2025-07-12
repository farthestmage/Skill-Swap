import streamlit as st
import requests
import pandas as pd

API_URL = "http://localhost:8000"

st.title("Skill Swap Admin Dashboard 🛡️")

jwt_token = st.text_input("Enter your Admin JWT:", type="password")
headers = {"Authorization": f"Bearer {jwt_token}"} if jwt_token else {}

# Helper to refresh Streamlit
def rerun():
    st.experimental_rerun()

if jwt_token:
    # Bar chart of skills by moderation status
    st.subheader("Skill Moderation Status Overview")
    chart_resp = requests.get(f"{API_URL}/admin/skills/status_chart", headers=headers)
    if chart_resp.status_code == 200:
        chart_data = pd.DataFrame(chart_resp.json())
        st.bar_chart(chart_data.set_index("ai_moderation_status"))

    # Download CSV report
    st.subheader("Export Moderation Report")
    csv_dl = requests.get(f"{API_URL}/admin/reports/skills", headers=headers)
    if csv_dl.status_code == 200:
        st.download_button(
            label="Download Skills Report (CSV)",
            data=csv_dl.text,
            file_name="skills_report.csv",
            mime="text/csv"
        )

    st.subheader("Flagged Skills Moderation")
    resp = requests.get(f"{API_URL}/admin/skills/flagged", headers=headers)
    if resp.status_code == 200:
        flagged_skills = resp.json()
        if not flagged_skills:
            st.success("No flagged skills!")
        else:
            for skill in flagged_skills:
                st.markdown("---")
                st.markdown(f"**Skill ID:** {skill['skill_id']}")
                st.markdown(f"**User ID:** {skill['user_id']}")
                st.markdown(f"**Description:** {skill['description']}")
                st.markdown(f"**AI Status:** `{skill['ai_moderation_status']}`")
                st.markdown(f"**AI Reason:** {skill['ai_moderation_reason']}")
                st.markdown(f"**Admin Reviewed:** `{skill['reviewed_by_admin']}`")

                decision = st.radio(
                    f"Admin Decision for Skill {skill['skill_id']}",
                    ("None", "Approve", "Reject"),
                    key=f"decision_{skill['skill_id']}"
                )
                admin_note = st.text_input(
                    f"Admin Note for Skill {skill['skill_id']} (if rejecting):",
                    key=f"note_{skill['skill_id']}"
                )

                if decision in ("Approve", "Reject"):
                    if st.button(f"{decision} Skill {skill['skill_id']}", key=f"btn_{skill['skill_id']}"):
                        data = {
                            "skill_id": skill["skill_id"],
                            "admin_decision": decision,
                            "admin_note": admin_note if decision == "Reject" else ""
                        }
                        review_resp = requests.post(
                            f"{API_URL}/admin/skills/review",
                            headers=headers,
                            json=data
                        )
                        if review_resp.status_code == 200:
                            st.success(f"Skill {skill['skill_id']} marked as {decision}.")
                            rerun()
                        else:
                            st.error(f"Error: {review_resp.text}")

    st.subheader("Flagged Reviews Moderation")
    rev_resp = requests.get(f"{API_URL}/admin/reviews/flagged", headers=headers)
    if rev_resp.status_code == 200:
        flagged_reviews = rev_resp.json()
        if not flagged_reviews:
            st.success("No flagged reviews!")
        else:
            for rev in flagged_reviews:
                st.markdown("---")
                st.markdown(f"**Review ID:** {rev['review_id']}")
                st.markdown(f"**Reviewee User ID:** {rev['reviewee_user_id']}")
                st.markdown(f"**Reviewer User ID:** {rev['reviewer_user_id']}")
                st.markdown(f"**Comment:** {rev['comment']}")
                st.markdown(f"**AI Status:** `{rev['ai_moderation_status']}`")
                st.markdown(f"**AI Reason:** {rev['ai_moderation_reason']}")
                st.markdown(f"**Admin Reviewed:** `{rev['reviewed_by_admin']}`")

                decision = st.radio(
                    f"Admin Decision for Review {rev['review_id']}",
                    ("None", "Approve", "Reject"),
                    key=f"decision_r_{rev['review_id']}"
                )
                admin_note = st.text_input(
                    f"Admin Note for Review {rev['review_id']} (if rejecting):",
                    key=f"note_r_{rev['review_id']}"
                )

                if decision in ("Approve", "Reject"):
                    if st.button(f"{decision} Review {rev['review_id']}", key=f"btn_r_{rev['review_id']}"):
                        data = {
                            "review_id": rev["review_id"],
                            "admin_decision": decision,
                            "admin_note": admin_note if decision == "Reject" else ""
                        }
                        review_resp = requests.post(
                            f"{API_URL}/admin/reviews/review",
                            headers=headers,
                            json=data
                        )
                        if review_resp.status_code == 200:
                            st.success(f"Review {rev['review_id']} marked as {decision}.")
                            rerun()
                        else:
                            st.error(f"Error: {review_resp.text}")

    st.subheader("User Ban/Unban")
    user_id = st.number_input("User ID to ban/unban", min_value=1, step=1)
    ban_action = st.radio("Action", ("None", "ban", "unban"))
    reason = st.text_input("Ban Reason (required if banning)")
    if st.button("Submit Ban/Unban"):
        if ban_action == "ban" and not reason:
            st.warning("Please provide a reason for banning.")
        else:
            data = {"user_id": user_id, "action": ban_action, "reason": reason}
            ban_resp = requests.post(f"{API_URL}/admin/user/ban", headers=headers, json=data)
            if ban_resp.status_code == 200:
                st.success(f"User {user_id} {ban_action}ned.")
            else:
                st.error(f"Error: {ban_resp.text}")

    st.subheader("Send Platform Message to User")
    msg_user_id = st.number_input("User ID to message", min_value=1, step=1, key="msg_user")
    msg_text = st.text_area("Message")
    if st.button("Send Message"):
        if not msg_text.strip():
            st.warning("Message cannot be empty.")
        else:
            data = {"to_user_id": msg_user_id, "message": msg_text}
            msg_resp = requests.post(f"{API_URL}/admin/message", headers=headers, json=data)
            if msg_resp.status_code == 200:
                st.success(f"Message sent to user {msg_user_id}.")
            else:
                st.error(f"Error: {msg_resp.text}")

else:
    st.warning("Please enter your admin JWT to access moderation tools.")
