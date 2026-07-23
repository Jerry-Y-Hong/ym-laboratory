# 09_DEVELOPMENT_DX_TOOLING.md

## Phase 28 – AI Frontend Design System (AFDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Frontend UI Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Establish the **Developer Experience (DX), Storybook, Testing & Tooling Infrastructure** for the YM-LAB Enterprise Ecosystem. AFDS provides standardized developer tooling to streamline component development, automated testing, code generation, and CI/CD validation.

---

## 2. DX & Tooling Suite Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                   AFDS DEVELOPER TOOLING ECOSYSTEM                     │
├───────────────────┬───────────────────┬───────────────────┬────────────┤
│ STORYBOOK CATALOG │ AUTOMATED TESTING │ CODE GENERATORS   │ CI/CD      │
│ - Interactive Docs│ - Jest / RTL      │ - Component CLI   │ - Bundle   │
│ - Visual Specs    │ - Playwright E2E  │ - Token Exporter  │   Analyzer │
│ - Accessibility   │ - TestSprite AI   │ - Scaffolding     │ - Linter   │
└───────────────────┴───────────────────┴───────────────────┴────────────┘
```

---

## 3. Tooling Specifications

### 3.1 Storybook Documentation Standard (`.stories.tsx`)

Every component in `@ymlab/afds-ui` MUST include a corresponding Storybook story file demonstrating all variants, dark/light themes, and interactive controls.

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'AFDS/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimaryCTA: Story = {
  args: {
    variant: 'primary',
    children: 'Execute Decision',
  },
};
```

### 3.2 Automated Testing Pipeline

- **Unit Testing (Jest + React Testing Library)**: Validates component rendering, prop variations, and synthetic user events (100% component code coverage requirement).
- **End-to-End & Visual Regression (Playwright)**: Captures screenshot baselines across all 5 responsive breakpoints.
- **AI-Driven Automated Testing (TestSprite)**: Executes dynamic frontend user-journey tests for streaming AI components.

---

## 4. Code Generation CLI (`@ymlab/cli`)

Developers can scaffold AFDS-compliant components using the official CLI:

```bash
# Scaffold a new AFDS Molecule Component
npx @ymlab/cli generate component --name PromptInputBar --type molecule
```

---

## 5. Traceability & Cross-References

- [03_ATOMIC_COMPONENT_LIBRARY.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/03_ATOMIC_COMPONENT_LIBRARY.md) - Component Library
- [08_MICRO_FRONTEND_ARCHITECTURE.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/08_MICRO_FRONTEND_ARCHITECTURE.md) - MFE Architecture
- [01_AFDS_MASTER_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/01_AFDS_MASTER_STANDARD.md) - Master Architecture

---

## 6. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| Storybook Standard | `.stories.tsx` structure defined | PASS |
| Automated Testing | Jest, Playwright, TestSprite integration defined | PASS |
| CLI Scaffolding | `@ymlab/cli` code generator specified | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. DX & Development Tooling specification created. |
