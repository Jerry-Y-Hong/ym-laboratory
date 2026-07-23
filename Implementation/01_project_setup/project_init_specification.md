# YM-LAB Project Initialization & Repository Strategy Specification

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Implementation Layer** : 01_project_setup  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. ACPP Component Mapping
- **Mapped Architecture Artifact**: [`ACPP_PROJECT_STRUCTURE.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_PROJECT_STRUCTURE.md)
- **Primary Scope**: Enterprise project initialization, canonical folder hierarchy instantiation, configuration scaffolding, and repository layout enforcement for ACPP applications.

---

## 2. Implementation Objectives
1. Instantiate the standardized enterprise directory tree (`docs/`, `config/`, `schemas/`, `agents/`, `repository/`, `tests/`) under the target application root.
2. Configure mandatory project bootstrap files (`platform_config.yaml`, `domain_registry.json`, `.env.example`).
3. Enforce strict directory isolation between un-structured research data (`raw/`), structured SSOT assets (`structured/`), rendered output artifacts (`published/`), and Q-Code vector indices (`index/`).

---

## 3. Technical Specifications

### 3.1 Project Master Directory Hierarchy
```text
<project_root>/
├── docs/
│   ├── architecture/        # Mapped 16 frozen ACPP architecture specifications
│   ├── governance/          # AEGS and AAOS security manifests
│   └── user_guides/         # Platform operator manual
├── config/
│   ├── platform_config.yaml # Master platform configuration
│   ├── domain_registry.json # Registered domain taxonomies (KIMCHI, SMART_FARM, etc.)
│   └── channel_templates/   # Multi-channel layout specs (WordPress, Typst, Astro)
├── schemas/
│   ├── knowledge_asset.schema.json
│   ├── research_payload.schema.json
│   ├── seo_metadata.schema.json
│   └── publishing_payload.schema.json
├── agents/
│   ├── manifests/           # Declarative YAML manifests (AG-01 to AG-07)
│   └── prompts/             # Version-controlled system prompts & hydration templates
├── repository/
│   ├── raw/                 # Ingested un-structured research vault
│   ├── structured/          # Single Source of Truth (SSOT) Knowledge Assets
│   ├── published/           # Channel output artifacts (Blog, PDF, Slides)
│   └── index/               # Q-Code registry & vector indices
├── tests/
│   ├── unit/                # Component & helper unit tests
│   ├── contracts/           # JSON Schema contract validation tests
│   ├── integration/         # Inter-agent REST API tests
│   └── e2e/                 # Full pipeline end-to-end tests
├── README.md
├── PROJECT_STATUS.md
└── FINAL_REPORT.md
```

### 3.2 Coding & Naming Standards
- **Python Backend / Micro-Agents**: PEP 8, Type Hints (`mypy`), Black formatting, strict Pydantic model definitions.
- **TypeScript Gateway / Node Services**: Strict mode, ESLint + Prettier, camelCase functions, PascalCase classes.
- **File Naming Conventions**:
  - Architecture specs: `UPPERCASE_SNAKE_CASE.md`
  - Schema definitions: `lowercase_snake_case.schema.json`
  - Agent manifests: `lowercase_snake_case.yaml`
  - Structured Assets: `KA-<DOMAIN>-<ID>.md` / `.json`

---

## 4. Dependencies & Implementation Sequence
1. **Dependencies**: Node.js v20+ / Python 3.11+, Git 2.40+, ADF v3.1 environment setup.
2. **Implementation Sequence**:
   - Step 1: Execute directory scaffold script (`mkdir -p` tree).
   - Step 2: Write default `config/platform_config.yaml` and `.env.example`.
   - Step 3: Populate `schemas/` with JSON Schemas.
   - Step 4: Scaffold micro-agent manifest templates in `agents/manifests/`.

---

## 5. Validation Checklist
- [x] All 6 primary directories (`docs`, `config`, `schemas`, `agents`, `repository`, `tests`) created.
- [x] Subdirectories `repository/raw`, `structured`, `published`, and `index` instantiated.
- [x] Schema files copied into `schemas/` and validated with `ajv` or Python `jsonschema`.
- [x] Environment template `.env.example` verified with no hardcoded credentials.

---

## 6. Completion Criteria
- Project initialization script runs cleanly without errors.
- Directory tree matches 100% of the blueprint defined in [`ACPP_PROJECT_STRUCTURE.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_PROJECT_STRUCTURE.md).
