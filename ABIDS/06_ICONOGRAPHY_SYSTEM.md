# 06_ICONOGRAPHY_SYSTEM.md

## Phase 27 – AI Brand Identity & Design System (ABIDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Design & Brand System Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Establish the **Iconography & Visual Language System** for YM-LAB. This document defines icon geometry, stroke weights, icon categories, duotone/outlined icon styles, vector illustration rules, graphic background elements, and AI-generated iconography specifications.

---

## 2. Iconography Style & Geometry

YM-LAB icons are modern, minimalist, geometric, and designed on a **24x24 pixel grid** with rounded stroke caps (`stroke-linecap: round; stroke-linejoin: round;`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ICONOMETRIC SPECIFICATIONS                      │
├───────────────────┬───────────────────┬───────────────────┬────────────┤
│ Base Grid         │ Primary Stroke    │ Corner Radius     │ Style      │
│ 24px x 24px       │ 1.75px (or 2.0px) │ 2px - 4px         │ Outlined / │
│ (Live Area 20px)  │ Solid Vector      │ Smooth Join       │ Duotone    │
└───────────────────┴───────────────────┴───────────────────┴────────────┘
```

```
┌─────────────────────────┐
│     24px ICON GRID      │
│  ┌───────────────────┐  │
│  │ 2px PADDING       │  │
│  │  ┌─────────────┐  │  │
│  │  │ 20px x 20px │  │  │
│  │  │ LIVE AREA   │  │  │
│  │  └─────────────┘  │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

---

## 3. Icon Categories & Usage

1. **System & Navigation Icons**: Arrows, menus, settings, search, user profiles, notifications (`Lucide React` icon set foundation).
2. **AI & Autonomous Agents Icons**: Brain nodes, sparkle stars, neural graph, autonomous execution loop, decision tree.
3. **Bio-Nutritional & Life Science Icons**: Leaf/herb, Q-Code molecule, DNA helix, pill/capsule, health score metric.
4. **Data Analytics & Platform Icons**: Bar chart, Pareto frontier, database stack, shield/lock, code terminal.

### Icon Variant Matrix

| Category | Primary Color | Secondary Accent Fill | Icon Variant |
|---|---|---|---|
| Active System Icon | `--color-brand-emerald-500` | `rgba(16, 185, 129, 0.15)` | Duotone Active |
| AI Agent Node Icon | `--color-brand-cyan-500` | `rgba(6, 182, 212, 0.2)` | Glowing Duotone |
| Inactive Navigation| `--text-muted` (`#6B7280`) | None | Outlined Monochrome |

---

## 4. Vector Illustration Guidelines

YM-LAB vector illustrations are used in hero section backgrounds, empty states, onboarding cards, and AI report covers.

### Illustration Principles
1. **Geometric Precision**: Clean lines, subtle 3D isometric perspectives, and glassmorphism layered elements.
2. **Color Palette Harmony**: Dark slate base background with glowing bio-emerald and cyber-cyan vector accents.
3. **Abstract Bio-Tech Synthesis**: Combining organic botanical line art with digital neural network nodes.
4. **No Cartoonish Distortions**: Maintain scientific authority; avoid overly playful or childish shapes.

```
┌────────────────────────────────────────────────────────────────────────┐
│                    ILLUSTRATION VISUAL COMPOSITION                     │
├────────────────────────────────────────────────────────────────────────┤
│  [Background Layer] : Dark Slate Overlay (#0B0F19, 90% opacity)        │
│  [Midground Layer]  : Isometric Grid & Neural Node Connections         │
│  [Foreground Layer] : Bio-Molecule / Q-Code Glowing Crystal Core       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Graphic Elements & AI Design Accents

- **Neural Grid Lines**: 1px subtle glowing grid overlays (`rgba(255,255,255,0.05)`) behind dynamic data dashboards.
- **Glassmorphism Panels**: Backdrop blur cards with `1px` translucent borders for floating controls.
- **Glow Spheres (Orb Light)**: Radial gradient background glows positioned behind key CTA sections or AI agent active states.

```css
/* Decorative Glow Orb CSS */
.ai-glow-orb {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(6,182,212,0.10) 50%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
}
```

---

## 6. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| Iconometry Standardization | 24px grid & 1.75px stroke enforced | PASS |
| Brand Visual Alignment | Bio-Tech & AI theme consistency verified | PASS |
| Traceability | Mapped to Color System (04) & Prompt Library (08) | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. Iconography grid, vector illustration rules, and graphic elements established. |
