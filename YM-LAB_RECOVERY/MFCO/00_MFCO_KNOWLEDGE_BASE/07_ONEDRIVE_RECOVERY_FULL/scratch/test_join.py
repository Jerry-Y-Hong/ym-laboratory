# -*- coding: utf-8 -*-
import pandas as pd
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
food_path = os.path.join(root_dir, "01_BASELINE", "식품성분표(10개정판).xlsx")

if not os.path.exists(food_path):
    print("File not found")
    sys.exit(1)

# Load sheets
df_app = pd.read_excel(food_path, sheet_name='부록2)식품코드,국문명,영문명,학명 정보 ')
df_db = pd.read_excel(food_path, sheet_name='국가표준식품성분 Database 10.2')

# Drop first row and set up database columns
df_db_data = df_db.iloc[1:].reset_index(drop=True)

# Merge df_app and df_db_data on DB색인 (from app) and index 0 of db
# Convert both to integer or string to avoid type mismatch
df_app['DB색인_key'] = df_app['DB색인'].astype(str).str.strip()
df_db_data['DB색인_key'] = df_db_data.iloc[:, 0].astype(str).str.strip()

# Merge
df_merged = pd.merge(df_app, df_db_data, on='DB색인_key', how='inner')
print("Merged shape:", df_merged.shape)
print("Merged columns:\n", list(df_merged.columns)[:15])

# Print a matched sample
sample = df_merged[df_merged['식품명_국문명'].str.contains("가자미", na=True)]
if not sample.empty:
    row = sample.iloc[0]
    print(f"\nSample Match: {row['식품명_국문명']}")
    print(f"Code: {row['식품코드']}, Latin: {row['학명']}")
    # Energy is index 5 in the original db, let's find the merged column name
    # The merged dataframe columns will have the original column labels
    energy_col = df_db_data.columns[5]
    protein_col = df_db_data.columns[7]
    fat_col = df_db_data.columns[8]
    carb_col = df_db_data.columns[10]
    sodium_col = df_db_data.columns[26]
    
    print(f"Energy: {row[energy_col]} kcal, Protein: {row[protein_col]} g, Fat: {row[fat_col]} g, Carb: {row[carb_col]} g, Sodium: {row[sodium_col]} mg")
