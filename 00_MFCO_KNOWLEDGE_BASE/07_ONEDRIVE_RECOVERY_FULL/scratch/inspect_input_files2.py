import pandas as pd
import os
import sys

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"

out_file = os.path.join(root_dir, "scratch", "detailed_inspect.txt")

with open(out_file, "w", encoding="utf-8") as f:
    f.write("=== DETAILED INSPECTION OF BASES ===\n\n")
    
    # 1. Herb DB
    herb_path = os.path.join(root_dir, "MFCO_MASTER_HERB_DB_v1.xlsx")
    if os.path.exists(herb_path):
        xl = pd.ExcelFile(herb_path)
        f.write(f"Herb Sheets: {xl.sheet_names}\n")
        df = xl.parse(xl.sheet_names[0])
        f.write(f"Herb Columns: {list(df.columns)}\n")
        f.write("First 10 rows:\n")
        f.write(df.head(10).to_string())
        f.write("\n\n")
    else:
        f.write("Herb DB file not found.\n\n")
        
    # 2. Recipe CSV
    recipe_path = os.path.join(root_dir, "임산연_영양레시피.csv")
    if os.path.exists(recipe_path):
        try:
            df_recipe = pd.read_csv(recipe_path, encoding='cp949')
            f.write(f"Recipe Shape: {df_recipe.shape}\n")
            f.write(f"Recipe Columns: {list(df_recipe.columns)}\n")
            f.write("First 10 rows:\n")
            # Limit the output length of method description so it's readable
            df_sub = df_recipe.head(10).copy()
            for col in ['FOOD_COOK_MTHOD', 'FOOD_DSCRT', 'FOOD_COOK_DSCRT', 'FOOD_MTRIL_NM']:
                if col in df_sub.columns:
                    df_sub[col] = df_sub[col].astype(str).str[:50] + "..."
            f.write(df_sub.to_string())
            f.write("\n\n")
            
            # Value counts of categories if any
            if 'INGT_CLSSC_NM' in df_recipe.columns:
                f.write("Value counts for INGT_CLSSC_NM:\n")
                f.write(df_recipe['INGT_CLSSC_NM'].value_counts().to_string())
                f.write("\n\n")
            if 'INGT_NM' in df_recipe.columns:
                f.write("Sample INGT_NM values:\n")
                f.write(df_recipe['INGT_NM'].unique()[:30].tolist().__repr__())
                f.write("\n\n")
        except Exception as e:
            f.write(f"Error reading recipe CSV: {e}\n")
    else:
        f.write("Recipe CSV not found.\n")

print("Inspection file written to:", out_file)
