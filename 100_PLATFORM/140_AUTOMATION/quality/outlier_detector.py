"""
Outlier Detector (Phase 3-03A)
Detects statistical anomalies and operational outliers using threshold-based metrics.
"""
import importlib
from typing import Dict, Any, List, Optional

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

class OutlierDetector:
    DEFAULT_THRESHOLDS = {
        "max_response_time_ms": 1000.0,
        "max_batch_volume": 10000,
        "max_retry_rate_pct": 20.0,
        "max_failure_rate_pct": 5.0
    }

    def __init__(self, custom_thresholds: Optional[Dict[str, float]] = None):
        self.thresholds = dict(self.DEFAULT_THRESHOLDS)
        if custom_thresholds:
            self.thresholds.update(custom_thresholds)

    def detect_outliers(
        self,
        avg_response_time_ms: float = 120.0,
        batch_volume: int = 10,
        retry_count: int = 0,
        processed_count: int = 10,
        failure_rate_pct: float = 0.0
    ) -> Dict[str, Any]:
        """Detects metric anomalies against configured thresholds."""
        anomalies = []

        # 1. Response Time Threshold
        if avg_response_time_ms > self.thresholds["max_response_time_ms"]:
            anomalies.append(f"Response time anomaly: {avg_response_time_ms}ms > threshold ({self.thresholds['max_response_time_ms']}ms)")

        # 2. Batch Volume Threshold
        if batch_volume > self.thresholds["max_batch_volume"]:
            anomalies.append(f"Abnormal batch volume: {batch_volume} items > threshold ({self.thresholds['max_batch_volume']})")

        # 3. Retry Rate Threshold
        retry_rate = round((retry_count / max(processed_count, 1)) * 100, 2)
        if retry_rate > self.thresholds["max_retry_rate_pct"]:
            anomalies.append(f"Retry spike detected: {retry_rate}% > threshold ({self.thresholds['max_retry_rate_pct']}%)")

        # 4. Failure Rate Threshold
        if failure_rate_pct > self.thresholds["max_failure_rate_pct"]:
            anomalies.append(f"High failure rate: {failure_rate_pct}% > threshold ({self.thresholds['max_failure_rate_pct']}%)")

        is_normal = (len(anomalies) == 0)
        platform_logger.info(f"[OutlierDetector] Outlier Check: normal={is_normal}, anomalies_count={len(anomalies)}")

        return {
            "valid": is_normal,
            "outlier_count": len(anomalies),
            "anomalies": anomalies,
            "metrics": {
                "avg_response_time_ms": avg_response_time_ms,
                "batch_volume": batch_volume,
                "retry_rate_pct": retry_rate,
                "failure_rate_pct": failure_rate_pct
            }
        }
