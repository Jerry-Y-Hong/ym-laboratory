# Licensing Management

> **Module**: 19_ai_product_ecosystem — Document 05  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Licensing Management System Specification

라이선스 관리(Licensing Management)는 유료/구독 중인 고객사의 AI 제품 실행 허가권 유효성을 런타임에 정밀 대조 검증하는 **API 게이트웨이 및 배포 인증의 중추 수호 계층**이다.

```
       [Partner Client 요청 수신] (API Key / License Key 제공)
                   │
                   ▼
     [Licensing Logic 검증 루틴 작동]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   [검증 적격]          [검증 부적격]
 - 만료일 잔여        - 만료일 초과
 - 쿼터 사용 범위 내    - 쿼터 초과 또는 정지 키
         │                   │
         ▼                   ▼
     (실행 승인)         (401 Unauthorized 오류 차단)
```

---

## 2. License Key Formats & Validation Rules

- **암호화 서명 키 규격**:
  - 라이선스 키는 파트너 고유 ID, 제품 ID, 만료 정보를 조합하여 SHA-256 서명 처리된 암호 토큰 형식으로 구성된다.
- **실시간 만료일 체크**:
  - 게이트웨이는 요청 처리 전 라이선스의 `expires_at` 필드가 현재 타임스탬프보다 큰지(잔여 기간 존재) 체크한다.
- **동시 구동 노드 제한**:
  - 단일 키당 동시 구동할 수 있는 에이전트 인스턴스 개수(예: 최대 3대)를 초과해 동작 시 과도한 API 오버로드를 감지하고 임시 정지시킨다.

---

## 3. License Key Schema (JSON)

```json
{
  "license_key": "LIC_KIMCHI_99a8f276cd82b8a7b8e8f81a7b88df18903c6938df",
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "partner_id": "PARTNER_YMLAB_ENTERPRISE",
  "status": "active",
  "issued_at": "2026-07-22T18:09:00+09:00",
  "expires_at": "2027-07-22T18:09:00+09:00",
  "allowed_features": [
    "blog_article_generation",
    "media_injection",
    "seo_analysis"
  ]
}
```

이 라이선스 데이터를 게이트웨이가 인메모리 세션 캐시로 적재 조회함으로써, 대용량 호출 환경에서도 10ms 이하의 극소 오버헤드로 라이선싱 위반을 판별 및 원천 제어할 수 있게 돕는다.
Ref: [Agent Protocol Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/17_ai_agent_orchestration_system/16_AGENT_PROTOCOL_INTERFACE.md)
