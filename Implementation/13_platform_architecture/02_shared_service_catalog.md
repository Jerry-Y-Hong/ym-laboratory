# Shared Service Catalog

> **Module**: 13_platform_architecture — Document 02  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

Platform이 제공하는 16개 공통 서비스의 완전한 카탈로그. 모든 Product는 이 카탈로그에서 필요한 서비스를 선택하여 재사용한다.

---

## 2. Service Catalog

### 2.1 Authentication Service (`platform-auth`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 사용자 신원 확인, 토큰 발급 |
| **기술** | OAuth2 + JWT, OIDC |
| **API Base** | `/api/platform/v1/auth` |
| **핵심 기능** | 로그인/로그아웃, 토큰 갱신, MFA, SSO |
| **의존 서비스** | User Management, Redis (세션) |
| **SLA** | 99.99% 가용성 |

### 2.2 Authorization Service (`platform-authz`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 역할 기반 접근 제어 (RBAC), 세밀 권한 관리 |
| **기술** | Casbin / OPA (Open Policy Agent) |
| **API Base** | `/api/platform/v1/authz` |
| **핵심 기능** | Role 관리, Permission 체크, Policy 관리 |
| **의존 서비스** | Auth, User Management |
| **SLA** | 99.99% |

### 2.3 User Management Service (`platform-users`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 사용자 프로필, 계정 관리, 멀티테넌트 사용자 격리 |
| **기술** | FastAPI + PostgreSQL |
| **API Base** | `/api/platform/v1/users` |
| **핵심 기능** | CRUD, 프로필 관리, 테넌트 격리, 계정 비활성화 |
| **의존 서비스** | Auth, PostgreSQL |
| **SLA** | 99.99% |

### 2.4 AI Engine Service (`platform-ai`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 10대 AI 에이전트 스웜, RAG 파이프라인, LLM 오케스트레이션 |
| **기술** | LlamaIndex / LangChain, FastAPI |
| **API Base** | `/api/platform/v1/ai` |
| **핵심 기능** | Q-Code RAG, 에이전트 실행, 응답 생성, Guardrail 적용 |
| **의존 서비스** | Knowledge Engine, Qdrant, Redis |
| **SLA** | 99.9% (AI 특성 반영) |

### 2.5 Knowledge Engine Service (`platform-knowledge`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 온톨로지 기반 지식 그래프 쿼리 및 관리 |
| **기술** | Neo4j 5.x + PostgreSQL |
| **API Base** | `/api/platform/v1/knowledge` |
| **핵심 기능** | Q-Code 조회, 영양 지식 쿼리, 그래프 탐색, 지식 갱신 |
| **의존 서비스** | Neo4j, PostgreSQL |
| **SLA** | 99.9% |

### 2.6 Semantic Search Service (`platform-search`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 벡터 기반 시맨틱 검색 및 유사도 탐색 |
| **기술** | Qdrant + LlamaIndex |
| **API Base** | `/api/platform/v1/search` |
| **핵심 기능** | 벡터 검색, 하이브리드 검색, 임베딩 생성 |
| **의존 서비스** | Qdrant, AI Engine |
| **SLA** | 99.9% |

### 2.7 API Gateway Service (`platform-gateway`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 단일 진입점, 트래픽 라우팅, Rate Limit, API 버전 관리 |
| **기술** | Kong / Traefik |
| **API Base** | `https://api.ymlab.io/` |
| **핵심 기능** | 라우팅, 인증 플러그인, Rate Limit, Circuit Breaker |
| **의존 서비스** | Auth, 모든 Platform 서비스 |
| **SLA** | 99.99% |

### 2.8 Notification Service (`platform-notify`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 이메일, SMS, 푸시 알림 발송 |
| **기술** | FastAPI + Kafka + AWS SES / Twilio |
| **API Base** | `/api/platform/v1/notifications` |
| **핵심 기능** | 템플릿 관리, 다채널 발송, 발송 이력, 구독 관리 |
| **의존 서비스** | Kafka, User Management |
| **SLA** | 99.9% |

### 2.9 Logging Service (`platform-logging`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 분산 로그 수집, 집계, 조회 |
| **기술** | Loki + Promtail + Grafana |
| **API Base** | 내부 서비스 전용 (External 비노출) |
| **핵심 기능** | 구조화 로그 수집, 레벨 필터, 보존 정책 |
| **의존 서비스** | Loki, Grafana |
| **SLA** | 99.9% |

### 2.10 Monitoring Service (`platform-monitoring`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 메트릭 수집, 대시보드, 알람 관리 |
| **기술** | Prometheus + Grafana |
| **API Base** | 내부 전용 |
| **핵심 기능** | SLA 추적, 알람 규칙, 대시보드, PagerDuty 연동 |
| **의존 서비스** | Prometheus, Grafana |
| **SLA** | 99.9% |

### 2.11 Billing Service (`platform-billing`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 구독 관리, 사용량 기반 과금, 결제 처리 |
| **기술** | FastAPI + PostgreSQL + Stripe |
| **API Base** | `/api/platform/v1/billing` |
| **핵심 기능** | 구독 플랜 관리, 사용량 추적, 인보이스, 결제 |
| **의존 서비스** | User Management, PostgreSQL, Stripe API |
| **SLA** | 99.99% |

### 2.12 File Storage Service (`platform-storage`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 파일 업로드, 다운로드, CDN 배포 |
| **기술** | AWS S3 / MinIO + Cloudflare CDN |
| **API Base** | `/api/platform/v1/storage` |
| **핵심 기능** | 업로드/다운로드, 서명된 URL, 버킷 격리, 바이러스 스캔 |
| **의존 서비스** | S3/MinIO, CDN |
| **SLA** | 99.99% |

### 2.13 Configuration Service (`platform-config`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 중앙화된 애플리케이션 설정 관리 |
| **기술** | HashiCorp Vault + Consul |
| **API Base** | `/api/platform/v1/config` |
| **핵심 기능** | 환경별 설정, 비밀 관리, 설정 버전 관리, 동적 갱신 |
| **의존 서비스** | Vault, Consul |
| **SLA** | 99.99% |

### 2.14 Scheduler Service (`platform-scheduler`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 정기 작업, 지연 실행, Cron 기반 자동화 |
| **기술** | FastAPI + APScheduler / Celery Beat |
| **API Base** | `/api/platform/v1/scheduler` |
| **핵심 기능** | Cron 등록, 작업 실행 이력, 실패 재시도, 알람 |
| **의존 서비스** | Redis, Kafka |
| **SLA** | 99.9% |

### 2.15 Workflow Engine Service (`platform-workflow`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 복잡한 비즈니스 프로세스 오케스트레이션 |
| **기술** | Prefect / Temporal |
| **API Base** | `/api/platform/v1/workflow` |
| **핵심 기능** | DAG 정의, 조건부 분기, 병렬 실행, 상태 추적 |
| **의존 서비스** | Kafka, PostgreSQL, AI Engine |
| **SLA** | 99.9% |

### 2.16 Audit Trail Service (`platform-audit`)

| 항목 | 내용 |
| :--- | :--- |
| **역할** | 모든 사용자·시스템 행위 불변 기록 |
| **기술** | FastAPI + PostgreSQL (append-only) |
| **API Base** | `/api/platform/v1/audit` |
| **핵심 기능** | 이벤트 기록, 행위자 추적, 보존 정책, 감사 보고서 |
| **의존 서비스** | PostgreSQL, Kafka |
| **SLA** | 99.99% |

---

## 3. Service Dependency Map

```
API Gateway (2.7)
    ├── Auth (2.1) ──→ User Mgmt (2.3) ──→ PostgreSQL
    │       └──→ Redis (세션)
    ├── AuthZ (2.2) ──→ Auth, User Mgmt
    ├── AI Engine (2.4) ──→ Knowledge Engine (2.5) ──→ Neo4j
    │       └──→ Semantic Search (2.6) ──→ Qdrant
    ├── Notification (2.8) ──→ Kafka, User Mgmt
    ├── Billing (2.11) ──→ User Mgmt, Stripe
    ├── Storage (2.12) ──→ S3/MinIO, CDN
    ├── Config (2.13) ──→ Vault
    ├── Scheduler (2.14) ──→ Redis, Kafka
    ├── Workflow (2.15) ──→ Kafka, AI Engine
    └── Audit (2.16) ──→ PostgreSQL, Kafka
Logging (2.9) ──→ Loki (모든 서비스 로그 수집)
Monitoring (2.10) ──→ Prometheus (모든 서비스 메트릭 수집)
```

---

## 4. Service Tier Classification

| Tier | 서비스 | 특성 |
| :--- | :--- | :--- |
| **Tier 1 (Critical)** | Auth, AuthZ, User Mgmt, API Gateway, Config | 다운 시 전체 Platform 불능 |
| **Tier 2 (Core)** | AI Engine, Knowledge Engine, Semantic Search, Billing, Audit | 핵심 비즈니스 서비스 |
| **Tier 3 (Support)** | Notification, Storage, Scheduler, Workflow | 보조 기능, 일부 장애 허용 |
| **Tier 4 (Observability)** | Logging, Monitoring | 운영 지원, 장애 비전파 |
