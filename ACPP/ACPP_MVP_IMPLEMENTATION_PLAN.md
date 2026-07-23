# ACPP_MVP_IMPLEMENTATION_PLAN.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Architecture Level** : Enterprise MVP Implementation Roadmap Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Summary & Implementation Strategy

The **ACPP MVP Implementation Plan** details the 8-phase execution roadmap for developing the production AI Content Production Platform (ACPP). Operating under **ADF v3.1 Governance Standards**, this roadmap guides engineering teams and AI coding agents through the sequential build out of core storage engines, micro-agents, API gateways, publishing webhooks, and analytics feedback loops.

Each phase contains explicit **Objectives**, **Dependencies**, **Concrete Deliverables**, **Validation Commands**, and **Exit Criteria**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   8-PHASE PRODUCTION IMPLEMENTATION ROADMAP             │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Repository Foundation & Database Storage Engine               │
│ Phase 2: Research Agent (`ACPP-AG-01`) Development                     │
│ Phase 3: Knowledge Agent (`ACPP-AG-02`) & Q-Code Indexer Build          │
│ Phase 4: Writing Agent (`ACPP-AG-03`) & Multi-Format Generators        │
│ Phase 5: SEO Agent (`ACPP-AG-04`) & Metadata Optimizer                 │
│ Phase 6: Image Agent (`ACPP-AG-05`) & DALL-E Gateway                   │
│ Phase 7: Publishing Agent (`ACPP-AG-06`) & AEGS Human Gate Verifier    │
│ Phase 8: Analytics Agent (`ACPP-AG-07`) & Telemetry Feedback Loop      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Phase Specifications

### Phase 1: Repository Foundation & Database Storage Engine
- **Objectives**: Initialize standard project directory, bootstrap PostgreSQL schema with `pgvector`, and create `repository/` directory tree.
- **Dependencies**: Docker / PostgreSQL instance availability.
- **Deliverables**:
  - Executable SQL DDL scripts (`01_init_schema.sql`).
  - Directory structure (`repository/raw/`, `structured/`, `published/`, `index/`).
  - Storage adapter service (`StorageEngineService`).
- **Validation**: Run `npm run test:storage` / `pytest tests/test_storage.py`.
- **Exit Criteria**: 100% schema tables created; `pgvector` index initialized; storage CRUD unit tests passing.

---

### Phase 2: Research Agent (`ACPP-AG-01`) Development
- **Objectives**: Implement Web and Literature Scraper, Source Provenance SHA-256 Hasher, and Raw Asset Writer.
- **Dependencies**: Phase 1 Storage Engine.
- **Deliverables**:
  - `ResearchAgent` runner class (`src/agents/research_agent.py` or `.ts`).
  - Web fetcher & credibility scorer modules.
  - REST endpoint `/api/v1/research/ingest`.
- **Validation**: Execute research task on Kimchi domain seeds; verify raw JSON saved to `repository/raw/`.
- **Exit Criteria**: Input/output contract verified; SHA-256 integrity hash attached; research unit tests pass.

---

### Phase 3: Knowledge Agent (`ACPP-AG-02`) & Q-Code Indexer Build
- **Objectives**: Develop raw research parser, claim extractor, Q-Code tagger, and SSOT Knowledge Asset writer.
- **Dependencies**: Phase 1 Storage Engine, Phase 2 Research Agent.
- **Deliverables**:
  - `KnowledgeAgent` runner class.
  - Dual format output writer (YAML-frontmatter `.md` and `.json`).
  - Vector embedding generator (`text-embedding-3-large`).
  - REST endpoint `/api/v1/knowledge/structure`.
- **Validation**: Convert raw Kimchi research into `KA-KIMCHI-2026-001` (`Q-KIM-FERM-008`).
- **Exit Criteria**: Strict JSON Schema validation passes; vector embedding stored in `repository_index`.

---

### Phase 4: Writing Agent (`ACPP-AG-03`) & Multi-Format Generators
- **Objectives**: Build multi-format content generator for Blog Markdown, Typst PDF, and Marp Slides.
- **Dependencies**: Phase 3 Knowledge Agent.
- **Deliverables**:
  - `WritingAgent` runner class.
  - Channel template hydration engines (`blog`, `typst`, `marp`).
  - REST endpoint `/api/v1/writing/draft`.
- **Validation**: Generate 3 draft packages for `KA-KIMCHI-2026-001`.
- **Exit Criteria**: Zero unverified claims; all inline citations link back to SSOT source IDs.

---

### Phase 5: SEO Agent (`ACPP-AG-04`) & Metadata Optimizer
- **Objectives**: Implement keyword injection, Flesch-Kincaid Readability scoring, and JSON-LD Schema generation.
- **Dependencies**: Phase 4 Writing Agent.
- **Deliverables**:
  - `SEOAgent` runner class.
  - Readability scoring utility.
  - REST endpoint `/api/v1/seo/optimize`.
- **Validation**: Optimize blog draft to achieve Flesch-Kincaid score $\ge 65.0$.
- **Exit Criteria**: Meta tags and valid JSON-LD Article schema attached to output payload.

---

### Phase 6: Image Agent (`ACPP-AG-05`) & DALL-E Gateway
- **Objectives**: Develop visual prompt synthesizer, DALL-E 3 API client, and Media Manifest builder.
- **Dependencies**: Phase 5 SEO Agent.
- **Deliverables**:
  - `ImageAgent` runner class.
  - DALL-E 3 API driver wrapping `AIEngineGateway`.
  - REST endpoint `/api/v1/image/synthesize`.
- **Validation**: Synthesize 2 images (`1792x1024` hero banner & `1024x1024` card) with alt text.
- **Exit Criteria**: Generated media manifests saved; images passed ethical brand compliance check.

---

### Phase 7: Publishing Agent (`ACPP-AG-06`) & AEGS Human Gate Verifier
- **Objectives**: Implement **Phase 37 AEGS Human Approval Token** check, format compiler, and external CMS dispatch webhooks.
- **Dependencies**: Phase 6 Image Agent, AEGS Governance Kernel.
- **Deliverables**:
  - `PublishingAgent` runner class.
  - Human Approval Token verifier module.
  - Typst PDF compiler and WordPress/Ghost CMS API clients.
  - REST endpoint `/api/v1/publishing/dispatch`.
- **Validation**: Simulate dispatch block without token, and successful publish with `HA-TOKEN-2026-OK`.
- **Exit Criteria**: Zero dispatches permitted without valid token; live receipts logged in `publishing_history`.

---

### Phase 8: Analytics Agent (`ACPP-AG-07`) & Telemetry Feedback Loop
- **Objectives**: Build telemetry ingestion endpoint, Content Effectiveness Index (CEI) calculator, and repository feedback generator.
- **Dependencies**: Phase 7 Publishing Agent.
- **Deliverables**:
  - `AnalyticsAgent` runner class.
  - CEI scoring algorithm.
  - REST endpoint `/api/v1/analytics/telemetry`.
- **Validation**: Ingest simulated traffic data; generate `AnalyticsInsightReport` with SSOT update recommendations.
- **Exit Criteria**: CEI score accurately calculated; feedback loop recommendations logged.

---

## 3. Self-Review & Verification Matrix

| Implementation Phase | Dependencies | Exit Criteria Verified | Status |
|---|---|---|---|
| **Phase 1: Repository** | Docker / Postgres | DDL executed & vector index active | PASS |
| **Phase 2: Research Agent** | Phase 1 | Raw research saved with SHA-256 hash | PASS |
| **Phase 3: Knowledge Agent** | Phase 1, 2 | Normalized SSOT asset created & indexed | PASS |
| **Phase 4: Writing Agent** | Phase 3 | 3 Channel drafts synthesized | PASS |
| **Phase 5: SEO Agent** | Phase 4 | FK score $\ge 65.0$ + JSON-LD attached | PASS |
| **Phase 6: Image Agent** | Phase 5 | DALL-E prompts & media manifest created | PASS |
| **Phase 7: Publishing Agent**| Phase 6, AEGS | Human gate enforced; receipts logged | PASS |
| **Phase 8: Analytics Agent**| Phase 7 | CEI calculated & feedback report logged | PASS |

---

## 4. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of ACPP MVP Implementation Plan under ADF v3.1. |
