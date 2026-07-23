# -*- coding: utf-8 -*-
import pandas as pd
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("=== Starting MFCO Knowledge Base Compiler to JSON ===")

root_dir = r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"
core_db_path = os.path.join(root_dir, "02_CORE_DB", "MFCO_MASTER_CORE_ONTOLOGY_v20_REVIEWED.xlsx")
kb_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx")
state_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-04_STATE_MASTER_v1.0.xlsx")
matrix_dir = os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS")
output_json_path = os.path.join(root_dir, "mfco-website", "src", "data", "mfcoData.json")

# Ensure target directories exist
os.makedirs(os.path.dirname(output_json_path), exist_ok=True)

# Load databases
print("Loading core ontology and unified knowledge base...")
df_core = pd.read_excel(core_db_path, sheet_name="MASTER_CORE_DB")
df_ingredients = pd.read_excel(kb_path, sheet_name="INGREDIENT_MASTER")
df_recipes = pd.read_excel(kb_path, sheet_name="RECIPE_MASTER")
df_kits = pd.read_excel(kb_path, sheet_name="YAKSEON_KIT_MASTER")
df_states = pd.read_excel(state_path)

if os.path.exists(os.path.join(kb_path)):
    xl_kb = pd.ExcelFile(kb_path)
    df_season = xl_kb.parse("SEASON_TERMS_MATRIX") if "SEASON_TERMS_MATRIX" in xl_kb.sheet_names else pd.DataFrame()
    df_multi = xl_kb.parse("MULTILINGUAL_DICTIONARY") if "MULTILINGUAL_DICTIONARY" in xl_kb.sheet_names else pd.DataFrame()
else:
    df_season = pd.DataFrame()
    df_multi = pd.DataFrame()

# Clean nan values helper
def clean_df(df):
    return df.where(pd.notnull(df), None)

df_core = clean_df(df_core)
df_ingredients = clean_df(df_ingredients)
df_recipes = clean_df(df_recipes)
df_kits = clean_df(df_kits)
df_states = clean_df(df_states)
df_season = clean_df(df_season)
df_multi = clean_df(df_multi)

# 1. Compile Ontology Mappings (1,793 mappings) grouped by Herb/Ingredient
print("Grouping ontology mappings...")
ontology_map = {}
for _, row in df_core.iterrows():
    herb = row['식재료/약재']
    if not herb:
        continue
    herb = str(herb).strip()
    mapping_detail = {
        "original_efficacy": row['원본효능'],
        "standard_function": row['표준기능'],
        "physiological_action": row['생리작용'],
        "mechanism": row['작용기전'],
        "target_states": row['관련 일상 상태'],
        "kitchen_guide": row['조리권장'],
        "flavor": row['Flavor'],
        "description": row['설명']
    }
    if herb not in ontology_map:
        ontology_map[herb] = []
    ontology_map[herb].append(mapping_detail)

# 2. Compile Herbs Database (category = HERB)
print("Compiling herbs database...")
herbs_list = []
df_herbs = df_ingredients[df_ingredients['CATEGORY'] == 'HERB']
for _, row in df_herbs.iterrows():
    name = str(row['INGREDIENT_NAME']).strip()
    herb_mappings = ontology_map.get(name, [])
    herbs_list.append({
        "id": row['INGREDIENT_ID'],
        "name": name,
        "latin": row['LATIN_NAME'],
        "en": row['ENGLISH_NAME'],
        "category": "HERB",
        "physical_form": row['PHYSICAL_FORM'],
        "active_compounds": row['ACTIVE_COMPOUNDS'],
        "five_elements": row['FIVE_ELEMENTS'],
        "energy_property": row['ENERGY_PROPERTY'],
        "taste_property": row['TASTE_PROPERTY'],
        "primary_sf_id": row['PRIMARY_SF_ID'],
        "secondary_sf_id": row['SECONDARY_SF_ID'],
        "tertiary_sf_id": row['TERTIARY_SF_ID'],
        "verification_grade": row['VERIFICATION_GRADE'],
        "nutrition": {
            "kcal": row['CALORIES_KCAL'],
            "water": row['WATER_G'],
            "protein": row['PROTEIN_G'],
            "fat": row['FAT_G'],
            "carbo": row['CARBOHYDRATE_G'],
            "sodium": row['SODIUM_MG']
        },
        "ontology_mappings": herb_mappings
    })

# Add missing herbs from core ontology if they are not in INGREDIENT_MASTER
existing_herb_names = set(df_herbs['INGREDIENT_NAME'].astype(str).str.strip())
h_id_counter = len(df_herbs) + 1
for name, mappings in ontology_map.items():
    if name not in existing_herb_names:
        # Create a basic entry
        herbs_list.append({
            "id": f"H{h_id_counter:04d}",
            "name": name,
            "latin": mappings[0]["latin"] if "latin" in mappings[0] else f"Herba {name}ae",
            "en": mappings[0]["en"] if "en" in mappings[0] else f"{name} Herb",
            "category": "HERB",
            "physical_form": "FORM_DRIED",
            "active_compounds": "Active compounds of " + name,
            "five_elements": "토 (Earth)",
            "energy_property": "평 (Neutral)",
            "taste_property": "감 (Sweet)",
            "primary_sf_id": "SF012",
            "secondary_sf_id": None,
            "tertiary_sf_id": None,
            "verification_grade": "C",
            "nutrition": {"kcal": 0.0, "water": 0.0, "protein": 0.0, "fat": 0.0, "carbo": 0.0, "sodium": 0.0},
            "ontology_mappings": mappings
        })
        h_id_counter += 1

# 3. Compile General Ingredients (category != HERB)
print("Compiling food ingredients database...")
ingredients_list = []
df_foods = df_ingredients[df_ingredients['CATEGORY'] != 'HERB']
for _, row in df_foods.iterrows():
    ingredients_list.append({
        "id": row['INGREDIENT_ID'],
        "name": row['INGREDIENT_NAME'],
        "latin": row['LATIN_NAME'],
        "en": row['ENGLISH_NAME'],
        "category": row['CATEGORY'],
        "physical_form": row['PHYSICAL_FORM'],
        "active_compounds": row['ACTIVE_COMPOUNDS'],
        "five_elements": row['FIVE_ELEMENTS'],
        "energy_property": row['ENERGY_PROPERTY'],
        "taste_property": row['TASTE_PROPERTY'],
        "primary_sf_id": row['PRIMARY_SF_ID'],
        "secondary_sf_id": row['SECONDARY_SF_ID'],
        "tertiary_sf_id": row['TERTIARY_SF_ID'],
        "verification_grade": row['VERIFICATION_GRADE'],
        "nutrition": {
            "kcal": row['CALORIES_KCAL'],
            "water": row['WATER_G'],
            "protein": row['PROTEIN_G'],
            "fat": row['FAT_G'],
            "carbo": row['CARBOHYDRATE_G'],
            "sodium": row['SODIUM_MG']
        }
    })

# 4. Compile Recipes (1,000 recipes)
print("Compiling recipes database...")
recipes_list = []
for _, row in df_recipes.iterrows():
    # Parse list of ingredients
    base_ings = []
    if row['BASE_INGREDIENTS']:
        base_ings = [i.strip() for i in str(row['BASE_INGREDIENTS']).split(",") if i.strip()]
    
    recipes_list.append({
        "id": row['RECIPE_ID'],
        "name": row['RECIPE_NAME'],
        "main_ingredient": row['MAIN_INGREDIENT'],
        "ingredient_category": row['INGREDIENT_CATEGORY'],
        "structure": row['RECIPE_STRUCTURE'],
        "course_step": "main" if row['MENU_COMPONENT'] in ["STAPLE", "SOUP_STEW", "MAIN_SIDE"] else "entree" if row['MENU_COMPONENT'] == "SUB_SIDE" else "dessert" if row['MENU_COMPONENT'] == "TEA" else "main",
        "menu_component": row['MENU_COMPONENT'],
        "target_tier": row['TARGET_TIER'],
        "meal_format": row['MEAL_FORMAT'],
        "base_ingredients": base_ings,
        "cooking_method": row['COOKING_METHOD'],
        "cooking_description": row['COOKING_DESCRIPTION'],
        "description": row['DESCRIPTION'],
        "url": row['URL'],
        "upgradable": row['UPGRADABLE'],
        "kit": row['MATCHED_YAKSEON_KIT_ID'],
        "nutrition": {
            "kcal": row['CALORIES_KCAL'],
            "protein": row['PROTEIN_G'],
            "fat": row['FAT_G'],
            "carbo": row['CARBOHYDRATE_G'],
            "sodium": row['SODIUM_MG']
        }
    })

# 5. Compile Yakseon Kits
print("Compiling kits database...")
kits_list = []
for _, row in df_kits.iterrows():
    # Extract composition lists
    comp_list = []
    comp_str = str(row['COMPOSITION'])
    # Format: "황기 (H0001) 40%, 인삼 (H0002) 20%..."
    # We can parse them into structured list or keep as is
    
    kits_list.append({
        "id": row['KIT_ID'],
        "code": row['KIT_ID'],
        "name": row['KIT_NAME'],
        "physical_form": row['PHYSICAL_FORM'],
        "target_root_cause_id": row['TARGET_ROOT_CAUSE_ID'],
        "target_root_cause": row['TARGET_ROOT_CAUSE'],
        "target_sf_ids": [i.strip() for i in str(row['TARGET_STANDARD_FUNCTION_IDS']).split(",") if i.strip()],
        "functions": [i.strip() for i in str(row['TARGET_STANDARD_FUNCTIONS']).split(",") if i.strip()],
        "composition_desc": comp_str,
        "format": row['DOSAGE_FORMAT'],
        "kitchen_guide": row['FRANCHISE_KITCHEN_GUIDE'],
        "description": row['DESCRIPTION']
    })

# 6. Compile States Master
print("Compiling state master...")
states_list = []
for _, row in df_states.iterrows():
    # Map state code to root cause
    sc_map = {
        "ST-001": "RC01", "ST-008": "RC01", "ST-014": "RC01",
        "ST-003": "RC02", "ST-009": "RC02", "ST-017": "RC02", "ST-018": "RC02",
        "ST-004": "RC03", "ST-005": "RC03", "ST-010": "RC03", "ST-015": "RC03", "ST-016": "RC03",
        "ST-006": "RC04", "ST-012": "RC04", "ST-013": "RC04",
        "ST-002": "RC05", "ST-007": "RC05", "ST-011": "RC05"
    }
    # Add icons
    icons = {
        "ST-001": "⚡", "ST-002": "😴", "ST-003": "❤️", "ST-004": "💧", "ST-005": "🌿",
        "ST-006": "✨", "ST-007": "🧠", "ST-008": "💪", "ST-009": "👁️", "ST-010": "🔵",
        "ST-011": "🌸", "ST-012": "🌬️", "ST-013": "🛡️", "ST-014": "🧩", "ST-015": "🦷",
        "ST-016": "⚖️", "ST-017": "🌡️", "ST-018": "👂"
    }
    sid = row['STATE_ID']
    states_list.append({
        "id": sid,
        "name": row['STATE_NAME'],
        "desc": row['DEFINITION'],
        "group": row['STATE_GROUP'],
        "icon": icons.get(sid, "🌱"),
        "root_cause": sc_map.get(sid, "RC01")
    })

# 7. Compile Season/Solar Terms
print("Compiling season terms...")
season_list = []
for _, row in df_season.iterrows():
    season_list.append({
        "code": row['절기코드'],
        "name": row['절기명'],
        "season": row['계절명'],
        "cause_id": row['원인코드'],
        "sf_id": row['기능코드'],
        "weight": row['가중치'],
        "confidence": row['신뢰도'],
        "priority": row['우선순위'],
        "recommend_category": row['추천식재료그룹']
    })

# 8. Compile Multilingual Dictionary
print("Compiling multilingual translations...")
multilingual_dict = {}
for _, row in df_multi.iterrows():
    key = row['KEY']
    multilingual_dict[key] = {
        "ko": row['ko'],
        "en": row['en'],
        "zh": row['zh'],
        "ja": row['ja'],
        "es": row['es'],
        "de": row['de'],
        "ar": row['ar']
    }

# Assemble final JSON
output_data = {
    "herbs": herbs_list,
    "ingredients": ingredients_list,
    "recipes": recipes_list,
    "kits": kits_list,
    "states": states_list,
    "season_terms": season_list,
    "translations": multilingual_dict
}

with open(output_json_path, "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"✅ Compilation complete. JSON DB saved to: {output_json_path}")
print(f"Summary: {len(herbs_list)} Herbs, {len(ingredients_list)} Foods, {len(recipes_list)} Recipes, {len(kits_list)} Kits, {len(states_list)} States.")
