def build_extraction_prompt(project_text: str) -> str:
    return f"""Extract all verifiable scientific and financial claims from this climate project submission.
For each claim return a structured JSON object with a normalized technology tag.

Use ONLY these technology tags if applicable: biochar, enhanced_weathering, solar_pv, green_hydrogen, wind, plastic_to_fuel, direct_air_capture. If none match, use "other".
Use ONLY these metric tags if applicable: CO2_capture, CO2_avoided, cost, TRL, subsidy_dependency. If none match, use "other".

PROJECT:
\"\"\"{project_text}\"\"\"

Return ONLY a JSON array, no markdown, no explanation. Example:
[
  {{
    "metric": "CO2_capture",
    "value": 800,
    "unit": "kg/hectare/year",
    "technology": "enhanced_weathering",
    "raw_text": "captures 800kg CO2 per hectare annually"
  }},
  {{
    "metric": "subsidy_dependency",
    "value": 25,
    "unit": "percent_revenue",
    "technology": "solar_pv",
    "raw_text": "25% state pilot grant"
  }}
]"""