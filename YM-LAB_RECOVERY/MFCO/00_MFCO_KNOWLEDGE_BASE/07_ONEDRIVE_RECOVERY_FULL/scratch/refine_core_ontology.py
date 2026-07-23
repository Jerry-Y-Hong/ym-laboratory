import pandas as pd
import os

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
file_path = os.path.join(root_dir, "02_CORE_DB", "MFCO_MASTER_CORE_ONTOLOGY_v20_REVIEWED.xlsx")

# Load all sheets
xl = pd.ExcelFile(file_path)
sheets = xl.sheet_names
print("Sheets found:", sheets)

dfs = {name: pd.read_excel(file_path, sheet_name=name) for name in sheets}

# Process MASTER_CORE_DB
df_master = dfs["MASTER_CORE_DB"]

# Optimized mapping: Keep consumer-friendly terms while removing only clinical disease names (류마티스, IBS, 장염, 피부염, 관절염)
optimized_map = {
    # 🦴 뼈/관절군
    '관절 장애': '관절약화, 골감소',
    
    # 🧠 신경/근골격군 (류마티스 제거, 신경통 유지)
    '근육/신경 긴장-장애, 관절 장애': '신경통, 근육/신경 긴장, 관절 불편',
    
    # stomach 위장군 (IBS 제거, 소화불량 및 예민한 장 유지)
    '소화불량, 장기능 이상': '소화불량, 예민한 장',
    
    # 🧪 대사/염증군 (장염, 피부염, 관절염 제거 -> 장 민감성, 피부 건조/민감, 관절 불편)
    '장기능 이상, 피부 건조/민감, 관절 장애': '장 민감성, 피부 건조/민감, 관절 불편',
    
    # 🔋 피로/면역군 (만성피로, 면역저하 유지)
    '기력 저하, 면역력 저하': '만성피로, 면역저하',
    
    # 🔄 기타 계통 (간 피로, 수면 부족, 순환 저하, 기침/가래 등 복구)
    '간기능 저하, 대사 저하': '간 피로, 대사 저하',
    '수면 장애, 정신적 긴장': '수면 부족, 정신적 긴장',
    '순환 장애, 혈행 정체': '말초 순환 저하, 혈행 정체',
    '간기능 저하, 산화 스트레스': '간 피로, 산화 스트레스',
    '호흡기 장애, 건조성 기침': '기침/가래, 호흡기 건조'
}

if "관련 일상 상태" in df_master.columns:
    print("Old values:")
    for v in df_master["관련 일상 상태"].dropna().unique().tolist():
        print(f"  {v}")
        
    # Replace
    df_master["관련 일상 상태"] = df_master["관련 일상 상태"].map(lambda x: optimized_map.get(x, x) if pd.notna(x) else x)
    
    print("\nOptimized New values:")
    for v in df_master["관련 일상 상태"].dropna().unique().tolist():
        print(f"  {v}")

# Save all sheets back to Excel
with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
    for name in sheets:
        dfs[name].to_excel(writer, sheet_name=name, index=False)

print("\nSaved successfully!")
