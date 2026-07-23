import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
food_path = os.path.join(root_dir, "01_BASELINE", "식품성분표(10개정판).xlsx")
out_path = os.path.join(root_dir, "scratch", "db_first_row.txt")

with open(out_path, "w", encoding="utf-8") as f:
    if os.path.exists(food_path):
        df = pd.read_excel(food_path, sheet_name='국가표준식품성분 Database 10.2', nrows=5)
        f.write("=== Column names at index 0 ===\n")
        row0 = df.iloc[0]
        for col_idx, val in enumerate(row0):
            f.write(f"Index {col_idx}: {val}\n")
    else:
        f.write("File not found")

print("Dumped first row to:", out_path)
