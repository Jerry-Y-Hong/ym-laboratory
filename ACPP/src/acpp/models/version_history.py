"""
VersionHistory Model
=====================
Maps to ``version_control_history`` table (ACPP_DATABASE_SCHEMA §2.8).
Knowledge asset delta tracking.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from acpp.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from acpp.models.knowledge_asset import KnowledgeAsset


class VersionHistory(Base, TimestampMixin):
    """
    Tracks version increments and structural edits to
    ``structured/`` knowledge assets.
    """

    __tablename__ = "version_control_history"

    # ── Primary Key ───────────────────────────────────────────────────
    version_id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: str(uuid.uuid4())
    )

    # ── Foreign Keys ──────────────────────────────────────────────────
    asset_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("knowledge_assets.asset_id", ondelete="CASCADE"),
        nullable=False,
    )

    # ── Core Fields ───────────────────────────────────────────────────
    previous_version: Mapped[str] = mapped_column(String(16), nullable=False)
    new_version: Mapped[str] = mapped_column(String(16), nullable=False)
    change_summary: Mapped[str] = mapped_column(Text, nullable=False)
    modified_by_agent_id: Mapped[str] = mapped_column(String(32), nullable=False)

    # ── Relationships ─────────────────────────────────────────────────
    knowledge_asset: Mapped["KnowledgeAsset"] = relationship(
        "KnowledgeAsset", back_populates="version_histories"
    )

    def __repr__(self) -> str:
        return (
            f"<VersionHistory(version_id={self.version_id!r}, "
            f"asset={self.asset_id!r}, "
            f"{self.previous_version} -> {self.new_version})>"
        )
