"""
ACPP Declarative Base & Common Mixins
======================================
Defines the SQLAlchemy declarative base and common column mixins
used by all ACPP models (timestamps, soft delete, UUID PKs).
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def _utcnow() -> datetime:
    """Return timezone-aware UTC now."""
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    """
    Root declarative base for all ACPP ORM models.

    Provides:
    - Type annotation map (auto-registered by SQLAlchemy 2.x)
    """

    pass


class TimestampMixin:
    """
    Mixin that adds created_at / updated_at UTC timestamps to a model.
    Both columns are timezone-aware and auto-populated.
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_utcnow,
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=_utcnow,
        server_default=func.now(),
        onupdate=_utcnow,
        nullable=False,
    )


class SoftDeleteMixin:
    """
    Mixin for soft-delete support.
    Records are marked `is_deleted = True` instead of being physically removed.
    """

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default="false",
        nullable=False,
        index=True,
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        default=None,
        nullable=True,
    )


class UUIDPrimaryKeyMixin:
    """
    Mixin that generates a UUID4 primary key as a string column.
    """

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
