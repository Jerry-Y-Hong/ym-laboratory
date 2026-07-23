# OPENAI_API_INTEGRATION.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Architecture Baseline Defined  
**Architecture Level** : Enterprise AI Engine Integration Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Overview & Engine Abstraction Model

The **OpenAI API Integration Specification** details the technical integration patterns between the AI Content Production Platform (ACPP) and external AI engines. 

To satisfy the **ADF v3.1 Policy of Vendor Neutrality**, ACPP introduces an **AI Engine Abstraction Gateway (`AIEngineGateway`)**. While OpenAI API is configured as the reference AI engine, all platform agents interact exclusively through generic driver interfaces (`ChatDriver`, `EmbeddingDriver`, `StructuredOutputDriver`, `ToolCallDriver`, `ImageDriver`). This design guarantees that OpenAI models can be replaced or augmented with local LLMs, Google Gemini, Anthropic Claude, or open-weight models with zero modification to core agent business logic.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   AI ENGINE ABSTRACTION TOPOLOGY                       │
├────────────────────────────────────────────────────────────────────────┤
│ ACPP Micro-Agents (Research, Knowledge, Writing, SEO, Image, etc.)     │
├────────────────────────────────────────────────────────────────────────┤
│ ACPP AI Engine Abstraction Gateway (AIEngineGateway Interface)          │
├────────────────────────────────┬───────────────────────────────────────┤
│ OpenAI Driver (Default API)    │ Alternate Providers (Gemini/Claude)   │
├────────────────────────────────┴───────────────────────────────────────┤
│ External API Endpoints (Responses, Embeddings, Structured Output, Tools)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Abstraction Driver Interfaces

All agent requests are routed through standardized interface signatures:

```typescript
interface AIEngineGateway {
  completeChat(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  generateStructuredOutput<T>(request: StructuredRequest<T>): Promise<T>;
  createEmbeddings(request: EmbeddingRequest): Promise<EmbeddingResponse>;
  executeToolCalls(request: ToolCallRequest): Promise<ToolCallResponse>;
  generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;
}
```

---

## 3. Responses & Chat Completions API Specification

### 3.1 Model Routing Strategy
ACPP dynamic model routing selects the optimal OpenAI model based on task complexity and cost efficiency:

| Task Type | Assigned Model | Max Tokens | Temperature | Rationale |
|---|---|---|---|---|
| **Deep Research & Analysis** | `gpt-4o` | 8,192 | 0.2 | High reasoning accuracy & complex context |
| **Knowledge Asset Structuring** | `gpt-4o` | 4,096 | 0.0 | Deterministic, zero-creativity JSON mapping |
| **Writing & Content Generation** | `gpt-4o` / `gpt-4o-mini` | 16,384 | 0.7 | Nuanced prose generation & tone control |
| **SEO Optimization & Meta Tags** | `gpt-4o-mini` | 2,048 | 0.3 | Fast keyword insertion & scoring |
| **Image Prompt Synthesis** | `gpt-4o-mini` | 1,024 | 0.5 | Efficient visual description formatting |

### 3.2 Streaming & Token Control
- **Server-Sent Events (SSE)**: Long-form content drafting uses chunked streaming (`stream: true`) to prevent request timeouts.
- **Token Budget Manager**: Enforces per-request limits and tracks cumulative usage across tenant tokens under **Phase 37 AEGS**.

---

## 4. Structured Output Enforcement

To guarantee complete compliance with [KNOWLEDGE_REPOSITORY_STANDARD.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/ACPP/KNOWLEDGE_REPOSITORY_STANDARD.md), all agent responses producing structured data utilize strict JSON Schema enforcement (`response_format: { type: "json_schema" }`).

### 4.1 Example: Knowledge Asset Generation Payload
```json
{
  "model": "gpt-4o",
  "messages": [
    { "role": "system", "content": "You are the ACPP Knowledge Agent. Convert raw research into a structured Knowledge Asset." },
    { "role": "user", "content": "Hydrated research prompt..." }
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "knowledge_asset_schema",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "asset_id": { "type": "string" },
          "qcode": { "type": "string" },
          "title": { "type": "string" },
          "verification_score": { "type": "number" },
          "claims": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "claim_text": { "type": "string" },
                "evidence_source_id": { "type": "string" }
              },
              "required": ["claim_text", "evidence_source_id"],
              "additionalProperties": false
            }
          }
        },
        "required": ["asset_id", "qcode", "title", "verification_score", "claims"],
        "additionalProperties": false
      }
    }
  }
}
```

---

## 5. Embeddings & Vector Search Integration

### 5.1 Embedding Model Configuration
- **Model**: `text-embedding-3-large`
- **Output Dimensions**: 3,072 dimensions (configurable to 1,536 for lightweight indices).
- **Batching Strategy**: Max 512 chunks per embedding call to optimize API throughput.

### 5.2 Hybrid Vector Search Strategy
Retrieval requests combine dense vector similarity search with sparse lexical matching (BM25 + Q-Code exact filter):

$$\text{RelevanceScore} = \alpha \cdot \text{CosineSimilarity}(\vec{q}, \vec{d}) + (1 - \alpha) \cdot \text{BM25Score}(q, d) + \beta \cdot \mathbb{I}(\text{QCodeMatch})$$

Where $\alpha = 0.70$ and $\beta = 0.30$.

---

## 6. Tool Calling (Function Calling) Specification

Agents use OpenAI Tool Calling to invoke platform capabilities safely under **Phase 31 AAOS**.

### 6.1 Standard Tool Declarations

```json
[
  {
    "type": "function",
    "function": {
      "name": "fetch_web_research",
      "description": "Scrapes and validates web content for research verification.",
      "parameters": {
        "type": "object",
        "properties": {
          "target_url": { "type": "string" },
          "depth": { "type": "string", "enum": ["shallow", "deep"] }
        },
        "required": ["target_url"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "dispatch_publishing_webhook",
      "description": "Dispatches compiled content payload to external CMS platform.",
      "parameters": {
        "type": "object",
        "properties": {
          "channel_id": { "type": "string" },
          "payload_json": { "type": "string" },
          "approval_token": { "type": "string" }
        },
        "required": ["channel_id", "payload_json", "approval_token"]
      }
    }
  }
]
```

---

## 7. Image Generation API Integration (DALL-E / Image Engine)

The **Image Agent (`ACPP-AG-05`)** utilizes the image generation endpoint for visual asset creation.

### 7.1 Request Specification
- **Model**: `dall-e-3`
- **Quality**: `hd`
- **Style**: `vivid` (for promotional blog banners) or `natural` (for scientific documentation).
- **Aspect Ratios**:
  - `1024x1024` (Square social posts / thumbnails)
  - `1792x1024` (Wide article hero banners)
  - `1024x1792` (Vertical mobile story cards)

### 7.2 Prompt Hydration Pipeline
Prompts are dynamically generated from article content, incorporating enterprise brand guidelines:

```
[Article Context] + [Brand Color Palette & Style Policy] ──► Prompt Synthesizer ──► DALL-E 3 API ──► Image Asset File
```

---

## 8. Self-Review & Verification Matrix

| API Integration Component | Architectural Standard | Status |
|---|---|---|
| **Engine Abstraction** | Complete decoupling behind `AIEngineGateway` interface | PASS |
| **Model Routing** | Task-based routing for cost and accuracy optimization | PASS |
| **Structured Output** | Strict JSON Schema enforcement via `response_format` | PASS |
| **Embeddings & Search** | `text-embedding-3-large` with hybrid search integration | PASS |
| **Tool Calling** | AAOS permission-bounded function definitions | PASS |
| **Image Generation** | DALL-E 3 brand-guided prompt hydration | PASS |

---

## 9. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of OpenAI API Integration Specification under ADF v3.1. |
