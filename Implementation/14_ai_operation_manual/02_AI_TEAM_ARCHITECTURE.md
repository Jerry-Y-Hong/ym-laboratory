# AI Team Architecture

> **Module**: 14_ai_operation_manual — Document 02  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

YM-LAB PROJECT는 대규모 조직 대신, **인간 프로젝트 리더(Human Project Lead)가 지휘하며 유연하게 확장 가능한 역할 기반 AI 에이전트(Core Roles)들이 연계하여 협업하는 구조**를 가진다.

---

## 2. Organization & Workflow Structure

```
                  ┌─────────────────────────────┐
                  │     Human Project Lead      │ (전략 수립 / 최종 결정권자 / HITL)
                  └──────────────┬──────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Architecture AI │    │ Implementation AI│    │    Review AI     │
└──────────────────┘    └──────────────────┘    └──────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                        ┌──────────────────┐
                        │      QA AI       │
                        └────────┬─────────┘
                                 ▼
                        ┌──────────────────┐
                        │ Documentation AI │
                        └──────────────────┘
```

### 2.1 Human Leadership
- **Human Project Lead (인간 프로젝트 리더)**: 
  - 개발 방향성 제어 및 요구사항 정의.
  - AI 역할의 결과물을 직접 로컬 환경에서 테스트 및 검증하여 무결성 판단.
  - 리포지토리 PR 최종 승인 및 `main` 브랜치 병합을 수행하는 프로젝트 리더.

### 2.2 Core Roles (Expandable)
개발 필요성에 따라 동적으로 확장될 수 있는 AI 에이전트 핵심 역할 구조:
- **Architecture AI**: 시스템 구조, 모듈 인터페이스 및 ADR 작성 보조.
- **Implementation AI**: 비즈니스 로직 및 pytest 단위 테스트 코드 구현 보조.
- **Review AI**: 소스코드 린팅 검사 및 거버넌스(`12_governance`) 부합성 사전 검토 보조.
- **QA AI**: 로컬 검증 스크립트 실행 분석, 에러 트레이스 디버깅 보조.
- **Documentation AI**: 요구사항 문서, README, 완료 보고서 작성 보조.
- ***Future Extended Roles (확장 가능한 역할 예시)***:
  - **Research AI**: 신규 도메인 원천 지식 및 학술 자료 조사 보조.
  - **Automation AI**: 데이터 수집 파이프라인 정기 백업 스크립트 작성 보조.
  - **Security AI**: 소스코드 정적 취약점 분석 및 API Key 노출 감시 보조.
  - **Testing AI**: 부하 테스트 및 다차원 통합 테스트 케이스 발굴 보조.
  - **Translation AI**: 번역 파일 리소스의 5개국어 정합성 검토 보조.

---

## 3. Model-Agnostic Assignment (모델 독립적 역할 할당)

> **Core Principle**:  
> Any LLM or AI Agent can be assigned to any role according to capability, availability and project requirements.

Claude, Gemini, ChatGPT 등 상용 모델명은 예시일 뿐이며, 특정 모델군에 역할을 고정하지 않는다. 개발자는 각 모델의 비용, 지연시간, 컨텍스트 한도 등을 고려하여 최선의 모델을 유연하게 배분한다.

예를 들어, `Implementation AI`에 Claude 3.5 Sonnet을 사용하다가, 할당량 제한이나 서버 장애가 발생하면 즉시 GPT-4o나 Gemini Pro를 해당 역할에 매핑하여 개발 리듬을 유지한다.
