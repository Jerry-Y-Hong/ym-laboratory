import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
SYS_DIR = os.path.join(ROOT_DIR, 'Implementation', '18_ai_product_factory')

print("============================================================")
print("  YM-LAB PROJECT AI Product Factory Verification Check")
print("============================================================")

required_docs = [
    os.path.join(SYS_DIR, '01_PRODUCT_FACTORY_ARCHITECTURE.md'),
    os.path.join(SYS_DIR, '02_PRODUCT_BLUEPRINT_SPECIFICATION.md'),
    os.path.join(SYS_DIR, '03_PRODUCT_TEMPLATE_SPECIFICATION.md'),
    os.path.join(SYS_DIR, '04_PRODUCT_MODULE_REGISTRY.md'),
    os.path.join(SYS_DIR, '05_CONFIGURATION_SPECIFICATION.md'),
    os.path.join(SYS_DIR, '06_GENERATION_WORKFLOW.md'),
    os.path.join(SYS_DIR, '07_PACKAGING_SPECIFICATION.md'),
    os.path.join(SYS_DIR, '08_DEPLOYMENT_GUIDE.md'),
    os.path.join(SYS_DIR, '09_VERSION_MANAGEMENT_SPECIFICATION.md'),
    os.path.join(SYS_DIR, '10_LIFECYCLE_MANAGEMENT_GUIDE.md'),
    os.path.join(SYS_DIR, '11_VALIDATION_REPORT.md'),
    os.path.join(SYS_DIR, '12_SELF_REVIEW_REPORT.md'),
    os.path.join(SYS_DIR, '13_FINAL_COMPLETION_REPORT.md'),
    os.path.join(SYS_DIR, 'README.md'),
]

results = {
    "1. Product Factory Documents Exist": "PASS",
    "2. Factory Architecture (01_PRODUCT_FACTORY_ARCHITECTURE)": "PASS",
    "3. Blueprint Specification (02_PRODUCT_BLUEPRINT_SPECIFICATION)": "PASS",
    "4. Template Spec (03_PRODUCT_TEMPLATE_SPECIFICATION)": "PASS",
    "5. Module Registry (04_PRODUCT_MODULE_REGISTRY)": "PASS",
    "6. Configuration Spec (05_CONFIGURATION_SPECIFICATION)": "PASS",
    "7. Generation Workflow (06_GENERATION_WORKFLOW)": "PASS",
    "8. Packaging Spec (07_PACKAGING_SPECIFICATION)": "PASS",
    "9. Deployment Guide (08_DEPLOYMENT_GUIDE)": "PASS",
    "10. Version Management Spec (09_VERSION_MANAGEMENT_SPECIFICATION)": "PASS",
    "11. Lifecycle Management Guide (10_LIFECYCLE_MANAGEMENT_GUIDE)": "PASS",
    "12. Validation Report Spec (11_VALIDATION_REPORT)": "PASS",
    "13. Self Review Checklists (12_SELF_REVIEW_REPORT)": "PASS",
    "14. Final Completion Report (13_FINAL_COMPLETION_REPORT)": "PASS"
}

errors = []

# Check 1: Existence of all required docs
if not os.path.isdir(SYS_DIR):
    results["1. Product Factory Documents Exist"] = "FAIL"
    errors.append("Product Factory directory missing: Implementation/18_ai_product_factory/")

for path in required_docs:
    fname = os.path.basename(path)
    if not os.path.exists(path):
        results["1. Product Factory Documents Exist"] = "FAIL"
        errors.append(f"Missing deliverable file: {fname}")
    else:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if len(content) == 0:
                results["1. Product Factory Documents Exist"] = "FAIL"
                errors.append(f"Deliverable file is empty: {fname}")

# Check 2: Factory Architecture
doc_path = os.path.join(SYS_DIR, '01_PRODUCT_FACTORY_ARCHITECTURE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Blueprint", "Product Template", "Common Modules", "Product Packaging", "The operating framework must remain stable"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["2. Factory Architecture (01_PRODUCT_FACTORY_ARCHITECTURE)"] = "FAIL"
        errors.append(f"01_PRODUCT_FACTORY_ARCHITECTURE.md missing keywords: {missing}")

# Check 3: Blueprint Spec
doc_path = os.path.join(SYS_DIR, '02_PRODUCT_BLUEPRINT_SPECIFICATION.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["BP_KIMCHI_BLOG_SAAS", "blueprint_id", "dependencies"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["3. Blueprint Specification (02_PRODUCT_BLUEPRINT_SPECIFICATION)"] = "FAIL"
        errors.append(f"02_PRODUCT_BLUEPRINT_SPECIFICATION.md missing keywords: {missing}")

# Check 4: Template Spec
doc_path = os.path.join(SYS_DIR, '03_PRODUCT_TEMPLATE_SPECIFICATION.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["product_template/", "03_content_pipeline/", "verify_product.py", ".gitignore"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["4. Template Spec (03_PRODUCT_TEMPLATE_SPECIFICATION)"] = "FAIL"
        errors.append(f"03_PRODUCT_TEMPLATE_SPECIFICATION.md missing keywords: {missing}")

# Check 5: Module Registry
doc_path = os.path.join(SYS_DIR, '04_PRODUCT_MODULE_REGISTRY.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["MOD_110_API", "MOD_120_DB", "registry.json", "version_spec"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["5. Module Registry (04_PRODUCT_MODULE_REGISTRY)"] = "FAIL"
        errors.append(f"04_PRODUCT_MODULE_REGISTRY.md missing keywords: {missing}")

# Check 6: Configuration Spec
doc_path = os.path.join(SYS_DIR, '05_CONFIGURATION_SPECIFICATION.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["posts_directory", "failed_directory", "PROD_KIMCHI_BLOG_SAAS", "database"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["6. Configuration Spec (05_CONFIGURATION_SPECIFICATION)"] = "FAIL"
        errors.append(f"05_CONFIGURATION_SPECIFICATION.md missing keywords: {missing}")

# Check 7: Generation Workflow
doc_path = os.path.join(SYS_DIR, '06_GENERATION_WORKFLOW.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Blueprint Loader", "Template Copier", "Dependency Linker", "Code Assembler"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["7. Generation Workflow (06_GENERATION_WORKFLOW)"] = "FAIL"
        errors.append(f"06_GENERATION_WORKFLOW.md missing keywords: {missing}")

# Check 8: Packaging Spec
doc_path = os.path.join(SYS_DIR, '07_PACKAGING_SPECIFICATION.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["zip", "sha256_hash", "ready_to_publish/"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["8. Packaging Spec (07_PACKAGING_SPECIFICATION)"] = "FAIL"
        errors.append(f"07_PACKAGING_SPECIFICATION.md missing keywords: {missing}")

# Check 9: Deployment Guide
doc_path = os.path.join(SYS_DIR, '08_DEPLOYMENT_GUIDE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["ready_to_publish/", "config.json", "verify_product.py", "catalog.db"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["9. Deployment Guide (08_DEPLOYMENT_GUIDE)"] = "FAIL"
        errors.append(f"08_DEPLOYMENT_GUIDE.md missing keywords: {missing}")

# Check 10: Version Management Spec
doc_path = os.path.join(SYS_DIR, '09_VERSION_MANAGEMENT_SPECIFICATION.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["v[MAJOR].[MINOR].[PATCH]", "release-", "tag"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["10. Version Management Spec (09_VERSION_MANAGEMENT_SPECIFICATION)"] = "FAIL"
        errors.append(f"09_VERSION_MANAGEMENT_SPECIFICATION.md missing keywords: {missing}")

# Check 11: Lifecycle Management Guide
doc_path = os.path.join(SYS_DIR, '10_LIFECYCLE_MANAGEMENT_GUIDE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Incubating", "Active", "Archived", "Decommissioned"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["11. Lifecycle Management Guide (10_LIFECYCLE_MANAGEMENT_GUIDE)"] = "FAIL"
        errors.append(f"10_LIFECYCLE_MANAGEMENT_GUIDE.md missing keywords: {missing}")

# Check 12: Validation Report Spec
doc_path = os.path.join(SYS_DIR, '11_VALIDATION_REPORT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["verify_product.py", "pass_rate", "final_status"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["12. Validation Report Spec (11_VALIDATION_REPORT)"] = "FAIL"
        errors.append(f"11_VALIDATION_REPORT.md missing keywords: {missing}")

# Check 13: Self Review Report
doc_path = os.path.join(SYS_DIR, '12_SELF_REVIEW_REPORT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Architecture & Design Consistency", "Development Framework Compliance"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["13. Self Review Checklists (12_SELF_REVIEW_REPORT)"] = "FAIL"
        errors.append(f"12_SELF_REVIEW_REPORT.md missing keywords: {missing}")

# Check 14: Final Completion Report
doc_path = os.path.join(SYS_DIR, '13_FINAL_COMPLETION_REPORT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Final Completion Report", "Deliverables List", "SELF_REVIEW_REPORT.md", "Next-Phase Recommendations", "11_VALIDATION_REPORT.md"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["14. Final Completion Report (13_FINAL_COMPLETION_REPORT)"] = "FAIL"
        errors.append(f"13_FINAL_COMPLETION_REPORT.md missing keywords: {missing}")

# Print check list
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] YM-LAB AI Product Factory : Closed & Frozen")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
