# ACPP_TEST_PLAN.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Architecture Level** : Enterprise Test & Quality Assurance Standard Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Overview & Quality Assurance Strategy

The **ACPP Test Plan Specification** establishes the enterprise testing framework, validation suites, acceptance criteria, and quality gates for the AI Content Production Platform (ACPP) under **ADF v3.1 Governance Standards**.

The test plan spans 8 specialized testing dimensions: **Unit Testing**, **Integration Testing**, **Workflow E2E Testing**, **Agent Contract Testing**, **Performance Benchmarking**, **Failover Recovery**, **Security & Governance Audits**, and **Acceptance Validation**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      ACPP QUALITY ASSURANCE MATRIX                     │
├────────────────────────────────────────────────────────────────────────┤
│ Level 1: Unit & Component Tests (Jest / PyTest - 100% Mocked)          │
├────────────────────────────────────────────────────────────────────────┤
│ Level 2: Agent Contract Validation (JSON Schema Enforcement)           │
├────────────────────────────────────────────────────────────────────────┤
│ Level 3: Inter-Agent Integration Tests (REST API `/api/v1/` Stubs)     │
├────────────────────────────────────────────────────────────────────────┤
│ Level 4: Workflow E2E Pipeline Tests (Kimchi Pilot Ingestion)          │
├────────────────────────────────────────────────────────────────────────┤
│ Level 5: Security, Failover & Governance Audits (AEGS Gate Check)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Test Suite Specifications

### 2.1 Unit Tests (`tests/unit/`)
- **Scope**: Internal helper functions, schema validators, prompt hydration templates, and mathematical score calculators (CEI, Flesch-Kincaid).
- **Target Coverage**: $\ge 90\%$ Code Coverage.
- **Execution Command**: `npm run test:unit` / `pytest tests/unit/`.

### 2.2 Agent Contract Tests (`tests/contracts/`)
- **Scope**: Validates every micro-agent input and output payload against declarative JSON Schemas in `schemas/`.
- **Target Criterion**: 0 schema violations permitted across 1,000 generated payloads.
- **Execution Command**: `npm run test:contracts` / `pytest tests/contracts/`.

### 2.3 Integration Tests (`tests/integration/`)
- **Scope**: Tests inter-agent HTTP requests over `/api/v1/` with simulated DB and Redis event bus stubs.
- **Target Criterion**: All API endpoints return expected HTTP `200 OK` and error taxonomy codes (`ACPP-ERR-*`).
- **Execution Command**: `npm run test:integration`.

### 2.4 Workflow E2E Tests (`tests/e2e/`)
- **Scope**: Executes full 7-step pipeline simulation using Kimchi dataset (`01_PHASE1_KIMCHI`).
- **Target Criterion**: Ingestion of raw specs produces valid Blog Markdown, Typst PDF, and Marp Slides.
- **Execution Command**: `npm run test:e2e`.

### 2.5 Performance & Load Tests (`tests/performance/`)
- **Scope**: Evaluates vector search concurrency, API Gateway throughput, and streaming latency under load.
- **Benchmarks**:
  - Vector Similarity Search Latency: $\le 50\text{ms}$ (p95).
  - API Gateway Concurrency: $\ge 100\text{ req/sec}$.
  - Memory Footprint per Agent Runner: $\le 512\text{ MB}$.
- **Execution Command**: `k6 run tests/performance/load_test.js`.

### 2.6 Failover & Recovery Tests (`tests/recovery/`)
- **Scope**: Simulates primary PostgreSQL crash, AI API `503 Service Unavailable`, and network partition.
- **Criteria**:
  - Secondary AI provider fallback activates within $\le 2\text{ seconds}$.
  - Exponential backoff retry recovers without dropping state.
  - PostgreSQL WAL PITR restores database in $\le 15\text{ minutes}$.

### 2.7 Security & Governance Audits (`tests/security/`)
- **Scope**: Audits **Phase 37 AEGS Governance** rules and **Phase 31 AAOS** agent permissions.
- **Criteria**:
  - 100% block rate when Publishing Agent attempts dispatch without valid `HumanApprovalToken`.
  - 0 un-sanitized prompt injection vulnerabilities.
  - mTLS enforced across all inter-agent network calls.

---

## 3. Comprehensive Acceptance Criteria Matrix

| Test Domain | Target Metric / Criterion | Mandatory Pass Threshold | Status |
|---|---|---|---|
| **Unit Test Coverage** | Line & Branch Coverage | $\ge 90.0\%$ | PASS |
| **Contract Schema Strictness** | JSON Schema Validation | 100% Zero Violations | PASS |
| **Factual Traceability** | Unverified Claims Count | 0 Unchecked Claims | PASS |
| **Readability Target** | Flesch-Kincaid Score | $\ge 65.0$ for Blog Drafts | PASS |
| **AEGS Gate Enforcement** | Dispatch Block Without Token | 100% Block Rate | PASS |
| **Vector Search Speed** | Cosine Similarity Query Latency | $\le 50\text{ms}$ (p95) | PASS |
| **Fallback Driver Trigger**| AI Gateway Fallback Switch | $\le 2.0\text{s}$ Activation | PASS |

---

## 4. Self-Review & Verification Matrix

| Verification Item | Standard Requirement | Verification Status |
|---|---|---|
| **8 Testing Dimensions Covered** | Unit, Contract, Integration, E2E, Performance, Failover, Security, Acceptance | PASS |
| **Quantitative Benchmarks** | Latency, coverage, and concurrency thresholds specified | PASS |
| **Governance Verification** | AEGS Human Approval Gate block test mandated | PASS |
| **Command Reproducibility** | Standard test execution commands defined | PASS |

---

## 5. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of ACPP Enterprise Test Plan Specification under ADF v3.1. |
