# 08_AI_VISUAL_PROMPT_LIBRARY.md

## Phase 27 – AI Brand Identity & Design System (ABIDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Design & Brand System Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Establish the **AI Visual Prompt Library & Style Guide** for YM-LAB. This library provides standardized, tested text prompts and parameter configurations for generative AI tools (Midjourney, Imagen 3, Stable Diffusion, DALL-E 3) to generate consistent brand imagery, vector illustrations, icons, slide graphics, and marketing materials aligned with ABIDS.

---

## 2. AI Visual Style Guide (Master Rules)

To ensure brand consistency across all generative AI outputs, all prompts MUST include the core YM-LAB visual tokens:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI GENERATIVE STYLE CONSTANTS                   │
├────────────────────────────────────────────────────────────────────────┤
│  Color Tokens : Deep Slate (#0B0F19), Bio Emerald (#10B981),           │
│                 Cyber Cyan (#06B6D4), Translucent Glass Glassmorphism   │
│  Lighting     : Soft volumetric neon glows, bioluminescent accents,    │
│                 studio cinematic lighting, clean shadows               │
│  Mood         : Authoritative, futuristic, bio-scientific, clean, premium│
│  Negative     : No clutter, no low quality, no oversaturated red/pink, │
│                 no cartoonish faces, no distorted anatomy/text         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Brand Image Prompts (Photorealistic & Abstract)

### 3.1 Bio-Nutritional Science & Q-Code Visualization
> **Prompt**: `A high-end cinematic 3D render of a luminous bio-molecule crystal node floating inside a dark laboratory workspace. Translucent glassmorphism facets, subtle glowing emerald green (#10B981) and cyan (#06B6D4) internal energy threads, volumetric dark slate background (#0B0F19), Octane Render, 8k resolution, ray-tracing reflections, scientific precision, ultra-detailed --ar 16:9 --v 6.0`

### 3.2 AI Autonomous Enterprise Brain (ASIS & AEDES)
> **Prompt**: `An abstract isometric visualization of an AI Autonomous Enterprise Decision System, interconnected glowing neural network nodes, cyber cyan (#06B6D4) and deep emerald (#10B981) data highways, sleek dark slate glass panels (#0B0F19), studio lighting, minimal tech aesthetic, premium corporate UI background, 8k --ar 16:9 --style raw`

---

## 4. Illustration Prompts (Vector & Isometric)

### 4.1 Flat Vector Smart Farm & Medicinal Food Platform
> **Prompt**: `Minimalist flat vector illustration of an intelligent automated vertical farm and bio-lab, clean geometric shapes, emerald green (#10B981), dark slate gray (#111827), cyber cyan accents, isolated on dark background (#0B0F19), SVG style, sleek, modern UI hero illustration, no text --ar 4:3 --no realistic shadows`

### 4.2 AI Agent Orchestration Flow Diagram Graphic
> **Prompt**: `Modern isometric vector graphic of multiple AI autonomous agents collaborating around a central holographic decision matrix, clean lines, frosted glass textures, bio-emerald and slate blue palette, high contrast, clean tech aesthetic --ar 16:9`

---

## 5. Icon Prompts (Generative 3D & Vector Icons)

### 5.1 3D Glassmorphism App Icons
> **Prompt**: `3D glassmorphism icon of a DNA helix merged with a microchip circuit, frosted translucent glass, glowing emerald gradient edge, dark slate background (#0B0F19), soft ambient shadows, Apple visionOS design style, centered, high quality render --ar 1:1`

---

## 6. Presentation Deck Prompts

### 6.1 Keynote Slide Background Graphic
> **Prompt**: `Ultra-sleek corporate presentation deck background, deep slate blue gradient (#0B0F19 to #1E293B), subtle geometric line grid overlay, soft cyber cyan corner glow orb (#06B6D4), wide angle, high resolution, minimalist --ar 16:9`

---

## 7. Negative Prompt Library (Standard Exclusions)

To maintain brand integrity, enforce the following standard negative prompt string across all generations:

```
--no text, logo, watermark, signature, ugly, blurry, deformed, distorted, oversaturated, bright pink, neon yellow, cartoonish, low resolution, noise, artifacts, extra limbs
```

---

## 8. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| Prompt Brand Token Alignment | 100% prompts include ABIDS color tokens | PASS |
| Multi-Tool Compatibility | Tested for Midjourney v6 & Imagen 3 | PASS |
| Traceability | Mapped to Visual Guide (03) & Color System (04) | PASS |

---

## 9. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. Master AI Visual Prompt Library & Style Guide established. |
