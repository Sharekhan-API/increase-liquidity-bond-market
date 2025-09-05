# 📊 Fractional Bond Pricing API

A Flask-based API that calculates **fractional bond prices**, expected yields, and buyer interest projections.  
The system supports **different bond ratings (High-rated vs Low-rated)** and provides pricing logic based on **present value (PV) models** and **implied yield calculations**.

---

## 🚀 Features
- Compute **present value (PV) pricing** for bonds.
- Estimate **implied yield** based on market price.
- Support for **fractional bond trading**. (default: 100 fractions per bond)
- **Buyer interest projections** for 1-year, 3-year, and 5-year horizons.
- Separate handling of **high-rated** and **low-rated** bonds.
- Flask-based REST API with JSON responses.

---

## 📦 Installation & Setup

```bash
# Clone repository
git clone https://github.com/your-username/fractional-bond-pricing.git
cd fractional-bond-pricing

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

# Install dependencies
pip install flask

 POST /price_bond
Request Body (JSON):
{
  "bond_name": "Beta Power",
  "face_value": 1000,
  "coupon_rate": 0.0945,
  "rating": "B",
  "purchase_amount": 10000,
  "maturity_years": 1
}
Example Response:
{
  "bond_name": "Beta Power",
  "rating": "B",
  "maturity_years": 1,
  "fraction_price": 1020.0,
  "seller_total": 102000.0,
  "buyer_expected_yield_%": 9.21,
  "buyer_interest_projection": {
    "1_year": { "absolute_interest": 94.5, "return_pct_of_cost": 9.21 },
    "3_year": { "absolute_interest": 283.5, "return_pct_of_cost": 27.63 },
    "5_year": { "absolute_interest": 472.5, "return_pct_of_cost": 46.05 }
  },
  "pricing_mode": "pv_forward",
  "used_yield": null
}