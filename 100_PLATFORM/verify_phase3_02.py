"""
Global Common Food Platform (100_PLATFORM) Phase 3-02 Verification Suite (Data Operations Engine Production Hardening)
Validates Scheduler Engine, Retry Manager, Health Check Engine, Monitoring Engine, Statistics Engine,
Report Generator, Alert Engine, Operations Logging, E2E Operations, Scheduler Persistence, Lock Manager,
Statistics History, Alert Severity Hierarchy, Health Trend Tracker, and Operations Manifest (CHECK 1 ~ 14).
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

# Dynamic imports for Operations Engine components
ops_logger_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.ops_logger")
OpsLogger = ops_logger_mod.OpsLogger

alert_engine_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.alert_engine")
AlertEngine = alert_engine_mod.AlertEngine

retry_manager_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.retry_manager")
RetryManager = retry_manager_mod.RetryManager
RetryExceededException = retry_manager_mod.RetryExceededException

health_checker_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.health_checker")
HealthChecker = health_checker_mod.HealthChecker

monitoring_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.monitoring_engine")
MonitoringEngine = monitoring_mod.MonitoringEngine

stats_engine_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.statistics_engine")
StatisticsEngine = stats_engine_mod.StatisticsEngine

report_gen_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.report_generator")
ReportGenerator = report_gen_mod.ReportGenerator

scheduler_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.scheduler_engine")
SchedulerEngine = scheduler_mod.SchedulerEngine

lock_manager_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.lock_manager")
LockManager = lock_manager_mod.LockManager

raw_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.raw_repository")
RAWRepository = raw_repo_mod.RAWRepository

std_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.standard_repository")
StandardRepository = std_repo_mod.StandardRepository

sem_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.semantic_repository")
SemanticRepository = sem_repo_mod.SemanticRepository

pipeline_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.pipeline")
FoodIngestionPipeline = pipeline_mod.FoodIngestionPipeline

bulk_collector_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.bulk_collector")
BulkCollector = bulk_collector_mod.BulkCollector

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
    print_header("PHASE 3-02 DATA OPERATIONS ENGINE PRODUCTION HARDENING SUITE")

    conn = sqlite3.connect(":memory:")
    raw_repo = RAWRepository(db_connection=conn)
    std_repo = StandardRepository(db_connection=conn)
    sem_repo = SemanticRepository(db_connection=conn)

    pipeline = FoodIngestionPipeline(
        raw_repo=raw_repo,
        std_repo=std_repo,
        sem_repo=sem_repo
    )

    checkpoints_dir = os.path.join(CURRENT_DIR, "checkpoints")
    state_file = os.path.join(checkpoints_dir, "collection_state.json")
    manifest_file = os.path.join(checkpoints_dir, "collection_manifest.json")
    history_file = os.path.join(checkpoints_dir, "history", "collection_history.jsonl")

    collector = BulkCollector(
        pipeline=pipeline,
        state_path=state_file,
        manifest_path=manifest_file,
        history_path=history_file
    )

    ops_logger = OpsLogger()
    alert_engine = AlertEngine(ops_logger=ops_logger)
    retry_manager = RetryManager(max_retries=2, initial_delay=0.01, ops_logger=ops_logger, alert_engine=alert_engine)
    health_checker = HealthChecker(db_connection=conn, ops_logger=ops_logger, alert_engine=alert_engine)
    monitor = MonitoringEngine(ops_logger=ops_logger)
    stats_engine = StatisticsEngine(ops_logger=ops_logger)
    report_generator = ReportGenerator(ops_logger=ops_logger, stats_engine=stats_engine)
    lock_manager = LockManager(ops_logger=ops_logger)

    scheduler = SchedulerEngine(
        bulk_collector=collector,
        ops_logger=ops_logger,
        retry_manager=retry_manager,
        health_checker=health_checker,
        monitor=monitor,
        stats_engine=stats_engine,
        report_generator=report_generator,
        alert_engine=alert_engine,
        lock_manager=lock_manager
    )

    # CHECK 1: Scheduler PASS
    print_header("CHECK 1. Scheduler PASS")
    try:
        job1 = scheduler.schedule_job("RDA_Daily_Full", "FULL_COLLECTION", "0 0 * * *")
        job2 = scheduler.schedule_job("RDA_Hourly_Inc", "INCREMENTAL_COLLECTION", "0 * * * *")
        run_res = scheduler.trigger_now(mode="FULL_COLLECTION", start_page=1, max_pages=1, items_per_page=5)
        
        c1_pass = len(scheduler.scheduled_jobs) >= 2 and run_res["status"] == "PASS"
        print_result("1.1 Scheduler Engine (FULL/INCREMENTAL/MANUAL)", c1_pass, f"Scheduled Jobs: {len(scheduler.scheduled_jobs)}, Trigger Status: {run_res['status']}")
    except Exception as e:
        print_result("1.1 Scheduler Exception", False, str(e))
        c1_pass = False

    # CHECK 2: Retry Manager PASS
    print_header("CHECK 2. Retry Manager PASS")
    try:
        attempt_counter = 0

        def failing_target():
            nonlocal attempt_counter
            attempt_counter += 1
            if attempt_counter < 2:
                raise ConnectionError("Simulated API Timeout (429 Rate Limit)")
            return "SUCCESS_AFTER_RETRY"

        result = retry_manager.execute_with_retry(failing_target)
        
        exceeded_pass = False
        try:
            retry_manager.execute_with_retry(lambda: 1/0)
        except RetryExceededException:
            exceeded_pass = True

        c2_pass = (result == "SUCCESS_AFTER_RETRY") and (attempt_counter == 2) and exceeded_pass
        print_result("2.1 Retry Manager (Differentiated Backoff & Max Retries Alert)", c2_pass, f"Recovered Result: {result}, Max Retry Exceeded Caught: {exceeded_pass}")
    except Exception as e:
        print_result("2.1 Retry Manager Exception", False, str(e))
        c2_pass = False

    # CHECK 3: Health Check PASS
    print_header("CHECK 3. Health Check PASS")
    try:
        health_res = health_checker.check_health()
        status = health_res.get("status")
        c3_pass = status in ["PASS", "WARNING"] and "checks" in health_res
        print_result("3.1 Health Check Engine Diagnostic (PASS/WARNING)", c3_pass, f"Overall Status: {status}, Checks: {list(health_res['checks'].keys())}")
    except Exception as e:
        print_result("3.1 Health Check Exception", False, str(e))
        c3_pass = False

    # CHECK 4: Monitoring PASS
    print_header("CHECK 4. Monitoring PASS")
    try:
        monitor.set_active_job("TEST_MONITORING_JOB", queue_size=10, active_workers=2)
        monitor.record_metrics(processed=15, failed=0, retries=1)
        metrics = monitor.get_realtime_metrics()

        c4_pass = (metrics["active_job"] == "TEST_MONITORING_JOB") and ("system_metadata" in metrics) and (metrics["active_workers"] == 2)
        print_result("4.1 Monitoring Engine Real-time Metrics & System Metadata", c4_pass, f"Active Job: {metrics['active_job']}, CPU: {metrics['system_metadata']['cpu_percent']}%, Workers: {metrics['active_workers']}")
    except Exception as e:
        print_result("4.1 Monitoring Exception", False, str(e))
        c4_pass = False

    # CHECK 5: Statistics PASS
    print_header("CHECK 5. Statistics PASS")
    try:
        stats = stats_engine.generate_statistics(
            total_collected=50,
            new_count=40,
            updated_count=5,
            unchanged_count=5,
            failed_count=0,
            duration_seconds=2.5,
            response_times_ms=[110.0, 125.0, 105.0]
        )

        c5_pass = stats["failure_rate_pct"] == 0.0 and stats["avg_throughput_per_sec"] == 20.0
        print_result("5.1 Statistics Engine Analytical Calculation", c5_pass, f"Throughput: {stats['avg_throughput_per_sec']}/s, Failure Rate: {stats['failure_rate_pct']}%")
    except Exception as e:
        print_result("5.1 Statistics Exception", False, str(e))
        c5_pass = False

    # CHECK 6: Report Generator PASS
    print_header("CHECK 6. Report Generator PASS")
    try:
        daily_rep = report_generator.generate_report("DAILY")
        weekly_rep = report_generator.generate_report("WEEKLY")
        monthly_rep = report_generator.generate_report("MONTHLY")

        reports_dir = report_generator.reports_dir
        rep_files = os.listdir(reports_dir) if os.path.exists(reports_dir) else []

        c6_pass = len(rep_files) >= 3 and daily_rep["report_type"] == "DAILY" and weekly_rep["report_type"] == "WEEKLY"
        print_result("6.1 Report Generator (Daily, Weekly, Monthly JSON)", c6_pass, f"Generated Report Files Count: {len(rep_files)}")
    except Exception as e:
        print_result("6.1 Report Generator Exception", False, str(e))
        c6_pass = False

    # CHECK 7: Alert Engine PASS
    print_header("CHECK 7. Alert Engine PASS")
    try:
        alt1 = alert_engine.trigger_alert("API_FAILURE", "OpenAPI Endpoint Down", "503 Service Unavailable", severity="CRITICAL")
        alt2 = alert_engine.trigger_alert("HASH_INTEGRITY_FAIL", "RAW Hash Mismatch", "Corrupted raw payload hash", severity="ERROR")
        
        alerts_list = alert_engine.list_alerts()
        c7_pass = len(alerts_list) >= 2 and alt1["status"] == "OPEN"
        print_result("7.1 Alert Engine (JSON Alerts Persistence)", c7_pass, f"Generated Alerts Count: {len(alerts_list)}, Latest Alert: {alt1['title']}")
    except Exception as e:
        print_result("7.1 Alert Engine Exception", False, str(e))
        c7_pass = False

    # CHECK 8: End-to-End Operations PASS
    print_header("CHECK 8. End-to-End Operations PASS")
    try:
        e2e_res = scheduler.trigger_now(mode="INCREMENTAL_COLLECTION", start_page=1, max_pages=1, items_per_page=5)
        c8_pass = e2e_res["status"] == "PASS" and "statistics" in e2e_res and "health" in e2e_res and "report" in e2e_res
        print_result("8.1 Full Data Operations Engine End-to-End Pipeline Integration", c8_pass, f"E2E Operations Verdict: {e2e_res['status']}")
    except Exception as e:
        print_result("8.1 E2E Operations Exception", False, str(e))
        c8_pass = False

    # CHECK 9: Scheduler Persistence PASS
    print_header("CHECK 9. Scheduler Persistence PASS")
    try:
        jobs_file = scheduler.jobs_file_path
        jobs_exists = os.path.exists(jobs_file)
        
        # Test auto recovery by creating a new scheduler instance
        new_scheduler = SchedulerEngine(
            bulk_collector=collector,
            ops_logger=ops_logger,
            jobs_file_path=jobs_file
        )
        recovered_count = len(new_scheduler.scheduled_jobs)
        sample_job = new_scheduler.scheduled_jobs[0] if recovered_count > 0 else {}
        
        c9_pass = jobs_exists and recovered_count >= 2 and "job_uuid" in sample_job and "last_run_time" in sample_job
        print_result("9.1 Scheduler Job Persistence & Auto Recovery", c9_pass, f"Jobs File: {jobs_exists}, Recovered Jobs: {recovered_count}, UUID: {sample_job.get('job_uuid')}")
    except Exception as e:
        print_result("9.1 Scheduler Persistence Exception", False, str(e))
        c9_pass = False

    # CHECK 10: Lock Manager PASS
    print_header("CHECK 10. Lock Manager PASS")
    try:
        acquired1 = lock_manager.acquire_lock("collection_lock", timeout_seconds=10.0, owner_id="PROCESS_A")
        # Attempting second acquire with active lock should fail/block
        acquired2 = lock_manager.acquire_lock("collection_lock", timeout_seconds=10.0, owner_id="PROCESS_B")
        released = lock_manager.release_lock("collection_lock")
        acquired3 = lock_manager.acquire_lock("collection_lock", timeout_seconds=10.0, owner_id="PROCESS_B")
        lock_manager.release_lock("collection_lock")

        c10_pass = acquired1 and (not acquired2) and released and acquired3
        print_result("10.1 Lock Manager Concurrency Control", c10_pass, f"Process A Lock: {acquired1}, Process B Blocked: {not acquired2}, Released & Reacquired: {acquired3}")
    except Exception as e:
        print_result("10.1 Lock Manager Exception", False, str(e))
        c10_pass = False

    # CHECK 11: Statistics History PASS
    print_header("CHECK 11. Statistics History PASS")
    try:
        stats_file = stats_engine.stats_history_path
        file_exists = os.path.exists(stats_file)
        line_count = 0
        if file_exists:
            with open(stats_file, "r", encoding="utf-8") as f:
                line_count = len([l for l in f.readlines() if l.strip()])

        c11_pass = file_exists and line_count > 0
        print_result("11.1 Statistics History Persistence (statistics_history.jsonl)", c11_pass, f"File Exists: {file_exists}, Cumulative Entry Count: {line_count}")
    except Exception as e:
        print_result("11.1 Statistics History Exception", False, str(e))
        c11_pass = False

    # CHECK 12: Alert Severity Hierarchy PASS
    print_header("CHECK 12. Alert Severity Hierarchy PASS")
    try:
        info_alt = alert_engine.trigger_alert("MANIFEST_ERROR", "Minor Manifest Notice", "Non-critical metadata update", severity="INFO")
        warn_alt = alert_engine.trigger_alert("COLLECTION_FAIL", "Rate Limit Warning", "Slow API response detected", severity="WARNING")
        err_alt = alert_engine.trigger_alert("DATABASE_ERROR", "DB Query Error", "Query timeout occurred", severity="ERROR")
        crit_alt = alert_engine.trigger_alert("RETRY_EXCEEDED", "API Outage", "OpenAPI completely unreachable", severity="CRITICAL")

        severities_valid = (
            info_alt["severity"] == "INFO" and
            warn_alt["severity"] == "WARNING" and
            err_alt["severity"] == "ERROR" and
            crit_alt["severity"] == "CRITICAL"
        )
        c12_pass = severities_valid
        print_result("12.1 Alert Severity Hierarchy (INFO/WARNING/ERROR/CRITICAL)", c12_pass, f"Severities Validated: INFO, WARNING, ERROR, CRITICAL")
    except Exception as e:
        print_result("12.1 Alert Severity Exception", False, str(e))
        c12_pass = False

    # CHECK 13: Health Trend Tracker PASS
    print_header("CHECK 13. Health Trend Tracker PASS")
    try:
        health_file = health_checker.health_history_path
        file_exists = os.path.exists(health_file)
        trends = health_checker.calculate_health_trends()

        c13_pass = file_exists and "pass_rate_pct" in trends and "warning_rate_pct" in trends
        print_result("13.1 Health Trend Tracker (health_history.jsonl & Pass Rate)", c13_pass, f"File Exists: {file_exists}, Pass Rate: {trends.get('pass_rate_pct')}%, Warning Rate: {trends.get('warning_rate_pct')}%")
    except Exception as e:
        print_result("13.1 Health Trend Exception", False, str(e))
        c13_pass = False

    # CHECK 14: Operations Manifest PASS
    print_header("CHECK 14. Operations Manifest PASS")
    try:
        ops_manifest_file = scheduler.ops_manifest_path
        manifest_exists = os.path.exists(ops_manifest_file)
        manifest_data = {}
        if manifest_exists:
            with open(ops_manifest_file, "r", encoding="utf-8") as f:
                manifest_data = json.load(f)

        c14_pass = (
            manifest_exists and
            manifest_data.get("operations_version") == "1.0.0" and
            manifest_data.get("scheduler_version") == "1.0.0" and
            manifest_data.get("alert_version") == "1.0.0"
        )
        print_result("14.1 Operations Manifest (operations_manifest.json)", c14_pass, f"Ops Version: {manifest_data.get('operations_version')}, Scheduler Version: {manifest_data.get('scheduler_version')}")
    except Exception as e:
        print_result("14.1 Operations Manifest Exception", False, str(e))
        c14_pass = False

    all_passed = (
        c1_pass and c2_pass and c3_pass and c4_pass and c5_pass and c6_pass and c7_pass and
        c8_pass and c9_pass and c10_pass and c11_pass and c12_pass and c13_pass and c14_pass
    )

    print_header(f"FINAL PHASE 3-02 VERDICT: {'PRODUCTION READY (ALL 14 CHECKS PASSED)' if all_passed else 'SOME TESTS FAILED'}")
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
