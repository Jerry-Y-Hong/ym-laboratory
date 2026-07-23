# Version Governance

> **Module**: 19_ai_product_ecosystem — Document 13  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Version Governance Architecture

버전 거버넌스(Version Governance)는 다수의 제품군이 서로 다른 주기로 업데이트될 때, API 게이트웨이 엔드포인트의 하위 호환성(Backward Compatibility)을 유지하고 클라이언트 요청을 알맞은 제품 버전 샌드박스로 중계하는 **버전 라우팅 통제 정책**이다.

```
       [Client 요청 수신] (Accept-Version: v1.0.0 헤더 감지)
               │
               ▼
  [Gateway Version Router 작동]
               │
      ┌────────┴────────┐
      ▼                 ▼
  [v1.0.0 매핑]     [v2.0.0 매핑]
 (Staging v1.0)    (Staging v2.0)
      │                 │
      ▼                 ▼
  (v1 컨테이너)      (v2 컨테이너)
```

---

## 2. Backward Compatibility & Version Routing Rules

- **헤더 기반 라우팅**:
  - 게이트웨이는 요청 헤더의 `Accept-Version` 또는 URL 경로의 버저닝(예: `/api/v1/execute/...`)을 해독하여, 해당 버전의 라이브 제품 샌드박스로 패킷을 정확히 프록싱 전송한다.
- **하위 호환성 유지 의무**:
  - 부 버전(Minor) 및 수정 버전(Patch) 업데이트 시에는 게이트웨이의 엔드포인트 규격(JSON 필드명 등)을 임의로 변경할 수 없다. 주 버전(Major) 격상 시에만 기존 버전을 유지한 상태로 병렬 새로운 엔드포인트를 개설하여 기존 B2B 연동사 코드의 작동이 멈추지 않게 보장한다.

---

## 3. Version Routing Table Specification (JSON)

```json
{
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "routing_table": {
    "v1": {
      "latest_patch": "1.0.2",
      "target_endpoint": "data/staging/PROD_KIMCHI_BLOG_SAAS_v1.0.2/run.py"
    },
    "v2": {
      "latest_patch": "2.0.0",
      "target_endpoint": "data/staging/PROD_KIMCHI_BLOG_SAAS_v2.0.0/run.py"
    }
  }
}
```
Ref: [Version Management Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/09_VERSION_MANAGEMENT_SPECIFICATION.md)
