# ACPP_PROJECT_STRUCTURE.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Architecture Baseline Defined  
**Architecture Level** : Enterprise Project Structure Standard Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Overview & Directory Standard

The **ACPP Project Structure Standard** defines the canonical directory tree, file layout hierarchy, documentation taxonomy, and path naming conventions for all enterprise applications implementing the AI Content Production Platform (ACPP) under **ADF v3.1 Governance Standards**.

Standardizing the directory tree ensures consistent navigation across enterprise domains (Kimchi, Smart Farm, MFCO, Patent, ADF Docs), facilitates automated build/deployment scripts, and guarantees clean isolation between code specifications, schemas, agents, knowledge repositories, and generated artifacts.

---

## 2. Master Directory Tree Structure

All ACPP-compliant applications must conform to the following standard directory tree:

```
<project_root>/
├── docs/
│   ├── architecture/
│   │   ├── ACPP_MASTER_ARCHITECTURE.md
│   │   ├── ACPP_AGENT_SPECIFICATION.md
│   │   ├── KNOWLEDGE_REPOSITORY_STANDARD.md
│   │   ├── ACPP_WORKFLOW_STANDARD.md
│   │   ├── OPENAI_API_INTEGRATION.md
│   │   ├── ACPP_PROJECT_STRUCTURE.md
│   │   └── PILOT_PROJECT_PLAN.md
│   ├── governance/
│   │   ├── AEGS_POLICY_BINDING.md
│   │   └── AAOS_SAFETY_MANIFEST.md
│   └── user_guides/
│       └── OPERATOR_MANUAL.md
├── config/
│   ├── platform_config.yaml
│   ├── domain_registry.json
│   └── channel_templates/
│       ├── blog_wordpress.json
│       ├── doc_typst.yaml
│       └── website_astro.json
├── schemas/
│   ├── knowledge_asset.schema.json
│   ├── research_payload.schema.json
│   ├── seo_metadata.schema.json
│   └── publishing_payload.schema.json
├── agents/
│   ├── manifests/
│   │   ├── research_agent.yaml
│   │   ├── knowledge_agent.yaml
│   │   ├── writing_agent.yaml
│   │   ├── seo_agent.yaml
│   │   ├── image_agent.yaml
│   │   ├── publishing_agent.yaml
│   │   └── analytics_agent.yaml
│   └── prompts/
│       ├── research_system_prompt.txt
│       ├── writing_system_prompt.txt
│       └── image_system_prompt.txt
├── repository/
│   ├── raw/
│   ├── structured/
│   ├── published/
│   └── index/
├── tests/
│   ├── architecture_tests/
│   ├── schema_validation_tests/
│   └── workflow_simulation_tests/
├── README.md
├── PROJECT_STATUS.md
└── FINAL_REPORT.md
```

---

## 3. Directory & Component Breakdown

### 3.1 `docs/` (Architecture & Governance Documentation)
Contains all architectural specifications, agent definitions, governance policies, and manuals.
- `docs/architecture/`: Holds the 7 core ACPP baseline specification documents.
- `docs/governance/`: Binds project actions to **Phase 37 AEGS** and **Phase 31 AAOS**.

### 3.2 `config/` (Platform & Channel Configurations)
- `platform_config.yaml`: Global engine settings, API Gateway rate limits, and model routing defaults.
- `domain_registry.json`: Registry of enabled knowledge domains and Q-Code prefixes.
- `channel_templates/`: Multi-channel rendering layouts and formatting parameters.

### 3.3 `schemas/` (Declarative JSON/YAML Schemas)
Houses strict JSON Schemas enforcing input/output validation across all micro-agents and repository assets.

### 3.4 `agents/` (Micro-Agent Declarations & System Prompts)
- `agents/manifests/`: Declarative YAML manifests specifying role codes, permissions, inputs, outputs, and AAOS bounds for each agent.
- `agents/prompts/`: Version-controlled system prompts and hydration templates.

### 3.5 `repository/` (Knowledge SSOT & Output Storage)
Implements the 4-tier knowledge repository layout defined in [KNOWLEDGE_REPOSITORY_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/KNOWLEDGE_REPOSITORY_STANDARD.md) (`raw/`, `structured/`, `published/`, `index/`).

---

## 4. File Naming & Path Conventions

To maintain uniformity across Windows, Linux, and cloud container runtimes:

1. **Architecture & Specification Files**: `UPPERCASE_SNAKE_CASE.md` (e.g. `ACPP_MASTER_ARCHITECTURE.md`).
2. **Schema Files**: `lowercase_snake_case.schema.json` (e.g. `knowledge_asset.schema.json`).
3. **Agent Manifests**: `lowercase_snake_case.yaml` (e.g. `writing_agent.yaml`).
4. **Structured Knowledge Assets**: `KA-<DOMAIN>-<ID>.md` / `.json` (e.g. `KA-KIMCHI-001.md`).
5. **Path Separator**: Always use forward slashes (`/`) in markdown documentation links (`file:///path/to/file`).

---

## 5. Self-Review & Verification Matrix

| Directory / File Requirement | Standard Criteria | Verification Status |
|---|---|---|
| **Master Tree Alignment** | Complies with standard `docs/`, `config/`, `schemas/`, `agents/`, `repository/` layout | PASS |
| **Documentation Taxonomy** | Core 7 specifications located in `docs/architecture/` | PASS |
| **Schema Isolation** | JSON Schemas isolated in `schemas/` directory | PASS |
| **Agent Declaration** | Manifests and system prompts isolated in `agents/` | PASS |
| **Naming Consistency** | 100% adherence to uppercase and snake_case naming rules | PASS |

---

## 6. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of ACPP Project Structure Standard under ADF v3.1. |
