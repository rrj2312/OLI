import chromadb

client = chromadb.PersistentClient(path="./rag/chroma_data")

def retrieve_benchmarks(claims: list, n_results: int = 2) -> list:
    collection = client.get_collection("oli_benchmarks")

    results = []
    seen_ids = set()

    for claim in claims:
        query = f"{claim.get('technology', '')} {claim.get('metric', '')} {claim.get('unit', '')}"

        query_results = collection.query(
            query_texts=[query],
            n_results=n_results,
        )

        for i, doc in enumerate(query_results["documents"][0]):
            meta = query_results["metadatas"][0][i]
            if meta["id"] in seen_ids:
                continue
            seen_ids.add(meta["id"])

            results.append({
                "claim": claim,
                "benchmark_text": doc,
                "benchmark_metadata": meta,
            })

    return results