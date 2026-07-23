# AI Operation Manual

> **Module**: 14_ai_operation_manual — Document 01  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview & Purpose

본 매뉴얼은 YM-LAB PROJECT의 인간 프로젝트 리더(Human Project Lead)와 **역할 기반 AI 에이전트(Role-Based AI Agents)**가 로컬 개발 환경에서 실천적이고 안전하게 협업하는 규칙을 정의한다.

본 프로젝트는 특정 상용 LLM 모델(예: Claude, Gemini, ChatGPT 등)에 의존하는 설계를 지양하고, 시스템 개발 수명 주기상의 논리적 역할에 초점을 맞춘 **역할 기반 아키텍처**를 채택한다. 이를 통해 새로운 AI 모델이 출시되더라도 운영 프레임워크나 가이드라인을 변경하지 않고 유연하게 교체할 수 있도록 설계되었다.

---

## 2. Target Scope & Architecture Flow

본 매뉴얼은 인간 프로젝트 리더를 정점으로 하는 다음 역할 기반 협업 흐름을 대상으로 한다.

```
       ┌───────────────────────────────┐
       │      Human Project Lead       │ (의사결정권자 / HITL)
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │        Architecture AI        │ (설계 보조)
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │       Implementation AI       │ (코드 구현 보조)
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │           Review AI           │ (정적 검사 보조)
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │             QA AI             │ (동적 검증 보조)
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │       Documentation AI        │ (산출물 문서화 보조)
       └───────────────────────────────┘
```

- **Human Project Lead (인간 프로젝트 리더)**: 팀 리더이자 최종 의사결정권자. 설계 승인, 비즈니스 가치 검증 및 코드 병합 수행.
- **Core Roles (Expandable)**: AI 에이전트군이 담당하는 핵심 역할들로, 필요에 따라 유연하게 역할을 확장할 수 있다.
  - **Architecture AI**: 모듈 설계 및 의사결정(ADR) 작성 보조.
  - **Implementation AI**: 비즈니스 로직 및 단위 테스트 작성 보조.
  - **Review AI**: 소스코드 스타일 및 거버넌스 준수 검토 보조.
  - **QA AI**: 로컬 검증 스크립트 실행 분석 및 디버깅 보조.
  - **Documentation AI**: 요구사항 명세, README, 보고서 작성 보조.

> **AI Model Assignment Rule**:  
> Any LLM or AI Agent can be assigned to any role according to capability, availability and project requirements. (특정 AI 모델 명칭은 단순 예시이며, 역할 매핑은 독립적임)

---

## 3. Core Operational Philosophy

1. **Human-in-the-Loop (HITL) 검증**: AI가 수행하는 모든 역할의 결과물은 인간 프로젝트 리더가 직접 로컬 검증 스크립트(`verify_*.py`)를 구동하여 100% 정합성을 확인한 후 커밋한다.
2. **Context-First Prompting**: AI에 질문을 할 때는 임의의 가정 대신 반드시 현재 프로젝트의 `PROJECT_STATUS.md` 및 해당 모듈 설계 문서를 프롬프트의 컨텍스트로 제공하여 할루시네이션을 방지한다.
3. **Traceability (추적성) 유지**: AI가 코드 작성을 보조하더라도, 결과물은 반드시 `Implementation/` 내부의 상위 설계 및 검증 코드와 1:1 대응하여 추적 가능해야 한다.
4. **Stable Framework Stability**: The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.
