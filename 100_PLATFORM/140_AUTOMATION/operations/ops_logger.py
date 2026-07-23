"""
Unified Operations Logging Engine (Phase 3-02)
Logs operations events for Scheduler, Retry, Monitoring, Statistics, Health Check, and Alerts into JSONL format.
"""
import os
import json
import uuid
import importlib
from typing import Dict, Any, Optional

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
get_utc_now_iso = utils_mod.get_utc_now_iso

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

OPS_LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "checkpoints", "ops_logs")
DEFAULT_OPS_LOG_FILE = os.path.join(OPS_LOG_DIR, "ops_events.jsonl")

class OpsLogger:
    def __init__(self, log_file_path: str = DEFAULT_OPS_LOG_FILE):
        self.log_file_path = log_file_path
        os.makedirs(os.path.dirname(self.log_file_path), exist_ok=True)

    def log_event(
        self,
        component: str,
        event_type: str,
        message: str,
        level: str = "INFO",
        run_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Logs a structured operations event into ops_events.jsonl."""
        entry = {
            "event_id": f"EVT_{uuid.uuid4().hex[:12]}",
            "timestamp": get_utc_now_iso(),
            "component": component,
            "event_type": event_type,
            "level": level,
            "message": message,
            "run_id": run_id or "OPS_GLOBAL",
            "details": details or {}
        }
        
        try:
            with open(self.log_file_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
        except Exception as e:
            platform_logger.exception(f"[OpsLogger] Failed to write operations log: {e}")

        platform_logger.info(f"[OpsLogger] [{component}] {level}: {message}")
        return entry
