# YM-LAB_RECOVERY Duplicate Asset Analysis & Origin Trace Report

> **Target Inventory**: [asset_inventory.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/YM-LAB_RECOVERY/asset_inventory.json)  
> **Total Duplicate Files**: **154 건**  
> **Verification Strategy**: SHA-256 Exact Matching (`is_duplicate = 1`)  
> **Baseline Compliance**: Zero File Deletion / Original Copy Preservation  

---

## 1. Summary & Storage Impact

catalog.db 스캔 결과, 총 **3,524개 파일 중 154개 파일(4.37%)**이 동일한 SHA-256 해시값을 보유한 완전 중복(Exact Duplicate) 자산으로 확인되었습니다.

- **프로젝트 핵심 중복 자산 (Non-`node_modules`)**: **26 건** (엑셀 16, Word/PDF 4, Markdown 3, 기타 3)
- **외부 의존성 중복 자산 (`node_modules`)**: **128 건** (TypeScript 88, JS 24, JSON 14, TXT 2)
- **중복 자산 총 점유 용량**: **12.38 MB**
- **원인**: 과거 프로젝트 개발 과정에서 버전별 `00_BACKUP` 폴더 및 `01_BASELINE` 복사본 생성, Node 모듈 내 동일 유틸리티 중복 포함.

---

## 2. Core Duplicate Origin Trace Matrix (대표 26건)

아래 표는 MFCO 및 플랫폼 핵심 자산 중 백업 폴더(`00_BACKUP`) 및 드래프트 디렉터리에 동일 해시로 저장된 대표 중복 파일의 원본(Origin) 및 복사본(Duplicate) 추적 내역입니다.

| 파일명 | 확장자 | SHA-256 (Prefix) | 원본 저장 위치 (Original Canonical Path) | 중복 복사본 위치 (Duplicate Path) |
| :--- | :---: | :---: | :--- | :--- |
| `MFCO_CONTINUATION_SUMMARY.md` | `.md` | `670aa9838260` | `.../07_ONEDRIVE_RECOVERY_FULL/MFCO_CONTINUATION_SUMMARY.md` | `.../00_BACKUP/MFCO_CONTINUATION_SUMMARY.md` |
| `MFCO_DESIGN_BLUEPRINT_MASTER_v1.1.md` | `.md` | `555b1aeaa69c` | `.../07_ONEDRIVE_RECOVERY_FULL/MFCO_DESIGN_BLUEPRINT_MASTER_v1.1.md` | `.../00_BACKUP/MFCO_DESIGN_BLUEPRINT_MASTER_v1.1.md` |
| `MFCO_MASTER_HERB_DB_v1.xlsx` | `.xlsx` | `41c69ffe8af3` | `.../07_ONEDRIVE_RECOVERY_FULL/MFCO_MASTER_HERB_DB_v1.xlsx` | `.../00_BACKUP/MFCO_MASTER_HERB_DB_v1.xlsx` |
| `M04-01_FUNCTION_GROUP_MASTER_v1.0.xlsx` | `.xlsx` | `b8317c7810c5` | `.../04_FUNCTION_INDEX/M02-00_FUNCTION_GROUP_MASTER_v1.0.xlsx` | `.../00_BACKUP/04_MAPPING_ENGINE/M04-01_...xlsx` |
| `M04-02_TERM_DICTIONARY_MASTER_v1.0.xlsx` | `.xlsx` | `786d47b9ed0f` | `.../03_DICTIONARIES/M02-01_TERM_DICTIONARY_MASTER_v1.0.xlsx` | `.../00_BACKUP/04_MAPPING_ENGINE/M04-02_...xlsx` |
| `M04-00_DATA_STANDARD_MASTER_v1.0.xlsx` | `.xlsx` | `7fb293d8e90a` | `.../02_UNIFIED_KNOWLEDGE_EXCEL/M04-00_...xlsx` | `.../04_MAPPING_ENGINE/M04-00_...xlsx` |
| `MFCO_MASTER_PHASE1_v1_0_DRAFT.xlsx.xlsx` | `.xlsx` | `6fa73aca4d52` | `.../02_UNIFIED_KNOWLEDGE_EXCEL/MFCO_MASTER_...xlsx` | `.../01_BASELINE/MFCO_MASTER_...xlsx` |
| `MFCO_PHASE1_MASTER_CONSTITUTION_v1.0.docx` | `.docx` | `4214295209d8` | `.../00_BACKUP/01_BASELINE/MFCO_PHASE1_...docx` | `.../01_BASELINE/MFCO_PHASE1_...docx` |
| `MFCO_ROLE_PRIORITY_ENGINE_v1.xlsx` | `.xlsx` | `484a0d901a5e` | `.../00_BACKUP/04_MAPPING_ENGINE/MATRIXS/...` | `.../04_MAPPING_ENGINE/MATRIXS/...` |
| `MFCO_PHASE1_AUDIT_REPORT.xlsx` | `.xlsx` | `08ff1e38b301` | `.../00_BACKUP/06_DOCUMENT/MFCO_PHASE1_...xlsx` | `.../06_DOCUMENT/MFCO_PHASE1_...xlsx` |

---

## 3. Duplicate Classification Patterns

### Pattern A: Backup Archive Replication (백업 이력 중복) - 26 건
- 과거 이력 보존용 `00_BACKUP/` 폴더 내에 마스터 정제 파일이 원본 해시 그대로 복사된 패턴입니다.
- **처리 방침**: Recovery Baseline 원칙에 따라 현 단계에서는 **삭제/이동하지 않으며**, `asset_inventory.json` 내 `is_duplicate: true` 상태로 태깅하여 추적 관리합니다.

### Pattern B: Vendor Package Internal Duplicates (노드 모듈 내부 중복) - 128 건
- `mfco-website/node_modules/` 내부 패키지 간 동일 버전 유틸리티 타입(`.d.ts`) 및 헬퍼 파일이 개별 저장된 패턴입니다.
- **처리 방침**: Phase 05 빌드 최적화 단계에서 `.gitignore` 및 패키지 락 파일 관리 규칙으로 정제 예정입니다.

---

## 4. Phase 05 Clean-up & Deduplication Strategy

1. **Symbolic Soft Linking**: Phase 05 인텔리전스 레이어 구축 시 중복 파일의 실제 물리 저장은 1건만 유지하고 심볼릭 맵으로 연결.
2. **Canonical Asset Designation**: SHA-256이 일치하는 여러 복사본 중 `01_CORE_JSON_DB` 또는 마스터 경로에 위치한 파일을 **대표 자산(Canonical Asset)**으로 지정.
