# RESOURCE_MANAGEMENT.md

## Resource Catalog
- **Compute** – VM instances, containers, serverless functions used by AEDW.
- **Data** – Datasets in BigQuery, data lakes, feature stores.
- **Human** – Personnel roles defined in `WORKFORCE_MANAGEMENT.md`.
- **Licensing** – Software licences and third‑party services.

## Allocation Policies
- **Capacity Planning** – Forecast based on workload forecasts from `WORKLOAD_MANAGEMENT.md`.
- **Cost Governance** – Budget limits enforced via `GOVERNANCE_INTEGRATION.md`.
- **Priority Queues** – Critical business tasks receive higher resource priority.

## Monitoring & Auditing
- Resource usage metrics are collected via existing monitoring agents (Phase 34 `PERFORMANCE_MONITORING.md`).
- Audits align with ADF v3.1 security & compliance guidelines.
