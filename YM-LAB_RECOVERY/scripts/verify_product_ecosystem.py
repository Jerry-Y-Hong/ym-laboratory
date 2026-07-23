import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
SYS_DIR = os.path.join(ROOT_DIR, 'Implementation', '19_ai_product_ecosystem')

print("============================================================")
print("  YM-LAB PROJECT AI Product Ecosystem Verification Check")
print("============================================================")

required_docs = [
    os.path.join(SYS_DIR, '01_ECOSYSTEM_ARCHITECTURE.md'),
    os.path.join(SYS_DIR, '02_PRODUCT_REGISTRY.md'),
    os.path.join(SYS_DIR, '03_DISTRIBUTION_PORTAL.md'),
    os.path.join(SYS_DIR, '04_MARKETPLACE.md'),
    os.path.join(SYS_DIR, '05_LICENSING_MANAGEMENT.md'),
    os.path.join(SYS_DIR, '06_CUSTOMER_MANAGEMENT.md'),
    os.path.join(SYS_DIR, '07_SUBSCRIPTION_BILLING.md'),
    os.path.join(SYS_DIR, '08_DEPLOYMENT_CONTAINER.md'),
    os.path.join(SYS_DIR, '09_GATEWAY_INTEGRATION.md'),
    os.path.join(SYS_DIR, '10_MONITORING_DASHBOARD.md'),
    os.path.join(SYS_DIR, '11_MAINTENANCE_LOGISTICS.md'),
    os.path.join(SYS_DIR, '12_PRODUCT_LIFECYCLE.md'),
    os.path.join(SYS_DIR, '13_VERSION_GOVERNANCE.md'),
    os.path.join(SYS_DIR, '14_EVOLUTION_STRATEGY.md'),
    os.path.join(SYS_DIR, '15_ECOSYSTEM_API.md'),
    os.path.join(SYS_DIR, '16_VALIDATION_REPORT.md'),
    os.path.join(SYS_DIR, '17_SELF_REVIEW_REPORT.md'),
    os.path.join(SYS_DIR, '18_FINAL_COMPLETION_REPORT.md'),
    os.path.join(SYS_DIR, 'README.md'),
]

results = {
    "1. Ecosystem Documents Exist": "PASS",
    "2. Ecosystem Architecture (01_ECOSYSTEM_ARCHITECTURE)": "PASS",
    "3. Product Registry (02_PRODUCT_REGISTRY)": "PASS",
    "4. Distribution Portal (03_DISTRIBUTION_PORTAL)": "PASS",
    "5. Marketplace Spec (04_MARKETPLACE)": "PASS",
    "6. Licensing Management (05_LICENSING_MANAGEMENT)": "PASS",
    "7. Customer Management (06_CUSTOMER_MANAGEMENT)": "PASS",
    "8. Subscription Billing (07_SUBSCRIPTION_BILLING)": "PASS",
    "9. Deployment Container (08_DEPLOYMENT_CONTAINER)": "PASS",
    "10. Gateway Integration (09_GATEWAY_INTEGRATION)": "PASS",
    "11. Monitoring Dashboard (10_MONITORING_DASHBOARD)": "PASS",
    "12. Maintenance Logistics (11_MAINTENANCE_LOGISTICS)": "PASS",
    "13. Product Lifecycle (12_PRODUCT_LIFECYCLE)": "PASS",
    "14. Version Governance (13_VERSION_GOVERNANCE)": "PASS",
    "15. Evolution Strategy (14_EVOLUTION_STRATEGY)": "PASS",
    "16. Ecosystem API Spec (15_ECOSYSTEM_API)": "PASS",
    "17. Validation Report Spec (16_VALIDATION_REPORT)": "PASS",
    "18. Self Review Checklists (17_SELF_REVIEW_REPORT)": "PASS",
    "19. Final Completion Report (18_FINAL_COMPLETION_REPORT)": "PASS"
}

errors = []

# Check 1: Existence of all required docs
if not os.path.isdir(SYS_DIR):
    results["1. Ecosystem Documents Exist"] = "FAIL"
    errors.append("Product Ecosystem directory missing: Implementation/19_ai_product_ecosystem/")

for path in required_docs:
    fname = os.path.basename(path)
    if not os.path.exists(path):
        results["1. Ecosystem Documents Exist"] = "FAIL"
        errors.append(f"Missing deliverable file: {fname}")
    else:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if len(content) == 0:
                results["1. Ecosystem Documents Exist"] = "FAIL"
                errors.append(f"Deliverable file is empty: {fname}")

# Check 2: Ecosystem Architecture
doc_path = os.path.join(SYS_DIR, '01_ECOSYSTEM_ARCHITECTURE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Registry", "Ecosystem Architecture", "Licensing", "Gateway", "The operating framework must remain stable"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["2. Ecosystem Architecture (01_ECOSYSTEM_ARCHITECTURE)"] = "FAIL"
        errors.append(f"01_ECOSYSTEM_ARCHITECTURE.md missing keywords: {missing}")

# Check 3: Product Registry
doc_path = os.path.join(SYS_DIR, '02_PRODUCT_REGISTRY.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["PROD_KIMCHI_BLOG_SAAS", "archive_metadata", "sha256"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["3. Product Registry (02_PRODUCT_REGISTRY)"] = "FAIL"
        errors.append(f"02_PRODUCT_REGISTRY.md missing keywords: {missing}")

# Check 4: Distribution Portal
doc_path = os.path.join(SYS_DIR, '03_DISTRIBUTION_PORTAL.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["signed_download_url", "license_key", "expires_at"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["4. Distribution Portal (03_DISTRIBUTION_PORTAL)"] = "FAIL"
        errors.append(f"03_DISTRIBUTION_PORTAL.md missing keywords: {missing}")

# Check 5: Marketplace Spec
doc_path = os.path.join(SYS_DIR, '04_MARKETPLACE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["CAT_KIMCHI_BLOG_SAAS", "pricing_models", "subscription"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["5. Marketplace Spec (04_MARKETPLACE)"] = "FAIL"
        errors.append(f"04_MARKETPLACE.md missing keywords: {missing}")

# Check 6: Licensing Management
doc_path = os.path.join(SYS_DIR, '05_LICENSING_MANAGEMENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["LIC_KIMCHI_", "partner_id", "expires_at"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["6. Licensing Management (05_LICENSING_MANAGEMENT)"] = "FAIL"
        errors.append(f"05_LICENSING_MANAGEMENT.md missing keywords: {missing}")

# Check 7: Customer Management
doc_path = os.path.join(SYS_DIR, '06_CUSTOMER_MANAGEMENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["PARTNER_YMLAB_ENTERPRISE", "rbac_role", "audit_trail"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["7. Customer Management (06_CUSTOMER_MANAGEMENT)"] = "FAIL"
        errors.append(f"06_CUSTOMER_MANAGEMENT.md missing keywords: {missing}")

# Check 8: Subscription Billing
doc_path = os.path.join(SYS_DIR, '07_SUBSCRIPTION_BILLING.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["BIL_20260722_", "quota_usage", "invoice_amount_krw"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["8. Subscription Billing (07_SUBSCRIPTION_BILLING)"] = "FAIL"
        errors.append(f"07_SUBSCRIPTION_BILLING.md missing keywords: {missing}")

# Check 9: Deployment Container
doc_path = os.path.join(SYS_DIR, '08_DEPLOYMENT_CONTAINER.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["staging", "platform_libs", "run.py", "verify_product"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["9. Deployment Container (08_DEPLOYMENT_CONTAINER)"] = "FAIL"
        errors.append(f"08_DEPLOYMENT_CONTAINER.md missing keywords: {missing}")

# Check 10: Gateway Integration
doc_path = os.path.join(SYS_DIR, '09_GATEWAY_INTEGRATION.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["rate_limit_rpm", "cors_origins", "target_container_path"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["10. Gateway Integration (09_GATEWAY_INTEGRATION)"] = "FAIL"
        errors.append(f"09_GATEWAY_INTEGRATION.md missing keywords: {missing}")

# Check 11: Monitoring Dashboard
doc_path = os.path.join(SYS_DIR, '10_MONITORING_DASHBOARD.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["dashboard_run_summary", "active_products_count", "average_latency_seconds"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["11. Monitoring Dashboard (10_MONITORING_DASHBOARD)"] = "FAIL"
        errors.append(f"10_MONITORING_DASHBOARD.md missing keywords: {missing}")

# Check 12: Maintenance Logistics
doc_path = os.path.join(SYS_DIR, '11_MAINTENANCE_LOGISTICS.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["daily_backup", "DRP", "backup_archive_path"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["12. Maintenance Logistics (11_MAINTENANCE_LOGISTICS)"] = "FAIL"
        errors.append(f"11_MAINTENANCE_LOGISTICS.md missing keywords: {missing}")

# Check 13: Product Lifecycle
doc_path = os.path.join(SYS_DIR, '12_PRODUCT_LIFECYCLE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["STAGING", "PRODUCTION", "DEPRECATED", "RETIRED"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["13. Product Lifecycle (12_PRODUCT_LIFECYCLE)"] = "FAIL"
        errors.append(f"12_PRODUCT_LIFECYCLE.md missing keywords: {missing}")

# Check 14: Version Governance
doc_path = os.path.join(SYS_DIR, '13_VERSION_GOVERNANCE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Accept-Version", "v1", "v2", "routing_table"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["14. Version Governance (13_VERSION_GOVERNANCE)"] = "FAIL"
        errors.append(f"13_VERSION_GOVERNANCE.md missing keywords: {missing}")

# Check 15: Evolution Strategy
doc_path = os.path.join(SYS_DIR, '14_EVOLUTION_STRATEGY.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["canary_rules", "canary_percentage", "The operating framework must remain stable"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["15. Evolution Strategy (14_EVOLUTION_STRATEGY)"] = "FAIL"
        errors.append(f"14_EVOLUTION_STRATEGY.md missing keywords: {missing}")

# Check 16: Ecosystem API Spec
doc_path = os.path.join(SYS_DIR, '15_ECOSYSTEM_API.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["/api/v1/store", "/api/v1/license/verify", "LICENSE_EXPIRED"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["16. Ecosystem API Spec (15_ECOSYSTEM_API)"] = "FAIL"
        errors.append(f"15_ECOSYSTEM_API.md missing keywords: {missing}")

# Check 17: Validation Report Spec
doc_path = os.path.join(SYS_DIR, '16_VALIDATION_REPORT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["ecosystem_validation_run_id", "license_auth_check", "drp_failover_verified"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["17. Validation Report Spec (16_VALIDATION_REPORT)"] = "FAIL"
        errors.append(f"16_VALIDATION_REPORT.md missing keywords: {missing}")

# Check 18: Self Review Report
doc_path = os.path.join(SYS_DIR, '17_SELF_REVIEW_REPORT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Governance & Architecture Consistency", "Development Framework Compliance"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["18. Self Review Checklists (17_SELF_REVIEW_REPORT)"] = "FAIL"
        errors.append(f"17_SELF_REVIEW_REPORT.md missing keywords: {missing}")

# Check 19: Final Completion Report
doc_path = os.path.join(SYS_DIR, '18_FINAL_COMPLETION_REPORT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Final Completion Report", "Deliverables List", "SELF_REVIEW_REPORT.md", "Next-Phase Recommendations", "16_VALIDATION_REPORT.md"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["19. Final Completion Report (18_FINAL_COMPLETION_REPORT)"] = "FAIL"
        errors.append(f"18_FINAL_COMPLETION_REPORT.md missing keywords: {missing}")

# Print check list
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] YM-LAB AI Product Ecosystem : Closed & Frozen")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
