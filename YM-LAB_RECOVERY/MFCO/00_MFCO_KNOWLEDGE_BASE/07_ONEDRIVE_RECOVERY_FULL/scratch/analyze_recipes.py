import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
recipe_path = os.path.join(root_dir, "임산연_영양레시피.csv")
out_file = os.path.join(root_dir, "scratch", "recipe_analysis_summary.txt")

with open(out_file, "w", encoding="utf-8") as f:
    if os.path.exists(recipe_path):
        df = pd.read_csv(recipe_path, encoding='cp949')
        f.write(f"Total Rows: {len(df)}\n")
        f.write(f"Unique FOOD_NM count: {df['FOOD_NM'].nunique()}\n")
        f.write(f"Unique INGT_NM count: {df['INGT_NM'].nunique()}\n\n")
        
        f.write("=== Top 30 Recipes ===\n")
        f.write(df['FOOD_NM'].value_counts().head(30).to_string())
        f.write("\n\n")
        
        f.write("=== Top 30 Ingredients ===\n")
        f.write(df['INGT_NM'].value_counts().head(30).to_string())
        f.write("\n\n")
        
        f.write("=== Classifications in INGT_CLSSC_NM ===\n")
        f.write(df['INGT_CLSSC_NM'].value_counts().to_string())
        f.write("\n\n")
        
        # Check if there are recipes like Samgyetang (삼계탕) or similar
        f.write("=== Recipes containing '삼계' or '탕' or '닭' ===\n")
        samgye_df = df[df['FOOD_NM'].str.contains('삼계|탕|닭', na=True, case=False)]
        f.write(f"Count: {len(samgye_df)}\n")
        f.write(samgye_df[['FOOD_NM', 'INGT_NM', 'INGT_CLSSC_NM']].head(20).to_string())
        f.write("\n")
    else:
        f.write("Recipe file not found\n")

print("Analysis written to:", out_file)
