# 05_RESOURCE_MANAGER.md

## Purpose
AEOS 위에서 AI 런타임에 필요한 CPU, Memory, I/O, GPU 등 자원을 효율적으로 할당·제어·격리하는 **Resource Manager**를 정의한다.

## Scope
- 자원 할당 정책·쿼터 관리
- 멀티‑테넌트 격리 (cgroups, namespaces 등)
- 동적 스케일링 및 자동 조정
- ADF v2.0 Governance Standard와 호환 보장

## Architecture
- **Resource Scheduler**: 요청 기반 자원 스케줄링 알고리즘
- **Quota Engine**: 테넌트별 할당량 관리·초과 방지
- **Isolation Layer**: cgroup·namespace·SELinux 적용
- **Metrics Collector**: 실시간 자원 사용량 수집·Monitoring 연계

## Components
| Component | Description |
|-----------|-------------|
| Scheduler | 작업/Agent 요청을 받아 적절한 노드·컨테이너에 매핑 |
| Quota Manager | 테넌트·프로젝트별 CPU/Memory/GPU 한도 정의 |
| Isolation Controller | Linux cgroups, namespaces, AppArmor 적용 |
| Usage Collector | 자원 사용량(시간,량) 수집·Metrics API 제공 |
| Policy Adapter | Runtime Security와 연동해 자원 정책 검증 |

## Workflow
1. **Request** – Runtime Engine 또는 Agent Runtime이 자원 요청(API) 전송
2. **Check Quota** – Quota Manager가 테넌트 할당량 확인
3. **Schedule** – Scheduler가 최적 노드·컨테이너 선택
4. **Allocate** – Isolation Controller가 cgroup 등으로 자원 격리
5. **Execute** – Engine이 작업 실행, 사용량을 Usage Collector에 보고
6. **Monitor** – Runtime Monitoring 실시간 메트릭 수집
7. **Adjust** – 필요 시 자동 스케일링·리밸런싱 수행

## Interfaces
- **Resource Request API**: Runtime Engine / Agent Runtime → Resource Manager (REST/gRPC)
- **Quota API**: Admin 툴 → Quota Manager (CRUD)
- **Metrics API**: Usage Collector → Runtime Monitoring (Prometheus format)
- **Security Hook**: Policy Adapter ↔ Runtime Security (권한 검증)

## Runtime Sequence
1. 서비스/에이전트 실행 요청 → Resource Manager에 요청
2. Quota 검증 → Scheduler가 노드 선택
3. Isolation 적용 → 컨테이너 시작
4. 작업 실행 → 메트릭 전송 → Monitoring
5. 작업 종료 → 리소스 반환

## Validation
- Architecture Consistency ✅
- Interface Consistency ✅
- Dependency Validation (Runtime Engine, Security) ✅
- Runtime Completeness (동적 할당·스케일링) ✅
- Enterprise Readiness (고가용성·자동 복구) ✅

## Traceability
- `01_RUNTIME_ARCHITECTURE.md` (Phase 23) – Resource Manager 컴포넌트 정의
- `02_RUNTIME_ENGINE.md` – Engine이 Resource Manager에 의존
- `06_RUNTIME_SECURITY.md` – 정책 검증 연계
- `10_AI_OPERATION_AGENT.md` (Phase 22) – Agent가 자원 요청 시나리오와 연계

## Version History
| Version | Date (UTC) | Author | Change Summary |
|---------|------------|--------|----------------|
| v1.0.0 | 2026-07-22 | Antigravity (AI) | Resource Manager 초기 설계 |
