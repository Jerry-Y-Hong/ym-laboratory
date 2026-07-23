# YM-LAB AI Operation Manual

> **Module**: 14_ai_operation_manual  
> **Version**: `v1.0`  
> **Status**: ✅ COMPLETED — AI Team Operation System : Ready for Development Execution  

---

## Overview

본 디렉터리는 YM-LAB PROJECT의 인간 프로젝트 리더(Human Project Lead)와 역할 기반 AI 에이전트(Core Roles) 간의 협업 체계를 실천적이고 단순하게 규율하는 **AI 운영 매뉴얼** 문서셋을 포함한다.

모든 정책은 기존 아키텍처 및 거버넌스(`12_governance`, `13_platform_architecture`) 규칙을 계승하며, 복잡한 엔터프라이즈 인프라(Kafka, Redis, Qdrant, 분산 락, CI/CD 파이프라인 등)를 배제하고 **로컬 파이썬 개발 및 Git 협업 실무**에 즉시 적용 가능하도록 구성되었다.

---

## Document Index

| # | 문서명 | 설명 |
| :--- | :--- | :--- |
| 01 | [01_AI_OPERATION_MANUAL.md](./01_AI_OPERATION_MANUAL.md) | AI 팀 운영 목적, 적용 범위, HITL 및 프레임워크 안정성 핵심 원칙 |
| 02 | [02_AI_TEAM_ARCHITECTURE.md](./02_AI_TEAM_ARCHITECTURE.md) | 인간 프로젝트 리더 중심의 하이브리드 팀 구조 및 확장 가능한 Core Roles 설계 |
| 03 | [03_AI_ROLE_DEFINITION.md](./03_AI_ROLE_DEFINITION.md) | 인간 프로젝트 리더 및 Core Roles(Architecture, Implementation, Review, QA, Documentation AI 등)의 R&R |
| 04 | [04_AI_WORKFLOW.md](./04_AI_WORKFLOW.md) | 설계(Architecture AI) → 구현(Implementation AI) → 리뷰(Review AI) → 검증(QA AI) → 문서(Documentation AI) 연계 개발 주기 |
| 05 | [05_AI_ROUTING_RULE.md](./05_AI_ROUTING_RULE.md) | 작업 난이도 및 컨텍스트 크기에 맞춰 LLM 모델(예시: Claude, Gemini 등)을 역할에 수동 대입하는 가이드라인 |
| 06 | [06_AI_CONTEXT_POLICY.md](./06_AI_CONTEXT_POLICY.md) | 로컬 토큰 절감 정책 및 역할별 프롬프트 골격 템플릿 표준화 |
| 07 | [07_AI_COLLABORATION_GUIDE.md](./07_AI_COLLABORATION_GUIDE.md) | 인간 중심 검증(Human-in-the-Loop, HITL) 3대 로컬 체크포인트 정의 |
| 08 | [08_AI_GITHUB_OPERATION.md](./08_AI_GITHUB_OPERATION.md) | Git 기능 분기 브랜치, Conventional Commits 메시지 규격 및 PR 수동 자가 체크리스트 |
| 09 | [09_AI_SCALING_GUIDE.md](./09_AI_SCALING_GUIDE.md) | 모델 독립적 확장성, 신규 모델 매핑 정책 및 로컬 Mock 우선 가동 정책 |
| 10 | [10_AI_BEST_PRACTICES.md](./10_AI_BEST_PRACTICES.md) | catalog.db/마스터 JSON 기반 데이터 그라운딩, 로컬 셸 명령(os.system) 실행 차단 및 에러 극복 사례 |

---

## Core Targets & Rules

1. **지식 정확도(Knowledge Accuracy)**: 100% (Q-Code 온톨로지 정합성 검증 PASS)
2. **로컬 검증 스크립트 통과율**: 100% (커밋 전 필수 검사)
3. **인간 프로젝트 리더 최종 검수율 (HITL)**: 100% (모든 코드 변경사항은 인간이 수동 확인)
4. **Model-Agnostic Principle**:  
   > *Any LLM or AI Agent can be assigned to any role according to capability, availability and project requirements.*
5. **Stability Principle**:  
   > *The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.*
