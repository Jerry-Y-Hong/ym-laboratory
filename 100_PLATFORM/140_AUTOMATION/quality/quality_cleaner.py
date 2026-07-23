"""
Quality Cleaner (Phase 3-03B Production Hardening)
Provides automated data remediation including deduplication and missing field default backfilling.
"""
import importlib
from typing import Dict, Any, List, Optional

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

class QualityCleaner:
    def deduplicate_records(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Removes duplicate food records by food_code."""
        seen = set()
        clean = []
        for rec in records:
            code = rec.get("food_code")
            if code not in seen:
                seen.add(code)
                clean.append(rec)

        removed_cnt = len(records) - len(clean)
        platform_logger.info(f"[QualityCleaner] Deduplication completed: Input={len(records)}, Clean={len(clean)}, Removed={removed_cnt}")
        return clean

    def remediate_missing_fields(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Backfills default values for missing optional attributes."""
        remediated = []
        remediated_count = 0
        for rec in records:
            r = dict(rec)
            if not r.get("category_code"):
                r["category_code"] = "CAT_GENERIC"
                remediated_count += 1
            if not r.get("origin_source"):
                r["origin_source"] = "RDA_NONGSARO"
                remediated_count += 1
            remediated.append(r)

        platform_logger.info(f"[QualityCleaner] Field Remediation completed: Remediated Fields={remediated_count}")
        return remediated
