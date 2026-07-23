# YM-LAB Runtime Layer Framework

---

## Runtime State Components

- `task_queue.json`: Pending & in-progress operator tasks.
- `session_context.json`: Cross-session memory & interaction history.
- `operator_state.json`: Current operator state (`IDLE`, `ANALYZING`, `EXECUTING`, `VERIFYING`, `CLOSED`).
- `recovery_state.json`: Active recovery logs and rollback checkpoints.
- `execution_log.json`: Task execution trace logs.
