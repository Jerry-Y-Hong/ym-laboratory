# Platform Boundary

> **Module**: 13_platform_architecture — Document 04  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Purpose

Platform, Product, Shared Library, External API 각 계층의 책임 경계를 명확히 정의한다.  
경계가 명확해야 중복 구현을 방지하고, 의존성을 단방향으로 유지할 수 있다.

---

## 2. Boundary Definition

### 2.1 Platform Boundary (플랫폼 책임)

**Platform이 책임지는 영역:**

| 영역 | 구체 내용 |
| :--- | :--- |
| **Identity** | 인증·인가·세션 관리. 모든 Product의 로그인은 Platform Auth를 통한다. |
| **AI Core** | AI 에이전트 스웜, RAG 파이프라인, LLM 호출. Product는 AI API만 사용한다. |
| **Knowledge Core** | 온톨로지, 지식 그래프, Q-Code 데이터 원본. Product는 Read API만 사용한다. |
| **Observability** | 로그 수집, 메트릭 수집, 알람. Product는 로그/메트릭을 내보내기만 한다. |
| **Commerce** | 구독 관리, 결제 처리. Product는 플랜 ID만 참조한다. |
| **Integration** | API Gateway 라우팅, Workflow 오케스트레이션. |
| **Infrastructure** | K8s 클러스터, DB 인스턴스, CDN, 보안 그룹. |

**Platform이 책임지지 않는 영역:**

- 각 Product의 UI/UX 디자인 (단, Design System 준수 의무)
- 각 Product의 비즈니스 도메인 로직
- 각 Product 고유의 데이터 스키마 (Platform과 분리된 DB 사용 가능)

---

### 2.2 Product Boundary (제품 책임)

**Product가 책임지는 영역:**

| 영역 | 구체 내용 |
| :--- | :--- |
| **Domain Logic** | 해당 Product 고유의 비즈니스 규칙 및 알고리즘 |
| **Product UI** | Shared Design System을 사용하되, 화면 구성·플로우·UX는 Product 책임 |
| **Product DB** | Platform DB와 분리된 Product 전용 테이블 또는 스키마 (멀티테넌트 격리 준수) |
| **Product API** | Platform API가 아닌 Product 전용 API 엔드포인트 |
| **Product Tests** | Product 도메인 로직 테스트 (플랫폼 서비스 Mocking 포함) |
| **Product Release** | 독립 배포, 독립 버전 관리 |

**Product가 해서는 안 되는 영역:**

- Platform 서비스 DB 직접 쿼리 (반드시 API 경유)
- 다른 Product의 내부 서비스 직접 호출 (플랫폼 API만 경유)
- Platform 핵심 서비스 재구현 (예: 자체 Auth 구현 금지)

---

### 2.3 Shared Library Boundary (공유 라이브러리 책임)

**Shared Library가 책임지는 영역:**

| 영역 | 구체 내용 |
| :--- | :--- |
| **Design System** | UI 토큰, 컴포넌트, 레이아웃. Platform/Product 모두 사용 |
| **AI SDK** | AI Engine API 클라이언트 래퍼. Product가 직접 사용 |
| **API SDK** | Platform 서비스 API 클라이언트. Product가 직접 사용 |
| **Domain Models** | 공통 데이터 타입 (User, Tenant, Product, etc.) |
| **Utilities** | 공통 유틸리티 (날짜, 문자열, 검증, 에러 코드) |
| **Validation** | 공통 입력값 검증 스키마 (Pydantic / Zod) |

**Shared Library 제약:**

- Platform 또는 Product의 비즈니스 로직 포함 금지
- 외부 API 직접 호출 금지 (SDK를 통해 추상화만 제공)
- Shared Library 간 순환 의존 금지

---

### 2.4 External API Boundary (외부 API 책임)

**External API 경계 정의:**

| 외부 서비스 | 연동 위치 | 책임 |
| :--- | :--- | :--- |
| Stripe (결제) | Platform Billing Service | Billing Service만 직접 연동 |
| AWS SES / Twilio | Platform Notification Service | Notification Service만 직접 연동 |
| LLM API (OpenAI 등) | Platform AI Engine | AI Engine만 직접 연동 |
| Cloudflare CDN | Platform Gateway / Storage | Platform 인프라 레벨 연동 |
| OAuth2 Provider (Google 등) | Platform Auth Service | Auth Service만 직접 연동 |

**원칙**: Product는 외부 API를 직접 호출하지 않는다. 반드시 Platform Service를 경유한다.

---

## 3. Boundary Violation Detection

| 위반 유형 | 감지 방법 | 처리 |
| :--- | :--- | :--- |
| Product → Platform DB 직접 쿼리 | DB 감사 로그 분석 | 즉시 차단 + 리팩토링 필수 |
| Product → 다른 Product 직접 호출 | Network Policy (K8s) | 네트워크 레벨 차단 |
| Shared Library → 비즈니스 로직 포함 | 코드 리뷰 게이트 | PR 거부 |
| 외부 API Product 직접 호출 | 보안 스캔 (Trivy) | 빌드 실패 처리 |

---

## 4. Boundary Visualization

```
┌─────────────────────────────────────────────────────────┐
│  EXTERNAL APIs (Stripe, OpenAI, SES, Cloudflare, etc.)  │
└───────────────────────┬─────────────────────────────────┘
                        │ (Platform 내부만 연동)
┌───────────────────────▼─────────────────────────────────┐
│              PLATFORM LAYER (16 Services)               │
│  Auth │ AI Engine │ Knowledge │ Gateway │ Billing ...   │
└───────────┬─────────────────────────┬───────────────────┘
            │                         │ (API만 노출)
┌───────────▼─────────┐   ┌───────────▼───────────────────┐
│  SHARED COMPONENT   │   │       PRODUCT LAYER           │
│  Design System      │←──│  blog │ mfco │ recipe │ edu   │
│  AI SDK │ API SDK   │   │  (Platform API 경유만 허용)    │
│  Domain Models      │   └───────────────────────────────┘
└─────────────────────┘
```
