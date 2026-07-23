# Automation Pipeline

> **Module**: 16_blog_automation_system — Document 08  
> **Version**: `v1.1`  
> **Status**: ✅ ACTIVE  

---

## 1. End-to-End Pipeline Workflow Sequence

자동화 파이프라인(Automation Pipeline)은 개별 모듈들을 체인 구조로 엮어 단일 스크립트 실행으로 기획부터 발행 준비까지 연속 처리되는 로컬 자동화 파이프라인의 7대 워크플로우를 정의한다.

```
       [통합 파이프라인 시작] (python run_pipeline.py)
                  │
                  ▼
   [1단계: Knowledge Grounding] ──→ catalog.db 온톨로지 정보 로드
                  │
                  ▼
   [2단계: Content Planning]    ──→ Q-Code 메타데이터 매핑 및 기획
                  │
                  ▼
   [3단계: Content Generation]  ──→ 매체별(Blog/E-book 등) 초안 본문 생성
                  │
                  ▼
   [4단계: Media Binding]       ──→ 이미지/비디오/썸네일 경로 및 alt 매핑
                  │
                  ▼
   [5단계: SEO Static Check]    ──→ 헤더 구조 및 키워드 밀도 분석
                  │
                  ▼
   [6단계: Quality Validation]  ──→ 팩트, 문법, 브랜드, 중복도 다차원 검증
                  │
                  ▼
   [7단계: Publishing Prep]     ──→ FIFO 대기열 적재 및 배포 디렉터리 분리
```

---

## 2. Step Dependencies & Isolation on Failure

모든 스텝은 단방향 의존성(Linear Dependency)을 보장하며, 중간 스텝에서 실패 발생 시 다음과 같은 예외 격리 절차를 적용한다.

- **실패 시 격리 수칙**:
  - 5단계(SEO) 혹은 6단계(Validation) 검증 실패 판정 시, 파이프라인은 즉시 중단을 선언한다.
  - 불합격 처리된 마크다운 본문 및 관련 JSON 메타데이터는 `data/publish_queue.json`에 적재되지 못하며, 파일들은 디스크에서 물리적으로 격리되어 `data/failed/` 임시 디렉터리로 강제 이동된다.
  - 에러 로그를 남기고 실행 상태를 `error`로 기록하여 후속 배치 실행기가 오염된 파일을 참조하는 현상을 사전 예방한다.

---

## 3. Sandboxed Execution Layout (JSON)

실행기 구성 파일 스키마:

```json
{
  "pipeline_run_id": "RUN_20260722_001",
  "workflow_sequence": [
    { "step": 1, "module": "knowledge_loader", "target": "catalog.db" },
    { "step": 2, "module": "content_planner", "target_qcode": "Q_KIMCHI_001" },
    { "step": 3, "module": "content_generation_engine", "media_type": "blog" },
    { "step": 4, "module": "media_manager", "target_assets": "assets/media/kimchi" },
    { "step": 5, "module": "seo_engine", "target_density": [0.01, 0.03] },
    { "step": 6, "module": "quality_validator", "fact_check": true, "grammar_check": true },
    { "step": 7, "module": "publishing_manager", "mode": "preparation" }
  ],
  "sandbox_mode": true,
  "started_at": "2026-07-22T17:48:00+09:00"
}
```

이와 같이 7단계로 워크플로우를 정밀 정형화함으로써, 다카테고리로 확장 시 매니페스트에 대상 식품군 식별자만 파라미터로 추가 지정하는 방식으로 완전 자동 연동된다.
