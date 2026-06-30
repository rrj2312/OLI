def validate_claims(benchmarks: list) -> list:
    flags = []

    for item in benchmarks:
        claim = item["claim"]
        meta = item["benchmark_metadata"]

        claim_value = claim.get("value")
        if claim_value is None:
            continue

        if meta.get("technology") != claim.get("technology"):
            continue
        if meta.get("metric") != claim.get("metric"):
            continue

        min_val = meta.get("min")
        max_val = meta.get("max")

        if claim_value > max_val * 1.1:
            excess = round((claim_value / max_val - 1) * 100)
            flags.append({
                "severity": "critical",
                "title": f"{claim['metric'].replace('_', ' ').title()} claim exceeds published maximum",
                "description": f"Claimed {claim_value} {claim['unit']} exceeds published maximum of {max_val} {meta['unit']} by {excess}%.",
                "fix": f"Revise claim to within {min_val}-{max_val} {meta['unit']} range.",
                "citation": meta.get("source"),
                "claim_value": claim_value,
                "benchmark_max": max_val,
                "benchmark_min": min_val,
            })
        elif claim_value < min_val * 0.5:
            flags.append({
                "severity": "low",
                "title": f"{claim['metric'].replace('_', ' ').title()} claim is unusually low",
                "description": f"Claimed {claim_value} {claim['unit']} is significantly below typical range of {min_val}-{max_val} {meta['unit']}.",
                "fix": "Verify measurement methodology and baseline assumptions.",
                "citation": meta.get("source"),
                "claim_value": claim_value,
                "benchmark_max": max_val,
                "benchmark_min": min_val,
            })

    return flags