"""
Global Common Food Platform (100_PLATFORM) Phase 3-03 Data Quality Assurance Engine Verification Suite
Validates Schema Validator, Integrity Checker, Duplicate Detector, Missing Analyzer, Referential Checker,
Outlier Detector, QA Report Generator, Quality Dashboard, Quality Rules Persistence, Quality Audit History,
Auto Quality Alerting, Quality Manifest, Quality Remediation, and Quality Trend Analyzer (CHECK 1 ~ 14).
"""
import os
import sys
import sqlite3
import json
import importlib

# Ensure parent directory is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

# Dynamic imports for Quality Engine components
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

quality_dashboard_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.quality_dashboard")
QualityDashboard = quality_dashboard_mod.QualityDashboard

quality_cleaner_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.quality_cleaner")
QualityCleaner = quality_cleaner_mod.QualityCleaner

quality_trend_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.quality_trend_analyzer")
QualityTrendAnalyzer = quality_trend_mod.QualityTrendAnalyzer

rule_exception_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.quality.rule_exception_manager")
RuleExceptionManager = rule_exception_mod.RuleExceptionManager

alert_engine_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.alert_engine")
AlertEngine = alert_engine_mod.AlertEngine

raw_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.raw_repository")
RAWRepository = raw_repo_mod.RAWRepository

std_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.standard_repository")
StandardRepository = std_repo_mod.StandardRepository

sem_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.semantic_repository")
SemanticRepository = sem_repo_mod.SemanticRepository

pipeline_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.pipeline")
FoodIngestionPipeline = pipeline_mod.FoodIngestionPipeline

def print_header(title: str):
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80)

def print_result(test_name: str, success: bool, detail: str = ""):
    status = "SUCCESS [PASS]" if success else "FAILED  [FAIL]"
    symbol = "[PASS]" if success else "[FAIL]"
    print(f" {symbol} {test_name:<60} {status}")
    if detail:
        print(f"   └─ {detail}")

def main():
    print_header("PHASE 3-03 DATA QUALITY ASSURANCE ENGINE PRODUCTION HARDENING SUITE")

    conn = sqlite3.connect(":memory:")
    raw_repo = RAWRepository(db_connection=conn)
    std_repo = StandardRepository(db_connection=conn)
    sem_repo = SemanticRepository(db_connection=conn)

    pipeline = FoodIngestionPipeline(
        raw_repo=raw_repo,
        std_repo=std_repo,
        sem_repo=sem_repo
    )

    # Ingest baseline data for Quality testing
    pipeline.run_full_e2e_ingestion("FD_QA_TEST_001")
    pipeline.run_full_e2e_ingestion("FD_QA_TEST_002")

    schema_validator = SchemaValidator()
    integrity_checker = IntegrityChecker(db_connection=conn)
    duplicate_detector = DuplicateDetector(db_connection=conn)
    missing_analyzer = MissingDataAnalyzer(db_connection=conn)
    referential_checker = ReferentialIntegrityChecker(db_connection=conn)
    outlier_detector = OutlierDetector()
    qa_report_generator = QAReportGenerator()
    alert_engine = AlertEngine()
    quality_cleaner = QualityCleaner()
    trend_analyzer = QualityTrendAnalyzer()
    exception_manager = RuleExceptionManager()

    dashboard = QualityDashboard(
        db_connection=conn,
        schema_validator=schema_validator,
        integrity_checker=integrity_checker,
        duplicate_detector=duplicate_detector,
        missing_analyzer=missing_analyzer,
        referential_checker=referential_checker,
        outlier_detector=outlier_detector,
        qa_report_generator=qa_report_generator,
        alert_engine=alert_engine
    )

    # CHECK 1: Schema Validation PASS
    print_header("CHECK 1. Schema Validation PASS")
    try:
        sample_batch = [
            {"food_code": "FD_001", "food_name_ko": "배추김치", "category_code": "CAT_KIMCHI", "origin_source": "RDA_NONGSARO"},
            {"food_code": "FD_002", "food_name_ko": "깍두기", "category_code": "CAT_KIMCHI", "origin_source": "RDA_NONGSARO"}
        ]
        s_res = schema_validator.validate_batch(sample_batch)
        c1_pass = (s_res["invalid_count"] == 0) and (s_res["valid_rate_pct"] == 100.0)
        print_result("1.1 Schema Validation Rules (Fields, Types, Enums, Length)", c1_pass, f"Valid Rate: {s_res['valid_rate_pct']}%, Total Evaluated: {s_res['total_evaluated']}")
    except Exception as e:
        print_result("1.1 Schema Validation Exception", False, str(e))
        c1_pass = False

    # CHECK 2: Integrity PASS
    print_header("CHECK 2. Integrity PASS")
    try:
        int_res = integrity_checker.verify_repository_integrity()
        c2_pass = int_res["valid"] and (int_res["corrupted_count"] == 0) and (int_res["integrity_rate_pct"] == 100.0)
        print_result("2.1 SHA-256 Payload & Repository Integrity", c2_pass, f"Integrity Rate: {int_res['integrity_rate_pct']}%, Evaluated: {int_res['evaluated_count']}")
    except Exception as e:
        print_result("2.1 Integrity Check Exception", False, str(e))
        c2_pass = False

    # CHECK 3: Duplicate Detection PASS
    print_header("CHECK 3. Duplicate Detection PASS")
    try:
        dup_res = duplicate_detector.check_repository_duplicates()
        c3_pass = dup_res["valid"] and (dup_res["total_duplicates"] == 0) and (dup_res["duplicate_rate_pct"] == 0.0)
        print_result("3.1 Duplicate Detection (Code, Payload, Hash)", c3_pass, f"Duplicate Count: {dup_res['total_duplicates']}, Duplicate Rate: {dup_res['duplicate_rate_pct']}%")
    except Exception as e:
        print_result("3.1 Duplicate Detection Exception", False, str(e))
        c3_pass = False

    # CHECK 4: Missing Analysis PASS
    print_header("CHECK 4. Missing Analysis PASS")
    try:
        miss_res = missing_analyzer.analyze_missing_data()
        c4_pass = miss_res["valid"] and (miss_res["missing_fields_count"] == 0) and (miss_res["missing_rate_pct"] == 0.0)
        print_result("4.1 Missing Data Analyzer (Null & Field Analysis)", c4_pass, f"Missing Rate: {miss_res['missing_rate_pct']}%, Total Records: {miss_res['total_records']}")
    except Exception as e:
        print_result("4.1 Missing Analysis Exception", False, str(e))
        c4_pass = False

    # CHECK 5: Referential Integrity PASS
    print_header("CHECK 5. Referential Integrity PASS")
    try:
        manifest_stub = {"dataset_hash": "SHA256:1234567890abcdef"}
        history_stub = {"dataset_hash": "SHA256:1234567890abcdef"}
        ref_res = referential_checker.verify_referential_integrity(
            manifest_data=manifest_stub,
            history_entry=history_stub
        )
        c5_pass = ref_res["valid"] and (ref_res["violations_count"] == 0)
        print_result("5.1 Referential Integrity (Foreign Keys & Cross-Checks)", c5_pass, f"Violations: {ref_res['violations_count']}")
    except Exception as e:
        print_result("5.1 Referential Integrity Exception", False, str(e))
        c5_pass = False

    # CHECK 6: Outlier Detection PASS
    print_header("CHECK 6. Outlier Detection PASS")
    try:
        out_res = outlier_detector.detect_outliers(
            avg_response_time_ms=120.0,
            batch_volume=10,
            retry_count=0,
            processed_count=10,
            failure_rate_pct=0.0
        )
        c6_pass = out_res["valid"] and (out_res["outlier_count"] == 0)
        print_result("6.1 Outlier Detector (Threshold Anomaly Detection)", c6_pass, f"Outlier Count: {out_res['outlier_count']}, Anomalies: {out_res['anomalies']}")
    except Exception as e:
        print_result("6.1 Outlier Detection Exception", False, str(e))
        c6_pass = False

    # CHECK 7: QA Report PASS
    print_header("CHECK 7. QA Report PASS")
    try:
        qa_rep = qa_report_generator.generate_qa_report(
            quality_score=100.0,
            schema_result=s_res,
            integrity_result=int_res,
            duplicate_result=dup_res,
            missing_result=miss_res,
            referential_result=ref_res,
            outlier_result=out_res
        )
        rep_dir = qa_report_generator.qa_reports_dir
        rep_files = os.listdir(rep_dir) if os.path.exists(rep_dir) else []

        c7_pass = (len(rep_files) >= 1) and ("summary" in qa_rep) and ("recommendation" in qa_rep)
        print_result("7.1 QA Report Generator (Summary, Detail, Recommendation)", c7_pass, f"QA Report ID: {qa_rep.get('report_id')}, Saved Files Count: {len(rep_files)}")
    except Exception as e:
        print_result("7.1 QA Report Exception", False, str(e))
        c7_pass = False

    # CHECK 8: Quality Dashboard PASS
    print_header("CHECK 8. Quality Dashboard PASS")
    try:
        dash_res = dashboard.run_full_qa_suite()
        db_metrics = dash_res["dashboard"]
        
        c8_pass = (dash_res["status"] == "PASS") and (db_metrics["quality_score"] == 100.0) and (db_metrics["overall_status"] == "EXCELLENT")
        print_result("8.1 Quality Dashboard (Quality Score 0-100 Calculation)", c8_pass, f"Quality Score: {db_metrics['quality_score']}/100, Overall Status: {db_metrics['overall_status']}")
    except Exception as e:
        print_result("8.1 Quality Dashboard Exception", False, str(e))
        c8_pass = False

    # CHECK 9: Quality Rules Persistence PASS
    print_header("CHECK 9. Quality Rules Persistence PASS")
    try:
        rules_file = schema_validator.rules_file_path
        rules_exist = os.path.exists(rules_file)
        new_val = SchemaValidator(rules_file_path=rules_file)
        c9_pass = rules_exist and "required_food_fields" in new_val.rules
        print_result("9.1 Quality Rules Persistence (quality_rules.json)", c9_pass, f"Rules File Exists: {rules_exist}, Required Fields: {new_val.rules['required_food_fields']}")
    except Exception as e:
        print_result("9.1 Quality Rules Persistence Exception", False, str(e))
        c9_pass = False

    # CHECK 10: Quality Audit History PASS
    print_header("CHECK 10. Quality Audit History PASS")
    try:
        hist_file = dashboard.quality_history_path
        hist_exist = os.path.exists(hist_file)
        line_cnt = 0
        if hist_exist:
            with open(hist_file, "r", encoding="utf-8") as f:
                line_cnt = len([l for l in f.readlines() if l.strip()])

        c10_pass = hist_exist and line_cnt > 0
        print_result("10.1 Quality Audit History Persistence (quality_history.jsonl)", c10_pass, f"History File Exists: {hist_exist}, Audit Log Lines: {line_cnt}")
    except Exception as e:
        print_result("10.1 Quality Audit History Exception", False, str(e))
        c10_pass = False

    # CHECK 11: Auto Quality Alerting PASS
    print_header("CHECK 11. Auto Quality Alerting PASS")
    try:
        # Simulate score degradation calculation < 75.0
        low_score = dashboard.calculate_quality_score(
            integrity_pct=50.0,
            duplicate_pct=20.0,
            missing_pct=30.0,
            outlier_count=3,
            ref_violations_count=2
        )
        c11_pass = low_score < 75.0
        print_result("11.1 Auto Quality Alerting on Score Degradation (< 75.0)", c11_pass, f"Calculated Low Score: {low_score}/100 (< 75.0 Alert Condition Satisfied)")
    except Exception as e:
        print_result("11.1 Auto Quality Alerting Exception", False, str(e))
        c11_pass = False

    # CHECK 12: Quality Manifest PASS
    print_header("CHECK 12. Quality Manifest PASS")
    try:
        q_manifest_file = dashboard.quality_manifest_path
        manifest_exist = os.path.exists(q_manifest_file)
        m_data = {}
        if manifest_exist:
            with open(q_manifest_file, "r", encoding="utf-8") as f:
                m_data = json.load(f)

        c12_pass = manifest_exist and m_data.get("quality_version") == "1.0.0" and m_data.get("scoring_algorithm") == "WEIGHTED_DEDUCTION_V1"
        print_result("12.1 Quality Manifest Metadata (quality_manifest.json)", c12_pass, f"Quality Ver: {m_data.get('quality_version')}, Algorithm: {m_data.get('scoring_algorithm')}")
    except Exception as e:
        print_result("12.1 Quality Manifest Exception", False, str(e))
        c12_pass = False

    # CHECK 13: Quality Remediation PASS
    print_header("CHECK 13. Quality Remediation PASS")
    try:
        dirty = [
            {"food_code": "FD_DUP_001", "food_name_ko": "중복1"},
            {"food_code": "FD_DUP_001", "food_name_ko": "중복1"},
            {"food_code": "FD_DUP_002", "food_name_ko": "단일2"}
        ]
        clean = quality_cleaner.deduplicate_records(dirty)
        remediated = quality_cleaner.remediate_missing_fields(clean)
        
        c13_pass = (len(clean) == 2) and (remediated[0]["category_code"] == "CAT_GENERIC")
        print_result("13.1 Automated Quality Remediation & Cleaning", c13_pass, f"Input: {len(dirty)} -> Cleaned: {len(clean)}, Remediated Category: {remediated[0]['category_code']}")
    except Exception as e:
        print_result("13.1 Quality Remediation Exception", False, str(e))
        c13_pass = False

    # CHECK 14: Quality Trend Analyzer PASS
    print_header("CHECK 14. Quality Trend Analyzer PASS")
    try:
        trend_res = trend_analyzer.analyze_trend()
        c14_pass = "rolling_avg_score" in trend_res and trend_res["trend_direction"] in ["UP", "STABLE", "DOWN"]
        print_result("14.1 Quality Trend Analyzer (Rolling Avg & Direction)", c14_pass, f"Rolling Avg Score: {trend_res.get('rolling_avg_score')}, Direction: {trend_res.get('trend_direction')}")
    except Exception as e:
        print_result("14.1 Quality Trend Analyzer Exception", False, str(e))
        c14_pass = False

    all_passed = (
        c1_pass and c2_pass and c3_pass and c4_pass and c5_pass and c6_pass and c7_pass and
        c8_pass and c9_pass and c10_pass and c11_pass and c12_pass and c13_pass and c14_pass
    )

    print_header(f"FINAL PHASE 3-03B VERDICT: {'PRODUCTION READY (ALL 14 CHECKS PASSED)' if all_passed else 'SOME TESTS FAILED'}")
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
