# OLI

AI-powered climate investment audit platform that verifies project claims against real scientific benchmarks before capital is deployed.

**Live app:** https://oli-eta.vercel.app

---

## What it does

OLI replaces the slow, expensive manual due diligence process that climate investors currently rely on (₹40–80 lakhs and 3–6 months per project) with an evidence-grounded audit engine that runs in minutes.

Two core features:

**Audit Engine** — Submit a plain-text project description. OLI extracts every verifiable claim, retrieves matching scientific benchmarks (CO₂ sequestration ranges, TRL definitions, subsidy data), runs deterministic rule-based validation against those benchmarks, then produces a scored audit report across 5 dimensions — Tech Readiness, Impact Authenticity, Greenwash Risk, Policy Dependency, and Scalability — with cited, severity-ranked red flags and an investor-match recommendation.

**PortfolioShield** — Stress-test an entire investment shortlist at once. Runs a Monte Carlo simulation (1,000 trials per project) across three macro scenarios — subsidy removal, carbon credit price drop, supply chain disruption — quantifying exactly how much revenue each project retains, and surfaces portfolio-level concentration risk before capital is committed.

## Why this is different

Most platforms (Crunchbase, Tracxn) just list startups. Sylvera only rates carbon credits after they're issued. Manual consultants are accurate but slow and expensive. OLI is the only system that verifies pre-investment claims against real scientific data *and* quantifies portfolio-level risk — at a cost and speed accessible to any fund, not just large institutions.

## Architecture

A 4-layer verification pipeline, not a single LLM call:

1. **Claim Extraction** — LLM (Groq, Llama 3.3 70B) parses unstructured project text into structured claims (metric, value, unit, technology)
2. **RAG Retrieval** — Claims are embedded and matched against a Supabase/pgvector store of real scientific and policy benchmarks (peer-reviewed CO₂ ranges, IPCC data, Indian subsidy schemes)
3. **Deterministic Validation** — Rule-based Python logic compares claimed values against retrieved benchmark min/max — no LLM guessing, mathematically grounded red flags
4. **Grounded Scoring** — A final LLM call scores the project using the retrieved benchmarks and deterministic flags as ground truth, rather than reasoning from general knowledge alone

PortfolioShield runs its scenario analysis as an actual NumPy Monte Carlo simulation rather than an AI guess, producing quantified revenue-retention percentages per scenario per project.

## Tech stack

**Backend:** Python, FastAPI, Groq (Llama 3.3 70B), Supabase (Postgres + pgvector), sentence-transformers, NumPy
**Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts
**Deployment:** Render (backend), Vercel (frontend)

## Project structure

```
oli/
├── backend/
│   ├── main.py                    
│   ├── routes/                    # audit.py, portfolio.py
│   ├── pipeline/                  # claim_extractor, validation_engine, scoring, revenue_extractor
│   ├── rag/                       # benchmarks.json, ingest.py, retriever.py
│   ├── simulation/                # portfolio_sim.py (Monte Carlo)
│   └── prompts/
└── frontend/
    └── src/
        ├── api/client.ts
        ├── pages/                 # Dashboard, AuditProject, AuditReport, PortfolioShield
        └── components/
```

## Running locally

**Backend**
```bash
cd backend
pip install -r requirements.txt
# add .env with GROQ_API_KEY, SUPABASE_URL, SUPABASE_KEY
python rag/ingest.py   # populate benchmark vector store, run once
uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Background

OLI began as ClimateIQ, then rebuilt with a RAG-based verification pipeline, deterministic claim validation, and quantitative Monte Carlo portfolio risk modeling.

