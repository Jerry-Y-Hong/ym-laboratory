# Subscription Billing

> **Module**: 19_ai_product_ecosystem — Document 07  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Subscription Billing Concept

구독 빌링(Subscription Billing)은 마켓플레이스 결제 정보 및 API 게이트웨이 호출 카운터 메트릭을 합산하여, **정해진 기간 단위로 구독료를 결제 처리하고 사용 쿼터량 초과 시 자동 정산서 발행 및 추가 트래픽 과금 차단을 관리하는 정산 논리 계층**이다.

```
       [Partner API 호출 성공] (Gateway 통과)
                  │
                  ▼
       [Usage Counter 누적 증가] (Shared Cache 갱신)
                  │
                  ▼
       [Quota Check 경계선 도달] (임계값 90% 돌파 등)
                  │
         ┌────────┴────────┐
         ▼                 ▼
   [한도 내 사용]    [한도 초과 도달]
 - 호출 정상 지속    - 추가 호출 건당 50원 과금 처리 시작
                     - 혹은 API 429 Too Many Requests 일시 통제
```

---

## 2. Token Quota & API Call Billing Rules

- **무료/유료 쿼터 바운더리**:
  - `Standard` 요금제는 월간 최대 **50건**의 완성형 아티클 생성을 허용한다. 50건 초과분은 건당 추가 과금을 부과하는 하이브리드 빌링 정책을 취한다.
- **인메모리 쿼터 트래킹**:
  - 데이터베이스의 직접적인 실시간 쓰기로 인한 병목을 피하기 위해, 당월 실시간 API 사용량은 로컬 고속 캐시로 먼저 누적 합산하고 배치 스케줄러가 매시간 영속 DB로 직렬화 동기화한다.

---

## 3. Subscription Billing & Invoice Schema (JSON)

```json
{
  "billing_id": "BIL_20260722_YMLAB_001",
  "partner_id": "PARTNER_YMLAB_ENTERPRISE",
  "subscription_tier": "Standard Partner",
  "billing_cycle": {
    "start_date": "2026-07-01T00:00:00+09:00",
    "end_date": "2026-07-31T23:59:59+09:00"
  },
  "quota_usage": {
    "limit": 50,
    "current_used": 42,
    "overage_count": 0
  },
  "billing_status": "paid",
  "invoice_amount_krw": 49000
}
```
Ref: [Marketplace Catalog Pricing](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/19_ai_product_ecosystem/04_MARKETPLACE.md)
