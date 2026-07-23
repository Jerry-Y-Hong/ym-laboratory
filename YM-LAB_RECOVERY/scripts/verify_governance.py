import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
GOV_DIR = os.path.join(ROOT_DIR, 'Implementation', '12_governance')
IMP_DIR = os.path.join(ROOT_DIR, 'Implementation')

print("============================================================")
print("  YM-LAB PROJECT Master Implementation Governance Verification")
print("============================================================")

# 1. 10 Governance Deliverables
required_docs = [
    os.path.join(GOV_DIR, '01_architecture_freeze_policy.md'),
    os.path.join(GOV_DIR, '02_definition_of_done.md'),
    os.path.join(GOV_DIR, '03_traceability_matrix.md'),
    os.path.join(GOV_DIR, '04_code_review_standards.md'),
    os.path.join(GOV_DIR, '05_branching_release_strategy.md'),
    os.path.join(GOV_DIR, '06_security_compliance_policy.md'),
    os.path.join(GOV_DIR, '07_change_management_policy.md'),
    os.path.join(GOV_DIR, '08_quality_assurance_framework.md'),
    os.path.join(GOV_DIR, '09_communication_escalation.md'),
    os.path.join(GOV_DIR, '10_governance_master_report.md'),
]

# 2. Frozen phases (Read-Only check: directories must exist)
frozen_dirs = [
    os.path.join(ROOT_DIR, '200_PROJECT_INTELLIGENCE'),
    os.path.join(ROOT_DIR, '300_KNOWLEDGE_ENGINE'),
    os.path.join(ROOT_DIR, '400_AI_AUTOMATION'),
    os.path.join(ROOT_DIR, 'Phase_08_Blog_Automation'),
    os.path.join(ROOT_DIR, 'Phase_09_Service_Platform'),
    os.path.join(ROOT_DIR, 'Phase_10_Global_Service_Ecosystem'),
]

# 3. Implementation modules (11 modules + master report must still exist)
imp_modules = [
    os.path.join(IMP_DIR, '01_project_setup'),
    os.path.join(IMP_DIR, '02_system_architecture'),
    os.path.join(IMP_DIR, '03_database'),
    os.path.join(IMP_DIR, '04_backend'),
    os.path.join(IMP_DIR, '05_ai_engine'),
    os.path.join(IMP_DIR, '06_api'),
    os.path.join(IMP_DIR, '07_frontend'),
    os.path.join(IMP_DIR, '08_devops'),
    os.path.join(IMP_DIR, '09_testing'),
    os.path.join(IMP_DIR, '10_deployment'),
    os.path.join(IMP_DIR, '11_operations'),
]

results = {
    "1. 12_governance Directory Exists": "PASS",
    "2. 10 Governance Deliverables Exist & Non-Empty": "PASS",
    "3. Governance Domain Coverage (10/10)": "PASS",
    "4. Architecture Freeze Policy Content": "PASS",
    "5. DoD Content (Sprint/Release DoD)": "PASS",
    "6. Traceability Matrix (Phase/Story/ADR)": "PASS",
    "7. Implementation Module Integrity (11 Modules)": "PASS",
    "8. Read-Only Frozen Phase Preservation": "PASS",
    "9. Governance Master Report Completeness": "PASS",
    "10. Final Governance Status Declaration": "PASS",
}

errors = []

# Check 1: 12_governance directory
if not os.path.isdir(GOV_DIR):
    results["1. 12_governance Directory Exists"] = "FAIL"
    errors.append("Missing directory: Implementation/12_governance/")

# Check 2 & 3: 10 governance deliverables exist and are non-empty
found_count = 0
for fpath in required_docs:
    fname = os.path.basename(fpath)
    if not os.path.exists(fpath):
        results["2. 10 Governance Deliverables Exist & Non-Empty"] = "FAIL"
        results["3. Governance Domain Coverage (10/10)"] = "FAIL"
        errors.append(f"Missing governance doc: {fname}")
    else:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if len(content) == 0:
                results["2. 10 Governance Deliverables Exist & Non-Empty"] = "FAIL"
                errors.append(f"Empty governance doc: {fname}")
            else:
                found_count += 1

if found_count < 10:
    results["3. Governance Domain Coverage (10/10)"] = "FAIL"
    errors.append(f"Governance domain coverage: {found_count}/10")

# Check 4: Architecture Freeze Policy content
freeze_doc = os.path.join(GOV_DIR, '01_architecture_freeze_policy.md')
if os.path.exists(freeze_doc):
    with open(freeze_doc, 'r', encoding='utf-8') as f:
        content = f.read()
        if 'HARD FREEZE' not in content or 'SOFT FREEZE' not in content:
            results["4. Architecture Freeze Policy Content"] = "FAIL"
            errors.append("Architecture Freeze Policy missing HARD/SOFT FREEZE classification")
else:
    results["4. Architecture Freeze Policy Content"] = "FAIL"
    errors.append("Architecture Freeze Policy file missing")

# Check 5: DoD content
dod_doc = os.path.join(GOV_DIR, '02_definition_of_done.md')
if os.path.exists(dod_doc):
    with open(dod_doc, 'r', encoding='utf-8') as f:
        content = f.read()
        if 'Sprint Completion' not in content or 'Release DoD' not in content:
            results["5. DoD Content (Sprint/Release DoD)"] = "FAIL"
            errors.append("DoD document missing Sprint or Release completion criteria")
else:
    results["5. DoD Content (Sprint/Release DoD)"] = "FAIL"
    errors.append("DoD file missing")

# Check 6: Traceability matrix content
trace_doc = os.path.join(GOV_DIR, '03_traceability_matrix.md')
if os.path.exists(trace_doc):
    with open(trace_doc, 'r', encoding='utf-8') as f:
        content = f.read()
        if 'Phase' not in content or 'ADR' not in content or 'US-' not in content:
            results["6. Traceability Matrix (Phase/Story/ADR)"] = "FAIL"
            errors.append("Traceability Matrix missing Phase/UserStory/ADR sections")
else:
    results["6. Traceability Matrix (Phase/Story/ADR)"] = "FAIL"
    errors.append("Traceability Matrix file missing")

# Check 7: Implementation modules still intact
for mod_path in imp_modules:
    if not os.path.isdir(mod_path):
        results["7. Implementation Module Integrity (11 Modules)"] = "FAIL"
        errors.append(f"Missing implementation module: {os.path.basename(mod_path)}")

# Check 8: Read-only frozen phases still present
for fdir in frozen_dirs:
    if not os.path.isdir(fdir):
        results["8. Read-Only Frozen Phase Preservation"] = "FAIL"
        errors.append(f"Frozen phase directory missing: {os.path.basename(fdir)}")

# Check 9: Governance master report completeness
master_report = os.path.join(GOV_DIR, '10_governance_master_report.md')
if os.path.exists(master_report):
    with open(master_report, 'r', encoding='utf-8') as f:
        content = f.read()
        if '10 / 10' not in content and '10/10' not in content:
            results["9. Governance Master Report Completeness"] = "FAIL"
            errors.append("Governance Master Report does not confirm 10/10 completion")
else:
    results["9. Governance Master Report Completeness"] = "FAIL"
    errors.append("Governance Master Report file missing")

# Check 10: Final status declaration
if os.path.exists(master_report):
    with open(master_report, 'r', encoding='utf-8') as f:
        content = f.read()
        if 'Ready for Development' not in content:
            results["10. Final Governance Status Declaration"] = "FAIL"
            errors.append("Governance Master Report missing final status declaration")

# Print results
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] YM-LAB Master Implementation Governance : Ready for Development")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
