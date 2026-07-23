# AI Scaling Guide

> **Module**: 14_ai_operation_manual — Document 09  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

YM-LAB PROJECT의 성장에 따라 **새로운 AI 모델이 도입되어도 운영 체계를 변경하지 않는 모델 독립적 확장(Model-Agnostic Scaling) 정책**과 **비용/속도 최적화를 위한 로컬 Mock 가동 정책**을 규정한다.

---

## 2. Model-Agnostic Scaling Strategy (모델 독립적 확장)

본 프로젝트는 AI 기술의 급격한 변화에 유연하게 대응하기 위해 **역할(Role)과 구현체(AI Model)를 완전히 분리**한다.

```
       [역할 기반 AI 아키텍처 (고정)]
┌──────────────────────────────────────┐
│  Architecture AI ──→ DDL/구조 설계     │
│  Implementation AI ──→ 코드/테스트 구현 │
│  Review AI ──→ 코드 린트/가이드 준수    │
│  QA AI ──→ verify 스크립트 실행 분석   │
│  Documentation AI ──→ 마크다운 문서화   │
└──────────────────┬───────────────────┘
                   │ (수동 교체 매핑)
                   ▼
       [가용한 실제 AI 모델군 (가변)]
┌──────────────────────────────────────┐
│  Claude 3.5 Sonnet / Claude 4.0      │
│  Gemini 1.5 Pro / Gemini 2.0         │
│  GPT-4o / GPT-5                      │
│  Local Llama 3 / Mistral (자체 호스팅)│
└──────────────────────────────────────┘
```

### 2.1 모델 교체 규칙 & 핵심 안정성 원칙
1. **역할과 매핑 분리**: 모델이 Claude에서 GPT 또는 자체 호스팅 오픈소스 모델로 변경되더라도, `04_AI_WORKFLOW`의 역할 수행 흐름과 Git 커밋 표준은 일절 수정하지 않는다.
2. **성능 기반 매핑**: 개발자는 새로운 LLM의 벤치마크 및 로컬 실행 결과를 바탕으로, 해당 모델이 어떤 역할(예: 정밀 코딩 → `Implementation AI`, 대량 로그 분석 → `QA AI`)에 가장 적합한지 판단하여 수동으로 질문 대상을 갱신한다.
3. **안정성 보장 정책**:  
   > **The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.**  
   > (향후 어떤 AI 모델이나 도구, 벤더사가 변경·대체되더라도 본 운영 체계의 정합성과 검증 절차는 불변으로 유지된다.)

---

## 3. Local Mock-First Policy (로컬 모의 가동 정책)

API 요금 절감 및 빠른 로컬 피드백 루프를 위해 다음 Mock 정책을 강제한다.

1. **Rule-Based Mock 우선 활성화**:
   - `blog_automation/03_content_pipeline/content_generator.py`에 구현된 바와 같이, 외부 LLM API 호출 없이 사전에 구성된 로컬 템플릿과 룰셋만으로 작동하는 Mock 모드로 1차 개발 및 스케줄러 검증을 끝마친다.
2. **Batch API 활용**:
   - 실시간 연동이 불필요한 대량의 블로그 마크다운 포스트를 한 번에 대량 생성(Ingestion)해야 하는 경우, API 제공업체의 Batch API 기능(예: 24시간 이내 비동기 처리, 50% 요금 감면)을 활용해 비용 효율을 도모한다.
3. **Context Pruning (컨텍스트 가지치기)**:
   - AI 모델에 질문 시 수정 범위에 불필요한 리포지토리 전체 로그나 코드를 생략하여 질문당 입력 토큰 크기를 항상 최소화로 통제한다.
