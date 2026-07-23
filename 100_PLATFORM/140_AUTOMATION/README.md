# 140_AUTOMATION (데이터 수집 파이프라인 자동화)

## 개요
`140_AUTOMATION` 레이어는 OpenAPI 수집부터 RAW 계층 보존, STANDARD 계층 승격(Promote)에 이르는 데이터 인제스천 파이프라인을 자동화하는 오케스트레이터(`FoodIngestionPipeline`)를 제공합니다.

## 파이프라인 흐름
1. `110_API` RDA OpenAPI Wrapper로 데이터 호출 (`get_food`)
2. `120_DATABASE` RAW 계층에 무수정 원본 JSON 저장 및 SHA-256 해시 검증
3. `120_DATABASE` STANDARD 계층 관계형 스키마 데이터 승격 저장 (`raw_id` 원천 추적 링킹)
