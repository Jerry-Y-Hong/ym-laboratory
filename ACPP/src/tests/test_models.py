"""
Test: Model Validation
=======================
Verifies model creation, defaults, constraints, and relationships.
"""

import uuid
from datetime import datetime, timezone, timedelta

import pytest

from acpp.models import (
    KnowledgeAsset,
    RepositoryIndex,
    WorkflowHistory,
    AgentExecution,
    ApprovalRecord,
    PublishingHistory,
    AnalyticsMetric,
    VersionHistory,
    AuditTrail,
    Category,
    Tag,
)

from tests.conftest import make_knowledge_asset, make_workflow, make_category


class TestKnowledgeAssetModel:
    """Verify KnowledgeAsset model behavior."""

    def test_create_asset(self, session):
        asset = make_knowledge_asset()
        session.add(asset)
        session.flush()

        fetched = session.get(KnowledgeAsset, asset.asset_id)
        assert fetched is not None
        assert fetched.qcode == asset.qcode
        assert fetched.domain_code == "TEST"
        assert fetched.version == "v1.0.0"
        assert fetched.security_level == "PUBLIC"

    def test_soft_delete(self, session):
        asset = make_knowledge_asset()
        session.add(asset)
        session.flush()

        assert asset.is_deleted is False
        asset.is_deleted = True
        asset.deleted_at = datetime.now(timezone.utc)
        session.flush()

        fetched = session.get(KnowledgeAsset, asset.asset_id)
        assert fetched.is_deleted is True
        assert fetched.deleted_at is not None

    def test_unique_qcode(self, session):
        """Duplicate qcodes should raise an IntegrityError."""
        from sqlalchemy.exc import IntegrityError

        asset1 = make_knowledge_asset(qcode="Q-UNIQUE-001")
        asset2 = make_knowledge_asset(qcode="Q-UNIQUE-001")
        session.add(asset1)
        session.flush()
        session.add(asset2)
        with pytest.raises(IntegrityError):
            session.flush()

    def test_tags_relationship(self, session):
        asset = make_knowledge_asset()
        tag = Tag(
            tag_id=str(uuid.uuid4()),
            asset_id=asset.asset_id,
            name="fermentation",
        )
        asset.tags.append(tag)
        session.add(asset)
        session.flush()

        fetched = session.get(KnowledgeAsset, asset.asset_id)
        assert len(fetched.tags) == 1
        assert fetched.tags[0].name == "fermentation"


class TestWorkflowHistoryModel:
    """Verify WorkflowHistory model behavior."""

    def test_create_workflow(self, session):
        wf = make_workflow()
        session.add(wf)
        session.flush()

        fetched = session.get(WorkflowHistory, wf.workflow_run_id)
        assert fetched is not None
        assert fetched.status == "RUNNING"
        assert fetched.tenant_id == "tenant-default"

    def test_agent_execution_relationship(self, session):
        wf = make_workflow()
        session.add(wf)
        session.flush()

        agent_log = AgentExecution(
            log_id=str(uuid.uuid4()),
            workflow_run_id=wf.workflow_run_id,
            agent_id="ACPP-AG-01",
            action_name="research_web",
            log_level="INFO",
            message="Fetched 12 URLs",
            execution_time_ms=1500,
        )
        session.add(agent_log)
        session.flush()

        fetched = session.get(WorkflowHistory, wf.workflow_run_id)
        assert len(fetched.agent_executions) == 1
        assert fetched.agent_executions[0].agent_id == "ACPP-AG-01"


class TestCategoryModel:
    """Verify Category model behavior."""

    def test_create_category(self, session):
        cat = make_category()
        session.add(cat)
        session.flush()

        fetched = session.get(Category, cat.category_id)
        assert fetched is not None
        assert fetched.domain_code == "TEST"

    def test_hierarchical_parent(self, session):
        parent = make_category(name="Parent")
        session.add(parent)
        session.flush()

        child = make_category(name="Child", parent_id=parent.category_id)
        session.add(child)
        session.flush()

        fetched = session.get(Category, child.category_id)
        assert fetched.parent_id == parent.category_id


class TestVersionHistoryModel:
    """Verify VersionHistory model behavior."""

    def test_create_version_entry(self, session):
        asset = make_knowledge_asset()
        session.add(asset)
        session.flush()

        vh = VersionHistory(
            version_id=str(uuid.uuid4()),
            asset_id=asset.asset_id,
            previous_version="v1.0.0",
            new_version="v1.1.0",
            change_summary="Added fermentation temperature data",
            modified_by_agent_id="ACPP-AG-02",
        )
        session.add(vh)
        session.flush()

        fetched = session.get(KnowledgeAsset, asset.asset_id)
        assert len(fetched.version_histories) == 1
        assert fetched.version_histories[0].new_version == "v1.1.0"


class TestAuditTrailModel:
    """Verify AuditTrail append-only behavior."""

    def test_create_audit_entry(self, session):
        audit = AuditTrail(
            audit_id=str(uuid.uuid4()),
            event_type="ASSET_CREATED",
            actor_id="ACPP-AG-02",
            target_resource_id="KA-TEST-001",
            payload_sha256="a" * 64,
            previous_audit_hash="0" * 64,
        )
        session.add(audit)
        session.flush()

        fetched = session.get(AuditTrail, audit.audit_id)
        assert fetched is not None
        assert fetched.event_type == "ASSET_CREATED"
