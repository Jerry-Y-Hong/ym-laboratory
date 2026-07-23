"""
Alert Engine (Phase 3-02 Production Hardening)
Generates and dispatches JSON alerts with 4-level Severity Hierarchy (INFO, WARNING, ERROR, CRITICAL).
"""
import os
import json
import uuid
import importlib
from typing import Dict, Any, Optional, List

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
get_utc_now_iso = utils_mod.get_utc_now_iso

ops_logger_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.ops_logger")
OpsLogger = ops_logger_mod.OpsLogger

ALERTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "checkpoints", "alerts")

class AlertEngine:
    VALID_ALERT_TYPES = [
        "API_FAILURE",
        "RETRY_EXCEEDED",
        "HASH_INTEGRITY_FAIL",
        "MANIFEST_ERROR",
        "COLLECTION_FAIL",
        "DATABASE_ERROR"
    ]
    VALID_SEVERITY_LEVELS = ["INFO", "WARNING", "ERROR", "CRITICAL"]

    def __init__(self, alerts_dir: str = ALERTS_DIR, ops_logger: Optional[OpsLogger] = None):
        self.alerts_dir = alerts_dir
        self.ops_logger = ops_logger or OpsLogger()
        os.makedirs(self.alerts_dir, exist_ok=True)

    def trigger_alert(
        self,
        alert_type: str,
        title: str,
        description: str,
        severity: str = "CRITICAL",
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Triggers a platform alert and persists it as JSON with validated severity level."""
        if alert_type not in self.VALID_ALERT_TYPES:
            alert_type = "COLLECTION_FAIL"

        sev_upper = severity.upper()
        if sev_upper not in self.VALID_SEVERITY_LEVELS:
            sev_upper = "CRITICAL"

        alert_id = f"ALT_{uuid.uuid4().hex[:12]}"
        now_iso = get_utc_now_iso()

        alert_data = {
            "alert_id": alert_id,
            "alert_type": alert_type,
            "severity": sev_upper,
            "title": title,
            "description": description,
            "triggered_at": now_iso,
            "status": "OPEN",
            "metadata": metadata or {}
        }

        file_path = os.path.join(self.alerts_dir, f"alert_{alert_id}.json")
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(alert_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.ops_logger.log_event("AlertEngine", "WRITE_ERROR", str(e), level="ERROR")

        self.ops_logger.log_event(
            component="AlertEngine",
            event_type=alert_type,
            message=f"Alert Triggered [{sev_upper}]: {title} ({alert_type})",
            level=sev_upper if sev_upper in ["INFO", "WARNING", "ERROR"] else "ERROR",
            details=alert_data
        )

        return alert_data

    def list_alerts(self, status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Lists generated alerts."""
        alerts = []
        if os.path.exists(self.alerts_dir):
            for fname in os.listdir(self.alerts_dir):
                if fname.startswith("alert_") and fname.endswith(".json"):
                    fpath = os.path.join(self.alerts_dir, fname)
                    try:
                        with open(fpath, "r", encoding="utf-8") as f:
                            a = json.load(f)
                            if status_filter is None or a.get("status") == status_filter:
                                alerts.append(a)
                    except Exception:
                        pass
        return sorted(alerts, key=lambda x: x.get("triggered_at", ""), reverse=True)
