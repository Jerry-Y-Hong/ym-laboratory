# Knowledge Agent

> **Module**: 17_ai_agent_orchestration_system — Document 09  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Knowledge Agent Specifications

지식 에이전트(Knowledge Agent)는 `catalog.db` 및 JSON 캐시로 구성된 약선 온톨로지 지식베이스로부터 영양 성분 수치, 조리 표준, 가공 규칙을 쿼리하여 그라운딩 컨텍스트(`Grounded Context`)를 획득 및 적재하는 에이전트이다.

```
                  ┌──────────────────────┐
                  │   Knowledge Agent    │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Inputs (Request)]                [Outputs (Response)]
 - q_code: "Q_KIMCHI_001"          - q_code / food_name
 - db_source: "catalog.db"         - nutrition_facts: 실데이터 딕셔너리
                                   - grounded_text: RAG 주입용 텍스트
```

---

## 2. Agent R&R (역할 및 책임)

- **정밀 데이터 인출**:
  - 오차 없는 지식 주입을 위해 지정된 SQLite 경로 및 JSON 파일을 스캔하여 식재료 원장 데이터를 구조화된 포맷으로 인출한다.
- **RAG 컨텍스트 템플릿 변환**:
  - 콘텐츠 생성 에이전트가 오독 없이 프롬프트 인젝션에 사용할 수 있도록 `[Grounded Context]` 형태의 명확한 문자열로 포맷팅하여 `Shared Memory`에 바인딩한다.

---

## 3. Communication Interface Spec (JSON)

### 3.1 Input Schema
```json
{
  "run_id": "RUN_9c6e4251-404b-46e7-b7bd-36033c6938df",
  "command": "RETRIEVE_KNOWLEDGE",
  "params": {
    "q_code": "Q_KIMCHI_001",
    "fields": ["sodium", "potassium", "fiber"]
  }
}
```

### 3.2 Output Schema
```json
{
  "status": "SUCCESS",
  "agent": "knowledge_agent",
  "output": {
    "q_code": "Q_KIMCHI_001",
    "food_name": "배추김치",
    "nutrition_facts": {
      "sodium": "630mg",
      "potassium": "220mg",
      "fiber": "1.8g"
    },
    "grounded_text": "배추김치(Q_KIMCHI_001)의 100g 당 영양 정보는 나트륨 630mg, 칼륨 220mg, 식이섬유 1.8g 입니다."
  }
}
```
- **데이터베이스 연계 표준**:
  - 지식 에이전트는 Phase 15 데이터베이스 표준에 의거하여 SQLite 세션 타임아웃 30초 제약 및 with closing 리소스 누출 예방을 적용한 쿼리 커넥터 코드로 구현된다.
