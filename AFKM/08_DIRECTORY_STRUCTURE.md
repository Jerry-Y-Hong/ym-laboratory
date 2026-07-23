# 08_DIRECTORY_STRUCTURE.md

> **Document Type**: Directory Structure  
> **Phase**: Phase 30 (AI Federated Knowledge Mesh, AFKM)  
> **ADF Governance Version**: ADF v3.1  
> **Repository Release Version**: v3.9.0  
> **Status**: Closed & Frozen  

---

## 1. AFKM Structural Layout

The Phase 30 AFKM architecture documentation is contained entirely within the `AFKM/` directory to prevent namespace collisions.

```text
YM-LAB_PROJECT_
└── AFKM/
    ├── 01_AFKM_MASTER_ARCHITECTURE.md
    ├── 02_MESH_ARCHITECTURE_SPECIFICATION.md
    ├── 03_FUNCTIONAL_SPECIFICATION.md
    ├── 04_COMPONENT_ARCHITECTURE.md
    ├── 05_DATA_INTERFACE_ARCHITECTURE.md
    ├── 06_GOVERNANCE_SPECIFICATION.md
    ├── 07_VALIDATION_SPECIFICATION.md
    ├── 08_DIRECTORY_STRUCTURE.md
    ├── 09_WALKTHROUGH_GUIDE.md
    └── 10_MASTER_REPORT.md
```

## 2. Directory Governance Rule

- **No Code**: The `AFKM/` directory stores architectural specifications only. No application runtime code is permitted in this specific artifact folder.
- **Immutability**: Following the completion of `10_MASTER_REPORT.md`, this structure is immutable under the Phase Freeze Management Policy.

---

**[End of Document]**
