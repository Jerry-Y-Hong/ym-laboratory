# 10_FAULT_RECOVERY_SYSTEM.md

## Purpose
- 정의 AERP에서 장애 발생 시 자동 복구 메커니즘 및 절차를 문서화합니다.

## Scope
- 인프라, 서비스, AI 에이전트 수준의 장애 복구를 포함합니다.

## Architecture
- **Circuit Breaker** (Hystrix) → **Retry/Backoff** → **Failover** (멀티‑AZ) → **Rollback** (이미지/Helm).
- 상태 저장소: etcd를 이용한 복구 상태 기록.

## Components
- **Health Checker**: Liveness/Readiness probes.
- **Recovery Orchestrator**: Temporal workflow 정의 복구 단계.
- **Rollback Service**: 이전 배포 버전으로 자동 전환.
- **Alert Handler**: 07_RUNTIME_MONITORING 알림 기반 트리거.

## Workflow
1. Monitor 감지 → Alert 발생.
2. Alert Handler 호출 Recovery Orchestrator.
3. Orchestrator는 단계별 복구 작업 실행 (restart, replica 증가, rollback).
4. 복구 성공 시 상태 업데이트, 실패 시 에스컬레이션.

## Interfaces
- `POST /recovery/start` – 복구 시작 API.
- `GET /recovery/status/{id}` – 진행 상황 조회.
- `POST /recovery/cancel` – 복구 취소.

## Runtime Sequence
- 장애 감지 → 알림 → 복구 워크플로우 실행 → 서비스 정상화.

## Validation
- **Self‑Review**: ✅ PASS
- **Automated Tests**: 시뮬레이션 장애 주입, 복구 워크플로우 성공 여부 검증.

## Traceability
- References: 07_RUNTIME_MONITORING.md (알림), 09_DEPLOYMENT_RUNTIME.md (Rollback).

## Version History
- **v3.1.0** – Fault Recovery System 문서 초기 작성.
