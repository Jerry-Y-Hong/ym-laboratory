"""
Generic Base Repository
========================
Implements the Repository Pattern with full CRUD, pagination,
filtering, search, and ordering support.  All entity-specific
repositories inherit from this class.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Generic, List, Optional, Sequence, Type, TypeVar

from sqlalchemy import Select, asc, desc, func, or_, select
from sqlalchemy.orm import Session

from acpp.db.base import Base, SoftDeleteMixin

T = TypeVar("T", bound=Base)


class PaginatedResult(Generic[T]):
    """Container for paginated query results."""

    def __init__(
        self,
        items: Sequence[T],
        total: int,
        page: int,
        page_size: int,
    ) -> None:
        self.items = items
        self.total = total
        self.page = page
        self.page_size = page_size
        self.total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0

    def __repr__(self) -> str:
        return (
            f"<PaginatedResult(page={self.page}/{self.total_pages}, "
            f"items={len(self.items)}, total={self.total})>"
        )


class BaseRepository(Generic[T]):
    """
    Generic repository providing CRUD + pagination + filtering.

    Usage::

        class AssetRepo(BaseRepository[KnowledgeAsset]):
            model = KnowledgeAsset

        repo = AssetRepo(session)
        asset = repo.get_by_id("KA-001")
    """

    model: Type[T]

    def __init__(self, session: Session) -> None:
        self.session = session

    # ── Create ────────────────────────────────────────────────────────
    def create(self, entity: T) -> T:
        """Add a new entity to the session and flush."""
        self.session.add(entity)
        self.session.flush()
        return entity

    def create_many(self, entities: List[T]) -> List[T]:
        """Bulk-create multiple entities."""
        self.session.add_all(entities)
        self.session.flush()
        return entities

    # ── Read ──────────────────────────────────────────────────────────
    def get_by_id(self, entity_id: Any) -> Optional[T]:
        """Fetch a single entity by primary key, respecting soft-delete."""
        stmt = self._base_query().where(self._pk_column() == entity_id)
        return self.session.execute(stmt).scalars().first()

    def get_all(
        self,
        *,
        include_deleted: bool = False,
    ) -> Sequence[T]:
        """Return all entities, optionally including soft-deleted."""
        stmt = self._base_query(include_deleted=include_deleted)
        return self.session.execute(stmt).scalars().all()

    def exists(self, entity_id: Any) -> bool:
        """Check if an entity with the given PK exists."""
        return self.get_by_id(entity_id) is not None

    # ── Update ────────────────────────────────────────────────────────
    def update(self, entity: T, **kwargs: Any) -> T:
        """
        Update an entity's attributes.

        Accepts keyword arguments mapping column names to new values.
        """
        for key, value in kwargs.items():
            if hasattr(entity, key):
                setattr(entity, key, value)
        self.session.flush()
        return entity

    # ── Delete ────────────────────────────────────────────────────────
    def soft_delete(self, entity: T) -> T:
        """
        Mark entity as deleted (soft-delete) if it supports it,
        otherwise hard-delete.
        """
        if isinstance(entity, SoftDeleteMixin):
            entity.is_deleted = True  # type: ignore[attr-defined]
            entity.deleted_at = datetime.now(timezone.utc)  # type: ignore[attr-defined]
            self.session.flush()
        else:
            self.hard_delete(entity)
        return entity

    def hard_delete(self, entity: T) -> None:
        """Permanently remove the entity from the database."""
        self.session.delete(entity)
        self.session.flush()

    # ── Pagination ────────────────────────────────────────────────────
    def paginate(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
        order_by: Optional[str] = None,
        order_dir: str = "asc",
        include_deleted: bool = False,
        filters: Optional[dict[str, Any]] = None,
    ) -> PaginatedResult[T]:
        """
        Return a paginated result set with optional column-based filtering.

        Parameters
        ----------
        page : int
            Page number (1-indexed).
        page_size : int
            Number of items per page.
        order_by : str | None
            Column name to sort by.
        order_dir : str
            ``"asc"`` or ``"desc"``.
        include_deleted : bool
            Whether to include soft-deleted records.
        filters : dict | None
            Column-value pairs to filter by (exact match).
        """
        stmt = self._base_query(include_deleted=include_deleted)
        stmt = self._apply_filters(stmt, filters)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total: int = self.session.execute(count_stmt).scalar() or 0

        # Order
        if order_by and hasattr(self.model, order_by):
            col = getattr(self.model, order_by)
            stmt = stmt.order_by(desc(col) if order_dir == "desc" else asc(col))

        # Paginate
        offset = (max(page, 1) - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        items = self.session.execute(stmt).scalars().all()
        return PaginatedResult(items=items, total=total, page=page, page_size=page_size)

    # ── Search ────────────────────────────────────────────────────────
    def search(
        self,
        query: str,
        search_columns: Optional[List[str]] = None,
        *,
        page: int = 1,
        page_size: int = 20,
    ) -> PaginatedResult[T]:
        """
        Full-text-like search across specified columns.

        Uses SQL ``LIKE`` with ``%query%`` pattern matching.
        """
        stmt = self._base_query()
        if search_columns and query:
            conditions = []
            for col_name in search_columns:
                if hasattr(self.model, col_name):
                    col = getattr(self.model, col_name)
                    conditions.append(col.ilike(f"%{query}%"))
            if conditions:
                stmt = stmt.where(or_(*conditions))

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total: int = self.session.execute(count_stmt).scalar() or 0

        offset = (max(page, 1) - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)
        items = self.session.execute(stmt).scalars().all()
        return PaginatedResult(items=items, total=total, page=page, page_size=page_size)

    # ── Filter ────────────────────────────────────────────────────────
    def filter_by(self, include_deleted: bool = False, **kwargs: Any) -> Sequence[T]:
        """Return entities matching all keyword-argument filters."""
        stmt = self._base_query(include_deleted=include_deleted)
        stmt = self._apply_filters(stmt, kwargs)
        return self.session.execute(stmt).scalars().all()

    # ── Count ─────────────────────────────────────────────────────────
    def count(self, *, include_deleted: bool = False) -> int:
        """Return the total number of entities."""
        stmt = self._base_query(include_deleted=include_deleted)
        count_stmt = select(func.count()).select_from(stmt.subquery())
        return self.session.execute(count_stmt).scalar() or 0

    # ── Internal helpers ──────────────────────────────────────────────
    def _base_query(self, include_deleted: bool = False) -> Select:  # type: ignore[type-arg]
        """Build the base SELECT, optionally filtering soft-deleted rows."""
        stmt = select(self.model)
        if not include_deleted and issubclass(self.model, SoftDeleteMixin):
            stmt = stmt.where(self.model.is_deleted == False)  # noqa: E712
        return stmt

    def _pk_column(self) -> Any:
        """Return the primary key column of the model."""
        pk_cols = self.model.__table__.primary_key.columns  # type: ignore[attr-defined]
        return list(pk_cols)[0]

    def _apply_filters(
        self, stmt: Select, filters: Optional[dict[str, Any]]  # type: ignore[type-arg]
    ) -> Select:  # type: ignore[type-arg]
        """Apply column=value equality filters to a SELECT statement."""
        if filters:
            for col_name, value in filters.items():
                if hasattr(self.model, col_name):
                    stmt = stmt.where(getattr(self.model, col_name) == value)
        return stmt
