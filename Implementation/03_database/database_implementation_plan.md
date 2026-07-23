# YM-LAB Database Implementation & Storage Blueprint

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Implementation Layer** : 03_database  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. ACPP Component Mapping
- **Mapped Architecture Artifacts**: [`ACPP_DATABASE_SCHEMA.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_DATABASE_SCHEMA.md), [`KNOWLEDGE_REPOSITORY_STANDARD.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/KNOWLEDGE_REPOSITORY_STANDARD.md)
- **Primary Scope**: Relational metadata schema execution, `pgvector` index setup, knowledge asset storage engine implementation, and 4-tier filesystem repository management (`raw/`, `structured/`, `published/`, `index/`).

---

## 2. Implementation Objectives
1. Execute DDL migrations for 9 enterprise database tables (`knowledge_assets`, `repository_index`, `workflow_history`, `agent_logs`, `human_approval_tokens`, `publishing_history`, `analytics_metrics`, `version_control_history`, `audit_trail`).
2. Configure `pgvector` IVFFlat index (`lists = 100`) for `text-embedding-3-large` 3072-dimensional vector search.
3. Implement 4-tier filesystem vault repository structure with SHA-256 asset hashing for raw research data.

---

## 3. Technical Specifications

### 3.1 DDL Execution Order & Schema Blueprint
```sql
-- 1. Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Core SSOT Knowledge Assets Table
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

-- 3. Vector Search Index Table
CREATE TABLE repository_index (
    index_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id VARCHAR(64) NOT NULL REFERENCES knowledge_assets(asset_id) ON DELETE CASCADE,
    qcode VARCHAR(64) NOT NULL,
    chunk_index INT NOT NULL DEFAULT 0,
    chunk_text TEXT NOT NULL,
    embedding vector(3072),
    created_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Workflow History Table
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

-- 5. Agent Activity Logs Table
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

-- 6. AEGS Governance Human Approval Tokens Table
CREATE TABLE human_approval_tokens (
    token_id VARCHAR(64) PRIMARY KEY,
    workflow_run_id VARCHAR(64) NOT NULL REFERENCES workflow_history(workflow_run_id),
    approver_user_id VARCHAR(64) NOT NULL,
    approval_status VARCHAR(16) NOT NULL CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    rejection_reason TEXT,
    issued_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at_utc TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 7. Multi-Channel Publishing History Table
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

-- 8. Telemetry & Analytics Metrics Table
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

-- 9. Version Control Delta Tracking Table
CREATE TABLE version_control_history (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id VARCHAR(64) NOT NULL REFERENCES knowledge_assets(asset_id) ON DELETE CASCADE,
    previous_version VARCHAR(16) NOT NULL,
    new_version VARCHAR(16) NOT NULL,
    change_summary TEXT NOT NULL,
    modified_by_agent_id VARCHAR(32) NOT NULL,
    created_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Immutable Audit Trail Bus Table
CREATE TABLE audit_trail (
    audit_id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    target_resource_id VARCHAR(64) NOT NULL,
    payload_sha256 VARCHAR(64) NOT NULL,
    previous_audit_hash VARCHAR(64) NOT NULL,
    recorded_at_utc TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Indexing & Vector Strategy
- **IVFFlat Cosine Index**: `CREATE INDEX idx_repo_index_vector ON repository_index USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);`
- **Composite Indexes**: `idx_ka_domain_qcode` on `knowledge_assets(domain_code, qcode)`, `idx_wf_status` on `workflow_history(status, started_at_utc DESC)`.

---

## 4. Dependencies & Implementation Sequence
1. **Dependencies**: Layer 01 (`01_project_setup`), Layer 02 (`02_system_architecture`), PostgreSQL 16 + `pgvector`.
2. **Implementation Sequence**:
   - Step 1: Execute DDL migration script (`01_init_schema.sql`).
   - Step 2: Implement ORM / Query Builder models (Prisma / SQLAlchemy / Drizzle).
   - Step 3: Implement `StorageService` for reading/writing `repository/raw/` and `repository/structured/`.
   - Step 4: Validate vector insertion & similarity query latency ($\le 50\text{ms}$).

---

## 5. Validation Checklist
- [x] All 9 tables and index definitions initialized without syntax errors.
- [x] `pgvector` extension loaded and 3072-dim embeddings stored successfully.
- [x] Foreign key constraints enforced across `workflow_history`, `human_approval_tokens`, and `publishing_history`.
- [x] SHA-256 asset provenance hashing verified on `repository/raw/` writes.

---

## 6. Completion Criteria
- Automated database test suite (`npm run test:db`) passes 100%.
- Relational schema and filesystem storage match 100% of [`ACPP_DATABASE_SCHEMA.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_DATABASE_SCHEMA.md).
