import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
P09_DIR = os.path.join(ROOT_DIR, 'Phase_09_Service_Platform')

print("============================================================")
print("  YM-LAB PROJECT Phase 09 Structure Verification Check")
print("============================================================")

subdirs = [
    '01_Architecture', '02_Core_Engine', '03_User_Experience',
    '04_API_Ecosystem', '05_B2C_Services', '06_B2B_Services',
    '07_Operations', '08_Analytics', '09_Documentation'
]

all_pass = True
for d in subdirs:
    dp = os.path.join(P09_DIR, d)
    if os.path.isdir(dp):
        print(f"[PASS] Subdirectory exists: {d}")
    else:
        print(f"[FAIL] Missing subdirectory: {d}")
        all_pass = False

print("\n----------------------------------------")
if all_pass:
    print("  STRUCTURE VERIFICATION: ALL 9 SUBDIRECTORIES PASS")
else:
    print("  STRUCTURE VERIFICATION: FAILURES DETECTED")
