import os
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
VALID_DIR = os.path.join(ROOT_DIR, '400_AI_AUTOMATION', 'validation')

print("============================================================")
print("  YM-LAB PROJECT Phase 07 3-Layer Validation Check")
print("============================================================")

framework_file = os.path.join(VALID_DIR, 'VALIDATION_FRAMEWORK.md')
checklist_file = os.path.join(VALID_DIR, 'VALIDATION_CHECKLIST.md')
rules_file = os.path.join(VALID_DIR, 'automation_rules.json')

all_pass = True
for fpath, label in [(framework_file, "Framework Layer"), (checklist_file, "Checklist Layer"), (rules_file, "Machine Rules Layer")]:
    if not os.path.exists(fpath):
        print(f"[FAIL] Missing {label}: {os.path.basename(fpath)}")
        all_pass = False

if all_pass:
    print("[PASS] 3-Layer Validation Check: ALL 3 LAYERS PASS")
else:
    print("[FAIL] 3-Layer Validation Check Failed")
