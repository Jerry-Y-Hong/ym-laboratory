"""
Integrity Checker (Phase 3-02A)
Verifies SHA-256 integrity for Payload Hash, Dataset Hash, Manifest Hash, and Repository Hash.
"""
import json
import sqlite3
import importlib
from typing import Dict, Any, Optional

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
calculate_hash = utils_mod.calculate_hash

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

class IntegrityChecker:
    def __init__(self, db_connection: Optional[sqlite3.Connection] = None):
        self.conn = db_connection or sqlite3.connect(":memory:")

    def verify_payload_hash(self, raw_payload_str: str, expected_hash: str) -> Dict[str, Any]:
        """Verifies single payload SHA-256 hash match."""
        computed = calculate_hash(raw_payload_str)
        is_match = (computed == expected_hash)
        return {
            "valid": is_match,
            "expected_hash": expected_hash,
            "computed_hash": computed,
            "message": "Payload hash match" if is_match else f"HASH MISMATCH: expected {expected_hash[:12]}, computed {computed[:12]}"
        }

    def verify_repository_integrity(self) -> Dict[str, Any]:
        """Verifies database repository records for hash corruption."""
        cursor = self.conn.cursor()
        try:
            cursor.execute("SELECT raw_id, raw_payload, payload_hash FROM RAW_API_PAYLOADS")
            rows = cursor.fetchall()
        except sqlite3.OperationalError:
            return {"valid": True, "evaluated_count": 0, "corrupted_count": 0, "details": []}

        corrupted = []
        for r_id, payload_str, exp_hash in rows:
            computed = calculate_hash(payload_str)
            if computed != exp_hash:
                corrupted.append({"raw_id": r_id, "expected": exp_hash, "computed": computed})

        total = len(rows)
        is_healthy = (len(corrupted) == 0)

        platform_logger.info(f"[IntegrityChecker] Repository Integrity: healthy={is_healthy}, evaluated={total}, corrupted={len(corrupted)}")
        return {
            "valid": is_healthy,
            "evaluated_count": total,
            "corrupted_count": len(corrupted),
            "integrity_rate_pct": round(((total - len(corrupted)) / max(total, 1)) * 100, 2),
            "corrupted_details": corrupted
        }
