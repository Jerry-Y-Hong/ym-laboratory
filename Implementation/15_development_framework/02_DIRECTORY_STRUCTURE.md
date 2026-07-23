# Directory Structure

> **Module**: 15_development_framework — Document 02  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Standard Project Directory Layout

YM-LAB PROJECT의 전체 디렉터리 구성 및 핵심 역할 정의:

```text
YM-LAB_PROJECT/
│
├── 00_MFCO_KNOWLEDGE_BASE/          # 약선 원천 원재료 및 식재료 베이스 데이터
├── 01_PHASE1_KIMCHI/                 # Phase 1 김치 마스터 데이터 및 관련 규격
│
├── 100_PLATFORM/                     # 공통 식품 플랫폼 공유 레이어
│   ├── 110_API/                      # 농식품올바로 OpenAPI 래퍼
│   ├── 120_DATABASE/                 # raw/standard/semantic DB 레포지토리
│   ├── 130_AI_ENGINE/                # 추상화된 AI 인터페이스 규격 (Mock 포함)
│   ├── 140_AUTOMATION/               # 데이터 수집 자동화 파이프라인
│   └── 150_SHARED/                   # 로깅, 예외, 공통 유틸리티
│
├── 200_PROJECT_INTELLIGENCE/         # [READ ONLY] Phase 05 지능 정보 자산
├── 300_KNOWLEDGE_ENGINE/             # [READ ONLY] Phase 06 지식 그래프 자산
├── 400_AI_AUTOMATION/                # [READ ONLY] Phase 07 자동화 엔진 자산
│
├── Implementation/                   # 마스터 구현 및 아키텍처/프레임워크 산출물
│   ├── 12_governance/                # 개발 및 변경 관리 거버넌스 규칙
│   ├── 13_platform_architecture/     # 공통 플랫폼 및 6대 제품군 아키텍처
│   ├── 14_ai_operation_manual/       # 인간-AI 협업 매뉴얼 및 역할 매핑
│   └── 15_development_framework/     # 개발 프레임워크 표준 지침 (본 모듈)
│
├── YM-LAB_RECOVERY/                  # 무결성 복구 모듈 및 검증 스크립트 모음
│   └── scripts/                      # verify_*.py 스크립트 위치
│
└── blog_automation/                  # blog-saas 제품군의 Phase 01 로컬 자동화 엔진
```

---

## 2. Directory Layout Rules for New Modules (신규 도메인/모듈 설계 규칙)

향후 신규 식품 도메인(예: `smartfarm-saas` 관련 모듈 등)을 추가할 때, 다음의 표준 4단 폴더 구조 및 규칙을 엄격히 준수하여 배치하여야 한다.

```text
new_domain_module/
├── 01_requirements.md         # 1단계: 기능 및 비기능 요구사항 정의서
├── 02_system_design.md        # 2단계: 모듈 인터페이스 및 DB 스키마 설계서
├── 03_core_pipeline/          # 3단계: 로컬 파이썬 구현 패키지
│   ├── __init__.py
│   └── pipeline_logic.py
├── 04_scheduler/              # 4단계: 동기식 로컬 실행기 및 스케줄러
├── 05_storage/                # 5단계: 로컬 파일 기반 입출력 제어기
├── 06_backlog.md              # 6단계: 현재 릴리즈 범위를 넘어서는 아이디어 리스트
└── README.md                  # 디렉터리 안내서 (인덱스)
```

- **규칙 1. 독립성 유지**: 신규 도메인 폴더는 기존 플랫폼 레이어(`100_PLATFORM`)의 API만 경유해야 하며, 다른 도메인 폴더 내부를 직접 참조(`import`)하는 순환 참조를 금지한다.
- **규칙 2. 런타임 데이터 분리**: 각 도메인의 로컬 실행 이력 및 JSON 임시 파일은 해당 도메인 하위의 `data/` 임시 폴더에 격리 저장하며, 버전 관리(`.gitignore`)에서 명시적으로 제외한다.
