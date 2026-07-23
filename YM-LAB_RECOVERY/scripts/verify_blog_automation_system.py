import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
SYS_DIR = os.path.join(ROOT_DIR, 'Implementation', '16_blog_automation_system')

print("============================================================")
print("  YM-LAB PROJECT Blog Automation System Verification Check")
print("============================================================")

required_docs = [
    os.path.join(SYS_DIR, '01_SYSTEM_ARCHITECTURE.md'),
    os.path.join(SYS_DIR, '02_CONTENT_PLANNER.md'),
    os.path.join(SYS_DIR, '03_CONTENT_GENERATION_ENGINE.md'),
    os.path.join(SYS_DIR, '04_MEDIA_MANAGER.md'),
    os.path.join(SYS_DIR, '05_SEO_ENGINE.md'),
    os.path.join(SYS_DIR, '06_QUALITY_VALIDATOR.md'),
    os.path.join(SYS_DIR, '07_PUBLISHING_MANAGER.md'),
    os.path.join(SYS_DIR, '08_AUTOMATION_PIPELINE.md'),
    os.path.join(SYS_DIR, '09_PROJECT_STRUCTURE.md'),
    os.path.join(SYS_DIR, '10_IMPLEMENTATION_ROADMAP.md'),
    os.path.join(SYS_DIR, '11_CONFIGURATION.md'),
    os.path.join(SYS_DIR, 'README.md'),
]

results = {
    "1. Blog Automation System Documents Exist": "PASS",
    "2. System Architecture & Pipelines (01_SYSTEM_ARCHITECTURE)": "PASS",
    "3. Keyword & Target Audiences (02_CONTENT_PLANNER)": "PASS",
    "4. Multi-Format Content Generation (03_CONTENT_GENERATION_ENGINE)": "PASS",
    "5. Multi-Media Asset Mapping (04_MEDIA_MANAGER)": "PASS",
    "6. SEO Validation Specs (05_SEO_ENGINE)": "PASS",
    "7. Five Quality Validation Pillars (06_QUALITY_VALIDATOR)": "PASS",
    "8. Publishing Preparation & FIFO (07_PUBLISHING_MANAGER)": "PASS",
    "9. 7-Step Automation Pipeline (08_AUTOMATION_PIPELINE)": "PASS",
    "10. Project Directory Layout (09_PROJECT_STRUCTURE)": "PASS",
    "11. Roadmap & Final Report (10_IMPLEMENTATION_ROADMAP)": "PASS",
    "12. Unified Configuration Schemas (11_CONFIGURATION)": "PASS"
}

errors = []

# Check 1: Existence of all required docs
if not os.path.isdir(SYS_DIR):
    results["1. Blog Automation System Documents Exist"] = "FAIL"
    errors.append("Blog Automation System directory missing: Implementation/16_blog_automation_system/")

for path in required_docs:
    fname = os.path.basename(path)
    if not os.path.exists(path):
        results["1. Blog Automation System Documents Exist"] = "FAIL"
        errors.append(f"Missing deliverable file: {fname}")
    else:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if len(content) == 0:
                results["1. Blog Automation System Documents Exist"] = "FAIL"
                errors.append(f"Deliverable file is empty: {fname}")

# Check 2: System Architecture
doc1_path = os.path.join(SYS_DIR, '01_SYSTEM_ARCHITECTURE.md')
if os.path.exists(doc1_path):
    with open(doc1_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["RAG", "Model-Agnostic", "03_CONTENT_GENERATION", "Publishing Preparation Boundary", "The operating framework must remain stable"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["2. System Architecture & Pipelines (01_SYSTEM_ARCHITECTURE)"] = "FAIL"
        errors.append(f"01_SYSTEM_ARCHITECTURE.md missing keywords: {missing}")

# Check 3: Content Planner
doc2_path = os.path.join(SYS_DIR, '02_CONTENT_PLANNER.md')
if os.path.exists(doc2_path):
    with open(doc2_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["q_code", "food_code", "core_keywords", "target_audience"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["3. Keyword & Target Audiences (02_CONTENT_PLANNER)"] = "FAIL"
        errors.append(f"02_CONTENT_PLANNER.md missing keywords: {missing}")

# Check 4: Content Generation Engine
doc3_path = os.path.join(SYS_DIR, '03_CONTENT_GENERATION_ENGINE.md')
if os.path.exists(doc3_path):
    with open(doc3_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["media_type", "Card News", "E-Book", "Newsletter", "markdown"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["4. Multi-Format Content Generation (03_CONTENT_GENERATION_ENGINE)"] = "FAIL"
        errors.append(f"03_CONTENT_GENERATION_ENGINE.md missing keywords: {missing}")

# Check 5: Media Manager
doc4_path = os.path.join(SYS_DIR, '04_MEDIA_MANAGER.md')
if os.path.exists(doc4_path):
    with open(doc4_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Image", "Video", "Thumbnail", "Icon", "alt"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["5. Multi-Media Asset Mapping (04_MEDIA_MANAGER)"] = "FAIL"
        errors.append(f"04_MEDIA_MANAGER.md missing keywords: {missing}")

# Check 6: SEO Engine
doc5_path = os.path.join(SYS_DIR, '05_SEO_ENGINE.md')
if os.path.exists(doc5_path):
    with open(doc5_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["keyword_density_ok", "Heading Hierarchy", "JSON", "seo_score"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["6. SEO Validation Specs (05_SEO_ENGINE)"] = "FAIL"
        errors.append(f"05_SEO_ENGINE.md missing keywords: {missing}")

# Check 7: Quality Validator
doc6_path = os.path.join(SYS_DIR, '06_QUALITY_VALIDATOR.md')
if os.path.exists(doc6_path):
    with open(doc6_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Fact Check", "Grammar", "Brand Consistency", "Duplicate Content Check", "catalog.db"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["7. Five Quality Validation Pillars (06_QUALITY_VALIDATOR)"] = "FAIL"
        errors.append(f"06_QUALITY_VALIDATOR.md missing keywords: {missing}")

# Check 8: Publishing Manager
doc7_path = os.path.join(SYS_DIR, '07_PUBLISHING_MANAGER.md')
if os.path.exists(doc7_path):
    with open(doc7_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Publishing Preparation Role", "FIFO", "09:00", "20:00", "ready_to_publish/"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["8. Publishing Preparation & FIFO (07_PUBLISHING_MANAGER)"] = "FAIL"
        errors.append(f"07_PUBLISHING_MANAGER.md missing keywords: {missing}")

# Check 9: Automation Pipeline
doc8_path = os.path.join(SYS_DIR, '08_AUTOMATION_PIPELINE.md')
if os.path.exists(doc8_path):
    with open(doc8_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["1단계: Knowledge Grounding", "3단계: Content Generation", "5단계: SEO Static Check", "7단계: Publishing Prep", "failed/", "sandbox_mode"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["9. 7-Step Automation Pipeline (08_AUTOMATION_PIPELINE)"] = "FAIL"
        errors.append(f"08_AUTOMATION_PIPELINE.md missing keywords: {missing}")

# Check 10: Project Structure
doc9_path = os.path.join(SYS_DIR, '09_PROJECT_STRUCTURE.md')
if os.path.exists(doc9_path):
    with open(doc9_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["blog_automation/", "03_content_pipeline/", "run_pipeline.py", "config.json"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["10. Project Directory Layout (09_PROJECT_STRUCTURE)"] = "FAIL"
        errors.append(f"09_PROJECT_STRUCTURE.md missing keywords: {missing}")

# Check 11: Roadmap & Final Report
doc10_path = os.path.join(SYS_DIR, '10_IMPLEMENTATION_ROADMAP.md')
if os.path.exists(doc10_path):
    with open(doc10_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Final Report", "Deliverables Summary", "Self Review", "Next-Phase Recommendations", "11_CONFIGURATION.md"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["11. Best Practices & Final Report (10_IMPLEMENTATION_ROADMAP)"] = "FAIL"
        errors.append(f"10_IMPLEMENTATION_ROADMAP.md missing keywords: {missing}")

# Check 12: Configuration
doc11_path = os.path.join(SYS_DIR, '11_CONFIGURATION.md')
if os.path.exists(doc11_path):
    with open(doc11_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["config.json", "active_vendor", "sqlite_path", "posts_directory", "temperature"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["12. Unified Configuration Schemas (11_CONFIGURATION)"] = "FAIL"
        errors.append(f"11_CONFIGURATION.md missing keywords: {missing}")

# Print check list
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] YM-LAB Blog Automation System : Closed & Frozen")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
