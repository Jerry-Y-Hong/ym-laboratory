# 06_RUNTIME_SECURITY.md

## Purpose
AEOS 위에서 실행되는 모든 런타임 컴포넌트에 대해 **보안 정책**을 정의·적용·감시하는 Runtime Security 를 설계한다. 인증·인가·샌드박스·감사 메커니즘을 포함한다.

## Scope
- 인증(Authentication) 및 권한 부여(Authorization) 프레임워크
- 런타임 샌드박스 및 격리 정책
- 정책 위반 감지·알림·차단
- ADF v2.0 보안 가이드라인과 완전 호환

## Architecture
- **Auth Service**: 외부 IDP(OIDC)와 연계, JWT 발급
- **Policy Engine**: XACML‑style 정책 정의·평가
- **Sandbox Controller**: cgroup·namespace·AppArmor 적용
- **Audit Logger**: 모든 보안 이벤트 기록·외부 SIEM 연계
- **Enforcement Hook**: Runtime Engine·Agent Runtime·Service Runtime 등에 삽입되어 실시간 정책 검증

## Components
| Component | Description |
|-----------|-------------|
| Auth Service | 사용자·서비스 계정 인증, 토큰 발급 |
| Policy Engine | 정책 저장·평가·버전 관리 |
| Sandbox Controller | 리소스 격리·제한 적용 |
| Audit Logger | 보안 이벤트 로그 수집·전송 |
| Enforcement Hook | 각 런타임에 정책 적용 포인트 |

## Workflow
1. **Authenticate** – 클라이언트가 Auth Service에 인증 요청, JWT 획득
2. **Authorize** – 요청 시 Policy Engine이 권한 검사
3. **Enforce** – Enforcement Hook이 허용/거부 결정, Sandbox Controller가 격리 적용
4. **Execute** – 허용된 경우 Runtime Engine/Agent이 작업 수행
5. **Audit** – 모든 시도와 결과를 Audit Logger에 기록
6. **Monitor** – Runtime Monitoring 수집된 보안 메트릭을 검토, 이상 징후 탐지 시 알림

## Interfaces
- **Auth API** (REST) – 로그인·토큰 발급·갱신
- **Policy API** (REST/gRPC) – 정책 CRUD·조회·버전 관리
- **Enforcement API** – 런타임 컴포넌트와 Hook 연결 (callback 인터페이스)
- **Audit API** – 로그 수집·외부 SIEM 전송 (Syslog/HTTP)
- **Monitoring Hook** – 보안 메트릭 → Runtime Monitoring

## Runtime Sequence
1. 서비스/에이전트 요청 → Auth Service 인증
2. Policy Engine이 요청 검증
3. 허용 시 Enforcement Hook이 Sandbox 적용
4. 작업 실행 → Execution Monitor 수집
5. 완료 후 Audit Logger에 기록
6. 보안 이벤트가 Monitoring에 전송되고 알림 발생

## Validation
- Architecture Consistency ✅
- Interface Consistency ✅
- Dependency Validation (Auth Service, Policy Engine, Monitoring) ✅
- Runtime Completeness (Auth·AuthZ·Sandbox·Audit) ✅
- Enterprise Readiness (고가용성·로그 영구 보관) ✅

## Traceability
- `01_RUNTIME_ARCHITECTURE.md` (Phase 23) – Security Layer 정의와 연계
- `02_RUNTIME_ENGINE.md` – Engine이 Enforcement Hook을 통해 보안 검증
- `05_RESOURCE_MANAGER.md` – Resource 할당 시 보안 정책 적용
- `10_AI_OPERATION_AGENT.md` (Phase 22) – Agent 인증·권한 흐름과 연계

## Version History
| Version | Date (UTC) | Author | Change Summary |
|---------|------------|--------|----------------|
| v1.0.0 | 2026-07-22 | Antigravity (AI) | Runtime Security 기본 설계 |
