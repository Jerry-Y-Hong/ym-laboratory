# AGENT_REGISTRY_SCHEMA.md

## 에이전트 메타데이터
- **Agent ID**: 고유 식별자 (UUID) 
- **Name**: 에이전트 이름
- **Version**: 버전 문자열 (예: `v1.0.0`)
- **Capabilities**: 제공 가능한 기능·스킬 리스트
- **Dependencies**: 필요한 외부 서비스·모델
- **Owner**: 책임 팀 혹은 담당자

## 등록(Registration)
- 새 에이전트를 추가할 때 `register_agent` API 호출.
- 메타데이터 검증 후 레지스트리에 저장.
- 초기 상태는 `Provisioned`.

## 탐색(Discovery)
- `list_agents` API 로 현재 레지스트리의 모든 에이전트를 조회.
- 필터링 옵션: 역할, 상태, 버전.

## 버전 관리(Versioning)
- 새 버전은 기존 에이전트와 **호환성**을 유지하도록 설계.
- 버전 업그레이드 시 `upgrade_agent` API 사용.
- 이전 버전은 `Deprecated` 상태로 전환 후 일정 기간 보관.

## Capability Index(역량 인덱스)
- 역량은 카테고리·키워드 기반 인덱스로 저장.
- Task Distribution Engine이 매칭에 활용.

## 런타임 바인딩(Runtime Binding)
- 에이전트가 실제 AERP 서비스에 연결될 때 `bind_runtime` 호출.
- 바인딩 정보(컴퓨팅 플레인, 스케일링 정책) 를 레지스트리에 기록.

---
*위 내용은 상세 스키마 정의가 추가될 자리표시자입니다.*
