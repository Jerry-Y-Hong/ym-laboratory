# 03_AGENT_RUNTIME.md

## Purpose
AEOS 위에서 AI **Agent**가 운영, 관리, 의사결정을 수행하도록 하는 **Agent Runtime**을 정의한다. Agent의 등록·헬스·통신·생명주기 관리와 정책 적용 메커니즘을 기술한다.

## Scope
- Agent 등록·인증·인증서 관리
- Heartbeat·Health Check
- Agent‑to‑Engine 인터페이스
- 정책 기반 Agent 동작 제어
- ADF v2.0 가이드라인 준수

## Architecture
- **Agent Registry**: 고유 ID와 메타데이터 저장소
- **Health Monitor**: 주기적 Heartbeat 수집, 상태 판단
- **Communication Bus**: gRPC 메시징 기반, 양방향 스트림
- **Policy Enforcement**: Runtime Security와 연계하여 실행 권한 검증

## Components
| Component | Description |
|-----------|-------------|
| Registry Service | Agent 메타데이터 CRUD, 인증서 관리 |
| Heartbeat Service | 주기적 상태 보고, 이상 감지 |
| Agent Bus | Agent ↔ Runtime Engine, Service Runtime 통신 채널 |
| Policy Adapter | Security Engine과 연계, 권한 검증 |
| Lifecycle Manager | 등록 → 활성화 → 비활성화 → 삭제 흐름 관리 |

## Workflow
1. **Register** – Agent가 Registry Service에 정보를 등록하고 인증서 교환
2. **Activate** – Lifecycle Manager가 Agent를 활성화하고 Bus에 연결
3. **Heartbeat** – Heartbeat Service가 정해진 간격으로 상태 전송
4. **Execute** – Agent는 Bus를 통해 Runtime Engine에 작업 요청
5. **Policy Check** – Policy Adapter가 요청을 Security Engine에 검증
6. **Result** – 실행 결과를 Agent에게 반환, 필요 시 Service Runtime에 전달
7. **Deregister** – 종료 시 Registry에서 삭제

## Interfaces
- **Agent API** (gRPC) – Register, Heartbeat, Execute, Deregister
- **Engine API** – 작업 전송, 상태 조회
- **Security Hook** – Policy Enforcement 요청
- **Monitoring Hook** – Heartbeat → Runtime Monitoring

## Runtime Sequence
1. Agent 시작 → Register 호출
2. 런타임 엔진 초기화 → Agent Bus 연결
3. Heartbeat 전송 → Monitoring 수집
4. 작업 요청 → Scheduler → Runtime Engine 실행
5. 결과 반환 → Agent → Service Runtime (if needed)
6. 장애 시 Fault Recovery가 개입

## Validation
- Architecture Consistency ✅
- Interface Consistency ✅
- Dependency Validation (Runtime Engine, Security) ✅
- Runtime Completeness (등록·헬스·통신·정책) ✅
- Enterprise Readiness (고가용성·복구) ✅

## Traceability
- `01_RUNTIME_ARCHITECTURE.md` (Phase 23) – Agent Runtime 컴포넌트 정의
- `02_RUNTIME_ENGINE.md` (Phase 23) – Engine과의 인터페이스 참조
- `06_RUNTIME_SECURITY.md` (Phase 23) – 정책 연계
- `10_AI_OPERATION_AGENT.md` (Phase 22) – 기존 Agent 개념과 연계

## Version History
| Version | Date (UTC) | Author | Change Summary |
|---------|------------|--------|----------------|
| v1.0.0 | 2026-07-22 | Antigravity (AI) | Agent Runtime 설계 초안 |
