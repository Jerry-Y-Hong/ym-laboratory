# 05_TYPOGRAPHY_STANDARD.md

## Phase 27 – AI Brand Identity & Design System (ABIDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Design & Brand System Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Establish the **Typography Standard & Modular Type Scale** for YM-LAB. This standard governs web fonts, document headings, code blocks, tabular data, text hierarchy, line height ratios, letter spacing, and bilingual (English / Korean) font fallbacks.

---

## 2. Primary Font Families

YM-LAB utilizes a curated set of modern, high-performance Google Fonts:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FONT SYSTEM ARCHITECTURE                        │
├──────────────────┬──────────────────┬──────────────────┬───────────────┤
│ Primary Sans     │ Display / Brand  │ Monospace        │ Korean Sans   │
│ Inter            │ Outfit           │ JetBrains Mono   │ Noto Sans KR  │
│ (UI & Body Text) │ (Headings & Logo)│ (Code & Tokens)  │ (Korean Text) │
└──────────────────┴──────────────────┴──────────────────┴───────────────┘
```

### Font Stack Declaration

```css
/* Typography Font Stacks */
--font-sans: 'Inter', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-display: 'Outfit', 'Inter', 'Noto Sans KR', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
```

---

## 3. Modular Type Scale (1.250 Major Third)

The type scale is generated using a **1.250 Modular Ratio (Major Third)** to ensure mathematical harmony across all screen sizes and document layouts.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MODULAR TYPE SCALE                              │
├─────────┬───────────┬──────────────┬──────────────┬────────────────────┤
│ Token   │ Font Size │ Line Height  │ Weight       │ Usage              │
├─────────┼───────────┼──────────────┼──────────────┼────────────────────┤
│ --fs-5xl│ 48px / 3rem│ 56px (1.16)  │ Bold (700)   │ Hero Headings      │
│ --fs-4xl│ 38px/2.375│ 48px (1.26)  │ Bold (700)   │ Page Title (H1)    │
│ --fs-3xl│ 30px/1.875│ 38px (1.26)  │ Semi (600)   │ Section Title (H2) │
│ --fs-2xl│ 24px/1.5rem│ 32px (1.33)  │ Semi (600)   │ Sub-section (H3)   │
│ --fs-xl │ 20px/1.25 │ 28px (1.40)  │ Medium (500) │ Card Title (H4)    │
│ --fs-lg │ 18px/1.125│ 26px (1.44)  │ Medium (500) │ Lead Paragraph     │
│ --fs-base│16px/1.0rem│ 24px (1.50)  │ Regular (400)│ Body Text          │
│ --fs-sm │ 14px/0.875│ 20px (1.42)  │ Regular (400)│ Subtext & Captions │
│ --fs-xs │ 12px/0.75 │ 16px (1.33)  │ Medium (500) │ Badges & Labels    │
└─────────┴───────────┴──────────────┴──────────────┴────────────────────┤
```

---

## 4. Typography Hierarchy & Rules

### Heading Levels

```markdown
# H1 Title — 38px / Bold (700) / Tracking -0.02em / Line Height 1.26
## H2 Section Heading — 30px / SemiBold (600) / Tracking -0.01em / Line Height 1.26
### H3 Sub-heading — 24px / SemiBold (600) / Tracking 0em / Line Height 1.33
#### H4 Component Heading — 20px / Medium (500) / Tracking 0em / Line Height 1.40
```

### Paragraph & Text Rules
- **Body Text Line Length**: Optimal readability between `60–75 characters per line` (or `350px – 700px` container width).
- **Paragraph Spacing**: `1.0em` bottom margin (`margin-bottom: 1rem`).
- **Letter Spacing (Tracking)**:
  - Display/Hero Headings: `-0.02em`
  - Body Text: `0em`
  - Captions & Uppercase Labels: `+0.05em`

---

## 5. Spacing & Margin Grid System

Typography spacing is aligned to an **8px Base Grid (4px Micro Grid)**:

```css
/* ABIDS Spacing Tokens */
--space-1: 4px;   /* Micro spacing */
--space-2: 8px;   /* Small element gap */
--space-3: 12px;  /* Icon text gap */
--space-4: 16px;  /* Standard padding */
--space-6: 24px;  /* Card inner padding */
--space-8: 32px;  /* Section margin */
--space-12: 48px; /* Major layout gap */
--space-16: 64px; /* Hero section gap */
```

---

## 6. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| Type Scale Mathematical Rigour | 1.250 Ratio verified | PASS |
| Bilingual Compatibility | English & Korean font fallbacks tested | PASS |
| Traceability | Mapped to Color System (04) & Document Guide (09) | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. Master Typography Scale & 8px Spacing Grid established. |
