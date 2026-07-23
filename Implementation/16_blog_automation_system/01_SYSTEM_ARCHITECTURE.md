# System Architecture

> **Module**: 16_blog_automation_system — Document 01  
> **Version**: `v1.1`  
> **Status**: ✅ ACTIVE  

---

## 1. Overall System Architecture Layout

YM-LAB 김치 블로그 자동화 시스템(Kimchi Blog Automation System)은 **온톨로지 RAG 기반 지식 그라운딩**을 통해 식품 정보의 무결성을 유지하며, 다카테고리로 쉽게 확장 가능한 모듈러 파이프라인 아키텍처를 따른다.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          [11_CONFIGURATION]                            │
│                        통합 설정 파일 (config.json)                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Environment & Settings Load)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        [300_KNOWLEDGE_ENGINE]                          │
│                     원천 약선 온톨로지 지식 DB (catalog.db)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Q-Code Grounding)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        [100_PLATFORM Core Layer]                       │
│    - 110_API (농식품 OpenAPI)     - 120_DATABASE (로컬 파일 R/W)         │
│    - 130_AI_ENGINE (Model-Agnostic)  - 150_SHARED (오류/공통 로깅)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Shared Service API)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                [16_blog_automation_system Pipeline]                    │
│  ┌──────────────────────┐   ┌──────────────────────┐   ┌────────────┐  │
│  │ 02_CONTENT_PLANNER   ├──→│ 03_CONTENT_GENERATION├──→│ 04_MEDIA_  │  │
│  │ (키워드/식재료 매핑)   │   │ (카드뉴스/블로그생성)│   │  MANAGER   │  │
│  └──────────────────────┘   └──────────┬───────────┘   └─────┬──────┘  │
│                                        │                     │         │
│                                        ▼                     ▼         │
│  ┌──────────────────────┐   ┌──────────┴───────────┐   ┌─────┴──────┐  │
│  │ 07_PUBLISHING_MGR    │←──│ 06_QUALITY_VALIDATOR │←──│ 05_SEO_    │  │
│  │ (발행 대기열/준비)    │   │ (확장형 다차원 검증)  │   │  ENGINE    │  │
│  └──────────────────────┘   └──────────────────────┘   └────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Platform Core Pipelines (핵심 파이프라인 흐름)

1. **지식 주입 및 수집 (Knowledge Ingestion)**:
   - 외부 원천 데이터와 상호작용하여 수집한 표준 마스터 데이터를 `catalog.db`에 주입한다.
2. **콘텐츠 계획 (Content Planning)**:
   - `02_CONTENT_PLANNER`가 타겟 식재료의 Q-Code를 로드하고 가중치 키워드를 도출하여 기획 매니페스트를 생성한다.
3. **콘텐츠 생성 (Content Generation)**:
   - `03_CONTENT_GENERATION_ENGINE`이 매체 속성(`media_type`)을 확인하여 블로그, 카드뉴스, 뉴스레터, e-book에 특화된 포맷으로 지식을 자동 생성한다.
4. **미디어 자산 바인딩 (Media Mapping)**:
   - `04_MEDIA_MANAGER`가 기획된 식품 정보에 맞는 이미지, 동영상, 썸네일, 배 badge 아이콘을 최적 위치에 연결하고 alt 속성을 주입한다.
5. **SEO 분석 및 품질 검증 (SEO & Validation)**:
   - `05_SEO_ENGINE`이 가독성과 키워드 밀도를 점검한다.
   - `06_QUALITY_VALIDATOR`가 팩트체크, 중복도, 문법, 브랜드 일관성을 종합 검증한다.
6. **발행 준비 및 대기열 (Publishing Preparation)**:
   - 모든 유효성 게이트를 통과한 결과물은 `07_PUBLISHING_MANAGER`가 관리하는 로컬 FIFO(First-In-First-Out) 대기열 큐 파일에 적재되어 발행 대기(Preparation) 상태로 보존된다.

---

## 3. Technology & Framework Agnostic Design (도메인/기술 독립 설계)

- **언어 및 모델 비의존성**:
  - AI API 호출은 설정 파일(`config.json`) 및 `130_AI_ENGINE` 허브를 경유하여 느슨하게 연계되며 벤더사 변경에도 안전하다:
    > *The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.*
- **순수 발행 준비 역할 한정 (Publishing Preparation Boundary)**:
  - 실제 포털이나 특정 블로그 플랫폼에 직접 원격 게시글을 업로드하는 동작은 플랫폼 API 종속성이 크므로 본 파이프라인 영역에서는 영속화된 발행 대기열(JSON FIFO) 적재 및 최종 마크다운 가공 준비 과정까지만을 담당하도록 명확히 한정하여 설계의 깔끔함과 보안성을 보장한다.
- **로컬 단순성 극대화**:
  - 복잡한 클라우드 스케줄러 대신 로컬 JSON 파일 및 파이썬 로컬 입출력 제어 수칙을 따른다.
