"""
Retry Manager (Phase 3-02 Production Hardening)
Implements error-differentiated Exponential Backoff policies (HTTP 429 Long, HTTP 5xx Normal, Timeout Short)
and persists retry history into retry_history.jsonl.
"""
import os
import time
import json
import random
import importlib
from typing import Callable, Any, Dict, Optional

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
get_utc_now_iso = utils_mod.get_utc_now_iso

ops_logger_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.ops_logger")
OpsLogger = ops_logger_mod.OpsLogger

alert_engine_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.alert_engine")
AlertEngine = alert_engine_mod.AlertEngine

RETRY_HISTORY_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "checkpoints", "history", "retry_history.jsonl"
)

class RetryExceededException(Exception):
    pass

class RetryManager:
    def __init__(
        self,
        max_retries: int = 3,
        initial_delay: float = 0.05,
        backoff_factor: float = 2.0,
        ops_logger: Optional[OpsLogger] = None,
        alert_engine: Optional[AlertEngine] = None,
        retry_history_path: str = RETRY_HISTORY_FILE
    ):
        self.max_retries = max_retries
        self.initial_delay = initial_delay
        self.backoff_factor = backoff_factor
        self.ops_logger = ops_logger or OpsLogger()
        self.alert_engine = alert_engine or AlertEngine(ops_logger=self.ops_logger)
        self.retry_history_path = retry_history_path
        self.total_retries_executed = 0

    def _determine_backoff_base(self, error_msg: str) -> float:
        """Determines base delay according to error type (429 Long, 5xx Normal, Timeout Short)."""
        err_lower = error_msg.lower()
        if "429" in err_lower or "rate limit" in err_lower:
            return 1.0  # Long Backoff
        elif "500" in err_lower or "502" in err_lower or "503" in err_lower or "504" in err_lower or "server error" in err_lower:
            return 0.5  # Normal Backoff
        elif "timeout" in err_lower or "connection" in err_lower:
            return 0.1  # Short Backoff
        return self.initial_delay

    def _append_retry_history(self, record: Dict[str, Any]):
        """Persists retry event into retry_history.jsonl."""
        try:
            os.makedirs(os.path.dirname(self.retry_history_path), exist_ok=True)
            with open(self.retry_history_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(record, ensure_ascii=False) + "\n")
        except Exception as e:
            self.ops_logger.log_event("RetryManager", "HISTORY_WRITE_ERROR", str(e), level="ERROR")

    def execute_with_retry(
        self,
        func: Callable[..., Any],
        *args,
        retryable_exceptions: Optional[tuple] = None,
        **kwargs
    ) -> Any:
        """Executes a function with error-specific Exponential Backoff policy."""
        if retryable_exceptions is None:
            retryable_exceptions = (TimeoutError, ConnectionError, Exception)

        attempt = 0
        base_delay = self.initial_delay

        while True:
            attempt += 1
            try:
                return func(*args, **kwargs)
            except retryable_exceptions as e:
                err_msg = str(e)
                self.total_retries_executed += 1
                base_delay = self._determine_backoff_base(err_msg)

                retry_record = {
                    "timestamp": get_utc_now_iso(),
                    "func_name": getattr(func, "__name__", str(func)),
                    "attempt": attempt,
                    "max_retries": self.max_retries,
                    "error_type": type(e).__name__,
                    "error_message": err_msg,
                    "base_delay_sec": base_delay
                }
                self._append_retry_history(retry_record)

                if attempt > self.max_retries:
                    self.ops_logger.log_event(
                        component="RetryManager",
                        event_type="RETRY_EXCEEDED",
                        message=f"Max retries ({self.max_retries}) exceeded for {retry_record['func_name']}: {err_msg}",
                        level="ERROR",
                        details=retry_record
                    )
                    self.alert_engine.trigger_alert(
                        alert_type="RETRY_EXCEEDED",
                        title=f"Retry Limit Exceeded in {retry_record['func_name']}",
                        description=f"Operation failed after {self.max_retries} retry attempts: {err_msg}",
                        severity="CRITICAL",
                        metadata=retry_record
                    )
                    raise RetryExceededException(f"Retry attempt limit reached ({self.max_retries}): {err_msg}") from e

                jitter = random.uniform(0, 0.02)
                sleep_time = (base_delay * (self.backoff_factor ** (attempt - 1))) + jitter

                self.ops_logger.log_event(
                    component="RetryManager",
                    event_type="RETRY_ATTEMPT",
                    message=f"Attempt {attempt}/{self.max_retries} failed for {retry_record['func_name']}: {err_msg}. Retrying in {sleep_time:.3f}s",
                    level="WARNING",
                    details={"attempt": attempt, "delay": sleep_time, "error": err_msg}
                )

                time.sleep(sleep_time)
