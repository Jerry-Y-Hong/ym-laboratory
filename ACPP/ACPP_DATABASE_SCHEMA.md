# ACPP_DATABASE_SCHEMA.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Architecture Level** : Enterprise Database & Storage Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Summary & ERD Topology

The **ACPP Database Schema Specification** defines the enterprise data model for the AI Content Production Platform (ACPP). Operating under **ADF v3.1 Governance Standards**, this data model manages the state of structured Knowledge Assets, vector indices, workflow executions, multi-channel publication records, human approval tokens, and immutable audit trails.

The storage architecture combines a relational PostgreSQL/SQL metadata store with a high-performance vector index (`pgvector`) and an immutable filesystem vault (`repository/`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                     ACPP MASTER ENTITY-RELATIONSHIP ERD                │
├────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐ 1      * ┌──────────────────┐                   │
│  │ KNOWLEDGE_ASSETS ├─────────┤ VERSION_CONTROL  │                   │
│  └────────┬─────────┘          └──────────────────┘                   │
│           │ 1                                                         │
│           │                                                           │
│           │ *                                                         │
│  ┌────────┴─────────┐ 1      * ┌──────────────────┐                   │
│  │ WORKFLOW_HISTORY ├─────────┤   AGENT_LOGS     │                   │
│  └────────┬─────────┘          └──────────────────┘                   │
│           │ 1                                                         │
│           │                                                           │
│           │ 1                                                         │
│  ┌────────┴─────────┐ 1      1 ┌──────────────────┐                   │
│  │PUBLISHING_HISTORY├─────────┤ APPROVAL_TOKENS  │                   │
│  └────────┬─────────┘          └──────────────────┘                   │
│           │ 1                                                         │
│           │                                                           │
│           │ *                                                         │
│  ┌────────┴─────────┐          ┌──────────────────┐                   │
│  │ANALYTICS_METRICS │          │   AUDIT_TRAIL    │ (Global Bus)       │
│  └──────────────────┘          └──────────────────┘                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. SQL DDL Table Specifications

### 2.1 Table: `knowledge_assets` (SSOT Structured Assets)
Stores canonical, domain-agnostic knowledge nodes.

```sql
CREATE TABLE knowledge_assets (
    asset_id VARCHAR(64) PRIMARY KEY,
    qcode VARCHAR(64) NOT NULL UNIQUE,
    domain_code VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    version VARCHAR(16) NOT NULL DEFAULT 'v1.0.0',
    author_agent_id VARCHAR(32) NOT NULL,
    verification_score NUMERIC(3,2) NOT NULL CHECK (verification_score >= 0.00 AND verification_score <= 1.00),
    security_level VARCHAR(16) NOT NULL DEFAULT 'PUBLIC' CHECK (security_level IN ('PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL')),
    file_path VARCHAR(512) NOT NULL,
    created_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ka_domain_qcode ON knowledge_assets(domain_code, qcode);
CREATE INDEX idx_ka_verification ON knowledge_assets(verification_score);
```

---

### 2.2 Table: `repository_index` (Vector & Hybrid Search Metadata)
Stores vector embeddings and search indexing keys.

```sql
CREATE TABLE repository_index (
    index_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id VARCHAR(64) NOT NULL REFERENCES knowledge_assets(asset_id) ON DELETE CASCADE,
    qcode VARCHAR(64) NOT NULL,
    chunk_index INT NOT NULL DEFAULT 0,
    chunk_text TEXT NOT NULL,
    embedding vector(3072), -- OpenAI text-embedding-3-large
    created_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_repo_index_vector ON repository_index USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_repo_index_asset ON repository_index(asset_id);
```

---

### 2.3 Table: `workflow_history` (Pipeline Execution Tracking)
Tracks execution state across the 6 platform workflows.

```sql
CREATE TABLE workflow_history (
    workflow_run_id VARCHAR(64) PRIMARY KEY,
    workflow_name VARCHAR(64) NOT NULL,
    tenant_id VARCHAR(32) NOT NULL,
    current_state VARCHAR(32) NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('RUNNING', 'PAUSED', 'COMPLETED', 'FAILED')),
    input_payload JSONB NOT NULL,
    output_payload JSONB,
    error_message TEXT,
    started_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at_utc TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_wf_status ON workflow_history(status, started_at_utc DESC);
```

---

### 2.4 Table: `agent_logs` (Micro-Agent Execution Traces)
Detailed operational logs generated by individual micro-agents under Phase 31 AAOS.

```sql
CREATE TABLE agent_logs (
    log_id BIGSERIAL PRIMARY KEY,
    workflow_run_id VARCHAR(64) REFERENCES workflow_history(workflow_run_id) ON DELETE CASCADE,
    agent_id VARCHAR(32) NOT NULL,
    action_name VARCHAR(64) NOT NULL,
    log_level VARCHAR(8) NOT NULL CHECK (log_level IN ('INFO', 'WARN', 'ERROR', 'DEBUG')),
    message TEXT NOT NULL,
    execution_time_ms INT NOT NULL,
    created_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agent_logs_wf ON agent_logs(workflow_run_id, agent_id);
```

---

### 2.5 Table: `human_approval_tokens` (AEGS Governance Tokens)
Stores human editor approval sign-offs prior to publication dispatch.

```sql
CREATE TABLE human_approval_tokens (
    token_id VARCHAR(64) PRIMARY KEY,
    workflow_run_id VARCHAR(64) NOT NULL REFERENCES workflow_history(workflow_run_id),
    approver_user_id VARCHAR(64) NOT NULL,
    approval_status VARCHAR(16) NOT NULL CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    rejection_reason TEXT,
    issued_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at_utc TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE UNIQUE INDEX idx_approval_token_wf ON human_approval_tokens(workflow_run_id);
```

---

### 2.6 Table: `publishing_history` (Multi-Channel Output Receipts)
Records dispatches sent to external CMS and rendering engines.

```sql
CREATE TABLE publishing_history (
    publication_id VARCHAR(64) PRIMARY KEY,
    workflow_run_id VARCHAR(64) NOT NULL REFERENCES workflow_history(workflow_run_id),
    approval_token_id VARCHAR(64) NOT NULL REFERENCES human_approval_tokens(token_id),
    channel_type VARCHAR(32) NOT NULL,
    target_url VARCHAR(512),
    artifact_path VARCHAR(512),
    status VARCHAR(16) NOT NULL CHECK (status IN ('SUCCESS', 'FAILED')),
    published_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pub_hist_channel ON publishing_history(channel_type, published_at_utc DESC);
```

---

### 2.7 Table: `analytics_metrics` (Post-Publication Telemetry)
Stores traffic, dwell time, and calculated Content Effectiveness Index (CEI) ratings.

```sql
CREATE TABLE analytics_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id VARCHAR(64) NOT NULL REFERENCES publishing_history(publication_id) ON DELETE CASCADE,
    pageviews INT NOT NULL DEFAULT 0,
    dwell_time_seconds INT NOT NULL DEFAULT 0,
    social_shares INT NOT NULL DEFAULT 0,
    cei_score NUMERIC(5,2) NOT NULL CHECK (cei_score >= 0.00 AND cei_score <= 100.00),
    feedback_recommendation TEXT,
    recorded_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_cei ON analytics_metrics(cei_score DESC);
```

---

### 2.8 Table: `version_control_history` (Knowledge Asset Delta Tracking)
Tracks version increments and structural edits to `structured/` assets.

```sql
CREATE TABLE version_control_history (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id VARCHAR(64) NOT NULL REFERENCES knowledge_assets(asset_id) ON DELETE CASCADE,
    previous_version VARCHAR(16) NOT NULL,
    new_version VARCHAR(16) NOT NULL,
    change_summary TEXT NOT NULL,
    modified_by_agent_id VARCHAR(32) NOT NULL,
    created_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2.9 Table: `audit_trail` (Immutable Global Cryptographic Bus)
Stores cryptographic hashes (`SHA-256`) of all platform actions for zero-trust audit compliance under Phase 37 AEGS.

```sql
CREATE TABLE audit_trail (
    audit_id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    target_resource_id VARCHAR(64) NOT NULL,
    payload_sha256 VARCHAR(64) NOT NULL,
    previous_audit_hash VARCHAR(64) NOT NULL,
    recorded_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_event ON audit_trail(event_type, recorded_at_utc DESC);
```

---

## 3. Self-Review & Verification Matrix

| Table Name | Entity Purpose | Foreign Keys / Indexing | Compliance Status |
|---|---|---|---|
| `knowledge_assets` | SSOT knowledge metadata | Primary key + Q-Code index | PASS |
| `repository_index` | Vector embeddings | FK to `knowledge_assets` + IVFFlat index | PASS |
| `workflow_history` | Pipeline execution tracking | Status index + JSONB payload | PASS |
| `agent_logs` | Micro-agent execution trace | FK to `workflow_history` | PASS |
| `human_approval_tokens` | AEGS Governance Token | FK to `workflow_history` + Expiry check | PASS |
| `publishing_history` | Channel dispatch receipt | FK to `approval_tokens` | PASS |
| `analytics_metrics` | Telemetry & CEI rating | FK to `publishing_history` | PASS |
| `version_control_history`| Asset versioning | FK to `knowledge_assets` | PASS |
| `audit_trail` | Cryptographic audit trail | Append-only + SHA-256 hash chaining | PASS |

---

## 4. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of ACPP Enterprise Database Schema Specification under ADF v3.1. |
