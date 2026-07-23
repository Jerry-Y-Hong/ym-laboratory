# ACPP_AGENT_SPECIFICATION.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Architecture Baseline Defined  
**Architecture Level** : Enterprise Agent Specification Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Overview & Agent Framework Alignment

The **ACPP Agent Specification** defines the 7 specialized micro-agent roles that constitute the core execution engine of the AI Content Production Platform. Operating under **Phase 31 AAOS (Agent Architecture Operating System)** and **Phase 37 AEGS (AI Enterprise Governance System)**, each micro-agent is designed as a single-responsibility, stateless execution entity with strictly bounded authority, explicit input/output schemas, deterministic state transitions, and audit-logged actions.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ACPP AGENT PIPELINE OVERVIEW                    │
├─────────┬──────────────┬─────────────┬─────────────┬─────────────┬─────┴──────┬───────────┐
│ 1.      │ 2.           │ 3.          │ 4.          │ 5.          │ 6.         │ 7.        │
│ Research│ Knowledge    │ Writing     │ SEO         │ Image       │ Publishing │ Analytics │
│ Agent   │ Agent        │ Agent       │ Agent       │ Agent       │ Agent      │ Agent     │
└─────────┴──────────────┴─────────────┴─────────────┴─────────────┴────────────┴───────────┘
```

---

## 2. Agent 1: Research Agent (RA)

### 2.1 Role & Mission
The **Research Agent (RA)** is responsible for acquiring, extracting, verifying, and synthesizing domain raw data from web sources, scientific literature, internal enterprise documents, and structured databases.

### 2.2 Specifications
- **Role Code**: `ACPP-AG-01`
- **Primary Responsibilities**:
  - Web scraping & API data ingestion.
  - Fact-checking & source provenance tagging.
  - Extraction of statistical data, quotes, and scientific references.
- **Inputs**: Research Topic/Prompt, Seed URLs, Domain Focus Tag, Depth Level.
- **Outputs**: `RawResearchAsset` JSON object saved to `raw/{domain}/`.
- **State Machine**: `IDLE` -> `FETCHING` -> `VERIFYING` -> `SYNTHESIZING` -> `STORED`.
- **AAOS Safety Rules**: Read-only network access to approved domains; prohibited from writing to production knowledge stores.

```json
{
  "research_id": "RES-2026-KM-001",
  "topic": "Fermentation Temperature Dynamics in Kimchi",
  "sources": [
    { "url": "https://example.org/study1", "title": "Lactobacillus in Kimchi", "credibility_score": 0.95 }
  ],
  "extracted_facts": [
    { "fact": "Optimal fermentation temperature is 4-5°C for slow aging.", "source_id": 0 }
  ]
}
```

---

## 3. Agent 2: Knowledge Agent (KA)

### 3.1 Role & Mission
The **Knowledge Agent (KA)** transforms raw research dumps into normalized, enterprise-standard **Knowledge Assets** integrated with the enterprise Q-Code ontology and domain taxonomy.

### 3.2 Specifications
- **Role Code**: `ACPP-AG-02`
- **Primary Responsibilities**:
  - Structuring raw research into normalized schemas.
  - Assigning Q-Code tags, domain metadata, and cross-references.
  - Conflict resolution between existing knowledge nodes and new findings.
- **Inputs**: `RawResearchAsset` object, Existing Knowledge Base index.
- **Outputs**: `KnowledgeAsset` JSON/Markdown file registered in `structured/{domain}/`.
- **State Machine**: `IDLE` -> `PARSING` -> `ONTOLOGY_MAPPING` -> `VALIDATING` -> `REGISTERED`.
- **AAOS Safety Rules**: Restricted write access to `structured/` directory only; schema validation mandatory prior to write.

---

## 4. Agent 3: Writing Agent (WA)

### 4.1 Role & Mission
The **Writing Agent (WA)** ingests structured Knowledge Assets and synthesizes high-quality, channel-ready text content across formats (articles, whitepapers, social scripts, slide text, email campaigns).

### 4.2 Specifications
- **Role Code**: `ACPP-AG-03`
- **Primary Responsibilities**:
  - Textual generation according to target channel persona, tone, and length guidelines.
  - Citation insertion mapping directly back to SSOT Knowledge Assets.
  - Multi-language translation & localized tone adaptation.
- **Inputs**: Target Channel Type, Target Persona/Tone, Selected `KnowledgeAsset` IDs.
- **Outputs**: Draft Content Document (`Markdown` / `HTML` / `Text`).
- **State Machine**: `IDLE` -> `PROMPT_HYDRATION` -> `DRAFTING` -> `CITATION_CHECK` -> `DRAFT_READY`.
- **AAOS Safety Rules**: Strict prohibition of hallucinated sources; every statement must trace back to a registered Knowledge Asset ID.

---

## 5. Agent 4: SEO Agent (SA)

### 5.1 Role & Mission
The **SEO Agent (SA)** optimizes textual drafts for search engine visibility, audience search intent alignment, structured data schema inclusion, and readability scoring.

### 5.2 Specifications
- **Role Code**: `ACPP-AG-04`
- **Primary Responsibilities**:
  - Keyword density analysis & semantic term injection (LSI keywords).
  - Meta Title, Meta Description, OpenGraph, and JSON-LD Schema generation.
  - Heading structure (H1, H2, H3) optimization and readability scoring (Flesch-Kincaid / FK-Score).
- **Inputs**: Draft Content Document, Target Keyword Matrix, Audience Intent Segment.
- **Outputs**: `SEOOptimizedDocument` package containing metadata tags & score report.
- **State Machine**: `IDLE` -> `ANALYZING` -> `OPTIMIZING_META` -> `INJECTING_STRUCTURED_DATA` -> `OPTIMIZED`.
- **AAOS Safety Rules**: Read-only manipulation of text structure; cannot alter core factual data assertions.

---

## 6. Agent 5: Image Agent (IA)

### 6.1 Role & Mission
The **Image Agent (IA)** generates visual asset specifications, synthesizes AI images via model APIs (DALL-E / SD / Midjourney-compatible interfaces), formats visual themes, and writes accessible alt-text.

### 6.2 Specifications
- **Role Code**: `ACPP-AG-05`
- **Primary Responsibilities**:
  - Contextual prompt synthesis from article sections.
  - Image generation API dispatch (resolutions: 1:1, 16:9, 9:16).
  - Brand visual compliance check (color palette, artistic style).
  - Alt-text and caption generation for accessibility.
- **Inputs**: Content Document Sections, Brand Design Guidelines, Target Aspect Ratios.
- **Outputs**: Image Asset Files (`.png`/`.webp`) + Image Metadata Manifest.
- **State Machine**: `IDLE` -> `PROMPT_SYNTHESIS` -> `GENERATING` -> `BRAND_AUDIT` -> `ASSETS_ATTACHED`.
- **AAOS Safety Rules**: Automated audit of generated images against brand safety and ethical guardrails.

---

## 7. Agent 6: Publishing Agent (PA)

### 7.1 Role & Mission
The **Publishing Agent (PA)** handles final rendering, multi-channel package assembly, human approval gate verification, and distribution dispatch across target platforms.

### 7.2 Specifications
- **Role Code**: `ACPP-AG-06`
- **Primary Responsibilities**:
  - Format transformation (Markdown -> WordPress REST payload, Typst PDF compilation, HTML static site build).
  - Multi-channel API webhook execution (Ghost, WordPress, LinkedIn, Mailchimp, Custom CMS).
  - Archive generation in `published/{channel}/{date}/`.
- **Inputs**: `SEOOptimizedDocument`, Image Manifest, Channel Configuration, Human Approval Token.
- **Outputs**: Published Live Post URLs, PDF/EPUB Binary Artifacts, Publishing Confirmation Log.
- **State Machine**: `IDLE` -> `APPROVAL_VERIFICATION` -> `FORMAT_COMPILATION` -> `DISPATCHING` -> `PUBLISHED`.
- **AAOS Safety Rules**: Cannot execute dispatch without a valid Human Approval Token ([AEGS Governance Gate](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AEGS/AEGS_MASTER_ARCHITECTURE.md)).

---

## 8. Agent 7: Analytics Agent (AA)

### 8.1 Role & Mission
The **Analytics Agent (AA)** tracks post-publication content performance, collects telemetry metrics (views, shares, dwell time, conversion), and feeds performance insights back to the Knowledge Repository.

### 8.2 Specifications
- **Role Code**: `ACPP-AG-07`
- **Primary Responsibilities**:
  - Ingesting analytics webhooks and Google Analytics / CMS performance metrics.
  - Calculating Content Effectiveness Index (CEI).
  - Recommending knowledge node updates based on high-performing or underperforming content.
- **Inputs**: Published Post IDs, Telemetry Data Streams, Target Performance Benchmarks.
- **Outputs**: Performance Insight Report JSON + Knowledge Repository Update Recommendations.
- **State Machine**: `IDLE` -> `METRICS_COLLECTION` -> `ANALYZING_IMPACT` -> `FEEDBACK_GENERATION` -> `CLOSED`.
- **AAOS Safety Rules**: Read-only telemetry collection; recommendations must pass human review before updating SSOT.

---

## 9. Inter-Agent Communication & Security Model

All ACPP micro-agents communicate asynchronously using standard ADF v3.1 event payloads over the enterprise event bus. Direct agent-to-agent state mutation is strictly forbidden.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   INTER-AGENT EVENT BUS PROTOCOL                       │
├────────────────────────────────────────────────────────────────────────┤
│ Research Event  ──► [KA] ──► Knowledge Event ──► [WA] ──► Draft Event  │
│                                                                │       │
│ Live Log Bus ◄── [AA] ◄── Analytics Event ◄── [PA] ◄── [SA/IA] ◄───────┘
└────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Self-Review & Verification Matrix

| Agent | Responsibility Isolation | Input/Output Schema | AAOS Compliance | Status |
|---|---|---|---|---|
| **Research Agent** | Single-purpose research | Strict JSON Schema | Read-only fetch bounds | PASS |
| **Knowledge Agent** | SSOT structuring | Q-Code aligned schema | `structured/` directory write | PASS |
| **Writing Agent** | Content drafting | Text/Markdown package | Zero unverified facts | PASS |
| **SEO Agent** | Search optimization | Metadata manifest | Read-only text analysis | PASS |
| **Image Agent** | Visual synthesis | Media asset manifest | Ethical brand audit | PASS |
| **Publishing Agent** | Channel dispatch | Channel payload | Human approval gate required | PASS |
| **Analytics Agent** | Telemetry feedback | Performance report | Feedback loop isolated | PASS |

---

## 11. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of ACPP Agent Specification under ADF v3.1. |
