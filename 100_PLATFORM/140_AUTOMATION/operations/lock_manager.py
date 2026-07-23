"""
Lock Manager (Phase 3-02 Production Hardening)
Provides lock acquisition & release for concurrency control (collection_lock, report_lock, statistics_lock).
"""
import os
import time
import json
import importlib
from typing import Optional, Dict, Any

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
get_utc_now_iso = utils_mod.get_utc_now_iso

ops_logger_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.ops_logger")
OpsLogger = ops_logger_mod.OpsLogger

LOCKS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "checkpoints", "locks")

class LockManager:
    def __init__(self, locks_dir: str = LOCKS_DIR, ops_logger: Optional[OpsLogger] = None):
        self.locks_dir = locks_dir
        self.ops_logger = ops_logger or OpsLogger()
        os.makedirs(self.locks_dir, exist_ok=True)

    def _get_lock_path(self, lock_name: str) -> str:
        return os.path.join(self.locks_dir, f"{lock_name}.lock")

    def acquire_lock(self, lock_name: str, timeout_seconds: float = 10.0, owner_id: str = "GLOBAL") -> bool:
        """Attempts to acquire a named lock with timeout protection."""
        lock_path = self._get_lock_path(lock_name)
        now = time.time()

        if os.path.exists(lock_path):
            try:
                with open(lock_path, "r", encoding="utf-8") as f:
                    lock_data = json.load(f)
                created_at = lock_data.get("timestamp_sec", 0)
                if now - created_at < timeout_seconds:
                    self.ops_logger.log_event("LockManager", "LOCK_BLOCKED", f"Lock '{lock_name}' is currently held by '{lock_data.get('owner_id')}'", level="WARNING")
                    return False
                else:
                    self.ops_logger.log_event("LockManager", "LOCK_EXPIRED", f"Lock '{lock_name}' expired. Overwriting stale lock.", level="WARNING")
            except Exception:
                pass

        lock_content = {
            "lock_name": lock_name,
            "owner_id": owner_id,
            "acquired_at": get_utc_now_iso(),
            "timestamp_sec": now
        }
        try:
            with open(lock_path, "w", encoding="utf-8") as f:
                json.dump(lock_content, f, ensure_ascii=False, indent=2)
            self.ops_logger.log_event("LockManager", "LOCK_ACQUIRED", f"Lock '{lock_name}' acquired by '{owner_id}'")
            return True
        except Exception as e:
            self.ops_logger.log_event("LockManager", "LOCK_ERROR", f"Failed to write lock '{lock_name}': {e}", level="ERROR")
            return False

    def release_lock(self, lock_name: str) -> bool:
        """Releases a named lock."""
        lock_path = self._get_lock_path(lock_name)
        if os.path.exists(lock_path):
            try:
                os.remove(lock_path)
                self.ops_logger.log_event("LockManager", "LOCK_RELEASED", f"Lock '{lock_name}' released.")
                return True
            except Exception as e:
                self.ops_logger.log_event("LockManager", "LOCK_ERROR", f"Failed to release lock '{lock_name}': {e}", level="ERROR")
                return False
        return True
