# 글로벌 김치 AI 지식 플랫폼 (Global Kimchi AI Knowledge Platform)
## 엔터프라이즈 시스템 및 데이터 아키텍처 명세서

```
Status      : FROZEN
Version     : 1.0.0
Owner       : YM-LAB
Approved By : Architecture Review
Date        : 2026-07-20
```

> [!IMPORTANT]
> **ARCHITECTURE-DRIVEN IMPLEMENTATION RULE (구현 및 변경 통제 원칙)**  
> 1. **Architecture 기준 작성**: Architecture Freeze v1.0.0 선언 이후, 실제 DB Schema, API, AI_ENGINE 및 모든 구현 코드는 **본 Architecture 문서를 유일한 절대 기준(Single Source of Truth)**으로 삼아 작성됩니다.
> 2. **구현에 의한 임의 변경 금지**: 개발 및 구현 단계에서 임의로 Architecture나 DB 구조를 변경할 수 없습니다.
> 3. **RFC 승격 및 ADR 작성 절차**: Architecture 수정을 유발하는 변경이 필요한 경우, 반드시 **6단계 RFC 절차 및 ADR 작성**을 통과하여 새로운 버전(v1.1.0, v1.2.0, v2.0.0)으로 승격된 후에만 구현에 반영할 수 있습니다.

---

### 1. 설계 철학 및 최우선 원칙

1. **MASTER (SSOT) 순수성 엄격 보장**:
   - **MASTER**: 변경 주기가 길고 신뢰할 수 있는 사실 기준 데이터 (기준 정보일 뿐, 콘텐츠나 규칙이 아니며 수정 불가 원칙).
   - **AI_ENGINE**: MASTER 데이터를 읽어 콘텐츠로 변환하는 지능형 서비스 레이어 (`Configuration Layer` + `Execution Layer`).
   - **CONTENT**: MASTER 및 AI_ENGINE을 조합하여 AI가 자동 생성한 가변적 결과물 (언제든 재생성 가능).
2. **LLM Provider Independence (플러거블 LLM 제공자 설계)**:
   - **AI_ENGINE은 특정 LLM(OpenAI, Claude, Gemini 등)에 종속되지 않으며, LLM Provider는 교체 가능한 구현(Pluggable Provider Architecture)으로 설계합니다.** 이로써 모델 기술 변화에 민첩하게 대응하고 장기적인 유지보수성과 확장성을 보장합니다.
3. **새로운 시스템 파이프라인**:
   - `MASTER (SSOT) → Data Aggregation → Prompt Assembly → LLM Inference → Validation → Content Persistence → CONTENT → Publishing Queue → Publisher Adapter → Target Platform → Publishing Log`
4. **다국어 (i18n) 수평적 확장**:
   - 모든 Core MASTER 데이터는 `MASTER` + `I18N TABLE` 격리 패턴을 통해 스키마 변경 없이 N개국 다국어를 지원.
5. **외래키(FK) 정합성이 보장되는 Explicit Junction Architecture**:
   - Generic Polymorphic Reference 대신 `CONTENT_KIMCHI_REF`, `CONTENT_RECIPE_REF` 등 명시적 릴레이션을 사용하여 데이터 손상 방지.

---

### 2. 아키텍처 변경 및 ADR 관리 프로세스 (Governance Engine)

아키텍처 및 스키마 변경이 필요한 경우 반드시 다음 6단계를 엄격히 준수하며, 결정의 배경과 사유는 **ADR(Architecture Decision Record)**에 영구히 기록됩니다. (상세 가이드: [00_ARCHITECTURE_CHANGE_PROCESS.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/01_PHASE1_KIMCHI/00_ARCHITECTURE_CHANGE_PROCESS.md))

```
① RFC 작성 ──> ② 영향도 분석 ──> ③ 승인 ──> ④ Version Up ──> ⑤ ADR 작성 ──> ⑥ Release
                 (DB, API, AI_ENGINE,            (v1.0.0 → v1.1.0) (영구 기록)
                  CONTENT, PUBLISH)
```

1. **① RFC (Request for Change) 작성**: 변경 목적, 배경 및 제안 사양 작성
2. **② 영향도 분석**: 5대 핵심 영역 (DB, API, AI_ENGINE, CONTENT, PUBLISH) 파급 효과 검토
3. **③ 승인 (Approval)**: 데이터 아키텍트 및 파이프라인 리드 최종 승인
4. **④ Version Up**: Semantic Versioning에 따른 버전 부여 (`v1.0.0 → v1.1.0 / v2.0.0`)
5. **⑤ ADR 작성**: 의사결정의 이면, 채택 사유, 트레이드오프 영구 문서화 (`ADR-XXXX`)
6. **⑥ Release**: 프로덕션 마이그레이션 및 서비스 배포

#### v1.0.0 Baseline ADR Register Summary
- **ADR-0001**: MASTER와 CONTENT를 분리한 이유 (SSOT & 재생성 유연성)
- **ADR-0002**: I18N (다국어) 분리 테이블 채택 이유 (100개국 수평 확장)
- **ADR-0003**: AI_ENGINE Configuration Layer 도입 이유 (규칙/실행 분리)
- **ADR-0004**: LLM Provider Independence 채택 이유 (Pluggable AI Engine)
- **ADR-0005**: Explicit Junction Table 채택 이유 (RDBMS FK 무결성 보장)
- **ADR-0006**: Publishing Queue 도입 이유 (비동기 배포, Rate Limit & Retry 전담)

---

### 3. 데이터 모델링 및 엔티티 분류 체계

본 플랫폼의 데이터 모델은 **Core MASTER**, **I18N TABLE**, **REFERENCE (JUNCTION) TABLE**, **AI_ENGINE CONFIGURATION**, **CONTENT DOMAIN**으로 명확하게 역할 분리됩니다.

#### 3.1 Core MASTER (15종 - 순수 SSOT 기준 데이터)
도메인의 핵심 기준 정보(Single Source of Truth)로, 다국어 텍스트와 분리되어 정합성을 유지합니다.
- **코어 Kimchi Master**: `KIMCHI_MASTER`
- **조리 & 재료 Master**: `CATEGORY_MASTER`, `INGREDIENT_MASTER`, `RECIPE_MASTER`
- **과학 & 역사 Master**: `FERMENTATION_MASTER`, `HISTORY_MASTER`, `NUTRITION_MASTER`, `PAIRING_MASTER`
- **미디어 & 출처 Master**: `IMAGE_MASTER`, `LICENSE_MASTER`, `SOURCE_MASTER`
- **글로벌 메타 Master**: `AUTHOR_MASTER`, `LANGUAGE_MASTER`, `COUNTRY_MASTER`, `TAG_MASTER`

#### 3.2 I18N TABLE (다국어 언어 확장 레이아웃)
Core MASTER의 키 값을 참조하여 글로벌 N개 국어 텍스트 데이터를 동적으로 확장합니다.
- `KIMCHI_MASTER_I18N`: 김치 명칭, 요약, 문화적 의의 다국어
- `HISTORY_MASTER_I18N`: 김치 역사 제목, 요약, 문화적 영향 다국어
- `RECIPE_STEP_I18N`: 조리 단계별 가이드 및 Pro-Tip 다국어
- `CATEGORY_MASTER_I18N`: 카테고리명 및 설명 다국어
- `INGREDIENT_MASTER_I18N`: 식재료명, 설명, 대체 재료 팁 다국어
- `TAG_MASTER_I18N`: 검색/SEO 다국어 태그

#### 3.3 REFERENCE (JUNCTION) TABLE (명시적 참조 정합성 보장)
RDBMS Foreign Key 제약 조건을 보장하여 N:M 관계 및 참조 무결성을 수호합니다.
- `KIMCHI_INGREDIENT_REF`: 김치 - 식재료 간 투입 비율 및 필수/옵션 역할
- `CONTENT_KIMCHI_REF`: 콘텐츠 - 김치 Master 간 explicit junction
- `CONTENT_RECIPE_REF`: 콘텐츠 - 레시피 Master 간 explicit junction
- `CONTENT_HISTORY_REF`: 콘텐츠 - 역사 Master 간 explicit junction
- `CONTENT_IMAGE_REF`: 콘텐츠 - 이미지 Master 간 explicit junction (표시 순서 및 캡션)

---

### 4. AI_ENGINE 레이어 구조 및 AI Pipeline Flow

`AI_ENGINE`은 MASTER 데이터를 소비하여 콘텐츠를 자동 생산하는 지능형 서비스 레이어로, **Configuration Layer**와 **Execution Layer**로 명확히 나뉩니다.

```
MASTER (SSOT)
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│                      AI_ENGINE                           │
│                                                          │
│  [Configuration Layer]                                   │
│  ┌────────────────────┐  ┌────────────────────────────┐  │
│  │Template Configuration││    Prompt Configuration    │  │
│  └────────────────────┘  └────────────────────────────┘  │
│  ┌────────────────────┐  ┌────────────────────────────┐  │
│  │Persona Configuration│ │    Rule Configuration      │  │
│  └────────────────────┘  └────────────────────────────┘  │
│                                                          │
│  [Execution Layer]                                       │
│  ┌────────────────────┐  ┌────────────────────────────┐  │
│  │   Prompt Builder   │  │        Rule Engine         │  │
│  └────────────────────┘  └────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │                     Validator                      │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
                    [AI Pipeline Flow]
┌──────────────────────────────────────────────────────────┐
│ Step 1. Data Aggregation (MASTER Extract)                │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ Step 2. Prompt Assembly (Prompt Builder Engine)          │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ Step 3. LLM Inference (Pluggable Adapter Layer)          │
│   - OpenAI / Claude / Gemini / OpenSource LLMs           │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ Step 4. Validation (Validator Module)                    │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ Step 5. Content Persistence (Save to CONTENT DB & Log)   │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
                         CONTENT
```

#### 4.1 AI_ENGINE 2-Layer 구성 요소 명세

##### 1) Configuration Layer (논리적 설정 데이터 계층)
- **Template Configuration**: 채널별 출력 레이아웃 및 JSON Output Schema 설정 데이터.
- **Prompt Configuration**: Mustache/Jinja2 템플릿 변수 및 시스템 프롬프트 설정 데이터.
- **Persona Configuration**: `AUTHOR_MASTER`와 연계된 톤앤매너, 라이팅 스타일, 역량 설정 메타.
- **Rule Configuration**: 필요 MASTER 데이터 필터링 조건 및 필수 매칭 규칙 설정 데이터.

> [!NOTE]
> **Configuration Layer 논리 계층 vs 물리 DB 스키마 관계**  
> Configuration Layer는 DB에 저장되는 AI 설정(Configuration Data)의 **논리적 계층(Logical Layer)**을 의미합니다.  
> 실제 물리 DB 구현(Physical Schema)에서는 `AI_ENGINE_TEMPLATE` 단일 테이블로 통합 관리하거나, 개발/운영 환경 및 프로젝트 규모에 따라 `AI_ENGINE_PROMPT`, `AI_ENGINE_PERSONA`, `AI_ENGINE_RULE` 등으로 분리 테이블 구현이 가능합니다. 본 아키텍처는 특정 물리 구현을 강제하지 않고 유연한 논리적 계층을 정의합니다.

##### 2) Execution Layer (실행 서비스 영역)
- **Prompt Builder**: Configuration의 템플릿과 정제된 Master 데이터를 실시간 바인딩하여 최종 프롬프트 구성.
- **Rule Engine**: 생성 시 필수 MASTER 조합 조건과 제약 규칙을 적용하고 검증하는 엔진.
- **Validator**: 생성된 콘텐츠의 다각도 품질과 규격을 검증하는 **통합 검증 서비스(Integrated Validation Service)**입니다.
  - **`JSON Schema Validation`**: LLM Structured Output 출력 규격 검증
  - **`SEO Validation`**: SEO Title, Description, Keyword 정합성 검증
  - **`Markdown Validation`**: 문법, 헤더 구조, 마크다운 문맥 검증
  - **`Link Validation`**: 내부/외부 URL 및 참조 링크 유효성 검증
  - **`Asset Validation`**: 이미지/미디어 메타데이터 및 CDN 링크 검증
  - **`Policy Validation`**: 저작권, 표현 수위 및 글로벌 에티켓 정책 검증
  *(필요 시 내부 검증 모듈을 Plug-in 형태로 수평 확장 가능)*

#### 4.2 Reserved Components (Future Extension)
> [!IMPORTANT]
> **엔터프라이즈 예약을 위한 예약 아키텍처 (Reserved Architecture)**  
> 아래 구성 요소는 **v1.0.0의 직접 구현 대상이 아니며**, 향후 엔터프라이즈 운영 및 대규모 오케스트레이션을 위해 사전 정의된 **예약 컴포넌트**입니다.  
> 향후 **v1.1.0 이상의 버전에서 RFC 절차를 거쳐 활성화**될 수 있습니다.

```
┌──────────────────────────────────────────────────────────┐
│            Reserved Components (Future Extension)        │
│                                                          │
│  ┌────────────────────────┐  ┌────────────────────────┐  │
│  │     AI Orchestrator    │  │       Monitoring       │  │
│  │ (Workflow Controller)  │  │(Telemetry & Analytics) │  │
│  └────────────────────────┘  └────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

1. **`AI Orchestrator` (예약)**:
   - **역할**: AI Pipeline 전체 Workflow 제어, Configuration 선택, Prompt Builder 호출, Rule Engine 호출, LLM Provider 선택, Retry, Error Recovery, Logging, Workflow Routing, Multi-step Generation, Agent Workflow 지원.
2. **`Monitoring` (예약)**:
   - **역할**: 플랫폼 운영 상태를 모니터링하는 계층. (Token Usage, Cost Monitoring, Latency, Error Rate, Retry Count, Success Rate, Publishing Success, API Health, Audit Log, Trace, Dashboard).

#### 4.3 LLM Inference 추상화 계층 (Abstract LLM Engine)
> [!NOTE]
> **LLM Inference** 단계는 OpenAI, Anthropic Claude, Google Gemini 등 **어떠한 외부/자체 LLM 모델이 오더라도 유연하게 교체 및 확장 가능한 추상화 계층(Abstract Adapter Layer)**으로 설계됩니다. AI_ENGINE의 Core 파이프라인 로직 수정 없이 LLM Provider만 Pluggable 형태로 교체할 수 있습니다.

---

### 5. Multi-Channel Publishing Pipeline

생성된 콘텐츠는 비동기 퍼블리싱 파이프라인을 타고 안전하고 신뢰성 있게 각 채널로 배포됩니다.

```
┌──────────────────────────────────────────────────────────┐
│ Step 1. CONTENT (Status: APPROVED / READY)               │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ Step 2. Publishing Queue                                 │
│   - 예약 발행, 비동기 디스패치, Rate Limiting, 자동 재시도 │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ Step 3. Publisher Adapter Layer                          │
│   - WordPress / YouTube / Substack / Instagram / X       │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ Step 4. Target Platform Dispatch & Execution             │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ Step 5. Publishing Log (Save Result & External URL)      │
└──────────────────────────────────────────────────────────┘
```

#### 5.1 Content Lifecycle State Engine
`DRAFT` → `REVIEW` → `SCHEDULED` → `PUBLISHED` → `ARCHIVED`

#### 5.2 Publisher Pipeline 구성 요소
- **Publishing Queue**: 콘텐츠 예약 발행, 비동기 처리, 채널별 API Rate Limiting 제어 및 장애 시 자동 재시도(Retry) 전담.
- **Publisher Adapters**:
  - **WordPress Adapter**: REST API를 통해 Markdown → HTML 변환 및 SEO 메타태그 자동 주입.
  - **YouTube Adapter**: `audio_script`를 TTS 및 AI 비디오 렌더러에 파이프라인하여 Shorts/Longform 업로드.
  - **Substack Adapter**: 글로벌 구독자 맞춤 이메일 템플릿 변환 및 자동 발송.
  - **Social (Instagram / X) Adapter**: 숏폼 스크립트 및 캡션 기반 포스트 자동 발행.
- **Publishing Log (`PUBLISHING_LOG`)**: 외부 플랫폼 Post ID 및 발행 URL, 최종 상태 저장.

---

### 6. 버전 이력 관리 (Version History)

| Version | Released Date | Status | Major Changes / Key Milestones |
| :--- | :--- | :--- | :--- |
| **v1.0.0** | 2026-07-20 | **FROZEN** | **Baseline Architecture Release**<br>- Core MASTER (15종), I18N Table, Reference Table 세부 영역 명확 분리<br>- AI_ENGINE 2-Layer (Configuration & Execution) 용어 통일 (`* Configuration`)<br>- Reserved Components (`AI Orchestrator`, `Monitoring`) 예약 아키텍처 선언<br>- ADR (Architecture Decision Record) 6대 Baseline 결정 사항 등록 (ADR-0001~0006)<br>- Configuration Layer 논리 계층 vs 물리 DB 스키마 관계 명시<br>- Validator 6대 통합 검증 책임 범위 구체화<br>- 비동기 Publishing Queue & Publisher Adapter 현실적 파이프라인 체계 확립<br>- LLM Inference 추상화 및 Pluggable Provider Independence 선언<br>- Architecture-Driven Implementation 규칙 지정 및 6단계 Architecture Change Process 명시화 |
| *v1.1.0* | *TBD* | *PLANNED* | Minor Schema Enhancements or Additional Adapter Protocols |
| *v1.2.0* | *TBD* | *PLANNED* | Multi-modal Asset Generation Pipeline Expansion |
| *v2.0.0* | *TBD* | *PLANNED* | Major Enterprise Infrastructure & Distributed Graph DB Migration |
