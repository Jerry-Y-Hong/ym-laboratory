"""
Category Model
===============
Domain-level category for organizing knowledge assets.
Supports hierarchical (parent-child) category trees.
"""

from __future__ import annotations

import uuid
from typing import Optional

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from acpp.db.base import Base, SoftDeleteMixin, TimestampMixin


class Category(Base, TimestampMixin, SoftDeleteMixin):
    """
    Hierarchical category for organizing knowledge assets by domain.
    """

    __tablename__ = "categories"

    # ── Primary Key ───────────────────────────────────────────────────
    category_id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=lambda: str(uuid.uuid4())
    )

    # ── Core Fields ───────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    domain_code: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parent_id: Mapped[Optional[str]] = mapped_column(
        String(64),
        ForeignKey("categories.category_id"),
        nullable=True,
        index=True,
    )
    sort_order: Mapped[int] = mapped_column(default=0, nullable=False)

    def __repr__(self) -> str:
        return (
            f"<Category(id={self.category_id!r}, name={self.name!r}, "
            f"domain={self.domain_code!r})>"
        )
