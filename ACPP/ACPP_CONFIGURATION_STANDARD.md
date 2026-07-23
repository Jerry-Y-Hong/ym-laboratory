# ACPP_CONFIGURATION_STANDARD.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Architecture Level** : Enterprise Platform Configuration Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Overview & Configuration Architecture

The **ACPP Configuration Standard** defines all configurable parameters, environment variables, feature flags, AI engine routing policies, rate limits, and repository storage paths governing the AI Content Production Platform (ACPP).

Conforming to **ADF v3.1 Policy of Vendor Neutrality**, all engine endpoints, API keys, model assignments, and retry parameters are externalized into declarative YAML configuration files (`config/platform_config.yaml`) and environment variable files (`.env`). This guarantees zero hardcoded parameters within application binaries or agent logic.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ACPP CONFIGURATION HIERARCHY                         │
├────────────────────────────────────────────────────────────────────────┤
│ Environment Variables (.env / OS Secrets Manager) - Highest Priority   │
├────────────────────────────────────────────────────────────────────────┤
│ Application Config (config/platform_config.yaml) - Platform Defaults   │
├────────────────────────────────────────────────────────────────────────┤
│ Domain Config (config/domain_registry.json) - Domain Specific Settings │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Platform Configuration Specification (`config/platform_config.yaml`)

Below is the production-ready YAML configuration template for ACPP:

```yaml
# ACPP Master Platform Configuration (ADF v3.1 Baseline)
platform:
  name: "AI Content Production Platform"
  version: "v3.1.0"
  environment: "production"
  tenant_id: "tenant-default"
  log_level: "INFO"

# 1. AI Engine Provider Settings
ai_providers:
  primary:
    provider: "openai"
    api_key_env: "OPENAI_API_KEY"
    base_url: "https://api.openai.com/v1"
    timeout_seconds: 60
    max_retries: 4
  fallback:
    provider: "azure_openai"
    api_key_env: "AZURE_OPENAI_API_KEY"
    base_url: "https://acpp-azure-ai.openai.azure.com/"
    deployment_id: "gpt-4o-deployment"
    enabled: true

# 2. Dynamic Model Routing Matrix
model_routing:
  research_agent:
    model: "gpt-4o"
    temperature: 0.20
    max_tokens: 8192
    top_p: 0.95
  knowledge_agent:
    model: "gpt-4o"
    temperature: 0.00
    max_tokens: 4096
    response_format: "json_schema"
  writing_agent:
    model: "gpt-4o"
    temperature: 0.70
    max_tokens: 16384
  seo_agent:
    model: "gpt-4o-mini"
    temperature: 0.30
    max_tokens: 2048
  image_agent:
    model: "dall-e-3"
    quality: "hd"
    style: "vivid"
  publishing_agent:
    model: "gpt-4o-mini"
    temperature: 0.00
    max_tokens: 1024
  analytics_agent:
    model: "gpt-4o-mini"
    temperature: 0.20
    max_tokens: 2048
  embedding_engine:
    model: "text-embedding-3-large"
    dimensions: 3072

# 3. Retry Policy & Exponential Backoff
retry_policy:
  base_delay_ms: 1000
  max_delay_ms: 30000
  backoff_factor: 2.0
  jitter_max_ms: 500
  retryable_status_codes: [429, 500, 502, 503, 504]

# 4. Rate Limits & Token Budgets
rate_limits:
  requests_per_minute: 120
  tokens_per_minute: 250000
  daily_cost_cap_usd: 50.00

# 5. Storage & Repository Locations
repository_locations:
  root_path: "g:/내 드라이브/YM-LAB_PROJECT_/ACPP/repository"
  raw_dir: "raw"
  structured_dir: "structured"
  published_dir: "published"
  index_dir: "index"
  database:
    type: "postgresql"
    connection_uri_env: "DATABASE_URL"
    pool_size: 20
    max_overflow: 10

# 6. Feature Flags
feature_flags:
  enforce_human_approval_gate: true
  enable_dalle_image_synthesis: true
  hybrid_vector_search_enabled: true
  vector_weight_alpha: 0.70
  enable_telemetry_feedback_loop: true
  strict_schema_validation: true
```

---

## 3. Environment Variables Specification (`.env.example`)

Secrets and environment-specific overrides must be specified via `.env`:

```ini
# ==============================================================================
# ACPP ENVIRONMENT VARIABLES SPECIFICATION (ADF v3.1)
# ==============================================================================

# System Environment
ACPP_ENV=production
ACPP_LOG_LEVEL=INFO

# AI Engine Credentials
OPENAI_API_KEY=sk-proj-acpp-live-key-example-do-not-hardcode
AZURE_OPENAI_API_KEY=azure-live-key-example

# Database Connection (PostgreSQL with pgvector)
DATABASE_URL=postgresql://acpp_admin:SecurePassword2026!@localhost:5432/acpp_db

# Security & AAOS Token Key
AAOS_SECRET_KEY=aaos-secret-key-hmac-sha256-string-2026
AEGS_GOVERNANCE_GATE_KEY=aegs-governance-human-approval-gate-secret

# External CMS & Webhook API Credentials (Publishing Agent)
WORDPRESS_API_ENDPOINT=https://blog.ym-lab.org/wp-json/wp/v2/posts
WORDPRESS_AUTH_TOKEN=wp-bearer-token-example
GHOST_CMS_API_KEY=ghost-admin-api-key-example

# Server Binding
PORT=8080
HOST=0.0.0.0
```

---

## 4. Self-Review & Verification Matrix

| Configuration Component | Standard Requirement | Verification Status |
|---|---|---|
| **Zero Hardcoding** | 100% parameters defined in YAML / `.env` | PASS |
| **Model Routing Matrix** | Specific temperature and max token bounds per agent | PASS |
| **Retry & Backoff Settings**| Explicit parameterization of exponential backoff and jitter | PASS |
| **Rate Limit Controls** | Requests/min and token/min caps specified | PASS |
| **Feature Flag Control** | Toggles for Human Approval Gate and DALL-E enabled | PASS |

---

## 5. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of ACPP Configuration Standard under ADF v3.1. |
