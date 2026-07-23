# 06_AGENT_COMMUNICATION_PROTOCOL.md

## Phase 31 – AI Autonomous Agent Orchestration System (AAOS)

**Version** : v3.9.0  
**Status** : Active  
**Architecture Level** : AI Agent Orchestration Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-23  

---

## 1. Executive Summary

The **Agent Communication Protocol (ACP)** defines the standardized message schemas, transport layers, and data exchange formats used for inter-agent and agent-to-engine communication within the AAOS. It ensures semantic interoperability and decouples sender from receiver logic.

---

## 2. Protocol Standards

1. **Transport Layer**: Asynchronous Publish-Subscribe via gRPC / Kafka (or Redis Pub/Sub for lightweight edge instances).
2. **Data Format**: Strictly validated JSON schemas (`application/json`).
3. **Idempotency**: All messages must include a unique `message_id` and `correlation_id` to prevent replay side-effects.

---

## 3. Core Message Schemas

### 3.1 Task Assignment Message (`TASK_DISPATCH`)
Sent from the Orchestration Engine to an Agent.
```json
{
  "message_id": "msg-10293",
  "correlation_id": "dag-5512",
  "type": "TASK_DISPATCH",
  "payload": {
    "task_id": "task-88",
    "role_required": "CODE_ENGINEER",
    "instructions": "Implement retry logic in ...",
    "context_refs": ["afkm://kb/module_arch"]
  }
}
```

### 3.2 State Update Message (`STATE_UPDATE`)
Emitted by Agents to the Audit System and Orchestrator.
```json
{
  "message_id": "msg-10294",
  "correlation_id": "dag-5512",
  "type": "STATE_UPDATE",
  "payload": {
    "agent_id": "agent-ce-01",
    "status": "ACTIVE",
    "progress_percent": 50,
    "current_action": "Editing file retry_manager.py"
  }
}
```

### 3.3 Peer-to-Peer Query (`PEER_QUERY`)
Used when an Agent requests specific domain knowledge from another specialized Agent (e.g., Code Engineer asking Q-Code Ontologist).
- Mediated through the Orchestration Engine to ensure auditability.

---

## 4. Event Streaming & Auditing

Every message broadcast over the ACP is synchronously replicated to the **Agent Audit System (Deliverable 08)** to maintain an immutable ledger of intelligence operations.

---

## 5. Self Review & Validation

| Validation Item | Required Standard | Result |
|---|---|---|
| Communication Validation | Schemas and transport defined | PASS |
| Governance Compliance | ADF v3.1 Header & Format | PASS |

---

**[End of Document]**
