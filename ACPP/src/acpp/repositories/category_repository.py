"""
Category Repository
====================
Domain-specific repository for Category CRUD with
hierarchical tree queries.
"""

from __future__ import annotations

from typing import Sequence

from acpp.models.category import Category
from acpp.repositories.base_repository import BaseRepository


class CategoryRepository(BaseRepository[Category]):
    """Repository for Category entities."""

    model = Category

    def get_root_categories(self, domain_code: str) -> Sequence[Category]:
        """Return top-level categories (no parent) for a domain."""
        return self.filter_by(domain_code=domain_code, parent_id=None)

    def get_children(self, parent_id: str) -> Sequence[Category]:
        """Return direct children of a category."""
        return self.filter_by(parent_id=parent_id)
