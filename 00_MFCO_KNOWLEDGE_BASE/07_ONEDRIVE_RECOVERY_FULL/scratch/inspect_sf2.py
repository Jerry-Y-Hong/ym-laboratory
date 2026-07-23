import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
sf_path = os.path.join(root_dir, "03_HERB_DB", "MFCO_STANDARD_FUNCTION_INDEX_v1(1).xlsx")

out_file = os.path.join(root_dir, "scratch", "sf_index_inspect.txt")

with open(out_file, "w", encoding="utf-8") as f:
    if os.path.exists(sf_path):
        df = pd.read_excel(sf_path)
        f.write(f"Shape: {df.shape}\n")
        f.write(f"Columns: {list(df.columns)}\n")
        f.write("Rows:\n")
        f.write(df.to_string())
    else:
        f.write("Not found")

print("Written to:", out_file)
