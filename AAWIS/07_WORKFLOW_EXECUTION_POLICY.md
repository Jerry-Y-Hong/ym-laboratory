# 07_WORKFLOW_EXECUTION_POLICY.md

## Phase 32 – AI Autonomous Workflow Intelligence System (AAWIS)

### Execution Policy Overview

- **Scheduling**: Workflows are scheduled via a cron‑like service with timezone awareness. Default SLA is **24 h** for end‑to‑end execution.
- **Retry Strategy**: Exponential back‑off with jitter, up to **5** attempts for transient failures. Fatal errors trigger a **human‑in‑the‑loop** escalation.
- **Concurrency Limits**: Maximum **50** parallel task executions per workflow instance to prevent resource exhaustion.
- **Resource Quotas**: CPU and memory limits are defined per task in the `workflow_config.yaml` (see [09_WORKFLOW_CONFIGURATION_STANDARD.md](file:///g:/%EB%82%B4%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C/YM-LAB_PROJECT_/AAWIS/09_WORKFLOW_CONFIGURATION_STANDARD.md)).
- **Graceful Shutdown**: On shutdown signals, in‑flight tasks receive a **5‑minute** grace period to finish, after which they are cancelled and marked as `Interrupted`.
- **Compliance**: All execution decisions are logged and auditable per [08_WORKFLOW_AUDIT_SYSTEM.md](file:///g:/%EB%82%B4%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8B/YM-LAB_PROJECT_/AAWIS/08_WORKFLOW_AUDIT_SYSTEM.md)).

> **Note**: This policy aligns with **ADF v3.1 Governance – Execution Management** standards.
