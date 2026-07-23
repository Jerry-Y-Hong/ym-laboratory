# YM-LAB AI Agent Orchestration System

> **Module**: 17_ai_agent_orchestration_system  
> **Version**: `v1.0`  
> **Status**: ✅ COMPLETED — AI Agent Orchestration System : Closed & Frozen  

---

## Overview

본 디렉터리는 YM-LAB PROJECT의 다형 매체 한식 교육 콘텐츠 자동화 라이프사이클을 실전 통제하는 **AI 에이전트 오케스트레이션 플랫폼(AI Agent Orchestration System)**의 아키텍처 및 8대 전문 에이전트의 설계 명세서셋을 포함한다.

선언적 **Workflow Engine**이 중심이 되어 **Execution Context**와 **Shared Memory**를 통해 상태를 동적 전이하며, 에이전트 독립 소켓 규격(`16_AGENT_PROTOCOL_INTERFACE.md`)을 준수하여 상호작용하도록 설계되어 상용 SaaS 제품화에 최적화된 안정성을 보장한다.

---

## Document Index

| # | 문서명 | 설명 |
| :--- | :--- | :--- |
| 01 | [01_ORCHESTRATION_ARCHITECTURE.md](./01_ORCHESTRATION_ARCHITECTURE.md) | Workflow Engine 중심 분산 에이전트 오케스트레이션 플랫폼 설계 |
| 02 | [02_WORKFLOW_ENGINE.md](./02_WORKFLOW_ENGINE.md) | DAG 순차 실행 기계 및 상태 전이 제어 알고리즘 명세 |
| 03 | [03_EXECUTION_CONTEXT.md](./03_EXECUTION_CONTEXT.md) | 고유 Run ID 및 텔레메트리, 트래킹 토큰 저장 스키마 규격 |
| 04 | [04_SHARED_MEMORY.md](./04_SHARED_MEMORY.md) | R/W 격리 및 디스크 동기화 방지(Safe Write)를 적용한 인메모리 캐시 |
| 05 | [05_FAULT_TOLERANCE.md](./05_FAULT_TOLERANCE.md) | 지수 백오프 재시도, 2회 제한 백트래킹(롤백) 루프 및 에스컬레이션 |
| 06 | [06_CONFIGURATION_SYSTEM.md](./06_CONFIGURATION_SYSTEM.md) | `config.json`과 연계한 모델 벤더별 에이전트 바인딩 및 파서 설정 |
| 07 | [07_VALIDATION_FRAMEWORK.md](./07_VALIDATION_FRAMEWORK.md) | 실행 전후 Pre/Post-Check 스키마 제약 및 보안 샌드박스 격리 정책 |
| 08 | [08_PLANNING_AGENT.md](./08_PLANNING_AGENT.md) | 대상 식재료(Q-Code) 키워드 맵 기획 매니페스트 에이전트 |
| 09 | [09_KNOWLEDGE_AGENT.md](./09_KNOWLEDGE_AGENT.md) | RAG 컨텍스트 바인딩 및 catalog.db 안전 조회 지식 에이전트 |
| 10 | [10_CONTENT_GENERATION_AGENT.md](./10_CONTENT_GENERATION_AGENT.md) | 카드뉴스, e-book, 블로그 다형 매체 생성 에이전트 |
| 11 | [11_MEDIA_AGENT.md](./11_MEDIA_AGENT.md) | 이미지, 비디오 캡션 및 alt 속성 인젝션 미디어 에이전트 |
| 12 | [12_SEO_AGENT.md](./12_SEO_AGENT.md) | 가독성 및 계층 정적 스캔 분석 에이전트 |
| 13 | [13_QUALITY_VALIDATION_AGENT.md](./13_QUALITY_VALIDATION_AGENT.md) | 팩트, 문법, 브랜드, 중복도 다차원 5대 필터링 품질 에이전트 |
| 14 | [14_PUBLISHING_PREPARATION_AGENT.md](./14_PUBLISHING_PREPARATION_AGENT.md) | FIFO 대기열 큐 적재 및 ready_to_publish 준비 영역 격리 에이전트 |
| 15 | [15_MONITORING_LOGGING_AGENT.md](./15_MONITORING_LOGGING_AGENT.md) | 소요 시간 계산, Python Logging Standard 수집 에이전트 |
| 16 | [16_AGENT_PROTOCOL_INTERFACE.md](./16_AGENT_PROTOCOL_INTERFACE.md) | JSON Request, Response, Error 공통 통신 프로토콜 인터페이스 규격 |
| 17 | [17_FINAL_REPORT.md](./17_FINAL_REPORT.md) | 본 최종 마스터 완료 보고서 수록 |

---

## Core Platform Standards

1. **Workflow Engine Centricity**: Coordinator가 아닌 워크플로우 엔진이 상태 기계를 제어하며 에이전트는 완전히 느슨하게 결합됨.
2. **Agnostic Agent Socket**: 에이전트는 JSON 프로토콜을 통과 구동되므로, 벤더 API 변동 및 구현체 변경 시에도 시스템 안정성이 수호됨:
   > *The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.*
3. **Execution Compliance & Implementation**:
   > *All future implementations should follow this framework whenever applicable. The framework serves as the standard development guideline for the YM-LAB Project.*
