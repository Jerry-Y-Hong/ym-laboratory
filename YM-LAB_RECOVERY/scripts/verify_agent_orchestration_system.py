import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
SYS_DIR = os.path.join(ROOT_DIR, 'Implementation', '17_ai_agent_orchestration_system')

print("============================================================")
print("  YM-LAB PROJECT AI Agent Orchestration System Verification Check")
print("============================================================")

required_docs = [
    os.path.join(SYS_DIR, '01_ORCHESTRATION_ARCHITECTURE.md'),
    os.path.join(SYS_DIR, '02_WORKFLOW_ENGINE.md'),
    os.path.join(SYS_DIR, '03_EXECUTION_CONTEXT.md'),
    os.path.join(SYS_DIR, '04_SHARED_MEMORY.md'),
    os.path.join(SYS_DIR, '05_FAULT_TOLERANCE.md'),
    os.path.join(SYS_DIR, '06_CONFIGURATION_SYSTEM.md'),
    os.path.join(SYS_DIR, '07_VALIDATION_FRAMEWORK.md'),
    os.path.join(SYS_DIR, '08_PLANNING_AGENT.md'),
    os.path.join(SYS_DIR, '09_KNOWLEDGE_AGENT.md'),
    os.path.join(SYS_DIR, '10_CONTENT_GENERATION_AGENT.md'),
    os.path.join(SYS_DIR, '11_MEDIA_AGENT.md'),
    os.path.join(SYS_DIR, '12_SEO_AGENT.md'),
    os.path.join(SYS_DIR, '13_QUALITY_VALIDATION_AGENT.md'),
    os.path.join(SYS_DIR, '14_PUBLISHING_PREPARATION_AGENT.md'),
    os.path.join(SYS_DIR, '15_MONITORING_LOGGING_AGENT.md'),
    os.path.join(SYS_DIR, '16_AGENT_PROTOCOL_INTERFACE.md'),
    os.path.join(SYS_DIR, '17_FINAL_REPORT.md'),
    os.path.join(SYS_DIR, 'README.md'),
]

results = {
    "1. AI Agent Orchestration System Documents Exist": "PASS",
    "2. Orchestration Architecture & Workflow Engine Centricity": "PASS",
    "3. Workflow Engine & State Machines": "PASS",
    "4. Execution Context & Tracking Token Specs": "PASS",
    "5. Shared Memory & Write Isolation Rules": "PASS",
    "6. Fault Tolerance Policies & Backtracking": "PASS",
    "7. Agent Configuration System Parser": "PASS",
    "8. Validation Framework Pre/Post Gateways": "PASS",
    "9. Planning Agent Spec": "PASS",
    "10. Knowledge Agent Spec": "PASS",
    "11. Content Generation Agent Spec": "PASS",
    "12. Media Agent Spec": "PASS",
    "13. SEO Agent Spec": "PASS",
    "14. Quality Validation Agent Spec": "PASS",
    "15. Publishing Preparation Agent Spec": "PASS",
    "16. Monitoring & Logging Agent Spec": "PASS",
    "17. Agent Protocol Interface Spec": "PASS",
    "18. Final Completion Report": "PASS"
}

errors = []

# Check 1: Existence of all required docs
if not os.path.isdir(SYS_DIR):
    results["1. AI Agent Orchestration System Documents Exist"] = "FAIL"
    errors.append("Orchestration System directory missing: Implementation/17_ai_agent_orchestration_system/")

for path in required_docs:
    fname = os.path.basename(path)
    if not os.path.exists(path):
        results["1. AI Agent Orchestration System Documents Exist"] = "FAIL"
        errors.append(f"Missing deliverable file: {fname}")
    else:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if len(content) == 0:
                results["1. AI Agent Orchestration System Documents Exist"] = "FAIL"
                errors.append(f"Deliverable file is empty: {fname}")

# Check 2: Architecture
doc_path = os.path.join(SYS_DIR, '01_ORCHESTRATION_ARCHITECTURE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Workflow Engine", "Execution Context", "Shared Memory", "Fault Tolerance", "Validation Framework", "The operating framework must remain stable"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["2. Orchestration Architecture & Workflow Engine Centricity"] = "FAIL"
        errors.append(f"01_ORCHESTRATION_ARCHITECTURE.md missing keywords: {missing}")

# Check 3: Workflow Engine
doc_path = os.path.join(SYS_DIR, '02_WORKFLOW_ENGINE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["State Machine", "INIT", "RUNNING", "COMPLETED", "FAILED", "run("]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["3. Workflow Engine & State Machines"] = "FAIL"
        errors.append(f"02_WORKFLOW_ENGINE.md missing keywords: {missing}")

# Check 4: Execution Context
doc_path = os.path.join(SYS_DIR, '03_EXECUTION_CONTEXT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["run_id", "current_step", "telemetry", "tracking_token"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["4. Execution Context & Tracking Token Specs"] = "FAIL"
        errors.append(f"03_EXECUTION_CONTEXT.md missing keywords: {missing}")

# Check 5: Shared Memory
doc_path = os.path.join(SYS_DIR, '04_SHARED_MEMORY.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["planning_data", "generated_content", "Write Isolation"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["5. Shared Memory & Write Isolation Rules"] = "FAIL"
        errors.append(f"04_SHARED_MEMORY.md missing keywords: {missing}")

# Check 6: Fault Tolerance
doc_path = os.path.join(SYS_DIR, '05_FAULT_TOLERANCE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Retry Policy", "Exponential Backoff", "Backtracking", "Human Escalation"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["6. Fault Tolerance Policies & Backtracking"] = "FAIL"
        errors.append(f"05_FAULT_TOLERANCE.md missing keywords: {missing}")

# Check 7: Configuration System
doc_path = os.path.join(SYS_DIR, '06_CONFIGURATION_SYSTEM.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["config.json", "AgentConfig", "PlatformSettings"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["7. Agent Configuration System Parser"] = "FAIL"
        errors.append(f"06_CONFIGURATION_SYSTEM.md missing keywords: {missing}")

# Check 8: Validation Framework
doc_path = os.path.join(SYS_DIR, '07_VALIDATION_FRAMEWORK.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Pre-Execution Check", "Post-Execution Check", "Sandboxed Local Isolation", "SQL Injection"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["8. Validation Framework Pre/Post Gateways"] = "FAIL"
        errors.append(f"07_VALIDATION_FRAMEWORK.md missing keywords: {missing}")

# Check 9: Planning Agent
doc_path = os.path.join(SYS_DIR, '08_PLANNING_AGENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["PLAN_CONTENT", "core_keywords", "target_audience"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["9. Planning Agent Spec"] = "FAIL"
        errors.append(f"08_PLANNING_AGENT.md missing keywords: {missing}")

# Check 10: Knowledge Agent
doc_path = os.path.join(SYS_DIR, '09_KNOWLEDGE_AGENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["RETRIEVE_KNOWLEDGE", "nutrition_facts", "catalog.db"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["10. Knowledge Agent Spec"] = "FAIL"
        errors.append(f"09_KNOWLEDGE_AGENT.md missing keywords: {missing}")

# Check 11: Content Gen Agent
doc_path = os.path.join(SYS_DIR, '10_CONTENT_GENERATION_AGENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["GENERATE_DRAFT", "media_type", "draft_body"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["11. Content Generation Agent Spec"] = "FAIL"
        errors.append(f"10_CONTENT_GENERATION_AGENT.md missing keywords: {missing}")

# Check 12: Media Agent
doc_path = os.path.join(SYS_DIR, '11_MEDIA_AGENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["BIND_MEDIA", "assets_map", "modified_body"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["12. Media Agent Spec"] = "FAIL"
        errors.append(f"11_MEDIA_AGENT.md missing keywords: {missing}")

# Check 13: SEO Agent
doc_path = os.path.join(SYS_DIR, '12_SEO_AGENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["ANALYZE_SEO", "seo_score", "passed"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["13. SEO Agent Spec"] = "FAIL"
        errors.append(f"12_SEO_AGENT.md missing keywords: {missing}")

# Check 14: Quality Validation Agent
doc_path = os.path.join(SYS_DIR, '13_QUALITY_VALIDATION_AGENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["VALIDATE_QUALITY", "overall_passed", "validation_report", "feedback"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["14. Quality Validation Agent Spec"] = "FAIL"
        errors.append(f"13_QUALITY_VALIDATION_AGENT.md missing keywords: {missing}")

# Check 15: Publishing Prep Agent
doc_path = os.path.join(SYS_DIR, '14_PUBLISHING_PREPARATION_AGENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["PREPARE_PUBLISH", "queue_status", "ready_file_path"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["15. Publishing Preparation Agent Spec"] = "FAIL"
        errors.append(f"14_PUBLISHING_PREPARATION_AGENT.md missing keywords: {missing}")

# Check 16: Monitoring Agent
doc_path = os.path.join(SYS_DIR, '15_MONITORING_LOGGING_AGENT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["LOG_TELEMETRY", "performance_report", "Python Logging Standard"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["16. Monitoring & Logging Agent Spec"] = "FAIL"
        errors.append(f"15_MONITORING_LOGGING_AGENT.md missing keywords: {missing}")

# Check 17: Agent Protocol
doc_path = os.path.join(SYS_DIR, '16_AGENT_PROTOCOL_INTERFACE.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["SUCCESS", "ERROR", "run_id", "command", "params"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["17. Agent Protocol Interface Spec"] = "FAIL"
        errors.append(f"16_AGENT_PROTOCOL_INTERFACE.md missing keywords: {missing}")

# Check 18: Final Report
doc_path = os.path.join(SYS_DIR, '17_FINAL_REPORT.md')
if os.path.exists(doc_path):
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    keywords = ["Final Completion Report", "Deliverables List", "Self Review", "Next-Phase Recommendations", "16_AGENT_PROTOCOL_INTERFACE.md"]
    missing = [k for k in keywords if k not in content]
    if missing:
        results["18. Final Completion Report"] = "FAIL"
        errors.append(f"17_FINAL_REPORT.md missing keywords: {missing}")

# Print check list
for check_name, status in results.items():
    print(f"[{status}] {check_name}")

print("\n----------------------------------------")
all_pass = all(v == "PASS" for v in results.values())
if all_pass:
    print("  VERIFICATION RESULT: ALL CHECKS PASSED (VERIFIED)")
    print("----------------------------------------")
    print("[PASS] YM-LAB AI Agent Orchestration System : Closed & Frozen")
    sys.exit(0)
else:
    print("  VERIFICATION RESULT: FAILURES DETECTED")
    print("----------------------------------------")
    for err in errors:
        print(f" - {err}")
    sys.exit(1)
