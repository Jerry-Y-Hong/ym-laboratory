"""
KnowledgeAsset Model
=====================
Maps to ``knowledge_assets`` table (ACPP_DATABASE_SCHEMA §2.1).
Core SSOT structured knowledge asset metadata.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import CheckConstraint, Index, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from acpp.db.base import Base, SoftDeleteMixin, TimestampMixin

if TYPE_CHECKING:
    from acpp.models.repository_index import RepositoryIndex
    from acpp.models.version_history import VersionHistory
    from acpp.models.tag import Tag


class KnowledgeAsset(Base, TimestampMixin, SoftDeleteMixin):
    """
    Canonical, domain-agnostic knowledge node.

    Corresponds to a structured asset in ``repository/structured/``.
    """

    __tablename__ = "knowledge_assets"

    # ── Primary Key ───────────────────────────────────────────────────
    asset_id: Mapped[str] = mapped_column(String(64), primary_key=True)

    # ── Core Fields ───────────────────────────────────────────────────
    qcode: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False, index=True
    )
    domain_code: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[str] = mapped_column(String(16), nullable=False, default="v1.0.0")
    author_agent_id: Mapped[str] = mapped_column(String(32), nullable=False)
    verification_score: Mapped[float] = mapped_column(
        Numeric(3, 2), nullable=False, default=0.0
    )
    security_level: Mapped[str] = mapped_column(
        String(16), nullable=False, default="PUBLIC"
    )
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category_id: Mapped[Optional[str]] = mapped_column(
        String(64), nullable=True, index=True
    )

    # ── Relationships ─────────────────────────────────────────────────
    repository_indices: Mapped[List["RepositoryIndex"]] = relationship(
        "RepositoryIndex",
        back_populates="knowledge_asset",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    version_histories: Mapped[List["VersionHistory"]] = relationship(
        "VersionHistory",
        back_populates="knowledge_asset",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    tags: Mapped[List["Tag"]] = relationship(
        "Tag",
        back_populates="knowledge_asset",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    # ── Table constraints & indexes ───────────────────────────────────
    __table_args__ = (
        CheckConstraint(
            "verification_score >= 0.00 AND verification_score <= 1.00",
            name="ck_ka_verification_range",
        ),
        CheckConstraint(
            "security_level IN ('PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL')",
            name="ck_ka_security_level",
        ),
        Index("idx_ka_domain_qcode", "domain_code", "qcode"),
    )

    def __repr__(self) -> str:
        return (
            f"<KnowledgeAsset(asset_id={self.asset_id!r}, "
            f"qcode={self.qcode!r}, domain={self.domain_code!r})>"
        )
