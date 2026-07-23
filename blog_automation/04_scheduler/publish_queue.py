"""
Blog Automation System — Phase 01
PublishQueue: FIFO 발행 큐. JSON 파일로 영속화.

저장 위치: data/queue/queue.json
"""
import json
import logging
import os
from pathlib import Path
from typing import Optional

logger = logging.getLogger("blog_automation.publish_queue")


class PublishQueue:
    """
    FIFO 발행 큐.
    post_id 문자열 목록을 JSON 파일로 영속화한다.
    """

    def __init__(self, base_dir: Optional[str] = None):
        if base_dir is None:
            base_dir = os.path.join(os.path.dirname(__file__), "..", "data", "queue")
        self.base_dir = Path(base_dir).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self._queue_path = self.base_dir / "queue.json"
        self._ensure_queue()

    # ──────────────────────────────────────────────────────────────
    # Public API
    # ──────────────────────────────────────────────────────────────

    def enqueue(self, post_id: str) -> None:
        """post_id를 큐 뒤에 추가한다."""
        queue = self._load()
        if post_id in queue:
            logger.warning(f"[PublishQueue] post_id={post_id} already in queue. Skipping.")
            return
        queue.append(post_id)
        self._save(queue)
        logger.info(f"[PublishQueue] Enqueued post_id={post_id}. Queue size={len(queue)}")

    def dequeue(self) -> Optional[str]:
        """큐 앞에서 post_id를 꺼낸다. 큐가 비어 있으면 None을 반환한다."""
        queue = self._load()
        if not queue:
            return None
        post_id = queue.pop(0)
        self._save(queue)
        logger.info(f"[PublishQueue] Dequeued post_id={post_id}. Queue size={len(queue)}")
        return post_id

    def peek(self) -> Optional[str]:
        """큐 앞의 post_id를 제거하지 않고 반환한다."""
        queue = self._load()
        return queue[0] if queue else None

    def size(self) -> int:
        """현재 큐 크기를 반환한다."""
        return len(self._load())

    def is_empty(self) -> bool:
        """큐가 비어 있으면 True를 반환한다."""
        return self.size() == 0

    def snapshot(self) -> list[str]:
        """현재 큐 전체를 복사본으로 반환한다."""
        return list(self._load())

    def remove(self, post_id: str) -> bool:
        """큐에서 특정 post_id를 제거한다. 성공 시 True."""
        queue = self._load()
        if post_id in queue:
            queue.remove(post_id)
            self._save(queue)
            logger.info(f"[PublishQueue] Removed post_id={post_id}")
            return True
        return False

    # ──────────────────────────────────────────────────────────────
    # Private helpers
    # ──────────────────────────────────────────────────────────────

    def _ensure_queue(self):
        if not self._queue_path.exists():
            self._queue_path.write_text("[]", encoding="utf-8")

    def _load(self) -> list[str]:
        return json.loads(self._queue_path.read_text(encoding="utf-8"))

    def _save(self, queue: list[str]):
        self._queue_path.write_text(
            json.dumps(queue, ensure_ascii=False, indent=2), encoding="utf-8"
        )
