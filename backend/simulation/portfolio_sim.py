import numpy as np

def run_monte_carlo(projects: list, n_simulations: int = 1000) -> dict:
    """
    Each project dict expects:
    {
        "name": str,
        "revenue_model": {
            "carbon_credits": float (0-1),
            "subsidies": float (0-1)
            # remainder is treated as direct/operational revenue
        }
    }
    """
    results = {}

    for project in projects:
        name = project["name"]
        revenue_model = project.get("revenue_model", {})

        carbon_credit_pct = revenue_model.get("carbon_credits", 0)
        subsidy_pct = revenue_model.get("subsidies", 0)
        direct_revenue_pct = max(0, 1 - carbon_credit_pct - subsidy_pct)

        scenario_results = {
            "A_subsidy_removed": [],
            "B_carbon_price_drop": [],
            "C_supply_chain": [],
        }

        for _ in range(n_simulations):
            base_revenue = 100  # normalized to 100%

            # Scenario A — subsidy removed entirely, some noise on how much is truly lost
            subsidy_loss = np.random.uniform(0.9, 1.0)  # 90-100% of subsidy revenue lost
            revenue_a = base_revenue * (
                direct_revenue_pct + carbon_credit_pct + subsidy_pct * (1 - subsidy_loss)
            )
            scenario_results["A_subsidy_removed"].append(revenue_a)

            # Scenario B — carbon credit price drops 40%, with variance around that shock
            carbon_shock = np.random.normal(0.6, 0.07)
            carbon_shock = np.clip(carbon_shock, 0.3, 0.9)
            revenue_b = base_revenue * (
                direct_revenue_pct + carbon_credit_pct * carbon_shock + subsidy_pct
            )
            scenario_results["B_carbon_price_drop"].append(revenue_b)

            # Scenario C — supply chain disruption raises costs, modeled as effective revenue compression
            cost_shock = np.random.uniform(1.3, 1.6)
            revenue_c = base_revenue / cost_shock
            scenario_results["C_supply_chain"].append(revenue_c)

        def summarize(arr):
            return {
                "mean_revenue_retained": round(float(np.mean(arr)), 1),
                "p10_revenue_retained": round(float(np.percentile(arr, 10)), 1),
                "p90_revenue_retained": round(float(np.percentile(arr, 90)), 1),
                "survives": bool(np.mean(arr) > 60),
            }

        results[name] = {
            "A": summarize(scenario_results["A_subsidy_removed"]),
            "B": summarize(scenario_results["B_carbon_price_drop"]),
            "C": summarize(scenario_results["C_supply_chain"]),
        }

    return results


def detect_concentration_risk(projects: list, simulation_results: dict) -> list:
    risks = []
    n = len(projects)

    for scenario_key, scenario_label in [
        ("A", "subsidy removal"),
        ("B", "carbon credit price drop"),
        ("C", "supply chain disruption"),
    ]:
        failing = [
            name for name, res in simulation_results.items()
            if not res[scenario_key]["survives"]
        ]
        if len(failing) >= max(2, n // 2 + 1) if n > 1 else len(failing) >= 1:
            pct = round(len(failing) / n * 100)
            risks.append(
                f"{len(failing)} of {n} projects ({pct}%) fail to retain viable revenue under {scenario_label} — portfolio is over-concentrated in this risk."
            )

    return risks


def generate_recommendation(projects: list, simulation_results: dict, risks: list) -> str:
    if not risks:
        return "Portfolio shows resilient revenue diversification across all three stress scenarios. No immediate rebalancing required."

    # Find the weakest project across all scenarios (lowest average mean retained)
    weakest_name = None
    weakest_avg = 101
    for name, res in simulation_results.items():
        avg = (res["A"]["mean_revenue_retained"] + res["B"]["mean_revenue_retained"] + res["C"]["mean_revenue_retained"]) / 3
        if avg < weakest_avg:
            weakest_avg = avg
            weakest_name = name

    return (
        f"{weakest_name} shows the weakest resilience across stress scenarios, retaining an average of "
        f"{round(weakest_avg, 1)}% of revenue. Consider reducing allocation or requiring revenue diversification "
        f"(e.g. less reliance on carbon credits or subsidies) before increasing exposure to this project."
    )