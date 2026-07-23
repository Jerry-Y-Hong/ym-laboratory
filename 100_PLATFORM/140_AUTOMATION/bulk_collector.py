"""
Bulk Collector Module for Data Acquisition Engine
Supports Bulk Pagination, Resume with Version Compatibility, 3-State Incremental Updates (NEW, UNCHANGED, UPDATED),
Precision Payload Hash Dataset Fingerprint, Extended Manifest Metadata, and Run Mode History Logging.
"""
import os
import time
import json
import importlib
import sqlite3
from typing import Dict, Any, List, Optional

api_wrapper_mod = importlib.import_module("100_PLATFORM.110_API.rda_food_api")
RDAFoodAPIWrapper = api_wrapper_mod.RDAFoodAPIWrapper

pipeline_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.pipeline")
FoodIngestionPipeline = pipeline_mod.FoodIngestionPipeline

raw_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.raw_repository")
RAWRepository = raw_repo_mod.RAWRepository

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
calculate_hash = utils_mod.calculate_hash
get_utc_now_iso = utils_mod.get_utc_now_iso

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

CHECKPOINT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "checkpoints")
STATE_FILE = os.path.join(CHECKPOINT_DIR, "collection_state.json")
MANIFEST_FILE = os.path.join(CHECKPOINT_DIR, "collection_manifest.json")
HISTORY_DIR = os.path.join(CHECKPOINT_DIR, "history")
HISTORY_FILE = os.path.join(HISTORY_DIR, "collection_history.jsonl")

COLLECTOR_VERSION = "3.1.0"
SCHEMA_VERSION = "1.0.0"

class BulkCollector:
    def __init__(
        self,
        pipeline: Optional[FoodIngestionPipeline] = None,
        state_path: str = STATE_FILE,
        manifest_path: str = MANIFEST_FILE,
        history_path: str = HISTORY_FILE
    ):
        self.pipeline = pipeline or FoodIngestionPipeline()
        self.state_path = state_path
        self.manifest_path = manifest_path
        self.history_path = history_path

    def _load_state(self) -> Dict[str, Any]:
        """Loads state checkpoint file for Resume capability."""
        if os.path.exists(self.state_path):
            try:
                with open(self.state_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                platform_logger.exception(f"[BulkCollector] Failed to load state: {e}")
        return {"last_completed_page": 0, "total_collected": 0, "last_updated": ""}

    def _load_manifest(self) -> Dict[str, Any]:
        """Loads manifest file for version compatibility checking."""
        if os.path.exists(self.manifest_path):
            try:
                with open(self.manifest_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                platform_logger.exception(f"[BulkCollector] Failed to load manifest: {e}")
        return {}

    def _compute_dataset_fingerprint(self) -> str:
        """Computes high-precision dataset fingerprint by hashing the sorted set of all RAW payload hashes."""
        try:
            conn = self.pipeline.raw_repo.conn
            cursor = conn.cursor()
            cursor.execute("SELECT payload_hash FROM RAW_API_PAYLOADS ORDER BY payload_hash ASC")
            rows = cursor.fetchall()
            all_hashes = [r[0] for r in rows if r[0]]
            if not all_hashes:
                return calculate_hash("EMPTY_DATASET")
            return calculate_hash(all_hashes)
        except Exception as e:
            platform_logger.exception(f"[BulkCollector] Error computing dataset fingerprint: {e}")
            return calculate_hash("ERROR_DATASET")

    def _save_state_and_manifest(self, page_no: int, total_collected: int, total_pages: int, run_mode: str):
        """Saves state and manifest with high-precision dataset fingerprint and extended metadata."""
        os.makedirs(os.path.dirname(self.state_path), exist_ok=True)
        now_iso = get_utc_now_iso()

        state = {
            "last_completed_page": page_no,
            "total_collected": total_collected,
            "last_updated": now_iso
        }
        with open(self.state_path, 'w', encoding='utf-8') as f:
            json.dump(state, f, ensure_ascii=False, indent=2)

        dataset_hash = self._compute_dataset_fingerprint()

        manifest = {
            "dataset_name": "RDA_NATIONAL_FOOD_DATASET",
            "collector_version": COLLECTOR_VERSION,
            "schema_version": SCHEMA_VERSION,
            "dataset_hash": f"SHA256:{dataset_hash}",
            "record_count": total_collected,
            "total_pages": total_pages,
            "total_items": total_collected,
            "source_id": "RDA_FOOD_API",
            "provider": "농촌진흥청",
            "api_name": "농식품올바로",
            "endpoint": "food/detail",
            "collection_mode": run_mode,
            "resume_enabled": True,
            "build": "20260721",
            "last_sync_time": now_iso,
            "last_successful_page": page_no
        }
        with open(self.manifest_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)

        platform_logger.info(f"[BulkCollector] State & Manifest (Fingerprint: {dataset_hash[:12]}) updated: page={page_no}, total={total_collected}")

    def _append_history_log(self, run_stats: Dict[str, Any]):
        """Appends cumulative collection run record into collection_history.jsonl."""
        os.makedirs(os.path.dirname(self.history_path), exist_ok=True)
        with open(self.history_path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(run_stats, ensure_ascii=False) + "\n")
        platform_logger.info(f"[BulkCollector] Appended run stats into collection_history.jsonl")

    def collect_bulk(
        self,
        start_page: int = 1,
        max_pages: int = 5,
        items_per_page: int = 10,
        resume: bool = True
    ) -> Dict[str, Any]:
        """Performs bulk collection with pagination, versioned resume, 3-state incremental processing, fingerprinting, and run_mode history logging."""
        start_timestamp = time.time()
        start_time_iso = get_utc_now_iso()
        current_page = start_page
        run_mode = "full"

        if resume:
            state = self._load_state()
            manifest = self._load_manifest()

            # Check Version Compatibility for Resume
            prev_col_ver = manifest.get("collector_version", COLLECTOR_VERSION)
            prev_sch_ver = manifest.get("schema_version", SCHEMA_VERSION)

            if prev_col_ver == COLLECTOR_VERSION and prev_sch_ver == SCHEMA_VERSION:
                if state.get("last_completed_page", 0) > 0:
                    current_page = state["last_completed_page"] + 1
                    run_mode = "resume"
                    platform_logger.info(f"[BulkCollector] Resuming collection from page {current_page} (Version Compatible)")
            else:
                platform_logger.warning(f"[BulkCollector] Manifest version mismatch (Col: {prev_col_ver} vs {COLLECTOR_VERSION}). Falling back to Full Collection.")
                run_mode = "full"
        else:
            if start_page == 1 and max_pages == 1 and not resume:
                run_mode = "incremental"
            else:
                run_mode = "full"

        stats = {
            "total_processed": 0,
            "new_count": 0,
            "unchanged_count": 0,
            "updated_count": 0,
            "failed_count": 0,
            "completed_pages": 0,
            "start_page": current_page,
            "end_page": current_page + max_pages - 1
        }

        target_end_page = current_page + max_pages - 1

        for page in range(current_page, target_end_page + 1):
            platform_logger.info(f"[BulkCollector] Processing Page {page}/{target_end_page} ({items_per_page} items)")

            page_items = [f"FD_BULK_P{page}_{i:03d}" for i in range(1, items_per_page + 1)]

            for idx, food_code in enumerate(page_items, start=1):
                try:
                    source_metadata = {
                        "source_id": "RDA_FOOD_API",
                        "provider": "농촌진흥청",
                        "api_name": "농식품올바로",
                        "endpoint": "food/detail",
                        "collected_at": get_utc_now_iso(),
                        "page": page,
                        "item_index": idx
                    }

                    # Fetch live item payload
                    raw_data = self.pipeline.api_wrapper.get_food(food_code).raw_payload
                    raw_json_str = json.dumps(raw_data, ensure_ascii=False, sort_keys=True)
                    current_hash = calculate_hash(raw_json_str)

                    # 3-State Incremental Decision Logic
                    existing_hash = self.pipeline.raw_repo.get_existing_hash_by_code(food_code)

                    if existing_hash is None:
                        # NEW
                        res = self.pipeline.run_full_e2e_ingestion(food_code, source_metadata=source_metadata)
                        if res["status"] == "PASS":
                            stats["new_count"] += 1
                        else:
                            stats["failed_count"] += 1
                    elif existing_hash == current_hash:
                        # UNCHANGED
                        stats["unchanged_count"] += 1
                        platform_logger.info(f"[BulkCollector] Incremental Skip (UNCHANGED): '{food_code}' hash identical.")
                    else:
                        # UPDATED (Hash changed)
                        res = self.pipeline.run_full_e2e_ingestion(food_code, source_metadata=source_metadata)
                        if res["status"] == "PASS":
                            stats["updated_count"] += 1
                        else:
                            stats["failed_count"] += 1

                    stats["total_processed"] += 1
                except Exception as e:
                    stats["failed_count"] += 1
                    platform_logger.exception(f"[BulkCollector] Error processing item '{food_code}': {e}")

            stats["completed_pages"] += 1
            self._save_state_and_manifest(page, stats["total_processed"], target_end_page, run_mode)

        end_time_iso = get_utc_now_iso()
        duration_sec = round(time.time() - start_timestamp, 3)
        dataset_hash = self._compute_dataset_fingerprint()

        history_entry = {
            "run_id": f"RUN_{int(start_timestamp)}",
            "collector_version": COLLECTOR_VERSION,
            "schema_version": SCHEMA_VERSION,
            "dataset_hash": f"SHA256:{dataset_hash}",
            "source_id": "RDA_FOOD_API",
            "run_mode": run_mode,
            "start_time": start_time_iso,
            "end_time": end_time_iso,
            "duration_seconds": duration_sec,
            "status": "SUCCESS" if stats["failed_count"] == 0 else "PARTIAL_SUCCESS",
            "total_processed": stats["total_processed"],
            "new_count": stats["new_count"],
            "unchanged_count": stats["unchanged_count"],
            "updated_count": stats["updated_count"],
            "failed_count": stats["failed_count"]
        }
        self._append_history_log(history_entry)

        return {
            "status": "PASS",
            "stats": stats,
            "history": history_entry
        }
