"""
Scheduler Engine (Phase 3-02 Production Hardening)
Orchestrates scheduled reservations, persistence to scheduled_jobs.json, auto recovery,
Lock Manager integration, and operations manifest metadata management.
"""
import os
import time
import json
import uuid
import importlib
from typing import Dict, Any, Optional, List

ops_logger_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.ops_logger")
OpsLogger = ops_logger_mod.OpsLogger

retry_manager_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.retry_manager")
RetryManager = retry_manager_mod.RetryManager

health_checker_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.health_checker")
HealthChecker = health_checker_mod.HealthChecker

monitoring_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.monitoring_engine")
MonitoringEngine = monitoring_mod.MonitoringEngine

stats_engine_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.statistics_engine")
StatisticsEngine = stats_engine_mod.StatisticsEngine

report_gen_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.report_generator")
ReportGenerator = report_gen_mod.ReportGenerator

alert_engine_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.alert_engine")
AlertEngine = alert_engine_mod.AlertEngine

lock_manager_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.operations.lock_manager")
LockManager = lock_manager_mod.LockManager

bulk_collector_mod = importlib.import_module("100_PLATFORM.140_AUTOMATION.bulk_collector")
BulkCollector = bulk_collector_mod.BulkCollector

utils_mod = importlib.import_module("100_PLATFORM.150_SHARED.utils")
get_utc_now_iso = utils_mod.get_utc_now_iso

CHECKPOINT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "checkpoints")
JOBS_PERSIST_FILE = os.path.join(CHECKPOINT_DIR, "scheduled_jobs.json")
OPS_MANIFEST_FILE = os.path.join(CHECKPOINT_DIR, "operations_manifest.json")

class SchedulerEngine:
    VALID_MODES = ["FULL_COLLECTION", "INCREMENTAL_COLLECTION", "MANUAL_COLLECTION"]

    def __init__(
        self,
        bulk_collector: Optional[BulkCollector] = None,
        ops_logger: Optional[OpsLogger] = None,
        retry_manager: Optional[RetryManager] = None,
        health_checker: Optional[HealthChecker] = None,
        monitor: Optional[MonitoringEngine] = None,
        stats_engine: Optional[StatisticsEngine] = None,
        report_generator: Optional[ReportGenerator] = None,
        alert_engine: Optional[AlertEngine] = None,
        lock_manager: Optional[LockManager] = None,
        jobs_file_path: str = JOBS_PERSIST_FILE,
        ops_manifest_path: str = OPS_MANIFEST_FILE
    ):
        self.bulk_collector = bulk_collector or BulkCollector()
        self.ops_logger = ops_logger or OpsLogger()
        self.alert_engine = alert_engine or AlertEngine(ops_logger=self.ops_logger)
        self.retry_manager = retry_manager or RetryManager(ops_logger=self.ops_logger, alert_engine=self.alert_engine)
        self.health_checker = health_checker or HealthChecker(ops_logger=self.ops_logger, alert_engine=self.alert_engine)
        self.monitor = monitor or MonitoringEngine(ops_logger=self.ops_logger)
        self.stats_engine = stats_engine or StatisticsEngine(ops_logger=self.ops_logger)
        self.report_generator = report_generator or ReportGenerator(ops_logger=self.ops_logger, stats_engine=self.stats_engine)
        self.lock_manager = lock_manager or LockManager(ops_logger=self.ops_logger)
        
        self.jobs_file_path = jobs_file_path
        self.ops_manifest_path = ops_manifest_path
        self.scheduled_jobs: List[Dict[str, Any]] = []

        self._load_jobs_from_persistence()
        self._write_operations_manifest()

    def _load_jobs_from_persistence(self):
        """Loads and recovers scheduled jobs from persistence file."""
        if os.path.exists(self.jobs_file_path):
            try:
                with open(self.jobs_file_path, "r", encoding="utf-8") as f:
                    self.scheduled_jobs = json.load(f)
                self.ops_logger.log_event("SchedulerEngine", "JOBS_RECOVERED", f"Recovered {len(self.scheduled_jobs)} jobs from persistence file.")
            except Exception as e:
                self.ops_logger.log_event("SchedulerEngine", "RECOVERY_ERROR", f"Failed to load jobs persistence: {e}", level="ERROR")

    def _save_jobs_to_persistence(self):
        """Saves active jobs into scheduled_jobs.json."""
        try:
            os.makedirs(os.path.dirname(self.jobs_file_path), exist_ok=True)
            with open(self.jobs_file_path, "w", encoding="utf-8") as f:
                json.dump(self.scheduled_jobs, f, ensure_ascii=False, indent=2)
        except Exception as e:
            self.ops_logger.log_event("SchedulerEngine", "SAVE_ERROR", f"Failed to persist jobs: {e}", level="ERROR")

    def _write_operations_manifest(self):
        """Writes operations_manifest.json metadata file."""
        manifest_data = {
            "operations_version": "1.0.0",
            "scheduler_version": "1.0.0",
            "monitor_version": "1.0.0",
            "statistics_version": "1.0.0",
            "alert_version": "1.0.0",
            "health_version": "1.0.0",
            "last_updated": get_utc_now_iso()
        }
        try:
            os.makedirs(os.path.dirname(self.ops_manifest_path), exist_ok=True)
            with open(self.ops_manifest_path, "w", encoding="utf-8") as f:
                json.dump(manifest_data, f, ensure_ascii=False, indent=2)
            self.ops_logger.log_event("SchedulerEngine", "MANIFEST_UPDATED", "Operations Manifest written successfully.")
        except Exception as e:
            self.ops_logger.log_event("SchedulerEngine", "MANIFEST_ERROR", str(e), level="ERROR")

    def schedule_job(self, job_name: str, mode: str, cron_expression: str = "* * * * *") -> Dict[str, Any]:
        """Registers a persistent scheduled job with UUID and execution history tracking."""
        mode_upper = mode.upper()
        if mode_upper not in self.VALID_MODES:
            mode_upper = "MANUAL_COLLECTION"

        job_info = {
            "job_uuid": f"JOB_{uuid.uuid4().hex[:12]}",
            "job_name": job_name,
            "mode": mode_upper,
            "cron_expression": cron_expression,
            "status": "SCHEDULED",
            "last_run_time": None,
            "next_run_time": get_utc_now_iso(),
            "run_history": []
        }
        self.scheduled_jobs.append(job_info)
        self._save_jobs_to_persistence()
        self.ops_logger.log_event("SchedulerEngine", "JOB_SCHEDULED", f"Job '{job_name}' (UUID: {job_info['job_uuid']}) scheduled with mode {mode_upper}", details=job_info)
        return job_info

    def trigger_now(
        self,
        mode: str = "FULL_COLLECTION",
        start_page: int = 1,
        max_pages: int = 2,
        items_per_page: int = 5
    ) -> Dict[str, Any]:
        """Triggers immediate execution with Lock Manager concurrency control."""
        mode_upper = mode.upper()
        if mode_upper not in self.VALID_MODES:
            mode_upper = "MANUAL_COLLECTION"

        # Concurrency Lock Control
        lock_acquired = self.lock_manager.acquire_lock("collection_lock", timeout_seconds=30.0, owner_id=f"SCHEDULER_{mode_upper}")
        if not lock_acquired:
            self.ops_logger.log_event("SchedulerEngine", "JOB_BLOCKED", f"Execution blocked: 'collection_lock' already held.", level="WARNING")
            return {"status": "BLOCKED", "message": "collection_lock is held by another process"}

        try:
            self.monitor.set_active_job(f"JOB_{mode_upper}", queue_size=max_pages * items_per_page)
            self.ops_logger.log_event("SchedulerEngine", "JOB_TRIGGERED", f"Triggering immediate job execution ({mode_upper})")

            start_time = time.time()
            start_iso = get_utc_now_iso()
            resume_flag = (mode_upper == "FULL_COLLECTION")

            def run_collection():
                return self.bulk_collector.collect_bulk(
                    start_page=start_page,
                    max_pages=max_pages,
                    items_per_page=items_per_page,
                    resume=resume_flag
                )

            res = self.retry_manager.execute_with_retry(run_collection)
            stats = res["stats"]
            duration = round(time.time() - start_time, 3)

            # Record stats & metrics
            self.monitor.record_metrics(
                processed=stats["total_processed"],
                failed=stats["failed_count"],
                retries=self.retry_manager.total_retries_executed
            )

            calculated_stats = self.stats_engine.generate_statistics(
                total_collected=stats["total_processed"],
                new_count=stats["new_count"],
                updated_count=stats["updated_count"],
                unchanged_count=stats["unchanged_count"],
                failed_count=stats["failed_count"],
                duration_seconds=duration
            )

            health = self.health_checker.check_health()
            report = self.report_generator.generate_report("DAILY", stats_data=calculated_stats, health_status=health["status"])

            # Update job persistence history
            for j in self.scheduled_jobs:
                if j["mode"] == mode_upper:
                    j["last_run_time"] = start_iso
                    j["run_history"].append({
                        "run_time": start_iso,
                        "duration_sec": duration,
                        "status": "PASS"
                    })
            self._save_jobs_to_persistence()
            self._write_operations_manifest()

            self.monitor.set_active_job("IDLE", queue_size=0)
            self.ops_logger.log_event("SchedulerEngine", "JOB_COMPLETED", f"Job ({mode_upper}) COMPLETED successfully in {duration}s")

            return {
                "status": "PASS",
                "mode": mode_upper,
                "duration_seconds": duration,
                "collection_result": res,
                "statistics": calculated_stats,
                "health": health,
                "report": report
            }
        except Exception as e:
            self.monitor.set_active_job("IDLE", queue_size=0)
            self.alert_engine.trigger_alert(
                alert_type="COLLECTION_FAIL",
                title=f"Scheduled Job Failure ({mode_upper})",
                description=str(e),
                severity="CRITICAL"
            )
            self.ops_logger.log_event("SchedulerEngine", "JOB_FAILED", str(e), level="ERROR")
            raise
        finally:
            self.lock_manager.release_lock("collection_lock")
