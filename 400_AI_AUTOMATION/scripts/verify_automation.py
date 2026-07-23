import os
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
AUTO_DIR = os.path.join(ROOT_DIR, '400_AI_AUTOMATION')

print("============================================================")
print("  YM-LAB PROJECT Phase 07 Automation Framework Verification")
print("============================================================")

required_files = [
    os.path.join(AUTO_DIR, 'architecture', 'AUTOMATION_ARCHITECTURE.md'),
    os.path.join(AUTO_DIR, 'workflows', 'AUTOMATION_WORKFLOW.md'),
    os.path.join(AUTO_DIR, 'workflows', 'WORKFLOW_PATTERNS.md'),
    os.path.join(AUTO_DIR, 'agents', 'AGENT_DEFINITIONS.md'),
    os.path.join(AUTO_DIR, 'agents', 'agent_registry.json'),
    os.path.join(AUTO_DIR, 'agents', 'agent_capabilities.json'),
    os.path.join(AUTO_DIR, 'prompts', 'PROMPT_FRAMEWORK.md'),
    os.path.join(AUTO_DIR, 'prompts', 'SYSTEM_PROMPT.md'),
    os.path.join(AUTO_DIR, 'prompts', 'TASK_PROMPTS.md'),
    os.path.join(AUTO_DIR, 'prompts', 'VALIDATION_PROMPTS.md'),
    os.path.join(AUTO_DIR, 'prompts', 'REPORTING_PROMPTS.md'),
    os.path.join(AUTO_DIR, 'automation', 'AUTOMATION_POLICY.md'),
    os.path.join(AUTO_DIR, 'runtime', 'RUNTIME_FRAMEWORK.md'),
    os.path.join(AUTO_DIR, 'runtime', 'task_queue.json'),
    os.path.join(AUTO_DIR, 'runtime', 'session_context.json'),
    os.path.join(AUTO_DIR, 'runtime', 'operator_state.json'),
    os.path.join(AUTO_DIR, 'runtime', 'recovery_state.json'),
    os.path.join(AUTO_DIR, 'runtime', 'execution_log.json'),
    os.path.join(AUTO_DIR, 'validation', 'VALIDATION_FRAMEWORK.md'),
    os.path.join(AUTO_DIR, 'validation', 'VALIDATION_CHECKLIST.md'),
    os.path.join(AUTO_DIR, 'validation', 'automation_rules.json'),
    os.path.join(AUTO_DIR, 'reporting', 'REPORTING_STANDARD.md'),
    os.path.join(AUTO_DIR, 'reporting', 'REPORT_TEMPLATE.md'),
    os.path.join(AUTO_DIR, 'reporting', 'CHANGELOG_TEMPLATE.md'),
    os.path.join(AUTO_DIR, 'scripts', 'verify_automation.py'),
    os.path.join(AUTO_DIR, 'scripts', 'verify_runtime.py'),
    os.path.join(AUTO_DIR, 'scripts', 'verify_validation.py')
]

all_pass = True
for fpath in required_files:
    fname = os.path.basename(fpath)
    if not os.path.exists(fpath):
        print(f"[FAIL] Missing deliverable file: {fname}")
        all_pass = False
    elif fpath.endswith('.json'):
        with open(fpath, 'r', encoding='utf-8') as f:
            c = f.read().strip()
            if c == "{}" or c == "[]":
                print(f"[FAIL] Empty file initialized: {fname}")
                all_pass = False

if all_pass:
    print("[PASS] Automation Framework Verification: All 27 Deliverables PASS")
else:
    print("[FAIL] Automation Framework Verification Failed")
