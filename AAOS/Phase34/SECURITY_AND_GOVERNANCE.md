# SECURITY_AND_GOVERNANCE.md

## 인증(Authentication)
- **서비스 토큰**: 각 AI 직원은 AERP에서 발급받은 JWT 로 인증합니다.
- **다중 요소 인증(MFA)**: 인간 사용자는 MFA를 통해 관리 콘솔에 접근합니다.

## 인가(Authorization)
- **역할 기반 접근 제어(RBAC)**: `ROLE_DEFINITION.md`에 정의된 권한 매트릭스를 사용합니다.
- **데이터 라벨링**: 민감 데이터에 라벨을 붙여 접근 정책을 적용합니다.

## 감사(Audit)
- 모든 에이전트·인간 활동 로그를 **감사 로그 스토어**(예: Cloud Logging) 에 저장.
- 로그는 **불변성**을 보장하기 위해 WORM 스토리지에 보관합니다.

## 컴플라이언스(Compliance)
- ADF v3.1 Governance와 **ISO 27001**, **GDPR** 등을 준수합니다.
- 정기적인 정책 검토와 인증 심사를 수행합니다.

## 거버넌스 정책(Governance Policy)
- **데이터 관리 정책**: 데이터 보존 기간, 삭제 절차, 백업 전략.
- **코드·모델 배포 정책**: 승인 절차와 롤백 규칙.

## 위험 관리(Risk Management)
- 위협 모델링을 통해 위험을 식별하고 **위험 등급**을 부여합니다.
- 고위험 작업은 인간 승인(Approval Workflow) 필요.

---
*각 항목은 향후 상세 규정이 추가될 자리표시자입니다.*
