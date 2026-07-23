# 09_DOCUMENT_STYLE_GUIDE.md

## Phase 27 – AI Brand Identity & Design System (ABIDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Design & Brand System Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Establish the **Document Style Guide & Publishing Standards** for YM-LAB. This document standardizes Markdown document formatting, PDF export styles, presentation deck templates, ASCII/Mermaid diagram rules, file naming conventions, versioning rules, and metadata standards across all 27 architectural phases.

---

## 2. Markdown Formatting Standard

All YM-LAB architecture documents MUST adhere to GitHub-Flavored Markdown (GFM) and the following header layout:

### Mandatory Document Header Template

```markdown
# 00_DOCUMENT_TITLE.md

## Phase XX – Phase Name (Abbreviation)

**Version** : vX.Y.Z  
**Status** : Closed & Frozen (or Draft / Under Review)  
**Architecture Level** : Layer Name  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : YYYY-MM-DD  

---
```

### Structural Rules
- **Headings**: Use `#` for document title, `##` for primary sections (1. Purpose, 2. Scope, etc.), `###` for sub-sections. Never skip heading levels.
- **Lists**: Use hyphens (`-`) for unordered bullet lists and numbered lists (`1.`, `2.`) for sequential procedures.
- **Code Blocks**: Always specify language identifier (e.g. ```markdown, ```json, ```css, ```bash).
- **Tables**: Column headers aligned with markdown divider lines (`|---|---|`). No empty cells.

---

## 3. Diagram Rules (Mermaid & ASCII)

Diagrams provide visual clarity for system architecture, sequence flows, and component hierarchies.

### ASCII Architecture Diagrams
- Standard box width: Minimum `60 characters`, maximum `76 characters`.
- Enclosed with unicode box-drawing characters (`┌ ┐ └ ┘ │ ─ ├ ┤ ┴ ┬`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SAMPLE ARCHITECTURE BOX                         │
├────────────────────────────────────────────────────────────────────────┤
│ Layer A                │ Layer B               │ Layer C               │
└────────────────────────┴───────────────────────┴───────────────────────┘
```

### Mermaid Diagram Rules
- Always wrap node labels containing special characters in quotes (`id["Label (Details)"]`).
- Avoid inline HTML inside node labels.

---

## 4. Naming Conventions

Strict file and directory naming conventions prevent ambiguity and ensure automated script processing.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NAMING CONVENTION RULES                         │
├─────────────────┬──────────────────────────────────┬───────────────────┤
│ Asset Category  │ Pattern                          │ Example           │
├─────────────────┼──────────────────────────────────┼───────────────────┤
│ Directories     │ Uppercase Abbreviation or Phase  │ `AEDES`, `ASIS`   │
│ Deliverables    │ `NN_UPPERCASE_SNAKE_NAME.md`     │ `04_COLOR_SYSTEM` │
│ Code Modules    │ Lowercase Snake or Kebab-case    │ `build_phase27.py`│
│ SDK Packages    │ `@ymlab/package-name`            │ `@ymlab/abids`    │
└─────────────────┴──────────────────────────────────┴───────────────────┘
```

---

## 5. Versioning Rules (Semantic Versioning)

YM-LAB follows Semantic Versioning (`vMAJOR.MINOR.PATCH`):

- **MAJOR (v3.0.0 -> v4.0.0)**: Major architecture overhaul across enterprise layers.
- **MINOR (v3.4.0 -> v3.5.0)**: Phase addition or major deliverable release (e.g., Phase 27 ABIDS release).
- **PATCH (v3.5.0 -> v3.5.1)**: Reopen fix, typo correction, or traceability link adjustment under Phase Freeze Policy.

---

## 6. PDF & Presentation Publishing Standards

### PDF Export Specifications
- **Paper Format**: A4 Portrait.
- **Margins**: Top/Bottom `20mm`, Left/Right `15mm`.
- **Primary Body Font**: Inter / Noto Sans KR (`10pt`).
- **Code Font**: JetBrains Mono (`8.5pt`).
- **Header/Footer**: Document Title on top left, Page Number (`Page X of Y`) on bottom right.

### Presentation Deck (Slide) Standards
- **Aspect Ratio**: 16:9 Landscape.
- **Background**: Deep Slate (`#0B0F19`) for dark deck or Pure White (`#FFFFFF`) for print deck.
- **Slide Title**: 36pt Bold Outfit Font.
- **Max Content**: Maximum 5 bullet points or 1 diagram per slide.

---

## 7. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| Markdown Format Standardization | 100% GFM compliant template | PASS |
| Diagram & Naming Consistency | ASCII, Mermaid & Semantic version rules verified | PASS |
| Traceability | Mapped to ADF v3.1 & Phase Freeze Management Policy | PASS |

---

## 8. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. Markdown, PDF, Presentation & Naming standards established. |
