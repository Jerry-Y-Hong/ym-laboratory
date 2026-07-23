"""
Blog Automation System — Phase 01
BlogScheduler: 일 2회(09:00 KST / 20:00 KST) 자동 발행 스케줄러.

외부 의존:
  - 표준 라이브러리 `sched` + threading 기반 간단 스케줄러
  - 실제 운영은 OS cron 또는 Platform Scheduler 서비스로 교체 (Post-MVP)

발행 처리:
  PublishQueue.dequeue() → PostRepository.get_post()
  → [시뮬레이션 발행] → PostRepository.update_status(PUBLISHED|FAILED)
"""
import json
import logging
import os
import threading
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Callable

from .publish_queue import PublishQueue
from ..05_storage.post_schema import PostStatus

logger = logging.getLogger("blog_automation.blog_scheduler")

MAX_RETRY = 3


class BlogScheduler:
    """
    일 2회 자동 발행 스케줄러.

    run_once()로 즉시 발행 사이클을 실행하거나
    start_daemon()으로 백그라운드 스케줄 루프를 시작한다.
    """

    # 발행 시각 (KST = UTC+9)
    PUBLISH_HOURS_KST = [9, 20]

    def __init__(
        self,
        queue: Optional[PublishQueue] = None,
        repository=None,          # PostRepository (런타임 주입)
        publish_fn: Optional[Callable[[str], bool]] = None,
        log_dir: Optional[str] = None,
    ):
        self.queue = queue or PublishQueue()
        self.repository = repository  # None이면 내부에서 지연 초기화
        self.publish_fn = publish_fn or self._default_publish
        if log_dir is None:
            log_dir = os.path.join(os.path.dirname(__file__), "..", "data", "logs")
        self.log_dir = Path(log_dir).resolve()
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self._stop_event = threading.Event()

    # ──────────────────────────────────────────────────────────────
    # Public API
    # ──────────────────────────────────────────────────────────────

    def run_once(self) -> dict:
        """
        단일 발행 사이클을 즉시 실행한다.
        큐에서 post_id를 꺼내어 발행 처리하고 결과를 반환한다.
        """
        cycle_result = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "queue_size_before": self.queue.size(),
            "processed": [],
            "queue_size_after": 0,
        }

        if self.queue.is_empty():
            logger.info("[BlogScheduler] run_once: Queue is empty. Nothing to publish.")
            cycle_result["queue_size_after"] = 0
            self._write_log(cycle_result)
            return cycle_result

        post_id = self.queue.dequeue()
        result = self._process_one(post_id)
        cycle_result["processed"].append(result)
        cycle_result["queue_size_after"] = self.queue.size()

        self._write_log(cycle_result)
        logger.info(f"[BlogScheduler] run_once complete: {result}")
        return cycle_result

    def start_daemon(self):
        """백그라운드 스케줄 루프를 시작한다 (09:00 / 20:00 KST)."""
        t = threading.Thread(target=self._schedule_loop, daemon=True, name="BlogSchedulerDaemon")
        t.start()
        logger.info("[BlogScheduler] Daemon started. Publish hours KST: 09:00, 20:00")
        return t

    def stop(self):
        """스케줄 루프를 중단한다."""
        self._stop_event.set()
        logger.info("[BlogScheduler] Stop requested.")

    def get_schedule_status(self) -> dict:
        """현재 스케줄 상태를 반환한다."""
        now_kst = self._now_kst_hour()
        return {
            "current_kst_hour": now_kst,
            "next_publish_kst_hours": self.PUBLISH_HOURS_KST,
            "queue_size": self.queue.size(),
            "queue_preview": self.queue.snapshot()[:5],
        }

    # ──────────────────────────────────────────────────────────────
    # Private helpers
    # ──────────────────────────────────────────────────────────────

    def _schedule_loop(self):
        """발행 시각 도달 시 run_once()를 실행하는 루프."""
        last_run_hour = -1
        while not self._stop_event.is_set():
            now_kst_hour = self._now_kst_hour()
            now_kst_minute = self._now_kst_minute()
            if (now_kst_hour in self.PUBLISH_HOURS_KST
                    and now_kst_minute == 0
                    and now_kst_hour != last_run_hour):
                logger.info(f"[BlogScheduler] Scheduled publish triggered at KST {now_kst_hour:02d}:00")
                self.run_once()
                last_run_hour = now_kst_hour
            time.sleep(30)

    def _process_one(self, post_id: str) -> dict:
        """단일 post_id를 발행 처리한다."""
        result = {"post_id": post_id, "outcome": None, "timestamp": datetime.now(timezone.utc).isoformat()}

        repo = self._get_repo()
        record = repo.get_post(post_id) if repo else None

        if record is None:
            logger.error(f"[BlogScheduler] post_id={post_id} not found in repository.")
            result["outcome"] = "NOT_FOUND"
            return result

        try:
            success = self.publish_fn(post_id)
            if success:
                if repo:
                    repo.update_status(
                        post_id,
                        PostStatus.PUBLISHED,
                        published_at=datetime.now(timezone.utc).isoformat(),
                    )
                result["outcome"] = "PUBLISHED"
                logger.info(f"[BlogScheduler] PUBLISHED post_id={post_id}")
            else:
                raise RuntimeError("publish_fn returned False")
        except Exception as exc:
            retry_count = record.retry_count + 1
            if retry_count < MAX_RETRY:
                if repo:
                    repo.update_status(post_id, PostStatus.QUEUED, retry_count=retry_count)
                self.queue.enqueue(post_id)
                result["outcome"] = f"RETRY({retry_count}/{MAX_RETRY})"
                logger.warning(f"[BlogScheduler] Retry {retry_count}/{MAX_RETRY} for post_id={post_id}: {exc}")
            else:
                if repo:
                    repo.update_status(
                        post_id,
                        PostStatus.FAILED,
                        retry_count=retry_count,
                        failed_reason=str(exc),
                    )
                result["outcome"] = "FAILED"
                logger.error(f"[BlogScheduler] FAILED post_id={post_id} after {MAX_RETRY} retries: {exc}")

        return result

    @staticmethod
    def _default_publish(post_id: str) -> bool:
        """기본 발행 시뮬레이터. 실제 플랫폼 연동 전 Mock."""
        logger.info(f"[BlogScheduler][Mock] Simulating publish for post_id={post_id}")
        return True

    def _get_repo(self):
        """PostRepository를 지연 초기화하여 반환한다."""
        if self.repository is None:
            try:
                from ..05_storage.post_repository import PostRepository
                self.repository = PostRepository()
            except Exception:
                pass
        return self.repository

    def _write_log(self, cycle_result: dict):
        """발행 사이클 결과를 JSON 로그 파일에 기록한다."""
        date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        log_path = self.log_dir / f"publish_log_{date_str}.json"
        if log_path.exists():
            existing = json.loads(log_path.read_text(encoding="utf-8"))
        else:
            existing = []
        existing.append(cycle_result)
        log_path.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")

    @staticmethod
    def _now_kst_hour() -> int:
        """현재 KST 시각(시)을 반환한다."""
        from datetime import timezone, timedelta
        kst = timezone(timedelta(hours=9))
        return datetime.now(kst).hour

    @staticmethod
    def _now_kst_minute() -> int:
        from datetime import timezone, timedelta
        kst = timezone(timedelta(hours=9))
        return datetime.now(kst).minute
