# 11_POLICY_ENGINE.md

## Overview
AEOS 전체 정책을 정의하고, 정책 적용·감사·위반 처리 메커니즘을 문서화한다. 정책은 **보안**, **거버넌스**, **운영**, **데이터** 네 영역으로 구분된다.

## Policy Domains
- **Security Policy** – 접근 제어, 인증·인가, 비밀 관리 (ADF v2.0 Security Guidelines와 일치).
- **Governance Policy** – 역할·책임 정의, 준수 규정, 감사 주기.
- **Operational Policy** – 서비스 가용성, 복구 시간, 배포 절차 (03_RELEASE_MANAGEMENT.md와 연계).
- **Data Policy** – 데이터 품질, 보존 기간, 개인정보 보호 (05_KPI_FRAMEWORK.md와 연계).

## Enforcement Mechanism
1. **Policy Definition** – 정책은 `policy.yaml` 형태로 선언(문서에 기술만, 실제 파일 생성 금지).
2. **Policy Engine** – 10_AI_OPERATION_AGENT.md가 정책을 실시간 적용하고 위반 시 자동 차단.
3. **Audit Log** – 모든 정책 적용·위반 기록은 `Validation Record`에 저장.
4. **Remediation** – 위반 시 06_INCIDENT_MANAGEMENT.md 절차에 따라 사고로 처리.

## Roles & SLA
| Role | Responsibility | SLA |
|------|----------------|-----|
| Policy Owner | 정책 정의·갱신 | 연 1회 리뷰 |
| Policy Engine | 실시간 적용·감시 | 실시간 (≤ 1 sec) |
| Auditor | 로그 검토·감사 | 월간 보고 |

## References
- 03_RELEASE_MANAGEMENT.md (Phase 22) – 배포 정책 연계
- 05_KPI_FRAMEWORK.md (Phase 22) – KPI 기반 정책 측정
- 06_INCIDENT_MANAGEMENT.md (Phase 22) – 위반 사고 처리
- 10_AI_OPERATION_AGENT.md (Phase 22) – 정책 엔진 연계

*본문 내에서도 필요 시 다른 Deliverable을 교차 참조한다.*
