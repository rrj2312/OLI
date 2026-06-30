def build_revenue_extraction_prompt(project_name: str, project_summary: str) -> str:
    return f"""Extract the revenue model breakdown from this climate project summary as percentages (0 to 1 scale, must sum to 1.0).

PROJECT: {project_name}
SUMMARY:
\"\"\"{project_summary}\"\"\"

Return ONLY this JSON, no markdown:
{{
  "carbon_credits": 0.55,
  "subsidies": 0.15,
  "direct_revenue": 0.30
}}

If exact percentages aren't stated, infer reasonable estimates based on the description. carbon_credits + subsidies + direct_revenue must equal 1.0."""