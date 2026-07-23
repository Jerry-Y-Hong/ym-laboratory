# 08_MICRO_FRONTEND_ARCHITECTURE.md

## Phase 28 – AI Frontend Design System (AFDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Frontend UI Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Define the **Enterprise Micro-Frontend (MFE) Architecture & Shared SDK Integration Standard** for YM-LAB. AFDS utilizes Webpack/Vite Module Federation to decouple large-scale enterprise web applications into independently deployable micro-applications while maintaining visual and functional harmony via `@ymlab/afds-ui`.

---

## 2. Micro-Frontend Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│               YM-LAB MICRO-FRONTEND MODULE FEDERATION                  │
├────────────────────────────────────────────────────────────────────────┤
│                       APP SHELL HOST CONTAINER                         │
│           (Navigation Bar, Global State, Auth Context, Theme)          │
├───────────────────┬───────────────────┬───────────────────┬────────────┤
│ KIMCHI ANALYTICS  │ ASIS STRATEGIC    │ AEDES EXECUTION   │ AI AGENT   │
│ REMOTE MFE        │ DASHBOARD MFE     │ CONTROLLER MFE    │ STUDIO MFE │
├───────────────────┴───────────────────┴───────────────────┴────────────┤
│ SHARED SDK LAYER: `@ymlab/afds-ui` (Tokens, Components, EventBus)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Module Federation Configuration Standard

### Host App Shell (`vite.config.ts` / `webpack.config.js`)

```javascript
// Module Federation Host Configuration
module.exports = {
  name: 'ymlab_app_shell',
  remotes: {
    kimchi_mfe: 'kimchi_mfe@https://analytics.ymlab.io/remoteEntry.js',
    asis_mfe: 'asis_mfe@https://strategic.ymlab.io/remoteEntry.js',
    aedes_mfe: 'aedes_mfe@https://execution.ymlab.io/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.3.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.3.0' },
    '@ymlab/afds-ui': { singleton: true, requiredVersion: '^3.5.0' },
  },
};
```

---

## 4. Shared SDK Packaging (`@ymlab/afds-ui`)

The `@ymlab/afds-ui` package exports:
- `tokens`: CSS variables and JSON token objects.
- `components`: Core atomic components (`Button`, `Card`, `DataTable`, `ReasoningPanel`).
- `hooks`: State & streaming hooks (`useAIStream`, `useAgentStatus`).
- `eventBus`: Single instance cross-MFE pub/sub channel.

---

## 5. Traceability & Cross-References

- [01_AFDS_MASTER_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/01_AFDS_MASTER_STANDARD.md) - Master Architecture
- [03_ATOMIC_COMPONENT_LIBRARY.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/03_ATOMIC_COMPONENT_LIBRARY.md) - Component Library
- [06_STATE_MANAGEMENT_DATA_FLOW.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/06_STATE_MANAGEMENT_DATA_FLOW.md) - State Architecture

---

## 6. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| Module Federation | Host & Remote MFE contracts specified | PASS |
| Shared SDK Package | `@ymlab/afds-ui` manifest established | PASS |
| Traceability | Linked to AFDS State & Components | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. Micro-Frontend Architecture specification created. |
