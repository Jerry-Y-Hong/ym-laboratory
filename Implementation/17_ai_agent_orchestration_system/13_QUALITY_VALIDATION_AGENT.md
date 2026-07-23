# Quality Validation Agent

> **Module**: 17_ai_agent_orchestration_system — Document 13  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Quality Validation Agent Specifications

품질 검증 에이전트(Quality Validation Agent)는 최종 콘텐츠 원고를 입수하여 5대 다차원 품질 관문(사실성, SEO품질, 맞춤법, 브랜드일관성, 중복도)을 종합 검증하며, 미달 시 수정 지시서(Feedback)를 발행하여 워크플로우 백트래킹을 제안하거나 인간 리더에게 경보를 전파하는 에이전트이다.

```
                  ┌─────────────────────────────┐
                  │  Quality Validation Agent   │
                  └─────────────┬───────────────┘
                                │
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
   [Inputs (Request)]                      [Outputs (Response)]
 - content_id: 대상 콘텐츠 ID             - overall_passed: 최종 적격 여부
 - draft_body: 분석할 아티클 본문         - validation_report: 5대 필터 결과
 - q_code: 온톨로지 대조 코드             - feedback: 불합격 시 수정 피드백
```

---

## 2. Agent R&R (역할 및 책임)

- **다차원 5대 필터 스캔**:
  - `catalog.db`의 영양 성분 수치와 본문 내용을 정밀 대조하는 **사실성(Fact Check)** 검사 수행.
  - 맞춤법 검사, 고유 톤앤매너 검토(브랜드 일관성), 기존 발행 대기열 간의 텍스트 형태소 유사도 스캔(중복 검사)을 완수한다.
- **백트래킹 제어 피드백 생성**:
  - 검증 실패 시, 누락/왜곡된 항목을 명시한 `feedback` 필드를 첨부하여 워크플로우 엔진이 `Content Generation Agent` 단계로 돌아가 보완 프롬프트를 실행하도록 유도한다.

---

## 3. Communication Interface Spec (JSON)

### 3.1 Input Schema
```json
{
  "run_id": "RUN_9c6e4251-404b-46e7-b7bd-36033c6938df",
  "command": "VALIDATE_QUALITY",
  "params": {
    "content_id": "CNT_20260722_KIMCHI_001",
    "q_code": "Q_KIMCHI_001",
    "draft_body": "# 배추김치 영양성분\n나트륨 630mg..."
  }
}
```

### 3.2 Output Schema (Success/Pass)
```json
{
  "status": "SUCCESS",
  "agent": "quality_validation_agent",
  "output": {
    "overall_passed": true,
    "validation_report": {
      "fact_check": "PASS",
      "seo_quality": "PASS",
      "spelling": "PASS",
      "brand_tone": "PASS",
      "uniqueness": "PASS"
    },
    "feedback": null
  }
}
```

### 3.3 Output Schema (Fail/Backtrack Trigger)
```json
{
  "status": "SUCCESS",
  "agent": "quality_validation_agent",
  "output": {
    "overall_passed": false,
    "validation_report": {
      "fact_check": "FAIL",
      "seo_quality": "PASS",
      "spelling": "FAIL",
      "brand_tone": "PASS",
      "uniqueness": "PASS"
    },
    "feedback": "배추김치의 나트륨 수치가 DB와 일치하지 않으며(본문 800mg vs DB 630mg), '만드는 법' 단어의 맞춤법 오류가 발견되었습니다. 해당 데이터를 정정하여 재생성하십시오."
  }
}
```
Ref: [Quality Validator Document](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/16_blog_automation_system/06_QUALITY_VALIDATOR.md)
