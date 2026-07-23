# 04_WORKFLOW_LIFECYCLE.md

## Phase 32 – AI Autonomous Workflow Intelligence System (AAWIS)

**Version** : v3.10.0  
**Status** : Active  
**Architecture Level** : AI Workflow Orchestration Layer  
**Architecture Standard** : ADF v3.1  
**Date (UTC)** : 2026-07-23  

---

## 1. Lifecycle State Machine

Workflows managed by AAWIS follow a deterministic state machine:

1. **DRAFT**: Workflow definition is created but not yet validated.
2. **VALIDATING**: AAWIS parses the DAG and checks for circular dependencies or unreachable nodes.
3. **READY**: Validation passed, workflow is queued for execution.
4. **RUNNING**: Tasks are actively being dispatched to AAOS.
5. **SUSPENDED**: Paused due to an error, resource limit, or pending Human-in-the-Loop (HITL) approval.
6. **COMPLETED**: All terminal nodes in the DAG have resolved successfully.
7. **FAILED**: Execution aborted due to unrecoverable errors.

---

## 2. State Transition Rules

- A workflow cannot transition from **FAILED** to **RUNNING** without a manual retry intervention.
- The transition from **SUSPENDED (HITL)** to **RUNNING** strictly requires an authenticated payload from the Project Owner.

---

## 3. Self Review & Validation

| Validation Item | Required Standard | Result |
|---|---|---|
| Lifecycle Validation | State machine explicitly defined | PASS |
| Governance Compliance | ADF v3.1 Header & Format | PASS |

---

**[End of Document]**
