import os
import json
from groq import Groq
from dotenv import load_dotenv
from prompts.portfolio_extraction_prompt import build_revenue_extraction_prompt

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def extract_revenue_model(project_name: str, project_summary: str) -> dict:
    prompt = build_revenue_extraction_prompt(project_name, project_summary)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
        temperature=0.1,
    )

    raw = response.choices[0].message.content.replace("```json", "").replace("```", "").strip()

    try:
        parsed = json.loads(raw)
        return {
            "carbon_credits": parsed.get("carbon_credits", 0),
            "subsidies": parsed.get("subsidies", 0),
        }
    except json.JSONDecodeError:
        # Fail-safe default — assume moderate carbon credit exposure
        return {"carbon_credits": 0.3, "subsidies": 0.1}