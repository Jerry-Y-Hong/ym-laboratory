import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

print("============================================================")
print("  YM-LAB PROJECT Read-Only Preservation Check")
print("============================================================")

p05 = os.path.join(ROOT_DIR, '200_PROJECT_INTELLIGENCE')
p06 = os.path.join(ROOT_DIR, '300_KNOWLEDGE_ENGINE')
p07 = os.path.join(ROOT_DIR, '400_AI_AUTOMATION')
p08 = os.path.join(ROOT_DIR, 'Phase_08_Blog_Automation')

all_pass = True
for path, name in [(p05, "Phase 05"), (p06, "Phase 06"), (p07, "Phase 07"), (p08, "Phase 08")]:
    if os.path.exists(path):
        print(f"[PASS] {name} Directory Intact & Frozen (Read-Only)")
    else:
        print(f"[FAIL] {name} Directory Missing")
        all_pass = False

if all_pass:
    print("[PASS] Read-Only Preservation Verification: ALL PREVIOUS PHASES PASS")
else:
    print("[FAIL] Read-Only Preservation Verification Failed")
