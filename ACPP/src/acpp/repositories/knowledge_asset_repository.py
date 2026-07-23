"""
KnowledgeAsset Repository
==========================
Domain-specific repository for KnowledgeAsset CRUD with
search across title, qcode, and domain_code fields.
"""

from __future__ import annotations

from typing import Sequence

from acpp.models.knowledge_asset import KnowledgeAsset
from acpp.repositories.base_repository import BaseRepository, PaginatedResult


class KnowledgeAssetRepository(BaseRepository[KnowledgeAsset]):
    """Repository for KnowledgeAsset entities."""

    model = KnowledgeAsset

    def get_by_asset_id(self, asset_id: str) -> KnowledgeAsset | None:
        """Lookup by canonical asset_id (e.g. 'KA-KIMCHI-001')."""
        results = self.filter_by(asset_id=asset_id)
        return results[0] if results else None

    def get_by_qcode(self, qcode: str) -> KnowledgeAsset | None:
        """Lookup by Q-Code (e.g. 'Q-KIM-FERM-042')."""
        results = self.filter_by(qcode=qcode)
        return results[0] if results else None

    def find_by_domain(
        self,
        domain_code: str,
        *,
        page: int = 1,
        page_size: int = 20,
    ) -> PaginatedResult[KnowledgeAsset]:
        """Return all assets belonging to a specific domain."""
        return self.paginate(
            page=page,
            page_size=page_size,
            filters={"domain_code": domain_code},
            order_by="created_at",
            order_dir="desc",
        )

    def search_assets(
        self,
        query: str,
        *,
        page: int = 1,
        page_size: int = 20,
    ) -> PaginatedResult[KnowledgeAsset]:
        """Search across title, qcode, and domain_code."""
        return self.search(
            query,
            search_columns=["title", "qcode", "domain_code"],
            page=page,
            page_size=page_size,
        )

    def get_verified_assets(
        self, min_score: float = 0.90
    ) -> Sequence[KnowledgeAsset]:
        """Return assets with verification score above threshold."""
        from sqlalchemy import select

        stmt = self._base_query().where(
            KnowledgeAsset.verification_score >= min_score
        )
        return self.session.execute(stmt).scalars().all()
