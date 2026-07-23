import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"

print("--- Inspecting MFCO MASTER CORE ONTOLOGY ---")
core_path = os.path.join(root_dir, "02_CORE_DB", "MFCO_MASTER_CORE_ONTOLOGY_v20_REVIEWED.xlsx")
if os.path.exists(core_path):
    xl = pd.ExcelFile(core_path)
    print("Sheets:", xl.sheet_names)
    for sheet in xl.sheet_names:
        df = xl.parse(sheet)
        print(f"Sheet '{sheet}' shape:", df.shape)
        print("Columns:", list(df.columns)[:10])
else:
    print("Core ontology not found.")

print("\n--- Inspecting UNIFIED KNOWLEDGE BASE ---")
kb_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx")
if os.path.exists(kb_path):
    xl = pd.ExcelFile(kb_path)
    print("Sheets:", xl.sheet_names)
    for sheet in xl.sheet_names:
        df = xl.parse(sheet)
        print(f"Sheet '{sheet}' shape:", df.shape)
        print("Columns:", list(df.columns)[:10])
else:
    print("Unified KB not found.")
