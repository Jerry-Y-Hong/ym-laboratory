# 08_WORKFLOW_AUDIT_SYSTEM.md

## Phase 32 – AI Autonomous Workflow Intelligence System (AAWIS)

### Audit System Overview

- **Immutable Log Store**: All workflow events are persisted to an append‑only, cryptographically‑signed JSONL store located at `audit/logs/` within the `AAWIS/` directory.
- **Log Format**: Each line consists of a JSON object with the following fields:
  - `timestamp` (ISO‑8601 UTC)
  - `event_id` (UUID v4)
  - `workflow_id`
  - `task_id`
  - `event_type` (START, COMPLETE, FAIL, RETRY, HUMAN_INTERVENTION)
  - `payload` (arbitrary JSON payload specific to the event)
  - `signature` (SHA‑256 HMAC using the system master key)
- **Tamper‑Evidence**: Log files are sealed with Merkle‑tree roots published daily to a Trusted Timestamping service.
- **Query Interface**: A lightweight CLI `audit-query` allows operators to filter logs by `workflow_id`, `task_id`, or time range and to verify signatures on‑the‑fly.
- **Retention Policy**: Logs are retained for **5 years** in compliance with YM‑LAB governance; archived logs are moved to cold‑storage (GCS bucket with Object‑Versioning enabled).
- **Access Control**: Only the **Project Owner** and designated **Compliance Auditors** may read audit logs; AI agents have **write‑only** permission.

> **Note**: This audit system fulfills the ADF v3.1 **Traceability & Accountability** requirements for all Phase 32 deliverables.
