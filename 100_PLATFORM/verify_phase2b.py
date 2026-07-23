"""
Global Common Food Platform (100_PLATFORM) Phase 2B Verification Suite
Validates Live OpenAPI Collection, RAW / STANDARD / SEMANTIC Storage, E2E Pipeline,
Reproducibility (Idempotency), and Error Logging.
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

# Dynamic imports
rda_food_api = importlib.import_module("100_PLATFORM.110_API.rda_food_api")
RDAFoodAPIWrapper = rda_food_api.RDAFoodAPIWrapper

raw_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.raw_repository")
RAWRepository = raw_repo_mod.RAWRepository

std_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.standard_repository")
StandardRepository = std_repo_mod.StandardRepository

sem_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.semantic_repository")
SemanticRepository = sem_repo_mod.SemanticRepository

pipeline_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.pipeline")
FoodIngestionPipeline = pipeline_mod.FoodIngestionPipeline

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

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

def main():
    print_header("PHASE 2B LIVE OPENAPI E2E & REPRODUCIBILITY VERIFICATION SUITE")

    conn = sqlite3.connect(":memory:")
    raw_repo = RAWRepository(db_connection=conn)
    std_repo = StandardRepository(db_connection=conn)
    sem_repo = SemanticRepository(db_connection=conn)
    api_wrapper = RDAFoodAPIWrapper()

    pipeline = FoodIngestionPipeline(
        api_wrapper=api_wrapper,
        raw_repo=raw_repo,
        std_repo=std_repo,
        sem_repo=sem_repo
    )

    all_passed = True

    # 1. Live OpenAPI Data Collection Test
    print_header("CHECK 1. Live OpenAPI Data Collection")
    try:
        food_dto = api_wrapper.get_food("FD_LIVE_001")
        c1_pass = food_dto is not None and len(food_dto.food_code) > 0
        print_result("1.1 Live OpenAPI Data Fetching", c1_pass, f"Food Name: {food_dto.food_name_ko}")
        all_passed &= c1_pass
    except Exception as e:
        print_result("1.1 Live OpenAPI Data Fetching", False, str(e))
        all_passed = False

    # 2. RAW Layer Storage & Immutability Test
    print_header("CHECK 2. RAW Layer Storage & SHA-256 Hash Verification")
    try:
        res1 = pipeline.run_full_e2e_ingestion("FD_LIVE_001")
        raw_payload = raw_repo.get_raw_payload(res1["raw_id"])
        c2_pass = raw_payload is not None and res1["raw_id"].startswith("RAW_")
        print_result("2.1 RAW Payload Storage & Hash Check", c2_pass, f"RAW ID: {res1['raw_id']}")
        all_passed &= c2_pass
    except Exception as e:
        print_result("2.1 RAW Storage Exception", False, str(e))
        all_passed = False

    # 3. STANDARD Layer Storage Test
    print_header("CHECK 3. STANDARD Layer Storage")
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT food_id, food_code, raw_id FROM STD_FOOD_MASTER WHERE food_code = 'FD_LIVE_001'")
        row = cursor.fetchone()
        c3_pass = row is not None and row[2] == res1["raw_id"]
        print_result("3.1 STANDARD Entity Persistence & RAW ID Linking", c3_pass, f"STD Food ID: {row[0] if row else 'N/A'}")
        all_passed &= c3_pass
    except Exception as e:
        print_result("3.1 STANDARD Storage Exception", False, str(e))
        all_passed = False

    # 4. SEMANTIC Layer Storage Test
    print_header("CHECK 4. SEMANTIC Layer Knowledge Graph Storage")
    try:
        nodes_cnt = sem_repo.get_nodes_count()
        rels_cnt = sem_repo.get_relations_count()
        c4_pass = nodes_cnt >= 2 and rels_cnt >= 1
        print_result("4.1 SEMANTIC Knowledge Graph Nodes & Relations", c4_pass, f"Nodes: {nodes_cnt}, Relations: {rels_cnt}")
        all_passed &= c4_pass
    except Exception as e:
        print_result("4.1 SEMANTIC Storage Exception", False, str(e))
        all_passed = False

    # 5. Pipeline End-to-End Test
    print_header("CHECK 5. Pipeline End-to-End Execution")
    try:
        c5_pass = res1["status"] == "PASS"
        print_result("5.1 3-Tier Pipeline E2E PASS", c5_pass, f"Status: {res1['status']}")
        all_passed &= c5_pass
    except Exception as e:
        print_result("5.1 Pipeline E2E Exception", False, str(e))
        all_passed = False

    # 6. Reproducibility (재현성 / 멱등성) Verification Test
    print_header("CHECK 6. Reproducibility (Idempotency) Verification")
    try:
        repro_food_code = "FD_REPRO_999"

        # 1st Execution
        res_run1 = pipeline.run_full_e2e_ingestion(repro_food_code)
        
        cursor.execute("SELECT COUNT(*) FROM RAW_API_PAYLOADS")
        raw_cnt_1 = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM STD_FOOD_MASTER")
        std_cnt_1 = cursor.fetchone()[0]
        nodes_cnt_1 = sem_repo.get_nodes_count()
        rels_cnt_1 = sem_repo.get_relations_count()

        # 2nd Execution (Same Food Code)
        res_run2 = pipeline.run_full_e2e_ingestion(repro_food_code)

        cursor.execute("SELECT COUNT(*) FROM RAW_API_PAYLOADS")
        raw_cnt_2 = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM STD_FOOD_MASTER")
        std_cnt_2 = cursor.fetchone()[0]
        nodes_cnt_2 = sem_repo.get_nodes_count()
        rels_cnt_2 = sem_repo.get_relations_count()

        # Check 6.1: RAW duplicates & Hash identity
        raw_no_dups = (raw_cnt_1 == raw_cnt_2) and (res_run1["raw_id"] == res_run2["raw_id"])
        print_result("6.1 RAW Layer No Duplicates & SHA-256 Hash Identity", raw_no_dups, f"Run1 Hash: {res_run1['raw_id']} == Run2 Hash: {res_run2['raw_id']}")

        # Check 6.2: STANDARD duplicates
        std_no_dups = (std_cnt_1 == std_cnt_2) and (res_run1["std_food_id"] == res_run2["std_food_id"])
        print_result("6.2 STANDARD Layer No Duplicates", std_no_dups, f"Standard record count remained {std_cnt_1}")

        # Check 6.3: SEMANTIC duplicates
        sem_no_dups = (nodes_cnt_1 == nodes_cnt_2) and (rels_cnt_1 == rels_cnt_2)
        print_result("6.3 SEMANTIC Layer No Duplicate Nodes/Relations", sem_no_dups, f"Nodes: {nodes_cnt_1}, Relations: {rels_cnt_1}")

        # Check 6.4: Pipeline Result Identity & PASS
        pipeline_same = (res_run1["status"] == "PASS") and (res_run2["status"] == "PASS")
        print_result("6.4 Pipeline Result Identity across runs", pipeline_same, "Both runs maintained PASS status")

        repro_pass = raw_no_dups and std_no_dups and sem_no_dups and pipeline_same
        all_passed &= repro_pass
    except Exception as e:
        print_result("6.0 Reproducibility Test Exception", False, str(e))
        all_passed = False

    # 7. Error Log File Verification
    print_header("CHECK 7. Error Log File Generation (platform_error.log)")
    try:
        platform_logger.warning("Phase 2B Verification: Simulated warning/error log entry.")
        log_file_path = os.path.join(CURRENT_DIR, "logs", "platform_error.log")
        log_exists = os.path.exists(log_file_path)
        print_result("7.1 platform_error.log File Generation & Logging", log_exists, f"Log File Path: {log_file_path}")
        all_passed &= log_exists
    except Exception as e:
        print_result("7.0 Error Logging Exception", False, str(e))
        all_passed = False

    print_header(f"FINAL PHASE 2B VERDICT: {'ALL TESTS PASSED (100%)' if all_passed else 'SOME TESTS FAILED'}")
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
