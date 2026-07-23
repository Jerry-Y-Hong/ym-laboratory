# Marketplace Design

> **Module**: 19_ai_product_ecosystem — Document 04  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Marketplace Concepts (스토어/마켓플레이스 설계)

마켓플레이스(Marketplace)는 B2B 엔터프라이즈 및 일반 파트너들이 YM-LAB AI 제품 팩토리에서 양산된 지식 가공 애플리케이션 제품들의 목록을 검색하고 가격 모델을 대조하여, 구매 및 라이선스 키를 즉시 획득할 수 있도록 지원하는 **글로벌 B2B 제품 유통 스토어 계층**이다.

```
                    [Marketplace 제품 탐색]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     [B2B Partner Tier]                   [API Usage Tier]
  (레시피 AI, 스마트팜 스토어)            (쿼리당 과금, 블로그 자동 생성)
                               │
                               ▼
                    [구독 결제 유도 및 구매]
                               │
                               ▼
            [05_LICENSING 및 03_DISTRIBUTION 활성화]
```

---

## 2. Product Catalog & Pricing Standard

마켓플레이스는 제품 종류별로 다양한 비즈니스 과금 모델(Pricing Model)을 적용할 수 있도록 유연한 데이터 구성을 지원한다.
- **Flat-Rate Subscription (고정 월 구독)**:
  - 매월 고정비 지불 후 무제한 또는 한계 쿼터까지 사용 가능 (예: `스마트팜 SaaS` - 월 100,000원).
- **Pay-As-You-Go (종량제 과금)**:
  - 에이전트 구동 횟수, 생성된 아티클 건수당 차등 청구 (예: `블로그 자동화` - 건당 500원).
- **Enterprise Volume Discount (볼륨 계약)**:
  - 대형 프랜차이즈 파트너(B2B) 대상 전용 라이선스 패키지 구성.

---

## 3. Product Catalog Schema (JSON)

```json
{
  "catalog_items": [
    {
      "item_id": "CAT_KIMCHI_BLOG_SAAS",
      "product_id": "PROD_KIMCHI_BLOG_SAAS",
      "title": "김치 교육 블로그 자동화 생성 솔루션",
      "description": "Q-Code 온톨로지 기반의 무결한 한식 영양 성분 매핑 아티클을 자동 기획 및 다형 매체 생성",
      "pricing_models": [
        {
          "tier_name": "Standard Partner",
          "billing_type": "subscription",
          "price_krw": 49000,
          "interval": "monthly",
          "quota_limit": {
            "max_articles_per_month": 50,
            "included_media_assets": true
          }
        }
      ],
      "active": true
    }
  ]
}
```
Ref: [MVP Strategy Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/master_implementation_report.md#L27-L30)
