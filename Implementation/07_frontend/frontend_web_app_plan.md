# YM-LAB Editorial & Governance Dashboard Frontend Specification

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Implementation Layer** : 07_frontend  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. ACPP Component Mapping
- **Mapped Architecture Artifacts**: [`PILOT_PROJECT_PLAN.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/PILOT_PROJECT_PLAN.md), [`ACPP_WORKFLOW_STANDARD.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_WORKFLOW_STANDARD.md)
- **Primary Scope**: Human-in-the-loop Editorial Dashboard, **Phase 37 AEGS Human Approval Gate Interface**, content draft inspection UI, and performance analytics telemetry visualization.

---

## 2. Implementation Objectives
1. Build the web interface allowing human editors to review generated content packages (Blog, Typst PDF, Marp Slide outlines).
2. Implement the **Human Approval Gate Interface** where editors issue or reject `HumanApprovalToken` (`HA-TOKEN-*`).
3. Display real-time pipeline status, vector index search interfaces, and post-publication Content Effectiveness Index (CEI) metrics.

---

## 3. Technical Specifications

### 3.1 Frontend Dashboard Architecture & UI Modules
```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    ACPP EDITORIAL DASHBOARD UI TOPOLOGY                 │
├─────────────────────────────────────────────────────────────────────────┤
│ Module 1: Knowledge Search & Ingestion Trigger                          │
│   ├── Vector Similarity Search (Query SSOT Knowledge Assets)            │
│   └── Trigger New Research Task (Agent-01 Dispatch)                     │
├─────────────────────────────────────────────────────────────────────────┤
│ Module 2: Content Draft Inspector & Multi-Channel Preview               │
│   ├── Render Blog Draft (Markdown + HTML Preview)                       │
│   ├── Render Typst PDF Technical Brief                                  │
│   └── Render Marp Presentation Slide Deck                               │
├─────────────────────────────────────────────────────────────────────────┤
│ Module 3: AEGS Human Approval Gate Control Center                       │
│   ├── Inspect Fact Verification Score & Source Citations                │
│   ├── Action: ISSUE APPROVAL TOKEN (`HA-TOKEN-2026-OK`)                 │
│   └── Action: REJECT DRAFT (Input Rejection Feedback)                   │
├─────────────────────────────────────────────────────────────────────────┤
│ Module 4: Telemetry & Analytics Dashboard                               │
│   ├── Display Content Effectiveness Index (CEI Score Gauge)             │
│   └── Display Traffic, Dwell Time, and Social Shares Charts             │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 UI Technology Stack Alignment
- **Framework**: Next.js 14 / Vite + React 18 + TypeScript.
- **Design System Alignment**: **Phase 28 AFDS (AI Frontend Design System)** components and **Phase 27 ABIDS** brand guidelines.
- **State Management**: React Query / TanStack Query for REST API polling and telemetry webhooks.

---

## 4. Dependencies & Implementation Sequence
1. **Dependencies**: Layer 02 (`02_system_architecture`), Layer 06 (`06_api`), Phase 28 AFDS component library.
2. **Implementation Sequence**:
   - Step 1: Scaffold Next.js / Vite web application shell.
   - Step 2: Implement Draft Preview components (Markdown, Typst PDF viewer, Marp HTML viewer).
   - Step 3: Implement Human Approval Gate modal issuing `HumanApprovalToken` to `/api/v1/publishing/dispatch`.
   - Step 4: Implement Analytics Telemetry charts.

---

## 5. Validation Checklist
- [x] Dashboard UI complies 100% with Phase 28 AFDS visual standards.
- [x] Human Approval Gate modal issues cryptographically signed `HumanApprovalToken`.
- [x] Multi-channel preview renders Blog Markdown, Typst PDF, and Marp Slides cleanly.
- [x] Real-time pipeline status updates without full page reload.

---

## 6. Completion Criteria
- Frontend unit and UI integration tests (`npm run test:ui`) pass 100%.
- Interface satisfies all human governance requirements specified in [`ACPP_WORKFLOW_STANDARD.md`](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/ACPP_WORKFLOW_STANDARD.md).
