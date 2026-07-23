# YM-LAB Standard 7-Step Automation Workflow

> **Phase**: Phase 07  

---

## 1. The 7-Step Sequence Pipeline

```mermaid
flowchart TD
    S1["1. Analyze (목적/영향 분석)"] --> S2["2. Plan (독립 Task 분할)"]
    S2 --> S3["3. Execute (선택 에이전트 수행)"]
    S3 --> S4["4. Validate (3계층 검증)"]
    S4 -->|Pass| S6["6. Report (표준 보고서 생성)"]
    S4 -->|Fail| S5["5. Recover (원인분석/복구/재검증)"]
    S5 --> S4
    S6 --> S7["7. Update Intelligence (지식 피드백 기록)"]
```

---

## 2. Mandatory Pipeline Rules

- **Execute Prior Plan FORBIDDEN**: Plan 없이 Execute를 절대 실행하지 않는다.
- **Recover Loop**: Validation 실패 시 Recover 단계를 수행하고 반드시 재검증한다.
- **Report Validation**: 검증되지 않은 결과는 절대로 보고서로 제출하지 않는다.
