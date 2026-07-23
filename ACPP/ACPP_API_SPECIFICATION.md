# ACPP_API_SPECIFICATION.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Architecture Level** : Enterprise Inter-Agent API Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Overview & API Topology

The **ACPP API Specification** defines all internal REST and Event-Bus API contracts regulating communication between the 7 micro-agents and the ACPP Orchestration Kernel under **Phase 31 AAOS** and **Phase 37 AEGS Governance**.

This specification provides implementation-ready endpoint signatures, headers, request/response JSON Schemas, authentication standards, error handling codes, and exponential backoff retry algorithms so that engineering teams or AI coding agents can implement backend controllers and agent client stubs immediately.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      ACPP INTER-AGENT API TOPOLOGY                     │
├────────────────────────────────────────────────────────────────────────┤
│ Client Stubs / Event Bus Listener (mTLS & AAOS Token Secured)           │
├─────────┬───────────┬──────────┬──────────┬───────────┬───────┬────────┤
│ Research│ Knowledge │ Writing  │ SEO      │ Image     │Publish│Analyt  │
│ Ingest  │ Structure │ Draft    │ Optimize │ Synthesize│Dispatch|Telemet│
├─────────┴───────────┴──────────┴──────────┴───────────┴───────┴────────┤
│ ACPP Engine Gateway (`/api/v1/`)                                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Global Request Header & Authentication Standard

All inter-agent API calls must transmit the mandatory **ADF v3.1 Security Context Headers**:

```http
POST /api/v1/writing/draft HTTP/1.1
Host: acpp-gateway.internal:8080
Content-Type: application/json
X-Agent-ID: ACPP-AG-03
X-AAOS-Token: aaos-sec-token-2026-v31-abc123
X-Tenant-ID: tenant-default-km
X-Request-ID: req-20260723-0001
X-Correlation-ID: corr-20260723-9988
```

- **Authentication Protocol**: Mutual TLS (mTLS) within agent boundary + AAOS HMAC-SHA256 Token Verification (`X-AAOS-Token`).
- **Traceability**: `X-Request-ID` and `X-Correlation-ID` propagate across all downstream micro-agent invocations.

---

## 3. Micro-Agent API Endpoint Definitions

### 3.1 Research Agent API (`/api/v1/research/ingest`)
- **Method**: `POST`
- **Description**: Triggers web/literature scraping and stores raw payload in `repository/raw/`.
- **Request Schema**:
  ```json
  {
    "type": "object",
    "required": ["topic", "domain_code", "seed_sources", "depth"],
    "properties": {
      "topic": { "type": "string" },
      "domain_code": { "type": "string" },
      "seed_sources": { "type": "array", "items": { "type": "string" } },
      "depth": { "type": "string", "enum": ["shallow", "deep"] }
    }
  }
  ```
- **Response Schema (`200 OK`)**:
  ```json
  {
    "type": "object",
    "required": ["status", "research_id", "raw_asset_path", "sha256_hash", "extracted_fact_count"],
    "properties": {
      "status": { "type": "string", "enum": ["SUCCESS", "FAILED"] },
      "research_id": { "type": "string" },
      "raw_asset_path": { "type": "string" },
      "sha256_hash": { "type": "string" },
      "extracted_fact_count": { "type": "integer" }
    }
  }
  ```

---

### 3.2 Knowledge Agent API (`/api/v1/knowledge/structure`)
- **Method**: `POST`
- **Description**: Converts raw research payload into normalized SSOT Knowledge Asset in `repository/structured/`.
- **Request Schema**:
  ```json
  {
    "type": "object",
    "required": ["research_id", "target_qcode_domain"],
    "properties": {
      "research_id": { "type": "string" },
      "target_qcode_domain": { "type": "string" }
    }
  }
  ```
- **Response Schema (`200 OK`)**:
  ```json
  {
    "type": "object",
    "required": ["status", "asset_id", "qcode", "asset_path", "verification_score"],
    "properties": {
      "status": { "type": "string", "enum": ["REGISTERED", "CONFLICT_NEEDS_REVIEW"] },
      "asset_id": { "type": "string" },
      "qcode": { "type": "string" },
      "asset_path": { "type": "string" },
      "verification_score": { "type": "number" }
    }
  }
  ```

---

### 3.3 Writing Agent API (`/api/v1/writing/draft`)
- **Method**: `POST`
- **Description**: Synthesizes channel-specific drafts from structured Knowledge Assets.
- **Request Schema**:
  ```json
  {
    "type": "object",
    "required": ["asset_ids", "target_channels", "persona_tone"],
    "properties": {
      "asset_ids": { "type": "array", "items": { "type": "string" } },
      "target_channels": { "type": "array", "items": { "type": "string", "enum": ["BLOG", "TYPST_PDF", "MARP_SLIDES"] } },
      "persona_tone": { "type": "string" }
    }
  }
  ```
- **Response Schema (`200 OK`)**:
  ```json
  {
    "type": "object",
    "required": ["draft_package_id", "drafts"],
    "properties": {
      "draft_package_id": { "type": "string" },
      "drafts": {
        "type": "object",
        "additionalProperties": { "type": "string" }
      }
    }
  }
  ```

---

### 3.4 SEO Agent API (`/api/v1/seo/optimize`)
- **Method**: `POST`
- **Description**: Injects metadata, headings, schema markup, and calculates readability scores.
- **Request Schema**:
  ```json
  {
    "type": "object",
    "required": ["draft_package_id", "target_keywords"],
    "properties": {
      "draft_package_id": { "type": "string" },
      "target_keywords": { "type": "array", "items": { "type": "string" } }
    }
  }
  ```
- **Response Schema (`200 OK`)**:
  ```json
  {
    "type": "object",
    "required": ["seo_package_id", "readability_score", "meta_tags", "json_ld_schema"],
    "properties": {
      "seo_package_id": { "type": "string" },
      "readability_score": { "type": "number" },
      "meta_tags": { "type": "object" },
      "json_ld_schema": { "type": "object" }
    }
  }
  ```

---

### 3.5 Image Agent API (`/api/v1/image/synthesize`)
- **Method**: `POST`
- **Description**: Synthesizes prompt specs and generates DALL-E visual assets.
- **Request Schema**:
  ```json
  {
    "type": "object",
    "required": ["seo_package_id", "brand_palette", "aspect_ratios"],
    "properties": {
      "seo_package_id": { "type": "string" },
      "brand_palette": { "type": "string" },
      "aspect_ratios": { "type": "array", "items": { "type": "string" } }
    }
  }
  ```
- **Response Schema (`200 OK`)**:
  ```json
  {
    "type": "object",
    "required": ["media_manifest_id", "image_assets"],
    "properties": {
      "media_manifest_id": { "type": "string" },
      "image_assets": {
        "type": "array",
        "items": {
          "type": "object",
          "required": ["image_id", "url_or_path", "aspect_ratio", "alt_text"],
          "properties": {
            "image_id": { "type": "string" },
            "url_or_path": { "type": "string" },
            "aspect_ratio": { "type": "string" },
            "alt_text": { "type": "string" }
          }
        }
      }
    }
  }
  ```

---

### 3.6 Publishing Agent API (`/api/v1/publishing/dispatch`)
- **Method**: `POST`
- **Description**: Verifies human approval token and dispatches payloads to target platforms.
- **Request Schema**:
  ```json
  {
    "type": "object",
    "required": ["seo_package_id", "media_manifest_id", "human_approval_token", "target_endpoints"],
    "properties": {
      "seo_package_id": { "type": "string" },
      "media_manifest_id": { "type": "string" },
      "human_approval_token": { "type": "string" },
      "target_endpoints": { "type": "array", "items": { "type": "string" } }
    }
  }
  ```
- **Response Schema (`200 OK`)**:
  ```json
  {
    "type": "object",
    "required": ["status", "publication_id", "dispatch_receipts"],
    "properties": {
      "status": { "type": "string", "enum": ["DISPATCHED", "BLOCKED_APPROVAL_REQUIRED"] },
      "publication_id": { "type": "string" },
      "dispatch_receipts": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "channel": { "type": "string" },
            "live_url": { "type": "string" }
          }
        }
      }
    }
  }
  ```

---

### 3.7 Analytics Agent API (`/api/v1/analytics/telemetry`)
- **Method**: `POST`
- **Description**: Ingests performance metrics and calculates Content Effectiveness Index (CEI).
- **Request Schema**:
  ```json
  {
    "type": "object",
    "required": ["publication_id", "metrics_payload"],
    "properties": {
      "publication_id": { "type": "string" },
      "metrics_payload": {
        "type": "object",
        "required": ["pageviews", "dwell_time_seconds", "social_shares"],
        "properties": {
          "pageviews": { "type": "integer" },
          "dwell_time_seconds": { "type": "integer" },
          "social_shares": { "type": "integer" }
        }
      }
    }
  }
  ```
- **Response Schema (`200 OK`)**:
  ```json
  {
    "type": "object",
    "required": ["publication_id", "cei_score", "recommendation"],
    "properties": {
      "publication_id": { "type": "string" },
      "cei_score": { "type": "number" },
      "recommendation": { "type": "string" }
    }
  }
  ```

---

## 4. Global Error Code Taxonomy

| Error Code | HTTP Status | Error Name | Description & Action |
|---|---|---|---|
| `ACPP-ERR-4001` | `400 Bad Request` | `INVALID_SCHEMA_PAYLOAD` | Request body failed JSON Schema validation. Re-format payload. |
| `ACPP-ERR-4010` | `401 Unauthorized` | `INVALID_AAOS_TOKEN` | Agent security token missing or invalid. Re-authenticate with AAOS kernel. |
| `ACPP-ERR-4030` | `403 Forbidden` | `APPROVAL_TOKEN_REQUIRED` | Publishing dispatch blocked; Human Approval Token missing or expired. |
| `ACPP-ERR-4040` | `404 Not Found` | `KNOWLEDGE_ASSET_NOT_FOUND` | Requested Asset ID or Q-Code does not exist in `repository/structured/`. |
| `ACPP-ERR-4290` | `429 Too Many Requests` | `AI_RATE_LIMIT_EXCEEDED` | OpenAI API rate limit hit. Trigger exponential backoff retry. |
| `ACPP-ERR-5000` | `500 Internal Error` | `AGENT_RUNTIME_FAULT` | Micro-agent crash or unhandled runtime exception. Check log trace. |
| `ACPP-ERR-5003` | `503 Service Unavailable` | `AI_PROVIDER_UNAVAILABLE` | External AI gateway timeout. Fallback to secondary provider driver. |

---

## 5. Retry Rules & Exponential Backoff Protocol

Inter-agent calls encountering transient network errors (`503`, `429`) execute exponential backoff with jitter:

$$T_{\text{backoff}} = \min\left(T_{\text{max}}, T_{\text{base}} \times 2^{\text{attempt}} + \text{random\_jitter}(0, 500\text{ms})\right)$$

- **`T_base`**: `1000ms`
- **`T_max`**: `30000ms`
- **Max Retries**: `4 attempts`

---

## 6. Self-Review & Verification Matrix

| Specification Item | Standard Requirement | Verification Status |
|---|---|---|
| **Coverage** | All 7 micro-agents have formal REST endpoints | PASS |
| **Schema Strictness** | Full JSON Schema definitions for requests and responses | PASS |
| **Auth Headers** | Mandatory mTLS and AAOS token headers enforced | PASS |
| **Error Taxonomy** | Explicit error code table (`4001` - `5003`) defined | PASS |
| **Retry Protocol** | Exponential backoff algorithm parameterized | PASS |

---

## 7. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of ACPP Inter-Agent API Specification under ADF v3.1. |
