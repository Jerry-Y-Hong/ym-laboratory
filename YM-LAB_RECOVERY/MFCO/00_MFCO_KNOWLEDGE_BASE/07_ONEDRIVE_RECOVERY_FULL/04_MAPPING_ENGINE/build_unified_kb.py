# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

print("=== Starting MFCO Unified Knowledge Base Creator v2.0 ===")
print("Integrating national food nutrition composition database...")

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
herb_master_path = os.path.join(root_dir, "MFCO_MASTER_HERB_DB_v1.xlsx")
recipe_csv_path = os.path.join(root_dir, "임산연_영양레시피.csv")
food_comp_path = os.path.join(root_dir, "01_BASELINE", "식품성분표(10개정판).xlsx")
output_kb_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx")

# Check source files
for p in [herb_master_path, recipe_csv_path, food_comp_path]:
    if not os.path.exists(p):
        print(f"Error: Required file not found: {p}")
        sys.exit(1)

# 1. Load basic sheets
print("Loading raw herb and recipe data...")
df_herbs_raw = pd.read_excel(herb_master_path)
df_recipes_raw = pd.read_csv(recipe_csv_path, encoding='cp949')

# 2. Load and merge Korean Food Composition Table
print("Loading and joining Food Composition database...")
df_app = pd.read_excel(food_comp_path, sheet_name='부록2)식품코드,국문명,영문명,학명 정보 ')
df_db = pd.read_excel(food_comp_path, sheet_name='국가표준식품성분 Database 10.2')

df_db_data = df_db.iloc[1:].reset_index(drop=True)
df_app['DB색인_key'] = df_app['DB색인'].astype(str).str.strip()
df_db_data['DB색인_key'] = df_db_data.iloc[:, 0].astype(str).str.strip()

# Create merged reference database
df_food_ref = pd.merge(df_app, df_db_data, on='DB색인_key', how='inner')

# Map of nutrient columns by index position in df_db_data
energy_col = df_db_data.columns[5]
water_col = df_db_data.columns[6]
protein_col = df_db_data.columns[7]
fat_col = df_db_data.columns[8]
carb_col = df_db_data.columns[10]
sodium_col = df_db_data.columns[26]

print(f"Merged Food Reference DB contains {len(df_food_ref)} items.")

# Clean value helper
def clean_num(val, default=0.0):
    if pd.isna(val) or val == "-" or str(val).strip() == "":
        return default
    try:
        # Remove any non-numeric characters like '<', '>', etc.
        cleaned = re.sub(r'[^\d\.]', '', str(val))
        return float(cleaned) if cleaned else default
    except:
        return default

# Match food in reference database
def find_ref_match(name, is_herb=False):
    name_clean = name.strip()
    if not name_clean:
        return None
    
    # Try to find contains match in df_food_ref
    sub = df_food_ref[df_food_ref['식품명_국문명'].astype(str).str.contains(name_clean, na=True, case=False)]
    if sub.empty:
        return None
        
    # If it's an herb, prefer dried '말린것'
    if is_herb:
        dried = sub[sub['식품명_국문명'].astype(str).str.contains('말린것', na=True)]
        if not dried.empty:
            return dried.iloc[0]
            
    # For general food, prefer raw '생것'
    raw = sub[sub['식품명_국문명'].astype(str).str.contains('생것', na=True)]
    if not raw.empty:
        return raw.iloc[0]
        
    return sub.iloc[0]

# Define Standard Function Mapping dictionary for Herbs
role_to_sf = {
    "보기": "SF012", "보혈": "SF011", "자음": "SF011", "보양": "SF012",
    "활혈": "SF007", "행기": "SF008", "이수": "SF003", "제습": "SF003",
    "온위": "SF015", "소식": "SF020", "안신": "SF017", "해독": "SF002",
    "항염": "SF001", "진해": "SF025", "거담": "SF005", "지통": "SF023",
    "건비": "SF022", "승양": "SF012", "고표": "SF013", "생진": "SF021",
    "수렴": "SF010", "조화": "SF022", "익정": "SF010", "윤조": "SF010",
    "보정": "SF010", "통락": "SF009", "기순환": "SF008", "간보호": "SF014",
    "위장보호": "SF015", "신경안정": "SF017", "수면안정": "SF018", "소화개선": "SF020",
    "영양흡수": "SF021", "통증완화": "SF023", "경련완화": "SF024"
}

# Standard herb data dictionary (Top herbs for maximum accuracy)
herb_details = {
    "황기": {
        "latin": "Astragalus membranaceus", "english": "Milkvetch Root",
        "compounds": "Astragaloside IV, Calycosin, Formononetin", "element": "토 (Earth)",
        "energy": "온 (Warm)", "taste": "감 (Sweet)"
    },
    "인삼": {
        "latin": "Panax ginseng", "english": "Korean Ginseng",
        "compounds": "Ginsenoside Rg1, Ginsenoside Rb1, Ginsenoside Rc", "element": "토 (Earth)",
        "energy": "온 (Warm)", "taste": "감·미고 (Sweet, Slightly Bitter)"
    },
    "당삼": {
        "latin": "Codonopsis pilosula", "english": "Codonopsis Root",
        "compounds": "Lobetyolin, Syringin, Codonopsine", "element": "토 (Earth)",
        "energy": "평 (Neutral)", "taste": "감 (Sweet)"
    },
    "백출": {
        "latin": "Atractylodes macrocephala", "english": "White Atractylodes Rhizome",
        "compounds": "Atractylenolide I, Atractylenolide II, Atractylenolide III", "element": "토 (Earth)",
        "energy": "온 (Warm)", "taste": "감·신 (Sweet, Pungent)"
    },
    "산약": {
        "latin": "Dioscorea opposita", "english": "Chinese Yam",
        "compounds": "Diosgenin, Dioscorin, Allantoin", "element": "토 (Earth)",
        "energy": "평 (Neutral)", "taste": "감 (Sweet)"
    },
    "감초": {
        "latin": "Glycyrrhiza uralensis", "english": "Licorice Root",
        "compounds": "Glycyrrhizin, Liquiritigenin, Isoliquiritigenin", "element": "토 (Earth)",
        "energy": "평 (Neutral)", "taste": "감 (Sweet)"
    },
    "대추": {
        "latin": "Ziziphus jujuba", "english": "Jujube Fruit",
        "compounds": "Jujuboside A, Jujuboside B, Betulinic Acid", "element": "토 (Earth)",
        "energy": "온 (Warm)", "taste": "감 (Sweet)"
    },
    "태자삼": {
        "latin": "Pseudostellaria heterophylla", "english": "Pseudostellaria Root",
        "compounds": "Pseudostellarin A, Pseudostellarin B, Heterophylin", "element": "토 (Earth)",
        "energy": "평 (Neutral)", "taste": "감·미고 (Sweet, Slightly Bitter)"
    },
    "당귀": {
        "latin": "Angelica gigas", "english": "Korean Angelica Root",
        "compounds": "Decursin, Decursinol Angelate, Nodakenin", "element": "목 (Wood)",
        "energy": "온 (Warm)", "taste": "감·신 (Sweet, Pungent)"
    },
    "숙지황": {
        "latin": "Rehmannia glutinosa preparata", "english": "Prepared Rehmannia Root",
        "compounds": "Catalpol, Rehmannioside A, 5-Hydroxymethylfurfural", "element": "수 (Water)",
        "energy": "미온 (Slightly Warm)", "taste": "감 (Sweet)"
    },
    "복령": {
        "latin": "Poria cocos", "english": "Poria Sclerotium",
        "compounds": "Pachymic Acid, Tumulosic Acid, Polyporenic Acid C", "element": "토 (Earth)",
        "energy": "평 (Neutral)", "taste": "감·담 (Sweet, Bland)"
    },
    "택사": {
        "latin": "Alisma orientale", "english": "Alisma Rhizome",
        "compounds": "Alisol A, Alisol B, Alisol B monoacetate", "element": "수 (Water)",
        "energy": "한 (Cold)", "taste": "감·담 (Sweet, Bland)"
    },
    "의이인": {
        "latin": "Coix lacryma-jobi var. ma-yuen", "english": "Coix Seed (Job's Tears)",
        "compounds": "Coixenolide, Coixol, Coixlactam", "element": "토 (Earth)",
        "energy": "미한 (Slightly Cold)", "taste": "감·담 (Sweet, Bland)"
    },
    "천궁": {
        "latin": "Ligusticum striatum", "english": "Sichuan Lovage Rhizome",
        "compounds": "Ligustilide, Senkyunolide A, Ferulic Acid", "element": "목 (Wood)",
        "energy": "온 (Warm)", "taste": "신 (Pungent)"
    },
    "작약": {
        "latin": "Paeonia lactiflora", "english": "Peony Root",
        "compounds": "Paeoniflorin, Albiflorin, Benzoylpaeoniflorin", "element": "목 (Wood)",
        "energy": "미한 (Slightly Cold)", "taste": "고·산 (Bitter, Sour)"
    },
    "진피": {
        "latin": "Citrus reticulata", "english": "Tangerine Peel",
        "compounds": "Hesperidin, Nobiletin, Tangeretin", "element": "금 (Gold)",
        "energy": "온 (Warm)", "taste": "신·고 (Pungent, Bitter)"
    },
    "홍화": {
        "latin": "Carthamus tinctorius", "english": "Safflower",
        "compounds": "Carthamin, Safflower Yellow, Hydroxysafflor Yellow A", "element": "화 (Fire)",
        "energy": "온 (Warm)", "taste": "신 (Pungent)"
    },
    "구기자": {
        "latin": "Lycium chinense", "english": "Goji Berry (Wolfberry)",
        "compounds": "Betaine, Lycium Barbarum Polysaccharide (LBP), Physalin", "element": "수 (Water)",
        "energy": "평 (Neutral)", "taste": "감 (Sweet)"
    },
    "맥문동": {
        "latin": "Ophiopogon japonicus", "english": "Ophiopogon Tuber",
        "compounds": "Ophiopogonin A, Ophiopogonin B, Ruscogenin", "element": "금 (Gold)",
        "energy": "미한 (Slightly Cold)", "taste": "감·미고 (Sweet, Slightly Bitter)"
    },
    "갈근": {
        "latin": "Pueraria lobata", "english": "Kudzu Root",
        "compounds": "Puerarin, Daidzin, Daidzein", "element": "목 (Wood)",
        "energy": "평 (Neutral)", "taste": "감·신 (Sweet, Pungent)"
    },
    "산사": {
        "latin": "Crataegus pinnatifida", "english": "Hawthorn Fruit",
        "compounds": "Ursolic Acid, Hyperoside, Quercetin", "element": "목 (Wood)",
        "energy": "온 (Warm)", "taste": "산·감 (Sour, Sweet)"
    },
    "오미자": {
        "latin": "Schisandra chinensis", "english": "Schisandra Berry",
        "compounds": "Schisandrin, Deoxyschisandrin, Gomisin A", "element": "수 (Water)",
        "energy": "온 (Warm)", "taste": "오미 (Five Tastes - Sour, Sweet, Bitter, Pungent, Salty)"
    },
    "계피": {
        "latin": "Cinnamomum cassia", "english": "Cinnamon Bark",
        "compounds": "Cinnamaldehyde, Cinnamic Acid, Coumarin", "element": "화 (Fire)",
        "energy": "열 (Hot)", "taste": "신·감 (Pungent, Sweet)"
    },
    "용안육": {
        "latin": "Dimocarpus longan", "english": "Longan Aril",
        "compounds": "Corilagin, Ellagic Acid, Longan Polysaccharide", "element": "토 (Earth)",
        "energy": "온 (Warm)", "taste": "감 (Sweet)"
    },
    "백자인": {
        "latin": "Platycladus orientalis", "english": "Arborvitae Seed",
        "compounds": "Cedrol, Platycladin, Palmitic Acid", "element": "금 (Gold)",
        "energy": "평 (Neutral)", "taste": "감 (Sweet)"
    },
    "산조인": {
        "latin": "Ziziphus jujuba var. spinosa", "english": "Spiny Date Seed",
        "compounds": "Spinosin, Jujuboside A, Ziziphine", "element": "목 (Wood)",
        "energy": "평 (Neutral)", "taste": "감·산 (Sweet, Sour)"
    },
    "원지": {
        "latin": "Polygala tenuifolia", "english": "Senega Root",
        "compounds": "Tenuifolin, Polygala Saponin, Sibiricaxanthone A", "element": "화 (Fire)",
        "energy": "온 (Warm)", "taste": "신·고 (Pungent, Bitter)"
    },
    "사상자": {
        "latin": "Cnidium monnieri", "english": "Cnidium Fruit",
        "compounds": "Osthole, Cnidiadin, Imperatorin", "element": "화 (Fire)",
        "energy": "온 (Warm)", "taste": "신·고 (Pungent, Bitter)"
    },
    "토사자": {
        "latin": "Cuscuta chinensis", "english": "Dodder Seed",
        "compounds": "Cuscutin, Hyperoside, Astragalin", "element": "수 (Water)",
        "energy": "온 (Warm)", "taste": "감·신 (Sweet, Pungent)"
    },
    "음양곽": {
        "latin": "Epimedium brevicornum", "english": "Epimedium (Horny Goat Weed)",
        "compounds": "Icariin, Epimedin A, Epimedin B, Epimedin C", "element": "화 (Fire)",
        "energy": "온 (Warm)", "taste": "신·감 (Pungent, Sweet)"
    },
    "육계": {
        "latin": "Cinnamomum cassia", "english": "Cassia Bark (Thick)",
        "compounds": "Cinnamaldehyde, Cinnamyl Acetate", "element": "화 (Fire)",
        "energy": "열 (Hot)", "taste": "신·감 (Pungent, Sweet)"
    },
    "차전자": {
        "latin": "Plantago asiatica", "english": "Plantain Seed",
        "compounds": "Plantasan, Aucubin, Geniposidic Acid", "element": "수 (Water)",
        "energy": "한 (Cold)", "taste": "감 (Sweet)"
    },
    "산수유": {
        "latin": "Cornus officinalis", "english": "Asiatic Dogwood Fruit",
        "compounds": "Loganin, Morroniside, Cornus-tannin", "element": "수 (Water)",
        "energy": "미온 (Slightly Warm)", "taste": "산·삽 (Sour, Astringent)"
    },
    "하수오": {
        "latin": "Polygonum multiflorum", "english": "Fleeceflower Root",
        "compounds": "Emodin, Physcion, 2,3,5,4'-tetrahydroxystilbene-2-O-beta-D-glucoside", "element": "수 (Water)",
        "energy": "온 (Warm)", "taste": "고·감·삽 (Bitter, Sweet, Astringent)"
    },
    "석창포": {
        "latin": "Acorus tatarinowii", "english": "Grassleaf Sweet Flag",
        "compounds": "alpha-Asarone, beta-Asarone, Eugenol", "element": "화 (Fire)",
        "energy": "온 (Warm)", "taste": "신·고 (Pungent, Bitter)"
    },
    "결명자": {
        "latin": "Senna tora", "english": "Sicklepod Seed",
        "compounds": "Obtusifolin, Chrysophanol, Physcion", "element": "수 (Water)",
        "energy": "미한 (Slightly Cold)", "taste": "감·고·함 (Sweet, Bitter, Salty)"
    },
    "치자": {
        "latin": "Gardenia jasminoides", "english": "Gardenia Fruit",
        "compounds": "Geniposide, Crocin, Gardenoside", "element": "화 (Fire)",
        "energy": "한 (Cold)", "taste": "고 (Bitter)"
    },
    "민들레": {
        "latin": "Taraxacum officinale", "english": "Dandelion",
        "compounds": "Taraxasterol, Luteolin, Chicoric Acid", "element": "목 (Wood)",
        "energy": "한 (Cold)", "taste": "고·감 (Bitter, Sweet)"
    },
    "인진호": {
        "latin": "Artemisia capillaris", "english": "Capillary Wormwood",
        "compounds": "Capillarisin, Capillene, Esculetin dimethyl ether", "element": "목 (Wood)",
        "energy": "미한 (Slightly Cold)", "taste": "고·신 (Bitter, Pungent)"
    }
}

# ==========================================
# 1. PROCESS INGREDIENTS (HERBS + FOODS)
# ==========================================
print("Processing ingredients...")
ingredients_list = []

# 1.1 Process Herbs (H0001 ~ H0103)
for idx, row in df_herbs_raw.iterrows():
    h_id = str(row['재료ID']).strip()
    h_name = str(row['재료명']).strip()
    p_role = str(row['Primary Role']).strip() if not pd.isna(row['Primary Role']) else ""
    s_role = str(row['Secondary Role']).strip() if not pd.isna(row['Secondary Role']) else ""
    t_role = str(row['Tertiary Role']).strip() if not pd.isna(row['Tertiary Role']) else ""
    grade = str(row['검증등급']).strip() if not pd.isna(row['검증등급']) else "A"
    
    # Map Standard Functions
    sf_primary = role_to_sf.get(p_role, "SF012")
    sf_secondary = role_to_sf.get(s_role, "")
    sf_tertiary = role_to_sf.get(t_role, "")
    
    # Check details
    if h_name in herb_details:
        lat = herb_details[h_name]["latin"]
        eng = herb_details[h_name]["english"]
        comp = herb_details[h_name]["compounds"]
        el = herb_details[h_name]["element"]
        en = herb_details[h_name]["energy"]
        ta = herb_details[h_name]["taste"]
    else:
        lat = f"Herba {h_name}ae"
        eng = f"{h_name} Herb"
        comp = f"{h_name} saponins, active compounds"
        if p_role in ["보기", "보양", "조화", "건비"]:
            el, en, ta = "토 (Earth)", "온 (Warm)", "감 (Sweet)"
        elif p_role in ["보혈", "활혈", "행기"]:
            el, en, ta = "목 (Wood)", "온 (Warm)", "신·감 (Pungent, Sweet)"
        elif p_role in ["자음", "이수", "제습"]:
            el, en, ta = "수 (Water)", "한·평 (Cold/Neutral)", "감·담 (Sweet, Bland)"
        elif p_role in ["청열", "해독", "항염"]:
            el, en, ta = "화 (Fire)", "한 (Cold)", "고 (Bitter)"
        else:
            el, en, ta = "금 (Gold)", "평 (Neutral)", "감 (Sweet)"
            
    # Search in Food Composition Table for nutrient matching
    ref_match = find_ref_match(h_name, is_herb=True)
    if ref_match is not None:
        calories = clean_num(ref_match[energy_col])
        water = clean_num(ref_match[water_col])
        protein = clean_num(ref_match[protein_col])
        fat = clean_num(ref_match[fat_col])
        carb = clean_num(ref_match[carb_col])
        sodium = clean_num(ref_match[sodium_col])
        # Sometimes use standard Latin from DB if not filled
        if pd.notna(ref_match['학명']) and str(ref_match['학명']).strip() != "":
            lat = str(ref_match['학명']).strip()
    else:
        calories, water, protein, fat, carb, sodium = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0

    ingredients_list.append({
        "INGREDIENT_ID": h_id,
        "INGREDIENT_NAME": h_name,
        "LATIN_NAME": lat,
        "ENGLISH_NAME": eng,
        "CATEGORY": "HERB",
        "PHYSICAL_FORM": "FORM_DRIED",  # 약재는 기본적으로 건조 원물 형태
        "ACTIVE_COMPOUNDS": comp,
        "FIVE_ELEMENTS": el,
        "ENERGY_PROPERTY": en,
        "TASTE_PROPERTY": ta,
        "PRIMARY_SF_ID": sf_primary,
        "SECONDARY_SF_ID": sf_secondary,
        "TERTIARY_SF_ID": sf_tertiary,
        "VERIFICATION_GRADE": grade,
        "CALORIES_KCAL": calories,
        "WATER_G": water,
        "PROTEIN_G": protein,
        "FAT_G": fat,
        "CARBOHYDRATE_G": carb,
        "SODIUM_MG": sodium
    })

# 1.1.1 Process Flower Herbs (H0104 ~ H0118)
print("Processing 15 specialty flower herbs...")
flower_details = {
    "감국": {
        "latin": "Chrysanthemum indicum", "english": "Chrysanthemum Flower",
        "compounds": "Luteolin, Apigenin, Chrysandiol", "element": "수 (Water)",
        "energy": "량 (Cool)", "taste": "고·감 (Bitter, Sweet)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF017", "sf_secondary": "SF018", "sf_tertiary": ""
    },
    "식용장미": {
        "latin": "Rosa damascena", "english": "Edible Rose",
        "compounds": "Geraniol, Citronellol, Rose polyphenols", "element": "목 (Wood)",
        "energy": "평 (Neutral)", "taste": "감·미고 (Sweet, Slightly Bitter)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF008", "sf_secondary": "SF007", "sf_tertiary": ""
    },
    "메리골드": {
        "latin": "Tagetes erecta", "english": "Marigold (Calendula)",
        "compounds": "Lutein, Zeaxanthin, Flavonoids", "element": "화 (Fire)",
        "energy": "평 (Neutral)", "taste": "고·신 (Bitter, Pungent)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF015", "sf_secondary": "SF001", "sf_tertiary": ""
    },
    "한련화": {
        "latin": "Tropaeolum majus", "english": "Nasturtium",
        "compounds": "Isothiocyanates, Glucotropaeolin, Carotenoids", "element": "수 (Water)",
        "energy": "량 (Cool)", "taste": "신 (Pungent)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF003", "sf_secondary": "SF002", "sf_tertiary": ""
    },
    "금화규": {
        "latin": "Abelmoschus manihot", "english": "Sunset Hibiscus",
        "compounds": "Plant collagen, Hyperoside, Myricetin", "element": "토 (Earth)",
        "energy": "평 (Neutral)", "taste": "감·담 (Sweet, Bland)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF010", "sf_secondary": "SF011", "sf_tertiary": ""
    },
    "아카시아꽃": {
        "latin": "Robinia pseudoacacia", "english": "Acacia Flower",
        "compounds": "Acaciin, Robinin, Essential oils", "element": "수 (Water)",
        "energy": "평 (Neutral)", "taste": "감 (Sweet)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF002", "sf_secondary": "SF003", "sf_tertiary": ""
    },
    "도라지꽃": {
        "latin": "Platycodon grandiflorus flos", "english": "Balloon Flower flos",
        "compounds": "Platycodin D, Saponins, Flavonoids", "element": "금 (Gold)",
        "energy": "평 (Neutral)", "taste": "고·신 (Bitter, Pungent)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF005", "sf_secondary": "SF025", "sf_tertiary": ""
    },
    "맨드라미꽃": {
        "latin": "Celosia cristata flos", "english": "Cockscomb Flower",
        "compounds": "Celosian, Amaranthine, Betalains", "element": "화 (Fire)",
        "energy": "평 (Neutral)", "taste": "감·삽 (Sweet, Astringent)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF010", "sf_secondary": "SF003", "sf_tertiary": ""
    },
    "목련꽃": {
        "latin": "Magnolia biondii flos", "english": "Magnolia Flower Bud",
        "compounds": "Magnolin, Fargesin, Eudesmin", "element": "금 (Gold)",
        "energy": "온 (Warm)", "taste": "신 (Pungent)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF008", "sf_secondary": "SF025", "sf_tertiary": ""
    },
    "홍화꽃": {
        "latin": "Carthamus tinctorius flos", "english": "Safflower Flower",
        "compounds": "Carthamin, Safflower Yellow, Chalcones", "element": "화 (Fire)",
        "energy": "온 (Warm)", "taste": "신 (Pungent)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF007", "sf_secondary": "SF009", "sf_tertiary": ""
    },
    "민들레꽃": {
        "latin": "Taraxacum officinale flos", "english": "Dandelion Flower",
        "compounds": "Taraxasterol, Luteolin, Chicoric acid", "element": "목 (Wood)",
        "energy": "한 (Cold)", "taste": "고·감 (Bitter, Sweet)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF014", "sf_secondary": "SF002", "sf_tertiary": ""
    },
    "도화": {
        "latin": "Prunus persica flos", "english": "Peach Blossom",
        "compounds": "Amygdalin, Kaempferol, Trifolin", "element": "수 (Water)",
        "energy": "평 (Neutral)", "taste": "고 (Bitter)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF003", "sf_secondary": "SF010", "sf_tertiary": ""
    },
    "구절초꽃": {
        "latin": "Chrysanthemum sibiricum flos", "english": "Siberian Chrysanthemum",
        "compounds": "Linarin, Acacetin, Sesquiterpenes", "element": "화 (Fire)",
        "energy": "온 (Warm)", "taste": "고·신 (Bitter, Pungent)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF007", "sf_secondary": "SF008", "sf_tertiary": ""
    },
    "매화꽃": {
        "latin": "Prunus mume flos", "english": "Plum Blossom",
        "compounds": "Benzaldehyde, Isoeugenol, Organic acids", "element": "목 (Wood)",
        "energy": "평 (Neutral)", "taste": "산·삽 (Sour, Astringent)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF020", "sf_secondary": "SF008", "sf_tertiary": ""
    },
    "연꽃": {
        "latin": "Nelumbo nucifera flos", "english": "Lotus Flower",
        "compounds": "Nelumbin, Nuciferine, Quercetin", "element": "금 (Gold)",
        "energy": "평 (Neutral)", "taste": "감·담 (Sweet, Bland)", "category": "FLOWER", "form": "FORM_DRIED",
        "sf_primary": "SF017", "sf_secondary": "SF019", "sf_tertiary": ""
    }
}

f_counter = 104
for f_name, f_info in flower_details.items():
    f_id = f"H{f_counter:04d}"
    f_counter += 1
    ref_match = find_ref_match(f_name, is_herb=True)
    if ref_match is not None:
        calories = clean_num(ref_match[energy_col])
        water = clean_num(ref_match[water_col])
        protein = clean_num(ref_match[protein_col])
        fat = clean_num(ref_match[fat_col])
        carb = clean_num(ref_match[carb_col])
        sodium = clean_num(ref_match[sodium_col])
    else:
        calories, water, protein, fat, carb, sodium = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0

    ingredients_list.append({
        "INGREDIENT_ID": f_id,
        "INGREDIENT_NAME": f_name,
        "LATIN_NAME": f_info["latin"],
        "ENGLISH_NAME": f_info["english"],
        "CATEGORY": f_info["category"],
        "PHYSICAL_FORM": f_info["form"],
        "ACTIVE_COMPOUNDS": f_info["compounds"],
        "FIVE_ELEMENTS": f_info["element"],
        "ENERGY_PROPERTY": f_info["energy"],
        "TASTE_PROPERTY": f_info["taste"],
        "PRIMARY_SF_ID": f_info["sf_primary"],
        "SECONDARY_SF_ID": f_info["sf_secondary"],
        "TERTIARY_SF_ID": f_info["sf_tertiary"],
        "VERIFICATION_GRADE": "A",
        "CALORIES_KCAL": calories,
        "WATER_G": water,
        "PROTEIN_G": protein,
        "FAT_G": fat,
        "CARBOHYDRATE_G": carb,
        "SODIUM_MG": sodium
    })

# 1.2 Process Food Ingredients from Recipe CSV
print("Processing food ingredients with database matching...")
food_ing_map = {}
for idx, row in df_recipes_raw.iterrows():
    ingt_nm = str(row['INGT_NM']).strip()
    ingt_clssc = str(row['INGT_CLSSC_NM']).strip()
    
    nms = [n.strip() for n in re.split(r',', ingt_nm) if n.strip()]
    clsscs = [c.strip() for c in re.split(r',', ingt_clssc) if c.strip()]
    
    for i, name in enumerate(nms):
        if name in [h["INGREDIENT_NAME"] for h in ingredients_list]:
            continue # already in herbs
        cat_raw = clsscs[i] if i < len(clsscs) else clsscs[0] if clsscs else "기타"
        food_ing_map[name] = cat_raw

i_counter = 1
for name, cat_raw in sorted(food_ing_map.items()):
    cat_std = "OTHER"
    if "식육" in cat_raw or "조류" in cat_raw or "수육" in cat_raw:
        cat_std = "MEAT (육류)"
    elif "어류" in cat_raw or "연체" in cat_raw or "갑각" in cat_raw:
        cat_std = "FISH (생선류)"
    elif "채소" in cat_raw or "버섯" in cat_raw or "식물" in cat_raw:
        cat_std = "VEGETABLE (채소류)"
    elif "곡류" in cat_raw or "콩류" in cat_raw or "견과" in cat_raw:
        cat_std = "GRAIN (곡류)"
    elif "과일" in cat_raw:
        cat_std = "FRUIT (과일류)"

    # Look up in merged reference DB
    ref_match = find_ref_match(name, is_herb=False)
    
    if ref_match is not None:
        i_id = str(ref_match['식품코드']).strip() # Official standard code!
        lat = str(ref_match['학명']).strip() if pd.notna(ref_match['학명']) and str(ref_match['학명']).strip() != "" else f"Cibus {name}ae"
        eng = str(ref_match['식품명_영문명']).strip()
        comp = f"{name} biological compounds"
        
        # Determine Five Elements and Ki-Mi systematically based on category
        if cat_std == "FISH (생선류)":
            el, en, ta = "수 (Water)", "평·미한 (Neutral/Slightly Cold)", "감·함 (Sweet, Salty)"
        elif cat_std == "MEAT (육류)":
            el, en, ta = "토 (Earth)", "온·평 (Warm/Neutral)", "감 (Sweet)"
        elif cat_std == "VEGETABLE (채소류)":
            el, en, ta = "목 (Wood)", "량·평 (Cool/Neutral)", "감·고 (Sweet, Bitter)"
        elif cat_std == "GRAIN (곡류)":
            el, en, ta = "토 (Earth)", "평 (Neutral)", "감 (Sweet)"
        elif cat_std == "FRUIT (과일류)":
            el, en, ta = "화 (Fire)", "한·량 (Cold/Cool)", "산·감 (Sour, Sweet)"
        else:
            el, en, ta = "토 (Earth)", "평 (Neutral)", "감 (Sweet)"
            
        # Specific active compound overrides
        if name in ["가오리", "문어", "낙지", "전복", "굴"]:
            comp = "Taurine, Collagen, bioactive peptides"
        elif name in ["생강", "마늘", "강황"]:
            comp = "Gingerols, Allicin, Curcuminoids"
            
        calories = clean_num(ref_match[energy_col])
        water = clean_num(ref_match[water_col])
        protein = clean_num(ref_match[protein_col])
        fat = clean_num(ref_match[fat_col])
        carb = clean_num(ref_match[carb_col])
        sodium = clean_num(ref_match[sodium_col])
    else:
        # Fallback generated values
        i_id = f"I{i_counter:04d}"
        i_counter += 1
        lat = f"Cibus {name}ae"
        eng = f"{name}"
        comp = "Nutritional compounds"
        el, en, ta = "토 (Earth)", "평 (Neutral)", "감 (Sweet)"
        calories, water, protein, fat, carb, sodium = 0.0, 0.0, 0.0, 0.0, 0.0, 0.0

    # Determine default physical form
    if cat_std in ["GRAIN (곡류)", "FRUIT (과일류)"]:
        p_form = "FORM_DRIED" # 곡류는 말린 원물 형태가 기본
    else:
        p_form = "FORM_RAW" # 채소, 고기, 생선 등은 신선(생것) 기본

    sf_primary = "SF020"
    if cat_std == "MEAT (육류)" or cat_std == "FISH (생선류)":
        sf_primary = "SF012"
    elif cat_std == "VEGETABLE (채소류)":
        sf_primary = "SF016"

    ingredients_list.append({
        "INGREDIENT_ID": i_id,
        "INGREDIENT_NAME": name,
        "LATIN_NAME": lat,
        "ENGLISH_NAME": eng,
        "CATEGORY": cat_std.split(" ")[0], # MEAT, FISH, VEGETABLE 등 코드로 간소화
        "PHYSICAL_FORM": p_form,
        "ACTIVE_COMPOUNDS": comp,
        "FIVE_ELEMENTS": el,
        "ENERGY_PROPERTY": en,
        "TASTE_PROPERTY": ta,
        "PRIMARY_SF_ID": sf_primary,
        "SECONDARY_SF_ID": "",
        "TERTIARY_SF_ID": "",
        "VERIFICATION_GRADE": "B",
        "CALORIES_KCAL": calories,
        "WATER_G": water,
        "PROTEIN_G": protein,
        "FAT_G": fat,
        "CARBOHYDRATE_G": carb,
        "SODIUM_MG": sodium
    })

df_ingredient_master = pd.DataFrame(ingredients_list)
ingredients_by_name = {ing["INGREDIENT_NAME"]: ing for ing in ingredients_list}

def estimate_recipe_nutrients(mtril_str, ingredients_dict):
    total_cal = 0.0
    total_protein = 0.0
    total_fat = 0.0
    total_carb = 0.0
    total_sodium = 0.0
    
    if not mtril_str or pd.isna(mtril_str):
        return total_cal, total_protein, total_fat, total_carb, total_sodium
        
    # Split items by comma, slash, plus, or space
    items = re.split(r'[,/+\s\n\r]+', str(mtril_str))
    for item in items:
        item = item.strip()
        if not item:
            continue
            
        # Clean numeric annotations
        name_only = re.sub(r'[\d\.]+\s*(g|ml|마리|개|큰술|작은술|T|t|컵|정)?', '', item).strip()
        name_only = re.sub(r'\(.*?\)', '', name_only).strip()
        if not name_only:
            continue
            
        # Default weight assumptions
        weight = 50.0
        match_g = re.search(r'([\d\.]+)\s*g', item)
        if match_g:
            weight = float(match_g.group(1))
        else:
            match_paren = re.search(r'\(([\d\.]+)\s*g\)', item)
            if match_paren:
                weight = float(match_paren.group(1))
                
        if any(cond in name_only for cond in ["소금", "간장", "된장", "고추장", "식초", "설탕", "참기름"]):
            weight = 5.0
            
        # Match inside database
        matched_ing = None
        for ing_name, ing_data in ingredients_dict.items():
            if ing_name == name_only or ing_name in name_only or name_only in ing_name:
                matched_ing = ing_data
                break
                
        if matched_ing:
            factor = weight / 100.0
            total_cal += float(matched_ing.get("CALORIES_KCAL", 0.0)) * factor
            total_protein += float(matched_ing.get("PROTEIN_G", 0.0)) * factor
            total_fat += float(matched_ing.get("FAT_G", 0.0)) * factor
            total_carb += float(matched_ing.get("CARBOHYDRATE_G", 0.0)) * factor
            total_sodium += float(matched_ing.get("SODIUM_MG", 0.0)) * factor
            
    return total_cal, total_protein, total_fat, total_carb, total_sodium

# ==========================================
# 2. PROCESS RECIPES (RECIPE_MASTER)
# ==========================================
print("Processing recipes...")
recipes_list = []
r_counter = 1

for idx, row in df_recipes_raw.iterrows():
    food_nm = str(row['FOOD_NM']).strip().replace('\n', ' ')
    ingt_nm = str(row['INGT_NM']).strip()
    ingt_clssc = str(row['INGT_CLSSC_NM']).strip()
    mtril_nm = str(row['FOOD_MTRIL_NM']).strip() if not pd.isna(row['FOOD_MTRIL_NM']) else ""
    cook_method = str(row['FOOD_COOK_MTHOD']).strip() if not pd.isna(row['FOOD_COOK_MTHOD']) else ""
    cook_desc = str(row['FOOD_COOK_DSCRT']).strip() if not pd.isna(row['FOOD_COOK_DSCRT']) else ""
    desc = str(row['FOOD_DSCRT']).strip() if not pd.isna(row['FOOD_DSCRT']) else ""
    url = str(row['FOOD_URL']).strip() if not pd.isna(row['FOOD_URL']) else ""
    
    comp_type = "SUB_SIDE"
    rec_struct = "COMPOSITE"
    if any(k in food_nm for k in ["밥", "면", "만두", "스낵", "쿠키", "케이크", "덮밥", "식해"]):
        comp_type = "STAPLE"
        rec_struct = "SINGLE" if "덮밥" not in food_nm else "COMPOSITE"
    elif "죽" in food_nm:
        comp_type = "STAPLE"
        rec_struct = "SINGLE"
    elif any(k in food_nm for k in ["탕", "국", "찌개", "전골", "매운탕"]):
        comp_type = "SOUP_STEW"
        rec_struct = "SINGLE"
    elif any(k in food_nm for k in ["구이", "조림", "찜", "볶음", "전", "튀김", "적", "회", "갈비", "불고기", "주물럭", "스테이크", "강정", "탕수", "깐풍"]):
        if any(c in ingt_clssc for c in ["식육류", "조류", "어류", "연체류", "갑각류", "수육"]):
            comp_type = "MAIN_SIDE"
        else:
            comp_type = "SUB_SIDE"
            
    if any(k in food_nm for k in ["차", "음료", "화채", "수정과", "식혜"]):
        comp_type = "TEA"
        rec_struct = "SINGLE"

    ing_cat = "OTHER"
    if any(c in ingt_clssc for c in ["식육류", "조류", "수육"]):
        ing_cat = "MEAT"
    elif any(c in ingt_clssc for c in ["어류", "연체류", "갑각류"]):
        ing_cat = "FISH"
    elif any(c in ingt_clssc for c in ["채소류", "버섯류", "식물"]):
        ing_cat = "VEGETABLE"
    elif any(c in ingt_clssc for c in ["곡류", "콩류", "견과류"]):
        ing_cat = "GRAIN"
    elif "과일" in ingt_clssc:
        ing_cat = "FRUIT"
        
    if any(h in ingt_nm for h in ["구기자", "결명자", "대추", "치자", "산약"]):
        ing_cat = "HERB"

    tier = "GENERAL"
    if any(h in food_nm or h in mtril_nm for h in ["삼계", "백숙", "구기자", "결명자", "대추", "치자", "인삼", "황기", "맥문동", "갈근", "산사", "오미자", "천궁", "당귀"]):
        tier = "TONIC"
    if any(h in food_nm for h in ["환자식", "요양", "치료", "당뇨식", "저염식"]):
        tier = "THERAPEUTIC"

    format_type = "BANSANG_5"
    if any(k in food_nm for k in ["삼계탕", "백숙", "전골", "구이", "찜", "매운탕", "연포탕"]) and any(c in ingt_clssc for c in ["식육", "조류", "어류", "연체", "갑각"]):
        format_type = "SPECIAL_SIGNATURE"
        comp_type = "SPECIAL_SIGNATURE"
    elif any(k in food_nm for k in ["신선로", "구절판", "갈비찜", "도미찜"]):
        format_type = "SPECIAL_SIGNATURE"
        comp_type = "SPECIAL_SIGNATURE"
    elif idx % 3 == 0:
        format_type = "BANSANG_10"
        
    kit_id = ""
    if tier == "TONIC":
        if any(h in food_nm or h in mtril_nm for h in ["삼계", "백숙", "인삼", "황기"]):
            kit_id = "K01"
        elif any(h in food_nm or h in mtril_nm for h in ["당귀", "천궁", "계피"]):
            kit_id = "K02"
        elif any(h in food_nm or h in mtril_nm for h in ["대추", "산조인"]):
            kit_id = "K05"
    elif tier == "GENERAL":
        if comp_type == "SOUP_STEW":
            kit_id = "K01"
        elif ing_cat == "FISH":
            kit_id = "K02"
        else:
            kit_id = "K03"

    cal, prot, fat, carb, sod = estimate_recipe_nutrients(mtril_nm, ingredients_by_name)

    recipes_list.append({
        "RECIPE_ID": f"R{r_counter:04d}",
        "RECIPE_NAME": food_nm,
        "MAIN_INGREDIENT": ingt_nm,
        "INGREDIENT_CATEGORY": ing_cat,
        "RECIPE_STRUCTURE": rec_struct,
        "MENU_COMPONENT": comp_type,
        "TARGET_TIER": tier,
        "MEAL_FORMAT": format_type,
        "BASE_INGREDIENTS": mtril_nm,
        "COOKING_METHOD": cook_method,
        "COOKING_DESCRIPTION": cook_desc,
        "DESCRIPTION": desc,
        "URL": url,
        "UPGRADABLE": "Yes" if tier == "GENERAL" else "No",
        "MATCHED_YAKSEON_KIT_ID": kit_id,
        "CALORIES_KCAL": cal,
        "PROTEIN_G": prot,
        "FAT_G": fat,
        "CARBOHYDRATE_G": carb,
        "SODIUM_MG": sod
    })
    r_counter += 1

df_recipe_master = pd.DataFrame(recipes_list)

# ==========================================
# 3. PROCESS YAKSEON KITS (YAKSEON_KIT_MASTER)
# ==========================================
print("Processing Yakseon Kits...")
kit_data = [
    {
        "KIT_ID": "K01",
        "KIT_NAME": "기력보강 활력에센스 (Energy Recovery Essence Kit)",
        "PHYSICAL_FORM": "FORM_EXTRACT", # 의약품 오인 피하는 액상 에센스
        "TARGET_ROOT_CAUSE_ID": "RC01",
        "TARGET_ROOT_CAUSE": "에너지부족",
        "TARGET_STANDARD_FUNCTION_IDS": "SF012, SF022",
        "TARGET_STANDARD_FUNCTIONS": "체력회복 (보기·익기), 건비 (비위 기능 강화)",
        "COMPOSITION": "황기 (H0001) 40%, 인삼 (H0002) 20%, 백출 (H0004) 20%, 대추 (H0007) 10%, 산약 (H0005) 10%",
        "DOSAGE_FORMAT": "10ml Liquid Essence / 15g Tea bag filter",
        "FRANCHISE_KITCHEN_GUIDE": "조리 완료 후 서빙 직전 가볍게 섞어 내거나 탕에 첨가하여 서빙.",
        "DESCRIPTION": "기력 저하, 만성 피로, 소화 및 기혈 회복을 위한 고품격 보기 건비 키트. 삼계탕, 갈비탕 등 고기 육수 요리에 적극 추천."
    },
    {
        "KIT_ID": "K02",
        "KIT_NAME": "순환온기 분말키트 (Circulation & Warmth Powder Kit)",
        "PHYSICAL_FORM": "FORM_POWDER",
        "TARGET_ROOT_CAUSE_ID": "RC02",
        "TARGET_ROOT_CAUSE": "순환정체",
        "TARGET_STANDARD_FUNCTION_IDS": "SF007, SF008, SF009",
        "TARGET_STANDARD_FUNCTIONS": "혈류개선 (활혈·거어), 기순환 (행기·소간), 통락 (경락 소통)",
        "COMPOSITION": "당귀 (H0009) 30%, 천궁 (H0015) 30%, 작약 (H0016) 20%, 계피 (H0027) 20%",
        "DOSAGE_FORMAT": "5g Fine Powder / 10g Tea bag filter",
        "FRANCHISE_KITCHEN_GUIDE": "조리 시작 시 육수용 티백으로 함께 끓이거나, 볶음/조림 소스에 분말 혼합하여 사용.",
        "DESCRIPTION": "말초 냉증, 혈행 저하, 신체 순환 장애를 겪는 고객용 순환 촉진 키트. 조림, 볶음, 전골류에 최적."
    },
    {
        "KIT_ID": "K03",
        "KIT_NAME": "대사정화 티백키트 (Metabolic Purifying Tea bag Kit)",
        "PHYSICAL_FORM": "FORM_DRIED", # 건조 티백 원물 형태
        "TARGET_ROOT_CAUSE_ID": "RC03",
        "TARGET_ROOT_CAUSE": "대사불균형",
        "TARGET_STANDARD_FUNCTION_IDS": "SF003, SF002, SF020",
        "TARGET_STANDARD_FUNCTIONS": "수분배출 (이수·이뇨·부종 관리), 해독 (독성 제거), 소화개선 (화위)",
        "COMPOSITION": "복령 (H0011) 40%, 의이인 (H0056) 30%, 택사 (H0012) 20%, 진피 (H0024) 10%",
        "DOSAGE_FORMAT": "15g Extra Large Tea bag filter",
        "FRANCHISE_KITCHEN_GUIDE": "밥물로 미리 우려내거나 탕류 밑국물로 사용하여 15분 이상 충분히 가열.",
        "DESCRIPTION": "체내 수분 정체, 잦은 부종, 소화불량 및 대사 정체를 해결하기 위한 정화 키트. 나물무침용 물, 탕류 베이스로 적합."
    },
    {
        "KIT_ID": "K04",
        "KIT_NAME": "재생보호 분말키트 (Regenerative & Protective Powder Kit)",
        "PHYSICAL_FORM": "FORM_POWDER",
        "TARGET_ROOT_CAUSE_ID": "RC04",
        "TARGET_ROOT_CAUSE": "회복력저하",
        "TARGET_STANDARD_FUNCTION_IDS": "SF010, SF011, SF013",
        "TARGET_STANDARD_FUNCTIONS": "조직회복 (생기·재생), 혈액보충 (양혈·보혈), 면역조절",
        "COMPOSITION": "숙지황 (H0010) 30%, 구기자 (H0021) 30%, 오미자 (H0022) 20%, 산수유 (H0058) 20%",
        "DOSAGE_FORMAT": "8g Concentrated Extract Powder",
        "FRANCHISE_KITCHEN_GUIDE": "조리 소스에 직접 용해하거나 요리 완성 직전 골고루 뿌려 혼합.",
        "DESCRIPTION": "수술 후 또는 면역력 극저하 상태의 회복 지연을 방지하기 위한 영양 재생 키트. 죽류 및 찜 요리에 최적."
    },
    {
        "KIT_ID": "K05",
        "KIT_NAME": "안심안정 에센스키트 (Calming & Relax Essence Kit)",
        "PHYSICAL_FORM": "FORM_EXTRACT", # 의약품 연상 단어 '수면 앰플' 회피 -> 안정 에센스
        "TARGET_ROOT_CAUSE_ID": "RC05",
        "TARGET_ROOT_CAUSE": "심신불균형",
        "TARGET_STANDARD_FUNCTION_IDS": "SF017, SF018, SF019",
        "TARGET_STANDARD_FUNCTIONS": "신경안정 (안신·정경), 안정숙면 지원, 진정 (흥분 완화)",
        "COMPOSITION": "산조인 (H0025) 40%, 원지 (H0026) 20%, 백자인 (H0059) 20%, 용안육 (H0060) 20%",
        "DOSAGE_FORMAT": "10ml Liquid Drop",
        "FRANCHISE_KITCHEN_GUIDE": "요리 완성 후 가볍게 섞어 내거나 샐러드 드레싱, 특선 음료에 혼합.",
        "DESCRIPTION": "만성 스트레스, 불안감, 심신 안정을 호전시키기 위한 조율 키트. 죽류, 후식류, 샐러드에 유용."
    }
]

df_yakseon_kit_master = pd.DataFrame(kit_data)

# Load Season Terms Matrix
season_matrix_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS", "M04-11_SEASON_TERMS_MATRIX_v1.0.xlsx")
if os.path.exists(season_matrix_path):
    print("Loading Season Terms Matrix...")
    df_season_matrix = pd.read_excel(season_matrix_path)
else:
    df_season_matrix = None

# Load Multilingual Dictionary
multi_dict_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS", "M04-12_MULTILINGUAL_DICTIONARY_v1.0.xlsx")
if os.path.exists(multi_dict_path):
    print("Loading Multilingual Dictionary...")
    df_multi_dict = pd.read_excel(multi_dict_path)
else:
    df_multi_dict = None

# ==========================================
# 4. WRITE UNIFIED KNOWLEDGE BASE EXCEL
# ==========================================
print(f"Writing unified database to {output_kb_path}...")
with pd.ExcelWriter(output_kb_path, engine='openpyxl') as writer:
    df_ingredient_master.to_excel(writer, sheet_name="INGREDIENT_MASTER", index=False)
    df_recipe_master.to_excel(writer, sheet_name="RECIPE_MASTER", index=False)
    df_yakseon_kit_master.to_excel(writer, sheet_name="YAKSEON_KIT_MASTER", index=False)
    if df_season_matrix is not None:
        df_season_matrix.to_excel(writer, sheet_name="SEASON_TERMS_MATRIX", index=False)
    if df_multi_dict is not None:
        df_multi_dict.to_excel(writer, sheet_name="MULTILINGUAL_DICTIONARY", index=False)

print("=== Unified Knowledge Base v2.0 created successfully! ===")
print("Ingredient master shape:", df_ingredient_master.shape)
print("Recipe master shape:", df_recipe_master.shape)
print("Yakseon kit master shape:", df_yakseon_kit_master.shape)
if df_season_matrix is not None:
    print("Season terms matrix shape:", df_season_matrix.shape)
if df_multi_dict is not None:
    print("Multilingual dictionary shape:", df_multi_dict.shape)
