# 06_INCIDENT_MANAGEMENT.md

## Overview
AEOS의 사고(Incident) 관리 프로세스를 정의한다. 사고 탐지·분류·대응·복구·포스트모템 단계로 구성되며, 각 단계는 책임자와 SLA를 명시한다.

## Incident Lifecycle
1. **Detection** – 모니터링 도구에서 알람 발생, 10_AI_OPERATION_AGENT.md와 연계.
2. **Classification** – 사고 수준(Level 1~3) 정의 및 우선순위 결정.
3. **Response** – 대응 절차 및 팀 할당, 04_OPERATION_PLAYBOOK.md와 연계.
4. **Recovery** – 서비스 복구 및 검증.
5. **Post‑mortem** – 원인 분석·조치 사항 기록, 08_CONTINUOUS_IMPROVEMENT.md와 연계.

## Roles & SLA
| Role | Responsibility | SLA |
|------|----------------|-----|
| Incident Manager | 전체 사고 조율 | 30 min 초기 응답 |
| AI Operation Agent | 자동 알람·상태 수집 | 실시간 |
| Operations Lead | 복구 조치 감독 | 2 h 내 복구 |

## References
- 04_OPERATION_PLAYBOOK.md (Phase 22) – 사고 대응 절차
- 08_CONTINUOUS_IMPROVEMENT.md (Phase 22) – 포스트모템 활용
- 10_AI_OPERATION_AGENT.md (Phase 22) – 자동 탐지 연계

*본문 내에서도 필요 시 다른 Deliverable을 교차 참조한다.*
