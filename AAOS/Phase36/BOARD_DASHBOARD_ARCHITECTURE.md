# Board Dashboard Architecture

## Vision
The **Enterprise Oversight Portal** is the visual front‑end of the **AI Enterprise Board Management System (AEBMS)**. It provides **Project Owners** and **Authorized Governance Reviewers** with a **premium, glass‑morphic, dark‑mode web portal** that delivers real‑time insight into enterprise health, alerts, and strategic metrics while preserving strict read‑only access.

## Technology Stack
- **Framework**: React with Vite (fast dev server, hot‑module replacement)
- **Styling**: Vanilla CSS using CSS Variables for theming (dark / light toggle)
- **Typography**: Google Font **Inter** – modern, legible
- **Charts**: Apache ECharts (via the `visualization` MCP tool) for responsive SVG charts
- **Authentication**: OAuth 2.0 with MFA, token stored in HttpOnly secure cookies
- **API Layer**: Consumption of the **AEBMS Review API** (read‑only endpoints) – Board Policy Engine, Health Model, Alert Bus
- **State Management**: React Context + hooks (no external heavy libraries to keep bundle lightweight)

## Navigation Structure
| Section |
|---------|
| Overview |
| Enterprise Health |
| Risk |
| Policy |
| Security |
| Finance |
| Strategy |
| Performance |
| Resources |
| Compliance |
| Alerts |
| Audit Log |
| Reports |

## Layout Overview
```
+-----------------------------------------------------------+
| Header – Branding, Portal Name, User Avatar (top‑right)   |
+-----------------------------------------------------------+
| Sidebar – Navigation (list of sections above)            |
+-----------------------------------------------------------+
| Main Content – Dynamic panels based on selected section   |
|   • Overview Card (Enterprise Health Score, status)      |
|   • Alerts Feed (live, filterable, severity badges)      |
|   • Domain Scores (Radar chart – Risk, Policy, …)        |
|   • Review Recommendations (list with **Acknowledge**)   |
|   • Audit Log (immutable, searchable)                    |
+-----------------------------------------------------------+
| Footer – Last refreshed timestamp, version info           |
+-----------------------------------------------------------+
```

## Visual Design Details
- **Glassmorphism panels**: backdrop‑filter blur with semi‑transparent background (`rgba(255,255,255,0.08)` on dark theme).
- **Dynamic gradients**: Header uses a subtle violet‑to‑indigo gradient.
- **Micro‑animations**: Hover lifts panels, smooth transition for chart updates, pulse animation for **Critical** alerts.
- **Responsive**: Mobile‑first layout; sidebar collapses into a hamburger menu.

## Core Components
| Component | Description |
|-----------|-------------|
| `HealthCard` | Shows Enterprise Health score, status badge (Excellent/Healthy/Warning/Critical) with animated circular progress.
| `AlertList` | Paginated, filterable list of alerts; each item shows severity color, timestamp, and quick‑view modal.
| `DomainRadar` | ECharts radar chart rendering the eight domain scores.
| `ReviewRecList` | Table of latest review recommendations with **Acknowledge** button (writes immutable acknowledgment record).
| `AuditLogViewer` | Searchable view of audit entries; supports CSV export.
| `ThemeToggle` | Switch between Dark and Light themes (persisted in local storage).

## Dashboard Status Indicators
- Enterprise Health
- Enterprise Status
- Governance Status
- Escalation Level
- Review Cycle
- Active Alerts
- Critical Events
- Trend Analysis
- Recommendations
- Audit Log Status

## API Endpoints (Read‑Only)
```json
GET /api/health               -> { enterpriseHealth, status, scores[] }
GET /api/alerts?since=ISO8601 -> [ alertObjects ]
GET /api/review/recommendations -> [ recommendationObjects ]
GET /api/review               -> { domain: string, score: number, confidence: number }
GET /api/audit-log?filter=…   -> [ auditEntries ]
```
All responses are signed with the AEBMS KMS key for integrity verification.

## Role‑Based Access (RBAC)
Authorized roles include:
- **Project Owner** – full read‑only visibility.
- **Finance Reviewer** – access to Finance and Enterprise Health sections.
- **Security Reviewer** – access to Security and Risk sections.
- **Compliance Reviewer** – access to Compliance and Policy sections.
- **Strategy Reviewer** – access to Strategy and Performance sections.
Roles are defined in `BOARD_POLICIES.md`; RBAC enforcement ensures no role can perform operational actions.

## Security Controls
- **RBAC**: Governance roles limit endpoint visibility and UI component access.
- **Content‑Security‑Policy**: Strict CSP header to prevent XSS.
- **Sub‑resource Integrity**: SRI hashes for external scripts (ECharts, fonts).

## Dashboard Principles
- **Read‑Only** – No actions can modify enterprise state.
- **Independent** – Operates solely as an oversight portal.
- **Non‑Executing** – No execution or approval capabilities.
- **Governance‑Focused** – All data presented for governance review.
- **Policy‑Driven** – Recommendations are derived from Board Review Agents.
- **Audit‑Traceable** – Every view, acknowledgment, and export is logged immutably.
- **Early‑Warning First** – Alerts are highlighted prominently.
- **Vendor Neutral** – Utilises open‑source frameworks and standards.

## Deployment Architecture
- Containerized as a **stateless Docker image**.
- Served behind the **AEMS API Gateway** (receives telemetry via the gateway but does not participate in execution).
- Auto‑scaled via Kubernetes Horizontal Pod Autoscaler based on CPU/Memory metrics.
- Remains logically independent from the AEMS execution layer; AEBMS performs only oversight.

---
*This document defines the high‑fidelity UI/UX and technical blueprint for the AEBMS Enterprise Oversight Portal.*
