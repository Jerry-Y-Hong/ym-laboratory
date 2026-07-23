# Debugging System

> **Module**: 20_ai_developer_platform — Document 11  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Runtime Step-by-Step Tracing & Inspection (디버깅 시스템)

디버깅 시스템(Debugging System)은 에이전트 오케스트레이션 구동 시 각 단계의 입출력 데이터 흐름을 추적(Tracing)하고, 특정 에이전트 구동 시작 전후에 **가상 중단점(Virtual Breakpoints)을 개설하여 공유 메모리와 실행 콘텍스트의 적격 상태를 개발자가 실시간 검사할 수 있도록 지원하는 진단 계층**이다.

```
                  [ymlab.agent.debug 기동]
                             │
                             ▼
  [에이전트 실행 직전 Breakpoint 검출] (Execution Pause 대기)
                             │
                             ├───────> [Shared Memory 스냅샷 덤프 확인]
                             │
                             ▼
       [가상 Step Over 지시] (Next Agent 로 진행 트리거)
                             │
                             ▼
  [에이전트 실행 직후 Post-Check 검사] (13_TESTING_FRAMEWORK 모의 대조)
```

---

## 2. Breakpoint Loggers & Mock Session Simulators

- **인메모리 디버그 스냅샷**:
  - `SharedMemory` 및 `ExecutionContext`가 변경되는 매 스텝마다, `ymlab.debug` 모듈은 내부 스냅샷 사본(`debug_snapshot.json`)을 `/data/logs/` 폴더 하위에 원자적으로 갱신하여 개발자가 IDE 터미널이나 포털 디버그 콘솔을 통해 실시간 변수 상태를 덤프 확인할 수 있게 돕는다.
- **가상 테스트 시뮬레이터**:
  - 실제로 LLM API를 호출하는 번거로움과 비용 없이, 사전에 정의된 모의 데이터셋(`15_API_SIMULATOR.md`)을 에이전트의 입력값으로 가상 주입하여 특정 상태 분기(예: 품질 검증 실패 시 백트래킹 분기 작동 확인)를 모의 디버깅할 수 있게 제어한다.

---

## 3. Debug Tracer Spec (Python Example)

```python
import json

class YMLabTracer:
    """오케스트레이션 런타임 추적 디버거"""
    def __init__(self, run_id: str):
        self.run_id = run_id
        self.trace_log = []

    def trace_step(self, step_name: str, action: str, payload: dict):
        """특정 에이전트의 시작/종료 행동 스냅샷 로깅"""
        log_entry = {
            "run_id": self.run_id,
            "step": step_name,
            "action": action,
            "payload_copy": json.loads(json.dumps(payload))  # deep copy
        }
        self.trace_log.append(log_entry)
        
        # 파일에 로깅 저장
        with open(f"data/logs/trace_{self.run_id}.json", "w", encoding="utf-8") as f:
            json.dump(self.trace_log, f, ensure_ascii=False, indent=2)
```
Ref: [Fault Tolerance Policy](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/17_ai_agent_orchestration_system/05_FAULT_TOLERANCE.md)
