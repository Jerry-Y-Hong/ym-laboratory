"""
RepositoryIndex Model
======================
Maps to ``repository_index`` table (ACPP_DATABASE_SCHEMA §2.2).
Vector embeddings and search indexing keys.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from acpp.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from acpp.models.knowledge_asset import KnowledgeAsset


class RepositoryIndex(Base, TimestampMixin):
    """
    Stores vector embeddings and chunked text for semantic search.

    NOTE: The ``embedding`` column is typed as Text for SQLite compatibility.
    In PostgreSQL production, use ``pgvector`` with ``vector(3072)``.
    """

    __tablename__ = "repository_index"

    # ── Primary Key ───────────────────────────────────────────────────
    index_id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: str(uuid.uuid4())
    )

    # ── Foreign Keys ──────────────────────────────────────────────────
    asset_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("knowledge_assets.asset_id", ondelete="CASCADE"),
        nullable=False,
    )

    # ── Core Fields ───────────────────────────────────────────────────
    qcode: Mapped[str] = mapped_column(String(64), nullable=False)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True, doc="JSON-serialized float vector (3072-dim)"
    )

    # ── Relationships ─────────────────────────────────────────────────
    knowledge_asset: Mapped["KnowledgeAsset"] = relationship(
        "KnowledgeAsset", back_populates="repository_indices"
    )

    # ── Table constraints ─────────────────────────────────────────────
    __table_args__ = (
        Index("idx_repo_index_asset", "asset_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<RepositoryIndex(index_id={self.index_id!r}, "
            f"asset_id={self.asset_id!r}, chunk={self.chunk_index})>"
        )
