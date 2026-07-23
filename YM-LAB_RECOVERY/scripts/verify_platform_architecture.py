import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
PLAT_DIR = os.path.join(ROOT_DIR, 'Implementation', '13_platform_architecture')

print("============================================================")
print("  YM-LAB PROJECT Platform Architecture Verification Check")
print("============================================================")

# Required deliverables
required_docs = [
    os.path.join(PLAT_DIR, '01_platform_overview.md'),
    os.path.join(PLAT_DIR, '02_shared_service_catalog.md'),
    os.path.join(PLAT_DIR, '03_product_family_architecture.md'),
    os.path.join(PLAT_DIR, '04_platform_boundary.md'),
    os.path.join(PLAT_DIR, '05_api_strategy.md'),
    os.path.join(PLAT_DIR, '06_shared_component_policy.md'),
    os.path.join(PLAT_DIR, '07_frontend_strategy.md'),
    os.path.join(PLAT_DIR, '08_product_isolation.md'),
    os.path.join(PLAT_DIR, '09_platform_governance.md'),
    os.path.join(PLAT_DIR, '10_platform_master_report.md'),
    os.path.join(PLAT_DIR, 'README.md'),
]

# Frozen phase dirs
frozen_dirs = [
    os.path.join(ROOT_DIR, '200_PROJECT_INTELLIGENCE'),
    os.path.join(ROOT_DIR, '300_KNOWLEDGE_ENGINE'),
    os.path.join(ROOT_DIR, '400_AI_AUTOMATION'),
    os.path.join(ROOT_DIR, 'Phase_08_Blog_Automation'),
    os.path.join(ROOT_DIR, 'Phase_09_Service_Platform'),
    os.path.join(ROOT_DIR, 'Phase_10_Global_Service_Ecosystem'),
    os.path.join(ROOT_DIR, 'Implementation', '12_governance'),
]

results = {
    "1. Platform Architecture Document Exists": "PASS",
    "2. Shared Service Catalog Completeness (16 services)": "PASS",
    "3. Product Family Definition (6 products)": "PASS",
    "4. Platform Boundary Clarity": "PASS",
    "5. API Strategy Validation": "PASS",
    "6. Shared Component Policy Validation (8 SDKs)": "PASS",
    "7. Frontend Strategy Validation": "PASS",
    "8. Product Isolation Validation": "PASS",
    "9. Platform Governance Validation": "PASS",
    "10. Master Report Completeness & Final Declaration": "PASS",
}

errors = []

# Check 1: Platform Architecture directory & all docs
if not os.path.isdir(PLAT_DIR):
    results["1. Platform Architecture Document Exists"] = "FAIL"
    errors.append("Missing directory: Implementation/13_platform_architecture/")

found_docs = 0
for fpath in required_docs:
    fname = os.path.basename(fpath)
    if not os.path.exists(fpath):
        results["1. Platform Architecture Document Exists"] = "FAIL"
        errors.append(f"Missing doc: {fname}")
    else:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if len(content) == 0:
                results["1. Platform Architecture Document Exists"] = "FAIL"
                errors.append(f"Empty doc: {fname}")
            else:
                found_docs += 1

# Check 2: Shared Service Catalog - 16 services
svc_catalog = os.path.join(PLAT_DIR, '02_shared_service_catalog.md')
if os.path.exists(svc_catalog):
    with open(svc_catalog, 'r', encoding='utf-8') as f:
        content = f.read()
    service_keywords = [
        'Authentication', 'Authorization', 'User Management', 'AI Engine',
        'Knowledge Engine', 'Semantic Search', 'API Gateway', 'Notification',
        'Logging', 'Monitoring', 'Billing', 'File Storage',
        'Configuration', 'Scheduler', 'Workflow', 'Audit Trail'
    ]
    missing = [kw for kw in service_keywords if kw not in content]
    if missing:
        results["2. Shared Service Catalog Completeness (16 services)"] = "FAIL"
        errors.append(f"Shared Service Catalog missing services: {missing}")
else:
    results["2. Shared Service Catalog Completeness (16 services)"] = "FAIL"
    errors.append("Shared Service Catalog missing")

# Check 3: Product Family - 6 products
prod_doc = os.path.join(PLAT_DIR, '03_product_family_architecture.md')
if os.path.exists(prod_doc):
    with open(prod_doc, 'r', encoding='utf-8') as f:
        content = f.read()
    products = ['blog-saas', 'mfco-saas', 'smartfarm-saas', 'knowledge-saas', 'recipe-ai', 'edu-platform']
    missing = [p for p in products if p not in content]
    if missing:
        results["3. Product Family Definition (6 products)"] = "FAIL"
        errors.append(f"Product family missing: {missing}")
else:
    results["3. Product Family Definition (6 products)"] = "FAIL"
    errors.append("Product Family Architecture doc missing")

# Check 4: Platform Boundary
boundary_doc = os.path.join(PLAT_DIR, '04_platform_boundary.md')
if os.path.exists(boundary_doc):
    with open(boundary_doc, 'r', encoding='utf-8') as f:
        content = f.read()
    boundary_keywords = ['Platform Boundary', 'Product Boundary', 'Shared Library', 'External API']
    missing = [kw for kw in boundary_keywords if kw not in content]
    if missing:
        results["4. Platform Boundary Clarity"] = "FAIL"
        errors.append(f"Platform Boundary doc missing sections: {missing}")
else:
    results["4. Platform Boundary Clarity"] = "FAIL"
    errors.append("Platform Boundary doc missing")

# Check 5: API Strategy
api_doc = os.path.join(PLAT_DIR, '05_api_strategy.md')
if os.path.exists(api_doc):
    with open(api_doc, 'r', encoding='utf-8') as f:
        content = f.read()
    api_keywords = ['REST API', 'AI Service API', 'Internal API', 'Versioning Policy', 'Backward Compatibility']
    missing = [kw for kw in api_keywords if kw not in content]
    if missing:
        results["5. API Strategy Validation"] = "FAIL"
        errors.append(f"API Strategy doc missing: {missing}")
else:
    results["5. API Strategy Validation"] = "FAIL"
    errors.append("API Strategy doc missing")

# Check 6: Shared Component Policy - 8 SDKs
sdk_doc = os.path.join(PLAT_DIR, '06_shared_component_policy.md')
if os.path.exists(sdk_doc):
    with open(sdk_doc, 'r', encoding='utf-8') as f:
        content = f.read()
    sdks = ['design-system', 'ai-sdk', 'api-sdk', 'ui-components', 'utils', 'models', 'config', 'validation']
    missing = [s for s in sdks if s not in content]
    if missing:
        results["6. Shared Component Policy Validation (8 SDKs)"] = "FAIL"
        errors.append(f"Shared Component Policy missing SDKs: {missing}")
else:
    results["6. Shared Component Policy Validation (8 SDKs)"] = "FAIL"
    errors.append("Shared Component Policy doc missing")

# Check 7: Frontend Strategy
fe_doc = os.path.join(PLAT_DIR, '07_frontend_strategy.md')
if os.path.exists(fe_doc):
    with open(fe_doc, 'r', encoding='utf-8') as f:
        content = f.read()
    fe_keywords = ['Design Tokens', 'Accessibility', 'Internationalization', 'Theme Support', 'Responsive']
    missing = [kw for kw in fe_keywords if kw not in content]
    if missing:
        results["7. Frontend Strategy Validation"] = "FAIL"
        errors.append(f"Frontend Strategy missing: {missing}")
else:
    results["7. Frontend Strategy Validation"] = "FAIL"
    errors.append("Frontend Strategy doc missing")

# Check 8: Product Isolation
iso_doc = os.path.join(PLAT_DIR, '08_product_isolation.md')
if os.path.exists(iso_doc):
    with open(iso_doc, 'r', encoding='utf-8') as f:
        content = f.read()
    iso_keywords = ['Namespace', 'Circuit Breaker', 'Data Isolation', 'CI/CD Isolation']
    missing = [kw for kw in iso_keywords if kw not in content]
    if missing:
        results["8. Product Isolation Validation"] = "FAIL"
        errors.append(f"Product Isolation missing: {missing}")
else:
    results["8. Product Isolation Validation"] = "FAIL"
    errors.append("Product Isolation doc missing")

# Check 9: Platform Governance
gov_doc = os.path.join(PLAT_DIR, '09_platform_governance.md')
if os.path.exists(gov_doc):
    with open(gov_doc, 'r', encoding='utf-8') as f:
        content = f.read()
    gov_keywords = ['Version Policy', 'API Governance', 'Security Governance', 'Release Governance', 'Dependency Governance']
    missing = [kw for kw in gov_keywords if kw not in content]
    if missing:
        results["9. Platform Governance Validation"] = "FAIL"
        errors.append(f"Platform Governance missing: {missing}")
else:
    results["9. Platform Governance Validation"] = "FAIL"
    errors.append("Platform Governance doc missing")

# Check 10: Master Report completeness
master_doc = os.path.join(PLAT_DIR, '10_platform_master_report.md')
if os.path.exists(master_doc):
    with open(master_doc, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'Ready for Multi-Product Development' not in content:
        results["10. Master Report Completeness & Final Declaration"] = "FAIL"
        errors.append("Platform Master Report missing final declaration")
    if '10 / 10' not in content and '10/10' not in content:
        results["10. Master Report Completeness & Final Declaration"] = "FAIL"
        errors.append("Platform Master Report does not confirm 10/10 ALL PASS")
else:
    results["10. Master Report Completeness & Final Declaration"] = "FAIL"
    errors.append("Platform Master Report missing")

# Print results
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] YM-LAB Platform Architecture : Ready for Multi-Product Development")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
