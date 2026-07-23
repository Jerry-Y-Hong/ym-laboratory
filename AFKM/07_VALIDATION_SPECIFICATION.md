# 07_VALIDATION_SPECIFICATION.md

> **Document Type**: Validation Specification  
> **Phase**: Phase 30 (AI Federated Knowledge Mesh, AFKM)  
> **ADF Governance Version**: ADF v3.1  
> **Repository Release Version**: v3.9.0  
> **Status**: Closed & Frozen  

---

## 1. Automated Verification Script

Phase 30 compliance is strictly enforced by `YM-LAB_RECOVERY/scripts/verify_afkm_status.py`.

### 1.1 Validation Gates
1. **Deliverable Existence**: Asserts presence of `01_AFKM_MASTER_ARCHITECTURE.md` through `10_MASTER_REPORT.md` within the `AFKM/` directory.
2. **Governance Consistency**: Asserts that `ADF v3.1` and `v3.9.0` exist in all file headers.
3. **Traceability**: Asserts cross-references to `PROJECT_STATUS.md` and `AI_CONTEXT.md` are valid.
4. **Structural Integrity**: Asserts that the AFKM folder structure conforms to `08_DIRECTORY_STRUCTURE.md`.

## 2. Global Compliance Check

Upon execution of `verify_project_status.py`, the system must register `Total Phases: 31` (00 to 30) and confirm the `v3.9.0` Repository Release target.

---

**[End of Document]**
