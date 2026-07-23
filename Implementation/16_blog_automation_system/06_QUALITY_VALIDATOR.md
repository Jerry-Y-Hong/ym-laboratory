# Quality Validator

> **Module**: 16_blog_automation_system — Document 06  
> **Version**: `v1.1`  
> **Status**: ✅ ACTIVE  

---

## 1. Expanded Quality Validation Architecture (종합 품질 검증 구조)

품질 검증자(Quality Validator)는 단순히 온톨로지 수치 팩트체크를 하는 수준을 넘어, 지식 아티클의 신뢰성과 브랜드 가치 유지를 위해 아래 **5대 다차원 품질 유효성 게이트**를 실행한다.

```
       [초안 콘텐츠 데이터 로드]
                   │
  ┌────────────────┼────────────────┬────────────────┐
  ▼                ▼                ▼                ▼
[1. 사실성 검증] [2. 문법/맞춤법] [3. 브랜드 일관성] [4. 중복도 검사]
(Nutrition check)  (Standard spelling) (Tone & Manner)  (Similarity scan)
  │                │                │                │
  └────────────────┼────────────────┴────────────────┘
                   ▼
         [5. SEO 품질 최종 통과]
                   │
                   ▼
       [Publishing Preparation 적재]
```

---

## 2. Five Validation Pillars (5대 검증 필터 규칙)

### 2.1 Fact Check (사실성 검증 - Q-Code & catalog.db 연계)
- 본문에 명시된 영양 성분 수치값(예: 나트륨 630mg)과 `catalog.db` 데이터베이스의 수치가 정확히 1:1 일치하는지 체크한다. 오차율 **0%**의 엄격한 무결성을 요구한다.

### 2.2 SEO Quality (SEO 품질 재검증)
- `05_SEO_ENGINE`의 정적 체크를 참조하여, 키워드 채우기(Stuffed keywords) 현상이 없고, 이미지 대체 텍스트가 유실되지 않았음을 최종 컨펌한다.

### 2.3 Grammar & Spelling (문법 검사)
- 파이썬 로컬 맞춤법 라이브러리 또는 AI의 정적 검토를 통해 비표준어, 오탈자, 불필요한 번역투 문장을 필터링한다.

### 2.4 Brand Consistency (브랜드 일관성)
- YM-LAB 한식 교육 프로젝트의 고유 어조(친절하고 객관적인 지식 전달 톤앤매너)를 유지하고 있는지 판별한다. 자극적인 광고성 홍보 문구가 포함되면 게이트를 즉시 차단한다.

### 2.5 Duplicate Content Check (중복 콘텐츠 검사)
- 이전에 발행 대기열에 저장된 기사 목록과의 형태소 유사도 스캔을 통해 유사성이 **50% 이상**인 중복 아티클 생성을 차단하여 검색 엔진 저품질 판정을 회방한다.

---

## 3. Comprehensive Validation Report Schema (JSON)

```json
{
  "content_id": "CNT_20260722_KIMCHI_001",
  "q_code": "Q_KIMCHI_001",
  "checked_at": "2026-07-22T17:48:00+09:00",
  "results": {
    "fact_check_passed": true,
    "seo_quality_passed": true,
    "grammar_checked": true,
    "brand_consistency_passed": true,
    "no_duplicate_content": true
  },
  "scores": {
    "originality_score": 0.95,
    "readability_score": 0.88
  },
  "overall_passed": true
}
```

- **예외 복구 메커니즘**:
  - 검증에 실패한 초안은 즉시 `status: rejected` 처리되며 발행 큐에 올라가지 못한다. 실패한 분석 로그는 에러 파일로 격리(`data/failed/`)되어 향후 AI의 품질 보완 학습 프롬프트 재시도 정보로 순환 재사용된다.
