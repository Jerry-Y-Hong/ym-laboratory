# SEO Agent

> **Module**: 17_ai_agent_orchestration_system — Document 12  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. SEO Agent Specifications

SEO 에이전트(SEO Agent)는 작성 및 미디어 삽입이 완료된 텍스트 원고를 입수하여, 검색 엔진 최적화 점수를 판정하고 키워드 빈도 분포, 태그 적정성 등을 점검하여 평가 리포트를 생성하는 에이전트이다.

```
                  ┌──────────────────────┐
                  │      SEO Agent       │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Inputs (Request)]                [Outputs (Response)]
 - content_id: 가공된 콘텐츠 ID      - seo_score: 종합 평점 (0~100)
 - draft_body: 분석할 최종 본문       - check_list: 구조적 정밀 체크 결과
 - core_keywords: 기획안 핵심 키워드  - passed: 게이트 통과 여부 flag
```

---

## 2. Agent R&R (역할 및 책임)

- **정적 분석 스캔**:
  - 본문 스트링 내에서 핵심 키워드의 포함 밀도를 카운트하고 헤더(`H1` ~ `H3`) 계층의 일치 여부를 파싱하여 정량 점수(`seo_score`)를 매긴다.
- **보고서 발행**:
  - `Validation Framework` 및 `Workflow Engine`이 다음 전이 단계 진행 여부의 근거로 사용할 수 있는 검증 JSON 리포트를 리턴한다.

---

## 3. Communication Interface Spec (JSON)

### 3.1 Input Schema
```json
{
  "run_id": "RUN_9c6e4251-404b-46e7-b7bd-36033c6938df",
  "command": "ANALYZE_SEO",
  "params": {
    "content_id": "CNT_20260722_KIMCHI_001",
    "draft_body": "# 배추김치 영양성분\n나트륨 칼륨 식이섬유...",
    "core_keywords": ["배추김치 영양성분"]
  }
}
```

### 3.2 Output Schema
```json
{
  "status": "SUCCESS",
  "agent": "seo_agent",
  "output": {
    "seo_score": 90,
    "check_list": {
      "has_title_h1": true,
      "keyword_density_ok": true,
      "images_have_alt": true
    },
    "passed": true
  }
}
```
Ref: [SEO Engine Document](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/16_blog_automation_system/05_SEO_ENGINE.md)
