# Customer Management

> **Module**: 19_ai_product_ecosystem — Document 06  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Customer Management Concept

고객 관리(Customer Management)는 YM-LAB 제품 생태계를 이용하는 B2B 파트너 기업 및 일반 B2C 개별 사용자의 계정 상태, 소속 그룹, 소유 라이선스 매핑 관계를 통합 보관 및 식별하는 **계정 및 접근 제어 데이터베이스 인터페이스**이다.

```
       [Partner Admin 콘솔 로그인]
                    │
                    ▼
       [Customer Registry 쿼리 조회]
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   [B2B Enterprise]       [B2C Individual User]
 - 회사 식별명            - 개인 식별 ID
 - 할당 라이선스 키 목록   - 단일 라이선스 키 바인딩
         │                     │
         ▼                     ▼
         (맞춤형 권한 부여 및 감사 로그 기록)
```

---

## 2. Customer Attributes & Access Control Roles

- **역할군 정의 (RBAC)**:
  - `system_admin`: 제품 등록 및 라이선스 강제 파기 권한.
  - `partner_admin`: 파트너사 하부 사용자 추가 및 라이선스 키 사용량 확인.
  - `viewer`: 모니터링 메트릭 및 리포트 조회 전용.
- **감사 로깅 (Audit Log)**:
  - 고객사가 라이선스 키를 재발행하거나 권한 변경 요청 시, 로깅 에이전트(`15_MONITORING_LOGGING_AGENT.md`)를 통해 행위 일시와 IP를 마스터 로그 파일에 영구 기록한다.

---

## 3. Customer Metadata Schema (JSON)

```json
{
  "partner_id": "PARTNER_YMLAB_ENTERPRISE",
  "company_name": "와이엠글로벌 약선연구소",
  "contact_email": "admin@ymglobal.com",
  "status": "active",
  "rbac_role": "partner_admin",
  "bound_licenses": [
    "LIC_KIMCHI_99a8f276cd82b8a7b8e8f81a7b88df18903c6938df"
  ],
  "audit_trail": [
    {
      "action": "license_viewed",
      "timestamp": "2026-07-22T18:09:00+09:00",
      "operator": "admin_user"
    }
  ]
}
```

이 계정 관리 정보와 라이선스 맵을 연계함으로써, 고객사의 구독 결제 정보가 갱신되거나 정지될 때 해당 계정이 소유한 에이전트 인스턴스의 API 가동 상태를 원격에서 일괄 즉각 차단 또는 가동 복원할 수 있게 돕는다.
Ref: [Ecosystem Architecture](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/19_ai_product_ecosystem/01_ECOSYSTEM_ARCHITECTURE.md)
