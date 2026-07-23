# AI_EMPLOYEE_SPECIFICATION.md

## 직원 ID
- 고유 식별자 (예: `AE-EMP-001`).
- 전역 유니크성을 보장하는 UUID 형식.

## 역할(Role)
- **ROLE_DEFINITION.md**에 정의된 역할을 참조 (예: `Developer Agent`).
- 역할에 따라 기능 세트와 권한 범위가 결정됩니다.

## Capability(역량)
- 수행 가능한 기능 목록 (코드 생성, 테스트 실행, 문서 작성 등).
- Capability는 버전 관리되고 모델 아티팩트와 연결됩니다.

## Skills(스킬)
- 에이전트가 호출할 수 있는 구체적인 스킬 모듈 (예: `code_synthesis`, `unit_test_creation`).
- 스킬은 **Agent Registry**에 등록됩니다.

## Permission(권한)
- 역할 기반 접근 제어(RBAC) 엔트리.
- 데이터스토어 읽기/쓰기, 외부 API 접근 등 서비스별 권한.

## Responsibility(책임)
- 기대되는 산출물 및 품질 지표.
- 할당된 작업에 대한 소유권.

## Runtime Assignment(런타임 할당)
- AERP 런타임 자원(컴퓨팅, 스토리지, 모델 엔드포인트)과 매핑.
- 배포 구성(컨테이너 이미지, 스케일링 정책).

## Agent Registry(에이전트 레지스트리)
- Phase 33 `AGENT_REGISTRY_SCHEMA.md`에 정의된 중앙 레지스트리 엔트리와 연계.
- 등록 라이프사이클 훅 포함.

## Role Definition(역할 정의)
- **ROLE_DEFINITION.md**와 동일한 역할 정의를 사용하고, 계층적 역할 상속을 지원.

## Status Model(상태 모델)
- 상태값: `Provisioned`, `Active`, `Paused`, `Retired`.
- 상태 전환은 거버넌스 정책에 의해 제어됩니다.

---
*각 항목은 상세 정의가 채워질 자리표시자입니다.*
