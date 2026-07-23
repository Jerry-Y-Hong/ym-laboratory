"""
Quality Trend Analyzer (Phase 3-03B Production Hardening)
Analyzes quality_history.jsonl to calculate rolling Quality Scores and trend direction (UP/STABLE/DOWN).
"""
import os
import json
import importlib
from typing import Dict, Any, List, Optional

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

QUALITY_HISTORY_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "checkpoints", "history", "quality_history.jsonl"
)

class QualityTrendAnalyzer:
    def __init__(self, history_file_path: str = QUALITY_HISTORY_FILE):
        self.history_file_path = history_file_path

    def analyze_trend(self) -> Dict[str, Any]:
        """Calculates rolling average score and trend direction from quality_history.jsonl."""
        if not os.path.exists(self.history_file_path):
            return {
                "rolling_avg_score": 100.0,
                "trend_direction": "STABLE",
                "sample_count": 0
            }

        scores = []
        try:
            with open(self.history_file_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        data = json.loads(line)
                        if "quality_score" in data:
                            scores.append(data["quality_score"])
        except Exception as e:
            platform_logger.exception(f"[QualityTrendAnalyzer] Error reading history: {e}")

        if not scores:
            return {"rolling_avg_score": 100.0, "trend_direction": "STABLE", "sample_count": 0}

        avg_score = round(sum(scores) / len(scores), 2)

        if len(scores) >= 2:
            prev = scores[-2]
            curr = scores[-1]
            if curr > prev:
                direction = "UP"
            elif curr < prev:
                direction = "DOWN"
            else:
                direction = "STABLE"
        else:
            direction = "STABLE"

        platform_logger.info(f"[QualityTrendAnalyzer] Trend Analysis: Rolling Avg={avg_score}, Direction={direction}, Samples={len(scores)}")

        return {
            "rolling_avg_score": avg_score,
            "trend_direction": direction,
            "sample_count": len(scores),
            "latest_score": scores[-1]
        }
