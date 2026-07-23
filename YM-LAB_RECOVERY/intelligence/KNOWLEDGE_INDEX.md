# YM-LAB PROJECT Knowledge Index for AI Understanding

> **Layer Version**: Phase 05 Project Intelligence Layer  
> **Target Audience**: AI Coding Assistants, RAG Search Engines, Graph DB Generators  
> **Schema Standard**: [asset_inventory.schema.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/schema/asset_inventory.schema.json)  

---

## 1. Overview & Purpose

본 **Knowledge Index**는 AI 시스템(LLM, RAG Pipeline, Graph Agent)이 YM-LAB 전체 프로젝트의 도메인 지식, 모듈별 입출력 구조, 연관 문서 및 종단간 데이터 흐름을 직관적으로 이해하고 추론할 수 있도록 구성된 지식 인덱스입니다.

---

## 2. Project Knowledge Cards

### 📦 1. MFCO (Master Functional Core Ontology)
- **목적 (Purpose)**: 식품의약품안전처 기능성 원료, 동의보감/한의학 산야초, 영양 성분을 정규화하여 Q-Code 기반 온톨로지로 통합 관리.
- **역할 (Role)**: YM-LAB 생태계의 중앙 마스터 도메인 온톨로지 엔진.
- **입력 (Inputs)**:
  - NICS_DATA 식품 영양 성분 데이터
  - Kimchi Phase 1 원재료 마스터 규격
  - 약선 매핑 표 및 식약처 공공 데이터
- **출력 (Outputs)**:
  - `M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx` (마스터 지식베이스)
  - `mfcoData.json` (웹 서비스용 정적 온톨로지 덤프)
  - `M02-01_TERM_DICTIONARY_MASTER_v1.0.xlsx` (용어 사전)
- **관련 프로젝트 (Related Projects)**: `Platform`, `Kimchi`, `Website`, `Recovery`
- **관련 문서 (Related Documents)**:
  - [MFCO_KNOWLEDGE_BASE_DISCOVERY_REPORT.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/MFCO_KNOWLEDGE_BASE_DISCOVERY_REPORT.md)
  - [AUTOMATED_MARKET_FEASIBILITY_ENGINE_SPEC.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/MFCO/00_MFCO_KNOWLEDGE_BASE/07_ONEDRIVE_RECOVERY_FULL/06_DOCUMENT/AUTOMATED_MARKET_FEASIBILITY_ENGINE_SPEC.md)

---

### 🌿 2. sanYacho (Wild Plant Web App)
- **목적 (Purpose)**: 약용 자생식물 및 산야초 정보 검색, 효능 탐색, 사용자 매칭을 제공하는 독립형 웹 서비스.
- **역할 (Role)**: B2C 산야초 특화 독립 프로덕션 웹 애플리케이션 (Next.js / Vercel 배포).
- **입력 (Inputs)**: 산야초 효능 데이터베이스, 약선 식재료 매핑 데이터.
- **출력 (Outputs)**: Vercel 프로덕션 웹 인스턴스, 사용자 인터페이스.
- **관련 프로젝트 (Related Projects)**: `MFCO`, `Recovery`
- **관련 문서 (Related Documents)**:
  - [sanYacho Manifest](file:///g:/내%20드라이브/YM-LAB_PROJECT_/sanYacho/MANIFEST.json)

---

### 🥗 3. NICS_DATA (농식품올바로 Food Safety & Nutrition Data)
- **목적 (Purpose)**: 농촌진흥청/식약처 공공 식품 영양 성분 및 HACCP 안전 데이터 수집.
- **역할 (Role)**: 외부 원천 식품 데이터 표준 수집 파이프라인.
- **입력 (Inputs)**: 농식품올바로 Open API, 공공 데이터 포털 JSON/CSV.
- **출력 (Outputs)**: Raw DB 테이블 레코드, `raw_repository.py` 접근 레이어.
- **관련 프로젝트 (Related Projects)**: `Platform`, `MFCO`
- **관련 문서 (Related Documents)**:
  - [raw_repository.py](file:///g:/내%20드라이브/YM-LAB_PROJECT_/100_PLATFORM/120_DATABASE/repository/raw_repository.py)

---

### ⚙️ 4. Platform (YM-LAB Core Infrastructure)
- **목적 (Purpose)**: YM-LAB 시스템의 백엔드 데이터베이스 DDL 스키마, 레포지토리 패턴 및 ETL 상태 관리.
- **역할 (Role)**: 데이터 영속성 및 파이프라인 중앙 인프라 레이어.
- **입력 (Inputs)**: PostgreSQL/SQLite SQL 스크립트, 레포지토리 구성 파이썬 모듈.
- **출력 (Outputs)**:
  - `02_STANDARD_LAYER.sql` (표준 DDL 테이블)
  - `standard_repository.py` (표준 레포지토리 객체)
  - `collection_state.json` (수집 엔진 체크포인트)
- **관련 프로젝트 (Related Projects)**: `MFCO`, `NICS_DATA`, `Recovery`
- **관련 문서 (Related Documents)**:
  - [02_STANDARD_LAYER.sql](file:///g:/내%20드라이브/YM-LAB_PROJECT_/100_PLATFORM/120_DATABASE/schema/02_STANDARD_LAYER.sql)
  - [standard_repository.py](file:///g:/내%20드라이브/YM-LAB_PROJECT_/100_PLATFORM/120_DATABASE/repository/standard_repository.py)

---

### 🛡️ 5. Recovery (YM-LAB Integrated Asset Storage)
- **목적 (Purpose)**: YM-LAB 전 프로젝트 자산(3,524개 파일)의 SHA-256 해시 기반 무결성 보존 및 자동 분류 관리.
- **역할 (Role)**: 프로젝트 자산 수집, 복원, 무결성 검증 및 자산 인벤토리 제공.
- **입력 (Inputs)**: YM-LAB 전역 디렉터리 스캔 파일.
- **출력 (Outputs)**:
  - `catalog.db` 및 `MANIFEST.json`
  - `asset_inventory.json` (3,524건 메타데이터)
  - `project_classification.json` (자동 분류 스키마)
- **관련 프로젝트 (Related Projects)**: `ALL_PROJECTS`
- **관련 문서 (Related Documents)**:
  - [RECOVERY_INDEX.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/RECOVERY_INDEX.md)
  - [asset_inventory.schema.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/schema/asset_inventory.schema.json)
  - [01_VERSION_GOVERNANCE_POLICY.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/01_VERSION_GOVERNANCE_POLICY.md)

---

### 🥬 6. Kimchi (Phase 1 Kimchi Master Dataset)
- **목적 (Purpose)**: 전통 김치 젖산균, 원재료 마스터 및 레시피 조합 표준화.
- **역할 (Role)**: 전통 발효식품 특화 서브 도메인 온톨로지.
- **입력 (Inputs)**: 김치 원재료 화학 성분표, 레시피 가이드.
- **출력 (Outputs)**:
  - `INGREDIENT_MASTER_SPEC.md`
  - `RECIPE_MASTER_SPEC.md`
- **관련 프로젝트 (Related Projects)**: `MFCO`, `Recovery`
- **관련 문서 (Related Documents)**:
  - [INGREDIENT_MASTER_SPEC.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/01_PHASE1_KIMCHI/03_INGREDIENT_MASTER/INGREDIENT_MASTER_SPEC.md)

---

### 💻 7. Website (MFCO Web Application)
- **목적 (Purpose)**: MFCO 온톨로지 기반 사용자(소비자, 전문가, B2B 프랜차이즈) 대화형 웹 인터페이스 제공.
- **역할 (Role)**: React/Vite 기반 싱글 페이지 웹 애플리케이션 (SPA).
- **입력 (Inputs)**: `mfcoData.json`, `mfcoInference.js`.
- **출력 (Outputs)**: 빌드된 웹 아티팩트 (`dist/`), 사용자 UX 페이지.
- **관련 프로젝트 (Related Projects)**: `MFCO`, `Recovery`
- **관련 문서 (Related Documents)**:
  - [App.jsx](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/MFCO/00_MFCO_KNOWLEDGE_BASE/07_ONEDRIVE_RECOVERY_FULL/mfco-website/src/App.jsx)

---

### 📱 8. AAF (AI Application Framework)
- **목적 (Purpose)**: YM-LAB 생태계 내 모든 AI 응용 소프트웨어를 위한 표준화된 애플리케이션 아키텍처, 레이어 모델 및 배포 프레임워크 정의.
- **역할 (Role)**: 프론트엔드 UI(AFDS Phase 28), 브랜드 아이덴티티(ABIDS Phase 27) 및 자율 인공지능 엔진(ASIS Phase 26, AEDES Phase 25 등)을 결합하는 표준 애플리케이션 레이어 SSOT.
- **입력 (Inputs)**: AFDS Phase 28 UI 컴포넌트, ADF v3.1 아키텍처 거버넌스 표준.
- **출력 (Outputs)**: AAF 10개 마스터 산출물 (`AAF/01_AAF_MASTER_ARCHITECTURE.md` ~ `AAF/10_MASTER_REPORT.md`).
- **관련 프로젝트 (Related Projects)**: `AFDS`, `ABIDS`, `ASIS`, `AEDES`, `AEOS`
- **관련 문서 (Related Documents)**:
  - [10_MASTER_REPORT.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AAF/10_MASTER_REPORT.md)

---

### 🤖 9. AAOS (AI Autonomous Agent Orchestration System)
- **목적 (Purpose)**: AFKM 위에 구축되어 AI 에이전트들의 자율적인 오케스트레이션, 실행 정책, 수명 주기, 역할 및 권한 모델을 중앙에서 통제.
- **역할 (Role)**: YM-LAB 생태계의 AI 에이전트 중앙 관제 및 실행 오케스트레이션 시스템.
- **입력 (Inputs)**: 작업 지시서, ADF v3.1 룰, AFKM 연계 데이터.
- **출력 (Outputs)**: AAOS 11개 마스터 산출물 (`AAOS/01_AGENT_ARCHITECTURE.md` ~ `AAOS/11_PHASE31_REVIEW_CHECKLIST.md`).
- **관련 프로젝트 (Related Projects)**: `AFKM`, `AAF`, `AEDES`
- **관련 문서 (Related Documents)**:
  - [10_PHASE31_WALKTHROUGH.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/AAOS/10_PHASE31_WALKTHROUGH.md)
