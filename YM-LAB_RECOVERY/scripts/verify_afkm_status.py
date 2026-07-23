import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
AFKM_DIR = os.path.join(ROOT_DIR, 'AFKM')

print("============================================================")
print("  YM-LAB AFKM Architecture Governance Audit (10/10)")
print("============================================================")

expected_files = [
    "01_AFKM_MASTER_ARCHITECTURE.md",
    "02_MESH_ARCHITECTURE_SPECIFICATION.md",
    "03_FUNCTIONAL_SPECIFICATION.md",
    "04_COMPONENT_ARCHITECTURE.md",
    "05_DATA_INTERFACE_ARCHITECTURE.md",
    "06_GOVERNANCE_SPECIFICATION.md",
    "07_VALIDATION_SPECIFICATION.md",
    "08_DIRECTORY_STRUCTURE.md",
    "09_WALKTHROUGH_GUIDE.md",
    "10_MASTER_REPORT.md"
]

results = {f"Deliverable Existence: {f}": "PASS" for f in expected_files}
results["Governance Consistency"] = "PASS"

errors = []

# 1. Deliverables Check
for f in expected_files:
    filepath = os.path.join(AFKM_DIR, f)
    if not os.path.exists(filepath):
        results[f"Deliverable Existence: {f}"] = "FAIL"
        errors.append(f"Missing file: {f}")
    else:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            # 2. Governance Consistency Check
            if "ADF v3.1" not in content or "v3.9.0" not in content:
                results["Governance Consistency"] = "FAIL"
                errors.append(f"Governance versioning missing or incorrect in {f}")

for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] AFKM Architecture Deliverables Complete")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
