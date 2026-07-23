"""
RAW Layer Repository
Handles immutable persistence of original OpenAPI payloads with Source Metadata provenance & Source ID.
"""
import uuid
import json
import sqlite3
import importlib
from typing import Dict, Any, Optional

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
calculate_hash = utils_mod.calculate_hash
get_utc_now_iso = utils_mod.get_utc_now_iso

exceptions_mod = importlib.import_module("100_PLATFORM.150_SHARED.exceptions")
RawDataIntegrityException = exceptions_mod.RawDataIntegrityException

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

class RAWRepository:
    def __init__(self, db_connection: Optional[sqlite3.Connection] = None):
        self.conn = db_connection or sqlite3.connect(":memory:")
        self._ensure_table_exists()

    def _ensure_table_exists(self):
        with self.conn:
            self.conn.execute("""
            CREATE TABLE IF NOT EXISTS RAW_API_PAYLOADS (
                raw_id TEXT PRIMARY KEY,
                source_system TEXT NOT NULL,
                endpoint TEXT NOT NULL,
                target_code TEXT NOT NULL,
                raw_payload TEXT NOT NULL,
                payload_hash TEXT UNIQUE NOT NULL,
                source_metadata TEXT,
                ingested_at TEXT NOT NULL
            );
            """)
            self.conn.execute("CREATE INDEX IF NOT EXISTS idx_raw_target_code ON RAW_API_PAYLOADS(target_code);")

    def get_existing_hash_by_code(self, target_code: str) -> Optional[str]:
        """Returns payload_hash of existing record for target_code, or None if not present."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT payload_hash FROM RAW_API_PAYLOADS WHERE target_code = ? ORDER BY ingested_at DESC LIMIT 1", (target_code,))
        row = cursor.fetchone()
        return row[0] if row else None

    def save_raw_payload(
        self,
        source_system: str,
        endpoint: str,
        target_code: str,
        raw_data: Dict[str, Any],
        source_metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Saves unmodified RAW payload with Source Metadata provenance (including source_id) into RAW table."""
        if source_metadata is None:
            source_metadata = {}

        if "source_id" not in source_metadata:
            source_metadata["source_id"] = "RDA_FOOD_API"
        if "provider" not in source_metadata:
            source_metadata["provider"] = "농촌진흥청"
        if "api_name" not in source_metadata:
            source_metadata["api_name"] = "농식품올바로"
        if "endpoint" not in source_metadata:
            source_metadata["endpoint"] = endpoint
        if "collected_at" not in source_metadata:
            source_metadata["collected_at"] = get_utc_now_iso()

        raw_json_str = json.dumps(raw_data, ensure_ascii=False, sort_keys=True)
        meta_json_str = json.dumps(source_metadata, ensure_ascii=False, sort_keys=True)
        payload_hash = calculate_hash(raw_json_str)
        raw_id = f"RAW_{payload_hash[:16]}"
        ingested_at = get_utc_now_iso()

        platform_logger.info(f"[RAW Repo] Saving raw payload: ID={raw_id}, SourceID={source_metadata['source_id']}, Code={target_code}")

        try:
            with self.conn:
                self.conn.execute("""
                    INSERT INTO RAW_API_PAYLOADS (raw_id, source_system, endpoint, target_code, raw_payload, payload_hash, source_metadata, ingested_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(payload_hash) DO UPDATE SET
                        source_metadata = excluded.source_metadata,
                        ingested_at = excluded.ingested_at
                """, (raw_id, source_system, endpoint, target_code, raw_json_str, payload_hash, meta_json_str, ingested_at))
            return raw_id
        except sqlite3.Error as e:
            platform_logger.exception(f"[RAW Repo] Database error saving payload for {target_code}: {e}")
            raise

    def get_raw_payload(self, raw_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves and verifies raw payload without modification."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT raw_id, raw_payload, payload_hash, source_metadata FROM RAW_API_PAYLOADS WHERE raw_id = ?", (raw_id,))
        row = cursor.fetchone()
        if not row:
            return None

        r_id, raw_payload_str, expected_hash, meta_str = row
        current_hash = calculate_hash(raw_payload_str)
        if current_hash != expected_hash:
            raise RawDataIntegrityException(f"Hash mismatch for RAW ID {r_id}! Expected {expected_hash}, got {current_hash}")

        payload = json.loads(raw_payload_str)
        if meta_str:
            payload["_source_metadata"] = json.loads(meta_str)
        return payload
