import os
import requests
import json
from dotenv import load_dotenv

# Load .env if needed
load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY") or "your_openrouter_api_key"

url = "https://openrouter.ai/api/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "model": "meta-llama/llama-3.3-70b-instruct:free",
    "messages": [
        {
            "role": "user",
            "content": "Say hello! If you see this, OpenRouter LLM is working!"
        }
    ]
}

resp = requests.post(url, headers=headers, data=json.dumps(data))
print("Status Code:", resp.status_code)
try:
    result = resp.json()
    print("LLM Output:", result['choices'][0]['message']['content'])
except Exception as e:
    print("Error parsing LLM response:", e)
    print("Raw response:", resp.text)
