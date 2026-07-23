"""
Schema Validator (Phase 3-03B Production Hardening)
Validates collected food data payloads against required fields, data types, nullability, enum limits, and field lengths.
Supports dynamic quality rules persistence via checkpoints/quality_rules.json.
"""
import os
import json
import importlib
from typing import Dict, Any, List, Optional

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

RULES_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "checkpoints", "quality_rules.json"
)

class SchemaValidator:
    DEFAULT_RULES = {
        "required_food_fields": ["food_code", "food_name_ko", "category_code", "origin_source"],
        "valid_categories": ["CAT_GENERIC", "CAT_KIMCHI", "CAT_VEGETABLE", "CAT_GRAIN", "CAT_MEAT", "CAT_SEAFOOD"],
        "valid_sources": ["RDA_NONGSARO", "RDA_AGRICULTURAL_SCIENCE_OPENAPI", "MFDS", "USDA"],
        "max_code_length": 50,
        "max_name_length": 200
    }

    def __init__(self, rules_file_path: str = RULES_FILE):
        self.rules_file_path = rules_file_path
        self.rules = dict(self.DEFAULT_RULES)
        self._load_and_persist_rules()

    def _load_and_persist_rules(self):
        """Loads quality rules from JSON file or persists default rules."""
        os.makedirs(os.path.dirname(self.rules_file_path), exist_ok=True)
        if os.path.exists(self.rules_file_path):
            try:
                with open(self.rules_file_path, "r", encoding="utf-8") as f:
                    file_rules = json.load(f)
                    self.rules.update(file_rules)
            except Exception as e:
                platform_logger.exception(f"[SchemaValidator] Error reading quality_rules.json: {e}")
        else:
            try:
                with open(self.rules_file_path, "w", encoding="utf-8") as f:
                    json.dump(self.rules, f, ensure_ascii=False, indent=2)
            except Exception as e:
                platform_logger.exception(f"[SchemaValidator] Error writing default quality_rules.json: {e}")

    def validate_food_payload(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """Validates a single food record dictionary against schema rules."""
        errors = []
        warnings = []

        # 1. Required field presence & Nullability
        for field in self.rules["required_food_fields"]:
            if field not in record:
                errors.append(f"Missing required field: '{field}'")
            elif record[field] is None:
                errors.append(f"Null value not permitted for field: '{field}'")

        if errors:
            return {"valid": False, "errors": errors, "warnings": warnings}

        # 2. Data Type Check
        if not isinstance(record.get("food_code"), str):
            errors.append("Field 'food_code' must be of type 'str'")
        if not isinstance(record.get("food_name_ko"), str):
            errors.append("Field 'food_name_ko' must be of type 'str'")

        # 3. Enum Value Validation
        cat = record.get("category_code")
        if cat and cat not in self.rules["valid_categories"]:
            warnings.append(f"Unrecognized category_code '{cat}'. Expected one of {self.rules['valid_categories']}")

        src = record.get("origin_source")
        if src and src not in self.rules["valid_sources"]:
            warnings.append(f"Unrecognized origin_source '{src}'. Expected one of {self.rules['valid_sources']}")

        # 4. Field Length Restrictions
        code = record.get("food_code", "")
        max_code_len = self.rules["max_code_length"]
        if len(code) > max_code_len:
            errors.append(f"Field 'food_code' length ({len(code)}) exceeds max length ({max_code_len})")

        name = record.get("food_name_ko", "")
        max_name_len = self.rules["max_name_length"]
        if len(name) > max_name_len:
            errors.append(f"Field 'food_name_ko' length ({len(name)}) exceeds max length ({max_name_len})")

        is_valid = (len(errors) == 0)
        platform_logger.info(f"[SchemaValidator] Validation for '{code}': valid={is_valid}, errors={len(errors)}")

        return {
            "valid": is_valid,
            "errors": errors,
            "warnings": warnings
        }

    def validate_batch(self, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Validates a batch of food records."""
        total = len(records)
        valid_count = 0
        invalid_count = 0
        all_errors = []

        for rec in records:
            res = self.validate_food_payload(rec)
            if res["valid"]:
                valid_count += 1
            else:
                invalid_count += 1
                all_errors.extend(res["errors"])

        return {
            "total_evaluated": total,
            "valid_count": valid_count,
            "invalid_count": invalid_count,
            "valid_rate_pct": round((valid_count / max(total, 1)) * 100, 2),
            "errors": all_errors
        }
