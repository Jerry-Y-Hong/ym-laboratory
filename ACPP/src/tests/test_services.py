"""
Service Layer Unit Tests
========================
Tests KnowledgeService and RepositoryService directly without HTTP client context.
"""

import pytest

from acpp.core.exceptions import KnowledgeAssetNotFoundError, ValidationError
from acpp.schemas.knowledge import KnowledgeAssetCreate, KnowledgeAssetUpdate
from acpp.services.knowledge_service import KnowledgeService
from acpp.services.repository_service import RepositoryService


def test_knowledge_service_lifecycle(session):
    service = KnowledgeService(session)

    # 1. Create
    data = KnowledgeAssetCreate(
        asset_id="KA-SERVICE-01",
        qcode="Q-SVC-01",
        domain_code="SERVICE",
        title="Service Layer Test",
        file_path="repository/structured/KA-SERVICE-01.md",
    )
    asset = service.create_asset(data)
    assert asset.asset_id == "KA-SERVICE-01"

    # 2. Get by ID
    fetched = service.get_asset_by_id("KA-SERVICE-01")
    assert fetched.title == "Service Layer Test"

    # 3. Update
    updated = service.update_asset("KA-SERVICE-01", KnowledgeAssetUpdate(title="Updated Title"))
    assert updated.title == "Updated Title"

    # 4. List
    items, total, pages = service.list_assets(domain_code="SERVICE")
    assert total == 1
    assert len(items) == 1

    # 5. Delete
    deleted = service.delete_asset("KA-SERVICE-01")
    assert deleted is True

    # 6. Get deleted throws 404 exception
    with pytest.raises(KnowledgeAssetNotFoundError):
        service.get_asset_by_id("KA-SERVICE-01")


def test_knowledge_service_duplicate_id_rejection(session):
    service = KnowledgeService(session)
    data = KnowledgeAssetCreate(
        asset_id="KA-DUP-01",
        qcode="Q-DUP-01",
        domain_code="DUP",
        title="Duplicate Test",
        file_path="repository/structured/KA-DUP-01.md",
    )
    service.create_asset(data)

    # Duplicate create throws ValidationError
    with pytest.raises(ValidationError) as exc_info:
        service.create_asset(data)
    assert exc_info.value.code == "ACPP-ERR-4001"


def test_repository_service_status(session):
    repo_service = RepositoryService(session)
    status_info = repo_service.get_status()

    assert status_info["status"] == "ONLINE"
    assert status_info["database_connected"] is True
    assert isinstance(status_info["total_knowledge_assets"], int)
