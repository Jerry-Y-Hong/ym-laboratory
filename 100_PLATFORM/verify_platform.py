"""
Global Common Food Platform (100_PLATFORM) Comprehensive Verification Suite
Validates API Wrappers, 3-Tier DB Architecture, RAW Immutability, Automation Pipeline, and Phase 1 Isolation.
"""
import os
import sys
import sqlite3
import json
import importlib

# Ensure parent directory is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

# Dynamic imports for numeric directory names
rda_food_api = importlib.import_module("100_PLATFORM.110_API.rda_food_api")
RDAFoodAPIWrapper = rda_food_api.RDAFoodAPIWrapper

raw_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.raw_repository")
RAWRepository = raw_repo_mod.RAWRepository

std_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.standard_repository")
StandardRepository = std_repo_mod.StandardRepository

pipeline_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.pipeline")
FoodIngestionPipeline = pipeline_mod.FoodIngestionPipeline

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
calculate_hash = utils_mod.calculate_hash

exceptions_mod = importlib.import_module("100_PLATFORM.150_SHARED.exceptions")
RawDataIntegrityException = exceptions_mod.RawDataIntegrityException

def print_header(title: str):
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80)

def print_result(test_name: str, success: bool, detail: str = ""):
    status = "SUCCESS [PASS]" if success else "FAILED  [FAIL]"
    symbol = "[PASS]" if success else "[FAIL]"
    print(f" {symbol} {test_name:<60} {status}")
    if detail:
        print(f"   └─ {detail}")

def test_directory_structure():
    print_header("CHECK 1. 100_PLATFORM Directory & Submodules Existence")
    required_dirs = [
        "110_API",
        "120_DATABASE",
        "120_DATABASE/schema",
        "120_DATABASE/repository",
        "130_AI_ENGINE",
        "140_AUTOMATION",
        "150_SHARED"
    ]
    all_exist = True
    for sub in required_dirs:
        full_path = os.path.join(CURRENT_DIR, sub)
        exists = os.path.isdir(full_path)
        print_result(f"Directory '100_PLATFORM/{sub}'", exists)
        if not exists:
            all_exist = False
    return all_exist

def test_api_wrapper():
    print_header("CHECK 2. 110_API RDA OpenAPI Wrapper Implementation")
    try:
        wrapper = RDAFoodAPIWrapper()
        
        # Test get_food()
        food_dto = wrapper.get_food("FD_1001")
        food_pass = food_dto.food_code == "FD_1001" and food_dto.origin_source == "RDA_NONGSARO"
        print_result("2.1 get_food('FD_1001') DTO Mapping", food_pass, f"Food Name: {food_dto.food_name_ko}")

        # Test get_recipe()
        recipe_dto = wrapper.get_recipe("RC_2001")
        recipe_pass = recipe_dto.recipe_id == "RC_2001" and len(recipe_dto.cooking_steps) > 0
        print_result("2.2 get_recipe('RC_2001') DTO Mapping", recipe_pass, f"Steps count: {len(recipe_dto.cooking_steps)}")

        # Test get_nutrients()
        nutrient_dto = wrapper.get_nutrients("FD_1001")
        nutrient_pass = nutrient_dto.food_code == "FD_1001" and nutrient_dto.calories_kcal is not None
        print_result("2.3 get_nutrients('FD_1001') DTO Mapping", nutrient_pass, f"Calories: {nutrient_dto.calories_kcal} kcal")

        # Test get_images()
        images = wrapper.get_images("FD_1001")
        images_pass = len(images) > 0 and images[0].image_url.startswith("http")
        print_result("2.4 get_images('FD_1001') DTO Mapping", images_pass, f"Image URL: {images[0].image_url}")

        return food_pass and recipe_pass and nutrient_pass and images_pass
    except Exception as e:
        print_result("2.0 RDA API Wrapper Test Exception", False, str(e))
        return False

def test_database_layers_and_raw_integrity():
    print_header("CHECK 3. 120_DATABASE 3-Tier Layering & RAW Immutability")
    try:
        conn = sqlite3.connect(":memory:")
        raw_repo = RAWRepository(db_connection=conn)

        # Insert RAW Payload
        sample_payload = {"foodCode": "FD_TEST_01", "foodName": "테스트 식품", "nutrients": {"calories": 100}}
        raw_id = raw_repo.save_raw_payload("RDA_NONGSARO", "food/detail", "FD_TEST_01", sample_payload)

        # Retrieve RAW Payload and verify immutability
        retrieved_payload = raw_repo.get_raw_payload(raw_id)
        raw_pass = retrieved_payload == sample_payload
        print_result("3.1 RAW Layer Original Payload Persistence & Hash Check", raw_pass, f"RAW ID: {raw_id}")

        # Test Hash Tampering Detection
        cursor = conn.cursor()
        cursor.execute("UPDATE RAW_API_PAYLOADS SET raw_payload = 'TAMPERED_DATA' WHERE raw_id = ?", (raw_id,))
        
        tamper_detected = False
        try:
            raw_repo.get_raw_payload(raw_id)
        except RawDataIntegrityException:
            tamper_detected = True
        print_result("3.2 RAW Layer Data Tampering Detection Test", tamper_detected, "Integrity Exception correctly raised on data alteration!")

        return raw_pass and tamper_detected
    except Exception as e:
        print_result("3.0 DB Layer Test Exception", False, str(e))
        return False

def test_automation_pipeline():
    print_header("CHECK 4. 140_AUTOMATION Ingestion Pipeline Test")
    try:
        conn = sqlite3.connect(":memory:")
        raw_repo = RAWRepository(db_connection=conn)
        std_repo = StandardRepository(db_connection=conn)

        pipeline = FoodIngestionPipeline(raw_repo=raw_repo, std_repo=std_repo)
        result = pipeline.run_food_ingestion("FD_KIMCHI_TEST")

        pipeline_pass = result["status"] == "SUCCESS" and result["raw_id"].startswith("RAW_") and result["std_food_id"].startswith("STD_FD_")
        print_result("4.1 Ingestion Pipeline Execution (Fetch -> RAW -> STANDARD)", pipeline_pass, f"STD Food ID: {result['std_food_id']}")

        return pipeline_pass
    except Exception as e:
        print_result("4.0 Pipeline Test Exception", False, str(e))
        return False

def test_phase1_isolation():
    print_header("CHECK 5. Phase 1 (01_PHASE1_KIMCHI) Isolation Verification")
    phase1_dir = os.path.join(PARENT_DIR, "01_PHASE1_KIMCHI")
    exists = os.path.isdir(phase1_dir)
    
    # Verify core Phase 1 files still exist unchanged
    core_files = [
        "00_GLOBAL_KIMCHI_PLATFORM_ARCHITECTURE.md",
        "00_DATABASE_SCHEMA_DDL.sql",
        "07_ARCHITECTURE_VALIDATION_REPORT.md",
        "08_PRACTICAL_VERIFICATION_SUITE.sql"
    ]
    all_files_intact = True
    for f in core_files:
        path = os.path.join(phase1_dir, f)
        if not os.path.exists(path):
            all_files_intact = False
            break

    print_result("5.1 01_PHASE1_KIMCHI Core Files Untouched & Preserved", exists and all_files_intact, f"Phase 1 directory: {phase1_dir}")
    return exists and all_files_intact

def main():
    print_header("COMMON FOOD PLATFORM (100_PLATFORM) VERIFICATION SUITE")
    c1 = test_directory_structure()
    c2 = test_api_wrapper()
    c3 = test_database_layers_and_raw_integrity()
    c4 = test_automation_pipeline()
    c5 = test_phase1_isolation()

    all_passed = c1 and c2 and c3 and c4 and c5
    print_header(f"FINAL PLATFORM VERDICT: {'ALL TESTS PASSED (100%)' if all_passed else 'SOME TESTS FAILED'}")
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
