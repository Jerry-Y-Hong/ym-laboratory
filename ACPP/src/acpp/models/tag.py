"""
Tag Model
==========
Free-form tagging for knowledge assets.
Many-to-one relationship with KnowledgeAsset.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from acpp.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from acpp.models.knowledge_asset import KnowledgeAsset


class Tag(Base, TimestampMixin):
    """
    A free-form tag attached to a knowledge asset for
    cross-domain discoverability and entity linking.
    """

    __tablename__ = "tags"

    # ── Primary Key ───────────────────────────────────────────────────
    tag_id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: str(uuid.uuid4())
    )

    # ── Foreign Keys ──────────────────────────────────────────────────
    asset_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("knowledge_assets.asset_id", ondelete="CASCADE"),
        nullable=False,
    )

    # ── Core Fields ───────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(String(128), nullable=False)

    # ── Relationships ─────────────────────────────────────────────────
    knowledge_asset: Mapped["KnowledgeAsset"] = relationship(
        "KnowledgeAsset", back_populates="tags"
    )

    # ── Table constraints ─────────────────────────────────────────────
    __table_args__ = (
        Index("idx_tag_name", "name"),
        Index("idx_tag_asset", "asset_id"),
    )

    def __repr__(self) -> str:
        return f"<Tag(tag_id={self.tag_id!r}, name={self.name!r})>"
