import os
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
RUNTIME_DIR = os.path.join(ROOT_DIR, '400_AI_AUTOMATION', 'runtime')

print("============================================================")
print("  YM-LAB PROJECT Phase 07 Runtime State Verification")
print("============================================================")

runtime_files = ['task_queue.json', 'session_context.json', 'operator_state.json', 'recovery_state.json', 'execution_log.json']
all_pass = True
for fname in runtime_files:
    fpath = os.path.join(RUNTIME_DIR, fname)
    if not os.path.exists(fpath):
        print(f"[FAIL] Missing runtime state file: {fname}")
        all_pass = False
    else:
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if not data:
                    print(f"[FAIL] Empty json in {fname}")
                    all_pass = False
        except Exception as e:
            print(f"[FAIL] Invalid JSON in {fname}: {e}")
            all_pass = False

if all_pass:
    print("[PASS] Runtime State Verification: All 5 State Files PASS")
else:
    print("[FAIL] Runtime State Verification Failed")
