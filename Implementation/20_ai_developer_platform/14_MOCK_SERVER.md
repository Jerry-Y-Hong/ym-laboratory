# Mock Server

> **Module**: 20_ai_developer_platform — Document 14  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Local Mock Server for Database & APIs (모의 서버)

모의 서버(Mock Server)는 개발자가 외부 네트워크(LLM API 벤더 등)에 연결할 수 없거나 API 요금 과금을 방지하기 위해 로컬 런타임 환경에서 **식재료 데이터베이스(catalog.db) 쿼리 결과 및 LLM 응답을 모의로 리턴해 주는 고속 로컬 에뮬레이션 계층**이다.

```
       [Developer Agent 실행] (DB 쿼리 또는 LLM 생성 요청)
                 │
                 ▼
       [Mock Server 감지 분기] (config.json의 system_env = development)
                 │
         ┌───────┴───────┐
         ▼               ▼
   [DB 쿼리 모의]    [LLM API 모의]
 - Local SQLite   - Mock Response JSON
 - 지연 0.1s      - 지연 0.5s
```

---

## 2. Sandbox DB & Agent Response Simulator (모의 규칙)

- **식재료 데이터베이스 모의 (Mock DB)**:
  - `catalog.db` 연결 불가능 환경이거나 빠른 테스트를 위해, SDK는 인메모리 테스트용 `catalog_mock.db` 또는 딕셔너리 테이블 캐시를 활용해 실제 데이터 조회 시와 동일한 구조의 영양 수치(나트륨 630mg 등)를 리턴한다.
- **LLM API 모의 (Mock LLM)**:
  - `Content Generation Agent`가 생성 요청을 보내면, 실제로 Claude나 Gemini 서버에 HTTP 패킷을 보내지 않고, 미리 정의된 마크다운 텍스트 원고를 리턴한다.
  - 이를 통해 로컬 E2E 테스트 시간을 평균 1초 미만으로 단축한다.

---

## 3. Mock Server Interface Schema (JSON)

```json
{
  "mock_responses": {
    "gemini-1.5-flash": {
      "PLAN_CONTENT": {
        "status": "SUCCESS",
        "output": {
          "plan_id": "MOCK_PLAN_20260722",
          "core_keywords": ["모의 키워드 1", "모의 키워드 2"]
        }
      }
    },
    "catalog_db": {
      "Q_KIMCHI_001": {
        "sodium": "630mg",
        "potassium": "220mg",
        "fiber": "1.8g"
      }
    }
  }
}
```
Ref: [Knowledge Agent Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/17_ai_agent_orchestration_system/09_KNOWLEDGE_AGENT.md)
