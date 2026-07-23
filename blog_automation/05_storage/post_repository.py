"""
Blog Automation System — Phase 01
PostRepository: JSON 파일 기반 포스트 CRUD 저장소.

저장 구조:
  data/posts/index.json              ← PostRecord 목록
  data/posts/{filename}              ← Markdown 포스트 콘텐츠
"""
import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from .post_schema import PostRecord, PostStatus
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from ..content_pipeline.post_formatter import FormattedPost  # type hint only

# Use duck-typed FormattedPost to avoid circular/path imports at runtime

logger = logging.getLogger("blog_automation.post_repository")


class PostRepository:
    """JSON 파일 기반 포스트 저장소."""

    def __init__(self, base_dir: Optional[str] = None):
        if base_dir is None:
            base_dir = os.path.join(os.path.dirname(__file__), "..", "data", "posts")
        self.base_dir = Path(base_dir).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self._index_path = self.base_dir / "index.json"
        self._ensure_index()

    # ──────────────────────────────────────────────────────────────
    # Public API
    # ──────────────────────────────────────────────────────────────

    def save_post(self, formatted_post: FormattedPost, food_name: str = "") -> PostRecord:
        """
        FormattedPost를 저장한다.
        동일 food_code가 이미 존재하면 기존 PostRecord를 반환한다.
        """
        if self.exists_by_food_code(formatted_post.food_code):
            existing = self._find_by_food_code(formatted_post.food_code)
            logger.warning(
                f"[PostRepository] Duplicate food_code={formatted_post.food_code}. "
                f"Returning existing post_id={existing.post_id}"
            )
            return existing

        # Markdown 파일 저장
        md_path = self.base_dir / formatted_post.filename
        md_path.write_text(formatted_post.markdown_content, encoding="utf-8")

        # 인덱스 레코드 생성
        record = PostRecord(
            post_id=formatted_post.post_id,
            food_code=formatted_post.food_code,
            food_name=food_name,
            title=formatted_post.meta_title,
            filename=formatted_post.filename,
            seo_score=formatted_post.seo_score,
            status=PostStatus.DRAFT,
            created_at=formatted_post.created_at,
        )
        self._append_index(record)
        logger.info(
            f"[PostRepository] Saved post_id={record.post_id} | "
            f"food_code={record.food_code} | status={record.status.value}"
        )
        return record

    def get_post(self, post_id: str) -> Optional[PostRecord]:
        """post_id로 PostRecord를 조회한다."""
        for r in self._load_index():
            if r.post_id == post_id:
                return r
        return None

    def list_posts(
        self,
        status: Optional[PostStatus] = None,
        food_code: Optional[str] = None,
    ) -> list[PostRecord]:
        """조건에 맞는 PostRecord 목록을 반환한다."""
        records = self._load_index()
        if status:
            records = [r for r in records if r.status == status]
        if food_code:
            records = [r for r in records if r.food_code == food_code]
        return records

    def update_status(
        self,
        post_id: str,
        status: PostStatus,
        **kwargs,
    ) -> Optional[PostRecord]:
        """포스트 상태를 갱신한다."""
        records = self._load_index()
        updated = None
        for r in records:
            if r.post_id == post_id:
                r.status = status
                for k, v in kwargs.items():
                    if hasattr(r, k):
                        setattr(r, k, v)
                updated = r
                break
        if updated:
            self._save_index(records)
            logger.info(
                f"[PostRepository] Updated post_id={post_id} → status={status.value}"
            )
        return updated

    def exists_by_food_code(self, food_code: str) -> bool:
        """동일 food_code 포스트가 이미 존재하는지 확인한다."""
        return any(r.food_code == food_code for r in self._load_index())

    def get_markdown(self, filename: str) -> Optional[str]:
        """저장된 Markdown 파일 내용을 반환한다."""
        path = self.base_dir / filename
        if path.exists():
            return path.read_text(encoding="utf-8")
        return None

    def count(self, status: Optional[PostStatus] = None) -> int:
        """포스트 수를 반환한다."""
        return len(self.list_posts(status=status))

    # ──────────────────────────────────────────────────────────────
    # Private helpers
    # ──────────────────────────────────────────────────────────────

    def _ensure_index(self):
        if not self._index_path.exists():
            self._index_path.write_text("[]", encoding="utf-8")

    def _load_index(self) -> list[PostRecord]:
        raw = json.loads(self._index_path.read_text(encoding="utf-8"))
        return [PostRecord.from_dict(item) for item in raw]

    def _save_index(self, records: list[PostRecord]):
        data = [r.to_dict() for r in records]
        self._index_path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    def _append_index(self, record: PostRecord):
        records = self._load_index()
        records.append(record)
        self._save_index(records)

    def _find_by_food_code(self, food_code: str) -> Optional[PostRecord]:
        for r in self._load_index():
            if r.food_code == food_code:
                return r
        return None
