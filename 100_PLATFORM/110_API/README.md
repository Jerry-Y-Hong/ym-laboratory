# 110_API (농식품올바로 OpenAPI 래퍼 레이어)

## 개요
`110_API` 레이어는 농촌진흥청 농식품올바로 OpenAPI 연동 구조를 제공하며, 특정 식품에 종속되지 않고 향후 모든 식품 도메인에서 재사용 가능한 공통 API Wrapper 구조로 설계되었습니다.

## 주요 기능 및 래퍼 메서드
- `get_food(food_code)`: 식품 기본 정보 수집 및 DTO 변환
- `get_recipe(recipe_id)`: 레시피, 조리 단계 및 재료 정보 수집 및 DTO 변환
- `get_nutrients(food_code)`: 열량, 탄수화물, 단백질, 나트륨 등 영양 성분 수집
- `get_images(food_code_or_recipe_id)`: 대표 이미지 및 미디어 정보 수집

## 주요 특징
1. **하드코딩 방지**: API Key 및 Endpoint 설정은 `.env` 및 `config.py`를 통해 동적 관리
2. **DTO 추상화**: 외부 API 수집 결과를 공통 DTO (`GenericFoodDTO`, `GenericRecipeDTO` 등)로 표준화
3. **안전성**: 지연 타임아웃, 지수 백오프 재시도(Exponential Backoff), 및 오프라인/개발용 Mock 지원
