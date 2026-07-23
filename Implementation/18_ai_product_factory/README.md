# YM-LAB AI Product Factory

> **Module**: 18_ai_product_factory  
> **Version**: `v1.0`  
> **Status**: ✅ COMPLETED — AI Product Factory : Closed & Frozen  

---

## Overview

본 디렉터리는 YM-LAB PROJECT의 다카테고리 한식 교육 제품군을 체계적으로 설계, 조립, 패키징, 배포 및 수명 주기 제어하기 위해 수립된 **YM-LAB AI 제품 팩토리 표준 플랫폼(AI Product Factory)**의 아키텍처 및 13대 산출물 명세서셋을 포함한다.

본 시스템은 선언적 **Product Blueprint** 명세서와 **Product Template** 코드 스켈레톤을 기반으로 동작하여 수동 빌드 과정에서 일어날 수 있는 휴먼 에러를 원천 배제하고, 중앙 집중식 **Product Module Registry**와 결합하여 높은 품질의 무결한 제품 형상을 지속 양산해 낸다.

---

## Document Index

| # | 문서명 | 설명 |
| :--- | :--- | :--- |
| 01 | [01_PRODUCT_FACTORY_ARCHITECTURE.md](./01_PRODUCT_FACTORY_ARCHITECTURE.md) | 선언적 제품 블루프린트 파싱 및 양산 팩토리 코어 아키텍처 |
| 02 | [02_PRODUCT_BLUEPRINT_SPECIFICATION.md](./02_PRODUCT_BLUEPRINT_SPECIFICATION.md) | 제품의 요구 종속 모듈 및 스케줄 정의용 블루프린트 스키마 규격 |
| 03 | [03_PRODUCT_TEMPLATE_SPECIFICATION.md](./03_PRODUCT_TEMPLATE_SPECIFICATION.md) | 개발 표준에 정합하는 디렉터리, 스케줄러, 파일 입출력 스켈레톤 구조 |
| 04 | [04_PRODUCT_MODULE_REGISTRY.md](./04_PRODUCT_MODULE_REGISTRY.md) | 공통 플랫폼 모듈 및 AI 에이전트 클래스 버전 식별 레지스트리 |
| 05 | [05_CONFIGURATION_SPECIFICATION.md](./05_CONFIGURATION_SPECIFICATION.md) | 제품 고유의 경로 격리 구성 및 런타임 환경 설정 상속 지침 |
| 06 | [06_GENERATION_WORKFLOW.md](./06_GENERATION_WORKFLOW.md) | 템플릿 복제부터 모듈 조립, run.py 자동 구성 빌드 6단계 명세 |
| 07 | [07_PACKAGING_SPECIFICATION.md](./07_PACKAGING_SPECIFICATION.md) | 임시 파일 소거, zip 아카이브 및 SHA-256 해시 무결성 검증 매니페스트 |
| 08 | [08_DEPLOYMENT_GUIDE.md](./08_DEPLOYMENT_GUIDE.md) | 배포 대상 환경 식별 및 Staging/Production 파일 복사 배포 지침 |
| 09 | [09_VERSION_MANAGEMENT_SPECIFICATION.md](./09_VERSION_MANAGEMENT_SPECIFICATION.md) | 시맨틱 버저닝 vX.Y.Z, Git 릴리즈 브랜치 분리 및 태깅 수칙 |
| 10 | [10_LIFECYCLE_MANAGEMENT_GUIDE.md](./10_LIFECYCLE_MANAGEMENT_GUIDE.md) | Incubating, Active, Archived, Decommissioned 단계별 수명 주기 관리 표준 |
| 11 | [11_VALIDATION_REPORT.md](./11_VALIDATION_REPORT.md) | 파일 구조, 버전 충돌 검사 및 테스트 통과율(100%) 제품 검증 리포트 |
| 12 | [12_SELF_REVIEW_REPORT.md](./12_SELF_REVIEW_REPORT.md) | 거버넌스 및 개발 표준 정합성, 확장 유연성 평가 자가 진단 리포트 |
| 13 | [13_FINAL_COMPLETION_REPORT.md](./13_FINAL_COMPLETION_REPORT.md) | 아키텍처 요약, 재사용 가능 자산 목록 및 차기 개발 로드맵 |

---

## Core Factory Targets

1. **Category Scaling with Zero Code Changes**: 신규 식품 제품군 추가 시 코드를 다시 코딩할 필요 없이, 블루프린트 YAML/JSON 설정 변경만으로 완전하게 규격 조립 및 양산 실행 보장.
2. **Deterministic Build Gate**: 제품 검증 체계(`11_VALIDATION_REPORT`)에 기술된 모든 테스트 합격률 100% 만족 시에만 배포용 번들 ZIP 파일 출력 허가.
3. **Execution Compliance & Implementation**:
   > *All future implementations should follow this framework whenever applicable. The framework serves as the standard development guideline for the YM-LAB Project.*
4. **Architecture Stability Principle**:
   > *The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.*
