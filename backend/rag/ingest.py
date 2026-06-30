import os
import json
from supabase import create_client
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY"),
)

model = SentenceTransformer("all-MiniLM-L6-v2")

with open("benchmarks.json") as f:
    benchmarks = json.load(f)

for b in benchmarks:
    content = f"{b['technology']} {b['metric']}: {b['min']} to {b['max']} {b['unit']}. {b['notes']}. Source: {b['source']}"
    embedding = model.encode(content).tolist()

    supabase.table("benchmarks").upsert({
        "id": b["id"],
        "technology": b["technology"],
        "metric": b["metric"],
        "min_value": b["min"],
        "max_value": b["max"],
        "unit": b["unit"],
        "source": b["source"],
        "notes": b["notes"],
        "content": content,
        "embedding": embedding,
    }).execute()

print(f"Ingested {len(benchmarks)} benchmarks into Supabase for OLI")