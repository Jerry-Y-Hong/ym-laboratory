# Content Planner

> **Module**: 16_blog_automation_system — Document 02  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Content Planning Pipeline Overview

콘텐츠 플래너(Content Planner)는 원천 약선 온톨로지 정보에 연결된 `Q-Code`와 가중치 핵심 키워드를 결합하여 블로그 포스트의 기획 데이터(Planning Manifest)를 생성한다.

```
[Target Q-Code 선정] (예: Q_KIMCHI_001)
         │
         ▼
[식재료 마스터 정보 로드] ──→ catalog.db 조회 (한글명, 영양성분)
         │
         ▼
[키워드 조합 및 타겟 설정] ──→ 타겟 독자군에 맞는 핵심 키워드 매칭
         │
         ▼
[Planning Manifest 생성] ──→ JSON 형식으로 03_ARTICLE_GENERATOR에 전송
```

---

## 2. Keyword Mapping Strategy & Data Spec

기획 단계에서 도출되는 메타데이터는 단순 텍스트가 아닌, 다음과 같은 형식의 구조화된 데이터 규격을 준수한다.

### 2.1 Mapped Food Codes
- 대상 식재료의 물리 정보 및 온톨로지 매핑에 사용되는 식별자 목록.
  - `q_code`: `Q_KIMCHI_001` (약선 온톨로지 코드)
  - `food_code`: `D018274` (농식품올바로 표준 식품 코드)

### 2.2 Keyword Weight and Target Audience
- **핵심 키워드(Core Keyword)**: 검색량이 높고 지식 전달에 유용한 키워드 조합. (예: `["배추김치 영양성분", "유산균 김치 효능"]`)
- **타겟 독자군(Target Audience)**: 식재료의 영양적 특성에 기초하여 필터링한다. (예: `dietary_nutrition` 타겟인 경우 고혈압 환자용 저염 김치 레시피 연계)

---

## 3. Planning Manifest Schema (JSON)

생성된 기획안은 E2E 파이프라인에서 읽을 수 있도록 로컬 JSON 파일로 직렬화하여 저장한다.

```json
{
  "plan_id": "PLAN_20260722_KIMCHI_001",
  "q_code": "Q_KIMCHI_001",
  "food_name": "배추김치",
  "core_keywords": [
    "배추김치 영양성분",
    "김치 유산균 효능",
    "약선 배추김치 만드는 법"
  ],
  "target_audience": "dietary_nutrition_seeker",
  "status": "planned",
  "created_at": "2026-07-22T17:48:00+09:00"
}
```

이 기획 데이터 규격은 향후 `Q_RICE_042` 등 다른 식재료로 전환될 때도 동일한 스키마가 적용되며, 키워드와 Q-Code 필드만 변경된다.
