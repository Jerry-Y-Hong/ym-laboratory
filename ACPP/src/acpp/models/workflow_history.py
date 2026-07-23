"""
WorkflowHistory Model
======================
Maps to ``workflow_history`` table (ACPP_DATABASE_SCHEMA §2.3).
Pipeline execution tracking across the 6 platform workflows.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import CheckConstraint, Index, String, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime

from acpp.db.base import Base, TimestampMixin, SoftDeleteMixin

if TYPE_CHECKING:
    from acpp.models.agent_execution import AgentExecution
    from acpp.models.approval_record import ApprovalRecord
    from acpp.models.publishing_history import PublishingHistory


class WorkflowHistory(Base, TimestampMixin, SoftDeleteMixin):
    """
    Tracks execution state across platform workflows.

    Stores input/output payloads as JSON for full audit traceability.
    """

    __tablename__ = "workflow_history"

    # ── Primary Key ───────────────────────────────────────────────────
    workflow_run_id: Mapped[str] = mapped_column(String(64), primary_key=True)

    # ── Core Fields ───────────────────────────────────────────────────
    workflow_name: Mapped[str] = mapped_column(String(64), nullable=False)
    tenant_id: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    current_state: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="RUNNING")
    input_payload: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, doc="JSON-serialized input payload"
    )
    output_payload: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, doc="JSON-serialized output payload"
    )
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # ── Relationships ─────────────────────────────────────────────────
    agent_executions: Mapped[List["AgentExecution"]] = relationship(
        "AgentExecution",
        back_populates="workflow",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    approval_records: Mapped[List["ApprovalRecord"]] = relationship(
        "ApprovalRecord",
        back_populates="workflow",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    publishing_records: Mapped[List["PublishingHistory"]] = relationship(
        "PublishingHistory",
        back_populates="workflow",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    # ── Table constraints & indexes ───────────────────────────────────
    __table_args__ = (
        CheckConstraint(
            "status IN ('RUNNING', 'PAUSED', 'COMPLETED', 'FAILED')",
            name="ck_wf_status",
        ),
        Index("idx_wf_status", "status", "started_at"),
    )

    def __repr__(self) -> str:
        return (
            f"<WorkflowHistory(run_id={self.workflow_run_id!r}, "
            f"status={self.status!r})>"
        )
