# ☁️ Cloud Infrastructure Cost & Performance Analytics

An interactive **Power BI** dashboard that analyzes multi-cloud (AWS, Azure, GCP) spend for 2023 — tracking cost drivers, budget adherence, savings, and cost anomalies across providers, services, regions, departments, and environments.

---

## 📌 Project Overview

Cloud bills are hard to read and easy to overspend on. This project turns ~55K daily cloud billing records into a 3-page dashboard that helps answer:

- Where is cloud money going (provider, service, region, environment)?
- How does actual spend compare with budget?
- How much are discounts and savings plans saving?
- Which days/accounts show unusual cost behavior?

## 📊 Dashboard Pages

| Page | What it shows |
|---|---|
| **Executive Summary** | KPIs (Net Cost, Budget, Savings, Utilization %, Anomalies), spend trend, cost by provider / environment / service / region, key insights |
| **Cost Analysis** | Monthly spend trend, cost by project, drill-down table (project → account → provider → service → region), provider comparison |
| **Budget Monitoring** | Budget vs actual (monthly), budget utilization trend, budget status breakdown, detailed budget table |

**Interactive filters:** Date Range, Cloud Provider, Department, Environment / Region, and a Reset Filters button. Sidebar navigation between pages.

### Screenshots

| Executive Summary | Cost Analysis | Budget Monitoring |
|---|---|---|
| ![Executive Summary](Page_1.png) | ![Cost Analysis](Page_2.png) | ![Budget Monitoring](Page_3.png) |

## 🔑 Key Insights

- **Total net cost: ~408K** across all providers for 2023
- **Spend is evenly split:** AWS (~143K), Azure (~134K), GCP (~130K)
- **Analytics and Compute** are the highest-cost services
- **Production** accounts for the majority of spend
- **556 cost anomalies** flagged for monitoring
- **Total savings: ~53.6K** from discounts, reserved instances, and savings plans
- Spend trends upward toward the end of the year (Oct–Dec)

## 🗂️ Dataset

Synthetic 2023 cloud billing data (daily granularity).

| File | Description | Rows |
|---|---|---|
| `cloud_budget_2023_dataset.csv` | Detailed daily records (main fact table) | 54,750 |
| `cloud_budget_2023_dataset_daily_account_summary.csv` | Aggregated by account & environment | 360 |
| `cloud_budget_2023_dataset_monthly_account_summary.csv` | Monthly aggregation by account & environment | 360 |

**Main table (40 columns), grouped:**

- **Dimensions:** date, cloud_provider, account_id, project_id, environment, business_unit, department, cost_center, region, service, resource_type
- **Cost metrics:** list_cost, discount_amount, net_cost, on_demand_cost, amortized_cost, forecast_monthly_cost
- **Savings:** reserved_savings, savings_plan_savings, spot_savings, discount_rate_pct, coverage percentages
- **Budget:** budget_amount, budget_utilization_pct, budget_status
- **Anomaly / variance:** cost_variance_7d_pct, cost_variance_30d_pct, anomaly_score, is_anomaly

**Scope:** 3 providers · 10 accounts · 15 projects · 6 regions · 7 services · 3 environments (prod, staging, dev)

## 🧮 Key Measures (DAX)

Core measures used in the dashboard:

```DAX
Total Net Cost = SUM(cloud_budget_2023_dataset[net_cost])
Total Budget = SUM(cloud_budget_2023_dataset[budget_amount])
Total Savings = SUM(cloud_budget_2023_dataset[discount_amount])
Budget Utilization % = DIVIDE([Total Net Cost], [Total Budget])
Budget Variance = [Total Budget] - [Total Net Cost]
Total Anomalies = SUM(cloud_budget_2023_dataset[is_anomaly])
```

> Adjust the measure definitions to match those in `Dashboard.pbix`.

## 🛠️ Tools & Skills

- **Power BI Desktop** — data modeling, DAX, interactive visuals, page navigation, slicers
- **Power Query** — data cleaning and transformation
- **DAX** — KPI and budget measures
- Data storytelling, cost analytics, FinOps concepts

## 📁 Repository Structure

```
├── Dashboard.pbix                                         # Power BI report
├── cloud_budget_2023_dataset.csv                          # Main dataset
├── cloud_budget_2023_dataset_daily_account_summary.csv
├── cloud_budget_2023_dataset_monthly_account_summary.csv
├── Page_1.png                                             # Executive Summary
├── Page_2.png                                             # Cost Analysis
├── Page_3.png                                             # Budget Monitoring
└── README.md
```

## 🚀 How to Run

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   ```
2. Open `Dashboard.pbix` in **Power BI Desktop**.
3. If prompted, update the data source path: **Home → Transform data → Data source settings** → point to the CSV files in the cloned folder.
4. Click **Refresh** and explore using the slicers.

## ⚠️ Known Limitations & Next Steps

- **Budget Utilization shows ~0.02%** because `budget_amount` in the source appears to be a monthly/account-level budget repeated on every daily row, so summing it inflates the total budget (~1.96bn vs ~408K cost). Fix: use the monthly summary table for budget, or de-duplicate budgets by account/month before aggregating.
- **Currency:** the dataset is in USD, but the dashboard displays ₹. Update the number format if USD is intended.
- Planned improvements: anomaly drill-down page, forecast vs actual comparison, savings-plan / reserved-instance coverage analysis.

## 👤 Author

**Md Shafiya Begum**
Data Science student | Aspiring Data Analyst
🔗 [LinkedIn](https://www.linkedin.com/in/your-profile) · 💻 [GitHub](https://github.com/your-username)

---

⭐ If you found this useful, consider starring the repo!
