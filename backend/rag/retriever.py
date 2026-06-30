import os
from supabase import create_client
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY"),
)

model = SentenceTransformer("all-MiniLM-L6-v2")

def retrieve_benchmarks(claims: list, n_results: int = 2) -> list:
    results = []
    seen_ids = set()

    for claim in claims:
        query = f"{claim.get('technology', '')} {claim.get('metric', '')} {claim.get('unit', '')}"
        query_embedding = model.encode(query).tolist()

        response = supabase.rpc("match_benchmarks", {
            "query_embedding": query_embedding,
            "match_count": n_results,
        }).execute()

        for row in response.data:
            if row["id"] in seen_ids:
                continue
            seen_ids.add(row["id"])

            results.append({
                "claim": claim,
                "benchmark_text": row["content"],
                "benchmark_metadata": {
                    "id": row["id"],
                    "technology": row["technology"],
                    "metric": row["metric"],
                    "min": row["min_value"],
                    "max": row["max_value"],
                    "unit": row["unit"],
                    "source": row["source"],
                    "notes": row["notes"],
                },
            })

    return results