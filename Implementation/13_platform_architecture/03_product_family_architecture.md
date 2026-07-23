# Product Family Architecture

> **Module**: 13_platform_architecture — Document 03  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

YM-LAB Platform 위에서 운영되는 제품군(Product Family) 아키텍처를 정의한다.  
모든 제품은 Platform 공통 서비스를 최대한 재사용하며, 독립 배포·독립 버전·독립 장애 격리를 원칙으로 한다.

---

## 2. Product Family Map

```
YM-LAB PLATFORM
│
├── Blog Automation SaaS       (blog-saas)
├── MFCO SaaS                  (mfco-saas)
├── Smart Farm SaaS            (smartfarm-saas)
├── Knowledge SaaS             (knowledge-saas)
├── Recipe AI                  (recipe-ai)
├── Education Platform         (edu-platform)
└── Future Products...
```

---

## 3. Product Specifications

### 3.1 Blog Automation SaaS (`blog-saas`)

| 항목 | 내용 |
| :--- | :--- |
| **목적** | AI 기반 블로그 콘텐츠 자동 생성, 발행, SEO 최적화 SaaS |
| **대상 사용자** | 콘텐츠 마케터, 블로거, 기업 마케팅팀 |
| **핵심 기능** | 키워드 기반 자동 포스팅, SEO 점수 분석, 다채널 배포 |
| **사용 Platform 서비스** | Auth, AuthZ, User Mgmt, AI Engine, Scheduler, Notification, Workflow, Storage, Billing, Audit, Logging, Monitoring |
| **Product-Specific 서비스** | Blog CMS, SEO Analyzer, Publishing Connector |
| **수익 모델** | 구독형 SaaS (Basic/Pro/Enterprise) |
| **Phase 연관** | Phase 08 (Blog Automation & Commercial) |

### 3.2 MFCO SaaS (`mfco-saas`)

| 항목 | 내용 |
| :--- | :--- |
| **목적** | 약선·식품 성분 데이터베이스 및 약재 조합 분석 SaaS |
| **대상 사용자** | 한의사, 식품 연구자, 영양사, 식품 기업 |
| **핵심 기능** | MFCO 데이터 조회, 성분 조합 분석, 약선 레시피 추천 |
| **사용 Platform 서비스** | Auth, AuthZ, User Mgmt, AI Engine, Knowledge Engine, Semantic Search, API Gateway, Billing, Audit |
| **Product-Specific 서비스** | MFCO Ingredient DB, Synergy Analyzer, Traditional Medicine Module |
| **수익 모델** | API 사용량 기반 + 구독형 |
| **Phase 연관** | Phase 05~06 (Intelligence, Knowledge Engine) |

### 3.3 Smart Farm SaaS (`smartfarm-saas`)

| 항목 | 내용 |
| :--- | :--- |
| **목적** | AI 기반 스마트팜 작물 생육 관리, 환경 모니터링 SaaS |
| **대상 사용자** | 스마트팜 운영자, 농업 기업, 연구 기관 |
| **핵심 기능** | IoT 데이터 수집, 생육 예측, 자동화 제어, 이상 감지 |
| **사용 Platform 서비스** | Auth, AuthZ, User Mgmt, AI Engine, Workflow, Scheduler, Notification, Storage, Monitoring, Billing |
| **Product-Specific 서비스** | IoT Collector, Crop Growth Predictor, Farm Control Dashboard |
| **수익 모델** | 구독형 + 디바이스 연동 수수료 |
| **Phase 연관** | Phase 07 (AI Automation Layer) |

### 3.4 Knowledge SaaS (`knowledge-saas`)

| 항목 | 내용 |
| :--- | :--- |
| **목적** | Q-Code 온톨로지 기반 약선 영양 지식 조회 및 구축 SaaS |
| **대상 사용자** | 연구자, 기업 R&D팀, 의료 전문가, 교육 기관 |
| **핵심 기능** | 지식 그래프 탐색, Q-Code 쿼리, 영양 데이터 분석, 지식 편집 |
| **사용 Platform 서비스** | Auth, AuthZ, Knowledge Engine, Semantic Search, AI Engine, Audit, Billing |
| **Product-Specific 서비스** | Knowledge Graph Viewer, Ontology Editor, Research Export |
| **수익 모델** | 기업 구독 (B2B), 연구 라이선스 |
| **Phase 연관** | Phase 06 (Knowledge Engine) |

### 3.5 Recipe AI (`recipe-ai`)

| 항목 | 내용 |
| :--- | :--- |
| **목적** | 개인 맞춤 약선 레시피 추천 및 영양 AI 어드바이저 B2C 서비스 |
| **대상 사용자** | 일반 소비자, 건강 관심층, 다이어터 |
| **핵심 기능** | 맞춤 레시피 추천, AI 영양 상담, 식단 플래닝, 쇼핑 연동 |
| **사용 Platform 서비스** | Auth, User Mgmt, AI Engine, Knowledge Engine, Semantic Search, Notification, Billing, Storage |
| **Product-Specific 서비스** | Recipe Recommendation Engine, Meal Planner, Nutrition Advisor Chat |
| **수익 모델** | 프리미엄 구독 (B2C) + 파트너십 |
| **Phase 연관** | Phase 09 (Service Platform - B2C) |

### 3.6 Education Platform (`edu-platform`)

| 항목 | 내용 |
| :--- | :--- |
| **목적** | 약선·식품·한의학 전문 온라인 교육 플랫폼 |
| **대상 사용자** | 학생, 전문직 종사자, 기업 임직원 |
| **핵심 기능** | 강좌 관리, AI 튜터, 수료증 발급, 진도 추적 |
| **사용 Platform 서비스** | Auth, User Mgmt, AI Engine, Scheduler, Notification, Storage, Billing, Audit, Workflow |
| **Product-Specific 서비스** | LMS Core, AI Tutor, Certificate Manager, Progress Tracker |
| **수익 모델** | 강좌 판매 + 구독형 |
| **Phase 연관** | Phase 10 (Global Ecosystem - B2C/B2B) |

---

## 4. Platform Service Usage Matrix

| Platform Service | blog | mfco | smartfarm | knowledge | recipe | edu |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| AuthZ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| User Mgmt | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| AI Engine | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Knowledge Engine | ⬜ | ✅ | ⬜ | ✅ | ✅ | ⬜ |
| Semantic Search | ⬜ | ✅ | ⬜ | ✅ | ✅ | ⬜ |
| API Gateway | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notification | ✅ | ⬜ | ✅ | ⬜ | ✅ | ✅ |
| Logging | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Monitoring | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Billing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| File Storage | ✅ | ⬜ | ✅ | ⬜ | ✅ | ✅ |
| Config | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Scheduler | ✅ | ⬜ | ✅ | ⬜ | ⬜ | ✅ |
| Workflow | ✅ | ⬜ | ✅ | ⬜ | ⬜ | ✅ |
| Audit Trail | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. Product Onboarding Prerequisite

신규 Product를 Platform에 온보딩하기 위한 최소 요건:

1. Auth + User Mgmt 연동 (SSO 필수)
2. API Gateway 라우팅 등록
3. Billing Plan 등록 (무료 포함)
4. Monitoring 대시보드 생성
5. Audit Trail 이벤트 스키마 정의
6. Product Isolation 조건 충족 (`08_product_isolation.md` 참고)
