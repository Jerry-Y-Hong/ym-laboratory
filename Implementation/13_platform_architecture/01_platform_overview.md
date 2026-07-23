# Platform Overview

> **Module**: 13_platform_architecture — Document 01  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  
> **Date**: `2026-07-22`  

---

## 1. Purpose

YM-LAB Platform Architecture는 복수의 제품(Product)이 공통 인프라와 서비스를 재사용하는 **Shared Platform & Product Ecosystem** 구조를 정의한다.

본 Platform은 Phase 01~10, Master Implementation Plan, Master Implementation Governance를 기반으로 설계되었으며, 기존 산출물을 변경하지 않는 Additive Architecture이다.

---

## 2. Platform Vision

```
"One Platform, Many Products"
- 공통 서비스를 한 번 구축하고 모든 제품이 재사용한다.
- 각 제품은 독립 배포·독립 장애격리·독립 버전 관리를 유지한다.
- Platform은 Product에 의존하지 않는다.
```

---

## 3. Platform Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRODUCT LAYER                               │
│  Blog SaaS │ MFCO SaaS │ Smart Farm │ Knowledge │ Recipe AI    │
│  Education Platform │ Future Products...                        │
├─────────────────────────────────────────────────────────────────┤
│                  SHARED COMPONENT LAYER                         │
│  Frontend Design System │ AI SDK │ API SDK │ Common UI          │
│  Shared Domain Models │ Shared Utilities │ Shared Validation    │
├─────────────────────────────────────────────────────────────────┤
│                     PLATFORM LAYER                              │
│  Auth │ AuthZ │ User Mgmt │ AI Engine │ Knowledge Engine        │
│  Semantic Search │ API Gateway │ Notification │ Billing         │
│  File Storage │ Config │ Scheduler │ Workflow │ Audit Trail     │
│  Logging │ Monitoring                                           │
├─────────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                          │
│  Kubernetes │ PostgreSQL │ Neo4j │ Qdrant │ Redis               │
│  Kafka/NATS │ Prometheus │ Grafana │ Loki │ Cloudflare CDN      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Platform Design Principles

| 원칙 | 설명 |
| :--- | :--- |
| **API First** | 모든 서비스는 API로 노출. 내부 서비스도 OpenAPI Spec 필수 |
| **Cloud Native** | Kubernetes 기반. 12-Factor App 원칙 준수 |
| **Secure by Design** | Zero Trust, 최소권한, 암호화 기본 적용 |
| **SaaS Ready** | 멀티테넌트 격리, 구독 기반 과금 지원 |
| **AI Native** | AI Engine이 Platform 핵심 서비스로 내장 |
| **Modular** | 각 서비스는 독립적으로 배포·확장·교체 가능 |
| **Reusable** | 공통 컴포넌트는 모든 Product에서 동일하게 사용 |
| **Scalable** | 수평 확장 기본, 글로벌 멀티리전 지원 |

---

## 5. Platform Service Categories

| 카테고리 | 포함 서비스 | 역할 |
| :--- | :--- | :--- |
| **Identity & Access** | Auth, AuthZ, User Mgmt | 인증·인가·사용자 관리 |
| **AI & Knowledge** | AI Engine, Knowledge Engine, Semantic Search | 지능형 서비스 핵심 |
| **Integration** | API Gateway, Workflow Engine, Scheduler | 서비스 연결 및 오케스트레이션 |
| **Communication** | Notification | 이메일/SMS/푸시 알림 |
| **Observability** | Logging, Monitoring, Audit Trail | 운영 가시성 |
| **Commerce** | Billing | 구독·과금 관리 |
| **Data** | File Storage, Configuration | 파일 및 설정 중앙 관리 |

---

## 6. Dependency Direction Policy

```
Infrastructure Layer
      ↑ (depends on)
Platform Layer (16 Core Services)
      ↑
Shared Component Layer (SDK, Design System, Utilities)
      ↑
Product Layer (Blog, MFCO, Smart Farm, Knowledge, Recipe AI ...)
```

- **단방향 의존**: 상위 계층은 하위 계층에 의존하고, 역방향 의존은 금지한다.
- **Platform → Product 의존 금지**: Platform은 어떤 Product도 알지 않는다.
- **Product → Shared Component → Platform** 순서로만 의존한다.

---

## 7. Platform Readiness Criteria

| 항목 | 기준 |
| :--- | :--- |
| Production Ready | SLA 99.99%, 블루-그린 배포, DRP 검증 |
| Platform Ready | 16개 공통 서비스 API 노출 완비 |
| Multi-Product Ready | Product Onboarding Framework 제공 |
| SaaS Ready | 멀티테넌트 격리 및 구독 관리 |
| Reusable | Shared Component 버전 관리 및 SDK 패키지 배포 |
| Modular | 각 서비스 독립 배포 가능 |
| Scalable | Auto-scaling, 글로벌 CDN |
| Secure by Design | Zero Trust, GDPR/PIPA 준수 |

---

## 8. Traceability to Existing Architecture

| 기존 Phase | 연결 Platform 서비스 |
| :--- | :--- |
| Phase 05 (Project Intelligence) | AI Engine, Knowledge Engine |
| Phase 06 (Knowledge Engine) | Knowledge Engine, Semantic Search |
| Phase 07 (AI Automation) | AI Engine, Workflow Engine |
| Phase 08 (Blog Automation) | API Gateway, Notification, File Storage |
| Phase 09 (Service Platform) | Auth, AuthZ, User Mgmt, Billing |
| Phase 10 (Global Ecosystem) | API Gateway, Monitoring, CDN |
| Master Implementation | All 16 Platform Services |
| Governance | Platform Governance (→ 09_platform_governance.md) |
