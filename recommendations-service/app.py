"""
Flask-based Portfolio Risk Assessment and Bond Recommendation API
----------------------------------------------------------------
This service provides:
1. Portfolio risk scoring (per-asset breakdown + overall score).
2. Bond replacement recommendations for high-risk or low-performing assets.
3. Simulated post-rebalance portfolio with updated risk score.

Endpoints:
    - /score (POST): Returns portfolio risk score and per-asset breakdown.
    - /recommend (POST): Returns bond recommendations and post-rebalance simulation.
    - /health (GET): Basic health check.
"""

import numpy as np
from flask import Flask, jsonify, request

# Initialize Flask app
app = Flask(__name__)

# ==========================
# Bond Universe (Demo Data)
# ==========================
BOND_UNIVERSE = [
    {"bond_id": "B_SAFE_1", "name": "Gilt 3Y", "credit": "AAA", "yield": 0.055, "duration": 3, "liquidity": 0.95},
    {"bond_id": "B_SAFE_2", "name": "InvGrade Corp 3Y", "credit": "AA", "yield": 0.06, "duration": 3, "liquidity": 0.9},
    {"bond_id": "B_MED_1", "name": "Corp BBB 5Y", "credit": "BBB", "yield": 0.075, "duration": 5, "liquidity": 0.7},
    {"bond_id": "B_HY_1", "name": "HighYield 4Y", "credit": "BB", "yield": 0.10, "duration": 4, "liquidity": 0.5},
    {"bond_id": "B_SHORT_SAFE", "name": "T-Bill 1Y", "credit": "AAA", "yield": 0.045, "duration": 1, "liquidity": 0.98},
]

# Credit risk lookup (lower = safer)
CREDIT_RISK_MAP = {"AAA": 0.0, "AA": 0.1, "A": 0.25, "BBB": 0.5, "BB": 0.8, "B": 0.95}

# Risk label mapping (0 safest - 1 riskiest)
RISK_MAP = {"high": 1.0, "medium-high": 0.75, "medium": 0.5, "low": 0.2}


# ==========================
# Portfolio Helpers
# ==========================
def safe_get_portfolio_from_request(req_json):
    """
    Parse portfolio JSON payload.
    If not provided, fallback to demo portfolio.
    """
    if not req_json or "assets" not in req_json or not req_json["assets"]:
        return demo_portfolio()
    return req_json["assets"]


def demo_portfolio():
    """
    Default demo portfolio (stocks, mutual funds, FD).
    """
    return [
        {"asset_id": "S_HIGH", "type": "stock", "name": "AlphaTech", "risk_label": "high", "market_value": 40000, "expected_return": 0.20},
        {"asset_id": "S_MED", "type": "stock", "name": "BetaIndustries", "risk_label": "medium", "market_value": 30000, "expected_return": 0.12},
        {"asset_id": "S_LOW", "type": "stock", "name": "GammaStable", "risk_label": "low", "market_value": 15000, "expected_return": 0.06},
        {"asset_id": "MF_GOOD", "type": "mutual_fund", "name": "GrowthPlus MF", "risk_label": "medium", "market_value": 10000, "cagr": 0.15},
        {"asset_id": "MF_LOW", "type": "mutual_fund", "name": "ValueCore MF", "risk_label": "medium-high", "market_value": 5000, "cagr": 0.03},
        {"asset_id": "FD_1", "type": "bank_fd", "name": "BankFD (7% p.a.)", "risk_label": "low", "market_value": 20000, "fd_rate": 0.07},
    ]


def get_asset_risk_score(asset):
    """
    Assign risk score to asset based on type and risk label.
    """
    base = RISK_MAP.get(asset.get("risk_label"), 0.5)
    asset_type = asset.get("type", "other")

    if asset_type == "stock":
        base = min(1.0, base + 0.1)  # stocks slightly riskier
    if asset_type == "bank_fd":
        base = 0.05  # FD is very safe

    return float(base)


def compute_portfolio_risk(assets):
    """
    Compute weighted portfolio risk score (0-100).
    Returns: (overall_score, breakdown_details, total_value)
    """
    total_value = sum([float(a.get("market_value", 0.0)) for a in assets]) or 1.0
    breakdown = []
    weighted_sum = 0.0

    for a in assets:
        mv = float(a.get("market_value", 0.0))
        alloc = mv / total_value
        score = get_asset_risk_score(a)
        contrib = alloc * score

        breakdown.append({
            "asset_id": a.get("asset_id"),
            "type": a.get("type"),
            "market_value": mv,
            "alloc_pct": alloc,
            "risk_score_raw": score,
            "risk_contribution": contrib
        })

        weighted_sum += contrib

    return weighted_sum * 100.0, breakdown, total_value


# ==========================
# Bond Recommendation Logic
# ==========================
def select_bond_candidate(bond_universe, desired_safety="medium", prefer_yield=False, target_duration=3.0):
    """
    Select best-fit bond from universe using heuristic utility scoring.
    """
    # Filter bonds by credit quality
    if desired_safety == "safe":
        allowed = {"AAA", "AA", "A"}
        df = [b for b in bond_universe if b["credit"] in allowed]
    elif desired_safety == "medium":
        allowed = {"AAA", "AA", "A", "BBB"}
        df = [b for b in bond_universe if b["credit"] in allowed]
    else:
        df = bond_universe.copy()

    if not df:
        df = bond_universe.copy()  # fallback

    yds = [b["yield"] for b in df]
    y_min, y_max = min(yds), max(yds)

    candidate_scores = []
    for b in df:
        # Normalize yield score
        norm_yield = (b["yield"] - y_min) / ((y_max - y_min) + 1e-9)
        duration_penalty = abs(b["duration"] - target_duration) / 10.0

        # Weights tuning
        if prefer_yield:
            w_yield, w_credit, w_dur, w_liq = (0.5, 0.4, 0.05, 0.05)
        else:
            w_yield, w_credit, w_dur, w_liq = (0.35, 0.45, 0.1, 0.1)

        credit_risk = CREDIT_RISK_MAP.get(b["credit"], 0.6)
        utility = (
            w_yield * norm_yield
            - w_credit * credit_risk
            - w_dur * duration_penalty
            + w_liq * b.get("liquidity", 0.5)
        )
        candidate_scores.append((utility, b))

    candidate_scores.sort(key=lambda x: x[0], reverse=True)
    return candidate_scores[0][1]


def build_recommendations(assets, bond_universe):
    """
    Generate bond replacement recommendations based on asset rules:
      - High/med-high risk stocks → high yield bonds
      - Low CAGR mutual funds → medium safe bonds
      - Bank FD → safe bond (if yield better)
      - Otherwise FD ladder strategy
    """
    recs = []
    to_replace = []

    # Identify replace candidates
    for a in assets:
        t = a.get("type")

        if t == "stock" and a.get("risk_label") in ["high", "medium-high"]:
            to_replace.append((a["asset_id"], float(a.get("market_value", 0.0)), "stock_high"))

        if t == "mutual_fund" and float(a.get("cagr", 0.0)) < 0.06:
            to_replace.append((a["asset_id"], float(a.get("market_value", 0.0)), "mf_lowcagr"))

        if t == "bank_fd":
            fd_rate = float(a.get("fd_rate", 0.0))
            safe_bonds = [b for b in bond_universe if b["credit"] in ("AAA", "AA")]
            better = [b for b in safe_bonds if b["yield"] >= fd_rate]

            if better:
                to_replace.append((a["asset_id"], float(a.get("market_value", 0.0)), "fd_replace"))
            else:
                to_replace.append((a["asset_id"], float(a.get("market_value", 0.0)), "fd_suggest_ladder"))

    # Build recommendations
    for asset_id, value, reason in to_replace:
        asset = next((x for x in assets if x["asset_id"] == asset_id), None)
        if not asset:
            continue

        if reason == "stock_high":
            bond = select_bond_candidate(bond_universe, desired_safety="high_yield", prefer_yield=True)
        elif reason == "mf_lowcagr":
            bond = select_bond_candidate(bond_universe, desired_safety="medium", prefer_yield=False)
        elif reason == "fd_replace":
            bond = select_bond_candidate(bond_universe, desired_safety="safe", prefer_yield=True)
        elif reason == "fd_suggest_ladder":
            short = next((b for b in bond_universe if b["bond_id"] == "B_SHORT_SAFE"), None)
            safe = select_bond_candidate(bond_universe, desired_safety="safe", prefer_yield=False)
            recs.append({
                "asset_id": asset_id,
                "asset_name": asset.get("name"),
                "replace_value": value,
                "reason": reason,
                "recommended_bond": f"{short['bond_id']} (50%) + {safe['bond_id']} (50%)",
                "bond_name": f"{short['name']} + {safe['name']}",
                "bond_yield": f"{short['yield']:.3f} & {safe['yield']:.3f}",
                "bond_credit": f"{short['credit']} & {safe['credit']}"
            })
            continue

        recs.append({
            "asset_id": asset_id,
            "asset_name": asset.get("name"),
            "replace_value": value,
            "reason": reason,
            "recommended_bond": bond["bond_id"],
            "bond_name": bond["name"],
            "bond_yield": bond["yield"],
            "bond_credit": bond["credit"],
        })

    return recs


# ==========================
# Flask API Endpoints
# ==========================
@app.route("/score", methods=["POST"])
def score_portfolio():
    """
    POST JSON body: { "assets": [ {asset fields...}, ... ] }
    Response:
        {
            "total_value": float,
            "overall_risk_score": float,  # 0-100
            "breakdown": [ per-asset details ]
        }
    """
    req_json = request.get_json(silent=True)
    assets = safe_get_portfolio_from_request(req_json)
    overall_score, details, total = compute_portfolio_risk(assets)

    return jsonify({
        "total_value": total,
        "overall_risk_score": round(overall_score, 4),
        "breakdown": details,
    })


@app.route("/recommend", methods=["POST"])
def recommend():
    """
    POST JSON body: { "assets": [ ... ] }
    Response:
        - Current portfolio risk
        - Bond replacement recommendations
        - Simulated post-rebalance portfolio
    """
    req_json = request.get_json(silent=True)
    assets = safe_get_portfolio_from_request(req_json)

    # Compute pre-rebalance risk
    pre_score, _, total_value = compute_portfolio_risk(assets)

    # Get recommendations
    recommendations = build_recommendations(assets, BOND_UNIVERSE)

    # Build post-rebalance portfolio
    post_assets = []
    replaced_ids = {r["asset_id"] for r in recommendations}

    # Keep non-replaced assets
    for a in assets:
        if a["asset_id"] not in replaced_ids:
            post_assets.append(dict(a))

    # Add bonds for replaced assets
    for r in recommendations:
        post_assets.append({
            "asset_id": r["recommended_bond"],
            "type": "bond",
            "name": r["bond_name"],
            "market_value": float(r["replace_value"]),
        })

    post_score, post_details, post_total = compute_portfolio_risk(post_assets)

    return jsonify({
        "pre_rebalance": {
            "total_value": total_value,
            "overall_risk_score": round(pre_score, 4),
        },
        "recommendations": recommendations,
        "post_rebalance": {
            "total_value": post_total,
            "overall_risk_score": round(post_score, 4),
            "breakdown": post_details,
        },
    })


@app.route("/health", methods=["GET"])
def health():
    """Basic health check."""
    return jsonify({"status": "ok"})


# ==========================
# Run App
# ==========================
if __name__ == "__main__":
    app.run(debug=True, port=5010)
