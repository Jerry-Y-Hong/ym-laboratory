"""
ApprovalRecord Model
=====================
Maps to ``human_approval_tokens`` table (ACPP_DATABASE_SCHEMA §2.5).
AEGS Governance human approval sign-offs.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from acpp.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from acpp.models.workflow_history import WorkflowHistory
    from acpp.models.publishing_history import PublishingHistory


class ApprovalRecord(Base, TimestampMixin):
    """
    Stores human editor approval sign-offs prior to publication dispatch.
    Governed by Phase 37 AEGS.
    """

    __tablename__ = "human_approval_tokens"

    # ── Primary Key ───────────────────────────────────────────────────
    token_id: Mapped[str] = mapped_column(String(64), primary_key=True)

    # ── Foreign Keys ──────────────────────────────────────────────────
    workflow_run_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("workflow_history.workflow_run_id"),
        nullable=False,
    )

    # ── Core Fields ───────────────────────────────────────────────────
    approver_user_id: Mapped[str] = mapped_column(String(64), nullable=False)
    approval_status: Mapped[str] = mapped_column(
        String(16), nullable=False, default="PENDING"
    )
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    # ── Relationships ─────────────────────────────────────────────────
    workflow: Mapped["WorkflowHistory"] = relationship(
        "WorkflowHistory", back_populates="approval_records"
    )
    publishing_records: Mapped[list["PublishingHistory"]] = relationship(
        "PublishingHistory",
        back_populates="approval_record",
        lazy="selectin",
    )

    # ── Table constraints ─────────────────────────────────────────────
    __table_args__ = (
        CheckConstraint(
            "approval_status IN ('PENDING', 'APPROVED', 'REJECTED')",
            name="ck_approval_status",
        ),
        Index("idx_approval_token_wf", "workflow_run_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<ApprovalRecord(token_id={self.token_id!r}, "
            f"status={self.approval_status!r})>"
        )
