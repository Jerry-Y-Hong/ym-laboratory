"""
KnowledgeService
=================
Business logic layer for Knowledge Asset lifecycle management.
Uses KnowledgeAssetRepository to interact with database.
"""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session

from acpp.core.exceptions import KnowledgeAssetNotFoundError, ValidationError, DatabaseError
from acpp.models.knowledge_asset import KnowledgeAsset
from acpp.repositories.knowledge_asset_repository import KnowledgeAssetRepository
from acpp.schemas.knowledge import KnowledgeAssetCreate, KnowledgeAssetUpdate


class KnowledgeService:
    """Service layer separating API endpoints from repository storage logic."""

    def __init__(self, session: Session) -> None:
        self.session = session
        self.repository = KnowledgeAssetRepository(session)

    def get_asset_by_id(self, asset_id: str) -> KnowledgeAsset:
        """Fetch asset by canonical asset_id or Q-Code."""
        asset = self.repository.get_by_asset_id(asset_id)
        if not asset:
            asset = self.repository.get_by_qcode(asset_id)
        if not asset or asset.is_deleted:
            raise KnowledgeAssetNotFoundError(asset_id)
        return asset

    def list_assets(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
        domain_code: Optional[str] = None,
        query: Optional[str] = None,
    ) -> Tuple[List[KnowledgeAsset], int, int]:
        """
        List knowledge assets with optional domain filter or keyword search.
        Returns (items, total_items, total_pages).
        """
        if query:
            result = self.repository.search_assets(query, page=page, page_size=page_size)
        elif domain_code:
            result = self.repository.find_by_domain(domain_code, page=page, page_size=page_size)
        else:
            result = self.repository.paginate(page=page, page_size=page_size, order_by="created_at", order_dir="desc")

        active_items = [item for item in result.items if not item.is_deleted]
        return active_items, result.total, result.total_pages

    def create_asset(self, data: KnowledgeAssetCreate) -> KnowledgeAsset:
        """Create a new KnowledgeAsset after business validation."""
        # 1. Validation: asset_id uniqueness
        existing_asset = self.repository.get_by_asset_id(data.asset_id)
        if existing_asset and not existing_asset.is_deleted:
            raise ValidationError(
                f"KnowledgeAsset with ID '{data.asset_id}' already exists.",
                details={"asset_id": data.asset_id},
            )

        # 2. Validation: qcode uniqueness
        existing_qcode = self.repository.get_by_qcode(data.qcode)
        if existing_qcode and not existing_qcode.is_deleted:
            raise ValidationError(
                f"KnowledgeAsset with Q-Code '{data.qcode}' already exists.",
                details={"qcode": data.qcode},
            )

        try:
            asset = KnowledgeAsset(
                asset_id=data.asset_id,
                qcode=data.qcode,
                domain_code=data.domain_code.upper(),
                title=data.title,
                version=data.version,
                author_agent_id=data.author_agent_id,
                verification_score=data.verification_score,
                security_level=data.security_level.upper(),
                file_path=data.file_path,
                summary=data.summary,
                category_id=data.category_id,
            )
            created_asset = self.repository.create(asset)
            self.session.commit()
            return created_asset
        except Exception as e:
            self.session.rollback()
            raise DatabaseError(f"Failed to create KnowledgeAsset: {str(e)}")

    def update_asset(self, asset_id: str, data: KnowledgeAssetUpdate) -> KnowledgeAsset:
        """Update an existing KnowledgeAsset."""
        asset = self.get_asset_by_id(asset_id)

        update_fields = data.model_dump(exclude_unset=True)
        if not update_fields:
            return asset

        try:
            for field, value in update_fields.items():
                if field == "security_level" and value:
                    value = value.upper()
                setattr(asset, field, value)

            self.session.commit()
            self.session.refresh(asset)
            return asset
        except Exception as e:
            self.session.rollback()
            raise DatabaseError(f"Failed to update KnowledgeAsset '{asset_id}': {str(e)}")

    def delete_asset(self, asset_id: str) -> bool:
        """Soft delete a KnowledgeAsset."""
        asset = self.get_asset_by_id(asset_id)
        try:
            self.repository.soft_delete(asset)
            self.session.commit()
            return True
        except Exception as e:
            self.session.rollback()
            raise DatabaseError(f"Failed to delete KnowledgeAsset '{asset_id}': {str(e)}")
