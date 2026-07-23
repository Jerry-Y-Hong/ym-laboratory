# RUNTIME_MONITORING.md

## Monitoring, Logging & Observability Design

### 1. Goal
Provide **end‑to‑end visibility** into the AI Enterprise Runtime Platform (AERP) covering metrics, logs, traces, and alerts, enabling rapid issue detection and compliance reporting per ADF v3.1.

### 2. Observability Stack
| Layer | Tool | Reason |
|-------|------|--------|
| **Metrics** | OpenTelemetry SDK → Prometheus → Grafana | Standardised metric collection, flexible dashboards. |
| **Logs** | Fluent Bit → OpenTelemetry Collector → Loki (or Cloud Logging) | Structured JSON logs, searchable, low‑overhead. |
| **Tracing** | OpenTelemetry → Jaeger (or Cloud Trace) | Distributed tracing across runtimes (Agent → Tool → Event). |
| **Alerting** | Prometheus Alertmanager → Slack / Email webhook | Immediate notification on SLA breaches. |
| **Dashboard** | Grafana (or Looker) with pre‑built panels per runtime component. |

### 3. Key Metrics Catalog
| Category | Metric Name | Description | Exporter |
|----------|-------------|-------------|---------|
| **Runtime Manager** | `runtime_manager.deployments_total` | Total deployments attempted. | Prometheus exporter in manager pod |
| | `runtime_manager.deploy_success` | Successful deployments. |
| | `runtime_manager.deploy_failures` | Failed deployments (triggers rollback). |
| **Agent Runtime** | `agent_runtime.active_agents` | Number of agents currently running. |
| | `agent_runtime.request_latency_seconds` | LLM call latency per request. |
| | `agent_runtime.errors_total` | Errors (timeout, quota exceed). |
| **Memory Runtime** | `memory_runtime.redis_mem_usage_bytes` | Redis memory usage.
| | `memory_runtime.milvus_query_latency_seconds` | Vector search latency. |
| **Tool Runtime** | `tool_runtime.calls_total` | Total external tool calls.
| | `tool_runtime.rate_limited_total` | Calls dropped due to quota. |
| **Event Runtime** | `event_runtime.messages_published_total` | Pub/Sub messages published.
| | `event_runtime.delivery_latency_seconds` | Event delivery latency.
| **Security** | `security_runtime.audit_events_total` | Audited security events emitted. |
| **Recovery** | `recovery_system.rollback_triggered_total` | Number of rollbacks executed. |

### 4. Logging Conventions
- **JSON structure** with fields: `timestamp`, `severity`, `component`, `message`, `trace_id`, `span_id`.
- **Sensitive data redaction**: secrets, tokens, PII are removed before log emission (see `SECURITY_RUNTIME.md`).

### 5. Tracing Strategy
- Propagate **W3C Trace‑Context** headers across all runtimes.
- Each request creates a root span in **Agent Runtime**, with child spans for **Tool calls**, **Memory access**, and **Event emission**.
- Export spans to Jaeger UI for visual debugging.

### 6. Alerting Rules (example)
```yaml
# prometheus alert rule file
groups:
- name: aerp-alerts
  rules:
  - alert: DeploymentFailure
    expr: runtime_manager.deploy_failures > 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Runtime Manager deployment failure"
      description: "One or more deployments have failed in the last minute."
  - alert: HighAgentLatency
    expr: agent_runtime.request_latency_seconds{quantile="0.95"} > 5
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "Agent latency > 5s"
      description: "95th percentile latency of agent LLM calls exceeds 5 seconds."
```

### 7. Dashboard Overview (Grafana panels)
1. **Overall health** – uptime of each runtime component (green/red).  
2. **Latency heatmap** – request latency distribution per component.  
3. **Error rate** – stacked bar of errors by source (agent, tool, memory).  
4. **Resource usage** – CPU/Memory of pods, Redis memory, Milvus storage.

### 8. Cross‑Reference Links
- Master Architecture: [AERP_MASTER_ARCHITECTURE.md](file:///C:/Users/car13/.gemini/antigravity-ide/brain/49a37dfb-8f31-41e4-abcc-cfb650cba1f9/AERP_MASTER_ARCHITECTURE.md)
- Security Runtime: [SECURITY_RUNTIME.md](file:///C:/Users/car13/.gemini/antigravity-ide/brain/49a37dfb-8f31-41e4-abcc-cfb650cba1f9/SECURITY_RUNTIME.md)
- Recovery System: [RECOVERY_SYSTEM.md](file:///C:/Users/car13/.gemini/antigravity-ide/brain/49a37dfb-8f31-41e4-abcc-cfb650cba1f9/RECOVERY_SYSTEM.md)

---
*Further implementation details (Helm chart values, OTel collector config) can be added later.*
