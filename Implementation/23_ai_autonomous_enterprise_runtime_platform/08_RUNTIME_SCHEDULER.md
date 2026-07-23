# 08_RUNTIME_SCHEDULER.md

## Purpose
AEOS 위에서 주기적·의존성 작업, 배치 잡, 이벤트 기반 트리거를 관리·실행하는 **Runtime Scheduler**를 정의한다.

## Scope
- Cron‑like 정기 스케줄링
- 의존성 DAG 기반 작업 흐름
- 실시간 이벤트 트리거
- ADF v2.0 스케줄링 표준과 호환

## Architecture
- **Scheduler Core**: Quartz‑style 엔진, 타임라인 관리
- **Job Store**: 지속적 작업 정의·상태 저장 (SQL/NoSQL)
- **Dependency Resolver**: DAG 분석·순서 결정
- **Trigger Listener**: 이벤트/시그널 수신·작업 시작
- **Executor Bridge**: Runtime Engine·Service Runtime에 작업 전달

## Components
| Component | Description |
|-----------|-------------|
| Scheduler Core | 스케줄링 알고리즘·시간 관리 |
| Job Store | 작업 정의·메타데이터·상태 저장 |
| Dependency Resolver | 작업 간 의존성 분석·실행 순서 결정 |
| Trigger Listener | 외부 이벤트·시간 트리거 수신 |
| Executor Bridge | 작업을 Runtime Engine·Service에 전달 |
| Monitoring Hook | 실행 상태·성공/실패 메트릭 제공 |

## Workflow
1. **Define Job** – Service Runtime 또는 Agent가 Job Store에 작업 정의
2. **Set Trigger** – Cron 표현식·Event 리스너 지정
3. **Resolve Dependencies** – 필요 시 DAG 분석
4. **Schedule** – Scheduler Core가 타임라인에 등록
5. **Trigger** – 시간 도래 혹은 이벤트 발생 시 Trigger Listener가 알림
6. **Dispatch** – Executor Bridge가 작업을 Runtime Engine에 전달
7. **Execute** – Engine이 작업 수행, 결과를 Job Store에 기록
8. **Monitor** – Runtime Monitoring이 메트릭 수집·Alert 생성

## Interfaces
- **Job API**: Create/Update/Delete jobs (REST/gRPC) → Job Store
- **Trigger API**: Set Cron/Event triggers (REST) → Scheduler Core
- **Dependency API**: Define DAG edges (JSON) → Dependency Resolver
- **Execution API**: Executor Bridge ↔ Runtime Engine / Service Runtime
- **Monitoring API**: Scheduler status → Runtime Monitoring

## Runtime Sequence
1. Job 정의 → Scheduler에 등록
2. 트리거 발생 → Executor Bridge가 Engine에 작업 전달
3. 작업 실행 → 완료 후 결과와 메트릭 전송
4. Job Store 업데이트 → 알림/재시도 처리

## Validation
- Architecture Consistency ✅
- Interface Consistency ✅
- Dependency Validation (Runtime Engine, Monitoring) ✅
- Runtime Completeness (정기·이벤트·의존성 스케줄링) ✅
- Enterprise Readiness (고가용성·재시도·백업) ✅

## Traceability
- `01_RUNTIME_ARCHITECTURE.md` (Phase 23) – Scheduler 레이어 정의
- `02_RUNTIME_ENGINE.md` – Executor Bridge와 연계
- `07_RUNTIME_MONITORING.md` – Scheduler 상태 모니터링
- `09_DEPLOYMENT_RUNTIME.md` – 배포 단계에서 스케줄링 사용 사례

## Version History
| Version | Date (UTC) | Author | Change Summary |
|---------|------------|--------|----------------|
| v1.0.0 | 2026-07-22 | Antigravity (AI) | Runtime Scheduler 기본 설계 |
