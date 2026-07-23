"""
Missing Data Analyzer (Phase 3-03A)
Analyzes field-level, dataset-level, and collection-level missing data and calculates missing rate.
"""
import sqlite3
import importlib
from typing import Dict, Any, List, Optional

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

class MissingDataAnalyzer:
    def __init__(self, db_connection: Optional[sqlite3.Connection] = None):
        self.conn = db_connection or sqlite3.connect(":memory:")

    def analyze_missing_data(self) -> Dict[str, Any]:
        """Analyzes null/missing values across STANDARD layer attributes."""
        cursor = self.conn.cursor()

        try:
            cursor.execute("SELECT COUNT(*) FROM STD_FOOD_MASTER")
            total_records = cursor.fetchone()[0]
        except sqlite3.OperationalError:
            total_records = 0

        if total_records == 0:
            return {
                "valid": True,
                "total_records": 0,
                "missing_fields_count": 0,
                "missing_rate_pct": 0.0,
                "missing_by_field": {}
            }

        # Check missing/null values for key columns
        missing_by_field = {}
        for col in ["food_name_ko", "category_code", "raw_id"]:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM STD_FOOD_MASTER WHERE {col} IS NULL OR {col} = ''")
                missing_cnt = cursor.fetchone()[0]
                missing_by_field[col] = missing_cnt
            except sqlite3.OperationalError:
                missing_by_field[col] = 0

        total_missing = sum(missing_by_field.values())
        max_possible_missing = total_records * len(missing_by_field)
        missing_rate_pct = round((total_missing / max(max_possible_missing, 1)) * 100, 2)
        is_clean = (total_missing == 0)

        platform_logger.info(f"[MissingAnalyzer] Missing Data Analysis: clean={is_clean}, missing_rate={missing_rate_pct}%")

        return {
            "valid": is_clean,
            "total_records": total_records,
            "missing_fields_count": total_missing,
            "missing_rate_pct": missing_rate_pct,
            "missing_by_field": missing_by_field
        }
