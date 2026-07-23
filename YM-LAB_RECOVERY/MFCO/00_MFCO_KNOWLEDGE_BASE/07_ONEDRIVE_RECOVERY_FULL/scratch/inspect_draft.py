import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
draft_path = os.path.join(root_dir, "01_BASELINE", "MFCO_MASTER_PHASE1_v1_0_DRAFT.xlsx.xlsx")

out_file = os.path.join(root_dir, "scratch", "draft_inspect.txt")

with open(out_file, "w", encoding="utf-8") as f:
    if os.path.exists(draft_path):
        xl = pd.ExcelFile(draft_path)
        f.write(f"Sheets in draft: {xl.sheet_names}\n")
        for s in xl.sheet_names:
            df = xl.parse(s)
            f.write(f"\nSheet: {s}, Shape: {df.shape}\n")
            f.write(f"Columns: {list(df.columns)}\n")
            f.write("Head:\n")
            f.write(df.head(5).to_string())
            f.write("\n")
    else:
        f.write("Draft file not found")

print("Written to:", out_file)
