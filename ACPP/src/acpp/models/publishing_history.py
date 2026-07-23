"""
PublishingHistory Model
========================
Maps to ``publishing_history`` table (ACPP_DATABASE_SCHEMA §2.6).
Multi-channel output dispatch receipts.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING, List

from sqlalchemy import CheckConstraint, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from acpp.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from acpp.models.workflow_history import WorkflowHistory
    from acpp.models.approval_record import ApprovalRecord
    from acpp.models.analytics_metric import AnalyticsMetric


class PublishingHistory(Base, TimestampMixin):
    """
    Records dispatches sent to external CMS and rendering engines.
    """

    __tablename__ = "publishing_history"

    # ── Primary Key ───────────────────────────────────────────────────
    publication_id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: str(uuid.uuid4())
    )

    # ── Foreign Keys ──────────────────────────────────────────────────
    workflow_run_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("workflow_history.workflow_run_id"),
        nullable=False,
    )
    approval_token_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("human_approval_tokens.token_id"),
        nullable=False,
    )

    # ── Core Fields ───────────────────────────────────────────────────
    channel_type: Mapped[str] = mapped_column(String(32), nullable=False)
    target_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    artifact_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="SUCCESS")

    # ── Relationships ─────────────────────────────────────────────────
    workflow: Mapped["WorkflowHistory"] = relationship(
        "WorkflowHistory", back_populates="publishing_records"
    )
    approval_record: Mapped["ApprovalRecord"] = relationship(
        "ApprovalRecord", back_populates="publishing_records"
    )
    analytics_metrics: Mapped[List["AnalyticsMetric"]] = relationship(
        "AnalyticsMetric",
        back_populates="publication",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    # ── Table constraints ─────────────────────────────────────────────
    __table_args__ = (
        CheckConstraint(
            "status IN ('SUCCESS', 'FAILED')",
            name="ck_pub_status",
        ),
        Index("idx_pub_hist_channel", "channel_type"),
    )

    def __repr__(self) -> str:
        return (
            f"<PublishingHistory(publication_id={self.publication_id!r}, "
            f"channel={self.channel_type!r}, status={self.status!r})>"
        )
