# 09_ENTERPRISE_DASHBOARD.md

## Overview
AEOS 전사 대시보드 설계 문서이다. KPI, 운영 상태, 인시던트 현황, 변경 진행 상황 등을 시각화하는 대시보드의 구조와 데이터 소스를 정의한다.

## Dashboard Sections
1. **KPI Overview** – 05_KPI_FRAMEWORK.md에서 정의한 KPI를 차트와 테이블로 표시.
2. **Operational Health** – 시스템 가용성, MTTR 등 운영 지표 (06_INCIDENT_MANAGEMENT.md와 연계).
3. **Release Pipeline** – 현재 릴리즈 진행 상황 및 배포 성공률 (03_RELEASE_MANAGEMENT.md와 연계).
4. **Change Queue** – 진행 중인 변경 요청 및 상태 (07_CHANGE_MANAGEMENT.md와 연계).
5. **AI Agent Metrics** – 10_AI_OPERATION_AGENT.md에서 수집한 AI 운영 에이전트 성능 지표.

## Data Sources
| Source | Type | Refresh Rate |
|--------|------|--------------|
| KPI DB | SQL | Daily |
| Monitoring System | Time‑Series | Real‑time |
| CI/CD Pipeline | JSON API | Per Build |
| Change Management System | REST | Hourly |
| AI Agent Telemetry | gRPC | Real‑time |

## Visualization Guidelines
- 컬러 팔레트: 기업 CI와 일관된 다크 모드 스타일.
- 인터랙션: 드릴‑다운, 필터, 시간 범위 선택 지원.
- 접근성: 색 대비 4.5:1 이상, 키보드 탐색 가능.

## References
- 05_KPI_FRAMEWORK.md (Phase 22) – KPI 정의
- 06_INCIDENT_MANAGEMENT.md (Phase 22) – 운영 지표
- 07_CHANGE_MANAGEMENT.md (Phase 22) – 변경 현황
- 10_AI_OPERATION_AGENT.md (Phase 22) – 에이전트 메트릭
- 03_RELEASE_MANAGEMENT.md (Phase 22) – 릴리즈 상태

*본문 내에서도 필요 시 다른 Deliverable을 교차 참조한다.*
