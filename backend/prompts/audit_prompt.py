def build_audit_prompt(project_text: str, benchmark_context: str, deterministic_flags: list) -> str:
    flags_summary = "\n".join([
        f"- [{f['severity'].upper()}] {f['title']}: {f['description']} (Source: {f['citation']})"
        for f in deterministic_flags
    ]) or "None detected by automated validation."

    return f"""You are OLI — an expert AI auditor for climate technology investments in India.

You have access to VERIFIED scientific benchmarks retrieved for this specific project, and a list of DETERMINISTIC RED FLAGS already computed by a rule-based validation engine (not AI-generated, mathematically checked against the benchmarks).

VERIFIED BENCHMARK CONTEXT:
\"\"\"
{benchmark_context}
\"\"\"

DETERMINISTIC FLAGS ALREADY DETECTED:
{flags_summary}

PROJECT SUBMISSION:
\"\"\"
{project_text}
\"\"\"

Using the benchmark context and the deterministic flags above as ground truth, score this project across 5 dimensions (0-100):
1. tech_readiness — Is TRL stage realistic given the evidence presented?
2. impact_authenticity — Are CO2/environmental claims consistent with the verified benchmarks above?
3. greenwash_risk — Any misleading framing, vague claims, or missing baselines?
4. policy_dependency — Revenue exposure to subsidies, grants, regulatory approval?
5. scalability — Real-world ceiling on impact given constraints?

Incorporate the deterministic flags into your red_flags output (do not contradict them), and add any additional red flags your own reasoning identifies beyond what was already detected. Each red flag needs severity ("critical", "medium", "low"), title, description, fix, and citation if applicable.

Also provide an overall_score, executive_summary (2 sentences), and investor_match with ready_for, not_yet, and next_step.

RESPOND ONLY WITH THIS JSON STRUCTURE (no markdown, no explanation):
{{
  "overall_score": 74,
  "executive_summary": "...",
  "dimensions": {{
    "tech_readiness": {{ "score": 80, "reasoning": "..." }},
    "impact_authenticity": {{ "score": 85, "reasoning": "..." }},
    "greenwash_risk": {{ "score": 60, "reasoning": "..." }},
    "policy_dependency": {{ "score": 55, "reasoning": "..." }},
    "scalability": {{ "score": 70, "reasoning": "..." }}
  }},
  "red_flags": [
    {{
      "severity": "critical",
      "title": "...",
      "description": "...",
      "fix": "...",
      "citation": "...",
      "claim_value": 800,
      "benchmark_max": 380
    }}
  ],
  "investor_match": {{
    "ready_for": ["Impact VC"],
    "not_yet": ["Institutional PE"],
    "next_step": "..."
  }}
}}"""