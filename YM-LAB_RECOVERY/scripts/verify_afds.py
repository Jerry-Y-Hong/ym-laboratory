import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
SYS_DIR = os.path.join(ROOT_DIR, 'AFDS')

print("============================================================")
print("  YM-LAB PROJECT Phase 28 (AFDS) Verification Check")
print("============================================================")

required_docs = [
    os.path.join(SYS_DIR, '01_AFDS_MASTER_STANDARD.md'),
    os.path.join(SYS_DIR, '02_DESIGN_TOKENS_SYSTEM.md'),
    os.path.join(SYS_DIR, '03_ATOMIC_COMPONENT_LIBRARY.md'),
    os.path.join(SYS_DIR, '04_LAYOUT_GRID_SYSTEM.md'),
    os.path.join(SYS_DIR, '05_AI_INTERFACE_PATTERNS.md'),
    os.path.join(SYS_DIR, '06_STATE_MANAGEMENT_DATA_FLOW.md'),
    os.path.join(SYS_DIR, '07_RESPONSIVE_ACCESSIBILITY_GUIDE.md'),
    os.path.join(SYS_DIR, '08_MICRO_FRONTEND_ARCHITECTURE.md'),
    os.path.join(SYS_DIR, '09_DEVELOPMENT_DX_TOOLING.md'),
    os.path.join(SYS_DIR, '10_MASTER_REPORT.md'),
]

results = {
    "1. AFDS Deliverables Existence": "PASS",
    "2. Master Standard (01_AFDS_MASTER_STANDARD)": "PASS",
    "3. Design Tokens (02_DESIGN_TOKENS_SYSTEM)": "PASS",
    "4. Atomic Components (03_ATOMIC_COMPONENT_LIBRARY)": "PASS",
    "5. Layout Grid & Glassmorphism (04_LAYOUT_GRID_SYSTEM)": "PASS",
    "6. AI Interface Patterns (05_AI_INTERFACE_PATTERNS)": "PASS",
    "7. State & Data Flow (06_STATE_MANAGEMENT_DATA_FLOW)": "PASS",
    "8. Responsive Accessibility (07_RESPONSIVE_ACCESSIBILITY_GUIDE)": "PASS",
    "9. Micro-Frontend Architecture (08_MICRO_FRONTEND_ARCHITECTURE)": "PASS",
    "10. DX & Development Tooling (09_DEVELOPMENT_DX_TOOLING)": "PASS",
    "11. Master Report & Certification (10_MASTER_REPORT)": "PASS",
    "12. ADF v3.1 & Governance Compliance": "PASS"
}

errors = []

# Check 1: Existence and non-emptiness of all required docs
if not os.path.isdir(SYS_DIR):
    results["1. AFDS Deliverables Existence"] = "FAIL"
    errors.append(f"AFDS directory missing: {SYS_DIR}")

for path in required_docs:
    fname = os.path.basename(path)
    if not os.path.exists(path):
        results["1. AFDS Deliverables Existence"] = "FAIL"
        errors.append(f"Missing deliverable file: {fname}")
    else:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if len(content) == 0:
                results["1. AFDS Deliverables Existence"] = "FAIL"
                errors.append(f"Deliverable file is empty: {fname}")

# Check 2: 01 Master Standard
doc_path = os.path.join(SYS_DIR, '01_AFDS_MASTER_STANDARD.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Single Source of Truth", "AFDS FRONTEND UI ARCHITECTURE HIERARCHY", "ADF v3.1"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["2. Master Standard (01_AFDS_MASTER_STANDARD)"] = "FAIL"
        errors.append(f"01_AFDS_MASTER_STANDARD.md missing keywords: {missing}")

# Check 3: 02 Design Tokens
doc_path = os.path.join(SYS_DIR, '02_DESIGN_TOKENS_SYSTEM.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Global Tokens", "Semantic Tokens", "Component Tokens", "--afds-color-emerald-500"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["3. Design Tokens (02_DESIGN_TOKENS_SYSTEM)"] = "FAIL"
        errors.append(f"02_DESIGN_TOKENS_SYSTEM.md missing keywords: {missing}")

# Check 4: 03 Atomic Components
doc_path = os.path.join(SYS_DIR, '03_ATOMIC_COMPONENT_LIBRARY.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["ATOMIC DESIGN HIERARCHY", "ButtonProps", "MetricCardProps", "DataTableProps"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["4. Atomic Components (03_ATOMIC_COMPONENT_LIBRARY)"] = "FAIL"
        errors.append(f"03_ATOMIC_COMPONENT_LIBRARY.md missing keywords: {missing}")

# Check 5: 04 Layout Grid
doc_path = os.path.join(SYS_DIR, '04_LAYOUT_GRID_SYSTEM.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["GLASSMORPHIC ELEVATION STACK", "Ultrawide", "afds-surface-l1", "afds-grid-dashboard"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["5. Layout Grid & Glassmorphism (04_LAYOUT_GRID_SYSTEM)"] = "FAIL"
        errors.append(f"04_LAYOUT_GRID_SYSTEM.md missing keywords: {missing}")

# Check 6: 05 AI Interface Patterns
doc_path = os.path.join(SYS_DIR, '05_AI_INTERFACE_PATTERNS.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["AIStreamViewProps", "ReasoningStep", "HITLApprovalModalProps", "AEDES Phase 25"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["6. AI Interface Patterns (05_AI_INTERFACE_PATTERNS)"] = "FAIL"
        errors.append(f"05_AI_INTERFACE_PATTERNS.md missing keywords: {missing}")

# Check 7: 06 State & Data Flow
doc_path = os.path.join(SYS_DIR, '06_STATE_MANAGEMENT_DATA_FLOW.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["AFDS 4-TIER STATE ARCHITECTURE", "useAIStream", "AFDSEventBus", "TanStack Query"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["7. State & Data Flow (06_STATE_MANAGEMENT_DATA_FLOW)"] = "FAIL"
        errors.append(f"06_STATE_MANAGEMENT_DATA_FLOW.md missing keywords: {missing}")

# Check 8: 07 Responsive Accessibility
doc_path = os.path.join(SYS_DIR, '07_RESPONSIVE_ACCESSIBILITY_GUIDE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["WCAG 2.1 AAA", "WAI-ARIA 1.2", "aria-live=\"polite\"", "Modal Focus Trap"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["8. Responsive Accessibility (07_RESPONSIVE_ACCESSIBILITY_GUIDE)"] = "FAIL"
        errors.append(f"07_RESPONSIVE_ACCESSIBILITY_GUIDE.md missing keywords: {missing}")

# Check 9: 08 Micro-Frontend Architecture
doc_path = os.path.join(SYS_DIR, '08_MICRO_FRONTEND_ARCHITECTURE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["MODULE FEDERATION", "@ymlab/afds-ui", "remotes", "APP SHELL HOST CONTAINER"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["9. Micro-Frontend Architecture (08_MICRO_FRONTEND_ARCHITECTURE)"] = "FAIL"
        errors.append(f"08_MICRO_FRONTEND_ARCHITECTURE.md missing keywords: {missing}")

# Check 10: 09 DX & Development Tooling
doc_path = os.path.join(SYS_DIR, '09_DEVELOPMENT_DX_TOOLING.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Storybook", "Playwright", "TestSprite", "@ymlab/cli"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["10. DX & Development Tooling (09_DEVELOPMENT_DX_TOOLING)"] = "FAIL"
        errors.append(f"09_DEVELOPMENT_DX_TOOLING.md missing keywords: {missing}")

# Check 11: 10 Master Report
doc_path = os.path.join(SYS_DIR, '10_MASTER_REPORT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Phase 28 – AI Frontend Design System (AFDS)", "Closed & Frozen", "Overall Phase 28 Validation .......... PASS"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["11. Master Report & Certification (10_MASTER_REPORT)"] = "FAIL"
        errors.append(f"10_MASTER_REPORT.md missing keywords: {missing}")

# Check 12: ADF v3.1 & Governance across all docs
for path in required_docs:
    fname = os.path.basename(path)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        if "ADF v3.1" not in content or "v3.5.0" not in content:
            results["12. ADF v3.1 & Governance Compliance"] = "FAIL"
            errors.append(f"{fname} missing ADF v3.1 or version v3.5.0 tag")

# Print check list
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] YM-LAB AI Frontend Design System (AFDS) : Closed & Frozen")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
