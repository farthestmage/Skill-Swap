import streamlit as st
from streamlit_autorefresh import st_autorefresh
import pandas as pd
import requests
import datetime

API_URL = "http://localhost:8000"  # Change if needed

st.set_page_config(page_title="Skill Swap Admin", layout="wide")
st.markdown("""<style>
[data-testid="stAppViewContainer"] { background: #181b23 !important; }
.main, .block-container, .css-18e3th9 { background: #181b23 !important; color: #f5f7fa !important; }
.stTabs [data-baseweb="tab-list"] button[aria-selected="true"] { background: #212837 !important; color: #fff !important; font-weight: bold; border-bottom: 4px solid #1ef29c; }
.stTabs [data-baseweb="tab-list"] button { background: #222533 !important; color: #b5c1d8 !important; font-size: 1.1rem !important; border-radius: 10px 10px 0 0 !important; padding: 0.6em 2em 0.5em 2em !important; }
.stButton>button, .stDownloadButton>button { background-color: #1ef29c !important; color: #191e23 !important; border-radius: 8px; font-weight: 600; padding: 0.45em 1.4em; border: none; box-shadow: 0 2px 8px 0 rgba(30,242,156,0.09); transition: background 0.15s; }
.stButton>button:hover, .stDownloadButton>button:hover { background-color: #13e1a3 !important; color: #111 !important; }
.stTextInput>div>div>input, .stTextArea>div>textarea { background: #20283a !important; color: #fff !important; border-radius: 8px; border: 1.5px solid #1ef29c !important; }
.stRadio>div>div>label { color: #f5f7fa !important; }
.stSelectbox>div>div>div>div { background: #232631 !important; color: #eaeaea !important; }
.stDataFrame, .stTable { background: #222835 !important; }
.css-1cpxqw2, .stMarkdown { color: #f5f7fa !important; }
.stExpander, .stAlert { background: #232a3a !important; border: 1.8px solid #1ef29c !important; border-radius: 15px !important; box-shadow: 0 6px 32px 0 rgba(30,242,156,0.13); padding: 0.25em 1.1em 0.55em 1.1em !important; margin-bottom: 1.1em; }
.stMetric { background: #232f43 !important; border-radius: 12px; box-shadow: 0 2px 14px 0 rgba(30,242,156,0.07); padding: 18px !important; margin: 0.7em 0.2em 0.8em 0.2em; }
h1, h2, h3, .stHeader { color: #fff !important; font-weight: 800 !important; letter-spacing: 1.2px; }
</style>""", unsafe_allow_html=True)

st.sidebar.image("https://cdn-icons-png.flaticon.com/512/3064/3064197.png", width=56)
st.sidebar.title("Skill Swap Admin Panel")
jwt_token = st.sidebar.text_input("Admin JWT", type="password")
headers = {"Authorization": f"Bearer {jwt_token}"} if jwt_token else {}

def rerun():
    if hasattr(st, "experimental_rerun"):
        st.experimental_rerun()

def status_icon(flag):
    if flag == "approved": return "🟢"
    elif flag == "rejected": return "🔴"
    elif flag: return "🟡"
    return "⏳"

st.title("Skill Swap – Admin Console")

if not jwt_token:
    st.warning("Please enter your admin JWT in the sidebar to access moderation tools.")
    st.stop()

@st.cache_data(ttl=10)
def get_flagged_skills(headers):
    try:
        resp = requests.get(f"{API_URL}/admin/skills/flagged", headers=headers, timeout=6)
        return resp.json() if resp.status_code == 200 else []
    except Exception:
        return []

@st.cache_data(ttl=10)
def get_flagged_reviews(headers):
    try:
        resp = requests.get(f"{API_URL}/admin/reviews/flagged", headers=headers, timeout=6)
        return resp.json() if resp.status_code == 200 else []
    except Exception:
        return []

@st.cache_data(ttl=10)
def get_status_chart(headers):
    try:
        resp = requests.get(f"{API_URL}/admin/skills/status_chart", headers=headers, timeout=6)
        return pd.DataFrame(resp.json()) if resp.status_code == 200 else pd.DataFrame([])
    except Exception:
        return pd.DataFrame([])

tabs = st.tabs([
    "📊 Dashboard",
    "➕ Add User",
    "📝 Flagged Skills",
    "💬 Flagged Reviews",
    "🔒 Ban/Unban User",
    "📩 Messaging",
    "📥 Reports"
])

# --- 1. Dashboard ---
with tabs[0]:
    st_autorefresh(interval=80000, key="dashboard-autorefresh")
    st.subheader("Platform Status Overview")
    flagged_skills = get_flagged_skills(headers)
    flagged_reviews = get_flagged_reviews(headers)
    try:
        chart_data = get_status_chart(headers)
        if not chart_data.empty:
            st.bar_chart(chart_data.set_index("ai_moderation_status"))
    except Exception as e:
        st.warning(f"Could not load chart: {e}")
    col1, col2 = st.columns(2)
    col1.metric("Flagged Skills", len(flagged_skills), help="Pending AI-rejected skills for admin review")
    col2.metric("Flagged Reviews", len(flagged_reviews), help="Pending AI-rejected reviews for admin review")
    st.caption(f"Last updated: {datetime.datetime.now().strftime('%H:%M:%S')}")
    st.markdown("---")
    st.subheader("Recent Flagged Skills")
    for sk in flagged_skills[:3]:
        st.markdown(f"{status_icon(sk['ai_moderation_status'])} **Skill {sk['id']}**: **{sk.get('name', '')}**<br>{sk['description']}", unsafe_allow_html=True)
        st.markdown(f"<span style='color:#ff8686'><b>AI Reason:</b> {sk['ai_moderation_reason']}</span>", unsafe_allow_html=True)
    st.subheader("Recent Flagged Reviews")
    for rv in flagged_reviews[:3]:
        st.markdown(f"{status_icon(rv['ai_moderation_status'])} **Review {rv['id']}** | {rv['message']}")
        st.markdown(f"<span style='color:#ffb37b'><b>AI Reason:</b> {rv['ai_moderation_reason']}</span>", unsafe_allow_html=True)

# --- 2. Add User (with AI moderation) ---
with tabs[1]:
    st.subheader("Add User (AI-moderated Skill)")
    with st.form("add_user"):
        name = st.text_input("Name", key="user")
        email = st.text_input("Email", key="mail")
        password = st.text_input("Password", type="password", key="pwd")
        skill_name = st.text_input("Skill Name", key="skname")
        skill_desc = st.text_area("Skill Description", key="skdesc")
        submitted = st.form_submit_button("Create User")
    if submitted:
        try:
            resp = requests.post(
                f"{API_URL}/users/create/",
                params={
                    "name": name, "email": email, "password": password,
                    "skill_name": skill_name, "skill_desc": skill_desc
                },
                timeout=8
            )
            if resp.status_code == 200:
                out = resp.json()
                st.success(f"User created! Moderation: {out['skill_status']} ({out['moderation_reason']})")
                if out.get("auto_banned"):
                    st.error(f"User auto-banned: {out['ban_reason']}")
            else:
                st.error(f"Error: {resp.text}")
        except Exception as e:
            st.error(f"Network error: {e}")

# --- 3. Flagged Skills Moderation ---
with tabs[2]:
    st_autorefresh(interval=80000, key="skills-autorefresh")
    st.subheader("Flagged Skills Moderation")
    flagged_skills = get_flagged_skills(headers)
    if not flagged_skills:
        st.success("No flagged skills! 🎉")
    else:
        for skill in flagged_skills[:10]:
            with st.expander(f"{status_icon(skill['ai_moderation_status'])} Skill ID: {skill['id']} – {skill.get('name', '')}", expanded=False):
                st.write(f"**Skill Description:** {skill['description']}")
                st.markdown(f"<span style='color:#ff8686'><b>AI Reason:</b> {skill['ai_moderation_reason']}</span>", unsafe_allow_html=True)
                st.caption(f"Admin Reviewed: {skill['reviewed_by_admin']}")
                decision = st.radio(
                    f"Admin Decision for Skill {skill['id']}",
                    ("None", "Approve", "Reject"),
                    key=f"decision_{skill['id']}"
                )
                admin_note = st.text_input(
                    f"Admin Note for Skill {skill['id']} (if rejecting):",
                    key=f"note_{skill['id']}"
                )
                if decision in ("Approve", "Reject"):
                    if st.button(f"{decision} Skill {skill['id']}", key=f"btn_{skill['id']}"):
                        data = {
                            "skill_id": skill["id"],
                            "admin_decision": decision,
                            "admin_note": admin_note if decision == "Reject" else ""
                        }
                        try:
                            review_resp = requests.post(
                                f"{API_URL}/admin/skills/review",
                                headers=headers,
                                json=data,
                                timeout=8
                            )
                            if review_resp.status_code == 200:
                                st.success(f"Skill {skill['id']} marked as {decision}.")
                                rerun()
                            else:
                                st.error(f"Error: {review_resp.text}")
                        except Exception as e:
                            st.error(f"Network error: {e}")

# --- 4. Flagged Reviews Moderation ---
with tabs[3]:
    st_autorefresh(interval=80000, key="reviews-autorefresh")
    st.subheader("Flagged Reviews Moderation")
    flagged_reviews = get_flagged_reviews(headers)
    if not flagged_reviews:
        st.success("No flagged reviews! 🎉")
    else:
        for rev in flagged_reviews[:10]:
            with st.expander(f"{status_icon(rev['ai_moderation_status'])} Review ID: {rev['id']}", expanded=False):
                st.write(f"**Review Comment:** {rev['message']}")
                st.markdown(f"<span style='color:#ffb37b'><b>AI Reason:</b> {rev['ai_moderation_reason']}</span>", unsafe_allow_html=True)
                st.caption(f"Admin Reviewed: {rev['reviewed_by_admin']}")
                decision = st.radio(
                    f"Admin Decision for Review {rev['id']}",
                    ("None", "Approve", "Reject"),
                    key=f"decision_r_{rev['id']}"
                )
                admin_note = st.text_input(
                    f"Admin Note for Review {rev['id']} (if rejecting):",
                    key=f"note_r_{rev['id']}"
                )
                if decision in ("Approve", "Reject"):
                    if st.button(f"{decision} Review {rev['id']}", key=f"btn_r_{rev['id']}"):
                        data = {
                            "review_id": rev["id"],
                            "admin_decision": decision,
                            "admin_note": admin_note if decision == "Reject" else ""
                        }
                        try:
                            review_resp = requests.post(
                                f"{API_URL}/admin/reviews/review",
                                headers=headers,
                                json=data,
                                timeout=8
                            )
                            if review_resp.status_code == 200:
                                st.success(f"Review {rev['id']} marked as {decision}.")
                                rerun()
                            else:
                                st.error(f"Error: {review_resp.text}")
                        except Exception as e:
                            st.error(f"Network error: {e}")

# --- 5. Ban/Unban User ---
with tabs[4]:
    st.subheader("Ban/Unban User")
    user_id = st.number_input("User ID", min_value=1, step=1)
    ban_action = st.radio("Action", ("None", "ban", "unban"))
    reason = st.text_input("Ban Reason (required if banning)")
    if st.button("Submit Ban/Unban"):
        if ban_action == "ban" and not reason:
            st.warning("Please provide a reason for banning.")
        else:
            data = {"user_id": user_id, "action": ban_action, "reason": reason}
            try:
                ban_resp = requests.post(f"{API_URL}/admin/user/ban", headers=headers, json=data, timeout=8)
                if ban_resp.status_code == 200:
                    st.success(f"User {user_id} {ban_action}ned.")
                else:
                    st.error(f"Error: {ban_resp.text}")
            except Exception as e:
                st.error(f"Network error: {e}")

# --- 6. Messaging ---
with tabs[5]:
    st.subheader("Send Platform Message to User")
    msg_user_id = st.number_input("User ID to message", min_value=1, step=1, key="msg_user")
    msg_text = st.text_area("Message")
    if st.button("Send Message"):
        if not msg_text.strip():
            st.warning("Message cannot be empty.")
        else:
            data = {"to_user_id": msg_user_id, "message": msg_text}
            try:
                msg_resp = requests.post(f"{API_URL}/admin/message", headers=headers, json=data, timeout=8)
                if msg_resp.status_code == 200:
                    st.success(f"Message sent to user {msg_user_id}.")
                else:
                    st.error(f"Error: {msg_resp.text}")
            except Exception as e:
                st.error(f"Network error: {e}")

# --- 7. Reports ---
with tabs[6]:
    st.subheader("Export Skills Moderation Report")
    try:
        csv_dl = requests.get(f"{API_URL}/admin/reports/skills", headers=headers, timeout=8)
        if csv_dl.status_code == 200:
            st.download_button(
                label="Download Skills Report (CSV)",
                data=csv_dl.text,
                file_name="skills_report.csv",
                mime="text/csv"
            )
        else:
            st.warning("No report available right now.")
    except Exception as e:
        st.warning(f"Could not load report: {e}")

# --- END ---
