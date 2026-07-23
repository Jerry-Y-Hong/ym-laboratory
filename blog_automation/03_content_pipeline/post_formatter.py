"""
Blog Automation System — Phase 01
PostFormatter: BlogDraft + SEOResult → 최종 Markdown 포스트 변환기.
"""
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from .content_generator import BlogDraft
from .seo_optimizer import SEOResult

logger = logging.getLogger("blog_automation.post_formatter")


@dataclass
class FormattedPost:
    """최종 발행 가능한 포스트."""
    post_id: str
    food_code: str
    filename: str
    markdown_content: str
    meta_title: str
    meta_description: str
    seo_score: int
    word_count: int
    status: str       # 항상 "DRAFT" (저장 시 결정)
    created_at: str


class PostFormatter:
    """BlogDraft + SEOResult를 최종 Markdown 문서로 변환한다."""

    def format(self, draft: BlogDraft, seo: SEOResult) -> FormattedPost:
        """최종 Markdown 포스트를 생성하여 반환한다."""
        front_matter = self._build_front_matter(draft, seo)
        body_content = self._assemble_body(draft)
        markdown_content = front_matter + body_content

        filename = f"{draft.post_id[:8]}_{draft.food_code}.md"
        word_count = len(markdown_content.replace("\n", " ").split())

        result = FormattedPost(
            post_id=draft.post_id,
            food_code=draft.food_code,
            filename=filename,
            markdown_content=markdown_content,
            meta_title=seo.meta_title,
            meta_description=seo.meta_description,
            seo_score=seo.seo_score,
            word_count=word_count,
            status="DRAFT",
            created_at=draft.created_at,
        )
        logger.info(
            f"[PostFormatter] formatted: post_id={draft.post_id} | "
            f"filename={filename} | words={word_count} | seo={seo.seo_score}"
        )
        return result

    # ──────────────────────────────────────────────────────────────
    # Private helpers
    # ──────────────────────────────────────────────────────────────

    def _build_front_matter(self, draft: BlogDraft, seo: SEOResult) -> str:
        """YAML Front Matter를 생성한다."""
        created_date = draft.created_at[:10]  # YYYY-MM-DD
        return (
            "---\n"
            f"title: \"{seo.meta_title}\"\n"
            f"description: \"{seo.meta_description}\"\n"
            f"keywords: \"{draft.target_keyword}\"\n"
            f"date: {created_date}\n"
            f"seo_score: {seo.seo_score}\n"
            f"post_id: {draft.post_id}\n"
            f"food_code: {draft.food_code}\n"
            f"status: DRAFT\n"
            "---\n\n"
        )

    def _assemble_body(self, draft: BlogDraft) -> str:
        """H1 → Summary → Body → Nutrition Table → CTA Footer 순서로 조립한다."""
        parts = [
            f"# {draft.title}\n\n",
            f"{draft.summary}\n\n",
            "---\n\n",
            draft.body,
            "\n",
            draft.nutrition_table,
            "\n",
            draft.cta_footer,
        ]
        return "".join(parts)
