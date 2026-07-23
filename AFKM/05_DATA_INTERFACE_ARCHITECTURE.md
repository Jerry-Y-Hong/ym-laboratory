# 05_DATA_INTERFACE_ARCHITECTURE.md

> **Document Type**: Data & Interface Architecture  
> **Phase**: Phase 30 (AI Federated Knowledge Mesh, AFKM)  
> **ADF Governance Version**: ADF v3.1  
> **Repository Release Version**: v3.9.0  
> **Status**: Closed & Frozen  

---

## 1. Mesh Communication Standard (MCS)

All interactions within the AFKM must utilize the standardized **MCS Payload Format** encapsulated in JSON.

```json
{
  "mesh_version": "1.0",
  "governance": "ADF v3.1",
  "provenance": {
    "source_agent": "ASIS_Core",
    "timestamp": "2026-07-23T00:00:00Z"
  },
  "routing": {
    "topic": "MFCO.KnowledgeBase.Update",
    "priority": "HIGH"
  },
  "payload": {
    "entity_id": "Q-0012",
    "mutation_type": "UPSERT",
    "data": { ... }
  }
}
```

## 2. API Interface Definitions

The Knowledge Routing Engine (KRE) exposes internal gRPC/REST endpoints for AAF-compliant applications:

- `POST /mesh/publish`: Ingests an MCS Payload and initiates routing.
- `GET /mesh/subscribe?topic={topic}`: Registers an agent for SSE (Server-Sent Events) or WebSocket streaming.
- `GET /mesh/discovery`: Returns the current Active Agent topology mapping.

---

**[End of Document]**
