"""
AuditTrail Model
=================
Maps to ``audit_trail`` table (ACPP_DATABASE_SCHEMA §2.9).
Immutable global cryptographic audit bus.
"""

from __future__ import annotations

import uuid

from sqlalchemy import Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from acpp.db.base import Base, TimestampMixin


class AuditTrail(Base, TimestampMixin):
    """
    Stores cryptographic hashes (SHA-256) of all platform actions
    for zero-trust audit compliance under Phase 37 AEGS.

    This table is append-only. Records must never be updated or deleted.
    """

    __tablename__ = "audit_trail"

    # ── Primary Key ───────────────────────────────────────────────────
    audit_id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: str(uuid.uuid4())
    )

    # ── Core Fields ───────────────────────────────────────────────────
    event_type: Mapped[str] = mapped_column(String(64), nullable=False)
    actor_id: Mapped[str] = mapped_column(String(64), nullable=False)
    target_resource_id: Mapped[str] = mapped_column(String(64), nullable=False)
    payload_sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    previous_audit_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)

    # ── Table constraints ─────────────────────────────────────────────
    __table_args__ = (
        Index("idx_audit_event", "event_type"),
        Index("idx_audit_actor", "actor_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<AuditTrail(audit_id={self.audit_id!r}, "
            f"event={self.event_type!r})>"
        )
