# YM-LAB Version Governance Policy

> **Document Type**: Architecture Governance Standard  
> **Authority Level**: Highest (SSOT for Versioning)  
> **Document Owner**: Architecture Governance Board (AGB)  
> **Framework Standard**: ADF v3.1  
> **Status**: Active & Mandatory  

---

## 1. Executive Summary

This document establishes the **Version Governance Policy** for the YM-LAB Enterprise Ecosystem. It is the Single Source of Truth (SSOT) designed to eliminate ambiguity between governance frameworks, repository states, phase boundaries, and document revisions.

This policy mandates a strict four-tier version hierarchy that must be applied consistently across all ecosystem artifacts.

---

## 2. The Four-Tier Version Hierarchy

### Tier 1: ADF Governance Version (The Framework Standard)
- **Definition**: The authoritative architectural governance framework, freeze management rules, and quality gates standard.
- **Current Value**: **ADF v3.1**
- **Authority**: Architecture Governance Board (AGB)
- **Usage**: Used to declare compliance. "This deliverable was produced and validated under ADF v3.1 Governance."
- **Rule**: Does *not* increment with phase completions. It remains constant across the ecosystem until a formal, major overhaul of the entire governance methodology (e.g., to ADF v4.0).

### Tier 2: Repository Release Version (The Milestone Tracking)
- **Definition**: The Semantic Version (SemVer) milestone tracking the collective progress, phase integrations, and release state of the YM-LAB repository.
- **Current Value**: **v3.8.0**
- **Authority**: Architecture Governance Board (AGB) & Release Management
- **Usage**: Used in `PROJECT_STATUS.md` and release tracking. Increments upon the successful completion and freeze of a new project phase (e.g., Phase 29 completion incremented the repository to `v3.8.0`).
- **Rule**: Managed independently from the ADF Governance Version. Never use Repository Release Version as a substitute for Governance Version.

### Tier 3: Phase Version (The Deliverable Scope)
- **Definition**: Identifies the specific architectural phase and its enclosed baseline scope.
- **Current Value**: **Phase 00** through **Phase 29**
- **Authority**: Phase Lead Architect
- **Usage**: Used to isolate boundaries of work (e.g., "Phase 29 AAF Deliverables").
- **Rule**: Phase references must be explicit and mapped sequentially. They define what was built, not the governance standard applied.

### Tier 4: Document Version (The File Revision)
- **Definition**: The internal revision number of a single architectural document or specification file.
- **Current Value**: Varies (e.g., `v1.0.0`, `v1.1`)
- **Authority**: Document Author / Lead Architect
- **Usage**: Tracks minor updates, spelling corrections, or draft iterations prior to phase freeze.
- **Rule**: Document versions are strictly file-local. They must NEVER be presented as the Governance or Repository Version.

---

## 3. Strict Execution Policies & Anti-Patterns

### 3.1 Immutable Declarations
1. **Single Governance Standard**: All master reports, governance registries, and verification scripts MUST enforce `ADF v3.1` as the sole Governance Version for Phases 00 through 29.
2. **Independent Repository Tracking**: The `PROJECT_STATUS.md` file MUST track the Repository Release Version using strict SemVer, independent of the Governance Version.

### 3.2 Anti-Patterns (STRICTLY PROHIBITED)
- ❌ **Conflation**: Mixing ADF Governance Version with Repository Release Version (e.g., writing "ADF v3.7" when referring to Repository Release `v3.7.0` under `ADF v3.1` Governance).
- ❌ **Substitution**: Using a Document Version (e.g., `v1.0.0`) in place of the Repository Release Version in ecosystem-wide status reports.
- ❌ **Ambiguity**: Emitting status reports without clearly demarcating the difference between "Architecture Standard: ADF v3.1" and "Repository Version: v3.8.0".

---

## 4. Cross-Reference & Traceability

This policy is synchronized with and strictly enforced across:
1. `PROJECT_STATUS.md`
2. `YM-LAB_RECOVERY/ADF_VERSION_HISTORY.md`
3. `YM-LAB_RECOVERY/PHASE_FREEZE_MANAGEMENT_POLICY.md`
4. All `10_MASTER_REPORT.md` (or equivalent) Phase Certification reports.

---

## 5. Certification

This Version Governance Policy is hereby ratified and actively enforced across the YM-LAB Enterprise Ecosystem. 

**Status: Standardized & Enforced**
