import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DEV_FW_DIR = os.path.join(ROOT_DIR, 'Implementation', '15_development_framework')

print("============================================================")
print("  YM-LAB PROJECT Development Framework Verification Check")
print("============================================================")

required_docs = [
    os.path.join(DEV_FW_DIR, '01_DEVELOPMENT_STANDARD.md'),
    os.path.join(DEV_FW_DIR, '02_DIRECTORY_STRUCTURE.md'),
    os.path.join(DEV_FW_DIR, '03_NAMING_CONVENTION.md'),
    os.path.join(DEV_FW_DIR, '04_CODING_STANDARD.md'),
    os.path.join(DEV_FW_DIR, '05_CONFIGURATION_GUIDE.md'),
    os.path.join(DEV_FW_DIR, '06_DATABASE_STANDARD.md'),
    os.path.join(DEV_FW_DIR, '07_TESTING_GUIDE.md'),
    os.path.join(DEV_FW_DIR, '08_ERROR_HANDLING_GUIDE.md'),
    os.path.join(DEV_FW_DIR, '09_RELEASE_GUIDE.md'),
    os.path.join(DEV_FW_DIR, '10_DEVELOPMENT_BEST_PRACTICES.md'),
    os.path.join(DEV_FW_DIR, 'README.md'),
]

results = {
    "1. Development Framework Documents Exist": "PASS",
    "2. Core Engineering Principles (01_DEVELOPMENT_STANDARD)": "PASS",
    "3. Repository Structure standards (02_DIRECTORY_STRUCTURE)": "PASS",
    "4. Symbol & DB Naming Conventions (03_NAMING_CONVENTION)": "PASS",
    "5. PEP8 & Type Hinting Guidelines (04_CODING_STANDARD)": "PASS",
    "6. Configuration & Environment Standards (05_CONFIGURATION_GUIDE)": "PASS",
    "7. Database & SQLite/JSON Standards (06_DATABASE_STANDARD)": "PASS",
    "8. Testing & Validation Workflow (07_TESTING_GUIDE)": "PASS",
    "9. Custom Exception & Log Standards (08_ERROR_HANDLING_GUIDE)": "PASS",
    "10. Release Process Consistency (09_RELEASE_GUIDE)": "PASS",
    "11. Best Practices & Final Report (10_DEVELOPMENT_BEST_PRACTICES)": "PASS"
}

errors = []

# Check 1: Existence of all required docs
if not os.path.isdir(DEV_FW_DIR):
    results["1. Development Framework Documents Exist"] = "FAIL"
    errors.append("Development Framework directory missing: Implementation/15_development_framework/")

for path in required_docs:
    fname = os.path.basename(path)
    if not os.path.exists(path):
        results["1. Development Framework Documents Exist"] = "FAIL"
        errors.append(f"Missing deliverable file: {fname}")
    else:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if len(content) == 0:
                results["1. Development Framework Documents Exist"] = "FAIL"
                errors.append(f"Deliverable file is empty: {fname}")

# Check 2: Core Engineering Principles
doc1_path = os.path.join(DEV_FW_DIR, '01_DEVELOPMENT_STANDARD.md')
if os.path.exists(doc1_path):
    with open(doc1_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Integrity", "Simplicity", "Stability", "Traceability", "The operating framework must remain stable"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["2. Core Engineering Principles (01_DEVELOPMENT_STANDARD)"] = "FAIL"
        errors.append(f"01_DEVELOPMENT_STANDARD.md missing core principles: {missing}")

# Check 3: Repository Structure
doc2_path = os.path.join(DEV_FW_DIR, '02_DIRECTORY_STRUCTURE.md')
if os.path.exists(doc2_path):
    with open(doc2_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["100_PLATFORM", "Implementation", "YM-LAB_RECOVERY", "new_domain_module/"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["3. Repository Structure standards (02_DIRECTORY_STRUCTURE)"] = "FAIL"
        errors.append(f"02_DIRECTORY_STRUCTURE.md missing structure tags: {missing}")

# Check 4: Naming Conventions
doc3_path = os.path.join(DEV_FW_DIR, '03_NAMING_CONVENTION.md')
if os.path.exists(doc3_path):
    with open(doc3_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["PascalCase", "snake_case", "Q_", "catalog.db"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["4. Symbol & DB Naming Conventions (03_NAMING_CONVENTION)"] = "FAIL"
        errors.append(f"03_NAMING_CONVENTION.md missing convention tags: {missing}")

# Check 5: PEP8 & Type Hinting
doc4_path = os.path.join(DEV_FW_DIR, '04_CODING_STANDARD.md')
if os.path.exists(doc4_path):
    with open(doc4_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["PEP8", "Docstring", "Type Hinting", "dataclass"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["5. PEP8 & Type Hinting Guidelines (04_CODING_STANDARD)"] = "FAIL"
        errors.append(f"04_CODING_STANDARD.md missing coding standard tags: {missing}")

# Check 6: Configuration
doc5_path = os.path.join(DEV_FW_DIR, '05_CONFIGURATION_GUIDE.md')
if os.path.exists(doc5_path):
    with open(doc5_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Configuration", "Settings", "ENV", "DATABASE_PATH"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["6. Configuration & Environment Standards (05_CONFIGURATION_GUIDE)"] = "FAIL"
        errors.append(f"05_CONFIGURATION_GUIDE.md missing configuration tags: {missing}")

# Check 7: Database
doc6_path = os.path.join(DEV_FW_DIR, '06_DATABASE_STANDARD.md')
if os.path.exists(doc6_path):
    with open(doc6_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["SQLite", "timeout", "index.json", "Auto-Commit"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["7. Database & SQLite/JSON Standards (06_DATABASE_STANDARD)"] = "FAIL"
        errors.append(f"06_DATABASE_STANDARD.md missing database standard terms: {missing}")

# Check 8: Testing
doc7_path = os.path.join(DEV_FW_DIR, '07_TESTING_GUIDE.md')
if os.path.exists(doc7_path):
    with open(doc7_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Unit Test", "Integration Test", "Verification Script"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["8. Testing & Validation Workflow (07_TESTING_GUIDE)"] = "FAIL"
        errors.append(f"07_TESTING_GUIDE.md missing testing guide terms: {missing}")

# Check 9: Error Handling
doc8_path = os.path.join(DEV_FW_DIR, '08_ERROR_HANDLING_GUIDE.md')
if os.path.exists(doc8_path):
    with open(doc8_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Exception", "YMLabException", "Fallback", "Python Logging Standard"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["9. Custom Exception & Log Standards (08_ERROR_HANDLING_GUIDE)"] = "FAIL"
        errors.append(f"08_ERROR_HANDLING_GUIDE.md missing exception/logging terms: {missing}")

# Check 10: Release Process
doc9_path = os.path.join(DEV_FW_DIR, '09_RELEASE_GUIDE.md')
if os.path.exists(doc9_path):
    with open(doc9_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["v[MAJOR].[MINOR].[PATCH]", "PROJECT_STATUS.md", "walkthrough.md", "tag"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["10. Release Process Consistency (09_RELEASE_GUIDE)"] = "FAIL"
        errors.append(f"09_RELEASE_GUIDE.md missing release guide terms: {missing}")

# Check 11: Best Practices & Report
doc10_path = os.path.join(DEV_FW_DIR, '10_DEVELOPMENT_BEST_PRACTICES.md')
if os.path.exists(doc10_path):
    with open(doc10_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Circular Dependency", "Resource Leak", "Final Report", "Deliverables Summary", "Self Review"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["11. Best Practices & Final Report (10_DEVELOPMENT_BEST_PRACTICES)"] = "FAIL"
        errors.append(f"10_DEVELOPMENT_BEST_PRACTICES.md missing best practices or final report sections: {missing}")

# Print check list
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] YM-LAB Development Framework : Closed & Frozen")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
