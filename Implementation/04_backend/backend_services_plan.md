# YM-LAB Backend Services & Agent Microservice Implementation Blueprint

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Implementation Layer** : 04_backend  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. ACPP Component Mapping
- **Mapped Architecture Artifacts**: [`ACPP_AGENT_REGISTRY_STANDARD.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_AGENT_REGISTRY_STANDARD.md), [`ACPP_WORKFLOW_STANDARD.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_WORKFLOW_STANDARD.md), [`ACPP_EXECUTION_WALKTHROUGH.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_EXECUTION_WALKTHROUGH.md)
- **Primary Scope**: Micro-agent service implementation for all 7 agents (`ACPP-AG-01` through `ACPP-AG-07`), pipeline state machine orchestration, Redis event bus integration, and AEGS Human Approval Token validation.

---

## 2. Implementation Objectives
1. Implement single-responsibility runner classes for the 7 micro-agents under Phase 31 AAOS security bounds.
2. Develop the Pipeline Orchestrator enforcing the sequential 6-workflow pipeline (Research -> Knowledge -> Storage -> Generation -> Publishing -> Telemetry).
3. Integrate the **Phase 37 AEGS Human Approval Token (`HumanApprovalToken`)** verification gate inside the Publishing Agent service.

---

## 3. Technical Specifications

### 3.1 7 Micro-Agent Service Specifications
```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     MICRO-AGENT SERVICE ARCHITECTURE                    │
├─────────────┬──────────────────────┬────────────────────────────────────┤
│ Agent Code  │ Agent Name           │ Core Backend Responsibilities       │
├─────────────┼──────────────────────┼────────────────────────────────────┤
│ ACPP-AG-01  │ Research Agent       │ Web/Doc Scraping, SHA-256 Hashing  │
│ ACPP-AG-02  │ Knowledge Agent      │ Q-Code Mapping, SSOT Asset Write   │
│ ACPP-AG-03  │ Writing Agent        │ Blog, Typst PDF, Marp Slide Drafts │
│ ACPP-AG-04  │ SEO Agent            │ Metadata, Readability (FK), Schema │
│ ACPP-AG-05  │ Image Agent          │ DALL-E 3 Prompts, Media Manifest   │
│ ACPP-AG-06  │ Publishing Agent     │ AEGS Token Check, CMS Webhook      │
│ ACPP-AG-07  │ Analytics Agent      │ Telemetry Ingestion, CEI Scoring   │
└─────────────┴──────────────────────┴────────────────────────────────────┘
```

### 3.2 Workflow Orchestration Engine
- **Engine**: Stateful Pipeline Orchestrator (`src/orchestrator/pipeline_runner.py` / `.ts`).
- **State Transition Machine**:
  `IDLE` -> `RESEARCHING` -> `KNOWLEDGE_STRUCTURING` -> `INDEXING` -> `DRAFTING` -> `SEO_OPTIMIZING` -> `IMAGE_SYNTHESIZING` -> `AWAITING_HUMAN_APPROVAL` -> `DISPATCHING` -> `TELEMETRY_RECORDED`.
- **Human Gate Integration**:
  `PublishingAgent` must call `AEGSGovernanceService.validate_token(human_approval_token)` before invoking external CMS REST APIs.

---

## 4. Dependencies & Implementation Sequence
1. **Dependencies**: Layer 02 (`02_system_architecture`), Layer 03 (`03_database`), Redis Event Bus.
2. **Implementation Sequence**:
   - Step 1: Implement `BaseAgentRunner` abstract class with AAOS token validation and health checks.
   - Step 2: Implement agents sequentially (`AG-01` to `AG-07`).
   - Step 3: Implement `PipelineOrchestrator` managing inter-agent Redis pub/sub messaging.
   - Step 4: Implement `AEGSGovernanceService` for human approval token verification.

---

## 5. Validation Checklist
- [x] All 7 micro-agent services inherit from `BaseAgentRunner` with standard `/health` endpoints.
- [x] State machine transitions verified with zero deadlocks or silent exception drops.
- [x] Publishing Agent blocks 100% of dispatch requests lacking a valid `HumanApprovalToken`.
- [x] All agent actions append audit entries to the `audit_trail` table.

---

## 6. Completion Criteria
- Micro-agent unit and contract test suites (`npm run test:backend`) pass 100%.
- Service implementation matches 100% of [`ACPP_AGENT_REGISTRY_STANDARD.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_AGENT_REGISTRY_STANDARD.md) and [`ACPP_WORKFLOW_STANDARD.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_WORKFLOW_STANDARD.md).
