"""
Quality Dashboard (Phase 3-03B Production Hardening)
Computes Quality Score (0-100), persists audit history to quality_history.jsonl,
triggers automated alerts on score degradation via AlertEngine, and writes quality_manifest.json.
"""
import os
import json
import sqlite3
import importlib
from typing import Dict, Any, Optional

schema_validator_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.schema_validator")
SchemaValidator = schema_validator_mod.SchemaValidator

integrity_checker_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.integrity_checker")
IntegrityChecker = integrity_checker_mod.IntegrityChecker

duplicate_detector_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.duplicate_detector")
DuplicateDetector = duplicate_detector_mod.DuplicateDetector

missing_analyzer_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.missing_analyzer")
MissingDataAnalyzer = missing_analyzer_mod.MissingDataAnalyzer

referential_checker_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.referential_checker")
ReferentialIntegrityChecker = referential_checker_mod.ReferentialIntegrityChecker

outlier_detector_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.outlier_detector")
OutlierDetector = outlier_detector_mod.OutlierDetector

qa_report_gen_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.qa_report_generator")
QAReportGenerator = qa_report_gen_mod.QAReportGenerator

alert_engine_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.alert_engine")
AlertEngine = alert_engine_mod.AlertEngine

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
get_utc_now_iso = utils_mod.get_utc_now_iso

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

CHECKPOINT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "checkpoints")
QUALITY_HISTORY_FILE = os.path.join(CHECKPOINT_DIR, "history", "quality_history.jsonl")
QUALITY_MANIFEST_FILE = os.path.join(CHECKPOINT_DIR, "quality_manifest.json")

class QualityDashboard:
    def __init__(
        self,
        db_connection: Optional[sqlite3.Connection] = None,
        schema_validator: Optional[SchemaValidator] = None,
        integrity_checker: Optional[IntegrityChecker] = None,
        duplicate_detector: Optional[DuplicateDetector] = None,
        missing_analyzer: Optional[MissingDataAnalyzer] = None,
        referential_checker: Optional[ReferentialIntegrityChecker] = None,
        outlier_detector: Optional[OutlierDetector] = None,
        qa_report_generator: Optional[QAReportGenerator] = None,
        alert_engine: Optional[AlertEngine] = None,
        quality_history_path: str = QUALITY_HISTORY_FILE,
        quality_manifest_path: str = QUALITY_MANIFEST_FILE
    ):
        self.conn = db_connection or sqlite3.connect(":memory:")
        self.schema_validator = schema_validator or SchemaValidator()
        self.integrity_checker = integrity_checker or IntegrityChecker(db_connection=self.conn)
        self.duplicate_detector = duplicate_detector or DuplicateDetector(db_connection=self.conn)
        self.missing_analyzer = missing_analyzer or MissingDataAnalyzer(db_connection=self.conn)
        self.referential_checker = referential_checker or ReferentialIntegrityChecker(db_connection=self.conn)
        self.outlier_detector = outlier_detector or OutlierDetector()
        self.qa_report_generator = qa_report_generator or QAReportGenerator()
        self.alert_engine = alert_engine or AlertEngine()
        
        self.quality_history_path = quality_history_path
        self.quality_manifest_path = quality_manifest_path

    def _append_quality_history(self, dashboard_metrics: Dict[str, Any]):
        """Appends quality audit summary into quality_history.jsonl."""
        try:
            os.makedirs(os.path.dirname(self.quality_history_path), exist_ok=True)
            entry = dict(dashboard_metrics)
            entry["timestamp"] = get_utc_now_iso()
            with open(self.quality_history_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
        except Exception as e:
            platform_logger.exception(f"[QualityDashboard] Error writing quality history: {e}")

    def _write_quality_manifest(self, latest_score: float, overall_status: str):
        """Writes quality_manifest.json metadata file."""
        manifest_data = {
            "quality_version": "1.0.0",
            "validator_version": "1.0.0",
            "integrity_version": "1.0.0",
            "scoring_algorithm": "WEIGHTED_DEDUCTION_V1",
            "latest_score": latest_score,
            "overall_status": overall_status,
            "build": "20260721",
            "last_audit_time": get_utc_now_iso()
        }
        try:
            os.makedirs(os.path.dirname(self.quality_manifest_path), exist_ok=True)
            with open(self.quality_manifest_path, "w", encoding="utf-8") as f:
                json.dump(manifest_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            platform_logger.exception(f"[QualityDashboard] Error writing quality manifest: {e}")

    def calculate_quality_score(
        self,
        integrity_pct: float,
        duplicate_pct: float,
        missing_pct: float,
        outlier_count: int,
        ref_violations_count: int
    ) -> float:
        """Calculates Quality Score bounded between 0.0 and 100.0."""
        score = 100.0
        score -= (100.0 - integrity_pct) * 0.4
        score -= (duplicate_pct) * 0.3
        score -= (missing_pct) * 0.2
        score -= (outlier_count * 5.0)
        score -= (ref_violations_count * 5.0)

        return round(max(0.0, min(100.0, score)), 2)

    def run_full_qa_suite(
        self,
        sample_records: Optional[list] = None,
        manifest_data: Optional[dict] = None,
        history_data: Optional[dict] = None
    ) -> Dict[str, Any]:
        """Runs full quality assurance diagnostic suite across all quality checks."""
        # 1. Schema Validation
        if sample_records is None:
            sample_records = [
                {"food_code": "FD_QA_001", "food_name_ko": "QA식품_001", "category_code": "CAT_GENERIC", "origin_source": "RDA_NONGSARO"},
                {"food_code": "FD_QA_002", "food_name_ko": "QA식품_002", "category_code": "CAT_KIMCHI", "origin_source": "RDA_NONGSARO"}
            ]
        schema_res = self.schema_validator.validate_batch(sample_records)

        # 2. Integrity Check
        integrity_res = self.integrity_checker.verify_repository_integrity()

        # 3. Duplicate Detection
        duplicate_res = self.duplicate_detector.check_repository_duplicates()

        # 4. Missing Data Analysis
        missing_res = self.missing_analyzer.analyze_missing_data()

        # 5. Referential Integrity Check
        referential_res = self.referential_checker.verify_referential_integrity(
            manifest_data=manifest_data,
            history_entry=history_data
        )

        # 6. Outlier Detection
        outlier_res = self.outlier_detector.detect_outliers()

        # Calculate Quality Score
        quality_score = self.calculate_quality_score(
            integrity_pct=integrity_res["integrity_rate_pct"],
            duplicate_pct=duplicate_res["duplicate_rate_pct"],
            missing_pct=missing_res["missing_rate_pct"],
            outlier_count=outlier_res["outlier_count"],
            ref_violations_count=referential_res["violations_count"]
        )

        status = "EXCELLENT" if quality_score >= 90.0 else ("ACCEPTABLE" if quality_score >= 75.0 else "REJECTED")

        # Generate QA Report
        qa_report = self.qa_report_generator.generate_qa_report(
            quality_score=quality_score,
            schema_result=schema_res,
            integrity_result=integrity_res,
            duplicate_result=duplicate_res,
            missing_result=missing_res,
            referential_result=referential_res,
            outlier_result=outlier_res
        )

        dashboard_metrics = {
            "quality_score": quality_score,
            "overall_status": status,
            "integrity_pct": integrity_res["integrity_rate_pct"],
            "duplicate_pct": duplicate_res["duplicate_rate_pct"],
            "missing_pct": missing_res["missing_rate_pct"],
            "outlier_count": outlier_res["outlier_count"],
            "ref_violations_count": referential_res["violations_count"],
            "report_id": qa_report["report_id"]
        }

        # Persist Audit History & Manifest
        self._append_quality_history(dashboard_metrics)
        self._write_quality_manifest(quality_score, status)

        # Automated Quality Alert Trigger
        if quality_score < 75.0:
            self.alert_engine.trigger_alert(
                alert_type="COLLECTION_FAIL",
                title="Data Quality Degradation Alert",
                description=f"Quality score dropped to {quality_score}/100 ({status})",
                severity="CRITICAL",
                metadata=dashboard_metrics
            )

        platform_logger.info(f"[QualityDashboard] Full QA Suite completed: Score={quality_score}/100 ({status})")
        return {
            "status": "PASS" if status in ["EXCELLENT", "ACCEPTABLE"] else "FAIL",
            "dashboard": dashboard_metrics,
            "report": qa_report
        }
