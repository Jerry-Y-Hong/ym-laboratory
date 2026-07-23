# YM-LAB AI Developer Platform

> **Module**: 20_ai_developer_platform  
> **Version**: `v1.0`  
> **Status**: ✅ COMPLETED — AI Developer Platform : Closed & Frozen  

---

## Overview

본 디렉터리는 YM-LAB PROJECT의 AI 시스템을 동일한 프레임워크 위에서 개발할 수 있는 **표준 개발 플랫폼(AI Developer Platform)**의 아키텍처 및 27대 산출물 명세서셋을 포함한다.

---

## Document Index

| # | 문서명 | 설명 |
| :--- | :--- | :--- |
| 01 | [01_PLATFORM_ARCHITECTURE.md](./01_PLATFORM_ARCHITECTURE.md) | 플랫폼 아키텍처 토폴로지 및 구성요소 연동 설계 |
| 02 | [02_DEVELOPER_EXPERIENCE.md](./02_DEVELOPER_EXPERIENCE.md) | 온보딩 워크플로우, DX 개발 수칙 및 로컬 가상 환경 제어 |
| 03 | [03_SDK_ARCHITECTURE.md](./03_SDK_ARCHITECTURE.md) | ymlab SDK 코어 패키지 구조 및 파이썬 모듈 진입점 명세 |
| 04 | [04_CLI_SYSTEM.md](./04_CLI_SYSTEM.md) | ymlab-cli 명령 인터페이스, 인수 및 쉘 복귀 코드 표준 정의 |
| 05 | [05_TEMPLATE_ENGINE.md](./05_TEMPLATE_ENGINE.md) | 이중 중괄호 치환 및 Safe Write 파일 교체 템플릿 엔진 명세 |
| 06 | [06_PROJECT_GENERATOR.md](./06_PROJECT_GENERATOR.md) | ymlab-cli init 실행에 반응하는 스켈레톤 조립 및 모듈 링크 규칙 |
| 07 | [07_PLUGIN_FRAMEWORK.md](./07_PLUGIN_FRAMEWORK.md) | BaseYMLabAgent 추상 클래스 상속 및 플러그인 동적 등록 명세 |
| 08 | [08_EXTENSION_SYSTEM.md](./08_EXTENSION_SYSTEM.md) | 미디어 인코더, 스케줄러 훅 및 이벤트 매니저 확장 설계 |
| 09 | [09_LOCAL_RUNTIME.md](./09_LOCAL_RUNTIME.md) | venv 가상 가동 격리, sys.path 지정 런타임 매니페스트 |
| 10 | [10_CONFIGURATION_SYSTEM.md](./10_CONFIGURATION_SYSTEM.md) | DeveloperConfig 데이터 클래스 파싱 및 샌드박스 설정 상속 |
| 11 | [11_DEBUGGING_SYSTEM.md](./11_DEBUGGING_SYSTEM.md) | 가상 중단점 및 step-by-step 변수 모의 추적 로거 명세 |
| 12 | [12_LOGGING_FRAMEWORK.md](./12_LOGGING_FRAMEWORK.md) | Python Logging Standard, StreamHandler 및 RotatingFileHandler 수립 |
| 13 | [13_TESTING_FRAMEWORK.md](./13_TESTING_FRAMEWORK.md) | 단위/통합/검증 3계층 자동 테스트 슈트, verify_product.py 규격 |
| 14 | [14_MOCK_SERVER.md](./14_MOCK_SERVER.md) | catalog_mock.db 및 모의 LLM 응답 시뮬레이터 설계 |
| 15 | [15_API_SIMULATOR.md](./15_API_SIMULATOR.md) | HTTP 요청 가로채기, 스키마 유효 검사 및 네트워크 경쟁 지연 주입 |
| 16 | [16_PACKAGE_MANAGER.md](./16_PACKAGE_MANAGER.md) | platform_libs/ 격리 복사, requirements.txt 버전 락 잠금 수칙 |
| 17 | [17_VERSION_MANAGER.md](./17_VERSION_MANAGER.md) | 시맨틱 버저닝, Git tag 릴리즈 버전 증분 및 태깅 지침 |
| 18 | [18_BUILD_PIPELINE.md](./18_BUILD_PIPELINE.md) | 린트, 스캔, 테스트 E2E 통과식 package 자동 빌드 파이프라인 |
| 19 | [19_DEV_CONTAINER.md](./19_DEV_CONTAINER.md) | VS Code devcontainer.json 자동 확장 및 포트 포워딩 규격 |
| 20 | [20_DOCKER_ENVIRONMENT.md](./20_DOCKER_ENVIRONMENT.md) | Multi-Stage Dockerfile 구성 및 docker-compose 샌드박스 야믈 명세 |
| 21 | [21_CODE_STYLE_GUIDE.md](./21_CODE_STYLE_GUIDE.md) | snake_case/PascalCase 명명, Ruff 린팅 및 MyPy 정적 타이핑 규칙 |
| 22 | [22_PROJECT_STRUCTURE_GUIDE.md](./22_PROJECT_STRUCTURE_GUIDE.md) | 누락 불가 필수 파일 스펙 및 제품용 gitignore 템플릿 명세 |
| 23 | [23_SAMPLE_PROJECT.md](./23_SAMPLE_PROJECT.md) | 배추김치(Q_KIMCHI_001) RAG 기사 생성 run.py 및 config.json 예제 |
| 24 | [24_DEVELOPER_DOCUMENTATION.md](./24_DEVELOPER_DOCUMENTATION.md) | Google Style Docstring, Sphinx autodoc 및 Swagger OpenAPI specs |
| 25 | [25_VALIDATION_SYSTEM.md](./25_VALIDATION_SYSTEM.md) | 파일 구조, 버전 충돌 검사 및 테스트 통과율(100%) 제품 검증 리포트 |
| 26 | [26_SELF_REVIEW.md](./26_SELF_REVIEW.md) | 거버넌스 및 개발 표준 정합성, 확장 유연성 평가 자가 진단 리포트 |
| 27 | [27_PHASE20_COMPLETION_REPORT.md](./27_PHASE20_COMPLETION_REPORT.md) | 아키텍처 요약, 재사용 가능 플랫폼 자산 목록 및 차기 개발 로드맵 |

---

## Core Platform Standards

1. **Standardized DX Onboarding**: B2B 및 사내 개발자는 CLI `ymlab-cli init` 구동을 통해 로컬 개발 샌드박스를 10초 이내에 자동 빌드 구성 가능.
2. **Absolute Resource Isolation (Sandbox)**: 개발 중인 AI 제품군은 `sys.path` 격리 가상환경 및 data/ 스토리지 격리 규칙을 상속하여 무단 상위 디스크 침해 및 원본 무결성 Baseline 훼손 전면 불허.
3. **Execution Compliance & Implementation**:
   > *All future implementations should follow this framework whenever applicable. The framework serves as the standard development guideline for the YM-LAB Project.*
4. **Architecture Stability Principle**:
   > *The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.*
