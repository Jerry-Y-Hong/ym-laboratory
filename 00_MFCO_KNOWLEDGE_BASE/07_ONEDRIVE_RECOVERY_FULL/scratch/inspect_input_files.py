import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"

print("--- Herb DB structure ---")
herb_path = os.path.join(root_dir, "MFCO_MASTER_HERB_DB_v1.xlsx")
if os.path.exists(herb_path):
    xl = pd.ExcelFile(herb_path)
    print("Sheets:", xl.sheet_names)
    for sheet in xl.sheet_names:
        df = xl.parse(sheet)
        print(f"Sheet: {sheet}, Shape: {df.shape}")
        print("Columns:", list(df.columns))
        print("First 2 rows:\n", df.head(2))
else:
    print("MFCO_MASTER_HERB_DB_v1.xlsx does not exist")

print("\n--- Recipe CSV structure ---")
recipe_path = os.path.join(root_dir, "임산연_영양레시피.csv")
if os.path.exists(recipe_path):
    try:
        df_recipe = pd.read_csv(recipe_path, encoding='cp949', nrows=5)
        print("cp949 columns:", list(df_recipe.columns))
        print("cp949 head:\n", df_recipe.head(1))
    except Exception as e:
        print("Error reading cp949:", e)
        try:
            df_recipe = pd.read_csv(recipe_path, encoding='utf-8', nrows=5)
            print("utf-8 columns:", list(df_recipe.columns))
        except Exception as e2:
            print("Error reading utf-8:", e2)
else:
    print("임산연_영양레시피.csv does not exist")
