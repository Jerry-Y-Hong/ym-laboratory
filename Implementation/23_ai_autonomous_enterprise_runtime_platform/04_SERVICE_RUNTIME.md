# 04_SERVICE_RUNTIME.md

## Purpose
AEOS 위에서 AI 서비스(REST API, 배치 작업 등)를 제공하는 **Service Runtime**을 정의한다. 서비스 배포·스케일링·관리를 위한 메커니즘을 기술한다.

## Scope
- 서비스 컨테이너 관리
- API 게이트웨이 연동
- 배포 전략·버전 관리
- ADF v2.0 표준과 호환

## Architecture
- **Service Manager**: 서비스 정의·배포·스케일링 담당
- **Container Runtime**: Docker/OCI 기반 서비스 컨테이너 실행
- **API Gateway**: 외부 요청 라우팅·인증·정책 적용
- **Version Registry**: 서비스 버전 메타데이터 저장

## Components
| Component | Description |
|-----------|-------------|
| Service Manager | 서비스 정의, 배포 파이프라인, 스케일링 정책 |
| Container Runtime | 서비스 컨테이너 실행·자원 격리 |
| API Gateway | 요청 라우팅·인증·권한 검사 |
| Version Registry | 버전 관리·롤백 지원 |
| Health Probe | Liveness/Readiness 체크 |

## Workflow
1. **Define Service** – Service Manager에 서비스 메타데이터 등록
2. **Build Image** – CI 파이프라인에서 컨테이너 이미지 생성
3. **Deploy** – Deployment Runtime이 이미지 배포, Container Runtime에서 실행
4. **Expose** – API Gateway가 엔드포인트 노출 및 인증 적용
5. **Scale** – Service Manager가 부하에 따라 인스턴스 수 조정
6. **Monitor** – Runtime Monitoring이 메트릭 수집, Validation이 상태 검증
7. **Update/Rollback** – Version Registry를 통해 새로운 버전 배포 또는 롤백

## Interfaces
- **Service API**: Service Manager ↔ Deployment Runtime (REST/ gRPC)
- **Container API**: Service Manager ↔ Container Runtime (Docker Engine API)
- **Gateway API**: API Gateway ↔ External Clients (HTTPS)
- **Health Hook**: Health Probe ↔ Runtime Monitoring
- **Security Hook**: API Gateway ↔ Runtime Security (policy 적용)

## Runtime Sequence
1. Service 정의 → 이미지 빌드 → 배포 → API 노출 → 요청 처리 → 모니터링 → 필요 시 스케일/업데이트

## Validation
- Architecture Consistency ✅
- Interface Consistency ✅
- Dependency Validation (Container Runtime, API Gateway, Security) ✅
- Runtime Completeness (배포·스케일·버전 관리) ✅
- Enterprise Readiness (Zero‑downtime 배포) ✅

## Traceability
- `01_RUNTIME_ARCHITECTURE.md`에 정의된 Service Layer와 연계
- `02_RUNTIME_ENGINE.md`와 Resource Manager 연계
- `06_RUNTIME_SECURITY.md`와 정책 적용 연계
- `10_AI_OPERATION_AGENT.md`(Phase 22)에서 서비스 호출 시나리오와 연계

## Version History
| Version | Date (UTC) | Author | Change Summary |
|---------|------------|--------|----------------|
| v1.0.0 | 2026-07-22 | Antigravity (AI) | Service Runtime 초기 설계 |
