# 02_DESIGN_TOKENS_SYSTEM.md

## Phase 28 – AI Frontend Design System (AFDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Frontend UI Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Establish the **Design Tokens System Infrastructure** for YM-LAB. Design tokens represent the foundational design decisions (colors, typography, spacing, shadows, borders, z-index, animations) stored as technology-agnostic data (W3C standard JSON) and rendered as CSS Custom Properties and TypeScript constant dictionaries.

---

## 2. Token Classification & Taxonomy

Design tokens in AFDS are structured into three distinct tiers:

1. **Global Tokens (Primitive)**: Raw values (e.g., `color.emerald.500 = #10B981`).
2. **Semantic Tokens (Alias)**: Purpose-driven abstractions (e.g., `color.interactive.cta = var(--afds-color-emerald-500)`).
3. **Component Tokens (Scoped)**: Element-level definitions (e.g., `button.primary.bg = var(--afds-color-interactive-cta)`).

---

## 3. Core Design Token Specifications

### 3.1 Color Tokens

```css
:root {
  /* Primitive Colors */
  --afds-color-emerald-500: #10B981;
  --afds-color-emerald-600: #059669;
  --afds-color-cyan-500: #06B6D4;
  --afds-color-gray-900: #0B0F19;
  --afds-color-gray-800: #111827;
  --afds-color-gray-100: #F9FAFB;

  /* Semantic Theme Tokens - Dark Mode Default */
  --afds-bg-app: var(--afds-color-gray-900);
  --afds-bg-surface: rgba(17, 24, 39, 0.75);
  --afds-border-default: rgba(255, 255, 255, 0.10);
  --afds-text-primary: var(--afds-color-gray-100);
  --afds-text-muted: #9CA3AF;
  --afds-accent-ai: var(--afds-color-cyan-500);
}
```

### 3.2 Typography Tokens

| Token Name | Font Family / Size / Weight / Line Height | Purpose |
|---|---|---|
| `--afds-font-heading` | `'Outfit', sans-serif, 2rem (32px), 700, 1.25` | Section & Card Headers |
| `--afds-font-body` | `'Inter', sans-serif, 1rem (16px), 400, 1.5` | Standard Body Content |
| `--afds-font-code` | `'JetBrains Mono', monospace, 0.875rem (14px), 500, 1.4` | Code & Terminal Output |

### 3.3 Spacing & Radius Tokens

```css
:root {
  --afds-space-1: 4px;
  --afds-space-2: 8px;
  --afds-space-3: 12px;
  --afds-space-4: 16px;
  --afds-space-6: 24px;
  --afds-space-8: 32px;

  --afds-radius-sm: 6px;
  --afds-radius-md: 10px;
  --afds-radius-lg: 16px;
  --afds-radius-full: 9999px;
}
```

### 3.4 Elevation & Backdrop Blur Tokens

```css
:root {
  --afds-backdrop-blur: blur(16px);
  --afds-shadow-glass: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  --afds-shadow-glow-ai: 0 0 20px rgba(6, 182, 212, 0.25);
  --afds-z-dropdown: 1000;
  --afds-z-modal: 2000;
  --afds-z-toast: 3000;
}
```

---

## 4. W3C Standard JSON Token Dictionary

```json
{
  "color": {
    "brand": {
      "primary": { "$type": "color", "$value": "#10B981" },
      "secondary": { "$type": "color", "$value": "#06B6D4" }
    }
  },
  "elevation": {
    "card": {
      "blur": { "$type": "dimension", "$value": "16px" },
      "border": { "$type": "color", "$value": "rgba(255, 255, 255, 0.10)" }
    }
  }
}
```

---

## 5. Traceability & Cross-References

- [04_COLOR_SYSTEM.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ABIDS/04_COLOR_SYSTEM.md) - ABIDS Palette Source
- [05_TYPOGRAPHY_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ABIDS/05_TYPOGRAPHY_STANDARD.md) - ABIDS Type Scale
- [01_AFDS_MASTER_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/01_AFDS_MASTER_STANDARD.md) - Master Architecture

---

## 6. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| W3C Format Compliance | Standard JSON & CSS Variables defined | PASS |
| Token Coverage | Color, Type, Space, Radius, Shadow, Z-Index | PASS |
| Cross-Reference | Resolved to ABIDS tokens | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. Design Tokens Infrastructure established. |
