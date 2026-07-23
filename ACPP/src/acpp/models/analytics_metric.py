"""
AnalyticsMetric Model
======================
Maps to ``analytics_metrics`` table (ACPP_DATABASE_SCHEMA §2.7).
Post-publication telemetry: traffic, dwell time, CEI score.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING, Optional

from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from acpp.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from acpp.models.publishing_history import PublishingHistory


class AnalyticsMetric(Base, TimestampMixin):
    """
    Stores traffic, dwell time, and Content Effectiveness Index (CEI) ratings.
    """

    __tablename__ = "analytics_metrics"

    # ── Primary Key ───────────────────────────────────────────────────
    metric_id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: str(uuid.uuid4())
    )

    # ── Foreign Keys ──────────────────────────────────────────────────
    publication_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("publishing_history.publication_id", ondelete="CASCADE"),
        nullable=False,
    )

    # ── Core Fields ───────────────────────────────────────────────────
    pageviews: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    dwell_time_seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    social_shares: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cei_score: Mapped[float] = mapped_column(
        Numeric(5, 2), nullable=False, default=0.0
    )
    feedback_recommendation: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True
    )

    # ── Relationships ─────────────────────────────────────────────────
    publication: Mapped["PublishingHistory"] = relationship(
        "PublishingHistory", back_populates="analytics_metrics"
    )

    # ── Table constraints ─────────────────────────────────────────────
    __table_args__ = (
        CheckConstraint(
            "cei_score >= 0.00 AND cei_score <= 100.00",
            name="ck_analytics_cei_range",
        ),
        Index("idx_analytics_cei", "cei_score"),
    )

    def __repr__(self) -> str:
        return (
            f"<AnalyticsMetric(metric_id={self.metric_id!r}, "
            f"cei={self.cei_score})>"
        )
