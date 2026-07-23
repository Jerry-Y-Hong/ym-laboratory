# YM-LAB_RECOVERY Master Asset Index

> **Baseline Version**: Phase 04-03 Baseline Complete  
> **Verification Status**: ✅ **PASS 3,524** / ❌ **FAIL 0** / ⚠️ **WARNING 0**  
> **Catalog Source**: [catalog.db](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/catalog.db) | [MANIFEST.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/MANIFEST.json)  
> **Schema Version**: 2.0.0

---

## 1. Executive Summary & Storage Metrics

YM-LAB_RECOVERY는 YM-LAB PROJECT 내 분산된 3개 주요 프로젝트(MFCO, NICS_DATA, sanYacho) 및 플랫폼 기반 자산 3,524건을 SHA-256 해시 기반으로 통합 관리하는 복원 및 자산 관리 저장소입니다.

| 항목 | 수량 / 용량 | 비고 |
| :--- | :--- | :--- |
| **전체 복원 자산 (Total Files)** | **3,524 건** | 전체 총용량: **95.36 MB** (99,990,610 bytes) |
| **무결성 검증 (Verification)** | **3,524 PASS** | 원본 및 복사본 100% SHA-256 해시 일치 |
| **핵심 자산 (Core Project Assets)** | **187 건** | 소스코드, 데이터베이스, 스키마, 온톨로지, 문서 |
| **의존성 자산 (Vendor Dependencies)** | **3,337 건** | `mfco-website` 내 `node_modules` 패키지 |
| **중복 자산 (Duplicate Files)** | **154 건** | 백업 및 버전별 중복 보존 자산 (~12.4 MB) |
| **미분류 후보 (Unclassified)** | **108 건** | 단일 키워드 오분류 파일 (Scratch, Backup, Platform) |

---

## 2. Project Taxonomy & Module Hierarchy

확장 가능한 자산 분류 스키마([project_classification.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/project_classification.json)) 기준 모듈별 구성 현황입니다.

| 프로젝트 ID | 모듈명 | 상태 | 파일 수 | 용량 (MB) | 주요 저장 경로 |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **`MFCO_CORE`** | MFCO Core Knowledge Base | Production | 17 | 10.35 | `00_MFCO_KNOWLEDGE_BASE/01`~`06` |
| **`MFCO_LEGACY_ONEDRIVE`** | OneDrive Legacy Assets | Legacy Archive | 56 | 13.91 | `00_MFCO_KNOWLEDGE_BASE/07_ONEDRIVE_RECOVERY_FULL/` |
| **`MFCO_WEBSITE`** | MFCO Web App (React/Vite) | Frontend App | 26 | 0.28 | `.../07_ONEDRIVE_RECOVERY_FULL/mfco-website/src` |
| **`SANYACHO`** | sanYacho Wild Plant Web App | Production | 1 | 0.001 | [sanYacho](file:///g:/내%20드라이브/YM-LAB_PROJECT_/sanYacho) |
| **`NICS_DATA`** | 농식품올바로 (NICS) Data | Active | 1 | 0.005 | `100_PLATFORM/120_DATABASE/repository/raw_repository.py` |
| **`PLATFORM`** | YM-LAB Core Infrastructure | Infrastructure | 5 | 0.02 | [100_PLATFORM](file:///g:/내%20드라이브/YM-LAB_PROJECT_/100_PLATFORM) |
| **`KIMCHI`** | Kimchi Master Phase 1 | Phase 1 Complete | 2 | 0.007 | [01_PHASE1_KIMCHI](file:///g:/내%20드라이브/YM-LAB_PROJECT_/01_PHASE1_KIMCHI) |
| **`SCRATCH`** | Scratch & Temp Scripts | Temporary | 35 | 0.05 | `.../07_ONEDRIVE_RECOVERY_FULL/scratch/` |
| **`BACKUP_ARCHIVE`** | Historical Backup Archives | Archive | 43 | 12.38 | `.../07_ONEDRIVE_RECOVERY_FULL/00_BACKUP/` |
| **`VENDOR_DEPENDENCIES`**| Node Modules | Vendor | 3,337 | 58.12 | `.../mfco-website/node_modules/` |
| **`ROOT_REPORTS`** | Root Reports & Discovery Logs | Documentation | 2 | 0.22 | `YM-LAB_PROJECT_` Root |

---

## 3. Quick Reference Links & Deliverables

- 📊 **전체 자산 인벤토리**: [asset_inventory.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/asset_inventory.json)
- 🗂️ **프로젝트 자동 분류 스키마**: [project_classification.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/project_classification.json)
- 🔄 **중복 자산 분석 보고서**: [duplicate_report.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/duplicate_report.md)
- 🔍 **미분류 자산 분석 보고서**: [unknown_asset_report.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/unknown_asset_report.md)
- 🚀 **Recovery 고도화 로드맵**: [recovery_improvement.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/recovery_improvement.md)
- 📈 **통합 프로젝트 현황 기록**: [PROJECT_STATUS.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/PROJECT_STATUS.md)
