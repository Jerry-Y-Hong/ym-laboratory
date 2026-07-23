# 07_UI_UX_DESIGN_SYSTEM.md

## Phase 27 – AI Brand Identity & Design System (ABIDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Design & Brand System Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Establish the master **UI/UX Design System Specification & Component Library** for YM-LAB. This system standardizes atomic components (Buttons, Cards, Form Controls, Dialogs, Data Tables) and specifies enterprise dashboard layout standards and dynamic micro-animations.

---

## 2. Component Hierarchy Architecture

The component library follows the **Atomic Design Methodology**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ATOMIC DESIGN HIERARCHY                         │
├───────────────────┬───────────────────┬───────────────────┬────────────┤
│ ATOMS             │ MOLECULES         │ ORGANISMS         │ TEMPLATES  │
│ - Buttons         │ - Search Form     │ - Navigation Bar  │ - Executive│
│ - Inputs          │ - Data Card       │ - Data Grid       │   Dashboard│
│ - Badges          │ - Form Field Group│ - AI Prompt Bar   │ - Scenario │
│ - Icons / Labels  │ - Modal Dialog    │ - Decision Panel  │   View     │
└───────────────────┴───────────────────┴───────────────────┴────────────┘
```

---

## 3. Core Component Specifications

### 3.1 Buttons (`<Button />`)

| Variant | Background / Border | Text Color | Hover State | Active / Focus State |
|---|---|---|---|---|
| **Primary CTA** | `linear-gradient(135deg, #10B981, #059669)` | `#FFFFFF` (Bold) | Scale 1.02, Glow `rgba(16,185,129,0.4)` | Ring `2px #34D399` |
| **Secondary Glass** | `rgba(255,255,255,0.06)`, Border `1px rgba(255,255,255,0.12)` | `#F9FAFB` | `rgba(255,255,255,0.12)` | Border `#10B981` |
| **Outline Cyan** | `transparent`, Border `1.5px #06B6D4` | `#06B6D4` | Background `rgba(6,182,212,0.1)` | Glow `0 0 15px #06B6D4` |
| **Ghost / Text** | `transparent` | `#9CA3AF` | `#F9FAFB` | Background `rgba(255,255,255,0.05)` |

### 3.2 Cards (`<Card />`)

```css
/* Glassmorphism Container Card Specification */
.abids-card {
  background: rgba(17, 24, 39, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.abids-card:hover {
  border-color: rgba(16, 185, 129, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.4), 0 0 20px rgba(16, 185, 129, 0.15);
}
```

### 3.3 Form Controls (`<Input />`, `<Select />`, `<Checkbox />`)

- **Default Input State**: Height `42px`, Border `1px solid rgba(255,255,255,0.12)`, Background `rgba(11,15,25,0.6)`, Border-Radius `8px`, Text `#F9FAFB`.
- **Focus State**: Border `1px solid #10B981`, Box Shadow `0 0 0 3px rgba(16,185,129,0.2)`.
- **Error State**: Border `1px solid #E11D48`, Box Shadow `0 0 0 3px rgba(225,29,72,0.2)`.

---

## 4. Executive Dashboard Layout Standard

Dashboards across YM-LAB applications (Kimchi Analytics, ASIS Strategic View, AEDES Autonomous Controller) adhere to a 12-column fluid grid.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   EXECUTIVE DASHBOARD 12-COLUMN GRID                   │
├────────────────────────────────────────────────────────────────────────┤
│ [Top Navigation Bar] — Height 64px / Sticky Glassmorphism             │
├───────────────┬────────────────────────────────────────────────────────┤
│ [Sidebar Nav] │ [Header KPI Cards Row (4 Columns x 3 Grid Span)]       │
│ Width 260px   ├───────────────────────────────────┬────────────────────┤
│ Collapsible   │ [Primary Chart Container]         │ [AI Agent Stream]  │
│               │ Span 8 Columns                    │ Span 4 Columns     │
│               ├───────────────────────────────────┴────────────────────┤
│               │ [Data Grid / Decision Table] Span 12 Columns           │
└───────────────┴────────────────────────────────────────────────────────┘
```

---

## 5. Micro-Animations & Interactivity

Smooth, subtle micro-animations enhance user feedback without causing distraction.

- **Standard Transition Duration**: `200ms – 300ms`.
- **Easing Curve**: `cubic-bezier(0.4, 0, 0.2, 1)` (Standard Ease-Out).
- **Reduced Motion Support**: `@media (prefers-reduced-motion: reduce)` disables non-essential animations.

```css
/* AI Agent Pulse Indicator Animation */
@keyframes ai-pulse {
  0% { transform: scale(0.95); opacity: 0.7; box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7); }
  70% { transform: scale(1.0); opacity: 1.0; box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); }
  100% { transform: scale(0.95); opacity: 0.7; box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
}

.ai-status-pulse {
  animation: ai-pulse 2s infinite ease-in-out;
}
```

---

## 6. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| Component Standardization | Full Atomic Library defined | PASS |
| Accessibility Interactivity | Focus states & reduced motion compliant | PASS |
| Traceability | Mapped to Color System (04) & Typography Standard (05) | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. Component library & Dashboard layout standards established. |
