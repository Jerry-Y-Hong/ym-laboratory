# COLLABORATION_PROTOCOL.md

## Agent ↔ Agent 커뮤니케이션
- **메시지 버스**: 비동기 Collaboration Protocol Enterprise Event Bus 를 통해 에이전트 간/인간-에이전트 메시징을 전송합니다.
- **프로토콜**: JSON 스키마 (`sender`, `receiver`, `timestamp`, `payload`, `correlationId`).
- **보안**: 서명된 토큰과 에이전트 레지스트리 기반 권한 검증을 수행합니다.
- **피드백**: 모든 피드백은 **Knowledge Store**에 저장됩니다.

## Agent ↔ Human 인터랙션
- **Human‑In‑The‑Loop (HITL)**: 고위험 작업(예: 재무 트랜잭션, 정책 변경) 시 인간 승인을 요구합니다.
- **승인 워크플로**: 알림 → 인간 결정(승인/거절) → 에이전트가 결과에 따라 진행 또는 중단합니다.
- **인터페이스**: 웹 UI, 채팅, 이메일 등 **RUNTIME_INTEGRATION.md**에 정의된 엔드포인트를 사용합니다.

## 커뮤니케이션 규칙
- **Rate Limiting**: 에이전트당 초당 최대 100 메시지 제한.
- **Message Size**: 페이로드는 1 MB 이하.
- **Traceability**: 모든 통신은 감사 로그에 기록됩니다.

## 승인 워크플로
1. 에이전트가 **Approval Request** 객체를 생성합니다.
2. 요청은 역할·부서 기반으로 지정된 인간 승인자에게 라우팅됩니다.
3. 승인자는 응답을 제공하고 결과는 감사 로그에 저장됩니다.
4. 에이전트는 승인 결과에 따라 작업을 진행하거나 중단합니다.

## 충돌 해결
- **Task Distribution Engine (Message Queue)**에서 충돌 감지 시 우선순위 계층에 따라 작업 큐 관리 및 스케줄링을 통해 자동 해결합니다.
- 동일 우선순위일 경우 **Human Arbitration Agent**가 중재합니다.

## 에스컬레이션 프로토콜
- 에이전트가 연속적으로 승인 거부 또는 오류를 발생시키면 **Escalation Manager Agent**가 호출됩니다.
- 에스컬레이션은 고위 인간 이해관계자에게 알림을 보내고, 필요 시 리소스를 자동 확장합니다.

---
*각 섹션은 향후 상세 정책·절차가 추가될 자리표시자입니다.*
