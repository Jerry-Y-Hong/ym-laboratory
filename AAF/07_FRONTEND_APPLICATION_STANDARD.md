# 07_FRONTEND_APPLICATION_STANDARD.md

## Phase 29 – AI Application Framework (AAF)

**Version** : v3.8.0  
**Status** : Closed & Frozen  
**Architecture Level** : AI Application Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Overview & Relationship to Phase 28 (AFDS)

The **Frontend Application Standard** defines screen composition, client-side routing, frontend state management, layout integration, and navigation standards for web and desktop applications in the YM-LAB Enterprise Ecosystem.

> [!IMPORTANT]
> **Integration Boundary**: This deliverable references **Phase 28: AI Frontend Design System (AFDS)** as its single source of truth for UI design tokens, atomic component specifications, responsive grid rules, and glassmorphic elevations. It DOES NOT duplicate AFDS component definitions.

---

## 2. Screen Composition & Layout Integration

AAF applications compose screens using the 12-column responsive layout grid and elevation system defined in **AFDS (Phase 28 Deliverables 03 & 04)**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      AFDS Main Application Shell                       │
├───────────────┬────────────────────────────────────────────────────────┤
│ Navigation    │ Screen Header / Breadcrumbs (AFDS Header)              │
│ Sidebar       ├────────────────────────────────────────────────────────┤
│ (AFDS Panel)  │ Application Workspace / Dynamic View Area               │
│               │ - AI Reasoning Panel (AFDS CoT Component)              │
│               │ - Interactive Data Grid / Canvas                       │
├───────────────┴────────────────────────────────────────────────────────┤
│ Status Bar / Real-Time SSE Connection Indicator                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Application Routing & Navigation

- **Router Architecture**: Declarative nested routing (React Router / Next.js App Router).
- **Navigation Guard**: Synchronous permission checks before route resolution based on backend JWT scopes.
- **Dynamic Micro-Frontend Routes**: Dynamic route registration for dynamic plugins and micro-app containers (**Deliverable 03**).

---

## 4. Client-Side State Management

AAF applications implement the 4-tier state model established in **Phase 28 (AFDS Deliverable 06)**:

1. **Local View State**: Component-level React `useState` / `useReducer`.
2. **Global App State**: Zustand / Redux Toolkit for UI drawers, user profiles, and active themes.
3. **Server Cache State**: TanStack Query (React Query) for API data caching and invalidation.
4. **Real-time Event State**: Event bus SSE stream listeners for real-time AI reasoning token delivery.

---

## 5. Accessibility & Responsive Standards

- Adheres strictly to **WCAG 2.1 AAA Accessibility** guidelines defined in **AFDS (Phase 28 Deliverable 07)**.
- Full keyboard navigation, ARIA live regions for streaming AI text responses, and focus trap management.

---

## 6. Self Review & Validation

| Validation Item | Required Standard | Result |
|---|---|---|
| AFDS Reference Check | Zero duplication of Phase 28 AFDS components | PASS |
| Routing & Navigation | Declarative nested routing with permission guards | PASS |
| State Management | 4-tier state architecture compliant | PASS |
| Accessibility | WCAG 2.1 AAA standards referenced | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.8.0 | 2026-07-22 | Antigravity (AI) | Initial release. Frontend Application Standard established. |
