import chromadb
import json
from sentence_transformers import SentenceTransformer

client = chromadb.PersistentClient(path="./chroma_data")
collection = client.get_or_create_collection("oli_benchmarks")

with open("benchmarks.json") as f:
    benchmarks = json.load(f)

model = SentenceTransformer("all-MiniLM-L6-v2")

collection.add(
    ids=[b["id"] for b in benchmarks],
    documents=[
        f"{b['technology']} {b['metric']}: {b['min']} to {b['max']} {b['unit']}. {b['notes']}. Source: {b['source']}"
        for b in benchmarks
    ],
    metadatas=benchmarks,
)

print(f"Ingested {len(benchmarks)} benchmarks into ChromaDB for OLI")