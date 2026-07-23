# ACPP_MASTER_ARCHITECTURE.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Architecture Baseline Defined  
**Architecture Level** : Enterprise Content Application Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Summary & Architectural Vision

The **AI Content Production Platform (ACPP)** is the flagship enterprise application built directly upon **AI Enterprise (ADF v3.1)**. ACPP addresses the enterprise requirement for scalable, reproducible, and multi-channel content generation derived from a single, centralized **Knowledge Repository**. 

Rather than serving as a single-purpose blog automation tool, ACPP establishes a reusable, domain-agnostic enterprise architecture capable of transforming structured domain intelligence into diverse content formats—including blog posts, static websites, PDF documentation, whitepapers, executive presentations, email newsletters, social media assets, and future interactive media.

ACPP is engineered for seamless scalability across all existing and future enterprise knowledge domains, including **Smart Farm**, **MFCO**, **Patent Intelligence**, **AI Enterprise Core Documentation**, and specialized domain knowledge bases such as the **Kimchi Knowledge Base** (`01_PHASE1_KIMCHI`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                    ACPP HIGH-LEVEL ARCHITECTURE                        │
├────────────────────────────────────────────────────────────────────────┤
│ Multi-Channel Digital Outputs: Blogs | Websites | PDFs | Books | Slides │
├────────────────────────────────────────────────────────────────────────┤
│ Specialized Agent Pipeline: Research -> Knowledge -> Writing -> SEO... │
├────────────────────────────────────────────────────────────────────────┤
│ AI Engine Abstraction Gateway (Default: OpenAI API - Fully Replaceable)│
├────────────────────────────────────────────────────────────────────────┤
│ Centralized Enterprise Knowledge Repository (Domain-Agnostic SSOT)      │
├────────────────────────────────────────────────────────────────────────┤
│ ADF v3.1 Governance & Runtime Foundation (AEGS | AAOS | AFKM | AAF)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Principles

1. **ADF v3.1 Full Compliance**: Absolute adherence to ADF v3.1 Governance Standards, including security boundary isolation, agent safety protocols ([AAOS](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AAOS/01_AAOS_MASTER_SPECIFICATION.md)), and governance oversight ([AEGS](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AEGS/AEGS_MASTER_ARCHITECTURE.md)).
2. **Vendor & Engine Neutrality**: Complete decoupling of AI capabilities from underlying model providers. The OpenAI API serves as the primary reference implementation wrapped within an engine abstraction layer.
3. **Repository-Centric Design**: Knowledge assets remain strictly independent of output formats. The Knowledge Repository operates as the single source of truth (SSOT) from which all channel-specific content artifacts are derived.
4. **Decoupled Micro-Agent Orchestration**: Specialized micro-agents maintain clear, single-responsibility roles (Research, Structuring, Writing, SEO, Visual Synthesis, Publishing, Analytics) governed by predictable state machines.
5. **Multi-Domain Scalability**: Universal schema standards ensure zero code modification when onboarding new enterprise knowledge domains.

---

## 3. 5-Layer Platform Architecture Topology

ACPP adopts a strict 5-layer decoupled topology to guarantee modularity, maintainability, and governance compliance:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      5-LAYER PLATFORM TOPOLOGY                          │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 1: Multi-Channel Presentation & Output Layer                      │
│   ├── CMS Connectors (WordPress, Ghost, Custom Headless APIs)           │
│   ├── Static Site Generators (Hugo, Next.js, Astro)                     │
│   ├── Document Rendering Engines (Typst, Weasyprint, Pandoc PDF/EPUB)   │
│   └── Social & Syndication Adapters (LinkedIn, Mailchimp, RSS, X)       │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 2: Content Generation & Agent Orchestration Layer                 │
│   ├── Research Agent            ├── SEO Agent                       │
│   ├── Knowledge Agent           ├── Image Agent                     │
│   ├── Writing Agent             ├── Publishing Agent                │
│   └─────────────────────────────┴── Analytics Agent                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 3: AI Engine Integration & Abstraction Layer                      │
│   ├── Model Routing & Load Balancer Gateway                             │
│   ├── Responses / Chat Completion Adapter                               │
│   ├── Structured Output Enforcement Engine (JSON Schema / Pydantic)     │
│   ├── Vector Embedding & Hybrid Search Interface                        │
│   └── Tool / Function Calling Dispatcher                                │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 4: Centralized Knowledge Repository Layer                         │
│   ├── Raw Research Assets Store (`raw/`)                                │
│   ├── Structured Knowledge Assets Store (`structured/`)                 │
│   ├── Output Channel Artifacts Store (`published/`)                     │
│   └── Global Taxonomy & Q-Code Metadata Index (`index/`)                 │
├─────────────────────────────────────────────────────────────────────────┤
│ Layer 5: Enterprise Foundation Layer (ADF v3.1 Runtime & Governance)     │
│   ├── AEGS Governance Policy Engine                                     │
│   ├── AAOS Agent Lifecycle & Security Kernel                            │
│   ├── AFKM Knowledge Mesh & Access Boundary Manager                     │
│   └── AAF Enterprise Application Framework                             │
└─────────────────────────────────────────────────────────────────────────┘
```

### Layer Breakdown

1. **Layer 1: Multi-Channel Presentation & Output Layer**
   - Transmutes generated raw content into publication-ready target formats.
   - Houses channel-specific rendering templates (HTML/CSS themes, Markdown layout rules, PDF stylesheets, Slide deck schemas).
2. **Layer 2: Content Generation & Agent Orchestration Layer**
   - Manages asynchronous workflow pipelines across the 7 core micro-agents.
   - Enforces human-in-the-loop validation checkpoints before content dispatch.
3. **Layer 3: AI Engine Integration & Abstraction Layer**
   - Provides a standardized API abstraction layer wrapping external AI models.
   - Enforces response schemas, handles rate limits, token budgets, retries, and prompt hydration.
4. **Layer 4: Centralized Knowledge Repository Layer**
   - Stores raw inputs, structured domain assets, metadata indices, and historical content versions.
   - Implements strict file system and vector index layout standards.
5. **Layer 5: Enterprise Foundation Layer**
   - Binds ACPP to the ADF v3.1 kernel, guaranteeing zero-trust permission models, audit logging, and policy compliance.

---

## 4. Repository Architecture (SSOT vs Channel Artifacts)

The repository architecture enforces complete separation between **Core Domain Knowledge** and **Channel-Specific Content Outputs**:

```
                         ┌─────────────────────────┐
                         │   Knowledge Domain      │
                         │ (e.g. Kimchi / Patent)  │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │  Knowledge Repository   │
                         │   (Structured SSOT)     │
                         └────────────┬────────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           │                          │                          │
           ▼                          ▼                          ▼
┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
│   Blog & Website   │     │  PDF & E-Book      │     │ Slide Presentation │
│   Output Channel   │     │  Output Channel    │     │   Output Channel   │
└────────────────────┘     └────────────────────┘     └────────────────────┘
```

- **SSOT Assets (`structured/`)**: Immutable domain knowledge files annotated with Q-Codes, provenance metadata, factual references, and domain tags. They do not contain channel-specific formatting (e.g. no SEO titles, no web ad slots).
- **Channel Artifacts (`published/`)**: Dynamically generated content packages optimized for specific channels (e.g., WordPress REST payload, Static Site Markdown file, PDF Typst source file).

---

## 5. Agent Micro-Architecture Topology

ACPP deploys 7 specialized, single-purpose micro-agents operating in a coordinated workflow pipeline:

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   Research   ├────►│  Knowledge   ├────►│   Writing    │
  │    Agent     │     │    Agent     │     │    Agent     │
  └──────────────┘     └──────────────┘     └──────┬───────┘
                                                   │
  ┌──────────────┐     ┌──────────────┐            │
  │  Analytics   │◄────┤  Publishing  │◄───────────┤
  │    Agent     │     │    Agent     │            │
  └──────────────┘     └──────▲───────┘            │
                              │                    │
                      ┌───────┴──────┐     ┌───────▼──────┐
                      │    Image     │◄────┤  SEO Agent   │
                      │    Agent     │     │              │
                      └──────────────┘     └──────────────┘
```

Each agent executes within sandboxed bounds mandated by **Phase 31 AAOS**, ensuring zero unauthorized file access or unverified external execution.

---

## 6. Ecosystem Integration Matrix

ACPP integrates cleanly with active ADF v3.1 enterprise baselines without modifying locked files:

- [AEGS_MASTER_ARCHITECTURE.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AEGS/AEGS_MASTER_ARCHITECTURE.md) (**Phase 37 AEGS**): Enforces declarative governance policies, ethical AI rules, and audit logging.
- [01_AAOS_MASTER_SPECIFICATION.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AAOS/01_AAOS_MASTER_SPECIFICATION.md) (**Phase 31 AAOS**): Manages agent permissions, lifecycles, execution sandboxing, and inter-agent communication protocols.
- [01_AFKM_MASTER_ARCHITECTURE.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFKM/01_AFKM_MASTER_ARCHITECTURE.md) (**Phase 30 AFKM**): Governs federated knowledge mesh operations, vector indexing, and cross-domain entity resolution.
- [01_AAF_MASTER_ARCHITECTURE.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AAF/01_AAF_MASTER_ARCHITECTURE.md) (**Phase 29 AAF**): Provides application runtime, configuration management, and tenant isolation interfaces.
- [PROJECT_STATUS.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/PROJECT_STATUS.md): Maintains global phase tracking and release baseline registration.

---

## 7. Security, Governance & Verification Matrix

| Verification Criterion | Architectural Standard | Status |
|---|---|---|
| **ADF v3.1 Governance** | Fully compliant with Phase 37 AEGS policy and audit rules | PASS |
| **Vendor Neutrality** | OpenAI API abstracted behind provider-agnostic interface | PASS |
| **Agent Isolation** | All 7 micro-agents scoped under Phase 31 AAOS permission boundaries | PASS |
| **SSOT Integrity** | Clear decoupling between Knowledge Assets and Output Channel Artifacts | PASS |
| **Domain Portability** | Universal asset schema supports arbitrary domain integration | PASS |

---

## 8. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of ACPP Master Architecture Specification under ADF v3.1. |
