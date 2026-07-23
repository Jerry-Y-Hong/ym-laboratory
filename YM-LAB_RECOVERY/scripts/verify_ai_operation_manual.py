import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
AI_OP_DIR = os.path.join(ROOT_DIR, 'Implementation', '14_ai_operation_manual')

print("============================================================")
print("  YM-LAB PROJECT AI Operation Manual Verification Check")
print("============================================================")

required_docs = [
    os.path.join(AI_OP_DIR, '01_AI_OPERATION_MANUAL.md'),
    os.path.join(AI_OP_DIR, '02_AI_TEAM_ARCHITECTURE.md'),
    os.path.join(AI_OP_DIR, '03_AI_ROLE_DEFINITION.md'),
    os.path.join(AI_OP_DIR, '04_AI_WORKFLOW.md'),
    os.path.join(AI_OP_DIR, '05_AI_ROUTING_RULE.md'),
    os.path.join(AI_OP_DIR, '06_AI_CONTEXT_POLICY.md'),
    os.path.join(AI_OP_DIR, '07_AI_COLLABORATION_GUIDE.md'),
    os.path.join(AI_OP_DIR, '08_AI_GITHUB_OPERATION.md'),
    os.path.join(AI_OP_DIR, '09_AI_SCALING_GUIDE.md'),
    os.path.join(AI_OP_DIR, '10_AI_BEST_PRACTICES.md'),
    os.path.join(AI_OP_DIR, 'README.md'),
]

results = {
    "1. AI Operation Manual Documents Exist": "PASS",
    "2. Core Philosophy & Purpose (01_AI_OPERATION_MANUAL)": "PASS",
    "3. Team Structure & Channels (02_AI_TEAM_ARCHITECTURE)": "PASS",
    "4. Roles & R&R Definition (03_AI_ROLE_DEFINITION)": "PASS",
    "5. AI Development Lifecycle Workflow (04_AI_WORKFLOW)": "PASS",
    "6. Model Routing Rules (05_AI_ROUTING_RULE)": "PASS",
    "7. Context Window & Token Policy (06_AI_CONTEXT_POLICY)": "PASS",
    "8. HITL Verification Gates (07_AI_COLLABORATION_GUIDE)": "PASS",
    "9. GitHub Branching & Commits (08_AI_GITHUB_OPERATION)": "PASS",
    "10. Scaling, Caching & Cost (09_AI_SCALING_GUIDE)": "PASS",
    "11. Best Practices & Security Guardrails (10_AI_BEST_PRACTICES)": "PASS"
}

errors = []

# Check 1: Existence of all required docs
if not os.path.isdir(AI_OP_DIR):
    results["1. AI Operation Manual Documents Exist"] = "FAIL"
    errors.append("AI Operation Manual directory missing: Implementation/14_ai_operation_manual/")

for path in required_docs:
    fname = os.path.basename(path)
    if not os.path.exists(path):
        results["1. AI Operation Manual Documents Exist"] = "FAIL"
        errors.append(f"Missing deliverable file: {fname}")
    else:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if len(content) == 0:
                results["1. AI Operation Manual Documents Exist"] = "FAIL"
                errors.append(f"Deliverable file is empty: {fname}")

# Check 2: Core Philosophy
doc1_path = os.path.join(AI_OP_DIR, '01_AI_OPERATION_MANUAL.md')
if os.path.exists(doc1_path):
    with open(doc1_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Human-in-the-Loop", "Context-First", "Traceability", "The operating framework must remain stable"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["2. Core Philosophy & Purpose (01_AI_OPERATION_MANUAL)"] = "FAIL"
        errors.append(f"01_AI_OPERATION_MANUAL.md missing core philosophy terms: {missing}")

# Check 3: Team Structure
doc2_path = os.path.join(AI_OP_DIR, '02_AI_TEAM_ARCHITECTURE.md')
if os.path.exists(doc2_path):
    with open(doc2_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Human Project Lead", "Core Roles (Expandable)", "Any LLM or AI Agent can be assigned"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["3. Team Structure & Channels (02_AI_TEAM_ARCHITECTURE)"] = "FAIL"
        errors.append(f"02_AI_TEAM_ARCHITECTURE.md missing role-based entities: {missing}")

# Check 4: R&R Definition
doc3_path = os.path.join(AI_OP_DIR, '03_AI_ROLE_DEFINITION.md')
if os.path.exists(doc3_path):
    with open(doc3_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Human Project Lead", "Core Roles (Expandable)", "Architecture AI"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["4. Roles & R&R Definition (03_AI_ROLE_DEFINITION)"] = "FAIL"
        errors.append(f"03_AI_ROLE_DEFINITION.md missing role assignments: {missing}")

# Check 5: Lifecycle Workflow
doc4_path = os.path.join(AI_OP_DIR, '04_AI_WORKFLOW.md')
if os.path.exists(doc4_path):
    with open(doc4_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["설계", "구현", "리뷰", "검증", "문서", "Human Project Lead"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["5. AI Development Lifecycle Workflow (04_AI_WORKFLOW)"] = "FAIL"
        errors.append(f"04_AI_WORKFLOW.md missing lifecycle phases: {missing}")

# Check 6: Routing Rules
doc5_path = os.path.join(AI_OP_DIR, '05_AI_ROUTING_RULE.md')
if os.path.exists(doc5_path):
    with open(doc5_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Any LLM or AI Agent can be assigned", "Architecture AI", "Implementation AI"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["6. Model Routing Rules (05_AI_ROUTING_RULE)"] = "FAIL"
        errors.append(f"05_AI_ROUTING_RULE.md missing routing rules or models: {missing}")

# Check 7: Context Window & Token Policy
doc6_path = os.path.join(AI_OP_DIR, '06_AI_CONTEXT_POLICY.md')
if os.path.exists(doc6_path):
    with open(doc6_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["PROJECT_STATUS.md", "토큰", "프롬프트"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["7. Context Window & Token Policy (06_AI_CONTEXT_POLICY)"] = "FAIL"
        errors.append(f"06_AI_CONTEXT_POLICY.md missing context/token strategy terms: {missing}")

# Check 8: HITL gates
doc7_path = os.path.join(AI_OP_DIR, '07_AI_COLLABORATION_GUIDE.md')
if os.path.exists(doc7_path):
    with open(doc7_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Human-in-the-Loop", "verify_*.py", "Check 1", "Check 2", "Check 3"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["8. HITL Verification Gates (07_AI_COLLABORATION_GUIDE)"] = "FAIL"
        errors.append(f"07_AI_COLLABORATION_GUIDE.md missing HITL gate specifications: {missing}")

# Check 9: GitHub Branching
doc8_path = os.path.join(AI_OP_DIR, '08_AI_GITHUB_OPERATION.md')
if os.path.exists(doc8_path):
    with open(doc8_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Conventional Commits", "PR", "체크리스트"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["9. GitHub Branching & Commits (08_AI_GITHUB_OPERATION)"] = "FAIL"
        errors.append(f"08_AI_GITHUB_OPERATION.md missing GitHub operation settings: {missing}")

# Check 10: Caching & FinOps
doc9_path = os.path.join(AI_OP_DIR, '09_AI_SCALING_GUIDE.md')
if os.path.exists(doc9_path):
    with open(doc9_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Mock", "토큰", "The operating framework must remain stable"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["10. Scaling, Caching & Cost (09_AI_SCALING_GUIDE)"] = "FAIL"
        errors.append(f"09_AI_SCALING_GUIDE.md missing scaling/mock strategy parameters: {missing}")

# Check 11: Best Practices & Security Guardrails
doc10_path = os.path.join(AI_OP_DIR, '10_AI_BEST_PRACTICES.md')
if os.path.exists(doc10_path):
    with open(doc10_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Hallucination", "API Key", "os.system"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["11. Best Practices & Security Guardrails (10_AI_BEST_PRACTICES)"] = "FAIL"
        errors.append(f"10_AI_BEST_PRACTICES.md missing best practices definitions: {missing}")

# Print check list
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] YM-LAB AI Operation Manual : Ready for Development Execution")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
