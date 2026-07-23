import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
sf_path = os.path.join(root_dir, "03_HERB_DB", "MFCO_STANDARD_FUNCTION_INDEX_v1(1).xlsx")

if os.path.exists(sf_path):
    xl = pd.ExcelFile(sf_path)
    print("Sheets in SF index:", xl.sheet_names)
    for s in xl.sheet_names:
        df = xl.parse(s)
        print(f"Sheet: {s}, Shape: {df.shape}")
        print("Columns:", list(df.columns))
        print("Head:\n", df.head(5))
else:
    print("SF index file not found")
