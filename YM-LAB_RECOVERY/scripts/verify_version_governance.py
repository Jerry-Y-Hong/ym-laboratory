import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
STATUS_FILE = os.path.join(ROOT_DIR, 'PROJECT_STATUS.md')
VERSION_HISTORY = os.path.join(ROOT_DIR, 'YM-LAB_RECOVERY', 'ADF_VERSION_HISTORY.md')
GOV_POLICY = os.path.join(ROOT_DIR, 'YM-LAB_RECOVERY', '01_VERSION_GOVERNANCE_POLICY.md')
MASTER_REPORT_REVIEW = os.path.join(ROOT_DIR, 'YM-LAB_RECOVERY', '04_MASTER_REPORT_REVIEW.md')
AI_CONTEXT = os.path.join(ROOT_DIR, 'YM-LAB_RECOVERY', 'intelligence', 'AI_CONTEXT.md')

print("============================================================")
print("  YM-LAB Version Governance Standardization Validation")
print("============================================================")

results = {
    "1. Version Consistency Validation": "PASS",
    "2. SSOT Validation": "PASS",
    "3. Cross-Reference Validation": "PASS",
    "4. Governance Validation": "PASS",
    "5. Repository Release Validation": "PASS"
}

errors = []

def check_file_contains(filepath, content_list, test_name):
    if not os.path.exists(filepath):
        results[test_name] = "FAIL"
        errors.append(f"{os.path.basename(filepath)} missing.")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    for item in content_list:
        if item not in content:
            results[test_name] = "FAIL"
            errors.append(f"Missing '{item}' in {os.path.basename(filepath)}")

# 1. Version Consistency Validation
check_file_contains(STATUS_FILE, ["ADF Governance Version : ADF v3.1", "Repository Release Version : v3.9.0"], "1. Version Consistency Validation")
check_file_contains(VERSION_HISTORY, ["ADF Governance Version", "Repository Release Version"], "1. Version Consistency Validation")

# 2. SSOT Validation
check_file_contains(GOV_POLICY, ["The Four-Tier Version Hierarchy", "ADF Governance Version", "Repository Release Version"], "2. SSOT Validation")

# 3. Cross-Reference Validation
check_file_contains(AI_CONTEXT, ["01_VERSION_GOVERNANCE_POLICY.md"], "3. Cross-Reference Validation")
check_file_contains(STATUS_FILE, ["01_VERSION_GOVERNANCE_POLICY.md"], "3. Cross-Reference Validation")

# 4. Governance Validation
check_file_contains(MASTER_REPORT_REVIEW, ["ADF v3.1", "Phase 29", "PASS"], "4. Governance Validation")

# 5. Repository Release Validation
# Check if PROJECT_STATUS.md defines repo release v3.9.0
check_file_contains(STATUS_FILE, ['"repository_release_version": "v3.9.0"'], "5. Repository Release Validation")

for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] ADF Governance Version Standardization Completed")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
