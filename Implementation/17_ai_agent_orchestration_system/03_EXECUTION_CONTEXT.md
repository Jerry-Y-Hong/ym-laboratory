# Execution Context

> **Module**: 17_ai_agent_orchestration_system — Document 03  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Execution Context Architecture

실행 콘텍스트(Execution Context)는 단일 오케스트레이션 실행 수명 주기(Lifecycle Run) 동안 발생하는 모든 에이전트의 실행 이력, 트래킹 토큰 정보, 상태 변경 메타데이터를 유지 및 추적하는 콘텍스트 스페이스(Context Space)이다.

```
┌────────────────────────────────────────────────────────┐
│                   Execution Context                    │
├────────────────────────────────────────────────────────┤
│ - Run ID: 고유 트래킹 키 (UUID v4)                      │
│ - Current Step: 현재 활성화되어 실행 중인 에이전트 단계    │
│ - State Flag: INIT / RUNNING / COMPLETED / FAILED      │
│ - Metadata: 시작 시간, 종료 시간, 누적 호출 횟수         │
│ - Token Payload: 추적성 유지를 위한 RAG 토큰           │
└────────────────────────────────────────────────────────┘
```

---

## 2. Context Metadata & Tracking Token Schema (JSON)

에이전트가 다른 에이전트에게 메시지를 전달하거나 엔진이 상태를 로깅할 때, 실행 무결성 식별을 위해 아래 구조의 JSON 콘텍스트 객체를 필수로 첨부 및 관리한다.

```json
{
  "run_id": "RUN_9c6e4251-404b-46e7-b7bd-36033c6938df",
  "current_step": "quality_validation_agent",
  "state_flag": "RUNNING",
  "telemetry": {
    "start_time": "2026-07-22T17:54:00+09:00",
    "elapsed_seconds": 12.5,
    "agent_calls_count": 5
  },
  "tracking_token": {
    "q_code": "Q_KIMCHI_001",
    "target_audience": "dietary_nutrition_seeker",
    "media_type": "blog"
  },
  "errors_log": [
    {
      "step": "seo_agent",
      "error_message": "Keyword density too low (0.5%)",
      "timestamp": "2026-07-22T17:54:08+09:00"
    }
  ]
}
```

---

## 3. Context Storage & Telemetry rules

- **원자적 콘텍스트 스냅샷**:
  - 파이프라인의 각 단계(Step) 전이 직후, 엔진은 현재의 `Execution Context` 스냅샷을 `data/runs/{run_id}.json` 파일로 즉시 영속화하여 비정상 종료 시 디버깅 단서를 남긴다.
- **안전한 쓰기 규칙 준수**:
  - Phase 15 데이터베이스 표준에 따라 임시 파일(`{run_id}.tmp`) 생성 후 파일명 원자적 교체(`os.replace`)를 수행한다.
- **추적성 보장**:
  - 로그 파일 및 모니터링 에이전트가 생성하는 시각 정보와 콘텍스트 내의 `run_id`를 동일 바인딩하여 실행 과정의 모든 지점(Tracepoint)에 대한 E2E 추적 경로를 보장한다.
