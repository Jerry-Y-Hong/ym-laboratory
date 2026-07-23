# PILOT_PROJECT_PLAN.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Architecture Baseline Defined  
**Architecture Level** : Enterprise Pilot Validation Plan Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Summary & Pilot Objectives

The **ACPP Pilot Project Plan** defines the operational validation blueprint for testing the AI Content Production Platform (ACPP) using the **Kimchi Knowledge Base** ([`01_PHASE1_KIMCHI`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/01_PHASE1_KIMCHI/)).

The primary goal of the pilot is to prove that the generic, domain-agnostic ACPP architecture can ingest real-world enterprise domain data, normalize it into structured Knowledge Assets, and generate multi-channel content (blogs, websites, PDF whitepapers, slide presentations) while strictly maintaining factual accuracy, ADF v3.1 governance compliance, and vendor neutrality.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      KIMCHI PILOT VALIDATION FLOW                      │
├────────────────────────────────────────────────────────────────────────┤
│ 01_PHASE1_KIMCHI Domain Dataset (Recipes, Fermentation Specs, Stories) │
├────────────────────────────────────────────────────────────────────────┤
│ ACPP 7-Agent Pipeline (Research -> Knowledge -> Write -> SEO -> Image) │
├────────────────────────────────────────────────────────────────────────┤
│ Multi-Channel Rendering (WordPress Payload, Astro Site, PDF, Slides)   │
├────────────────────────────────────────────────────────────────────────┤
│ Governance & Performance Audit (AEGS Gate Check, Fact Verification)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Pilot Dataset Integration (`01_PHASE1_KIMCHI`)

The pilot will ingest existing frozen datasets from Phase 1:

- `01_KIMCHI_MASTER`: Core Kimchi varieties and biological metadata.
- `03_INGREDIENT_MASTER`: Ingredient profiles and nutritional dynamics.
- `04_RECIPE_MASTER`: Standardized culinary preparation steps.
- `05_FERMENTATION_MASTER`: Microorganism temperature kinetics (*L. mesenteroides*, *L. plantarum*).
- `07_STORY_MASTER`: Cultural history, UNESCO intangible heritage records.
- `08_IMAGE_PROMPT_MASTER`: Visual composition guidelines and style tokens.

---

## 3. Pilot Execution Lifecycle

The pilot execution is divided into 4 sequential operational phases:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Phase 1: Data   │────►│ Phase 2: Content│────►│ Phase 3: Channel│────►│ Phase 4: Audit  │
│ Structuring     │     │ Generation      │     │ Dispatch        │     │ & Telemetry     │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Phase 1: Knowledge Asset Structuring
- **Goal**: Convert SQL database dumps and Markdown specs from `01_PHASE1_KIMCHI` into normalized Knowledge Assets.
- **Executant**: **Knowledge Agent (`ACPP-AG-02`)**.
- **Deliverables**: 25 structured Knowledge Assets (`KA-KIMCHI-001` through `KA-KIMCHI-025`) stored in `repository/structured/` with Q-Code assignments (`Q-KIM-FERM-*`, `Q-KIM-REC-*`, `Q-KIM-HIST-*`).

### Phase 2: Multi-Channel Content Generation
- **Goal**: Synthesize content packages for 3 target channels.
- **Executants**: **Writing Agent (`ACPP-AG-03`)**, **SEO Agent (`ACPP-AG-04`)**, **Image Agent (`ACPP-AG-05`)**.
- **Outputs**:
  1. **Channel 1 (Blog / Web)**: 5 SEO-optimized long-form articles (Markdown + Meta JSON + DALL-E image prompts).
  2. **Channel 2 (Document / PDF)**: 1 Comprehensive Kimchi Fermentation Science Brief (Typst Markdown format).
  3. **Channel 3 (Presentation Slides)**: 1 Executive Overview Slide Deck (Marp / Markdown presentation format).

### Phase 3: Multi-Channel Publishing & Dispatch
- **Goal**: Render final assets and simulate publication webhooks.
- **Executant**: **Publishing Agent (`ACPP-AG-06`)**.
- **Gates**: Require Human Approval Token per **Phase 37 AEGS Governance**.
- **Outputs**: Generated PDF binaries, compiled Astro site pages, WordPress API JSON payloads archived in `repository/published/`.

### Phase 4: Performance Analytics & Evaluation
- **Goal**: Calculate Content Effectiveness Index (CEI) and fact-verification accuracy.
- **Executant**: **Analytics Agent (`ACPP-AG-07`)**.
- **Deliverables**: Pilot Evaluation Report JSON.

---

## 4. Key Performance Indicators (KPIs) & Success Criteria

To pass platform validation, the pilot must achieve 100% compliance across 5 target KPIs:

| KPI Category | Target Metric | Evaluation Method | Pass Criteria |
|---|---|---|---|
| **Factual Accuracy** | 100% Fact Citation Match | Automated trace back from claims to `raw/` sources | 0 Unchecked Claims |
| **ADF v3.1 Compliance** | 100% Header & Schema Adherence | Automated schema validator | 0 Governance Violations |
| **Multi-Channel Rendering** | 3 Channels Successfully Rendered | Build check for Web, PDF (Typst), and Slide (Marp) | 3/3 Channels Valid |
| **Vendor Neutrality** | Zero Provider Lock-in | Swap OpenAI driver mock with secondary LLM driver | 100% Code Integrity |
| **Human Gate Enforcement** | 100% Block without Approval Token | Security attempt to publish without approval token | 100% Block Rate |

---

## 5. Milestone Schedule & Verification Timeline

```
Week 1: Environment & Dataset Hydration (Ingest 01_PHASE1_KIMCHI)
Week 2: Knowledge Asset Normalization & Q-Code Indexing
Week 3: Multi-Channel Generation & Image Prompt Synthesis
Week 4: Publishing Dispatch & Executive Review Presentation
```

---

## 6. Self-Review & Verification Matrix

| Pilot Blueprint Item | Requirement Standard | Verification Status |
|---|---|---|
| **Domain Dataset Selection** | Ingest frozen `01_PHASE1_KIMCHI` dataset | PASS |
| **Lifecycle Coverage** | Spans Research, Knowledge, Drafting, SEO, Image, Publish, Analytics | PASS |
| **Multi-Channel Validation** | Covers Web/Blog, PDF Whitepaper, and Presentation Slides | PASS |
| **Governance Gate Check** | Integrates AEGS Human Approval Token verification | PASS |
| **KPI Metrics Defined** | Quantitative accuracy, governance, rendering, and portability targets | PASS |

---

## 7. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of Pilot Project Plan under ADF v3.1. |
