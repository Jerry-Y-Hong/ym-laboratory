# YM-LAB AI Product Ecosystem

> **Module**: 19_ai_product_ecosystem  
> **Version**: `v1.0`  
> **Status**: ✅ COMPLETED — AI Product Ecosystem : Closed & Frozen  

---

## Overview

본 디렉터리는 YM-LAB PROJECT의 양산된 AI 제품군(Product Family)을 B2B 파트너 및 일반 클라이언트에게 안전하게 유통, 배포, 라이선싱하고, **API Gateway 및 Sandbox 격리 컨테이너 환경 내에서 모니터링 관제와 DRP(재해 복구) 수칙을 적용해 구동 및 진화**시키기 위해 구축된 **YM-LAB AI 제품 생태계 표준 플랫폼(AI Product Ecosystem)**의 아키텍처 및 18대 산출물 명세서셋을 포함한다.

---

## Document Index

| # | 문서명 | 설명 |
| :--- | :--- | :--- |
| 01 | [01_ECOSYSTEM_ARCHITECTURE.md](./01_ECOSYSTEM_ARCHITECTURE.md) | 에코시스템 아키텍처 토폴로지 및 구성요소 연동 설계 |
| 02 | [02_PRODUCT_REGISTRY.md](./02_PRODUCT_REGISTRY.md) | 제품의 메타데이터, 버전, 해시 등록을 관리하는 중앙 카탈로그 원장 |
| 03 | [03_DISTRIBUTION_PORTAL.md](./03_DISTRIBUTION_PORTAL.md) | 서명된 임시 URL 다운로드 경로를 제공하는 보안 전송 계층 설계 |
| 04 | [04_MARKETPLACE.md](./04_MARKETPLACE.md) | B2B/B2C 스토어 가격 모델 및 카탈로그 데이터 명세 |
| 05 | [05_LICENSING_MANAGEMENT.md](./05_LICENSING_MANAGEMENT.md) | SHA-256 서명 라이선스 토큰, 동시 구동 노드 제한 및 만료 체크 설계 |
| 06 | [06_CUSTOMER_MANAGEMENT.md](./06_CUSTOMER_MANAGEMENT.md) | RBAC 역할(시스템/파트너 어드민, 뷰어) 및 감사 로그 계정 구조 |
| 07 | [07_SUBSCRIPTION_BILLING.md](./07_SUBSCRIPTION_BILLING.md) | 토큰 빌링 및 실시간 쿼터 트래킹 과금 스키마 규격 수립 |
| 08 | [08_DEPLOYMENT_CONTAINER.md](./08_DEPLOYMENT_CONTAINER.md) | ZIP 압축 해제, sys.path 경로 격리 샌드박스 및 run.py 배포 구동 규격 |
| 09 | [09_GATEWAY_INTEGRATION.md](./09_GATEWAY_INTEGRATION.md) | API Gateway 라우팅, Rate Limiting (10 RPM 한계) 및 429 차단 룰 |
| 10 | [10_MONITORING_DASHBOARD.md](./10_MONITORING_DASHBOARD.md) | Uptime, Latency, 에러율, 누적 API 토큰 사용 비용 관제 데이터 명세 |
| 11 | [11_MAINTENANCE_LOGISTICS.md](./11_MAINTENANCE_LOGISTICS.md) | DRP 복구(Safe Write 기법 적용), 롤백 핫패치 릴리즈 지침 |
| 12 | [12_PRODUCT_LIFECYCLE.md](./12_PRODUCT_LIFECYCLE.md) | Staging, Production, Deprecated, Retired 수명 주기 가동 전이 규칙 |
| 13 | [13_VERSION_GOVERNANCE.md](./13_VERSION_GOVERNANCE.md) | Accept-Version 헤더 기반 API 중계 및 하위 호환성 유지 정책 |
| 14 | [14_EVOLUTION_STRATEGY.md](./14_EVOLUTION_STRATEGY.md) | 에이전트 소켓 불변성 수호 및 카나리 가중치 배포(Canary Deploy) 전략 |
| 15 | [15_ECOSYSTEM_API.md](./15_ECOSYSTEM_API.md) | 스토어 조회, 라이선스 검증 REST API JSON 입출력 규격 명세 |
| 16 | [16_VALIDATION_REPORT.md](./16_VALIDATION_REPORT.md) | 레지스트리 대조, 게이트웨이 429 모의 차단, DB 3,524개 DRP 복구 검증 |
| 17 | [17_SELF_REVIEW_REPORT.md](./17_SELF_REVIEW_REPORT.md) | 거버넌스 및 개발 표준 정합성, 확장 유연성 평가 자가 진단 리포트 |
| 18 | [18_FINAL_COMPLETION_REPORT.md](./18_FINAL_COMPLETION_REPORT.md) | 아키텍처 요약, 재사용 가능 플랫폼 자산 목록 및 차기 개발 로드맵 |

---

## Core Ecosystem Targets

1. **Integrated Rate Limiting Security**: 게이트웨이(`09_GATEWAY_INTEGRATION.md`) 호출에 대한 10 RPM 및 일일 쿼터 제한을 통해 AI API 호출 폭발 비용 차단.
2. **Deterministic Disaster Recovery (DRP)**: 재해 복구 실행 시, `3,524`개의 검증된 Recovery Baseline 데이터베이스 정합성이 깨지지 않고 안전하게 마이그레이션 및 동기화 복구되도록 규격 제어.
3. **Execution Compliance & Implementation**:
   > *All future implementations should follow this framework whenever applicable. The framework serves as the standard development guideline for the YM-LAB Project.*
4. **Architecture Stability Principle**:
   > *The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.*
