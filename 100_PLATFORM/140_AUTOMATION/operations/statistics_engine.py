"""
Statistics Engine (Phase 3-02 Production Hardening)
Calculates analytical metrics and persists trend data into statistics_history.jsonl.
"""
import os
import json
import importlib
from typing import Dict, Any, List, Optional

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
get_utc_now_iso = utils_mod.get_utc_now_iso

ops_logger_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.ops_logger")
OpsLogger = ops_logger_mod.OpsLogger

STATS_HISTORY_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "checkpoints", "history", "statistics_history.jsonl"
)

class StatisticsEngine:
    def __init__(self, ops_logger: Optional[OpsLogger] = None, stats_history_path: str = STATS_HISTORY_FILE):
        self.ops_logger = ops_logger or OpsLogger()
        self.stats_history_path = stats_history_path

    def _append_statistics_history(self, stats: Dict[str, Any]):
        """Appends statistics record into statistics_history.jsonl."""
        try:
            os.makedirs(os.path.dirname(self.stats_history_path), exist_ok=True)
            entry = dict(stats)
            entry["timestamp"] = get_utc_now_iso()
            with open(self.stats_history_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
        except Exception as e:
            self.ops_logger.log_event("StatisticsEngine", "HISTORY_WRITE_ERROR", str(e), level="ERROR")

    def generate_statistics(
        self,
        total_collected: int,
        new_count: int,
        updated_count: int,
        unchanged_count: int,
        failed_count: int,
        duration_seconds: float,
        response_times_ms: Optional[List[float]] = None
    ) -> Dict[str, Any]:
        """Generates statistical analysis data and persists to history."""
        total_processed = new_count + updated_count + unchanged_count + failed_count
        if total_processed == 0:
            total_processed = total_collected

        failure_rate_pct = round((failed_count / max(total_processed, 1)) * 100, 2)
        throughput = round(total_processed / max(duration_seconds, 0.001), 2)

        if response_times_ms and len(response_times_ms) > 0:
            avg_resp_ms = round(sum(response_times_ms) / len(response_times_ms), 2)
        else:
            avg_resp_ms = 120.0

        stats = {
            "total_collected": total_collected,
            "total_processed": total_processed,
            "new_count": new_count,
            "updated_count": updated_count,
            "unchanged_count": unchanged_count,
            "failed_count": failed_count,
            "failure_rate_pct": failure_rate_pct,
            "avg_throughput_per_sec": throughput,
            "avg_response_time_ms": avg_resp_ms,
            "duration_seconds": round(duration_seconds, 3)
        }

        self._append_statistics_history(stats)

        self.ops_logger.log_event(
            component="StatisticsEngine",
            event_type="STATS_GENERATED",
            message=f"Statistics calculated: Processed={total_processed}, FailureRate={failure_rate_pct}%",
            details=stats
        )

        return stats
