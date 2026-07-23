# 01_AAF_MASTER_ARCHITECTURE.md

## Phase 29 – AI Application Framework (AAF)

**Version** : v3.8.0  
**Status** : Closed & Frozen  
**Architecture Level** : AI Application Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Executive Summary & Vision

The **AI Application Framework (AAF)** establishes the single, authoritative application architecture standard across all AI software within the **YM-LAB Enterprise Ecosystem**. 

AAF unifies application lifecycle management, modular service integration, state synchronization, backend service bindings, frontend interaction rules (building on **Phase 28 AFDS**), and multi-tenant security execution. It bridges lower-level enterprise AI operating platforms—such as **AEOS (Phase 22)**, **AERP (Phase 23)**, **AEIP (Phase 24)**, **AEDES (Phase 25)**, and **ASIS (Phase 26)**—with user-facing brand identity (**ABIDS Phase 27**) and frontend UI components (**AFDS Phase 28**).

---

## 2. Architectural Principles

1. **AI-First Architecture**: Every application module natively incorporates AI capability routing, prompt context management, tool calling, and multi-modal memory pipelines.
2. **Strict Layering & Decoupling**: Enforce strict separation between Presentation, Application, Domain, AI Service, Data, and Infrastructure layers.
3. **Single Source of Truth (SSOT)**: Maintain absolute consistency across application contracts, OpenAPI schemas, and state synchronization protocols.
4. **Zero-Mutation Phase Isolation**: Integrate with frozen prior phases (Phases 01–28) via immutable APIs and cross-references without modifying locked deliverables.
5. **Declarative & Scalable**: Support automated app generation and Hot-Reloading through standardized declarative schemas (`aaf-config.yaml`).
6. **Governance & Audit Traceability**: Guarantee 100% compliance with **ADF v3.1** governance and full end-to-end event audit logging.

---

## 3. Layered Application Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                   AAF LAYERED APPLICATION ARCHITECTURE                  │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 1: Presentation Layer (AFDS UI Components, App Shells, Views)    │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 2: Application Layer (App Controllers, Workflows, State Sync)   │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 3: Domain Layer (Business Logic, Q-Code Models, Entities)        │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 4: AI Service Layer (LLM Gateway, Prompt Engine, Agent/Tools)    │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 5: Data Layer (Vector DB, Knowledge Graph, Relational, Cache)   │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 6: Infrastructure Layer (Kubernetes, Docker, CI/CD, Telemetry)   │
└────────────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities
- **Presentation Layer**: Consumes **Phase 28 (AFDS)** components for UI layout, streaming reasoning displays, and responsive design.
- **Application Layer**: Manages application use cases, orchestration workflows, authentication, state dispatching, and routing.
- **Domain Layer**: Implements core business logic, domain entities, and Q-Code ontology business rules.
- **AI Service Layer**: Integrates model routing, agent execution context, prompt template resolution, memory retrieval, and tool execution.
- **Data Layer**: Handles data persistence, vector embedding storage, relational data management, and redis caching.
- **Infrastructure Layer**: Controls deployment environments, containerization, observability metrics, and automated CI/CD pipelines.

---

## 4. Core Components & Dependency Model

```
       ┌──────────────────────────────────────────────────┐
       │             AAF Core Framework Engine            │
       └─────────┬──────────────────────────────┬─────────┘
                 │                              │
        ┌────────▼─────────┐          ┌─────────▼────────┐
        │  App Lifecycle   │          │   AI Service     │
        │     Runtime      │          │    Gateway       │
        └────────┬─────────┘          └─────────┬────────┘
                 │                              │
        ┌────────▼─────────┐          ┌─────────▼────────┐
        │ Context & State  │          │ Security Sandbox │
        │   Sync Bus       │          │   & Policy       │
        └──────────────────┘          └──────────────────┘
```

### Core Components
1. **AAF Runtime Kernel**: Manages app initialization, dependency injection, and plugin lifecycle.
2. **AI Service Gateway**: Handles LLM provider abstraction, model failover, and request/response streaming.
3. **State & Event Bus**: Facilitates real-time event streaming and context synchronization.
4. **Security & Governance Sandbox**: Enforces RBAC/ABAC policies, token usage limits, and zero-trust execution.

---

## 5. Ecosystem Integration Strategy

AAF seamlessly binds to upstream and downstream phases in the YM-LAB architecture:
- [01_AFDS_MASTER_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/01_AFDS_MASTER_STANDARD.md) (**Phase 28 AFDS**): Consumes UI design tokens, atomic components, and streaming UI patterns.
- [01_BRAND_MISSION.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ABIDS/01_BRAND_MISSION.md) (**Phase 27 ABIDS**): Adheres to visual identity guidelines and visual prompt libraries.
- [01_ASIS_MASTER_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ASIS/01_ASIS_MASTER_STANDARD.md) (**Phase 26 ASIS**): Connects strategic intelligence metrics with application dashboards.
- [01_AEDES_MASTER_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AEDES/01_AEDES_MASTER_STANDARD.md) (**Phase 25 AEDES**): Executes autonomous decisions and agent workflow actions.
- [PHASE_FREEZE_MANAGEMENT_POLICY.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/PHASE_FREEZE_MANAGEMENT_POLICY.md): Guarantees zero mutation to frozen baselines.

---

## 6. Self Review & Validation

| Validation Item | Required Standard | Result |
|---|---|---|
| Architectural Completeness | 6-layer model fully defined with clear boundaries | PASS |
| Layer Consistency | Non-overlapping responsibility matrix enforced | PASS |
| Module Consistency | Unified dependency injection & component standards | PASS |
| ADF v3.1 Compliance | Governance & Phase Freeze Policy compliant | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.8.0 | 2026-07-22 | Antigravity (AI) | Initial release. AAF Master Architecture Standard established. |
