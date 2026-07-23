import os
import json
import shutil
import pandas as pd

# 경로 정의 (OneDrive 최우선, 데스크톱 Fallback)
src_base_onedrive = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
src_base_desktop = r"C:\Users\car13\Desktop\MFCO_MASTER_RECOVERY"
downloads_dir = r"C:\Users\car13\Downloads"

if os.path.exists(src_base_onedrive):
    src_base = src_base_onedrive
    print(f"[Info] Using OneDrive Source Base: {src_base}")
else:
    src_base = src_base_desktop
    print(f"[Info] OneDrive not found. Falling back to Desktop Source Base: {src_base}")

dest_base = r"d:\antigravity\ym-laboratory\data"
os.makedirs(dest_base, exist_ok=True)

print("=== MFCO Data Conversion Pipeline Starting ===")

# SECURITY POLICY CHECK: 기밀 자산(07_PRODUCT_IP)은 웹 마이그레이션 대상에서 절대 제외함
print("[Security] 07_PRODUCT_IP folder is isolated and excluded from migration.")

# 1. 온톨로지 마스터 엑셀 변환 및 적재
excel_ontology_path = os.path.join(src_base, "02_CORE_DB", "MFCO_MASTER_CORE_ONTOLOGY_v20_REVIEWED.xlsx")
if not os.path.exists(excel_ontology_path):
    excel_ontology_path = os.path.join(src_base_desktop, "02_CORE_DB", "MFCO_MASTER_CORE_ONTOLOGY_v20_REVIEWED.xlsx")

if os.path.exists(excel_ontology_path):
    try:
        print(f"  [OK] Loading Ontology Excel: {excel_ontology_path}")
        df = pd.read_excel(excel_ontology_path, sheet_name='MASTER_CORE_DB')
        
        mapping = {}
        for col in df.columns:
            c = str(col).strip()
            if '식재료' in c or '약재' in c:
                mapping[col] = '식재료/약재'
            elif '원본효능' in c or '한방효능' in c or c == '효능':
                mapping[col] = '원본효능'
            elif '표준기능' in c or '표준 기능' in c:
                mapping[col] = '표준기능'
            elif '생리작용' in c or '생리 작용' in c:
                mapping[col] = '생리작용'
            elif '작용기전' in c or '기전' in c:
                mapping[col] = '작용기전'
            elif '연결질환' in c or '질환' in c or '일상 상태' in c or '일상상태' in c:
                mapping[col] = '연결질환'
            elif '조리권장' in c or '조리' in c or '요리' in c:
                mapping[col] = '조리권장'
            elif 'Flavor' in c or '맛' in c or 'flavor' in c:
                mapping[col] = 'Flavor'
            elif '설명' in c or '비고' in c:
                mapping[col] = '설명'
        
        df = df.rename(columns=mapping)
        df = df.fillna("")
        
        records = df.to_dict(orient="records")
        out_path = os.path.join(dest_base, "mfco_master_core_db.json")
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(records, f, ensure_ascii=False, indent=2)
        print(f"  [OK] Converted MASTER_CORE_DB -> mfco_master_core_db.json (Rows: {len(records)})")
    except Exception as e:
        print(f"  [Error] Failed to convert Ontology Excel: {e}")
else:
    print(f"  [Error] Ontology Excel not found: {excel_ontology_path}")

# 2. 다운로드 폴더에서 일반인/전문가용 신규 7대 엑셀 파일들 파싱 적재
download_files_map = [
    {
        "file": "한국 약선 식재료의 효능 및 약선 활용법(약선본초학).xlsx",
        "sheet": "Table 1",
        "output": "yakseon_ingredients_herbology.json"
    },
    {
        "file": "한국 약선 요리 레시피 및 재료 효능 정보.xlsx",
        "sheet": "Table 1",
        "output": "yakseon_recipes.json"
    },
    {
        "file": "한국 전통 음력 명절 및 세시 풍속 정보.xlsx",
        "sheet": "Table 1",
        "output": "yakseon_holidays.json"
    },
    {
        "file": "한국 약선 음식의 역사, 효능 및 식재료 특징.xlsx",
        "sheet": "Table 1",
        "output": "yakseon_history_features.json"
    },
    {
        "file": "24절기별 세시 풍속, 음식 및 양생법 정보.xlsx",
        "sheet": "Table 1",
        "output": "yakseon_seasonal_24terms.json"
    },
    {
        "file": "병증별 약선 음식 및 식재료 정보.xlsx",
        "sheet": "Table 1",
        "output": "yakseon_disease_mapping.json"
    }
]

print("  [Processing Downloads Excel Files...]")
for item in download_files_map:
    src_file = os.path.join(downloads_dir, item["file"])
    sheet = item["sheet"]
    out_name = item["output"]
    out_path = os.path.join(dest_base, out_name)
    
    if os.path.exists(src_file):
        try:
            df = pd.read_excel(src_file, sheet_name=sheet)
            df = df.fillna("")
            records = df.to_dict(orient="records")
            with open(out_path, 'w', encoding='utf-8') as f:
                json.dump(records, f, ensure_ascii=False, indent=2)
            print(f"    [OK] Converted {item['file']} -> {out_name} (Rows: {len(records)})")
        except Exception as e:
            print(f"    [Error] Failed to convert {item['file']}: {e}")
    else:
        print(f"    [Warning] Downloaded Excel not found: {src_file}")

# 3. 기타 인덱스 파일들 변환 (기존 파일 활용)
excel_conversions = [
    {
        "file": os.path.join(src_base, "03_HERB_DB", "MFCO_STANDARD_FUNCTION_INDEX_v1(1).xlsx"),
        "sheet": "MFCO_STANDARD_FUNCTION_INDEX",
        "output": "mfco_standard_function_index.json"
    },
    {
        "file": os.path.join(src_base, "03_HERB_DB", "MFCO_NORMALIZATION_DICTIONARY_v1_2_DRAFT.xlsx"),
        "sheet": "MFCO_NORMALIZATION_DICTIONARY",
        "output": "mfco_normalization_dictionary.json"
    },
    {
        "file": os.path.join(src_base, "01_BASELINE", "MFCO_EXCEPTION_DICTIONARY_v1.xlsx"),
        "sheet": "MFCO_EXCEPTION_DICTIONARY",
        "output": "mfco_exception_dictionary.json"
    }
]

for item in excel_conversions:
    src_file = item["file"]
    if not os.path.exists(src_file):
        rel_path = os.path.relpath(src_file, src_base)
        src_file = os.path.join(src_base_desktop, rel_path)
        
    sheet = item["sheet"]
    out_name = item["output"]
    out_path = os.path.join(dest_base, out_name)
    
    if os.path.exists(src_file):
        try:
            df = pd.read_excel(src_file, sheet_name=sheet)
            df = df.fillna("")
            records = df.to_dict(orient="records")
            with open(out_path, 'w', encoding='utf-8') as f:
                json.dump(records, f, ensure_ascii=False, indent=2)
            print(f"  [OK] Converted {sheet} -> {out_name} (Rows: {len(records)})")
        except Exception as e:
            print(f"  [Error] Failed to convert {sheet}: {e}")
    else:
        print(f"  [Warning] Excel file not found: {src_file}")

print("=== Data Conversion Pipeline Completed ===")
