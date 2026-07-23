# Planning Agent

> **Module**: 17_ai_agent_orchestration_system — Document 08  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Planning Agent Specifications

기획 에이전트(Planning Agent)는 대상 식재료(Q-Code)와 연관된 영양 정보를 로드하고 타겟 독자군 분석을 통해 콘텐츠 제작 기획 매니페스트(`Planning Manifest`)를 발행하는 에이전트이다.

```
                  ┌──────────────────────┐
                  │    Planning Agent    │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Inputs (Request)]                [Outputs (Response)]
 - q_code: "Q_KIMCHI_001"          - plan_id: 고유 기획 번호
 - target_audience: 독자 분석 필터   - q_code / food_name
 - core_keywords: 추출할 키 세트    - core_keywords: 기획 키워드 배열
                                   - target_audience
```

---

## 2. Agent R&R (역할 및 책임)

- **식재료 매핑 기획**:
  - `q_code`를 받아 `catalog.db`의 마스터 데이터와 연계하며, 한식 교육 목적에 부합하는 타겟 키워드 조합을 기획한다.
- **기획 매니페스트 발행**:
  - 생성 및 검증 모듈이 참조할 수 있는 구조화된 JSON 응답값을 생성하여 `Shared Memory`에 저장한다.

---

## 3. Communication Interface Spec (JSON)

### 3.1 Input Schema (Request Payload)
```json
{
  "run_id": "RUN_9c6e4251-404b-46e7-b7bd-36033c6938df",
  "command": "PLAN_CONTENT",
  "params": {
    "q_code": "Q_KIMCHI_001",
    "target_audience": "dietary_nutrition_seeker",
    "keywords_limit": 3
  }
}
```

### 3.2 Output Schema (Response Payload)
```json
{
  "status": "SUCCESS",
  "agent": "planning_agent",
  "output": {
    "plan_id": "PLAN_20260722_KIMCHI_001",
    "q_code": "Q_KIMCHI_001",
    "food_name": "배추김치",
    "core_keywords": [
      "배추김치 영양성분",
      "김치 유산균 효능",
      "약선 배추김치 조법"
    ],
    "target_audience": "dietary_nutrition_seeker"
  }
}
```
- **표준화 규칙**:
  - 기획 에이전트는 기획 단계에 한해 동작하며, 실제 기사를 직접 작성하거나 미디어를 가공하는 동작은 수행하지 않는다. 오직 기획 데이터셋 생산에만 책임을 진다.
