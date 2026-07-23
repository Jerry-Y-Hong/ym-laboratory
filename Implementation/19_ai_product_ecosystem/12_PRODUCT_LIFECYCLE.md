# Product Lifecycle

> **Module**: 19_ai_product_ecosystem — Document 12  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Lifecycle in Ecosystem Context

제품 수명 주기(Product Lifecycle)는 에코시스템에 배포 전개된 AI 제품군의 상태 전이 규칙과 소멸 경로를 관리하는 **런타임 동작 수명 주기 표준 지침**이다.

```
 [Registry 등록 완료] ──→ STAGING (게이트웨이 비공개 격리 테스트 상태)
                              │
                              ▼
    [E2E 검증 통과]     ──→ PRODUCTION (B2B/B2C 스토어 및 게이트웨이 라이브 노출)
                              │
                              ▼
   [사용 중단 / 교체]   ──→ DEPRECATED (신규 라이선스 발급 차단, 기존 유저는 이용 가능)
                              │
                              ▼
   [라이선스 완전 만료] ──→ RETIRED (게이트웨이에서 라우팅 제거 및 프로세스 킬)
```

---

## 2. Transition Actions & Process Control (단계 전이 제어)

- **STAGING → PRODUCTION**:
  - `verify_product.py` 및 전체 생태계 연동 테스트가 100% 성공 판정을 받으면, 게이트웨이의 라우팅 룰 파일(`gateway_rules.json`)을 동적으로 갱신하여 클라이언트의 라이브 트래픽 호출 주소와 해당 컨테이너 샌드박스를 물리 매핑 완료한다.
- **PRODUCTION → DEPRECATED**:
  - 제품의 성능 노화나 신버전 출시 시 상태를 `DEPRECATED`로 전이한다. 이 단계에서는 스토어 포털(`Distribution Portal`)의 신규 판매 목록에서 해당 아이템을 숨김 처리하며, 기존 구독 중인 활성 사용자의 라이선스 키 만료 전까지만 API 게이트웨이 프록시 호출을 허용한다.
- **DEPRECATED → RETIRED**:
  - 모든 연결된 사용자의 라이선스 키가 최종 만료되면 상태를 `RETIRED`로 변경한다. 게이트웨이의 라우팅 매핑 정보를 즉시 완전 소거하며, 샌드박스의 백그라운드 스케줄러 배치 프로세스를 안전하게 종료하고 디렉터리를 아카이브 백업으로 동결 처리한다.

---

## 3. Product Status Registry Schema (JSON)

```json
{
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "lifecycle_registry": {
    "current_state": "PRODUCTION",
    "is_discoverable_in_store": true,
    "allow_gateway_routing": true,
    "registered_at": "2026-07-22T18:09:00+09:00",
    "deprecated_at": null,
    "retired_at": null
  }
}
```
Ref: [Lifecycle Management Document](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/10_LIFECYCLE_MANAGEMENT_GUIDE.md)
