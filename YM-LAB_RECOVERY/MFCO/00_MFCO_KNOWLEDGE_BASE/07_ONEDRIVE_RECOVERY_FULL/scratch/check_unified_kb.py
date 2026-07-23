import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
kb_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx")
out_file = os.path.join(root_dir, "scratch", "unified_kb_check.txt")

with open(out_file, "w", encoding="utf-8") as f:
    if os.path.exists(kb_path):
        xl = pd.ExcelFile(kb_path)
        f.write(f"Sheets in Unified KB: {xl.sheet_names}\n\n")
        
        for s in xl.sheet_names:
            df = xl.parse(s)
            f.write(f"=== Sheet: {s}, Shape: {df.shape} ===\n")
            f.write(f"Columns: {list(df.columns)}\n")
            f.write("Sample 3 rows:\n")
            f.write(df.head(3).to_string())
            f.write("\n\n")
            
            # Value counts of some key classifications
            if s == "INGREDIENT_MASTER":
                f.write("Category distribution:\n")
                f.write(df['CATEGORY'].value_counts().to_string())
                f.write("\n\n")
            elif s == "RECIPE_MASTER":
                f.write("Menu Component distribution:\n")
                f.write(df['MENU_COMPONENT'].value_counts().to_string())
                f.write("\n\n")
                f.write("Target Tier distribution:\n")
                f.write(df['TARGET_TIER'].value_counts().to_string())
                f.write("\n\n")
                f.write("Meal Format distribution:\n")
                f.write(df['MEAL_FORMAT'].value_counts().to_string())
                f.write("\n\n")
    else:
        f.write("Unified KB file not found\n")

print("Verification written to:", out_file)
