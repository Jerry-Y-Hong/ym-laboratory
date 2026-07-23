# Blog Automation System — Phase 01 System Design

> **System**: Blog Automation System  
> **Phase**: 01 — Kimchi Blog Automation  
> **Version**: `v1.0`  

---

## 1. System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│              BLOG AUTOMATION SYSTEM — Phase 01 (Kimchi)              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Data Sources]          [Core Pipeline]          [Output]           │
│  01_PHASE1_KIMCHI   →   ContentGenerator    →    DRAFT Post          │
│  KIMCHI_MASTER      →   SEOOptimizer        →    QUEUED Post         │
│  INGREDIENT_MASTER  →   PostFormatter       →    Markdown File       │
│  RECIPE_MASTER      →   BlogScheduler       →    Publish Log         │
│                         PostRepository      →    JSON Store          │
│                                                                      │
│  [Platform Layer (Mock)]                                             │
│  130_AI_ENGINE → interface.py (Mock)                                 │
│  150_SHARED → platform_logger                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
blog_automation/               ← Phase 01 루트 (신규 디렉터리)
│
├── 01_requirements.md         ← 요구사항 정의
├── 02_system_design.md        ← 시스템 설계 (본 문서)
│
├── 03_content_pipeline/       ← 콘텐츠 생성 파이프라인
│   ├── __init__.py
│   ├── content_generator.py   ← AI 기반 블로그 콘텐츠 생성기
│   ├── seo_optimizer.py       ← SEO 최적화 엔진
│   └── post_formatter.py      ← 포스트 Markdown 포맷터
│
├── 04_scheduler/              ← 자동 발행 스케줄러
│   ├── __init__.py
│   ├── blog_scheduler.py      ← Cron 기반 스케줄 관리
│   └── publish_queue.py       ← 발행 큐 (FIFO, JSON)
│
├── 05_storage/                ← 포스트 저장소
│   ├── __init__.py
│   ├── post_schema.py         ← 포스트 데이터 스키마 (dataclass)
│   └── post_repository.py     ← 포스트 CRUD (JSON 파일 기반)
│
├── data/                      ← 런타임 데이터 (자동 생성)
│   ├── posts/                 ← 포스트 JSON 저장소
│   ├── queue/                 ← 발행 큐 파일
│   └── logs/                  ← 실행 로그
│
├── 06_backlog.md              ← 현재 Phase 외 아이디어
├── README.md                  ← 디렉터리 인덱스
└── master_report.md           ← Phase 01 최종 보고서
```

---

## 3. Module Specifications

### 3.1 ContentGenerator (`03_content_pipeline/content_generator.py`)

**역할**: 김치 데이터를 입력받아 블로그 포스트 초안(Draft)을 생성한다.

**입력**:
```python
@dataclass
class BlogRequest:
    food_code: str          # 예: "kimchi_001"
    food_name: str          # 예: "배추김치"
    category: str           # 예: "전통발효"
    target_keyword: str     # SEO 타겟 키워드
    ingredients: list       # 재료 목록
    nutrition: dict         # 영양 정보
    recipe_steps: list      # 레시피 단계
```

**출력**:
```python
@dataclass
class BlogDraft:
    post_id: str            # UUID
    title: str              # H1 제목
    summary: str            # Executive Summary (150~200자)
    body: str               # Main Body (Markdown)
    nutrition_table: str    # Q-Code 영양 테이블 (Markdown)
    cta_footer: str         # CTA Footer
    target_keyword: str     # SEO 타겟 키워드
    created_at: str         # ISO8601
```

**처리 흐름**:
```
BlogRequest → _generate_title() → _generate_summary() → _generate_body()
           → _generate_nutrition_table() → _generate_cta() → BlogDraft
```

---

### 3.2 SEOOptimizer (`03_content_pipeline/seo_optimizer.py`)

**역할**: 생성된 초안의 SEO 지표를 분석하고 최적화 결과를 반환한다.

**입력**: `BlogDraft`  
**출력**: `SEOResult`

```python
@dataclass
class SEOResult:
    post_id: str
    seo_score: int          # 0~100
    keyword_density: float  # %
    meta_title: str         # 60자 이내
    meta_description: str   # 160자 이내
    title_has_keyword: bool
    issues: list[str]       # SEO 개선 사항
    is_publishable: bool    # score >= 70
```

**SEO 점수 산출 기준**:

| 항목 | 점수 |
| :--- | :--- |
| 타겟 키워드 제목 포함 | +20 |
| 키워드 밀도 1.0~2.0% | +20 |
| 메타 디스크립션 존재 | +15 |
| 본문 400자 이상 | +15 |
| H2 소제목 2개 이상 | +15 |
| 영양 테이블 존재 | +15 |
| **합계** | **100** |

---

### 3.3 PostFormatter (`03_content_pipeline/post_formatter.py`)

**역할**: `BlogDraft` + `SEOResult`를 최종 발행 가능한 Markdown 파일로 변환한다.

**입력**: `BlogDraft`, `SEOResult`  
**출력**: `FormattedPost`

```python
@dataclass
class FormattedPost:
    post_id: str
    filename: str           # "{post_id}_{food_code}.md"
    markdown_content: str   # 최종 Markdown 전문
    meta_title: str
    meta_description: str
    seo_score: int
    word_count: int
    status: str             # "DRAFT"
    created_at: str
```

---

### 3.4 PostSchema (`05_storage/post_schema.py`)

**역할**: 포스트 상태 및 메타데이터 스키마를 정의한다.

```python
from enum import Enum

class PostStatus(Enum):
    DRAFT = "DRAFT"
    QUEUED = "QUEUED"
    PUBLISHED = "PUBLISHED"
    FAILED = "FAILED"

@dataclass
class PostRecord:
    post_id: str
    food_code: str
    food_name: str
    title: str
    filename: str
    status: PostStatus
    seo_score: int
    created_at: str
    queued_at: str | None
    published_at: str | None
    failed_reason: str | None
    retry_count: int
```

---

### 3.5 PostRepository (`05_storage/post_repository.py`)

**역할**: JSON 파일 기반 포스트 CRUD.

```
data/posts/
├── index.json              ← 전체 포스트 인덱스 (PostRecord 목록)
└── {post_id}_{food_code}.md ← 실제 Markdown 콘텐츠
```

**주요 메서드**:
- `save_post(formatted_post) → PostRecord`
- `get_post(post_id) → PostRecord | None`
- `list_posts(status=None, category=None) → list[PostRecord]`
- `update_status(post_id, status, **kwargs) → PostRecord`
- `exists_by_food_code(food_code) → bool`

---

### 3.6 PublishQueue (`04_scheduler/publish_queue.py`)

**역할**: FIFO 발행 큐. JSON 파일로 영속화.

```
data/queue/queue.json       ← 대기 중인 post_id 목록
```

**주요 메서드**:
- `enqueue(post_id) → None`
- `dequeue() → str | None`
- `peek() → str | None`
- `size() → int`
- `is_empty() → bool`

---

### 3.7 BlogScheduler (`04_scheduler/blog_scheduler.py`)

**역할**: 일 2회 자동 발행 스케줄 관리. `schedule` 표준 라이브러리 사용.

**스케줄**:
- `09:00 KST` → 큐에서 포스트 꺼내어 발행 처리
- `20:00 KST` → 큐에서 포스트 꺼내어 발행 처리

**발행 처리 로직**:
```
dequeue() → PostRepository.get_post() → [발행 시뮬레이션]
→ 성공: update_status(PUBLISHED)
→ 실패(retry < 3): retry_count++ + 재큐
→ 실패(retry >= 3): update_status(FAILED) + 로그 기록
```

---

## 4. Data Flow

```
[Step 1] 콘텐츠 생성 요청
  BlogRequest(food_code, ...) → ContentGenerator.generate()

[Step 2] SEO 분석
  BlogDraft → SEOOptimizer.analyze()

[Step 3] 포맷 변환
  (BlogDraft + SEOResult) → PostFormatter.format()

[Step 4] 저장
  FormattedPost → PostRepository.save_post() → PostRecord(DRAFT)

[Step 5] 큐 등록 (SEO Score >= 70)
  PostRepository.update_status(QUEUED) → PublishQueue.enqueue()

[Step 6] 자동 발행 (스케줄러)
  BlogScheduler → PublishQueue.dequeue() → [발행] → PostRepository.update_status(PUBLISHED)
```

---

## 5. Error Handling

| 오류 상황 | 처리 방법 |
| :--- | :--- |
| 중복 food_code 포스트 생성 시도 | 예외 발생 없이 기존 PostRecord 반환 |
| SEO 점수 < 70 | DRAFT 상태로 저장, 큐 미등록, issues 로그 |
| 발행 실패 | retry_count++, 재큐 (max 3회) |
| 파일 I/O 오류 | 예외 로깅 후 FAILED 상태로 전환 |
