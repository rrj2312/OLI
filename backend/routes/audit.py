from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pipeline.claim_extractor import extract_claims
from rag.retriever import retrieve_benchmarks
from pipeline.validation_engine import validate_claims
from pipeline.scoring import generate_score

router = APIRouter()

class AuditRequest(BaseModel):
    projectText: str

@router.post("/")
async def run_audit(req: AuditRequest):
    if len(req.projectText.strip()) < 50:
        raise HTTPException(status_code=400, detail="Project description too short.")

    try:
        claims = extract_claims(req.projectText)
        benchmarks = retrieve_benchmarks(claims) if claims else []
        deterministic_flags = validate_claims(benchmarks) if benchmarks else []
        result = generate_score(req.projectText, benchmarks, deterministic_flags)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audit failed: {str(e)}")