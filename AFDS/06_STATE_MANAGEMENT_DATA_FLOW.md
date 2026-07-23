# 06_STATE_MANAGEMENT_DATA_FLOW.md

## Phase 28 – AI Frontend Design System (AFDS)

**Version** : v3.5.0  
**Status** : Closed & Frozen  
**Architecture Level** : Frontend UI Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Purpose

Define the **Frontend State Architecture & Real-Time Data Flow Pipelines** for the YM-LAB Enterprise Ecosystem. AFDS establishes a clean, decoupled 4-layer state management architecture designed to handle high-frequency local updates, enterprise server-state caching, global app preferences, and low-latency real-time AI event streams.

---

## 2. State Layer Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                   AFDS 4-TIER STATE ARCHITECTURE                       │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 4: Real-Time AI Streaming Pipeline (SSE / WebSocket Engine)      │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 3: Server State Caching & Sync (TanStack Query / SWR)            │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 2: Global Application & UI State (Zustand Store / Context)       │
├────────────────────────────────────────────────────────────────────────┤
│ Layer 1: Local Component State (React useState / useReducer)           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow & Streaming Specifications

### 3.1 Real-Time Streaming Hook (`useAIStream`)

Provides a unified interface for streaming LLM response tokens directly to UI components.

```typescript
export interface UseAIStreamOptions {
  endpoint: string;
  onToken?: (token: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

export interface UseAIStreamResult {
  text: string;
  isStreaming: boolean;
  error: Error | null;
  startStream: (prompt: string, metadata?: Record<string, any>) => void;
  abortStream: () => void;
}
```

### 3.2 Server State Caching Strategy (TanStack Query)

- **Stale-While-Revalidate**: Default `staleTime = 5 minutes` for static metrics; `staleTime = 0` for real-time agent statuses.
- **Optimistic UI Updates**: Instantly reflect user decisions in the UI while awaiting backend confirmation.

---

## 4. Cross-Component Event Bus Architecture

For decoupled communications across isolated widgets or Micro-Frontends:

```typescript
export class AFDSEventBus {
  private static instance: AFDSEventBus;
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  public static getInstance(): AFDSEventBus {
    if (!AFDSEventBus.instance) {
      AFDSEventBus.instance = new AFDSEventBus();
    }
    return AFDSEventBus.instance;
  }

  public publish(event: string, payload: any): void {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(fn => fn(payload));
  }

  public subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(callback);
    return () => {
      const handlers = this.listeners.get(event) || [];
      this.listeners.set(event, handlers.filter(fn => fn !== callback));
    };
  }
}
```

---

## 5. Traceability & Cross-References

- [05_AI_INTERFACE_PATTERNS.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/05_AI_INTERFACE_PATTERNS.md) - AI Interaction Patterns
- [03_ATOMIC_COMPONENT_LIBRARY.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/03_ATOMIC_COMPONENT_LIBRARY.md) - Component Specifications
- [01_AFDS_MASTER_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AFDS/01_AFDS_MASTER_STANDARD.md) - Master Architecture

---

## 6. Self Review & Validation

| Validation Item | Status | Result |
|---|---|---|
| 4-Tier State Layering | Local, Global, Server, Streaming layers defined | PASS |
| Event Bus Specification | EventBus pub/sub pattern established | PASS |
| Stream Pipeline | `useAIStream` contract defined | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.5.0 | 2026-07-22 | Antigravity (AI) | Initial release. State Management & Data Flow Architecture created. |
