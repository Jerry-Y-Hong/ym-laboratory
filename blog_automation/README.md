# Blog Automation System — Phase 01

> **Phase**: 01 — Kimchi Blog Automation  
> **Version**: `v1.0`  
> **Status**: ✅ COMPLETED — Closed & Frozen  
> **Date**: `2026-07-22`  

---

## Overview

사람이 직접 글을 작성하지 않아도 **김치 블로그를 자동 운영**할 수 있는 기반 시스템.

Platform Architecture(`Implementation/13_platform_architecture/`)를 기반으로,  
`blog-saas` Product의 Phase 01 핵심 콘텐츠 생성·SEO·스케줄링·저장 파이프라인을 구현한다.

---

## Document Index

| # | 문서 / 모듈 | 역할 |
| :--- | :--- | :--- |
| 01 | [01_requirements.md](./01_requirements.md) | 기능·비기능 요구사항 정의 |
| 02 | [02_system_design.md](./02_system_design.md) | 시스템 구조, 데이터 흐름, 모듈 명세 |
| 03 | [03_content_pipeline/](./03_content_pipeline/) | 콘텐츠 생성 파이프라인 |
|    | content_generator.py | AI 기반 포스트 초안 생성 |
|    | seo_optimizer.py | SEO 점수 산출 및 메타 태그 생성 |
|    | post_formatter.py | Markdown 최종 포맷 변환 |
| 04 | [04_scheduler/](./04_scheduler/) | 자동 발행 스케줄러 |
|    | publish_queue.py | FIFO 발행 큐 (JSON 영속화) |
|    | blog_scheduler.py | Cron 기반 09:00/20:00 KST 자동 발행 |
| 05 | [05_storage/](./05_storage/) | 포스트 저장소 |
|    | post_schema.py | PostRecord + PostStatus 스키마 |
|    | post_repository.py | JSON 파일 기반 CRUD 저장소 |
| 06 | [06_backlog.md](./06_backlog.md) | 현재 Phase 외 아이디어 (19건) |
| — | [master_report.md](./master_report.md) | Phase 01 완료 보고서 |

---

## Quick Start

```python
from blog_automation.03_content_pipeline import (
    ContentGenerator, BlogRequest,
    SEOOptimizer, PostFormatter
)
from blog_automation.05_storage import PostRepository
from blog_automation.04_scheduler import PublishQueue, BlogScheduler

# 1. 콘텐츠 생성
request = BlogRequest(
    food_code="kimchi_001",
    food_name="배추김치",
    category="전통발효",
    target_keyword="배추김치",
    ingredients=["배추", "고춧가루", "마늘", "생강", "젓갈"],
    recipe_steps=["배추 절이기", "양념 만들기", "버무리기", "발효시키기"],
)
draft = ContentGenerator().generate(request)

# 2. SEO 분석
seo = SEOOptimizer().analyze(draft)
print(f"SEO Score: {seo.seo_score} | Publishable: {seo.is_publishable}")

# 3. 포스트 포맷
post = PostFormatter().format(draft, seo)

# 4. 저장
repo = PostRepository()
record = repo.save_post(post, food_name="배추김치")

# 5. 큐 등록 (SEO 70+ 조건)
if seo.is_publishable:
    queue = PublishQueue()
    queue.enqueue(record.post_id)

# 6. 즉시 발행 사이클 실행
scheduler = BlogScheduler(queue=queue, repository=repo)
result = scheduler.run_once()
print(result)
```

---

## Architecture Reference

- **Platform Architecture**: `Implementation/13_platform_architecture/`
- **Phase 08 Blog Rules**: `Phase_08_Blog_Automation/03_Blog/Blog_Automation_Rule.md`
- **Data Source**: `01_PHASE1_KIMCHI/` (KIMCHI_MASTER, INGREDIENT_MASTER, RECIPE_MASTER)
- **Platform Common Components**: `100_PLATFORM/150_SHARED/` (logger)
