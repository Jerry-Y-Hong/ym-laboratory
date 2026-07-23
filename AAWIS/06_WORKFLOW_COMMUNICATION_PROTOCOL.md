# 06_WORKFLOW_COMMUNICATION_PROTOCOL.md

## Phase 32 – AI Autonomous Workflow Intelligence System (AAWIS)

### Communication Protocol Overview

- **Message Bus**: Apache Kafka (v3.5) deployed in a multi‑region, replicated topology.
- **Schema Registry**: Confluent Schema Registry with Avro schemas for type‑safe payloads.
- **Security**: Mutual TLS (mTLS) for broker authentication, OAuth2 bearer tokens for authorization.
- **Message Types**:
  - `WorkflowDefinition` – carries the DAG JSON.
  - `TaskAssignment` – assigns a task to an executor.
  - `TaskResult` – returns execution outcome.
  - `WorkflowEvent` – lifecycle events (START, PAUSE, RESUME, COMPLETE).
- **Reliability**: Exactly‑once semantics using idempotent consumers and transactional producers.
- **Monitoring**: Prometheus‑scraped metrics; Grafana dashboards for latency, throughput, and error rates.

> **Note**: All communication conforms to ADF v3.1 **Message Interoperability** standards.
