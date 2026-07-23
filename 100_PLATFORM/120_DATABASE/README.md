# 120_DATABASE (3계층 데이터 저장 레이어)

## 개요
`120_DATABASE` 레이어는 공통 식품 플랫폼의 데이터 저장 구조를 3단계 계층으로 분리하여 데이터의 원본 무결성 보존, 비즈니스 표준화, 및 AI 연동을 아우르는 엔터프라이즈 데이터 아키텍처를 제공합니다.

## 3계층 아키텍처 (3-Tier Storage Architecture)

```text
[ OpenAPI Response ]
         │
         ▼
 ┌───────────────┐
 │   RAW Layer   │ ── OpenAPI 수집 원본 JSON 100% 손상 없이 저장 (절대 수정 불가, SHA-256 해시 검증)
 └───────────────┘
         │
         ▼
 ┌───────────────┐
 │STANDARD Layer │ ── 모든 식품 도메인 표준 관계형 스키마 (STD_FOOD, STD_RECIPE, STD_NUTRIENT)
 └───────────────┘
         │
         ▼
 ┌───────────────┐
 │SEMANTIC Layer │ ── AI 프로세싱, 지식 그래프(Knowledge Graph), 및 벡터 임베딩 레이어
 └───────────────┘
```

## 스키마 및 리포지토리 구성
1. **`schema/01_RAW_LAYER.sql` & `raw_repository.py`**:
   - 수집된 원본 데이터를 페이로드 해시(`payload_hash`)와 함께 영구 보존
   - 무결성 검증 메서드 포함
2. **`schema/02_STANDARD_LAYER.sql` & `standard_repository.py`**:
   - `raw_id` FK를 통해 원본 원천 추적이 가능한 표준 식품 데이터 레이어
3. **`schema/03_SEMANTIC_LAYER.sql`**:
   - 시맨틱 엔티티 노드(`SEM_FOOD_KNOWLEDGE_NODES`), 관계(`SEM_FOOD_RELATIONS`), 및 AI 임베딩 Vector 스키마
