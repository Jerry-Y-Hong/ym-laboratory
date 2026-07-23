# 02_RUNTIME_ENGINE.md

## Purpose
AEOS 위에서 AI 모델과 워크로드를 실행하는 **Runtime Engine**을 정의하고, 실행 환경, 스케줄링, 격리 메커니즘을 명세한다.

## Scope
- AI 모델 실행 컨테이너 관리
- 워크로드 스케줄링 정책
- 리소스 격리 및 제한
- ADF v2.0 표준과 호환

## Architecture
- **Container Runtime** (Docker/OCI) 위에 **Execution Sandbox** 구현
- **Scheduler** (고우기 기반) → 작업 큐 → 실행 환경 배정
- **Isolation Layer** → cgroups, namespaces, SELinux 적용

## Components
| Component | Description |
|-----------|-------------|
| Engine Core | 워크로드 파싱·스케줄링 로직
| Sandbox Manager | 컨테이너 생성·파괴·리소스 제한
| Scheduler Service | 작업 큐, 우선순위, 의존성 관리
| Execution Monitor | 실행 상태 추적·성능 메트릭 제공 |

## Workflow
1. **Submit Job** – Service Runtime 또는 Agent Runtime이 작업 요청을 Engine에 전송
2. **Queue** – Scheduler가 작업을 큐에 적재, 우선순위 적용
3. **Allocate Resources** – Resource Manager와 협의하여 CPU/Memory 할당
4. **Launch Sandbox** – Sandbox Manager가 격리된 컨테이너 시작
5. **Execute** – Engine Core가 모델 로드·추론 수행
6. **Collect Metrics** – Execution Monitor가 메트릭 전송 → Monitoring
7. **Finish** – 작업 종료 후 컨테이너 파괴, 결과 반환

## Interfaces
- **Job API**: Service Runtime ↔ Runtime Engine (REST/ gRPC)
- **Resource API**: Runtime Engine ↔ Resource Manager
- **Security Hook**: Runtime Engine ↔ Runtime Security (policy 검증)
- **Monitoring Hook**: Execution Monitor ↔ Runtime Monitoring

## Runtime Sequence
1. Deployment → Engine 초기화
2. Job 제출 → Scheduler 큐 삽입
3. Resource 할당 → Sandbox 생성
4. 실행 → Monitoring에 메트릭 스트림
5. 완료 → 결과 반환 및 Sandbox 정리

## Validation
- Architecture Consistency ✅
- Interface Consistency ✅
- Dependency Validation (Resource Manager, Security) ✅
- Runtime Completeness (지원 언어·프레임워크) ✅
- Enterprise Readiness (고가용성, 스케일링) ✅

## Traceability
- `02_RUNTIME_ENGINE.md`는 `01_RUNTIME_ARCHITECTURE.md`의 Engine 컴포넌트를 상세화
- `05_RESOURCE_MANAGER.md`와 `06_RUNTIME_SECURITY.md`와 교차 참조
- `10_AI_OPERATION_AGENT.md`(Phase 22)와 연계된 Agent 실행 흐름 참조

## Version History
| Version | Date (UTC) | Author | Change Summary |
|---------|------------|--------|----------------|
| v1.0.0 | 2026-07-22 | Antigravity (AI) | Runtime Engine 상세 설계 |
