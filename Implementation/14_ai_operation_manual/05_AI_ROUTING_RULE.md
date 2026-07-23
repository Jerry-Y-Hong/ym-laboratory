# AI Routing Rule

> **Module**: 14_ai_operation_manual — Document 05  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

인간 프로젝트 리더가 업무 생산성을 극대화하기 위해, **작업의 특성(컨텍스트의 크기, 논리적 난이도 등)에 맞춰 최적의 실제 AI 모델을 수동으로 역할(Role)에 매핑하는 규칙**을 정의한다.

---

## 2. Model Mapping Matrix (역할별 모델 매핑)

> **Assignment Rule**:  
> Any LLM or AI Agent can be assigned to any role according to capability, availability and project requirements.

아래 모델 할당은 단순 예시이며, 실제 활용 가능한 LLM의 최신 버전에 따라 역할을 유연하게 결합한다.

| 논리적 AI 역할 | 추천 매핑 모델 (예시) | 차선 매핑 모델 (예시) | 매핑 선정 사유 |
| :--- | :--- | :--- | :--- |
| **Architecture AI** | Claude | ChatGPT | 시스템의 정교한 모듈화 설계 및 의존성 관계 식별에 우수한 추론력을 보임. |
| **Implementation AI** | Claude | ChatGPT | 파이썬 코딩 및 pytest 단위 테스트 코드 작성 시 문법 정확도가 높음. |
| **Review AI** | Gemini / ChatGPT | Local Model (Llama 등) | 코드 린팅이나 단순 스타일 가이드 준수 여부 파악에 빠른 응답 속도를 보임. |
| **QA AI** | Gemini | Claude | 대규모 검증 터미널 로그 및 `catalog.db` 구조 분석 시 거대한 컨텍스트 처리 능력을 발휘함. |
| **Documentation AI** | ChatGPT | Gemini | 마크다운 포맷 및 한국어 문장 가독성을 매끄럽게 정리하는 한글 성능이 우수함. |

---

## 3. Dynamic Model Upgrades and Scalability (미래 확장성)

본 라우팅 규칙은 특정 모델 브랜드에 종속되지 않는다. 모델이 업그레이드되거나 신규 모델로 대체될 경우 다음 규칙에 따라 매핑 대상을 갱신한다.

```
[신규 AI 모델 출시]
         │
         ├──→ 컨텍스트 처리량이 극대화되었는가? ──→ YES ──→ [QA AI] 역할에 매핑 고려
         │
         ├──→ 코드 추론 정확도가 획기적으로 개선되었는가? ──→ YES ──→ [Implementation AI] 역할에 매핑 고려
         │
         └──→ 호출 단가가 낮고 처리 속도가 빠른가? ──→ YES ──→ [Review / Documentation AI] 역할에 매핑 고려
```

- **대체 가능성 보장**: AI 모델의 공급 중단이나 성능 저하 시, 개발자는 상위 라우팅 매핑 테이블의 모델만 수동으로 변경하여 프로젝트의 운영 체계를 그대로 유지한다.
