"""
Standard Layer Repository
Manages normalized relational entity persistence.
"""
import sqlite3
import importlib
from typing import Optional, Dict, Any

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

models_mod = importlib.import_module("100_PLATFORM.110_API.models")
GenericFoodDTO = models_mod.GenericFoodDTO

class StandardRepository:
    def __init__(self, db_connection: Optional[sqlite3.Connection] = None):
        self.conn = db_connection or sqlite3.connect(":memory:")
        self._ensure_tables_exist()

    def _ensure_tables_exist(self):
        with self.conn:
            self.conn.execute("""
            CREATE TABLE IF NOT EXISTS STD_FOOD_MASTER (
                food_id TEXT PRIMARY KEY,
                food_code TEXT UNIQUE NOT NULL,
                food_name_ko TEXT NOT NULL,
                food_name_en TEXT,
                category_code TEXT,
                category_name TEXT,
                raw_id TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            """)

    def save_standard_food(self, food_dto: GenericFoodDTO, raw_id: str) -> str:
        """Saves standardized food entity linked to RAW payload ID."""
        food_id = f"STD_FD_{food_dto.food_code}"
        platform_logger.info(f"[STD Repo] Saving Standard Food: ID={food_id}, RAW_ID={raw_id}")

        with self.conn:
            self.conn.execute("""
                INSERT OR REPLACE INTO STD_FOOD_MASTER 
                (food_id, food_code, food_name_ko, food_name_en, category_code, category_name, raw_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
            """, (
                food_id,
                food_dto.food_code,
                food_dto.food_name_ko,
                food_dto.food_name_en,
                food_dto.category_code,
                food_dto.category_name,
                raw_id
            ))
        return food_id
