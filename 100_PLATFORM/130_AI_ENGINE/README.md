# 130_AI_ENGINE (AI 엔진 기반 레이어)

## 개요
`130_AI_ENGINE` 모듈은 공통 식품 플랫폼이 향후 다양한 LLM 모델(Gemini, Claude, GPT 등) 및 시맨틱 변환기를 플러그인(Pluggable) 구조로 수용할 수 있도록 추상화된 AI 인터페이스 계약(`BaseAIEngineInterface`)을 정의합니다.

## 핵심 규약
- `process_semantic_enrichment()`: 원본 데이터로부터 AI 기반 지식 노드 및 관계 추출 계약
- `generate_embeddings()`: 텍스트 임베딩 벡터 생성 계약
