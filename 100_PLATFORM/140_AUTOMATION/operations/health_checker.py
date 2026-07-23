"""
Health Check Engine (Phase 3-02 Production Hardening)
Performs automated diagnostics, persists trend data to health_history.jsonl,
and calculates rolling PASS / WARNING / FAIL rates.
"""
import os
import json
import sqlite3
import importlib
from typing import Dict, Any, Optional, List

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
get_utc_now_iso = utils_mod.get_utc_now_iso

ops_logger_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.ops_logger")
OpsLogger = ops_logger_mod.OpsLogger

alert_engine_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.alert_engine")
AlertEngine = alert_engine_mod.AlertEngine

HEALTH_HISTORY_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "checkpoints", "history", "health_history.jsonl"
)

class HealthChecker:
    def __init__(
        self,
        db_connection: Optional[sqlite3.Connection] = None,
        ops_logger: Optional[OpsLogger] = None,
        alert_engine: Optional[AlertEngine] = None,
        health_history_path: str = HEALTH_HISTORY_FILE
    ):
        self.conn = db_connection or sqlite3.connect(":memory:")
        self.ops_logger = ops_logger or OpsLogger()
        self.alert_engine = alert_engine or AlertEngine(ops_logger=self.ops_logger)
        self.health_history_path = health_history_path

    def _append_health_history(self, health_data: Dict[str, Any]):
        """Persists health check record into health_history.jsonl."""
        try:
            os.makedirs(os.path.dirname(self.health_history_path), exist_ok=True)
            entry = dict(health_data)
            entry["timestamp"] = get_utc_now_iso()
            with open(self.health_history_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
        except Exception as e:
            self.ops_logger.log_event("HealthChecker", "HISTORY_WRITE_ERROR", str(e), level="ERROR")

    def calculate_health_trends(self) -> Dict[str, float]:
        """Calculates rolling PASS / WARNING / FAIL rates from health history."""
        if not os.path.exists(self.health_history_path):
            return {"pass_rate_pct": 100.0, "warning_rate_pct": 0.0, "fail_rate_pct": 0.0}

        try:
            statuses = []
            with open(self.health_history_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        data = json.loads(line)
                        statuses.append(data.get("status", "PASS"))

            total = max(len(statuses), 1)
            p_cnt = statuses.count("PASS")
            w_cnt = statuses.count("WARNING")
            f_cnt = statuses.count("FAIL")

            return {
                "pass_rate_pct": round((p_cnt / total) * 100, 2),
                "warning_rate_pct": round((w_cnt / total) * 100, 2),
                "fail_rate_pct": round((f_cnt / total) * 100, 2)
            }
        except Exception:
            return {"pass_rate_pct": 100.0, "warning_rate_pct": 0.0, "fail_rate_pct": 0.0}

    def check_health(self) -> Dict[str, Any]:
        """Runs 5-point platform health check diagnostic and records history & trends."""
        checks = {
            "api_connection": "PASS",
            "database_connection": "PASS",
            "repository_state": "PASS",
            "pipeline_state": "PASS",
            "scheduler_state": "PASS"
        }
        details = {}

        # 1. API Connection Check
        try:
            api_mod = importlib.import_module("100_PLATFORM.110_API.client")
            client = api_mod.BaseOpenAPIClient()
            if not client.api_key:
                checks["api_connection"] = "WARNING"
                details["api"] = "API key missing or default fallback used"
            else:
                details["api"] = "API client initialized successfully"
        except Exception as e:
            checks["api_connection"] = "FAIL"
            details["api"] = str(e)

        # 2. Database Connection Check
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT 1")
            details["db"] = "Database connection query SELECT 1 returned successfully"
        except Exception as e:
            checks["database_connection"] = "FAIL"
            details["db"] = str(e)

        # 3. Repository State Check
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [r[0] for r in cursor.fetchall()]
            details["repository"] = f"Active tables: {tables}"
        except Exception as e:
            checks["repository_state"] = "FAIL"
            details["repository"] = str(e)

        # 4. Pipeline State Check
        try:
            pipe_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.pipeline")
            pipeline = pipe_mod.FoodIngestionPipeline()
            details["pipeline"] = "Pipeline instance created successfully"
        except Exception as e:
            checks["pipeline_state"] = "FAIL"
            details["pipeline"] = str(e)

        # 5. Scheduler State Check
        try:
            sched_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.scheduler_engine")
            details["scheduler"] = "Scheduler module verified"
        except Exception as e:
            checks["scheduler_state"] = "FAIL"
            details["scheduler"] = str(e)

        # Overall Status Determination
        if "FAIL" in checks.values():
            overall_status = "FAIL"
        elif "WARNING" in checks.values():
            overall_status = "WARNING"
        else:
            overall_status = "PASS"

        result = {
            "status": overall_status,
            "checks": checks,
            "details": details
        }

        self._append_health_history(result)
        result["trends"] = self.calculate_health_trends()

        self.ops_logger.log_event(
            component="HealthChecker",
            event_type="HEALTH_CHECK_COMPLETED",
            message=f"Platform Health Check: {overall_status} (Pass Rate: {result['trends']['pass_rate_pct']}%)",
            level="INFO" if overall_status == "PASS" else ("WARNING" if overall_status == "WARNING" else "ERROR"),
            details=result
        )

        if overall_status == "FAIL":
            self.alert_engine.trigger_alert(
                alert_type="DATABASE_ERROR",
                title="Platform Health Check FAIL",
                description="One or more core components failed health check diagnostics.",
                severity="CRITICAL",
                metadata=result
            )

        return result
