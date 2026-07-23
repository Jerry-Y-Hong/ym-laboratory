# YM-LAB Development Framework

> **Module**: 15_development_framework  
> **Version**: `v1.0`  
> **Status**: ✅ COMPLETED — Development Framework : Closed & Frozen  

---

## Overview

본 디렉터리는 YM-LAB PROJECT의 전체 수명 주기에 걸쳐 코드 무결성, 개발 단순성, 아키텍처 안정성 및 설계-코드 추적성을 확보하기 위해 수립된 **YM-LAB 표준 개발 프레임워크** 문서셋을 포함한다.

모든 정책은 기존 거버넌스(`12_governance`), 플랫폼 아키텍처(`13_platform_architecture`) 및 AI 운영 매뉴얼(`14_ai_operation_manual`) 규칙을 온전히 계승하며, 복잡한 엔터프라이즈 인프라(Kafka, Redis, Qdrant, 분산 락, CI/CD 파이프라인 등)를 배제하고 **로컬 파이썬 개발 및 Git 협업 실무**에 즉시 적용 가능하도록 구성되었다.

---

## Document Index

| # | 문서명 | 설명 |
| :--- | :--- | :--- |
| 01 | [01_DEVELOPMENT_STANDARD.md](./01_DEVELOPMENT_STANDARD.md) | 엔지니어링 4대 핵심 원칙(무결성, 단순성, 안정성, 추적성) 선언 |
| 02 | [02_DIRECTORY_STRUCTURE.md](./02_DIRECTORY_STRUCTURE.md) | 리포지토리 전체 폴더 레이아웃 정의 및 신규 도메인/모듈 추가 템플릿 규정 |
| 03 | [03_NAMING_CONVENTION.md](./03_NAMING_CONVENTION.md) | 파일명, 변수/함수/클래스, DB 테이블 및 Q-Code 명명 표준 수립 |
| 04 | [04_CODING_STANDARD.md](./04_CODING_STANDARD.md) | PEP8 파이썬 코딩 규칙, Docstring 레이아웃 및 Type Hinting 지침 |
| 05 | [05_CONFIGURATION_GUIDE.md](./05_CONFIGURATION_GUIDE.md) | 설정(Configuration) 및 환경 세팅(Settings) 파라미터 격리 로드 수칙 |
| 06 | [06_DATABASE_STANDARD.md](./06_DATABASE_STANDARD.md) | SQLite 연결 타임아웃, 분산락 배제, 인덱스-원장 분리형 JSON 캐싱 규칙 |
| 07 | [07_TESTING_GUIDE.md](./07_TESTING_GUIDE.md) | 3대 테스트 계층(Unit Test, Integration Test, Verification Script) 규격 정립 |
| 08 | [08_ERROR_HANDLING_GUIDE.md](./08_ERROR_HANDLING_GUIDE.md) | Custom Exception 상속 구조, Graceful Fallback 구현 및 Python Logging Standard |
| 09 | [09_RELEASE_GUIDE.md](./09_RELEASE_GUIDE.md) | 유의적 버전 vX.Y.Z 선언 기준 및 릴리즈 전 무결성 더블체크 수칙 |
| 10 | [10_DEVELOPMENT_BEST_PRACTICES.md](./10_DEVELOPMENT_BEST_PRACTICES.md) | 순환 참조 디버깅법, 자원 누출 예방 및 Phase 15 최종 완료 보고서 수록 |

---

## Core Targets & Guidelines

1. **Local Self-Containment**: YM-LAB에 정의되지 않은 외부 클라우드 전용 기술이나 분산 메시지 버스 연동을 원천 금지함.
2. **Deterministic Quality Gate**: 로컬 테스트 스크립트(`verify_*.py`) 100% 통과 시에만 브랜치 커밋 및 병합 권장.
3. **Architecture Stability Principle**:
   > *The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.*
4. **Compliance & Implementation Guide**:
   > *All future implementations should follow this framework whenever applicable. The framework serves as the standard development guideline for the YM-LAB Project.*
