# 04_LAYOUT_GRID_SYSTEM.md

## Phase 28 – AI Frontend Design System (AFDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Frontend UI Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Establish the **Layout Grid & Glassmorphism Elevation System Architecture** for YM-LAB. This system provides a fluid, responsive 12-column grid framework and a layered glassmorphic surface hierarchy across all enterprise web applications, dashboards, and AI portals.

---

## 2. Responsive Breakpoint Specification

AFDS defines five (5) standardized viewport breakpoints:

| Tier | Breakpoint Key | Viewport Range | Columns | Gutter Width | Container Max-Width |
|---|---|---|---|---|---|
| **Mobile** | `xs` / `sm` | `< 640px` | 4 | 16px | 100% (Fluid) |
| **Tablet** | `md` | `640px – 1023px` | 8 | 20px | 720px |
| **Desktop** | `lg` | `1024px – 1439px` | 12 | 24px | 960px |
| **Wide** | `xl` | `1440px – 1919px` | 12 | 24px | 1360px |
| **Ultrawide** | `2xl` | `≥ 1920px` | 12 | 32px | 1760px |

---

## 3. Glassmorphic Elevation Layer Architecture

To create clear visual depth and hierarchy, AFDS establishes four (4) glassmorphic surface elevation layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   GLASSMORPHIC ELEVATION STACK                         │
├────────────────────────────────────────────────────────────────────────┤
│ Level 3: Overlay (Modals, Toasts, Tooltips) -> Blur 24px / Shadow High │
├────────────────────────────────────────────────────────────────────────┤
│ Level 2: Floating Panels (Copilot, Drawers)  -> Blur 16px / Border High│
├────────────────────────────────────────────────────────────────────────┤
│ Level 1: Surface Containers (Cards, Grids)   -> Blur 12px / Border Soft│
├────────────────────────────────────────────────────────────────────────┤
│ Level 0: App Background                       -> Dark Gradient #0B0F19 │
└────────────────────────────────────────────────────────────────────────┘
```

### CSS Surface Definitions

```css
/* Level 1: Standard Card Surface */
.afds-surface-l1 {
  background: rgba(17, 24, 39, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: var(--afds-radius-md);
}

/* Level 2: Floating AI Panel */
.afds-surface-l2 {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(6, 182, 212, 0.25);
  box-shadow: var(--afds-shadow-glow-ai);
}

/* Level 3: Modal Dialog Overlay */
.afds-surface-l3 {
  background: rgba(11, 15, 25, 0.92);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}
```

---

## 4. Grid Template Formats

```css
/* Enterprise Dashboard Grid Template */
.afds-grid-dashboard {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--afds-space-6);
}

.afds-col-span-12 { grid-column: span 12; }
.afds-col-span-8  { grid-column: span 8; }
.afds-col-span-4  { grid-column: span 4; }

@media (max-width: 1023px) {
  .afds-col-span-8, .afds-col-span-4 {
    grid-column: span 12;
  }
}
```

---

## 5. Traceability & Cross-References

- [07_UI_UX_DESIGN_SYSTEM.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ABIDS/07_UI_UX_DESIGN_SYSTEM.md) - ABIDS Layout Grid
- [02_DESIGN_TOKENS_SYSTEM.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/02_DESIGN_TOKENS_SYSTEM.md) - Design Tokens
- [01_AFDS_MASTER_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/01_AFDS_MASTER_STANDARD.md) - Master Standard

---

## 6. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| Breakpoints | 5 Viewport Breakpoints defined | PASS |
| Glassmorphic Layering | 4 Elevation Layers specified | PASS |
| Cross-Reference | Mapped to ABIDS & AFDS Tokens | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. Layout Grid & Glassmorphism Elevation System created. |
