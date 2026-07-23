# 07_CHANGE_MANAGEMENT.md

## Overview
AEOS의 변경 관리 프로세스를 정의한다. 변경 요청, 평가, 승인, 구현, 검증, 배포 단계를 포함하며, 각 단계에서 담당 역할과 SLA를 명시한다.

## Change Lifecycle
1. **Request** – 비즈니스 요구·기술 개선 요청, 02_PROJECT_LIFECYCLE.md와 연계.
2. **Assessment** – 영향도·리스크 분석, 05_KPI_FRAMEWORK.md와 연계하여 KPI 영향 평가.
3. **Approval** – Change Advisory Board(CAB) 승인, 03_RELEASE_MANAGEMENT.md와 연계.
4. **Implementation** – 구현 작업, 04_OPERATION_PLAYBOOK.md와 연계.
5. **Verification** – 사전·사후 테스트, 06_INCIDENT_MANAGEMENT.md와 연계.
6. **Deployment** – 배포 실행, 03_RELEASE_MANAGEMENT.md와 연계.

## Roles & SLA
| Role | Responsibility | SLA |
|------|----------------|-----|
| Change Manager | 전체 프로세스 조율 | 48 h 내 승인 |
| CAB Member | 위험 평가·승인 | 24 h 내 회신 |
| AI Operation Agent | 자동화된 변경 검증 | 실시간 |

## References
- 02_PROJECT_LIFECYCLE.md (Phase 22) – 프로젝트 단계와 연계
- 03_RELEASE_MANAGEMENT.md (Phase 22) – 릴리즈 절차와 연계
- 04_OPERATION_PLAYBOOK.md (Phase 22) – 구현 및 배포 절차
- 05_KPI_FRAMEWORK.md (Phase 22) – KPI 영향 분석
- 06_INCIDENT_MANAGEMENT.md (Phase 22) – 변경 후 사고 관리

*본문 내에서도 필요 시 다른 Deliverable을 교차 참조한다.*
