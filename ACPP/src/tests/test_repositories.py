"""
Test: Repository Layer (CRUD, Pagination, Search, Filtering)
=============================================================
Verifies the BaseRepository and entity-specific repositories.
"""

import uuid
from datetime import datetime, timezone

import pytest

from acpp.models import KnowledgeAsset, WorkflowHistory, Category
from acpp.repositories.base_repository import BaseRepository, PaginatedResult
from acpp.repositories.knowledge_asset_repository import KnowledgeAssetRepository
from acpp.repositories.workflow_repository import WorkflowRepository
from acpp.repositories.category_repository import CategoryRepository

from tests.conftest import make_knowledge_asset, make_workflow, make_category


# ── BaseRepository via KnowledgeAsset ─────────────────────────────────


class TestBaseRepositoryCRUD:
    """Test generic CRUD operations via BaseRepository."""

    def test_create_and_get_by_id(self, session):
        repo = KnowledgeAssetRepository(session)
        asset = make_knowledge_asset()
        created = repo.create(asset)

        fetched = repo.get_by_id(created.asset_id)
        assert fetched is not None
        assert fetched.asset_id == created.asset_id

    def test_get_all(self, session):
        repo = KnowledgeAssetRepository(session)
        for _ in range(3):
            repo.create(make_knowledge_asset())

        all_items = repo.get_all()
        assert len(all_items) >= 3

    def test_update(self, session):
        repo = KnowledgeAssetRepository(session)
        asset = make_knowledge_asset()
        repo.create(asset)

        repo.update(asset, title="Updated Title", version="v2.0.0")
        fetched = repo.get_by_id(asset.asset_id)
        assert fetched.title == "Updated Title"
        assert fetched.version == "v2.0.0"

    def test_soft_delete(self, session):
        repo = KnowledgeAssetRepository(session)
        asset = make_knowledge_asset()
        repo.create(asset)

        repo.soft_delete(asset)

        # Should NOT appear in default query
        fetched = repo.get_by_id(asset.asset_id)
        assert fetched is None

        # Should appear when include_deleted=True
        all_items = repo.get_all(include_deleted=True)
        deleted_ids = [a.asset_id for a in all_items if a.is_deleted]
        assert asset.asset_id in deleted_ids

    def test_hard_delete(self, session):
        repo = KnowledgeAssetRepository(session)
        asset = make_knowledge_asset()
        repo.create(asset)
        aid = asset.asset_id

        repo.hard_delete(asset)

        # Gone entirely
        all_items = repo.get_all(include_deleted=True)
        assert aid not in [a.asset_id for a in all_items]

    def test_exists(self, session):
        repo = KnowledgeAssetRepository(session)
        asset = make_knowledge_asset()
        repo.create(asset)

        assert repo.exists(asset.asset_id) is True
        assert repo.exists("nonexistent-id") is False

    def test_count(self, session):
        repo = KnowledgeAssetRepository(session)
        initial = repo.count()
        for _ in range(5):
            repo.create(make_knowledge_asset())

        assert repo.count() == initial + 5

    def test_create_many(self, session):
        repo = KnowledgeAssetRepository(session)
        assets = [make_knowledge_asset() for _ in range(4)]
        created = repo.create_many(assets)
        assert len(created) == 4


class TestPagination:
    """Test pagination functionality."""

    def test_paginate_defaults(self, session):
        repo = KnowledgeAssetRepository(session)
        for _ in range(25):
            repo.create(make_knowledge_asset())

        result = repo.paginate(page=1, page_size=10)
        assert isinstance(result, PaginatedResult)
        assert len(result.items) == 10
        assert result.total >= 25
        assert result.page == 1
        assert result.page_size == 10
        assert result.total_pages >= 3

    def test_paginate_second_page(self, session):
        repo = KnowledgeAssetRepository(session)
        for _ in range(15):
            repo.create(make_knowledge_asset())

        page1 = repo.paginate(page=1, page_size=10)
        page2 = repo.paginate(page=2, page_size=10)

        # Different items
        ids_p1 = {a.asset_id for a in page1.items}
        ids_p2 = {a.asset_id for a in page2.items}
        assert ids_p1.isdisjoint(ids_p2)

    def test_paginate_with_filter(self, session):
        repo = KnowledgeAssetRepository(session)
        for _ in range(5):
            repo.create(make_knowledge_asset(domain_code="KIMCHI"))
        for _ in range(3):
            repo.create(make_knowledge_asset(domain_code="PATENT"))

        result = repo.paginate(
            page=1,
            page_size=20,
            filters={"domain_code": "KIMCHI"},
        )
        assert all(a.domain_code == "KIMCHI" for a in result.items)
        assert result.total >= 5


class TestSearch:
    """Test search functionality."""

    def test_search_by_title(self, session):
        repo = KnowledgeAssetRepository(session)
        repo.create(make_knowledge_asset(title="Kimchi Fermentation Science"))
        repo.create(make_knowledge_asset(title="Patent Filing Process"))

        result = repo.search_assets("Fermentation")
        assert result.total >= 1
        assert any("Fermentation" in a.title for a in result.items)

    def test_search_no_results(self, session):
        repo = KnowledgeAssetRepository(session)
        result = repo.search_assets("xyznonexistent")
        assert result.total == 0


class TestFilterBy:
    """Test filter_by functionality."""

    def test_filter_by_domain(self, session):
        repo = KnowledgeAssetRepository(session)
        repo.create(make_knowledge_asset(domain_code="SMART_FARM"))
        repo.create(make_knowledge_asset(domain_code="SMART_FARM"))

        results = repo.filter_by(domain_code="SMART_FARM")
        assert len(results) >= 2
        assert all(a.domain_code == "SMART_FARM" for a in results)


# ── Entity-specific repositories ─────────────────────────────────────


class TestKnowledgeAssetRepository:
    """Test domain-specific KnowledgeAsset queries."""

    def test_get_by_qcode(self, session):
        repo = KnowledgeAssetRepository(session)
        asset = make_knowledge_asset(qcode="Q-KIM-FERM-099")
        repo.create(asset)

        fetched = repo.get_by_qcode("Q-KIM-FERM-099")
        assert fetched is not None
        assert fetched.qcode == "Q-KIM-FERM-099"

    def test_find_by_domain(self, session):
        repo = KnowledgeAssetRepository(session)
        for _ in range(3):
            repo.create(make_knowledge_asset(domain_code="MFCO"))

        result = repo.find_by_domain("MFCO")
        assert result.total >= 3

    def test_get_verified_assets(self, session):
        repo = KnowledgeAssetRepository(session)
        repo.create(make_knowledge_asset(verification_score=0.99))
        repo.create(make_knowledge_asset(verification_score=0.50))

        verified = repo.get_verified_assets(min_score=0.90)
        assert all(a.verification_score >= 0.90 for a in verified)


class TestWorkflowRepository:
    """Test domain-specific Workflow queries."""

    def test_find_running(self, session):
        repo = WorkflowRepository(session)
        repo.create(make_workflow(status="RUNNING"))
        repo.create(make_workflow(status="COMPLETED"))

        result = repo.find_running()
        assert all(w.status == "RUNNING" for w in result.items)

    def test_find_failed(self, session):
        repo = WorkflowRepository(session)
        repo.create(make_workflow(status="FAILED"))

        result = repo.find_failed()
        assert result.total >= 1


class TestCategoryRepository:
    """Test domain-specific Category queries."""

    def test_get_root_categories(self, session):
        repo = CategoryRepository(session)
        repo.create(make_category(domain_code="KIMCHI", parent_id=None))

        roots = repo.get_root_categories("KIMCHI")
        assert len(roots) >= 1
        assert all(c.parent_id is None for c in roots)

    def test_get_children(self, session):
        repo = CategoryRepository(session)
        parent = make_category(name="Parent")
        repo.create(parent)

        child = make_category(name="Child", parent_id=parent.category_id)
        repo.create(child)

        children = repo.get_children(parent.category_id)
        assert len(children) == 1
        assert children[0].name == "Child"
