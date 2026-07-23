# 02_AGENT_ROLE_MODEL.md

## Phase 31 – AI Autonomous Agent Orchestration System (AAOS)

**Version** : v3.9.0  
**Status** : Active  
**Architecture Level** : AI Agent Orchestration Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Summary

The **Agent Role Model** defines the standardized taxonomy and behavioral profiles for all AI agents within the AAOS. By compartmentalizing intelligence into specific roles, the system prevents context dilution, enhances security, and allows for specialized tool provisioning.

---

## 2. Role Taxonomy & Classification

Agents in the YM-LAB Ecosystem are classified into three primary tiers:

### Tier 1: Orchestration & Strategy (Supervisory Roles)
- **Master Orchestrator (MO)**: Receives external triggers, formulates macro-plans, and delegates tasks to Tier 2 agents.
- **Architecture Reviewer (AR)**: Evaluates proposed code or system changes against ADF v3.1 governance rules and existing frozen baselines.

### Tier 2: Execution & Generation (Worker Roles)
- **Code Engineer (CE)**: Generates, refactors, and tests application code (Python, TS, SQL).
- **Data Analyst (DA)**: Queries BigQuery/AlloyDB, generates statistical models, and produces data visualization artifacts.
- **Q-Code Ontologist (QO)**: Interacts with the Kimchi Master Dataset and MFCO Knowledge Base to resolve domain-specific reasoning tasks.

### Tier 3: Utility & Infrastructure (Support Roles)
- **QA Automation Agent (QA)**: Executes unit tests, end-to-end (E2E) tests, and validates output schemas.
- **DevOps Deployer (DD)**: Packages artifacts and orchestrates CI/CD pipelines targeting AEOS/AERP infrastructure.

---

## 3. Role-Based Capabilities Matrix

| Role | Primary Function | Context Focus | Max Concurrency |
|---|---|---|---|
| Master Orchestrator | Task DAG Generation | Broad, System-wide | Low (Singleton per Workflow) |
| Architecture Reviewer| Governance Check | ADF v3.1, Phase 00~30 | Medium |
| Code Engineer | Implementation | File-level, Component | High |
| Data Analyst | Data Insights | Analytics schemas | High |
| Q-Code Ontologist | Domain Knowledge | MFCO, Q-Code graphs | High |

---

## 4. Role Assignment & Dynamic Scaling

- **Static Assignment**: Core orchestration nodes are statically provisioned.
- **Dynamic Provisioning**: Execution roles (e.g., Code Engineer, QA) are dynamically instantiated as ephemeral containers based on the task queue depth, utilizing the **AFKM** for rapid context hydration upon boot.

---

## 5. Self Review & Validation

| Validation Item | Required Standard | Result |
|---|---|---|
| Role & Permission Consistency | Taxonomy logically structured | PASS |
| Governance Compliance | ADF v3.1 Header & Format | PASS |

---

**[End of Document]**
