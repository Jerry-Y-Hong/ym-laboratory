# RECOVERY_SYSTEM.md

## Recovery, Rollback & Fault Tolerance Design

### 1. Objective
Define a **robust recovery framework** for the AI Enterprise Runtime Platform (AERP) that enables rapid rollback, automated disaster recovery, and graceful degradation while satisfying ADF v3.1 governance requirements.

### 2. Failure Scenarios
| Scenario | Detectable By | Recovery Action |
|----------|---------------|-----------------|
| **Component Crash** (Agent, Memory, Tool) | Liveness/readiness probes (Runtime Manager) | Restart pod via K8s; if repeated failures, trigger rollback of component version. |
| **Deployment Failure** (Bad manifest) | Deployment pipeline status – non‑zero exit code | Automatic rollback to previous successful Helm release (via `helm rollback`). |
| **Data Corruption** (Memory store, Vector indices) | Integrity checks in `RUNTIME_MONITORING.md` (checksum alerts) | Restore latest backup from Cloud Storage; rebuild vector indexes from source data. |
| **Network Partition** (Pub/Sub, External APIs) | Alert on increased latency / dead‑letter queue growth | Switch to cached responses; enable circuit breaker; notify operator. |
| **Security Breach** | Anomalous audit events (Security Runtime) | Quarantine affected pods; rotate secrets via Vault; initiate incident response (see Security Runtime). |

### 3. Backup & Snapshot Strategy
- **Redis (Hot Cache)** – RDB snapshots every 5 min, stored in Cloud Storage bucket `aerp-backups/redis/` (encrypted with CMEK).
- **PostgreSQL (Metadata)** – Automated Cloud SQL logical backups nightly; retained 30 days.
- **Milvus (Vector Store)** – Full dump of collection metadata + segment files daily; stored in `aerp-backups/milvus/`.
- **Configuration** – Git‑Ops repository is the source of truth; tags represent released versions.

### 4. Rollback Procedure
1. **Detect** failure (probe or alert).  
2. **Pause** traffic: set `Readiness` to false for affected service.  
3. **Identify** last known good version (Helm release history).  
4. **Execute** `helm rollback <release> <revision>` via Runtime Manager.  
5. **Validate** health checks; re‑enable readiness.  
6. **Log** audit event to `EVENT_RUNTIME` (`recovery.rollback`).

### 5. Disaster Recovery (Site‑Level)
- **Active‑Passive** region replication: primary cluster in `us-central1`, standby in `asia‑north1`.  
- **Failover Playbook** – Run Terraform script to promote standby cluster; update DNS via Cloud Load‑Balancing.
- **Recovery Time Objective (RTO)** – < 15 min for critical services; < 60 min for full platform.

### 6. Testing & Validation
- **Chaos Mesh** weekly injection of pod failures, network latency, and node loss; verify automatic rollback and alerting.  
- **Backup Restore Drills** monthly: restore Redis snapshot to a fresh cluster and run integration tests.

### 7. Cross‑Reference Links
- Master Architecture: [AERP_MASTER_ARCHITECTURE.md](file:///C:/Users/car13/.gemini/antigravity-ide/brain/49a37dfb-8f31-41e4-abcc-cfb650cba1f9/AERP_MASTER_ARCHITECTURE.md)
- Runtime Manager: [RUNTIME_MANAGER.md](file:///C:/Users/car13/.gemini/antigravity-ide/brain/49a37dfb-8f31-41e4-abcc-cfb650cba1f9/RUNTIME_MANAGER.md)
- Monitoring: [RUNTIME_MONITORING.md](file:///C:/Users/car13/.gemini/antigravity-ide/brain/49a37dfb-8f31-41e4-abcc-cfb650cba1f9/RUNTIME_MONITORING.md)
- Security Runtime: [SECURITY_RUNTIME.md](file:///C:/Users/car13/.gemini/antigravity-ide/brain/49a37dfb-8f31-41e4-abcc-cfb650cba1f9/SECURITY_RUNTIME.md)
- Event Runtime: [EVENT_RUNTIME.md](file:///C:/Users/car13/.gemini/antigravity-ide/brain/49a37dfb-8f31-41e4-abcc-cfb650cba1f9/EVENT_RUNTIME.md)

---
*The recovery system can be extended with automated scripts for each step; they are kept out of this high‑level design document.*
