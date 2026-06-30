const BASE = "http://localhost:8000/api";

export async function submitAudit(projectText) {
  const res = await fetch(`${BASE}/audit/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectText }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Audit failed");
  }
  return res.json();
}

export async function submitPortfolioShield(projects) {
  // projects: [{ name, summary }]
  const res = await fetch(`${BASE}/portfolio/shield`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projects }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Portfolio analysis failed");
  }
  return res.json();
}