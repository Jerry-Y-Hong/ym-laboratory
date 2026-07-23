import pandas as pd
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

class MFCOInferenceEngine:
    def __init__(self, root_dir=r"C:\Users\car13\OneDrive\MFCO_MASTER_RECOVERY"):
        self.root_dir = root_dir
        self.kb_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx")
        self.matrix_dir = os.path.join(root_dir, "04_MAPPING_ENGINE", "MATRIXS")
        
        # Load sheets
        if not os.path.exists(self.kb_path):
            raise FileNotFoundError(f"Unified Knowledge Base not found at {self.kb_path}")
            
        print("Loading Unified Knowledge Base sheets...")
        self.df_ingredients = pd.read_excel(self.kb_path, sheet_name="INGREDIENT_MASTER")
        self.df_recipes = pd.read_excel(self.kb_path, sheet_name="RECIPE_MASTER")
        self.df_kits = pd.read_excel(self.kb_path, sheet_name="YAKSEON_KIT_MASTER")
        
        # Load State-Cause Matrix
        sc_matrix_path = os.path.join(self.matrix_dir, "M04-05_STATE_CAUSE_MATRIX_v1.0.xlsx")
        if os.path.exists(sc_matrix_path):
            self.df_sc_matrix = pd.read_excel(sc_matrix_path)
        else:
            self.df_sc_matrix = None
            
        # Load State Master
        state_master_path = os.path.join(root_dir, "04_MAPPING_ENGINE", "M04-04_STATE_MASTER_v1.0.xlsx")
        if os.path.exists(state_master_path):
            self.df_states = pd.read_excel(state_master_path)
        else:
            self.df_states = None

    def infer_recipe_upgrade(self, state_id, base_recipe_id=None):
        """
        Runs the MFCO semantic inference pipeline:
        User State -> Root Cause -> Standard Functions -> Yakseon Kit -> Upgraded Recipe
        """
        result = {}
        
        # 1. Retrieve State details
        if self.df_states is not None:
            state_row = self.df_states[self.df_states['STATE_ID'] == state_id]
            if state_row.empty:
                return {"error": f"State ID {state_id} not found in State Master."}
            state_name = state_row.iloc[0]['STATE_NAME']
            state_def = state_row.iloc[0]['DEFINITION']
        else:
            state_name = state_id
            state_def = "Unknown State"
            
        result["state"] = {"id": state_id, "name": state_name, "definition": state_def}
        
        # 2. Infer Root Cause using State-Cause Matrix
        if self.df_sc_matrix is None:
            return {"error": "State-Cause Matrix not found."}
            
        sc_mappings = self.df_sc_matrix[self.df_sc_matrix['상태코드'] == state_id]
        if sc_mappings.empty:
            # Fallback or default mapping
            cause_id = "RC01"
            weight = 1.0
        else:
            # Pick the one with the highest weight/priority
            best_mapping = sc_mappings.sort_values(by=['가중치', '우선순위'], ascending=[False, True]).iloc[0]
            cause_id = best_mapping['원인코드']
            weight = best_mapping['가중치']
            
        # Get Cause details
        kit_row = self.df_kits[self.df_kits['TARGET_ROOT_CAUSE_ID'] == cause_id]
        if kit_row.empty:
            # Fallback kit
            kit_row = self.df_kits.iloc[0]
            
        kit_id = kit_row.iloc[0]['KIT_ID']
        kit_name = kit_row.iloc[0]['KIT_NAME']
        cause_name = kit_row.iloc[0]['TARGET_ROOT_CAUSE']
        sf_names = kit_row.iloc[0]['TARGET_STANDARD_FUNCTIONS']
        composition = kit_row.iloc[0]['COMPOSITION']
        format_type = kit_row.iloc[0]['DOSAGE_FORMAT']
        kitchen_guide = kit_row.iloc[0]['FRANCHISE_KITCHEN_GUIDE']
        kit_desc = kit_row.iloc[0]['DESCRIPTION']
        
        result["inference"] = {
            "root_cause_id": cause_id,
            "root_cause_name": cause_name,
            "confidence_weight": weight,
            "target_functions": sf_names
        }
        
        result["yakseon_kit"] = {
            "id": kit_id,
            "name": kit_name,
            "composition": composition,
            "format": format_type,
            "kitchen_guide": kitchen_guide,
            "description": kit_desc
        }
        
        # 3. Select Base Recipe
        if base_recipe_id:
            recipe_row = self.df_recipes[self.df_recipes['RECIPE_ID'] == base_recipe_id]
            if recipe_row.empty:
                return {"error": f"Recipe ID {base_recipe_id} not found."}
        else:
            # Select an upgradable recipe that matches the category focus of the kit
            # e.g., K01 matches Meat/Soup, K02 matches Fish/Side dishes
            if kit_id == "K01":
                # Energy/Immunity -> Soup or Meat
                candidates = self.df_recipes[
                    (self.df_recipes['UPGRADABLE'] == 'Yes') & 
                    ((self.df_recipes['MENU_COMPONENT'].str.contains('SOUP_STEW')) | 
                     (self.df_recipes['INGREDIENT_CATEGORY'] == 'MEAT'))
                ]
            elif kit_id == "K02":
                # Circulation/Warmth -> Fish or Main Side
                candidates = self.df_recipes[
                    (self.df_recipes['UPGRADABLE'] == 'Yes') & 
                    ((self.df_recipes['INGREDIENT_CATEGORY'] == 'FISH') |
                     (self.df_recipes['MENU_COMPONENT'].str.contains('MAIN_SIDE')))
                ]
            elif kit_id == "K03":
                # Purification/Detox -> Grains, Vegetables or Soups
                candidates = self.df_recipes[
                    (self.df_recipes['UPGRADABLE'] == 'Yes') & 
                    ((self.df_recipes['INGREDIENT_CATEGORY'] == 'VEGETABLE') | 
                     (self.df_recipes['INGREDIENT_CATEGORY'] == 'GRAIN') |
                     (self.df_recipes['MENU_COMPONENT'].str.contains('SOUP_STEW')))
                ]
            elif kit_id == "K04":
                # Recovery/Protection -> Staples (Porridges/Rice) or Tofu
                candidates = self.df_recipes[
                    (self.df_recipes['UPGRADABLE'] == 'Yes') & 
                    ((self.df_recipes['MENU_COMPONENT'].str.contains('STAPLE')) |
                     (self.df_recipes['MAIN_INGREDIENT'].str.contains('두부|콩')))
                ]
            elif kit_id == "K05":
                # Calming/Sleep -> Fruits, Staples or Sub Sides
                candidates = self.df_recipes[
                    (self.df_recipes['UPGRADABLE'] == 'Yes') & 
                    ((self.df_recipes['INGREDIENT_CATEGORY'] == 'FRUIT') |
                     (self.df_recipes['MENU_COMPONENT'].str.contains('SUB_SIDE')) |
                     (self.df_recipes['MENU_COMPONENT'].str.contains('STAPLE')))
                ]
            else:
                candidates = self.df_recipes[self.df_recipes['UPGRADABLE'] == 'Yes']
                
            if candidates.empty:
                candidates = self.df_recipes[self.df_recipes['UPGRADABLE'] == 'Yes']
                
            # Use deterministic hash of state_id to get diverse recipes per state
            state_hash = sum(ord(c) for c in state_id)
            idx_choice = state_hash % len(candidates)
            recipe_row = candidates.iloc[[idx_choice]]
            
        recipe_id = recipe_row.iloc[0]['RECIPE_ID']
        recipe_name = recipe_row.iloc[0]['RECIPE_NAME']
        main_ing = recipe_row.iloc[0]['MAIN_INGREDIENT']
        comp_type = recipe_row.iloc[0]['MENU_COMPONENT']
        base_ingredients = recipe_row.iloc[0]['BASE_INGREDIENTS']
        cook_method = recipe_row.iloc[0]['COOKING_METHOD']
        cook_desc = recipe_row.iloc[0]['COOKING_DESCRIPTION']
        url = recipe_row.iloc[0]['URL']
        
        result["base_recipe"] = {
            "id": recipe_id,
            "name": recipe_name,
            "main_ingredient": main_ing,
            "component_type": comp_type,
            "base_ingredients": base_ingredients,
            "cooking_method": cook_method,
            "cooking_description": cook_desc,
            "url": url
        }
        
        # 4. Synthesize Upgraded Premium Recipe (Franchise Menu Expansion)
        upgraded_title = f"{kit_name.split(' (')[0].replace(' 키트', '')} {recipe_name}"
        
        result["upgraded_recipe"] = {
            "title": upgraded_title,
            "franchise_menu_name": f"MFCO Premium {recipe_name} ({kit_name.split(' (')[0]})",
            "combined_ingredients": f"{base_ingredients} + [MFCO {kit_name.split(' (')[0]}: {composition}]",
            "integrated_kitchen_instructions": f"{cook_method}\n\n[프렌차이즈 약선 업그레이드 조리법]:\n{kitchen_guide}"
        }
        
        return result

if __name__ == "__main__":
    engine = MFCOInferenceEngine()
    
    # Run simulation for all 18 states and save to preview file
    out_preview_path = os.path.join(engine.root_dir, "scratch", "inference_results_preview.txt")
    
    with open(out_preview_path, "w", encoding="utf-8") as f:
        f.write("==================================================\n")
        f.write("       MFCO SEMANTIC INFERENCE PIPELINE RUN       \n")
        f.write("      (User State -> Yakseon Kit -> Recipe)       \n")
        f.write("==================================================\n\n")
        
        states_to_test = [f"ST-{i:03d}" for i in range(1, 19)]
        for sid in states_to_test:
            res = engine.infer_recipe_upgrade(sid)
            if "error" in res:
                f.write(f"--- State: {sid} ---\nError: {res['error']}\n\n")
                continue
                
            f.write(f"--- User State: {res['state']['id']} ({res['state']['name']}) ---\n")
            f.write(f"State Definition: {res['state']['definition']}\n")
            f.write(f"Inferred Root Cause: {res['inference']['root_cause_id']} ({res['inference']['root_cause_name']}) [Confidence: {res['inference']['confidence_weight']}]\n")
            f.write(f"Target Functions: {res['inference']['target_functions']}\n")
            f.write(f"Matched Yakseon Kit: {res['yakseon_kit']['name']} ({res['yakseon_kit']['format']})\n")
            f.write(f"Kit Composition: {res['yakseon_kit']['composition']}\n")
            f.write(f"Base Recipe: {res['base_recipe']['name']} (ID: {res['base_recipe']['id']}, Main Ingredient: {res['base_recipe']['main_ingredient']})\n")
            f.write(f"Integrated Premium franchise Menu Name: {res['upgraded_recipe']['franchise_menu_name']}\n")
            f.write(f"Combined Ingredients: {res['upgraded_recipe']['combined_ingredients']}\n")
            f.write(f"Integrated Kitchen Instructions:\n{res['upgraded_recipe']['integrated_kitchen_instructions']}\n")
            f.write("-" * 50 + "\n\n")
            
    print("Inference simulation complete. Results saved to:", out_preview_path)
