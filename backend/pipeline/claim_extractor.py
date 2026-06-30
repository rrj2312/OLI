import os
import json
from groq import Groq
from dotenv import load_dotenv
from prompts.extraction_prompt import build_extraction_prompt

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def extract_claims(project_text: str) -> list:
    prompt = build_extraction_prompt(project_text)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
        temperature=0.1,
    )

    raw = response.choices[0].message.content
    raw = raw.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fail-safe: return empty list rather than crash the pipeline
        return []