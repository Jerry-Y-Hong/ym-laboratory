# ACPP_WORKFLOW_STANDARD.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Architecture Baseline Defined  
**Architecture Level** : Enterprise Workflow Standard Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Overview & Workflow Operating Model

The **ACPP Workflow Standard** establishes the end-to-end operational workflows governing content production on the AI Content Production Platform (ACPP). Operating under **Phase 37 AEGS Governance** and **Phase 31 AAOS**, the workflow framework standardizes six interconnected operational phases: **Research**, **Knowledge Creation**, **Repository Management**, **Content Generation**, **Publishing**, and **Analytics Telemetry**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ACPP END-TO-END WORKFLOW PIPELINE                    │
├───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
│ Workflow 1│──►│ Workflow 2│──►│ Workflow 3│──►│ Workflow 4│──►│ Workflow 5│
│ Research  │   │ Knowledge │   │ Repository│   │ Generation│   │ Publishing│
└───────────┘   └───────────┘   └───────────┘   └───────────┘   └─────┬─────┘
      ▲                                                               │
      └────────────────────── Workflow 6: Analytics ◄──────────────────┘
```

---

## 2. Workflow 1: Research Workflow (RAW Data Ingestion)

### 2.1 Trigger & Goal
- **Trigger**: New topic research request, Scheduled knowledge refresh, or External trend trigger.
- **Goal**: Collect, verify, and store raw research artifacts in `raw/`.

### 2.2 Operational Step Execution
1. **Request Registration**: System ingests `ResearchTask` object detailing topic, target depth, and approved domain scopes.
2. **Data Acquisition**: **Research Agent (`ACPP-AG-01`)** fetches external web pages, literature PDFs, or database records.
3. **Provenance Validation**: Agent verifies source authenticity and calculates credibility score ($0.0 - 1.0$).
4. **Raw Archiving**: Saves raw payload into `raw/{domain}/web_scrapes/{hash}.json` with `SHA-256` integrity hash.

```
[Trigger] ──► (Agent-01: Research) ──► Credibility Check ──► Write to raw/
```

---

## 3. Workflow 2: Knowledge Creation Workflow (Structuring SSOT)

### 3.1 Trigger & Goal
- **Trigger**: Successful completion of Research Workflow (`RawAssetCreated` event).
- **Goal**: Convert un-structured research into normalized Knowledge Assets adhering to [KNOWLEDGE_REPOSITORY_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/KNOWLEDGE_REPOSITORY_STANDARD.md).

### 3.2 Operational Step Execution
1. **Parsing & Fact Extraction**: **Knowledge Agent (`ACPP-AG-02`)** extracts key claims, quantitative metrics, and entities.
2. **Ontology Tagging**: Assigns enterprise **Q-Codes** (e.g. `Q-KIM-FERM-008`) and aligns with domain taxonomy.
3. **Conflict Reconciliation**: Agent compares new claims against existing SSOT assets in `structured/`. If conflicts arise, flag for review.
4. **Asset Registration**: Writes normalized `.json` and YAML-frontmatter `.md` asset files to `structured/{domain}/assets/`.

```
Raw Asset ──► (Agent-02: Knowledge) ──► Fact Extraction ──► Q-Code Tagging ──► Write to structured/
```

---

## 4. Workflow 3: Repository Management Workflow (Indexing & Access Control)

### 4.1 Trigger & Goal
- **Trigger**: Registration of a new Knowledge Asset in `structured/`.
- **Goal**: Update global search indices, vector embeddings, and enforce security classifications.

### 4.2 Operational Step Execution
1. **Schema Validation**: Platform schema validator verifies new asset against `asset_schema_v3.json`.
2. **Vector Embedding**: Generates dense vector embeddings using the AI Engine Gateway (`text-embedding-3-large`).
3. **Index Refresh**: Updates hybrid vector search index and graph connections in `index/`.
4. **Access Boundary Check**: Verifies security levels (`PUBLIC`, `INTERNAL`, `RESTRICTED`) under **Phase 37 AEGS**.

---

## 5. Workflow 4: Content Generation Workflow (Multi-Format Drafting)

### 5.1 Trigger & Goal
- **Trigger**: Content campaign dispatch request (e.g. "Generate Blog, PDF, and Social Post for Q-KIM-FERM-008").
- **Goal**: Synthesize channel-optimized, SEO-ready text and visual drafts.

### 5.2 Operational Step Execution
1. **Context Hydration**: System queries vector index in `index/` to retrieve relevant SSOT Knowledge Assets.
2. **Multi-Format Drafting**: **Writing Agent (`ACPP-AG-03`)** drafts targeted text per channel guidelines (Blog, PDF Typst markdown, Slide outline).
3. **SEO & Structure Optimization**: **SEO Agent (`ACPP-AG-04`)** injects keywords, meta tags, and headings.
4. **Visual Synthesis**: **Image Agent (`ACPP-AG-05`)** synthesizes prompt specs, generates visual assets, and writes alt text.
5. **Draft Assembly**: Assembles complete draft package in memory.

```
Target Request ──► Context Hydration ──► (Agent-03: Write) ──► (Agent-04: SEO) ──► (Agent-05: Image)
```

---

## 6. Workflow 5: Publishing Workflow (Multi-Channel Dispatch)

### 6.1 Trigger & Goal
- **Trigger**: Complete Content Generation Package ready for distribution.
- **Goal**: Format transformation, human approval sign-off, and multi-channel publication.

### 6.2 Operational Step Execution
1. **Human Approval Gate (AEGS Governance Checkpoint)**:
   - System presents generated draft to Project Owner / Editor.
   - Requires valid `HumanApprovalToken` to proceed.
2. **Format Compilation**: **Publishing Agent (`ACPP-AG-06`)** compiles final channel payloads:
   - Blog / Website: Markdown -> HTML / Headless CMS API payload.
   - Document: Typst -> High-resolution PDF.
   - Newsletter / Social: Custom HTML / API JSON payload.
3. **Channel Dispatch**: Agent dispatches payloads via secure webhooks/APIs.
4. **Archive Registration**: Saves copies of dispatched artifacts into `published/{channel}/{date}/`.

```
Draft Package ──► [Human Approval Gate] ──► Format Compiler ──► (Agent-06: Publish) ──► Live Channels & Archive
```

---

## 7. Workflow 6: Analytics Telemetry & Feedback Workflow

### 7.1 Trigger & Goal
- **Trigger**: Periodic cron timer (e.g., 24h post-publication) or web analytics trigger.
- **Goal**: Ingest engagement metrics, evaluate content performance, and update repository insights.

### 7.2 Operational Step Execution
1. **Telemetry Collection**: **Analytics Agent (`ACPP-AG-07`)** collects traffic, shares, dwell time, and conversion metrics.
2. **Content Effectiveness Index (CEI)**: Agent calculates performance rating ($0.0 - 100.0$).
3. **Repository Feedback Loop**: If content underperforms or reveals user knowledge gaps, agent drafts a `KnowledgeUpdateRequest` sent to human editors to refine the SSOT knowledge assets.

---

## 8. Exception & Error Handling Rules

| Exception Event | Detection Layer | Action & Fallback Protocol | Escalate to Human? |
|---|---|---|---|
| **Low Credibility Source (< 0.50)** | Workflow 1 (Research) | Reject source; search alternative domain seeds. | No (Auto-retry) |
| **Schema Validation Failure** | Workflow 2 (Knowledge) | Halt registration; notify Knowledge Agent to re-parse. | No (Auto-retry 2x) |
| **Fact Hallucination Detected** | Workflow 4 (Drafting) | Reject draft section; re-hydrate prompt with exact quote. | No (Auto-retry 3x) |
| **Missing Human Approval Token** | Workflow 5 (Publishing) | Block dispatch execution immediately; log security event. | Yes (Governance Block) |
| **Publishing Webhook Failure** | Workflow 5 (Publishing) | Exponential backoff retry (3 attempts); fallback to queue. | Yes (If all fail) |

---

## 9. Self-Review & Verification Matrix

| Workflow Phase | Governance Checkpoint | Error Recovery Protocol | Verification Status |
|---|---|---|---|
| **Research Workflow** | Provenance hash verified | Auto-retry alternative sources | PASS |
| **Knowledge Workflow** | Strict schema validation | Re-parsing fallback | PASS |
| **Repository Workflow** | Security boundary enforcement | Vector index rollback | PASS |
| **Generation Workflow** | Zero hallucination check | Re-hydration retry | PASS |
| **Publishing Workflow** | Mandatory Human Approval Gate | Immediate execution block | PASS |
| **Analytics Workflow** | Telemetry read-only isolation | Non-destructive feedback | PASS |

---

## 10. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of ACPP Workflow Standard under ADF v3.1. |
