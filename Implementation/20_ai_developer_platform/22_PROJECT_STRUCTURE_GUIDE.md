# Project Structure Guide

> **Module**: 20_ai_developer_platform — Document 22  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Standard Project Directory Structure Rules (프로젝트 구조 가이드)

프로젝트 구조 가이드(Project Structure Guide)는 개발자 및 양산기가 새로운 한식 AI 제품 디렉터리를 구성할 때 **디렉터리 트리 무결성을 통제하고 상호 의존성 오염을 방지하기 위한 표준 폴더 레이아웃 규칙**을 기술한다.

```text
products/{product_name}/ (제품 루트 경로)
│
├── 01_requirements.md             # 요구사항 기술서 (요구 분석 메타 자동 이식)
├── 02_system_design.md            # 구조 및 모듈 연동 매핑 설계서
│
├── 03_content_pipeline/           # 에이전트 소켓 비즈니스 흐름부
│   ├── __init__.py
│   └── runner.py                  # 오케스트레이션 실행 제어기
│
├── 04_scheduler/                  # 로컬 실행 타이머 배치 제어기
│   ├── __init__.py
│   └── main_scheduler.py
│
├── 05_storage/                    # Safe Write 디스크 저장 인터페이스
│   ├── __init__.py
│   └── file_handler.py
│
├── platform_libs/                 # SDK 및 공통 모듈(@ymlab/*) 심볼릭/복제본 배치 영역
│
├── config.json                    # 환경 설정 (system_env, DB 경로 등)
├── run.py                         # 런타임 진입 실행 스크립트
├── verify_product.py              # 로컬 자가 검증 검사기
└── data/                          # 디스크 격리 샌드박스 보존 구역
    ├── logs/                      # 로컬 추적 이력 로깅
    └── posts/                     # 아티클 발행 임시 적재 폴더
```

---

## 2. Directory Validation Rules (정합성 규칙)

- **누락 불가 필수 파일군**:
  - `run.py`, `config.json`, `verify_product.py` 및 `03_content_pipeline/` 하위 소스 파일들은 린터 검증 스크립트가 파일 검출 시 필수 체크 대상으로 인식하며, 하나라도 빠지면 빌드 실패를 트리거한다.
- **Gitignore 무결성 수호**:
  - 제품 생성 단계에서 `data/` 및 `platform_libs/` 디렉터리는 메인 Git 리포지토리 형상 관리를 방해하지 않도록 `.gitignore` 설정이 강제 적용되어 로컬 격리를 안전하게 수행한다.

---

## 3. Standard Gitignore Template for Products

```text
# YM-LAB Product Sandbox Gitignore
data/
platform_libs/
.venv/
__pycache__/
*.tmp
*.log
```
Ref: [Development Directory Layout](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/02_DIRECTORY_STRUCTURE.md)
