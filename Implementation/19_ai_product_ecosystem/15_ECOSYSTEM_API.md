# Ecosystem API Specification

> **Module**: 19_ai_product_ecosystem — Document 15  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Unified Ecosystem REST API Specifications (에코시스템 API)

YM-LAB AI 제품 생태계의 다양한 외부 연동(스토어 포털 조회, 다운로드 세션 획득, API 실행 제어)을 처리하기 위한 에코시스템 중앙 통합 REST API 명세이다.

```
       [Partner Client / Store Front]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
   [GET /api/v1/store]     [POST /api/v1/license/verify]
  (스토어 카탈로그 조회)       (라이선스 키 무결성 검증)
```

---

## 2. API Endpoint Schemas

### 2.1 GET `/api/v1/store` (카탈로그 조회)
- **설명**: 현재 구매 가능한 모든 활성 AI 제품 목록 및 단가를 반환한다.
- **Request Headers**:
  - `Accept: application/json`
- **Response JSON (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "product_id": "PROD_KIMCHI_BLOG_SAAS",
        "title": "김치 블로그 자동 생성기",
        "price_krw": 49000
      }
    ]
  }
}
```

### 2.2 POST `/api/v1/license/verify` (라이선스 검증)
- **설명**: 제공된 라이선스 키의 사용 기한 및 쿼터 적격 여부를 체크한다.
- **Request JSON**:
```json
{
  "license_key": "LIC_KIMCHI_99a8f276cd82b8a7b8e8f81a7b88df18903c6938df"
}
```
- **Response JSON (200 OK - Valid)**:
```json
{
  "status": "success",
  "data": {
    "valid": true,
    "partner_id": "PARTNER_YMLAB_ENTERPRISE",
    "expires_at": "2027-07-22T18:09:00+09:00"
  }
}
```
- **Response JSON (401 Unauthorized - Invalid/Expired)**:
```json
{
  "status": "fail",
  "error": {
    "code": "LICENSE_EXPIRED",
    "message": "라이선스 키 기한이 만료되었습니다. 구독 결제 수단을 갱신하십시오."
  }
}
```
Ref: [Ecosystem API Routing](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/19_ai_product_ecosystem/09_GATEWAY_INTEGRATION.md)
