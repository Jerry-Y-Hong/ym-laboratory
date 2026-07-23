# 100_PLATFORM (공통 식품 플랫폼 레이어)

## 아키텍처 개요
`100_PLATFORM`은 특정 식품(김치 등)에 종속되지 않고, 농촌진흥청 농식품올바로 OpenAPI 연동부터 3계층 데이터베이스 저장, AI 엔진 규격, 자동화 파이프라인까지 향후 모든 식품 도메인이 활용할 수 있는 **범용 엔터프라이즈 식품 플랫폼 모듈**입니다.

## 서브 모듈 구성

```text
100_PLATFORM/
├── 110_API          # 농식품올바로 OpenAPI 래퍼 (get_food, get_recipe, get_nutrients, get_images)
├── 120_DATABASE     # 3계층 데이터 저장 아키텍처 (RAW / STANDARD / SEMANTIC SQL & Repositories)
├── 130_AI_ENGINE    # 추상화된 AI 엔진 규격 인터페이스 (BaseAIEngineInterface)
├── 140_AUTOMATION   # 데이터 수집 및 원본 보존 자동화 파이프라인 (FoodIngestionPipeline)
└── 150_SHARED       # 공통 로깅, 커스텀 예외 체계, SHA-256 해시 유틸리티
```

## 핵심 구현 원칙
1. **기존 Phase 1 구조 변경 금지**: `01_PHASE1_KIMCHI` 파일 및 설계 문서를 일체 변경하지 않음.
2. **OpenAPI 원본 보존(RAW Layer)**: 수집된 원본 데이터는 페이로드 SHA-256 해시와 함께 수정 없이 영구 저장.
3. **하드코딩 금지**: `.env` 환경 변수 기반 설정 관리 (`config.py`).
4. **실증 검증 스위트 제공**: `python verify_platform.py`를 통해 모든 계층의 동작 및 Phase 1 격리 상태를 자동 검증.
