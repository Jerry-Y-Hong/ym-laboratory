# 08_RUNTIME_SCHEDULER.md

## Purpose
- Define scheduling mechanisms for tasks, jobs, and AI agents within the AERP.

## Scope
- Includes cron‑style schedules, event‑driven triggers, and resource‑aware job queuing.

## Architecture
- Scheduler Service (based on Temporal or Airflow) orchestrates tasks.
- Task Queue (Redis/Message Queue) stores pending jobs.
- Workers (Kubernetes Pods) execute tasks.

## Components
- **Scheduler API**: REST/GRPC interface for creating schedules.
- **Job Dispatcher**: Picks jobs from the queue respecting priority and resource limits.
- **Worker Pools**: Autoscaling groups for different workload types (batch, streaming, AI inference).

## Workflow
1. User/API submits a schedule definition.
2. Scheduler stores definition in PostgreSQL.
3. At execution time, Scheduler emits a job to the Queue.
4. Worker polls queue, runs the job, reports status.
5. Completion triggers callbacks or downstream pipelines.

## Interfaces
- `POST /schedules` – Create schedule.
- `GET /schedules/{id}` – Retrieve schedule.
- `POST /jobs/{id}/cancel` – Cancel running job.

## Runtime Sequence
- Scheduler evaluates cron expressions every minute.
- On match, creates job entry and notifies Dispatcher.
- Dispatcher respects concurrency limits and assigns to a worker.

## Validation
- **Self‑Review**: ✅ PASS
- **Automated Tests**: Unit tests for cron parsing, integration test for job lifecycle, load test for 10k concurrent schedules.

## Traceability
- References: 04_OPERATION_PLAYBOOK.md (Scheduling procedures), 07_RUNTIME_MONITORING.md (Alerting on schedule failures).

## Version History
- **v3.1.0** – Initial creation of Runtime Scheduler documentation.
