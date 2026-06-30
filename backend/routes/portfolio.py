from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from pipeline.revenue_extractor import extract_revenue_model
from simulation.portfolio_sim import run_monte_carlo, detect_concentration_risk, generate_recommendation

router = APIRouter()

class ProjectInput(BaseModel):
    name: str
    summary: str

class PortfolioRequest(BaseModel):
    projects: List[ProjectInput]

@router.post("/shield")
async def run_portfolio_shield(req: PortfolioRequest):
    if len(req.projects) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 projects.")

    try:
        # Step 1 — extract revenue model per project via LLM
        enriched_projects = []
        for p in req.projects:
            revenue_model = extract_revenue_model(p.name, p.summary)
            enriched_projects.append({
                "name": p.name,
                "revenue_model": revenue_model,
            })

        # Step 2 — run deterministic Monte Carlo simulation
        simulation_results = run_monte_carlo(enriched_projects)

        # Step 3 — detect concentration risk + recommendation (rule-based, not AI)
        risks = detect_concentration_risk(enriched_projects, simulation_results)
        recommendation = generate_recommendation(enriched_projects, simulation_results, risks)

        # Format to match frontend's expected shape
        scenarios = {
            "A": {"label": "Subsidy Removed", "results": {}},
            "B": {"label": "Carbon Price -40%", "results": {}},
            "C": {"label": "Supply Chain Disruption", "results": {}},
        }
        for name, res in simulation_results.items():
            scenarios["A"]["results"][name] = res["A"]["survives"]
            scenarios["B"]["results"][name] = res["B"]["survives"]
            scenarios["C"]["results"][name] = res["C"]["survives"]

        return {
            "scenarios": scenarios,
            "detailed_results": simulation_results,  # includes mean_revenue_retained etc for richer UI
            "concentration_risks": risks,
            "recommendation": recommendation,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Portfolio analysis failed: {str(e)}")