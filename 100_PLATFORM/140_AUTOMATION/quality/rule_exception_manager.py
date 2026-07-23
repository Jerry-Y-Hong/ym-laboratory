"""
Rule Exception Manager (Phase 3-03B Production Hardening)
Manages quality rule bypass exceptions and whitelist rules (quality_exceptions.json).
"""
import os
import json
import importlib
from typing import Dict, Any, List, Optional

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

EXCEPTIONS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "checkpoints", "quality_exceptions.json"
)

class RuleExceptionManager:
    def __init__(self, exceptions_file_path: str = EXCEPTIONS_FILE):
        self.exceptions_file_path = exceptions_file_path
        self.exempted_codes = set()
        self._load_exceptions()

    def _load_exceptions(self):
        """Loads exception whitelist from persistence file."""
        if os.path.exists(self.exceptions_file_path):
            try:
                with open(self.exceptions_file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.exempted_codes = set(data.get("exempted_food_codes", []))
            except Exception as e:
                platform_logger.exception(f"[RuleExceptionManager] Error loading exceptions: {e}")

    def add_exception(self, food_code: str):
        """Adds a food code to the quality exception whitelist."""
        self.exempted_codes.add(food_code)
        os.makedirs(os.path.dirname(self.exceptions_file_path), exist_ok=True)
        try:
            with open(self.exceptions_file_path, "w", encoding="utf-8") as f:
                json.dump({"exempted_food_codes": list(self.exempted_codes)}, f, ensure_ascii=False, indent=2)
            platform_logger.info(f"[RuleExceptionManager] Added exception for '{food_code}'")
        except Exception as e:
            platform_logger.exception(f"[RuleExceptionManager] Failed to save exception: {e}")

    def is_exempted(self, food_code: str) -> bool:
        """Checks if a food code is exempted from quality rules."""
        return food_code in self.exempted_codes
