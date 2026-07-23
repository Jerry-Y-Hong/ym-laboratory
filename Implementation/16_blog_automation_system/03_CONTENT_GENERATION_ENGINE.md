# Content Generation Engine

> **Module**: 16_blog_automation_system — Document 03  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Content Generation Engine Overview

콘텐츠 생성 엔진(Content Generation Engine)은 블로그 포스트를 넘어 카드뉴스, 뉴스레터, 전자책(e-book), PDF 등 다양한 한식 교육용 지식 매체에 최적화된 마크다운 및 JSON 규격의 초안을 유연하게 생산한다.

```
[Planning Manifest 수입]
         │
         ▼
[대상 매체(Media Type) 식별] ──→ blog, newsletter, cardnews, ebook
         │
         ▼
[매체 맞춤형 템플릿 로드] ──→ 구조 및 길이 제약 적용
         │
         ▼
[Grounded RAG 컨텍스트 바인딩]─→ catalog.db 실데이터 주입
         │
         ▼
[Model-Agnostic AI 엔진 실행] ──→ 초안 텍스트 및 레이아웃 데이터 생성
         │
         ▼
[매체별 직렬화 파일 저장] ──→ markdown / json 파일 생성
```

---

## 2. Multi-Format Support Specifications

매체 타입(`media_type`)에 따른 프롬프트 지침 및 최종 가공 데이터 사양:

### 2.1 Blog Article & Newsletter
- **형식**: Frontmatter + 일반 마크다운.
- **분량**: 1,500자 ~ 2,500자 내외.
- **특징**: 정보 중심의 헤더(Heading) 계층 및 영양소 요약 테이블 포함.

### 2.2 Card News (카드뉴스)
- **형식**: JSON 배열 구조 (슬라이드별 텍스트 및 레이아웃 정보).
- **분량**: 5~10페이지 내외 단문.
- **특징**: 시각 요소(이미지 삽입구)와 타이틀 텍스트의 1:1 결합.

### 2.3 E-Book & PDF Chapter
- **형식**: 구조화된 챕터별 마크다운 또는 통합 JSON 원고.
- **특징**: 심층 이론 및 약선 조리 실습 파트로 분리 설계.

---

## 3. Generalized Content Output Schema (JSON & Markdown)

생성 엔진의 결과물은 다음의 통일된 JSON 메타데이터와 결합되어 저장된다.

```json
{
  "content_id": "CNT_20260722_KIMCHI_001",
  "plan_id": "PLAN_20260722_KIMCHI_001",
  "q_code": "Q_KIMCHI_001",
  "media_type": "blog",
  "title": "약선 배추김치의 유산균 효능 분석",
  "body_payload": {
    "format": "markdown",
    "file_path": "data/posts/Q_KIMCHI_001_CNT_20260722_KIMCHI_001.md"
  },
  "created_at": "2026-07-22T17:48:00+09:00"
}
```

이 엔진은 매체 종류가 추가되더라도 공통 인터페이스 규격을 따르며, `media_type` 설정 파라미터 변경만으로 기획된 지식을 여러 형태로 다각화하여 동시 퍼블리싱 준비를 진행할 수 있다.
