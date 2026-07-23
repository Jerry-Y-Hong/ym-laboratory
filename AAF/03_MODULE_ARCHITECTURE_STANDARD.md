# 03_MODULE_ARCHITECTURE_STANDARD.md

## Phase 29 – AI Application Framework (AAF)

**Version** : v3.8.0  
**Status** : Closed & Frozen  
**Architecture Level** : AI Application Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Overview & Purpose

The **Module Architecture Standard** defines the structural rules, packaging layout, plugin extension mechanisms, and version compatibility standards for all modular components within the AI Application Framework (AAF).

---

## 2. Module Boundaries & Package Organization

AAF enforces modular monorepo and standalone package structures under the `@ymlab/aaf-*` namespace:

```
@ymlab/
├── aaf-core/           # Core Runtime Kernel, DI Container & Event Bus
├── aaf-ai-service/     # Universal LLM Gateway & Agent Tooling APIs
├── aaf-state/          # Distributed State Machine & SSE Streaming SDK
├── aaf-plugin-sdk/     # Plugin Extension API & Widget Registry
├── aaf-security/       # Zero-Trust Sandbox & RBAC Policy Engine
└── aaf-telemetry/      # OpenTelemetry Tracing & AI Token Analytics
```

### Module Boundary Rules
- **Encapsulation**: Each module exposes public interfaces via `index.ts` / `__init__.py`. Internal implementations are strictly private.
- **Single Responsibility**: Each package covers a distinct domain (e.g., core runtime, AI gateway, state management).
- **Zero Circular Dependencies**: Strict hierarchical dependency imports enforced at compile time.

---

## 3. Dependency Rules & Version Compatibility

```
  ┌─────────────────────────────────────────────────────────┐
  │                   @ymlab/aaf-core                       │
  └───────────▲─────────────────────────────────▲───────────┘
              │                                 │
  ┌───────────┴───────────┐         ┌───────────┴───────────┐
  │  @ymlab/aaf-ai-service│         │   @ymlab/aaf-state    │
  └───────────▲───────────┘         └───────────▲───────────┘
              │                                 │
  ┌───────────┴─────────────────────────────────┴───────────┐
  │                 @ymlab/aaf-plugin-sdk                   │
  └─────────────────────────────────────────────────────────┘
```

- **SemVer Compliance**: All `@ymlab/aaf-*` packages follow Semantic Versioning 2.0.0.
- **Backward Compatibility**: Minor and Patch releases MUST NOT break existing plugin interfaces or API signatures.
- **Lockfile Enforcement**: Application builds mandate exact version locks across shared libraries.

---

## 4. Plug-in Architecture & Extension Mechanisms

AAF provides a dynamically loaded plugin architecture allowing third-party and domain-specific extensions:

```typescript
export interface IAafPlugin {
  id: string;
  name: string;
  version: string;
  initialize(context: IAafPluginContext): Promise<void>;
  registerTools?(registry: IToolRegistry): void;
  registerRoutes?(router: IAppRouter): void;
  shutdown?(): Promise<void>;
}
```

### Dynamic Plugin Lifecycle
1. **Discovery & Registration**: Plugins are discovered via `aaf.config.json` manifest.
2. **Security Sandboxing**: Plugins execute within defined permission scopes (Read, Write, Network, AI Tool Execution).
3. **Hook Lifecycle**: Hooks provided for `pre-request`, `post-agent-reasoning`, `on-state-change`, and `on-error`.

---

## 5. Shared Libraries & Component Reuse

- **AFDS Integration**: UI extensions consume atomic components from `@ymlab/afds-ui` (**Phase 28 AFDS**).
- **Core Utility Decoupling**: Shared utilities (logging, hashing, date/time, serialization) are encapsulated within `@ymlab/aaf-core`.

---

## 6. Self Review & Validation

| Validation Item | Required Standard | Result |
|---|---|---|
| Module Boundary Check | Non-overlapping package responsibilities | PASS |
| Dependency Resolution | Zero circular dependencies verified | PASS |
| Plugin Specification | Extension hooks & lifecycle fully defined | PASS |
| ADF v3.1 Alignment | Compliance with YM-LAB governance standards | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.8.0 | 2026-07-22 | Antigravity (AI) | Initial release. Module Architecture Standard established. |
