# 04_AI_SERVICE_INTEGRATION.md

## Phase 29 – AI Application Framework (AAF)

**Version** : v3.8.0  
**Status** : Closed & Frozen  
**Architecture Level** : AI Application Architecture Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-22  

---

## 1. Overview & Purpose

The **AI Service Integration Standard** defines how applications interact with Large Language Models (LLMs), multi-agent orchestration systems, context windows, memory pipelines, and external tools within the YM-LAB Enterprise Ecosystem.

---

## 2. Universal LLM Gateway & Multi-Model Support

AAF abstracts underlying LLM providers (Vertex AI Gemini, OpenAI, Claude, Local Q-Code models) through a unified gateway:

```
                  ┌─────────────────────────────────────┐
                  │          AAF LLM Gateway            │
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
┌────────▼─────────┐        ┌────────▼─────────┐        ┌────────▼─────────┐
│ Gemini Flash/Pro │        │ OpenAI GPT-4o    │        │ Q-Code Local LLM │
└──────────────────┘        └──────────────────┘        └──────────────────┘
```

### Gateway Capabilities
- **Model Routing**: Dynamic routing based on cost, latency, context length, and task complexity.
- **Automatic Failover**: Fallback provider execution on API rate limits or downtime.
- **Unified Streaming API**: Server-Sent Events (SSE) standard output format across all model providers.
- **Token Analytics**: Real-time token usage logging per application session.

---

## 3. Prompt Engine & Context Management

- **Prompt Template Registry**: Version-controlled prompt templates with dynamic variable injection (`{{user_query}}`, `{{qcode_context}}`).
- **Context Window Optimizer**: Automatic token truncation and sliding-window context compression for extended multi-turn conversations.
- **System Instructions Enforcement**: Enforces YM-LAB safety, domain entity mapping, and JSON schema formatting guidelines.

---

## 4. Agent Interface & Tool Calling

AAF standardizes autonomous agent tool registration and invocation:

```typescript
export interface IAafTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute(args: Record<string, unknown>, context: IAafContext): Promise<unknown>;
}
```

- **Tool Execution Flow**: User Request → Agent Reasoning (CoT) → Tool Selection → Security Permission Check → Execution → Result Ingestion.
- **HITL Integration**: Support for Human-In-The-Loop approval modals using **Phase 28 (AFDS)** UI patterns.

---

## 5. Memory Integration & Retrieval Layer

- **Short-Term Memory**: Session-level conversation history cached in Redis / In-Memory store.
- **Long-Term Memory**: Semantic vector embedding storage (Vector DB) for persistent user preferences and historical interactions.
- **Retrieval-Augmented Generation (RAG)**: Multi-stage retrieval connecting Q-Code ontology knowledge bases (**Phase 02/06**) to AI response pipelines.

---

## 6. Self Review & Validation

| Validation Item | Required Standard | Result |
|---|---|---|
| Multi-Model Support | Universal gateway with automatic failover | PASS |
| Tool Calling Standard | Strongly typed parameter schema & HITL support | PASS |
| Memory & Retrieval | RAG & Redis multi-tier memory integration | PASS |
| Governance Compliance | Traceable execution with zero prompt leakage | PASS |

---

## 7. Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.8.0 | 2026-07-22 | Antigravity (AI) | Initial release. AI Service Integration Standard established. |
