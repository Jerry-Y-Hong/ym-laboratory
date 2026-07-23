"""
SEMANTIC Layer Repository
Manages Knowledge Graph Nodes, Relations, and Embeddings with strict Idempotency.
"""
import sqlite3
import importlib
from typing import Optional, Dict, Any, List

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

class SemanticRepository:
    def __init__(self, db_connection: Optional[sqlite3.Connection] = None):
        self.conn = db_connection or sqlite3.connect(":memory:")
        self._ensure_tables_exist()

    def _ensure_tables_exist(self):
        with self.conn:
            self.conn.execute("""
            CREATE TABLE IF NOT EXISTS SEM_FOOD_KNOWLEDGE_NODES (
                node_id TEXT PRIMARY KEY,
                entity_type TEXT NOT NULL,
                entity_id TEXT NOT NULL,
                canonical_name TEXT NOT NULL,
                metadata_json TEXT,
                created_at TEXT NOT NULL
            );
            """)
            self.conn.execute("""
            CREATE TABLE IF NOT EXISTS SEM_FOOD_RELATIONS (
                relation_id TEXT PRIMARY KEY,
                source_node_id TEXT NOT NULL,
                target_node_id TEXT NOT NULL,
                relation_type TEXT NOT NULL,
                weight REAL DEFAULT 1.0,
                created_at TEXT NOT NULL,
                UNIQUE(source_node_id, target_node_id, relation_type)
            );
            """)

    def save_knowledge_node(self, entity_type: str, entity_id: str, canonical_name: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """Saves or updates Knowledge Graph Node idempotently."""
        node_id = f"NODE_{entity_type}_{entity_id}"
        import json
        meta_str = json.dumps(metadata or {}, ensure_ascii=False)

        platform_logger.info(f"[SEM Repo] Saving Knowledge Node: ID={node_id}, Name='{canonical_name}'")

        with self.conn:
            self.conn.execute("""
                INSERT INTO SEM_FOOD_KNOWLEDGE_NODES (node_id, entity_type, entity_id, canonical_name, metadata_json, created_at)
                VALUES (?, ?, ?, ?, ?, datetime('now'))
                ON CONFLICT(node_id) DO UPDATE SET
                    canonical_name = excluded.canonical_name,
                    metadata_json = excluded.metadata_json
            """, (node_id, entity_type, entity_id, canonical_name, meta_str))

        return node_id

    def save_relation(self, source_node_id: str, target_node_id: str, relation_type: str, weight: float = 1.0) -> str:
        """Saves or updates Knowledge Graph Relation idempotently (no duplicate relation created)."""
        relation_id = f"REL_{source_node_id}_{relation_type}_{target_node_id}"

        platform_logger.info(f"[SEM Repo] Saving Relation: {source_node_id} -[{relation_type}]-> {target_node_id}")

        with self.conn:
            self.conn.execute("""
                INSERT INTO SEM_FOOD_RELATIONS (relation_id, source_node_id, target_node_id, relation_type, weight, created_at)
                VALUES (?, ?, ?, ?, ?, datetime('now'))
                ON CONFLICT(source_node_id, target_node_id, relation_type) DO UPDATE SET
                    weight = excluded.weight
            """, (relation_id, source_node_id, target_node_id, relation_type, weight))

        return relation_id

    def get_nodes_count(self) -> int:
        cursor = self.conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM SEM_FOOD_KNOWLEDGE_NODES")
        return cursor.fetchone()[0]

    def get_relations_count(self) -> int:
        cursor = self.conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM SEM_FOOD_RELATIONS")
        return cursor.fetchone()[0]
