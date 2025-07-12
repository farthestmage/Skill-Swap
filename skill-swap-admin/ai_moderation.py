import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
LLAMA_URL = "https://openrouter.ai/api/v1/chat/completions"
LLAMA_MODEL = "meta-llama/llama-3.3-70b-instruct:free"

def moderate_skill(description):
    prompt = (
        f"Moderate this skill description for appropriateness and spam. "
        "Respond only in JSON: {'status': 'approved/rejected', 'reason': '<short reason>'}. "
        f"Description: {description}"
    )
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": LLAMA_MODEL,
        "messages": [{"role": "user", "content": prompt}]
    }
    r = requests.post(LLAMA_URL, headers=headers, data=json.dumps(data))
    if r.status_code != 200:
        return {"status": "error", "reason": f"API Error: {r.text}"}
    try:
        resp = r.json()['choices'][0]['message']['content']
        out = json.loads(resp.replace("'", "\""))
        return out
    except Exception as e:
        return {"status": "error", "reason": str(e)}

def ai_ban_reason(user_activity_summary):
    prompt = (
        f"Analyze this user's activity for policy violations. "
        "If violations found, respond only with a short ban reason as plain text. "
        "If not, respond with 'no violation'. Activities: "
        f"{user_activity_summary}"
    )
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": LLAMA_MODEL,
        "messages": [{"role": "user", "content": prompt}]
    }
    r = requests.post(LLAMA_URL, headers=headers, data=json.dumps(data))
    if r.status_code != 200:
        return "API Error"
    return r.json()['choices'][0]['message']['content']
