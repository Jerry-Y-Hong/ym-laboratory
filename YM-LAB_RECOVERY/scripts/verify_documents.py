import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
P09_DIR = os.path.join(ROOT_DIR, 'Phase_09_Service_Platform')

print("============================================================")
print("  YM-LAB PROJECT Phase 09 Documents Content Check")
print("============================================================")

all_pass = True
doc_count = 0
for root, dirs, files in os.walk(P09_DIR):
    for f in files:
        if f.endswith('.md'):
            doc_count += 1
            fp = os.path.join(root, f)
            if os.path.getsize(fp) == 0:
                print(f"[FAIL] Empty document found: {f}")
                all_pass = False

if all_pass and doc_count == 27:
    print(f"[PASS] Documents Content Verification: All {doc_count} Documents Valid and Non-Empty")
else:
    print(f"[FAIL] Documents Content Verification Failed (Total found: {doc_count})")
