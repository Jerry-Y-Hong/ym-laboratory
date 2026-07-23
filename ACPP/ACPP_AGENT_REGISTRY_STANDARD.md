# ACPP_AGENT_REGISTRY_STANDARD.md

## AI Content Production Platform (ACPP)

**Version** : v3.1.0  
**Status** : Production Implementation Ready  
**Architecture Level** : Enterprise Agent Governance Registry Layer  
**Architecture Standard** : ADF v3.1 Governance Standards  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Overview & Agent Registry Topology

The **ACPP Agent Registry Standard** establishes the official enterprise registry for all micro-agents operating within the AI Content Production Platform (ACPP). Operating under **Phase 31 AAOS (Agent Architecture Operating System)** and **Phase 37 AEGS Governance**, this registry acts as the single source of truth for agent capability discovery, contract validation, security permission bounds, dependency mapping, and operational health checks.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ENTERPRISE AGENT REGISTRY KERNEL                     │
├────────────────────────────────────────────────────────────────────────┤
│ Registry Index (`agents/agent_registry.json`)                           │
├─────────┬────────────┬──────────┬──────────┬───────────┬────────┬──────┤
│ ACPP-AG-│ ACPP-AG-02 │ ACPP-AG- │ ACPP-AG- │ ACPP-AG-05│ACPP-AG-│ACPP- │
│ 01      │ Knowledge  │ 03       │ 04       │ Image     │06      │AG-07 │
│ Research│ Agent      │ Writing  │ SEO      │ Agent     │Publish │Analyt│
├─────────┴────────────┴──────────┴──────────┴───────────┴────────┴──────┤
│ Governance Verification Engine (AAOS Security & Permission Gate)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Enterprise Agent Registry Declarative Specification (`agents/agent_registry.json`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "registry_version": "v3.1.0",
  "last_updated_utc": "2026-07-23T12:00:00Z",
  "registered_agents": [
    {
      "agent_id": "ACPP-AG-01",
      "name": "Research Agent",
      "version": "v3.1.0",
      "capabilities": ["web_scraping", "source_verification", "raw_data_extraction"],
      "input_contract": "schemas/research_input.schema.json",
      "output_contract": "schemas/research_output.schema.json",
      "dependencies": [],
      "health_status_endpoint": "/api/v1/research/health",
      "owner": "Data Research Team",
      "execution_policy": {
        "read_permissions": ["web:*", "file:///repository/raw/"],
        "write_permissions": ["file:///repository/raw/"],
        "network_access": "RESTRICTED_EXTERNAL"
      }
    },
    {
      "agent_id": "ACPP-AG-02",
      "name": "Knowledge Agent",
      "version": "v3.1.0",
      "capabilities": ["fact_structuring", "qcode_ontology_mapping", "ssot_registration"],
      "input_contract": "schemas/knowledge_input.schema.json",
      "output_contract": "schemas/knowledge_asset.schema.json",
      "dependencies": ["ACPP-AG-01"],
      "health_status_endpoint": "/api/v1/knowledge/health",
      "owner": "Knowledge Architecture Team",
      "execution_policy": {
        "read_permissions": ["file:///repository/raw/", "file:///repository/structured/"],
        "write_permissions": ["file:///repository/structured/"],
        "network_access": "INTERNAL_ONLY"
      }
    },
    {
      "agent_id": "ACPP-AG-03",
      "name": "Writing Agent",
      "version": "v3.1.0",
      "capabilities": ["multi_format_drafting", "markdown_synthesis", "typst_generation", "marp_slides"],
      "input_contract": "schemas/writing_input.schema.json",
      "output_contract": "schemas/writing_output.schema.json",
      "dependencies": ["ACPP-AG-02"],
      "health_status_endpoint": "/api/v1/writing/health",
      "owner": "Content Generation Team",
      "execution_policy": {
        "read_permissions": ["file:///repository/structured/"],
        "write_permissions": ["memory:transient_drafts"],
        "network_access": "AI_GATEWAY_ONLY"
      }
    },
    {
      "agent_id": "ACPP-AG-04",
      "name": "SEO Agent",
      "version": "v3.1.0",
      "capabilities": ["keyword_optimization", "meta_tag_injection", "json_ld_schema", "readability_scoring"],
      "input_contract": "schemas/seo_input.schema.json",
      "output_contract": "schemas/seo_output.schema.json",
      "dependencies": ["ACPP-AG-03"],
      "health_status_endpoint": "/api/v1/seo/health",
      "owner": "Growth & SEO Team",
      "execution_policy": {
        "read_permissions": ["memory:transient_drafts"],
        "write_permissions": ["memory:transient_seo_drafts"],
        "network_access": "AI_GATEWAY_ONLY"
      }
    },
    {
      "agent_id": "ACPP-AG-05",
      "name": "Image Agent",
      "version": "v3.1.0",
      "capabilities": ["prompt_synthesis", "dalle3_generation", "brand_audit", "alt_text_writing"],
      "input_contract": "schemas/image_input.schema.json",
      "output_contract": "schemas/image_output.schema.json",
      "dependencies": ["ACPP-AG-04"],
      "health_status_endpoint": "/api/v1/image/health",
      "owner": "Design & Visuals Team",
      "execution_policy": {
        "read_permissions": ["memory:transient_seo_drafts"],
        "write_permissions": ["file:///repository/published/media/"],
        "network_access": "AI_GATEWAY_ONLY"
      }
    },
    {
      "agent_id": "ACPP-AG-06",
      "name": "Publishing Agent",
      "version": "v3.1.0",
      "capabilities": ["human_approval_check", "multi_channel_dispatch", "pdf_compilation", "cms_webhook"],
      "input_contract": "schemas/publishing_input.schema.json",
      "output_contract": "schemas/publishing_output.schema.json",
      "dependencies": ["ACPP-AG-05"],
      "health_status_endpoint": "/api/v1/publishing/health",
      "owner": "Publishing & Distribution Team",
      "execution_policy": {
        "read_permissions": ["memory:transient_seo_drafts", "file:///repository/published/media/"],
        "write_permissions": ["file:///repository/published/"],
        "network_access": "EXTERNAL_CMS_ONLY",
        "requires_human_approval_gate": true
      }
    },
    {
      "agent_id": "ACPP-AG-07",
      "name": "Analytics Agent",
      "version": "v3.1.0",
      "capabilities": ["telemetry_ingestion", "cei_scoring", "repository_feedback_recommendation"],
      "input_contract": "schemas/analytics_input.schema.json",
      "output_contract": "schemas/analytics_output.schema.json",
      "dependencies": ["ACPP-AG-06"],
      "health_status_endpoint": "/api/v1/analytics/health",
      "owner": "Analytics & BI Team",
      "execution_policy": {
        "read_permissions": ["file:///repository/published/"],
        "write_permissions": ["database:analytics_metrics"],
        "network_access": "INTERNAL_ONLY"
      }
    }
  ]
}
```

---

## 3. Agent Lifecycle & Health Monitoring

### 3.1 Health Check Protocol
Each registered agent exposes a standard HTTP `/health` endpoint returning operational status:

```json
{
  "agent_id": "ACPP-AG-03",
  "status": "HEALTHY",
  "uptime_seconds": 86400,
  "active_tasks": 2,
  "memory_used_mb": 142.5,
  "aaos_security_state": "COMPLIANT"
}
```

---

## 4. Self-Review & Verification Matrix

| Registry Parameter | Requirement Standard | Verification Status |
|---|---|---|
| **Coverage** | All 7 micro-agents fully registered | PASS |
| **Contract Traceability** | Explicit links to input and output JSON Schemas | PASS |
| **Dependency Graph** | Strict linear dependency chain (`01` -> `02` -> `03` -> `04` -> `05` -> `06` -> `07`) | PASS |
| **AAOS Governance** | File read/write and network access policy bounds specified | PASS |
| **Health Protocol** | Dedicated health status endpoints defined for each agent | PASS |

---

## 5. Document Version History

| Version | Date (UTC) | Author | Description |
|---|---|---|---|
| v3.1.0 | 2026-07-23 | Antigravity (AI) | Initial release of ACPP Enterprise Agent Registry Standard under ADF v3.1. |
