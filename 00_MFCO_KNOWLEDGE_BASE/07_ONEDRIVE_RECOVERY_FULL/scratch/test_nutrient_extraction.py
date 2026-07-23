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

# Load database sheet
df_db = pd.read_excel(food_path, sheet_name='국가표준식품성분 Database 10.2')

# Use column values at index 0 (which contains Korean names)
col_names = list(df_db.iloc[0])
df_db = df_db.iloc[1:].reset_index(drop=True)

# Find column index positions dynamically to avoid duplicate name index issues
# We will access columns by index position instead of label to be absolutely safe!
# From db_first_row.txt:
# Index 2: 식품군
# Index 3: 식품명
# Index 5: 에너지
# Index 6: 수분
# Index 7: 단백질
# Index 8: 지방
# Index 10: 탄수화물
# Index 26: 나트륨

for food_name in ["가자미", "가지", "닭고기", "전복"]:
    # Filter rows where column index 3 (식품명) contains food_name
    sub = df_db[df_db.iloc[:, 3].astype(str).str.contains(food_name, na=True, case=False)]
    if not sub.empty:
        # Pick raw '생것' if available
        raw = sub[sub.iloc[:, 3].astype(str).str.contains('생것', na=True)]
        if not raw.empty:
            row = raw.iloc[0]
        else:
            row = sub.iloc[0]
            
        name = row.iloc[3]
        group = row.iloc[2]
        energy = row.iloc[5]
        water = row.iloc[6]
        protein = row.iloc[7]
        fat = row.iloc[8]
        carb = row.iloc[10]
        sodium = row.iloc[26]
        
        print(f"\nFood Group: {group} | Name: {name}")
        print(f"Energy: {energy} kcal, Water: {water} g, Protein: {protein} g, Fat: {fat} g, Carb: {carb} g, Sodium: {sodium} mg")
