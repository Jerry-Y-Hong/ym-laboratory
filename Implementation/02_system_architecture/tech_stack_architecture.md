# YM-LAB System Architecture & Technology Stack Specification

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Implementation Layer** : 02_system_architecture  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. ACPP Component Mapping
- **Mapped Architecture Artifacts**: [`ACPP_MASTER_ARCHITECTURE.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_MASTER_ARCHITECTURE.md), [`ACPP_AGENT_SPECIFICATION.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_AGENT_SPECIFICATION.md)
- **Primary Scope**: 5-layer decoupled platform topology implementation, micro-agent container execution model, engine gateway interfaces, and ADF v3.1 ecosystem integration.

---

## 2. Implementation Objectives
1. Implement the 5-Layer platform architecture separating Presentation, Orchestration, AI Engine Gateway, Knowledge Repository, and Enterprise Foundation.
2. Establish the containerized micro-agent execution environment under Phase 31 AAOS security sandboxes.
3. Decouple domain knowledge storage (SSOT) from channel-specific rendering engines (WordPress, Typst PDF, Marp Slides).

---

## 3. Technical Specifications

### 3.1 5-Layer Platform Architecture Topology
```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Layer 1: Multi-Channel Presentation & Output Layer                      │
│   ├── CMS Connectors (WordPress, Ghost, Headless REST APIs)             │
│   ├── Static Site Generators (Astro, Next.js)                           │
│   └── Document Rendering Engines (Typst PDF, Marp Slide Deck)           │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 2: Content Generation & Agent Orchestration Layer                 │
│   ├── Research Agent (AG-01)          ├── SEO Agent (AG-04)            │
│   ├── Knowledge Agent (AG-02)         ├── Image Agent (AG-05)          │
│   ├── Writing Agent (AG-03)           ├── Publishing Agent (AG-06)     │
│   └───────────────────────────────────┴── Analytics Agent (AG-07)       │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 3: AI Engine Integration & Abstraction Layer                      │
│   ├── Model Routing & Load Balancer Gateway (`AIEngineGateway`)         │
│   ├── Chat Completion Adapter (`gpt-4o`, `gpt-4o-mini`)                 │
│   ├── Structured Output Enforcement Engine (JSON Schema Validation)     │
│   ├── Vector Embedding & Hybrid Search Interface (`text-embedding-3`)   │
│   └── Tool / Function Calling Dispatcher                                │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 4: Centralized Knowledge Repository Layer                         │
│   ├── Raw Research Assets (`raw/`)                                      │
│   ├── Structured SSOT Knowledge Assets (`structured/`)                  │
│   ├── Output Channel Artifacts (`published/`)                           │
│   └── Q-Code Metadata & Vector Indices (`index/`)                       │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 5: Enterprise Foundation Layer (ADF v3.1 Governance & Runtime)    │
│   ├── Phase 37 AEGS Governance Policy Engine                            │
│   ├── Phase 31 AAOS Agent Security Kernel                               │
│   ├── Phase 30 AFKM Federated Knowledge Mesh                            │
│   └── Phase 29 AAF Enterprise Application Framework                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack Selection
- **Core Engine / Gateway**: Node.js v20 LTS / TypeScript 5.x (Fastify REST Gateway) or Python 3.11+ (FastAPI).
- **Agent Microservices**: Python 3.11 (Pydantic v2, LangChain/LlamaIndex core abstraction optional, pure OpenAI API driver default).
- **Metadata Database**: PostgreSQL 16 with `pgvector` extension.
- **Cache & Event Bus**: Redis 7.2 (Pub/Sub for inter-agent messaging).
- **Document Rendering**: Typst v0.11+ (PDF compilation), Marp CLI (Slide compilation).

---

## 4. Dependencies & Implementation Sequence
1. **Dependencies**: Layer 01 (`01_project_setup`), Docker Engine 24+, PostgreSQL 16 (`pgvector`).
2. **Implementation Sequence**:
   - Step 1: Deploy base infrastructure services via Docker Compose.
   - Step 2: Implement `AIEngineGateway` core wrapper.
   - Step 3: Implement Layer 4 storage abstraction (`StorageService`).
   - Step 4: Wire Layer 2 agent runners to Layer 3 AI Gateway.

---

## 5. Validation Checklist
- [x] 5-Layer topology cleanly decoupled with zero circular dependencies.
- [x] Provider-agnostic `AIEngineGateway` interface implemented.
- [x] All 7 micro-agent execution boundaries verified against AAOS safety rules.
- [x] SSOT knowledge storage decoupled from publishing channel layout adapters.

---

## 6. Completion Criteria
- System architecture passes automated architectural validation tests (`npm run test:arch`).
- Decoupled 5-layer execution model verified in accordance with [`ACPP_MASTER_ARCHITECTURE.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_MASTER_ARCHITECTURE.md).
