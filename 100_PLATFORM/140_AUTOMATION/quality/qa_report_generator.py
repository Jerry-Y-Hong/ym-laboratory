"""
QA Report Generator (Phase 3-03A)
Generates and persists structured JSON QA Reports containing Summary, Detail, Error List, and Recommendations.
"""
import os
import json
import uuid
import importlib
from typing import Dict, Any, Optional, List

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
get_utc_now_iso = utils_mod.get_utc_now_iso

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

QA_REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "checkpoints", "qa_reports")

class QAReportGenerator:
    def __init__(self, qa_reports_dir: str = QA_REPORTS_DIR):
        self.qa_reports_dir = qa_reports_dir
        os.makedirs(self.qa_reports_dir, exist_ok=True)

    def generate_qa_report(
        self,
        quality_score: float,
        schema_result: Dict[str, Any],
        integrity_result: Dict[str, Any],
        duplicate_result: Dict[str, Any],
        missing_result: Dict[str, Any],
        referential_result: Dict[str, Any],
        outlier_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generates structured JSON QA report and saves to checkpoints/qa_reports/."""
        report_id = f"QAR_{uuid.uuid4().hex[:10]}"
        now_iso = get_utc_now_iso()

        # Consolidate errors
        error_list = []
        error_list.extend(schema_result.get("errors", []))
        if not integrity_result.get("valid"):
            error_list.append(f"Repository Hash Integrity Mismatches: {integrity_result.get('corrupted_count')}")
        if not duplicate_result.get("valid"):
            error_list.append(f"Duplicate Records Detected: {duplicate_result.get('total_duplicates')}")
        if not referential_result.get("valid"):
            error_list.extend(referential_result.get("violations", []))
        error_list.extend(outlier_result.get("anomalies", []))

        # Generate Recommendations
        recommendations = []
        if quality_score >= 90.0:
            recommendations.append("Data quality is EXCELLENT. Platform ready for MFCO domain inference ingestion.")
        elif quality_score >= 75.0:
            recommendations.append("Data quality is ACCEPTABLE. Minor missing fields or duplicate cleanup recommended.")
        else:
            recommendations.append("Data quality is REJECTED. Immediate remediation required before downstream processing.")

        if duplicate_result.get("total_duplicates", 0) > 0:
            recommendations.append("Run Duplicate Record Cleaner to deduplicate raw payloads.")
        if missing_result.get("missing_fields_count", 0) > 0:
            recommendations.append("Review source API response mapping for missing required fields.")

        report = {
            "report_id": report_id,
            "generated_at": now_iso,
            "summary": {
                "quality_score": quality_score,
                "overall_status": "EXCELLENT" if quality_score >= 90.0 else ("ACCEPTABLE" if quality_score >= 75.0 else "REJECTED"),
                "total_errors_detected": len(error_list)
            },
            "detail": {
                "schema_validation": schema_result,
                "integrity_check": integrity_result,
                "duplicate_detection": duplicate_result,
                "missing_analysis": missing_result,
                "referential_integrity": referential_result,
                "outlier_detection": outlier_result
            },
            "error_list": error_list,
            "recommendation": recommendations
        }

        filename = f"qa_report_{now_iso[:10]}_{report_id}.json"
        filepath = os.path.join(self.qa_reports_dir, filename)

        try:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            platform_logger.info(f"[QAReportGenerator] Generated QA Report '{report_id}' at {filepath}")
        except Exception as e:
            platform_logger.exception(f"[QAReportGenerator] Failed to save QA Report: {e}")

        return report
