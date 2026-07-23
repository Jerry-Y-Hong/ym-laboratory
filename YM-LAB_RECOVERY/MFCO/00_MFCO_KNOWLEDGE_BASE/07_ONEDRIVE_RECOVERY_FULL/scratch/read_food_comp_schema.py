import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
food_path = os.path.join(root_dir, "01_BASELINE", "식품성분표(10개정판).xlsx")
out_path = os.path.join(root_dir, "scratch", "food_comp_schema.txt")

with open(out_path, "w", encoding="utf-8") as f:
    if os.path.exists(food_path):
        try:
            xl = pd.ExcelFile(food_path)
            f.write(f"Sheet Names: {xl.sheet_names}\n\n")
            
            # Check '국가표준식품성분 Database 10.2'
            sheet_name = '국가표준식품성분 Database 10.2'
            if sheet_name in xl.sheet_names:
                df = pd.read_excel(food_path, sheet_name=sheet_name, nrows=10)
                f.write(f"=== Sheet: {sheet_name}, Shape: {df.shape} ===\n")
                f.write(f"Columns: {list(df.columns)}\n\n")
                f.write("First 3 rows:\n")
                f.write(df.head(3).to_string())
                f.write("\n\n")
            
            # Check '부록2)식품코드,국문명,영문명,학명 정보 '
            sheet_name2 = '부록2)식품코드,국문명,영문명,학명 정보 '
            if sheet_name2 in xl.sheet_names:
                df2 = pd.read_excel(food_path, sheet_name=sheet_name2, nrows=10)
                f.write(f"=== Sheet: {sheet_name2}, Shape: {df2.shape} ===\n")
                f.write(f"Columns: {list(df2.columns)}\n\n")
                f.write("First 3 rows:\n")
                f.write(df2.head(3).to_string())
                f.write("\n")
        except Exception as e:
            f.write(f"Error: {e}\n")
    else:
        f.write("Food composition file not found\n")

print("Written schema to:", out_path)
