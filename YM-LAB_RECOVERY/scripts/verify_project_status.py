import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
STATUS_FILE = os.path.join(ROOT_DIR, 'PROJECT_STATUS.md')
AI_CONTEXT_FILE = os.path.join(ROOT_DIR, 'YM-LAB_RECOVERY', 'intelligence', 'AI_CONTEXT.md')
KNOWLEDGE_INDEX_FILE = os.path.join(ROOT_DIR, 'YM-LAB_RECOVERY', 'intelligence', 'KNOWLEDGE_INDEX.md')
ADF_VERSION_FILE = os.path.join(ROOT_DIR, 'YM-LAB_RECOVERY', 'ADF_VERSION_HISTORY.md')
FREEZE_POLICY_FILE = os.path.join(ROOT_DIR, 'YM-LAB_RECOVERY', 'PHASE_FREEZE_MANAGEMENT_POLICY.md')
VERSION_POLICY_FILE = os.path.join(ROOT_DIR, 'YM-LAB_RECOVERY', '01_VERSION_GOVERNANCE_POLICY.md')

print("============================================================")
print("  YM-LAB PROJECT_STATUS.md Master Governance Audit (12/12)")
print("============================================================")

results = {
    "1. Document Classification Validation": "PASS",
    "2. Governance Validation": "PASS",
    "3. SSOT Validation": "PASS",
    "4. Authority Validation": "PASS",
    "5. Update Policy Validation": "PASS",
    "6. Cross Reference Validation": "PASS",
    "7. Repository Statistics Validation": "PASS",
    "8. Version Governance Validation": "PASS",
    "9. Traceability Validation": "PASS",
    "10. Documentation Consistency Validation": "PASS",
    "11. Automation Metadata Validation": "PASS",
    "12. Architecture Governance Compliance": "PASS"
}

errors = []

if not os.path.exists(STATUS_FILE):
    print("FATAL: PROJECT_STATUS.md missing!")
    sys.exit(1)

with open(STATUS_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Document Classification
class_keywords = ["Document Type", "Master Status Registry", "Document Class", "Authority Level", "SSOT Status"]
missing = [k for k in class_keywords if k not in content]
if missing:
    results["1. Document Classification Validation"] = "FAIL"
    errors.append(f"Document Classification missing keywords: {missing}")

# 2. Governance Validation
gov_keywords = ["1. Document Governance", "Document Purpose", "Update Responsibility", "Approval Rule", "Lifecycle Policy"]
missing = [k for k in gov_keywords if k not in content]
if missing:
    results["2. Governance Validation"] = "FAIL"
    errors.append(f"Governance section missing keywords: {missing}")

# 3. SSOT Validation
ssot_keywords = ["2. SSOT Governance Rules", "Master Authority Principle", "Conflict Resolution Hierarchy", "Freeze Prerequisite Rule"]
missing = [k for k in ssot_keywords if k not in content]
if missing:
    results["3. SSOT Validation"] = "FAIL"
    errors.append(f"SSOT Governance missing keywords: {missing}")

# 4. Authority Validation
if "Highest (Single Source of Truth)" not in content or "Architecture Governance Authority : Highest" not in content:
    results["4. Authority Validation"] = "FAIL"
    errors.append("Authority level Highest declaration missing")

# 5. Update Policy Validation
update_keywords = ["3. Update Policy", "Update Triggers", "Synchronization Requirements", "AI_CONTEXT.md"]
missing = [k for k in update_keywords if k not in content]
if missing:
    results["5. Update Policy Validation"] = "FAIL"
    errors.append(f"Update Policy missing keywords: {missing}")

# 6. Cross Reference Validation
ref_files = [AI_CONTEXT_FILE, KNOWLEDGE_INDEX_FILE, ADF_VERSION_FILE, FREEZE_POLICY_FILE, VERSION_POLICY_FILE]
for rf in ref_files:
    fname = os.path.basename(rf)
    if not os.path.exists(rf):
        results["6. Cross Reference Validation"] = "FAIL"
        errors.append(f"Cross-referenced target file missing: {fname}")
    if fname not in content:
        results["6. Cross Reference Validation"] = "FAIL"
        errors.append(f"Link to cross-referenced file missing in PROJECT_STATUS.md: {fname}")

# 7. Repository Statistics Validation
stat_keywords = ["3,524", "401", "1,121", "12,652", "687", "100%"]
missing = [k for k in stat_keywords if k not in content]
if missing:
    results["7. Repository Statistics Validation"] = "FAIL"
    errors.append(f"Exact statistics missing: {missing}")

# 8. Version Governance Validation
version_keywords = ["Version Governance", "SemVer Standard", "v3.9.0", "ADF Governance Version : ADF v3.1", "Repository Release Version : v3.9.0"]
missing = [k for k in version_keywords if k not in content]
if missing:
    results["8. Version Governance Validation"] = "FAIL"
    errors.append(f"Version Governance missing keywords: {missing}")

# 9. Traceability Validation
trace_keywords = ["Foundation Layer", "Platform Layer", "Enterprise AI Layer", "Design System Layer", "Application Framework Layer"]
missing = [k for k in trace_keywords if k not in content]
if missing:
    results["9. Traceability Validation"] = "FAIL"
    errors.append(f"Architectural layering roadmap missing: {missing}")

# 10. Documentation Consistency Validation
if "Phase 00" not in content or "Phase 30" not in content:
    results["10. Documentation Consistency Validation"] = "FAIL"
    errors.append("Full phase sequence Phase 00..30 not intact")

# 11. Automation Metadata Validation
auto_keywords = ["generated_by", "verification_tool", "last_validation", "validation_status", "adf_governance_version", "repository_release_version"]
missing = [k for k in auto_keywords if k not in content]
if missing:
    results["11. Automation Metadata Validation"] = "FAIL"
    errors.append(f"Automation metadata missing: {missing}")

# 12. Architecture Governance Compliance
if "End of Master Status Registry" not in content or "Status : Updated, Verified & Governed" not in content:
    results["12. Architecture Governance Compliance"] = "FAIL"
    errors.append("Governance Footer declaration missing")

# Print verification results
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL 12 CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] PROJECT_STATUS.md SSOT Master Governance Audit Complete")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
