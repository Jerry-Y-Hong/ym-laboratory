import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
kb_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx")
out_file = os.path.join(root_dir, "scratch", "unified_kb_v2_check.txt")

with open(out_file, "w", encoding="utf-8") as f:
    if os.path.exists(kb_path):
        xl = pd.ExcelFile(kb_path)
        f.write(f"Sheets in Unified KB v2.0: {xl.sheet_names}\n\n")
        
        # Check INGREDIENT_MASTER
        df_ing = xl.parse("INGREDIENT_MASTER")
        f.write(f"=== INGREDIENT_MASTER Shape: {df_ing.shape} ===\n")
        f.write(f"Columns: {list(df_ing.columns)}\n\n")
        
        # Print a few samples of food ingredients with codes and nutrients
        f.write("=== Sample Food Ingredients (Matched from National Database) ===\n")
        # Find rows where INGREDIENT_ID doesn't start with 'H'
        foods = df_ing[~df_ing['INGREDIENT_ID'].astype(str).str.startswith('H')]
        f.write(foods[['INGREDIENT_ID', 'INGREDIENT_NAME', 'LATIN_NAME', 'CATEGORY', 'CALORIES_KCAL', 'PROTEIN_G', 'FAT_G', 'CARBOHYDRATE_G', 'SODIUM_MG']].head(15).to_string(index=False))
        f.write("\n\n")
        
        # Print a few herbs with nutrients
        f.write("=== Sample Herbs (Matched from National Database) ===\n")
        herbs = df_ing[df_ing['INGREDIENT_ID'].astype(str).str.startswith('H')]
        f.write(herbs[['INGREDIENT_ID', 'INGREDIENT_NAME', 'LATIN_NAME', 'CALORIES_KCAL', 'PROTEIN_G', 'FAT_G', 'CARBOHYDRATE_G', 'SODIUM_MG']].head(10).to_string(index=False))
        f.write("\n\n")
        
        # Value count of matched codes vs fallbacks
        fallbacks = df_ing[df_ing['INGREDIENT_ID'].astype(str).str.startswith('I')]
        f.write(f"Total foods with standard national code (e.g. K008...): {len(foods) - len(fallbacks)}\n")
        f.write(f"Total foods with fallback codes (I0001...): {len(fallbacks)}\n")
    else:
        f.write("KB file not found")

print("V2 verification written to:", out_file)
