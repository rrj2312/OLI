from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import audit, portfolio

load_dotenv()

app = FastAPI(title="OLI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit.router, prefix="/api/audit")
app.include_router(portfolio.router, prefix="/api/portfolio")

@app.get("/health")
def health():
    return {"status": "ok", "service": "OLI"}