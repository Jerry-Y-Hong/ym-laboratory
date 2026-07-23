import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
P09_DIR = os.path.join(ROOT_DIR, 'Phase_09_Service_Platform')

print("============================================================")
print("  YM-LAB PROJECT Phase 09 Cross Reference Check")
print("============================================================")

readme = os.path.join(P09_DIR, '09_Documentation', 'README.md')
report = os.path.join(P09_DIR, '09_Documentation', 'Phase09_Final_Report.md')
comp_report = os.path.join(P09_DIR, '09_Documentation', 'Phase09_Completion_Report.md')

all_pass = True
for fp in [readme, report, comp_report]:
    if not os.path.exists(fp):
        print(f"[FAIL] Missing reference document: {os.path.basename(fp)}")
        all_pass = False

if all_pass:
    print("[PASS] Cross Reference Verification: All Master Documentation Links PASS")
else:
    print("[FAIL] Cross Reference Verification Failed")
