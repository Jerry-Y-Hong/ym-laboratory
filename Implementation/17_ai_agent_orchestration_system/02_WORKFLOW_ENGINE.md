# Workflow Engine

> **Module**: 17_ai_agent_orchestration_system — Document 02  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Engine Core Flow & State Machine

워크플로우 엔진(Workflow Engine)은 오케스트레이션의 심장부로, 선언된 DAG(Directed Acyclic Graph) 파이프라인의 에이전트 실행 순서와 흐름 상태 전이를 관리한다.

```
       [Workflow 시작] (Engine.run() 호출)
              │
              ▼
    [INIT] ──→ 실행 콘텍스트(Run ID) 및 공유 메모리 초기화
              │
              ▼
 ┌─→[NEXT_STEP] ──→ 다음 실행 대상 에이전트 탐색 (DAG 순서 판독)
 │            │
 │            ▼
 │   [EXECUTE_AGENT] ──→ 대상 에이전트에 입출력 프로토콜 메시지 전송
 │            │
 │            ├───→ [SUCCESS] ──→ 공유 메모리 업데이트 및 루프 계속 ──┐
 │            │                                                   │
 │            └───→ [FAIL] ──→ Fault Tolerance 정책 기동 ─────────┼─┐
 │                                                                │ │
 └────────────────────────────────────────────────────────────────┘ │
                                                                    ▼
                                                            [TERMINATE]
                                                  (최종 상태 저장 및 리포트)
```

---

## 2. DAG Engine Execution Logic (상태 전이 규칙)

엔진은 다음 5대 라이프사이클 실행 상태를 가지며, 전이 기계(State Machine)에 따라 원자적으로 전이된다.

- **INIT (초기화)**:
  - 설정 시스템에서 로드된 실행 워크플로우 명세를 기반으로, Run ID를 생성하고 `Execution Context`를 초기화한다.
- **PENDING (대기)**:
  - 현재 에이전트 실행 완료 후 다음 에이전트가 호출되기 직전의 유휴 상태.
- **RUNNING (실행 중)**:
  - 에이전트에 메시지를 전송하고 결과 응답 대기 상태.
- **COMPLETED (성공 종료)**:
  - 모든 에이전트가 예외 없이 완료되고, `Publishing Preparation` 적재가 완료된 상태.
- **FAILED (실패 종료)**:
  - 하부 에이전트 중 하나가 최종 실패하고(재시도 초과 등) 백트래킹 복구 경로마저 유실되어 오케스트레이션이 최종 실패로 종료된 상태.

---

## 3. Workflow Routing Code Template

```python
class YMLabWorkflowEngine:
    """워크플로우 상태 전이 및 에이전트 라우팅 제어 엔진"""
    def __init__(self, workflow_schema: dict, settings: dict):
        self.schema = workflow_schema
        self.settings = settings
        self.context = ExecutionContext()
        self.shared_memory = SharedMemory()

    def run(self) -> dict:
        """선언적 워크플로우 순차 실행 루프"""
        self.context.update_state("INIT")
        steps = self.schema.get("steps", [])
        
        for step in steps:
            agent_name = step["agent"]
            self.context.update_current_step(agent_name)
            self.context.update_state("RUNNING")
            
            # 1. Validation Framework 사전 검사 실행
            if not ValidationFramework.pre_check(agent_name, self.shared_memory):
                self.context.update_state("FAILED")
                raise ValidationError(f"Pre-check failed for agent: {agent_name}")
            
            # 2. 에이전트 실행 및 결과 반환
            response = self.execute_agent(agent_name, step.get("args", {}))
            
            # 3. 에이전트 성공/실패 여부 분기 및 Fault Tolerance 연계
            if response["status"] == "SUCCESS":
                self.shared_memory.write(agent_name, response["output"])
                ValidationFramework.post_check(agent_name, self.shared_memory)
            else:
                # 에러 복구 및 롤백 기동
                FaultTolerance.handle_failure(self.context, self.shared_memory, agent_name)
                
        self.context.update_state("COMPLETED")
        return self.context.get_final_report()
```
- **순환 참조 회피 규칙**:
  - 엔진은 개별 에이전트 클래스의 물리 소스를 직접 하드 임포트(`import`)하지 않고, 설정에서 제공하는 에이전트 맵 테이블(Dynamic Dispatcher)을 활용해 런타임에 에이전트를 매핑 실행함으로써, 에이전트-엔진 간 순환 참조 발생 가능성을 사전에 전면 차단한다.
