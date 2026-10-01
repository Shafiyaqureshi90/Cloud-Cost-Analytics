# ☁️ Cloud Cost Analytics Dashboard

Multi-cloud (AWS, Azure, GCP) cost analytics for 2023, built two ways: a **Power BI report** and a **lightweight web dashboard** using HTML, CSS, JavaScript, and Chart.js.

🔗 **[Live Dashboard](https://cloud-cost-analytics.vercel.app/)**

![Dashboard](images/dashboard.png)

---

## 📌 Problem Statement

Cloud billing data can be difficult to understand because spending is distributed across multiple providers, services, regions, environments, and projects.

This project analyzes ~55K daily billing records to answer:

- Where is cloud spending concentrated?
- Which providers, services, regions, and projects drive costs?
- How does spending compare with a budget baseline?
- How much is saved through reserved instances, savings plans, and spot usage?
- Which records show unusual cost behavior?

---

## ⚙️ How I Solved It

- Processed and aggregated cloud billing data using **Python and Pandas**
- Built a **star-schema data model** in Power BI
- Created **DAX measures** for cost, savings, budget utilization, and growth
- Developed interactive Power BI dashboards for cost and budget analysis
- Built a lightweight web dashboard using **JavaScript and Chart.js**
- Deployed the web dashboard using **Vercel**

---

## ✨ Features

### Web Dashboard

- KPI cards: Net Cost, Savings, Derived Budget, Budget Utilization, Months Over Budget, High-Risk Days
- Monthly cost vs. budget trend
- Cost by cloud provider, environment, service, and region
- Provider and environment filters
- Month-range filtering
- Searchable and sortable project table
- CSV export
- Dark / light theme

### Power BI Report

- Executive Summary
- Cost Analysis
- Budget Monitoring
- Star-schema data model
- DAX measures for cost, savings, budget utilization, and MoM growth

---

## 🔑 Key Insights

- **Total Net Cost:** ~$408K
- **AWS:** ~$143K
- **Azure:** ~$134K
- **GCP:** ~$130K
- **Production:** ~78% of total spend
- **Analytics:** ~$77K
- **Compute:** ~$72K
- **Total Savings:** ~$53.6K
- **High-risk records:** 422 based on anomaly score > 0.6
- Spending increases toward **November and December**

---

## 🗂️ Dataset

Synthetic 2023 cloud billing data at daily granularity.

| File | Description | Rows |
|---|---|---:|
| `dataset/cloud_budget_2023_dataset.csv` | Main fact table | 54,750 |
| `dataset/cloud_budget_2023_dataset_daily_account_summary.csv` | Daily account summary | 360 |
| `dataset/cloud_budget_2023_dataset_monthly_account_summary.csv` | Monthly account summary | 360 |

**Scope:** 3 providers · 10 accounts · 15 projects · 6 regions · 7 services · 3 environments

**Currency:** USD

---

## 🧮 Methodology

- **Derived Budget:** The source `budget_amount` is recorded at the daily/account level and produces an inflated aggregate when summed directly. Therefore, the dashboard uses a monitoring baseline based on **average monthly cost + 5%**.
- **High-Risk Records:** Records with `anomaly_score > 0.6` are treated as high-risk because the source `is_anomaly` flag is 0 for all rows.
- **Savings:** Calculated using `reserved_savings + savings_plan_savings + spot_savings`.

### Key DAX Measures

```DAX
Total Net Cost =
SUM(Fact_CloudCost[net_cost])

Avg Monthly Cost =
CALCULATE(
    AVERAGEX(
        VALUES(Dim_Date[Month]),
        [Total Net Cost]
    ),
    ALL(Dim_Date)
)

Derived Budget =
[Avg Monthly Cost] * 1.05 * DISTINCTCOUNT(Dim_Date[Month])

Derived Utilization % =
DIVIDE(
    [Total Net Cost],
    [Derived Budget]
)
