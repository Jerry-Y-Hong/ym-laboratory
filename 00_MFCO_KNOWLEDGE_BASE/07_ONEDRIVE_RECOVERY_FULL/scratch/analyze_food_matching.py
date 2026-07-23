import pandas as pd
import os
import re

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
food_path = os.path.join(root_dir, "01_BASELINE", "식품성분표(10개정판).xlsx")
recipe_path = os.path.join(root_dir, "임산연_영양레시피.csv")
out_path = os.path.join(root_dir, "scratch", "food_matching_results.txt")

if not os.path.exists(food_path) or not os.path.exists(recipe_path):
    print("Files not found")
    sys.exit(1)

# Load unique ingredients from recipe CSV
df_recipes = pd.read_csv(recipe_path, encoding='cp949')
unique_recipe_ings = set()
for ingt in df_recipes['INGT_NM'].dropna():
    for name in re.split(r',', str(ingt)):
        name_clean = name.strip()
        if name_clean:
            unique_recipe_ings.add(name_clean)

print(f"Total unique recipe ingredients: {len(unique_recipe_ings)}")

# Load Appendix 2 from Food Composition Table
df_appendix = pd.read_excel(food_path, sheet_name='부록2)식품코드,국문명,영문명,학명 정보 ')
print(f"Appendix 2 loaded: {df_appendix.shape}")

# Search for matches
matches = []
unmatched = []

for ing in sorted(unique_recipe_ings):
    # Try exact match or contains match
    # Since food names in appendix can be like "가지, 생것" or "참외, 생것", we clean and match
    match_rows = df_appendix[df_appendix['식품명_국문명'].str.contains(ing, na=True, case=False)]
    if not match_rows.empty:
        # Pick the first one or "생것" (raw) if available
        raw_match = match_rows[match_rows['식품명_국문명'].str.contains('생것', na=True)]
        if not raw_match.empty:
            best_match = raw_match.iloc[0]
        else:
            best_match = match_rows.iloc[0]
            
        matches.append({
            "Recipe_Ing": ing,
            "Matched_Name": best_match['식품명_국문명'],
            "Code": best_match['식품코드'],
            "English": best_match['식품명_영문명'],
            "Latin": best_match['학명']
        })
    else:
        unmatched.append(ing)

with open(out_path, "w", encoding="utf-8") as f:
    f.write(f"=== FOOD INGREDIENT MATCHING REPORT ===\n")
    f.write(f"Total Unique Ingredients: {len(unique_recipe_ings)}\n")
    f.write(f"Matched: {len(matches)}\n")
    f.write(f"Unmatched: {len(unmatched)}\n\n")
    
    f.write("=== MATCHED INGREDIENTS SAMPLES (First 50) ===\n")
    df_matches = pd.DataFrame(matches)
    f.write(df_matches.head(50).to_string(index=False))
    f.write("\n\n")
    
    f.write("=== UNMATCHED INGREDIENTS ===\n")
    f.write("\n".join(unmatched))
    f.write("\n")

print("Matching analysis written to:", out_path)
print(f"Matched: {len(matches)}, Unmatched: {len(unmatched)}")
