# Orchestration Architecture

> **Module**: 17_ai_agent_orchestration_system — Document 01  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Workflow Engine-Centric Platform Architecture

YM-LAB AI 에이전트 오케스트레이션 시스템은 특정 코디네이터가 개별적으로 통제하는 방식이 아닌, 선언적으로 정의된 **워크플로우 엔진(Workflow Engine)**이 중심이 되어 에이전트들의 실행 제어 흐름(DAG)을 관리하고, 공통의 **실행 콘텍스트(Execution Context)** 및 **공유 메모리(Shared Memory)**를 매개로 상호작용하는 플랫폼 아키텍처를 가진다.

```
                  ┌────────────────────────────────────────────────────────┐
                  │                [06_CONFIGURATION_SYSTEM]               │
                  │              에이전트 정의 및 워크플로우 선언            │
                  └──────────────────────────┬─────────────────────────────┘
                                             │ (Workflow Schema Load)
                                             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          [02_WORKFLOW_ENGINE]                            │
│                        에이전트 실행 상태 전이 기계                       │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                     [03_EXECUTION_CONTEXT]                         │  │
│  │                    실행 상태 / 추적 토큰 트래킹                     │  │
│  ├────────────────────────────────────────────────────────────────────┤  │
│  │                        [04_SHARED_MEMORY]                          │  │
│  │                    에이전트 간 데이터 교환 공유 캐시                 │  │
│  ├────────────────────────────────────────────────────────────────────┤  │
│  │                       [05_FAULT_TOLERANCE]                         │  │
│  │                    결함 허용 / 예외 복구 / 백트래킹                  │  │
│  └───────────────────┬─────────────────────────────┬──────────────────┘  │
└──────────────────────┼─────────────────────────────┼─────────────────────┘
                       │ (Execute Task)              │ (Query State)
                       ▼                             ▼
┌──────────────────────────────────────────────┐ ┌─────────────────────────┐
│              [AI Agent Layer]                │ │[07_VALIDATION_FRAMEWORK]│
│  - 08_PLANNING_AGENT   - 09_KNOWLEDGE_AGENT  │ │ - 입출력 스키마 유효성  │
│  - 10_CONTENT_GEN_AGT  - 11_MEDIA_AGENT      │ │ - 실행 전후 상태 체크   │
│  - 12_SEO_AGENT        - 13_QUALITY_VAL_AGT  │ │ - 샌드박스 격리 감시    │
│  - 14_PUBLISH_PREP_AGT - 15_MONITORING_LOG_AGT│ │                         │
└──────────────────────────────────────────────┘ └─────────────────────────┘
```

---

## 2. Core Architectural Subsystems

### 2.1 Workflow Engine (워크플로우 엔진)
- 워크플로우 스키마를 판독하여 에이전트들의 실행 순서, 분기 조건(If-Else), 및 반복문(Loop)을 순차 구동한다. 각 에이전트는 독립된 컴포넌트로 플러그인(Plug-in)되어 실행된다.

### 2.2 Execution Context & Shared Memory (실행 콘텍스트 및 공유 메모리)
- **Execution Context**: 전체 실행의 고유 ID(Run ID), 현재 실행 중인 에이전트의 단계(Step), 시작 및 종료 시간, 발생 에러 등 메타데이터 정보를 저장한다.
- **Shared Memory**: 에이전트들이 생성하는 실제 결과물(기획안 JSON, 생성 마크다운 본문, 미디어 바인딩 정보)을 임시 보관하는 격리 캐시 영역으로, 다음 단계 에이전트가 이 공유 메모리를 조회해 연속 작업을 수행한다.

### 2.3 Fault Tolerance & Validation Framework (결함 허용 및 검증 프레임워크)
- **Fault Tolerance**: 특정 에이전트 실행 실패 시, 설정된 재시도 횟수만큼 다시 수행하거나 이전 적격 상태 단계로 복귀(Backtracking)하는 복구 로직을 수행한다.
- **Validation Framework**: 에이전트 구동 전후의 데이터 스키마 유효성(Schema Guard)을 검증하여 파이프라인의 오염 전파를 차단한다.

---

## 3. Technology & Framework Agnostic Design (도메인/기술 독립 설계)

- **에이전트 소켓화 (Agent Socket Design)**:
  - 개별 에이전트는 플랫폼이나 특정 LLM SDK(LangChain, Semantic Kernel 등)의 전용 API에 종속되지 않는다.
  - 모든 에이전트는 공통 통신 인터페이스(`16_AGENT_PROTOCOL_INTERFACE.md`)를 통해 입출력 JSON 메시지만으로 소통하므로, 특정 에이전트를 다른 파이썬 구현체나 외부 API 서비스로 교체해도 전체 엔진 구조는 불변한다:
    > *The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.*
- **로컬 샌드박스 안정성**:
  - 분산 큐 서버나 네트워크 지연이 심한 외부 저장소를 배제하고, 공유 메모리와 실행 콘텍스트는 로컬 메모리 인스턴스 및 디스크 격리 세션 파일 구조를 사용하여 단순하고 정합성 높게 제어된다.
