# SEO Engine

> **Module**: 16_blog_automation_system — Document 05  
> **Version**: `v1.1`  
> **Status**: ✅ ACTIVE  

---

## 1. SEO Validation Rules (SEO 검증 규칙)

SEO 엔진(SEO Engine)은 생성된 블로그 초안 및 뉴스레터 마크다운 텍스트를 정적 분석하여, 검색 엔진 노출 최적화 상태와 메타 정보 정합성을 사전 스캔한다.

```
[Markdown 콘텐츠 수집] (Content Generation Engine에서 생성)
         │
         ▼
[메타프론트매터 검사] ──→ content_id, q_code, title 필드 존재 확인
         │
         ▼
[키워드 밀도 분석]     ──→ 핵심 키워드가 본문 내 적정 비율(1% ~ 3%)인지 검증
         │
         ▼
[구조적 태그 검사]     ──→ H1, H2 헤더 배치 및 이미지 alt 속성 존재성 확인
         │
         ▼
  [SEO 점수 리포트]    ──→ 유효성 검사 PASS 여부 반환
```

---

## 2. SEO Quality Metrics

- **키워드 분포 및 밀도 (Keyword Density)**:
  - 본문 텍스트 내에서 기획된 `core_keywords`가 너무 많이 반복되어 스팸으로 처리되거나(4% 초과), 너무 적게 포함되지 않도록(1% 미만) 모니터링한다.
- **제목 및 헤더 매칭 (Heading Hierarchy)**:
  - 단일 `# H1` 태그(제목)를 지향하고, 소주제는 `## H2` 및 `### H3`를 계층적으로 사용하였는지 분석한다.
- **미디어 대체 텍스트 검증**:
  - `04_MEDIA_MANAGER`가 바인딩한 이미지 및 미디어 대체 텍스트(`alt`)가 적절히 들어갔는지 크로스체크한다.

---

## 3. SEO Report Schema (JSON)

```json
{
  "content_id": "CNT_20260722_KIMCHI_001",
  "seo_score": 85,
  "checks": {
    "has_title": true,
    "keyword_density_ok": true,
    "heading_hierarchy_ok": true,
    "media_alt_ok": true
  },
  "warnings": [
    "H3 태그가 H2 태그 없이 단독으로 사용되었습니다."
  ],
  "passed": true
}
```

이 규칙은 파이썬 표준 스트링 라이브러리(`re`)를 활용해 가볍고 빠르게 로컬 정적 검사 형태로 구동되므로, 다른 식품 카테고리 기사 검사 시에도 핵심 키워드 세트만 파라미터로 넘겨주면 동일하게 적용된다.
