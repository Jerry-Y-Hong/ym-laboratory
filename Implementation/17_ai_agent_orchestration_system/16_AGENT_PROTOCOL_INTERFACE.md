# Agent Protocol Interface

> **Module**: 17_ai_agent_orchestration_system — Document 16  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Unified Message Exchange Specifications (통신 프로토콜 인터페이스 규격)

YM-LAB AI 에이전트 오케스트레이션 시스템의 핵심인 **에이전트 소켓 디자인(Agent Socket Design)**을 완수하기 위해, 에이전트가 통신할 때 주고받는 JSON 입력, 출력, 에러 메시지의 공통 인터페이스 스키마를 강제 정의한다.

```
       [Workflow Engine]
               │ (JSON Request 메시지 송신)
               ▼
       [대상 AI Agent] ──→ 비즈니스 로직 연산 수행 (RAG, 생성, 검증 등)
               │ (JSON Response / Error 메시지 회신)
               ▼
       [Workflow Engine] ──→ Shared Memory 및 Context 업데이트
```

---

## 2. Protocol Schemas (공통 메시지 규격)

### 2.1 JSON Request Schema (입력 규격)
모든 에이전트 호출 시 아래의 루트 객체 포맷을 반드시 준수해야 한다.
- `run_id`: 실행 추적 ID (UUIDv4 추천)
- `command`: 에이전트가 수행할 동작 명령 (예: `PLAN_CONTENT`, `ANALYZE_SEO`)
- `params`: 명령 실행에 필요한 가변 매개변수 딕셔너리

```json
{
  "run_id": "RUN_UUID_KEY_HERE",
  "command": "COMMAND_STRING",
  "params": {
    "key_1": "value_1",
    "key_2": "value_2"
  }
}
```

### 2.2 JSON Response Schema (성공 출력 규격)
에이전트가 연산을 성공적으로 마치고 결과를 반환할 때의 규격.
- `status`: `"SUCCESS"`
- `agent`: 에이전트 식별 명칭 (예: `"planning_agent"`)
- `output`: 에이전트 실행에 따른 실제 산출 데이터 딕셔너리

```json
{
  "status": "SUCCESS",
  "agent": "agent_name_here",
  "output": {
    "result_field_1": "data_1",
    "result_field_2": "data_2"
  }
}
```

### 2.3 JSON Error Response Schema (실패/에러 규격)
에이전트 구동에 오류가 발생하거나 내부 처리에 에러가 난 경우의 반환 규격.
- `status`: `"ERROR"`
- `agent`: 에이전트 식별 명칭
- `error`: 에러 분류 키 및 세부 메시지를 포함하는 디버깅용 객체

```json
{
  "status": "ERROR",
  "agent": "agent_name_here",
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "인간 에스컬레이션용 가독성 높은 에러 원인 메시지",
    "traceback": "파이썬 sys.exc_info 트레이스백 문자열 (DEBUG용)"
  }
}
```

---

## 3. General Message Serialization Rules (메시지 직렬화 및 교환 규칙)

- **UTF-8 한글 문자 인코딩**:
  - 한식 한글 명칭의 깨짐 방지를 위해 메시지 인계 시 `json.dumps(..., ensure_ascii=False)`를 강제 명시하여 데이터 왜곡을 예방한다.
- **메시지 변조 불허**:
  - `Workflow Engine`이 수신한 Response/Error 메시지는 읽기 전용으로 취급되며, 후속 에이전트로 데이터를 넘길 때는 반드시 `Shared Memory` 및 `Execution Context`를 경유해야 한다.
