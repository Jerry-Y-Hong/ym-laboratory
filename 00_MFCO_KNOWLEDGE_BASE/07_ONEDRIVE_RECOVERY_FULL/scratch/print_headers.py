import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"

with open("scratch/headers.txt", "w", encoding="utf-8") as f:
    f.write("--- MFCO_MASTER_CORE_ONTOLOGY_v20_REVIEWED.xlsx ---\n")
    core_path = os.path.join(root_dir, "02_CORE_DB", "MFCO_MASTER_CORE_ONTOLOGY_v20_REVIEWED.xlsx")
    if os.path.exists(core_path):
        xl = pd.ExcelFile(core_path)
        for s in xl.sheet_names:
            df = xl.parse(s, nrows=2)
            f.write(f"Sheet: {s}\n")
            f.write(f"Columns: {list(df.columns)}\n\n")
            
    f.write("--- M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx ---\n")
    kb_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx")
    if os.path.exists(kb_path):
        xl = pd.ExcelFile(kb_path)
        for s in xl.sheet_names:
            df = xl.parse(s, nrows=2)
            f.write(f"Sheet: {s}\n")
            f.write(f"Columns: {list(df.columns)}\n\n")
            
print("Headers dumped to scratch/headers.txt")
