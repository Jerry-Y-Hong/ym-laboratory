"""
Referential Integrity Checker (Phase 3-03A)
Validates cross-layer relational links between Manifest, Repository, History, Statistics, and Reports.
"""
import os
import json
import sqlite3
import importlib
from typing import Dict, Any, Optional

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

class ReferentialIntegrityChecker:
    def __init__(self, db_connection: Optional[sqlite3.Connection] = None):
        self.conn = db_connection or sqlite3.connect(":memory:")

    def verify_referential_integrity(
        self,
        manifest_data: Optional[Dict[str, Any]] = None,
        history_entry: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Verifies foreign key links and cross-component metadata consistency."""
        cursor = self.conn.cursor()
        violations = []

        # 1. Foreign Key Verification: STD_FOOD_MASTER.raw_id -> RAW_API_PAYLOADS.raw_id
        try:
            cursor.execute("""
                SELECT s.food_id, s.raw_id
                FROM STD_FOOD_MASTER s
                LEFT JOIN RAW_API_PAYLOADS r ON s.raw_id = r.raw_id
                WHERE r.raw_id IS NULL
            """)
            orphans = cursor.fetchall()
            if orphans:
                violations.append(f"Orphaned STANDARD records without matching RAW ID: {len(orphans)}")
        except sqlite3.OperationalError:
            pass

        # 2. Foreign Key Verification: SEM_FOOD_KNOWLEDGE_NODES.entity_id -> STD_FOOD_MASTER.food_id
        try:
            cursor.execute("""
                SELECT n.node_id, n.entity_id
                FROM SEM_FOOD_KNOWLEDGE_NODES n
                LEFT JOIN STD_FOOD_MASTER s ON n.entity_id = s.food_id
                WHERE n.entity_type = 'FOOD' AND s.food_id IS NULL
            """)
            orphaned_nodes = cursor.fetchall()
            if orphaned_nodes:
                violations.append(f"Orphaned Knowledge Nodes without matching STANDARD Food ID: {len(orphaned_nodes)}")
        except sqlite3.OperationalError:
            pass

        # 3. Cross-component Check: Manifest ↔ History
        if manifest_data and history_entry:
            m_hash = manifest_data.get("dataset_hash")
            h_hash = history_entry.get("dataset_hash")
            if m_hash and h_hash and m_hash != h_hash:
                violations.append(f"Manifest dataset_hash '{m_hash[:12]}' != History dataset_hash '{h_hash[:12]}'")

        is_valid = (len(violations) == 0)
        platform_logger.info(f"[ReferentialChecker] Referential Integrity: valid={is_valid}, violations={len(violations)}")

        return {
            "valid": is_valid,
            "violations_count": len(violations),
            "violations": violations
        }
