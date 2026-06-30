import os
import json
from groq import Groq
from dotenv import load_dotenv
from prompts.audit_prompt import build_audit_prompt

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_score(project_text: str, benchmarks: list, deterministic_flags: list) -> dict:
    benchmark_context = "\n".join([b["benchmark_text"] for b in benchmarks]) or "No specific benchmarks matched this project's claims."

    prompt = build_audit_prompt(project_text, benchmark_context, deterministic_flags)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
        temperature=0.2,
    )

    raw = response.choices[0].message.content
    raw = raw.replace("```json", "").replace("```", "").strip()

    return json.loads(raw)