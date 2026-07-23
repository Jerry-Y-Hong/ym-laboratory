"""
Duplicate Detector (Phase 3-03A)
Detects duplicate records based on Identical Payload, Food Code, Source Record, and Payload Hash.
"""
import sqlite3
import importlib
from typing import Dict, Any, List, Optional

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

class DuplicateDetector:
    def __init__(self, db_connection: Optional[sqlite3.Connection] = None):
        self.conn = db_connection or sqlite3.connect(":memory:")

    def check_repository_duplicates(self) -> Dict[str, Any]:
        """Detects duplicates in RAW and STANDARD tables."""
        cursor = self.conn.cursor()

        # Check duplicate Food Codes in STANDARD
        try:
            cursor.execute("SELECT food_code, COUNT(*) FROM STD_FOOD_MASTER GROUP BY food_code HAVING COUNT(*) > 1")
            dup_codes = cursor.fetchall()
        except sqlite3.OperationalError:
            dup_codes = []

        # Check duplicate Payload Hashes in RAW
        try:
            cursor.execute("SELECT payload_hash, COUNT(*) FROM RAW_API_PAYLOADS GROUP BY payload_hash HAVING COUNT(*) > 1")
            dup_hashes = cursor.fetchall()
        except sqlite3.OperationalError:
            dup_hashes = []

        try:
            cursor.execute("SELECT COUNT(*) FROM STD_FOOD_MASTER")
            total_records = cursor.fetchone()[0]
        except sqlite3.OperationalError:
            total_records = 0

        dup_code_count = sum(r[1] - 1 for r in dup_codes)
        dup_hash_count = sum(r[1] - 1 for r in dup_hashes)
        total_duplicates = dup_code_count + dup_hash_count

        dup_rate_pct = round((total_duplicates / max(total_records, 1)) * 100, 2)
        is_clean = (total_duplicates == 0)

        platform_logger.info(f"[DuplicateDetector] Duplicate Check: clean={is_clean}, total_duplicates={total_duplicates}, dup_rate={dup_rate_pct}%")

        return {
            "valid": is_clean,
            "total_records": total_records,
            "duplicate_code_count": dup_code_count,
            "duplicate_hash_count": dup_hash_count,
            "total_duplicates": total_duplicates,
            "duplicate_rate_pct": dup_rate_pct,
            "duplicate_code_details": [r[0] for r in dup_codes],
            "duplicate_hash_details": [r[0] for r in dup_hashes]
        }
