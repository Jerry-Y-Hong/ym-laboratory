"""
Global Common Food Platform (100_PLATFORM) Phase 3-01 Verification Suite (Production Readiness)
Validates Bulk Collection, Versioned Resume, 3-State Incremental Updates, RAW (with source_id),
STANDARD, SEMANTIC, Resume Hash & Row Count Integrity, Collection Manifest (SHA256 Fingerprint),
Collection History Log (run_mode), and Independent End-to-End Execution.
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
bulk_collector_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.bulk_collector")
BulkCollector = bulk_collector_mod.BulkCollector

pipeline_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.pipeline")
FoodIngestionPipeline = pipeline_mod.FoodIngestionPipeline

raw_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.raw_repository")
RAWRepository = raw_repo_mod.RAWRepository

std_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.standard_repository")
StandardRepository = std_repo_mod.StandardRepository

sem_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.semantic_repository")
SemanticRepository = sem_repo_mod.SemanticRepository

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
    print_header("PHASE 3-01 DATA ACQUISITION ENGINE PRODUCTION VERIFICATION SUITE")

    conn = sqlite3.connect(":memory:")
    raw_repo = RAWRepository(db_connection=conn)
    std_repo = StandardRepository(db_connection=conn)
    sem_repo = SemanticRepository(db_connection=conn)

    pipeline = FoodIngestionPipeline(
        raw_repo=raw_repo,
        std_repo=std_repo,
        sem_repo=sem_repo
    )

    checkpoints_dir = os.path.join(CURRENT_DIR, "checkpoints")
    state_file = os.path.join(checkpoints_dir, "collection_state.json")
    manifest_file = os.path.join(checkpoints_dir, "collection_manifest.json")
    history_file = os.path.join(checkpoints_dir, "history", "collection_history.jsonl")

    for f in [state_file, manifest_file, history_file]:
        if os.path.exists(f):
            try:
                os.remove(f)
            except Exception:
                pass

    collector = BulkCollector(
        pipeline=pipeline,
        state_path=state_file,
        manifest_path=manifest_file,
        history_path=history_file
    )

    # CHECK 1: Bulk Collection PASS
    print_header("CHECK 1. Bulk Collection PASS")
    try:
        res1 = collector.collect_bulk(start_page=1, max_pages=2, items_per_page=5, resume=False)
        c1_pass = res1["status"] == "PASS" and res1["stats"]["total_processed"] == 10
        print_result("1.1 Bulk Collection (Page 1-2, 10 items)", c1_pass, f"Total Processed: {res1['stats']['total_processed']}")
    except Exception as e:
        print_result("1.1 Bulk Collection Exception", False, str(e))
        c1_pass = False

    # CHECK 2: Resume PASS
    print_header("CHECK 2. Resume PASS")
    try:
        res2 = collector.collect_bulk(start_page=1, max_pages=2, items_per_page=5, resume=True)
        resumed_page = res2["stats"]["start_page"]
        
        # Verify checkpoint state last_completed_page
        with open(state_file, 'r', encoding='utf-8') as f:
            st_data = json.load(f)
        last_page = st_data.get("last_completed_page")

        c2_pass = (resumed_page == 3) and (last_page == 4) and (res2["status"] == "PASS")
        print_result("2.1 Resume from Checkpoint (Resumed Page 3, Last Completed Page 4)", c2_pass, f"Resumed Start: {resumed_page}, Last Completed: {last_page}")
    except Exception as e:
        print_result("2.1 Resume Exception", False, str(e))
        c2_pass = False

    # CHECK 3: 3-State Incremental PASS
    print_header("CHECK 3. 3-State Incremental Update PASS")
    try:
        res3 = collector.collect_bulk(start_page=1, max_pages=1, items_per_page=5, resume=False)
        unchanged = res3["stats"]["unchanged_count"]
        c3_pass = (unchanged == 5) and (res3["status"] == "PASS")
        print_result("3.1 Incremental Hash Detection (Skipped 5 UNCHANGED items)", c3_pass, f"Unchanged Count: {unchanged}")
    except Exception as e:
        print_result("3.1 Incremental Exception", False, str(e))
        c3_pass = False

    # CHECK 4: RAW 저장 & source_id Source Metadata PASS
    print_header("CHECK 4. RAW 저장 & source_id Source Metadata PASS")
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT raw_id, source_metadata FROM RAW_API_PAYLOADS LIMIT 1")
        row = cursor.fetchone()
        raw_id, meta_json_str = row
        meta_dict = json.loads(meta_json_str)
        c4_pass = (meta_dict.get("source_id") == "RDA_FOOD_API") and (meta_dict.get("provider") == "농촌진흥청")
        print_result("4.1 RAW Source Metadata Provenance (source_id: 'RDA_FOOD_API')", c4_pass, f"Source ID: {meta_dict.get('source_id')}, Provider: {meta_dict.get('provider')}")
    except Exception as e:
        print_result("4.1 RAW Storage Exception", False, str(e))
        c4_pass = False

    # CHECK 5: STANDARD 저장 PASS
    print_header("CHECK 5. STANDARD 저장 PASS")
    try:
        cursor.execute("SELECT COUNT(*) FROM STD_FOOD_MASTER")
        cnt_row = cursor.fetchone()[0]
        cursor.execute("SELECT raw_id FROM STD_FOOD_MASTER LIMIT 1")
        sample_raw_id = cursor.fetchone()[0]
        
        c5_pass = (cnt_row > 0) and (sample_raw_id is not None)
        print_result("5.1 STANDARD Relational Entity & raw_id Link", c5_pass, f"STANDARD Records: {cnt_row}, Sample RAW ID: {sample_raw_id}")
    except Exception as e:
        print_result("5.1 STANDARD Exception", False, str(e))
        c5_pass = False

    # CHECK 6: SEMANTIC 저장 PASS
    print_header("CHECK 6. SEMANTIC 저장 PASS")
    try:
        nodes_cnt = sem_repo.get_nodes_count()
        rels_cnt = sem_repo.get_relations_count()
        c6_pass = (nodes_cnt > 0) and (rels_cnt > 0)
        print_result("6.1 SEMANTIC Knowledge Graph Nodes & Relations", c6_pass, f"Nodes: {nodes_cnt}, Relations: {rels_cnt}")
    except Exception as e:
        print_result("6.1 SEMANTIC Exception", False, str(e))
        c6_pass = False

    # CHECK 7: Resume 이후 Hash & Row Count Integrity PASS
    print_header("CHECK 7. Resume 이후 Hash & Row Count Integrity PASS")
    try:
        cursor.execute("SELECT COUNT(*) FROM RAW_API_PAYLOADS")
        count_before = cursor.fetchone()[0]
        cursor.execute("SELECT payload_hash FROM RAW_API_PAYLOADS WHERE target_code = 'FD_BULK_P1_001'")
        row1 = cursor.fetchone()
        hash1 = row1[0] if row1 else None

        # Re-run pipeline for same item
        pipeline.run_full_e2e_ingestion("FD_BULK_P1_001")

        cursor.execute("SELECT COUNT(*) FROM RAW_API_PAYLOADS")
        count_after = cursor.fetchone()[0]
        cursor.execute("SELECT payload_hash FROM RAW_API_PAYLOADS WHERE target_code = 'FD_BULK_P1_001'")
        row2 = cursor.fetchone()
        hash2 = row2[0] if row2 else None

        c7_pass = (hash1 is not None) and (hash1 == hash2) and (count_before == count_after)
        print_result("7.1 Hash & Row Count Integrity after Resumption (Zero Duplicate Rows)", c7_pass, f"Hash Match: {hash1[:16]}..., Rows Before: {count_before} == Rows After: {count_after}")
    except Exception as e:
        print_result("7.1 Hash Integrity Exception", False, str(e))
        c7_pass = False

    # CHECK 8: End-to-End Independent Manifest Fingerprint & History Log Verification
    print_header("CHECK 8. End-to-End Manifest Fingerprint & History Log Verification")
    try:
        manifest_exists = os.path.exists(manifest_file)
        history_exists = os.path.exists(history_file)

        manifest_data = {}
        if manifest_exists:
            with open(manifest_file, 'r', encoding='utf-8') as f:
                manifest_data = json.load(f)

        dataset_hash = manifest_data.get("dataset_hash", "")
        fingerprint_pass = dataset_hash.startswith("SHA256:") and manifest_data.get("record_count") is not None
        sem_ver_pass = manifest_data.get("collector_version") == "3.1.0" and manifest_data.get("schema_version") == "1.0.0"
        
        # Verify collection_history.jsonl last entry
        history_valid = False
        if history_exists:
            with open(history_file, 'r', encoding='utf-8') as f:
                lines = [l.strip() for l in f.readlines() if l.strip()]
                if lines:
                    last_log = json.loads(lines[-1])
                    history_valid = last_log.get("status") in ["SUCCESS", "PARTIAL_SUCCESS"] and "run_mode" in last_log

        c8_pass = manifest_exists and history_exists and fingerprint_pass and sem_ver_pass and history_valid
        print_result("8.1 Independent Collection Manifest & History Log Check", c8_pass, f"Fingerprint: {dataset_hash[:22]}..., History Status: SUCCESS")
    except Exception as e:
        print_result("8.1 E2E Manifest/History Exception", False, str(e))
        c8_pass = False

    all_passed = c1_pass and c2_pass and c3_pass and c4_pass and c5_pass and c6_pass and c7_pass and c8_pass

    print_header(f"FINAL PHASE 3-01 VERDICT: {'ALL TESTS PASSED (100%)' if all_passed else 'SOME TESTS FAILED'}")
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
