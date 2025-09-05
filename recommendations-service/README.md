# 📈 Portfolio Risk Scoring & Bond Recommendation API

This Flask-based API evaluates a portfolio of assets, assigns a **risk score (0–100)**,  
and suggests **bond replacements** for risky or underperforming holdings.  

It works with **stocks, mutual funds, and bank FDs**, and uses a small demo **bond universe**  
to recommend safer or yield-enhancing alternatives.

---

## 🚀 Features
- Accepts a **custom portfolio** or falls back to a **demo portfolio**.
- Calculates:
  - Portfolio **risk score** (0–100, higher = riskier).
  - **Per-asset risk breakdown** with allocations.
- Generates **bond replacement recommendations**:
  - Replace **high-risk stocks** with high-yield bonds.
  - Replace **low-CAGR mutual funds** with better bonds.
  - Replace **bank FDs** with safer or laddered bond options.
- Simulates a **post-rebalance portfolio** and its updated risk score.

---

## 📦 Installation & Setup

```bash
# Clone repository
git clone https://github.com/your-username/portfolio-risk-bond-recommender.git
cd portfolio-risk-bond-recommender

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

# Install dependencies
pip install flask numpy

>Portfolio Risk Scoring
API: POST /score

Request Body Example:
{
  "assets": [
    { "asset_id": "S1", "type": "stock", "name": "TechCorp", "risk_label": "high", "market_value": 50000 },
    { "asset_id": "MF1", "type": "mutual_fund", "name": "Growth MF", "risk_label": "medium", "market_value": 20000, "cagr": 0.12 },
    { "asset_id": "FD1", "type": "bank_fd", "name": "Bank FD", "risk_label": "low", "market_value": 30000, "fd_rate": 0.07 }
  ]
}

Example Response:
{
  "total_value": 100000,
  "overall_risk_score": 61.25,
  "breakdown": [
    {
      "asset_id": "S1",
      "type": "stock",
      "market_value": 50000.0,
      "alloc_pct": 0.5,
      "risk_score_raw": 1.0,
      "risk_contribution": 0.5
    },
    {
      "asset_id": "MF1",
      "type": "mutual_fund",
      "market_value": 20000.0,
      "alloc_pct": 0.2,
      "risk_score_raw": 0.5,
      "risk_contribution": 0.1
    },
    {
      "asset_id": "FD1",
      "type": "bank_fd",
      "market_value": 30000.0,
      "alloc_pct": 0.3,
      "risk_score_raw": 0.05,
      "risk_contribution": 0.015
    }
  ]
}


---------
Bond Recommendations
API: POST /recommend

Request Body Example:
{ "assets": [] }


(If empty, a demo portfolio will be used)

Example Response:
{
  "pre_rebalance": {
    "total_value": 120000,
    "overall_risk_score": 64.33
  },
  "recommendations": [
    {
      "asset_id": "S_HIGH",
      "asset_name": "AlphaTech",
      "replace_value": 40000.0,
      "reason": "stock_high",
      "recommended_bond": "B_HY_1",
      "bond_name": "HighYield 4Y",
      "bond_yield": 0.1,
      "bond_credit": "BB"
    },
    {
      "asset_id": "MF_LOW",
      "asset_name": "ValueCore MF",
      "replace_value": 5000.0,
      "reason": "mf_lowcagr",
      "recommended_bond": "B_MED_1",
      "bond_name": "Corp BBB 5Y",
      "bond_yield": 0.075,
      "bond_credit": "BBB"
    }
  ],
  "post_rebalance": {
    "total_value": 120000.0,
    "overall_risk_score": 42.12,
    "breakdown": [
      { "asset_id": "S_MED", "type": "stock", "market_value": 30000.0, ... },
      { "asset_id": "S_LOW", "type": "stock", "market_value": 15000.0, ... },
      { "asset_id": "B_HY_1", "type": "bond", "name": "HighYield 4Y", "market_value": 40000.0 },
      { "asset_id": "B_MED_1", "type": "bond", "name": "Corp BBB 5Y", "market_value": 5000.0 },
      { "asset_id": "FD_1", "type": "bank_fd", "market_value": 20000.0, ... }
    ]
  }
  }