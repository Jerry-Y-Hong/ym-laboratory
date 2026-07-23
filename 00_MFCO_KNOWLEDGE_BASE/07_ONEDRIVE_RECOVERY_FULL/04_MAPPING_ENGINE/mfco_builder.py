import pandas as pd
import sys
import os

# Reconfigure stdout to use utf-8
sys.stdout.reconfigure(encoding='utf-8')

print("=== Starting MFCO Upgraded Database and Mapping Engine Builder ===")

# Paths
root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
core_db_path = os.path.join(root_dir, "02_CORE_DB", "MFCO_MASTER_CORE_ONTOLOGY_v20_REVIEWED.xlsx")
exception_path = os.path.join(root_dir, "01_BASELINE", "MFCO_EXCEPTION_DICTIONARY_v1.xlsx")
normalization_path = os.path.join(root_dir, "03_HERB_DB", "MFCO_NORMALIZATION_DICTIONARY_v1_2_DRAFT.xlsx")
output_draft_path = os.path.join(root_dir, "01_BASELINE", "MFCO_MASTER_PHASE1_v1_0_DRAFT.xlsx.xlsx")

# Check source files existence
for path in [core_db_path, exception_path, normalization_path]:
    if not os.path.exists(path):
        print(f"Error: Required file not found: {path}")
        sys.exit(1)

# Load Source Databases
print("Loading source databases...")
df_core = pd.read_excel(core_db_path, sheet_name="MASTER_CORE_DB")
df_exc = pd.read_excel(exception_path, sheet_name="MFCO_EXCEPTION_DICTIONARY")
df_norm = pd.read_excel(normalization_path, sheet_name="MFCO_NORMALIZATION_DICTIONARY")

# Build Dictionaries for Mapping
# Exception dictionary: maps 원문효능 to (기능1, 기능2)
exc_dict = {}
for _, row in df_exc.iterrows():
    eff = str(row['원문효능']).strip()
    f1 = str(row['기능1']).strip()
    f2 = str(row['기능2']).strip()
    exc_dict[eff] = (f1, f2)

# Normalization dictionary: maps 원문효능 to 표준기능
norm_dict = {}
for _, row in df_norm.iterrows():
    eff = str(row['원문효능']).strip()
    std = str(row['표준기능']).strip()
    norm_dict[eff] = std

print(f"Loaded {len(exc_dict)} exceptions and {len(norm_dict)} normalizations.")

# Perform Cleansing
print("Cleansing and normalizing MASTER_CORE_DB...")
mfco_std_list = []
mfco_exc_list = []

for idx, row in df_core.iterrows():
    orig_eff = str(row['원본효능']).strip()
    orig_std = str(row['표준기능']).strip()
    
    resolved_std = orig_std
    resolved_exc = None
    
    # 1. Check Exception Dictionary first
    if orig_eff in exc_dict:
        resolved_std = exc_dict[orig_eff][0]
        resolved_exc = exc_dict[orig_eff][1]
    # 2. Check Normalization Dictionary
    elif orig_eff in norm_dict:
        norm_val = norm_dict[orig_eff]
        if "+" in norm_val:
            parts = norm_val.split("+")
            resolved_std = parts[0].strip()
            resolved_exc = parts[1].strip()
        else:
            resolved_std = norm_val
            resolved_exc = None
            
    # Clean up resolved values
    if resolved_std == "nan" or pd.isna(resolved_std):
        resolved_std = "미분류"
    if resolved_exc == "nan" or pd.isna(resolved_exc):
        resolved_exc = None
        
    # If both resolved and original standard function are "미분류", keep "미분류"
    if resolved_std == "미분류" and orig_std != "미분류" and orig_std != "nan" and not pd.isna(orig_std):
        resolved_std = orig_std
        
    mfco_std_list.append(resolved_std)
    mfco_exc_list.append(resolved_exc)

# Add columns to dataframe
df_core['MFCO_표준기능'] = mfco_std_list
df_core['MFCO_Exception'] = mfco_exc_list

# Write Cleansed Master Database
print(f"Writing cleansed database to {output_draft_path}...")
with pd.ExcelWriter(output_draft_path, engine='openpyxl') as writer:
    df_core.to_excel(writer, sheet_name="MASTER_CORE_DB_CLEANSED", index=False)

print("✅ Cleansed database populated successfully.")

# ==========================================
# Populate Upgraded Master Files (M04-03, M04-04)
# ==========================================
print("Populating Upgraded Master Files (5 Root Causes, 18 State Clusters)...")

# 1. Root Cause Master (M04-03)
# Upgraded Root Causes: RC01 to RC05
rc_data = [
    ("RC01", "에너지부족", "회복", "에너지 생성 저하 및 만성 피로 상태", "ACTIVE"),
    ("RC02", "순환정체", "순환", "혈액 및 림프 순환 정체", "ACTIVE"),
    ("RC03", "대사불균형", "정화", "노폐물 배출 저하 및 수분 정체", "ACTIVE"),
    ("RC04", "회복력저하", "보호", "면역력 저하 및 장기적 회복 속도 지연", "ACTIVE"),
    ("RC05", "심신불균형", "안정", "스트레스 과부하 및 자율신경 불균형", "ACTIVE")
]
df_rc_master = pd.DataFrame(rc_data, columns=["RC_ID", "ROOT_CAUSE", "PRIMARY_GROUP", "DESCRIPTION", "STATUS"])
rc_master_info = pd.DataFrame([
    ("MASTER_ID", "M02-01"),
    ("MASTER_NAME", "ROOT_CAUSE_GROUP_MASTER"),
    ("VERSION", "v2.0_UPGRADED"),
    ("STATUS", "ACTIVE")
], columns=["FIELD", "VALUE"])

rc_file_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-03_ROOT_CAUSE_GROUP_MASTER_v1.0.xlsx")
with pd.ExcelWriter(rc_file_path, engine='openpyxl') as writer:
    df_rc_master.to_excel(writer, sheet_name="ROOT_CAUSE_GROUP_MASTER", index=False)
    rc_master_info.to_excel(writer, sheet_name="MASTER_INFO", index=False)

# 2. State Master (M04-04)
# Upgraded 18 State Clusters: ST-001 to ST-018
st_data = [
    ("ST-001", "에너지계", "신체상태", "기력 저하 및 피로"),
    ("ST-002", "수면계", "신경계", "수면 불균형 및 불면"),
    ("ST-003", "순환계", "순환", "말초 순환 저하"),
    ("ST-004", "체액계", "순환", "체내 수분 정체 및 부종"),
    ("ST-005", "소화계", "소화기", "위장 및 장 기능 저하"),
    ("ST-006", "피부계", "외피계", "피부 건조 및 탄력 저하"),
    ("ST-007", "정서계", "정신계", "스트레스 및 신경 불안정"),
    ("ST-008", "근골격계", "신체증상", "근육 긴장 및 관절 약화"),
    ("ST-009", "시각·안구계", "감각계", "안구 건조 및 피로"),
    ("ST-010", "비뇨생식계", "배설계", "비뇨 배출 이상"),
    ("ST-011", "여성건강계", "생식계", "여성 호르몬 및 생리 조절"),
    ("ST-012", "호흡기계", "호흡기", "기침 및 가래"),
    ("ST-013", "면역·회복계", "면역계", "면역 조절 및 회복 지연"),
    ("ST-014", "브레인포그·인지계", "정신계", "기억력 저하 및 브레인포그"),
    ("ST-015", "구강계", "소화기", "구강 건조 및 염증"),
    ("ST-016", "체중계", "대사계", "급격한 체중 변화"),
    ("ST-017", "체온·열감계", "체온조절", "상열하한 및 오한"),
    ("ST-018", "청각계", "감각계", "이명 및 이충만감")
]
df_st_master = pd.DataFrame(st_data, columns=["STATE_ID", "STATE_NAME", "STATE_GROUP", "DEFINITION"])
st_file_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-04_STATE_MASTER_v1.0.xlsx")
with pd.ExcelWriter(st_file_path, engine='openpyxl') as writer:
    df_st_master.to_excel(writer, sheet_name="M04-04_STATE_MASTER_v1.0", index=False)

print("✅ Upgraded Root Cause and State Masters generated successfully.")

# ==========================================
# Populate Upgraded Mapping Engine Matrices (M04)
# ==========================================
print("Populating Upgraded Mapping Engine Maps and Matrices...")

# 1. State-Cause Map (M04-05)
sc_map_data = [
    # STATE_ID, CAUSE_ID, WEIGHT, PRIORITY, CONFIDENCE
    ("ST-001", "RC01", 0.9, 1, 0.9),  # 에너지계 -> 에너지부족
    ("ST-002", "RC05", 0.8, 1, 0.8),  # 수면계 -> 심신불균형
    ("ST-003", "RC02", 0.9, 1, 0.9),  # 순환계 -> 순환정체
    ("ST-004", "RC03", 0.8, 1, 0.8),  # 체액계 -> 대사불균형
    ("ST-005", "RC03", 0.8, 1, 0.8),  # 소화계 -> 대사불균형
    ("ST-006", "RC04", 0.7, 1, 0.7),  # 피부계 -> 회복력저하
    ("ST-007", "RC05", 0.9, 1, 0.9),  # 정서계 -> 심신불균형
    ("ST-008", "RC01", 0.7, 1, 0.7),  # 근골격계 -> 에너지부족
    ("ST-009", "RC02", 0.7, 1, 0.7),  # 시각·안구계 -> 순환정체
    ("ST-010", "RC03", 0.8, 1, 0.8),  # 비뇨생식계 -> 대사불균형
    ("ST-011", "RC05", 0.8, 1, 0.8),  # 여성건강계 -> 심신불균형
    ("ST-012", "RC04", 0.8, 1, 0.8),  # 호흡기계 -> 회복력저하
    ("ST-013", "RC04", 0.9, 1, 0.9),  # 면역·회복계 -> 회복력저하
    ("ST-014", "RC01", 0.8, 1, 0.8),  # 브레인포그·인지계 -> 에너지부족
    ("ST-015", "RC03", 0.7, 1, 0.7),  # 구강계 -> 대사불균형
    ("ST-016", "RC03", 0.8, 1, 0.8),  # 체중계 -> 대사불균형
    ("ST-017", "RC02", 0.8, 1, 0.8),  # 체온·열감계 -> 순환정체
    ("ST-018", "RC02", 0.7, 1, 0.7),  # 청각계 -> 순환정체
]

df_sc_map = pd.DataFrame(sc_map_data, columns=["STATE_ID", "CAUSE_ID", "WEIGHT", "PRIORITY", "CONFIDENCE"])
df_sc_matrix = pd.DataFrame([
    (r[0], r[1], r[2], r[4], r[3]) for r in sc_map_data
], columns=["상태코드", "원인코드", "가중치", "신뢰도", "우선순위"])

# 2. Cause-Role Map (M04-06)
cr_map_data = [
    # CAUSE_ID, ROLE_ID, WEIGHT, PRIORITY, CONFIDENCE
    ("RC01", "GUN", 1.0, 1, 1.0),   # 에너지부족 -> 군
    ("RC02", "GUN", 1.0, 1, 1.0),   # 순환정체 -> 군
    ("RC03", "GUN", 1.0, 1, 1.0),   # 대사불균형 -> 군
    ("RC04", "SHIN", 0.8, 2, 0.9),  # 회복력저하 -> 신
    ("RC05", "SHIN", 0.8, 2, 0.9),  # 심신불균형 -> 신
]

df_cr_map = pd.DataFrame(cr_map_data, columns=["CAUSE_ID", "ROLE_ID", "WEIGHT", "PRIORITY", "CONFIDENCE"])
df_cr_matrix = pd.DataFrame([
    (r[0], r[1], r[2], r[4], r[3]) for r in cr_map_data
], columns=["원인코드", "역할코드", "가중치", "신뢰도", "우선순위"])

# 3. Role-Function Map (M04-07)
# Maps Role codes to Standard Functions
rf_map_data = [
    # ROLE_ID, FUNCTION_ID, WEIGHT, PRIORITY, CONFIDENCE
    ("GUN", "SF012", 1.0, 1, 1.0),   # 군 -> 체력회복 (에너지부족 대응)
    ("GUN", "SF003", 1.0, 1, 1.0),   # 군 -> 수분배출 (대사불균형 대응)
    ("GUN", "SF007", 1.0, 1, 1.0),   # 군 -> 혈류개선 (순환정체 대응)
    ("GUN", "SF020", 1.0, 1, 1.0),   # 군 -> 소화개선 (대사불균형 대응)
    ("GUN", "SF018", 1.0, 1, 1.0),   # 군 -> 수면안정 (심신불균형 대응)
    
    ("SHIN", "SF010", 0.8, 2, 0.9),  # 신 -> 조직회복
    ("SHIN", "SF011", 0.8, 2, 0.9),  # 신 -> 혈액보충
    ("SHIN", "SF013", 0.8, 2, 0.9),  # 신 -> 면역조절
    ("SHIN", "SF017", 0.8, 2, 0.9),  # 신 -> 신경안정
    ("SHIN", "SF021", 0.8, 2, 0.9),  # 신 -> 영양흡수
    
    ("JWA", "SF001", 0.6, 3, 0.8),   # 좌 -> 항염
    ("JWA", "SF002", 0.6, 3, 0.8),   # 좌 -> 해독
    ("JWA", "SF016", 0.6, 3, 0.8),   # 좌 -> 항산화
    ("JWA", "SF023", 0.6, 3, 0.8),   # 좌 -> 통증완화
    ("JWA", "SF024", 0.6, 3, 0.8),   # 좌 -> 경련완화
    
    ("SA", "SF022", 0.5, 4, 0.8),    # 사 -> 건비
    ("SA", "SF008", 0.5, 4, 0.8),    # 사 -> 기순환
    ("SA", "SF009", 0.5, 4, 0.8),    # 사 -> 통락
]

df_rf_map = pd.DataFrame(rf_map_data, columns=["ROLE_ID", "FUNCTION_ID", "WEIGHT", "PRIORITY", "CONFIDENCE"])
df_rf_matrix = pd.DataFrame([
    (r[0], r[1], r[2], r[4], r[3]) for r in rf_map_data
], columns=["역할코드", "기능코드", "가중치", "신뢰도", "우선순위"])

# 4. Constitution-State Matrix (M04-08)
cs_matrix_data = [
    # 체질코드, 상태코드, 가중치, 신뢰도, 우선순위
    ("SE", "ST-017", 0.9, 0.9, 1),  # 소음인 -> 체온·열감계 (냉증)
    ("SE", "ST-005", 0.8, 0.8, 2),  # 소음인 -> 소화계
    ("SY", "ST-002", 0.8, 0.8, 1),  # 소양인 -> 수면계
    ("SY", "ST-007", 0.7, 0.7, 2),  # 소양인 -> 정서계 (스트레스)
    ("TE", "ST-004", 0.8, 0.8, 1),  # 태음인 -> 체액계 (부종)
    ("TE", "ST-010", 0.8, 0.8, 2),  # 태음인 -> 비뇨생식계
    ("TY", "ST-012", 0.8, 0.8, 1),  # 태양인 -> 호흡기계
]
df_cs_matrix = pd.DataFrame(cs_matrix_data, columns=["체질코드", "상태코드", "가중치", "신뢰도", "우선순위"])

# 5. Organ-Cause Matrix (M04-09)
oc_matrix_data = [
    # 장부코드, 원인코드, 가중치, 신뢰도, 우선순위
    ("LIVER", "RC05", 0.9, 0.9, 1),   # 간 -> 심신불균형 (간기울결)
    ("LIVER", "RC02", 0.7, 0.8, 2),   # 간 -> 순환정체
    ("HEART", "RC05", 0.9, 0.9, 1),   # 심 -> 심신불균형
    ("SPLEEN", "RC03", 0.95, 0.95, 1), # 비 -> 대사불균형
    ("SPLEEN", "RC01", 0.8, 0.85, 2),  # 비 -> 에너지부족
    ("LUNG", "RC04", 0.8, 0.8, 1),    # 폐 -> 회복력저하
    ("KIDNEY", "RC01", 0.95, 0.9, 1),  # 신 -> 에너지부족
]
df_oc_matrix = pd.DataFrame(oc_matrix_data, columns=["장부코드", "원인코드", "가중치", "신뢰도", "우선순위"])

# 7. Season & 24 Solar Terms Matrix (M04-11)
season_matrix_data = [
    # 절기코드, 절기명, 계절명, 원인코드, 기능코드, 가중치, 신뢰도, 우선순위, 추천식재료그룹
    ("SOL-01", "입춘", "봄", "RC05", "SF008", 0.9, 0.9, 1, "VEGETABLE"),
    ("SOL-02", "우수", "봄", "RC03", "SF003", 0.8, 0.8, 1, "VEGETABLE"),
    ("SOL-03", "경칩", "봄", "RC01", "SF012", 0.85, 0.9, 1, "GRAIN"),
    ("SOL-04", "춘분", "봄", "RC05", "SF017", 0.9, 0.95, 1, "VEGETABLE"),
    ("SOL-05", "청명", "봄", "RC02", "SF007", 0.8, 0.85, 1, "VEGETABLE"),
    ("SOL-06", "곡우", "봄", "RC03", "SF022", 0.85, 0.9, 1, "GRAIN"),
    ("SOL-07", "입하", "여름", "RC05", "SF017", 0.8, 0.85, 1, "FRUIT"),
    ("SOL-08", "소만", "여름", "RC03", "SF003", 0.8, 0.8, 1, "VEGETABLE"),
    ("SOL-09", "망종", "여름", "RC01", "SF012", 0.9, 0.9, 1, "MEAT"),
    ("SOL-10", "하지", "여름", "RC03", "SF021", 0.95, 0.95, 1, "FRUIT"),
    ("SOL-11", "소서", "여름", "RC03", "SF002", 0.8, 0.85, 1, "VEGETABLE"),
    ("SOL-12", "대서", "여름", "RC01", "SF012", 1.0, 0.95, 1, "MEAT"),
    ("SOL-13", "입추", "가을", "RC04", "SF013", 0.85, 0.9, 1, "FRUIT"),
    ("SOL-14", "처서", "가을", "RC04", "SF010", 0.8, 0.85, 1, "GRAIN"),
    ("SOL-15", "백로", "가을", "RC04", "SF025", 0.9, 0.9, 1, "FRUIT"),
    ("SOL-16", "추분", "가을", "RC05", "SF017", 0.85, 0.9, 1, "GRAIN"),
    ("SOL-17", "한로", "가을", "RC02", "SF007", 0.9, 0.9, 1, "HERB"),
    ("SOL-18", "상강", "가을", "RC04", "SF010", 0.85, 0.85, 1, "GRAIN"),
    ("SOL-19", "입동", "겨울", "RC02", "SF007", 0.95, 0.9, 1, "FISH"),
    ("SOL-20", "소설", "겨울", "RC01", "SF012", 0.85, 0.85, 1, "MEAT"),
    ("SOL-21", "대설", "겨울", "RC04", "SF013", 0.9, 0.9, 1, "MEAT"),
    ("SOL-22", "동지", "겨울", "RC02", "SF009", 0.95, 0.95, 1, "GRAIN"),
    ("SOL-23", "소한", "겨울", "RC01", "SF010", 0.95, 0.9, 1, "MEAT"),
    ("SOL-24", "대한", "겨울", "RC02", "SF007", 0.95, 0.95, 1, "MEAT")
]
df_season_matrix = pd.DataFrame(season_matrix_data, columns=["절기코드", "절기명", "계절명", "원인코드", "기능코드", "가중치", "신뢰도", "우선순위", "추천식재료그룹"])

# 6. Role Priority Rule Master (M04-10)
rpr_matrix_data = [
    # 원인코드, 체질보정, 편차점수, 신뢰도, 최종역할
    ("RC01", 1, 1, 0.95, "군"),
    ("RC02", 1, 1, 0.92, "군"),
    ("RC03", 1, 1, 0.95, "군"),
    ("RC04", 1, 1, 0.90, "신"),
    ("RC05", 1, 1, 0.92, "신"),
]
df_rpr_matrix = pd.DataFrame(rpr_matrix_data, columns=["원인코드", "체질보정", "편차점수", "신뢰도", "최종역할"])

# Helper functions
def write_map_file(file_path, df_map, sheet_name, master_id, master_name):
    df_info = pd.DataFrame([
        ("MASTER_ID", master_id),
        ("MASTER_NAME", master_name),
        ("VERSION", "v2.0_UPGRADED"),
        ("STATUS", "ACTIVE")
    ], columns=["FIELD", "VALUE"])
    with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
        df_map.to_excel(writer, sheet_name=sheet_name, index=False)
        df_info.to_excel(writer, sheet_name="MASTER_INFO", index=False)

def save_matrix(fp, df, sheet):
    with pd.ExcelWriter(fp, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=sheet, index=False)

# Write map files
print("Saving upgraded map files...")
write_map_file(os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-05_STATE_CAUSE_MAP_v1.0.xlsx"), df_sc_map, "M04-05_STATE_CAUSE_MAP", "M04-05", "STATE_CAUSE_MAP")
write_map_file(os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-06_CAUSE_ROLE_MAP_v1.0.xlsx"), df_cr_map, "M04-06", "M04-06", "CAUSE_ROLE_MAP")
write_map_file(os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-07_ROLE_FUNCTION_MAP_v1.0.xlsx"), df_rf_map, "M04-07_ROLE_FUNCTION_MAP", "M04-07", "ROLE_FUNCTION_MAP")

# Write matrix files
print("Saving upgraded matrix files...")
save_matrix(os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS", "M04-05_STATE_CAUSE_MATRIX_v1.0.xlsx"), df_sc_matrix, "M04-05_STATE_CAUSE_MATRIX_v1.0")
save_matrix(os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS", "M04-06_CAUSE_ROLE_MATRIX_v1.0.xlsx"), df_cr_matrix, "M04-06_CAUSE_ROLE_MATRIX_v1.0.")
save_matrix(os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS", "M04-07_ROLE_FUNCTION_MATRIX_v1.0.xlsx"), df_rf_matrix, "M04-07_ROLE_FUNCTION_MATRIX_v1")
save_matrix(os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS", "M04-08_CONSTITUTION_STATE_MATRIX_v1.0.xlsx"), df_cs_matrix, "M04-08_CONSTITUTION_STATE_MATR")
save_matrix(os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS", "M04-09_ORGAN_CAUSE_MATRIX_v1.0.xlsx"), df_oc_matrix, "M04-09_ORGAN_CAUSE_MATRIX_v1.0")
save_matrix(os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS", "M04-10_ROLE_PRIORITY_RULE_MASTER_v1.0.xlsx"), df_rpr_matrix, "M04-10_ROLE_PRIORITY_RULE_MAST")
save_matrix(os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS", "M04-11_SEASON_TERMS_MATRIX_v1.0.xlsx"), df_season_matrix, "M04-11_SEASON_TERMS_MATRIX")

# 8. Multilingual Translation Dictionary Master (M04-12)
multi_dict_data = [
    # KEY, TYPE, ko, en, zh, ja, es, de, ar
    # Causes
    ("RC01", "CAUSE", "에너지부족", "Energy Deficiency", "能量不足", "エネルギー不足", "Deficiencia de Energía", "Energiemangel", "نقص الطاقة"),
    ("RC02", "CAUSE", "순환정체", "Circulation Stagnation", "循环停滞", "循環停滞", "Estancamiento de Circulación", "Zirkulationsstauung", "ركود الدورة الدموية"),
    ("RC03", "CAUSE", "대사불균형", "Metabolic Imbalance", "代谢失衡", "代謝不均衡", "Desequilibrio Metabólico", "Stoffwechselungleichgewicht", "خلل في التمثيل الغذائي"),
    ("RC04", "CAUSE", "회복력저하", "Low Recovery Power", "恢复力低下", "回復力低下", "Baja Capacidad de Recuperación", "Geringe Erholungskraft", "انخفاض القدرة على التعافي"),
    ("RC05", "CAUSE", "심신불균형", "Mind-Body Imbalance", "身心失衡", "心身不均衡", "Desequilibrio Cuerpo-Mente", "Körper-Geist-Ungleichgewicht", "خلل بین الجسم والعقل"),
    # Kits
    ("K01", "KIT", "기력보강 앰플키트", "Energy Recovery Ampoule Kit", "精力康复液态针剂", "気力補強アンプルキット", "Kit de Ampolla de Recuperación de Energía", "Energieerholungs-Ampullenkit", "مجموعة أمبولات استعادة الطاقة"),
    ("K02", "KIT", "순환온기 분말키트", "Circulation & Warmth Powder Kit", "循环温暖粉末针剂", "循環温気粉末キット", "Kit de Polvo de Circulación y Calidez", "Zirkulations- und Wärme-Pulverkit", "مجموعة مسحوق الدورة الدموية والدفء"),
    ("K03", "KIT", "대사정화 티백키트", "Metabolic Purifying Tea bag Kit", "代谢净化茶包针剂", "代謝浄化ティーバッグキット", "Kit de Bolsa de Té Depurativa Metabólica", "Stoffwechselreinigungs-Teebeutelkit", "مجموعة أكياس شاي تنقية التمثيل الغذائي"),
    ("K04", "KIT", "재생보호 분말키트", "Regenerative & Protective Powder Kit", "再生保护粉末정제", "再生保護粉末キット", "Kit de Polvo Regenerativo y Protector", "Regenerations- und Schutzpulverkit", "مجموعة مسحوق التجديد والحماية"),
    ("K05", "KIT", "안심수면 앰플키트", "Calming & Sleep Ampoule Kit", "安心睡眠液态정제", "安心睡眠アンプルキット", "Kit de Ampolla Calmante y de Sueño", "Beruhigungs- und Schlaf-Ampullenkit", "مجموعة أمبولات مهدئة وللنوم"),
    # Standard Functions
    ("SF001", "FUNCTION", "항염", "Anti-inflammatory", "抗炎", "抗炎症", "Antiinflamatorio", "Entzündungshemmend", "مضاد للالتهابات"),
    ("SF002", "FUNCTION", "해독", "Detoxification", "解毒", "解毒", "Desintoxicación", "Entgiftung", "إزالة السموم"),
    ("SF003", "FUNCTION", "수분배출", "Water Elimination", "排出水分", "水分排出", "Eliminación de Agua", "Wasserelimination", "تصريف المياه"),
    ("SF005", "FUNCTION", "거담", "Sputum Clearance", "祛痰", "去痰", "Eliminación de Esputo", "Schleimlösung", "طرد البلغم"),
    ("SF007", "FUNCTION", "혈류개선", "Blood Flow Improvement", "改善血流", "血流改善", "Mejora del Flujo Sanguíneo", "Durchblutungsverbesserung", "تحسين تدفق الدم"),
    ("SF008", "FUNCTION", "기순환", "Qi Circulation", "气循环", "気循環", "Circulación de Qi", "Qi-Zirkulation", "دورة الطاقة (تشي)"),
    ("SF009", "FUNCTION", "통락", "Meridian Clearing", "通络", "通絡", "Apertura de Meridianos", "Meridianöffnung", "فتح المسارات"),
    ("SF010", "FUNCTION", "조직회복", "Tissue Recovery", "组织恢复", "組織回復", "Recuperación de Tejidos", "Gewebeerholung", "تعافي الأنسجة"),
    ("SF011", "FUNCTION", "혈액보충", "Blood Supplementation", "补充血液", "血液補充", "Suplementación de Sangre", "Blutergänzung", "تعويض الدم"),
    ("SF012", "FUNCTION", "체력회복", "Energy Recovery", "恢复体力", "体力回復", "Recuperación de Energía", "Energieerholung", "استعادة الطاقة"),
    ("SF013", "FUNCTION", "면역조절", "Immune Regulation", "免疫调节", "免疫調節", "Regulación Inmunológica", "Immunregulation", "تنظيم المناعة"),
    ("SF017", "FUNCTION", "신경안정", "Nerve Calming", "安神", "神経安定", "Calmante Nervioso", "Nervenberuhigung", "تهدئة الأعصاب"),
    ("SF018", "FUNCTION", "수면안정", "Sleep Stabilization", "稳定睡眠", "睡眠安定", "Estabilización del Sueño", "Schlafstabilisierung", "تثبيت النوم"),
    ("SF019", "FUNCTION", "진정", "Sedation", "镇静", "鎮静", "Sedación", "Sedierung", "تهدئة"),
    ("SF020", "FUNCTION", "소화개선", "Digestion Improvement", "改善消化", "消化改善", "Mejora de la Digestión", "Verdauungsverbesserung", "تحسين الهضم"),
    ("SF021", "FUNCTION", "영양흡수", "Nutrient Absorption", "营养吸收", "栄養吸収", "Absorción de Nutrientes", "Nährstoffaufnahme", "امتصاص العناصر الغذائية"),
    ("SF022", "FUNCTION", "건비", "Spleen Invigoration", "健脾", "健脾", "Tonificación de Bazo", "Milztonisierung", "تقوية الطحال"),
    ("SF023", "FUNCTION", "통증완화", "Pain Relief", "缓解疼痛", "痛み緩和", "Alivio del Dolor", "Schmerzlinderung", "تخفيف الألم"),
    ("SF024", "FUNCTION", "경련완화", "Spasm Relief", "缓解痉挛", "痙攣緩和", "Alivio de Espasmos", "Krampflinderung", "تخفيف التشنج"),
    ("SF025", "FUNCTION", "진해", "Cough Relief", "止咳", "鎮咳", "Alivio de la Tos", "Hustenlinderung", "تخفيف السعال"),
    # Herbs and Ingredients
    ("황기", "HERB", "황기", "Milkvetch Root", "黄芪", "オウ기", "Astrágalo", "Tragantwurzel", "قتاد"),
    ("인삼", "HERB", "인삼", "Korean Ginseng", "人参", "ニンジン", "Ginseng", "Ginseng", "جنسنغ"),
    ("당귀", "HERB", "당귀", "Angelica Root", "当归", "トウキ", "Angélica", "Engelwurz", "حشيشة الملاك"),
    ("천궁", "HERB", "천궁", "Cnidium Rhizome", "川芎", "センキュウ", "Cnidio", "Cnidium-Rhizom", "سنيديوم"),
    ("숙지황", "HERB", "숙지황", "Prepared Rehmannia", "熟地黄", "ジュクジオウ", "Rehmannia Preparada", "Rehmannia-Präparat", "رحمانية معالجة"),
    ("복령", "HERB", "복령", "Poria", "茯苓", "ブクリョウ", "Poria", "Poria", "بوريا"),
    ("의이인", "HERB", "의이인", "Coix Seed", "薏苡仁", "ヨクイニン", "Lágrima de Job", "Hiobsträne", "عشب الحبوب"),
    ("작약", "HERB", "작약", "Peony Root", "芍药", "シャクヤク", "Peonía", "Pfingstrosenwurzel", "جذر الفاوانيا"),
    ("진피", "HERB", "진피", "Tangerine Peel", "陈皮", "チンピ", "Piel de Mandarina", "Mandarinenschale", "قشر اليوسفي"),
    ("계피", "HERB", "계피", "Cinnamon", "桂皮", "ケイヒ", "Canela", "Zimt", "قرفة"),
    ("백출", "HERB", "백출", "White Atractylodes Rhizome", "白术", "ビャクジュツ", "Atractilodes", "Weißer Atractylodes", "أتركتيلودس الأبيض"),
    ("대추", "HERB", "대추", "Jujube", "大枣", "ナツメ", "Azufaifa", "Jujube", "عناب"),
    ("산약", "HERB", "산약", "Chinese Yam", "山药", "サンヤク", "Ñame", "Yamswurzel", "يام"),
    ("택사", "HERB", "택사", "Alisma Rhizome", "泽泻", "タクシャ", "Alisma", "Froschlöffel", "أليسما"),
    ("구기자", "HERB", "구기자", "Goji Berry", "枸杞子", "クコ시", "Baya de Goji", "Bocksdornbeere", "توت غوجي"),
    ("오미자", "HERB", "오미자", "Schisandra Berry", "五味子", "ゴミシ", "Esquisandra", "Spaltkörbchen", "شزندرة"),
    ("산수유", "HERB", "산수유", "Cornus Fruit", "山茱萸", "サンシュユ", "Cornus", "Kornelkirsche", "قرانيا"),
    ("산조인", "HERB", "산조인", "Spiny Jujube Seed", "酸枣仁", "サンソニン", "Semilla de Azufaifa Espinosa", "Dornige Jujubensamen", "بذور العناب البري"),
    ("원지", "HERB", "원지", "Polygala Root", "远志", "オンジ", "Polígala", "Senegawurzel", "بوليغالا"),
    ("백자인", "HERB", "백자인", "Arborvitae Seed", "柏子仁", "ハクシニン", "Semilla de Biota", "Lebensbaumsamen", "بذور تو야"),
    ("용안육", "HERB", "용안육", "Longan Aril", "龙眼肉", "リュウガンニク", "Arilo de Longan", "Longan-Arillus", "لونجان"),
    ("굴", "INGREDIENT", "굴", "Oyster", "牡蛎", "カキ", "Ostra", "Auster", "محار"),
    ("뱀장어", "INGREDIENT", "뱀장어", "Eel", "鳗鱼", "ウナギ", "Anguila", "Aal", "ثعبان البحر"),
    ("톳", "INGREDIENT", "톳", "Hijiki Seaweed", "羊栖菜", "ヒジキ", "Hijiki", "Hijiki-Alge", "هيجيكي"),
    ("율무", "INGREDIENT", "율무", "Adlay Grain", "薏米", "ハトムギ", "Adlay", "Hiobsträne", "عشب الشعير"),
    ("좁쌀", "INGREDIENT", "좁쌀", "Millet", "小米", "アワ", "Mijo", "Hirse", "دخن"),
    ("두부", "INGREDIENT", "두부", "Tofu", "豆腐", "豆腐", "Tofu", "Tofu", "توفو"),
    ("쪽파", "INGREDIENT", "쪽파", "Green Onion", "小葱", "ワケギ", "Cebolleta", "Frühlingszwiebel", "بصل أخضر"),
    ("청양고추", "INGREDIENT", "청양고추", "Hot Pepper", "青阳辣椒", "チョンヤン唐辛子", "Chile Picante", "Scharfer Chili", "فلفل حار"),
    ("참치 액", "INGREDIENT", "참치 액", "Tuna Sauce", "金枪鱼露", "ツナ液", "Salsa de Atún", "Thunfischsauce", "صلصة التونة"),
    ("다진 마늘", "INGREDIENT", "다진 마늘", "Minced Garlic", "蒜泥", "おろしニンニ크", "Ajo Picado", "Gehackter Knoblauch", "ثوم مفروم"),
    ("다진마늘", "INGREDIENT", "다진마늘", "Minced Garlic", "蒜泥", "おろしニンニ크", "Ajo Picado", "Gehackter Knoblauch", "ثوم مفروم"),
    ("후추 약간", "INGREDIENT", "후추 약간", "a pinch of pepper", "胡椒少许", "コショウ少々", "una pizca de pimienta", "eine Prise Pfeffer", "رشة فلفل"),
    ("후추약간", "INGREDIENT", "후추약간", "a pinch of pepper", "胡椒少许", "コショウ少々", "una pizca de pimienta", "eine Prise Pfeffer", "رشة فلفل"),
    ("참기름", "INGREDIENT", "참기름", "Sesame Oil", "芝麻油", "ごま油", "Aceite de Sésamo", "Sesamöl", "زيت السمسم"),
    ("식용유", "INGREDIENT", "식용유", "Cooking Oil", "食用油", "サラダ油", "Aceite de Cocina", "Speiseöl", "زيت طهي"),
    ("고추가루", "INGREDIENT", "고추가루", "Red Pepper Powder", "辣椒粉", "唐辛子粉", "Chile en Polvo", "Chilipulver", "مسحوق الفلفل الأحمر"),
    ("다시마", "INGREDIENT", "다시마", "Kelp", "昆布", "昆布", "Alga Kelp", "Seetang", "عشب البحر"),
    ("멸치육수", "INGREDIENT", "멸치육수", "Anchovy Stock", "鳀鱼高汤", "煮干し出汁", "Caldo de Anchoa", "Sardellenbrühe", "مرق الأنشوجة"),
    ("새송이버섯", "INGREDIENT", "새송이버섯", "King Oyster Mushroom", "杏鲍菇", "エリンギ", "Hongo Eringii", "Kräuterseitling", "فطر المحار الملكي"),
    ("대파", "INGREDIENT", "대파", "Green Onion", "大葱", "大ネギ", "Cebolleta", "Frühlingszwiebel", "بصل أخضر"),
    ("국간장", "INGREDIENT", "국간장", "Soup Soy Sauce", "汤酱油", "スープ醤油", "Salsa de Soja para Sopa", "Suppen-Sojasauce", "صلصة صويا الحساء"),
    ("미역", "INGREDIENT", "미역", "Seaweed", "海带", "ワカメ", "Alga Miyeok", "Seetang", "عشب البحر"),
    ("찬밥", "INGREDIENT", "찬밥", "Cold Rice", "冷饭", "冷やご飯", "Arroz Frío", "Kalter Reis", "أرز بارد"),
    ("계란", "INGREDIENT", "계란", "Egg", "鸡蛋", "卵", "Huevo", "Ei", "بيض"),
    ("부추", "INGREDIENT", "부추", "Chives", "韭菜", "ニラ", "Cebollino", "Schnittlauch", "ثوم معمر"),
    ("손질된 장어", "INGREDIENT", "손질된 장어", "cleaned eel", "处理好的鳗鱼", "下処理されたウナギ", "anguila limpia", "gesäuberter Aal", "ثعبان بحر نظيف"),
    ("손질한 콩나물", "INGREDIENT", "손질한 콩나물", "cleaned bean sprouts", "拣好的豆芽", "下処理された豆もやし", "brotes de soja limpios", "gesäuberte Sojasprossen", "براعم فاصوليا نظيفة"),
    # Units
    ("1/2컵", "UNIT", "1/2컵", "1/2 cup", "1/2杯", "1/2カップ", "1/2 taza", "1/2 Tasse", "1/2 كوب"),
    ("1모(160g)", "UNIT", "1모(160g)", "1 block (160g)", "1块(160g)", "1丁(160g)", "1 bloque (160g)", "1 Block (160g)", "قالب واحد (160 جم)"),
    ("5개", "UNIT", "5개", "5 pcs", "5个", "5個", "5 piezas", "5 Stück", "5 قطع"),
    ("1개", "UNIT", "1개", "1 pc", "1个", "1個", "1 pieza", "1 Stück", "قطعة واحدة"),
    ("1t", "UNIT", "1t", "1 tsp", "1小勺", "1t", "1 cdta", "1 TL", "ملعقة صغيرة"),
    ("3마리", "UNIT", "3마리", "3 pcs", "3条", "3匹", "3 piezas", "3 Stück", "3 قطع"),
    ("2~3cm길이로", "UNIT", "2~3cm길이로", "in 2-3cm length", "切成2-3cm长", "2〜3cmの長さに", "de 2-3 cm de largo", "in 2-3 cm Länge", "بطول 2-3 سم"),
    ("1큰술", "UNIT", "1큰술", "1 tbsp", "1大勺", "1大さじ", "1 cucharada", "1 EL", "ملعقة كبيرة"),
    ("2큰술", "UNIT", "2큰술", "2 tbsp", "2大勺", "2大さじ", "2 cucharadas", "2 EL", "ملعقتين كبيرتين"),
    ("6컵", "UNIT", "6컵", "6 cups", "6杯", "6カップ", "6 tazas", "6 Tassen", "6 أكواب"),
    ("2줌", "UNIT", "2줌", "2 handfuls", "2把", "2掴み", "2 puñados", "2 Hände voll", "حفنتين"),
    ("1대", "UNIT", "1대", "1 pc", "1根", "1本", "1 tallo", "1 Stange", "قطعة واحدة"),
    ("3큰술", "UNIT", "3큰술", "3 tbsp", "3大勺", "3大さじ", "3 cucharadas", "3 EL", "3 ملاعق كبيرة"),
    # Recipes & Others
    ("톳국", "RECIPE", "톳국", "Hijiki Seaweed Soup", "羊栖菜汤", "ヒジキスープ", "Sopa de Hijiki", "Hijiki-Algensuppe", "حساء هيجيكي"),
    ("장어국", "RECIPE", "장어국", "Eel Soup", "鳗鱼汤", "ウ나기スープ", "Sopa de Anguila", "Aalsuppe", "حساء ثعبان البحر"),
    ("바닷말", "INGREDIENT", "바닷말", "Seaweed", "海藻", "海草", "Alga Marina", "Seetang", "أعشاب بحرية"),
    # Sasang, Organs, Seasons, etc
    ("SE", "CONSTITUTION", "SE", "So-Eum", "少阴人", "少陰人", "So-Eum", "So-Eum", "سو-أوم"),
    ("SY", "CONSTITUTION", "SY", "So-Yang", "少阳人", "少陽人", "So-Yang", "So-Yang", "سو-يانغ"),
    ("TE", "CONSTITUTION", "TE", "Tae-Eum", "太阴人", "太陰人", "Tae-Eum", "Tae-Eum", "تاي-أوم"),
    ("TY", "CONSTITUTION", "TY", "Tae-Yang", "太阳人", "太陽人", "Tae-Yang", "Tae-Yang", "تاي-يانغ"),
    ("SPLEEN", "ORGAN", "SPLEEN", "Spleen", "脾脏", "脾臓", "Bazo", "Milz", "الطحال"),
    ("KIDNEY", "ORGAN", "KIDNEY", "Kidney", "肾脏", "腎臓", "Riñón", "Niere", "الكلية"),
    ("LIVER", "ORGAN", "LIVER", "Liver", "肝脏", "肝臓", "Hígado", "Leber", "الكبد"),
    ("HEART", "ORGAN", "HEART", "Heart", "心脏", "心臓", "Corazón", "Herz", "القلب"),
    ("LUNG", "ORGAN", "LUNG", "Lung", "肺脏", "肺臓", "Pulmón", "Lunge", "الرئة"),
    ("망종", "SOLAR_TERM", "망종", "Mangjong", "芒种", "芒種", "Mangjong", "Mangjong", "مانغجونغ"),
    ("동지", "SOLAR_TERM", "동지", "Dongji", "冬至", "冬至", "Dongji", "Dongji", "دونغجي"),
    ("여름", "SEASON", "여름", "Summer", "夏季", "夏", "Verano", "Sommer", "الصيف"),
    ("겨울", "SEASON", "겨울", "Winter", "冬季", "冬", "Invierno", "Winter", "الشتاء"),
    # Functions Comb & Definitions
    ("체력회복 (보기·익기), 건비 (비위 기능 강화)", "FUNCTIONS_COMB", "체력회복 (보기·익기), 건비 (비위 기능 강화)", "Energy Recovery (Qi Tonifying), Spleen Invigoration (Strengthen Spleen & Stomach)", "恢复体力 (补气·益气), 健脾 (加强脾胃功能)", "体力回復 (補気・益気), 健脾 (脾胃機能強化)", "Recuperación de Energía (Tonificación de Qi), Tonificación de Bazo (Fortalecer Bazo y Estómago)", "Energieerholung (Qi-Tonisierung), Milztonisierung (Milz & Magen stärken)", "استعادة الطاقة (تقوية تشي)، تقوية الطحال (تعزيز وظائف الطحال والمعدة)"),
    ("혈류개선 (활혈·거어), 기순환 (행기·소간), 통락 (경락 소통)", "FUNCTIONS_COMB", "혈류개선 (활혈·거어), 기순환 (행기·소간), 통락 (경락 소통)", "Blood Flow Improvement (Promote Blood Circulation), Qi Circulation (Regulate Qi), Meridian Clearing (Clear Meridians)", "改善血流 (活血·化瘀), 气循环 (行气·疏肝), 通络 (疏通经络)", "血流改善 (活血・去瘀), 気循環 (行気・疎肝), 通絡 (経絡疎通)", "Mejora del Flujo Sanguíneo (Promover Circulación Sanguínea), Circulación de Qi (Regular Qi), Apertura de Meridianos (Despejar Meridianos)", "Durchblutungsverbesserung (Blutzirkulation fördern), Qi-Zirkulation (Qi regulieren), Meridianöffnung (Meridiane befreien)", "تحسين تدفق الدم (نشاط الدورة الدموية)، دورة الطاقة (تنظيم تشي)، فتح المسارات (تسليك القنوات)"),
    ("수분배출 (이수·이뇨·부종 관리), 해독 (독성 제거), 소화개선 (화위)", "FUNCTIONS_COMB", "수분배출 (이수·이뇨·부종 관리), 해독 (독성 제거), 소화개선 (화위)", "Water Elimination (Diuresis & Edema Management), Detoxification (Toxin Removal), Digestion Improvement (Harmonize Stomach)", "排出水分 (利水·利尿·水肿管理), 解毒 (清除毒素), 改善消化 (和胃)", "水分排出 (利水・利尿・浮腫管理), 解毒 (毒素除去), 消化改善 (和胃)", "Eliminación de Agua (Diuresis y Manejo de Edema), Desintoxicación (Eliminación de Toxinas), Mejora de la Digestión (Armonizar Estómago)", "Wasserelimination (Diurese & Ödemmanagement), Entgiftung (Toxinentfernung), Verdauungsverbesserung (Magen harmonisieren)", "تصريف المياه (إدرار البول وإدارة الوذمة)، إزالة السموم (إزالة السموم)، تحسين الهضم (تهدئة المعدة)"),
    ("조직회복 (생기·재생), 혈액보충 (양혈·보혈), 면역조절", "FUNCTIONS_COMB", "조직회복 (생기·재생), 혈액보충 (양혈·보혈), 면역조절", "Tissue Recovery (Tissue Regeneration), Blood Supplementation (Nourish Blood), Immune Regulation", "组织恢复 (生肌·再生), 补充血液 (养血·补血), 免疫调节", "組織回復 (生肌・再生), 血液補充 (養血・補血), 免疫調節", "Recuperación de Tejidos (Regeneración de Tejidos), Suplementación de Sangre (Nutrir Sangre), Regulación Inmunológica", "Gewebeerholung (Geweberegeneration), Blutergänzung (Blut nähren), Immunregulation", "تعافي الأنسجة (تجديد الأنسجة)، تعويض الدم (تغذية الدم)، تنظيم المناعة"),
    ("신경안정 (안신·정경), 수면안정 (숙면 지원), 진정 (흥분 완화)", "FUNCTIONS_COMB", "신경안정 (안신·정경), 수면안정 (숙면 지원), 진정 (흥분 완화)", "Nerve Calming (Calm Mind), Sleep Stabilization (Support Deep Sleep), Sedation (Ease Excitement)", "神经安定 (安神·定惊), 稳定睡眠 (支持熟睡), 镇静 (缓解兴奋)", "神経安定 (安神・定驚), 睡眠安定 (熟睡支援), 鎮静 (興奮緩和)", "Calmante Nervioso (Calmar la Mente), Estabilización del Sueño (Apoyar Sueño Profundo), Sedación (Aliviar Excitación)", "Nervenberuhigung (Geist beruhigen), Schlafstabilisierung (Tiefschlaf unterstützen), Sedierung (Erregung lindern)", "تهدئة الأعصاب (هدوء العقل)، تثبيت النوم (دعم النوم العميق)، تهدئة (تخفيف الإثارة)"),
    ("기력 저하 및 피로", "ST_DEF", "기력 저하 및 피로", "Low energy and fatigue", "气力低下及疲劳", "気力低下および疲労", "Baja energía y fatiga", "Energiemangel und Müdigkeit", "ضعف الطاقة والتعب"),
    ("수면 불균형 및 불면", "ST_DEF", "수면 불균형 및 불면", "Sleep imbalance and insomnia", "睡眠失衡及失眠", "睡眠不均衡および不眠", "Desequilibrio del sueño e insomnio", "Schlafstörungen und Schlaflosigkeit", "خلل في النوم وأرق"),
    ("말초 순환 저하", "ST_DEF", "말초 순환 저하", "Decreased peripheral circulation", "末梢循环低下", "末梢循環低下", "Disminución de la circulación periférica", "Verminderte periphere Zirkulation", "انخفاض الدورة الدموية الطرفية"),
    ("체내 수분 정체 및 부종", "ST_DEF", "체내 수분 정체 및 부종", "Body fluid retention and edema", "体内水分滞留及水肿", "体内水分滞留および浮腫", "Retención de líquidos corporales y edema", "Flüssigkeitsretention und Ödeme", "احتباس سوائل الجسم والوذمة"),
    ("위장 및 장 기능 저하", "ST_DEF", "위장 및 장 기능 저하", "Gastrointestinal hypofunction", "胃肠功能低下", "胃および腸機能低下", "Hipofunción gastrointestinal", "Magen-Darm-Unterfunktion", "ضعف وظائف المعدة والأمعاء"),
    ("피부 건조 및 탄력 저하", "ST_DEF", "피부 건조 및 탄력 저하", "Dry skin and reduced elasticity", "皮肤干燥及弹性低下", "皮膚乾燥および弾力低下", "Piel seca y elasticidad reducida", "Trockene Haut und verminderte Elastizität", "جفاف الجلد وقلة المرونة"),
    ("스트레스 및 신경 불안정", "ST_DEF", "스트레스 및 신경 불안정", "Stress and nervous instability", "压力及神经不稳定", "ストレスおよび神経不安定", "Estrés e inestabilidad nerviosa", "Stress und nervöse Instabilität", "الإجهاد وعدم الاستقرار العصبي"),
    ("근육 긴장 및 관절 약화", "ST_DEF", "근육 긴장 및 관절 약화", "Muscle tension and joint weakness", "肌肉紧张及关节衰弱", "筋肉緊張および関節弱体化", "Tensión muscular y debilidad articular", "Muskelverspannung und Gelenkschwäche", "توتر العضلات وضعف المفاصل"),
    ("안구 건조 및 피로", "ST_DEF", "안구 건조 및 피로", "Dry eyes and eye fatigue", "干眼症及眼疲劳", "ドライアイおよび目のかすみ", "Ojos secos y fatiga ocular", "Trockene Augen und Augenmüdigkeit", "جفاف العين وتعب العين"),
    ("비뇨 배출 이상", "ST_DEF", "비뇨 배출 이상", "Urinary excretion abnormality", "排尿异常", "排尿異常", "Anomalía de la excreción urinaria", "Auffälligkeit der Harnausscheidung", "غير طبيعي في إفراز البول"),
    ("여성 호르몬 및 생리 조절", "ST_DEF", "여성 호르몬 및 생리 조절", "Female hormone and menstrual regulation", "女性荷尔蒙及月经调节", "女性ホルモンおよび生理調節", "Hormonas femeninas y regulación menstrual", "Weibliche Hormone und Menstruationsregulation", "الهرمونات الأنثوية وتنظيم الدورة الشهرية"),
    ("기침 및 가래", "ST_DEF", "기침 및 가래", "Cough and sputum", "咳嗽及咳痰", "咳および痰", "Tos y esputo", "Husten und Schleim", "السعال والبلغم"),
    ("면역 조절 및 회복 지연", "ST_DEF", "면역 조절 및 회복 지연", "Immune regulation and delayed recovery", "免疫调节及恢复延迟", "免疫調節および回復遅延", "Regulación inmunológica y recuperación tardía", "Immunregulation und verzögerte Erholung", "تنظيم المناعة وتأخر التعافي"),
    ("기억력 저하 및 브레인포그", "ST_DEF", "기억력 저하 및 브레인포그", "Memory decline and brain fog", "记忆力低下及脑雾", "記憶力低下およびブレインフォグ", "Deterioro de la memoria y neblina mental", "Gedächtnisabbau und Gehirnnebel", "تراجع الذاكرة وضباب الدماغ"),
    ("구강 건조 및 염증", "ST_DEF", "구강 건조 및 염증", "Dry mouth and inflammation", "口腔干燥及炎症", "口腔乾燥および炎症", "Boca seca e inflamación", "Mundtrockenheit und Entzündung", "جفاف الفم والالتهابات"),
    ("급격한 체중 변화", "ST_DEF", "급격한 체중 변화", "Rapid weight change", "体重急剧变化", "急激な体重変化", "Cambio rápido de peso", "Schnelle Gewichtsveränderung", "تغيير سريع في الوزن"),
    ("상열하한 및 오한", "ST_DEF", "상열하한 및 오한", "Upper body heat, lower body cold, and chills", "上热下寒及恶寒", "上熱下寒および悪寒", "Calor superior, frío inferior y escalofríos", "Oberkörperhitze, Unterkörperkälte und Frösteln", "حرارة في الجزء العلوي، برودة في الجزء السفلي وقشعريرة"),
    ("이명 및 이충만감", "ST_DEF", "이명 및 이충만감", "Tinnitus and ear fullness", "耳鸣及耳闷胀感", "耳鳴りおよび耳閉感", "Tinnitus y plenitud del oído", "Tinnitus und Ohrendruck", "طنين الأذن وامتلائها"),
    # General terms
    ("조리법", "CORE", "조리법", "Cooking Method", "烹饪方法", "調理法", "Instrucciones de Cocina", "Kochanleitung", "طريقة الطهي"),
    ("약선 업그레이드 조리법", "CORE", "약선 업그레이드 조리법", "Yakseon Upgrade Instructions", "药膳升级烹饪指导", "薬膳アップグレード調理ガイド", "Instrucciones de Mejora de Yakseon", "Yakseon Upgrade Anleitung", "تعليمات ترقية ياكسيون"),
    ("ST-001", "STATE", "에너지계", "Energy System", "能量系统", "エネルギー系", "Sistema de Energía", "Energiesystem", "نظام الطاقة"),
    ("ST-002", "STATE", "수면계", "Sleep System", "睡眠系统", "睡眠系", "Sistema de Sueño", "Schlafsystem", "نظام النوم"),
    ("ST-003", "STATE", "순환계", "Circulation System", "循环系统", "循環系", "Sistema de Circulación", "Zirkulationssystem", "نظام الدورة الدموية"),
    ("ST-004", "STATE", "체액계", "Body Fluid System", "体液系统", "体液系", "Sistema de Fluidos", "Flüssigkeitssystem", "نظام سوائل الجسم"),
    ("ST-005", "STATE", "소화계", "Digestive System", "消化系统", "消化系", "Sistema Digestivo", "Verdauungssystem", "الجهاز الهضمي"),
    ("ST-006", "STATE", "피부계", "Skin System", "皮肤系统", "皮膚系", "Sistema de Piel", "Hautsystem", "نظام الجلد"),
    ("ST-007", "STATE", "정서계", "Emotional System", "情绪系统", "情緒系", "Sistema Emocional", "Emotionales System", "النظام العاطفي"),
    ("ST-008", "STATE", "근골격계", "Musculoskeletal System", "肌骨系统", "筋骨格系", "Sistema Musculoesquelético", "Muskuloskelettales System", "الجهاز العضلي الهيكلي"),
    ("ST-009", "STATE", "시각·안구계", "Visual System", "视觉系统", "視覚系", "Sistema Visual", "Visuelles System", "نظام العين"),
    ("ST-010", "STATE", "비뇨생식계", "Urogenital System", "泌尿系统", "泌尿生殖系", "Sistema Urogenital", "Urogenitalsystem", "الجهاز البولي التناسلي"),
    ("ST-011", "STATE", "여성건강계", "Women's Health", "女性健康", "女性健康系", "Salud Femenina", "Frauengesundheit", "صحة المرأة"),
    ("ST-012", "STATE", "호흡기계", "Respiratory System", "呼吸系统", "呼吸器系", "Sistema Respiratorio", "Atmungssystem", "الجهاز التنفسي"),
    ("ST-013", "STATE", "면역·회복계", "Immune System", "免疫系统", "免疫回復系", "Sistema Inmune", "Immunsystem", "المناعة والتعافي"),
    ("ST-014", "STATE", "브레인포그·인지계", "Cognitive System", "认知系统", "認知系", "Sistema Cognitivo", "Kognitionssystem", "ضباب الدماغ"),
    ("ST-015", "STATE", "구강계", "Oral System", "口腔系统", "口腔系", "Sistema Oral", "Oralsystem", "نظام الفم"),
    ("ST-016", "STATE", "체중계", "Weight System", "体重系统", "体重系", "Sistema de Peso", "Gewichtssystem", "نظام الوزن"),
    ("ST-017", "STATE", "체온·열감계", "Body Temperature System", "体温系统", "体温熱感系", "Sistema de Temperatura", "Temperatursystem", "نظام حرارة الجسم"),
    ("ST-018", "STATE", "청각계", "Auditory System", "听觉系统", "聴覚系", "Sistema Auditivo", "Auditorisches System", "الجهاز السمعي"),
    # Key Herbs and Ingredients
    ("황기", "HERB", "황기", "Milkvetch Root", "黄芪", "オ우기", "Astrágalo", "Tragantwurzel", "قتاد"),
    ("인삼", "HERB", "인삼", "Korean Ginseng", "人参", "ニンジン", "Ginseng", "Ginseng", "جنسنغ"),
    ("당귀", "HERB", "당귀", "Angelica Root", "当归", "トウキ", "Angélica", "Engelwurz", "حشيشة الملاك"),
    ("천궁", "HERB", "천궁", "Cnidium Rhizome", "川芎", "センキュウ", "Cnidio", "Cnidium-Rhizom", "سنيديوم"),
    ("숙지황", "HERB", "숙지황", "Prepared Rehmannia", "熟地黄", "ジュクジオウ", "Rehmannia Preparada", "Rehmannia-Präparat", "رحمانية معالجة"),
    ("복령", "HERB", "복령", "Poria", "茯苓", "ブクリョウ", "Poria", "Poria", "بوريا"),
    ("의이인", "HERB", "의이인", "Coix Seed", "薏苡仁", "ヨクイニン", "Lágrima de Job", "Hiobsträne", "عشب الحبوب"),
    ("작약", "HERB", "작약", "Peony Root", "芍药", "シャクヤク", "Peonía", "Pfingstrosenwurzel", "جذر الفاوانيا"),
    ("진피", "HERB", "진피", "Tangerine Peel", "陈皮", "チンピ", "Piel de Mandarina", "Mandarinenschale", "قشر اليوسفي"),
    ("계피", "HERB", "계피", "Cinnamon", "桂皮", "ケイヒ", "Canela", "Zimt", "قرفة"),
    ("굴", "INGREDIENT", "굴", "Oyster", "牡蛎", "カキ", "Ostra", "Auster", "محار"),
    ("뱀장어", "INGREDIENT", "뱀장어", "Eel", "鳗鱼", "ウナギ", "Anguila", "Aal", "ثعبان البحر"),
    ("톳", "INGREDIENT", "톳", "Hijiki Seaweed", "羊栖菜", "ヒジキ", "Hijiki", "Hijiki-Alge", "هيجيكي"),
    ("율무", "INGREDIENT", "율무", "Adlay Grain", "薏米", "ハトムギ", "Adlay", "Hiobsträne", "عشب الشعير"),
    ("좁쌀", "INGREDIENT", "좁쌀", "Millet", "小米", "アワ", "Mijo", "Hirse", "دخن"),
    # Culinary terms
    ("조리법", "CORE", "조리법", "Cooking Method", "烹饪方法", "調理法", "Instrucciones de Cocina", "Kochanleitung", "طريقة الطهي"),
    ("약선 업그레이드 조리법", "CORE", "약선 업그레이드 조리법", "Yakseon Upgrade Instructions", "药膳升级烹饪指导", "薬膳アップグレード調理ガイド", "Instrucciones de Mejora de Yakseon", "Yakseon Upgrade Anleitung", "تعليمات ترقية ياكسيون")
]
df_multi_dict = pd.DataFrame(multi_dict_data, columns=["KEY", "TYPE", "ko", "en", "zh", "ja", "es", "de", "ar"])
save_matrix(os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS", "M04-12_MULTILINGUAL_DICTIONARY_v1.0.xlsx"), df_multi_dict, "M04-12_MULTILINGUAL_DICT")

print("=== All Upgraded Excel Matrices populated successfully! ===")

# Run Unified Knowledge Base Creator
import subprocess
print("\n=== Launching Unified Knowledge Base Creator (v2.0) ===")
kb_script = os.path.join(root_dir, "04_MAPPING_ENGINE", "build_unified_kb.py")
try:
    result = subprocess.run([sys.executable, kb_script], capture_output=True, text=True, check=True)
    print(result.stdout)
    print("✅ Unified Knowledge Base successfully compiled and integrated.")
except subprocess.CalledProcessError as e:
    print(f"❌ Error compiling Unified Knowledge Base: {e}")
    print(e.stderr)
    sys.exit(1)

print("\n=== MFCO BUILD PIPELINE COMPLETED SUCCESSFULLY ===")
