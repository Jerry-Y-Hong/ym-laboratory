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
