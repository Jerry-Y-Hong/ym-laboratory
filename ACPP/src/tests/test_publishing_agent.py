"""
Publishing Agent Unit Tests
===========================
Tests for PublishingAgent (ACPP-AG-06), HumanGateVerifier AEGS token validation,
unauthorized publishing blocking, CMS/Social gateway adapters, and audit recording.
"""

import pytest

from acpp.agents.publishing_agent import PublishingAgent
from acpp.core.exceptions import ApprovalRequiredError
from acpp.governance.human_gate import HumanGateVerifier
from acpp.publishing.cms_adapter import CMSPublishingAdapter
from acpp.publishing.social_adapter import SocialPublishingAdapter


def test_human_gate_verifier_token_validation():
    verifier = HumanGateVerifier()

    assert verifier.validate_token("HA-TOKEN-2026-OK")
    assert verifier.validate_token("HA-TOKEN-2026-TEST")
    assert not verifier.validate_token("INVALID-TOKEN")
    assert not verifier.validate_token("")


def test_publishing_agent_unauthorized_rejection():
    agent = PublishingAgent()

    with pytest.raises(ApprovalRequiredError) as exc_info:
        agent.verify_human_approval("INVALID-TOKEN-999")

    assert "Human Approval Token required" in exc_info.value.message


def test_cms_and_social_gateway_adapters():
    cms = CMSPublishingAdapter()
    social = SocialPublishingAdapter()

    assert cms.validate_channel("wordpress")
    assert cms.validate_channel("ghost")
    assert social.validate_channel("twitter")
    assert social.validate_channel("linkedin")

    pkg = {
        "content": {"title": "Test Title"},
        "metadata": {"source_asset_id": "KA-KIMCHI-20260723-001"},
    }

    cms_res = cms.publish(pkg, "wordpress")
    assert cms_res["status"] == "PUBLISHED"
    assert "https://blog.ym-lab.io/wordpress/posts/" in cms_res["published_url"]

    soc_res = social.publish(pkg, "twitter")
    assert soc_res["status"] == "PUBLISHED"
    assert "https://social.ym-lab.io/posts/" in soc_res["published_url"]


def test_publishing_agent_dispatch_full():
    agent = PublishingAgent()

    content_asset = {"title": "Kimchi Kinetics", "body": "Verified body text."}
    seo_asset = {"seo_title": "SEO Kimchi", "canonical_url": "https://example.com/kimchi"}
    media_manifest = {"images": []}
    approval_info = {"approval_token": "HA-TOKEN-2026-OK", "approved_by": "human_editor_01"}

    package = agent.create_publish_package(content_asset, seo_asset, media_manifest, approval_info)

    assert agent.validate_publish_requirements(package)
    assert package.approval_record.approval_status == "APPROVED"

    dispatch_res = agent.dispatch_content(package, "cms")
    assert dispatch_res["status"] == "PUBLISHED"
    assert "DISPATCH-CMS-" in dispatch_res["dispatch_id"]

    audit_rec = agent.create_publish_audit_record(dispatch_res)
    assert audit_rec["agent_id"] == "ACPP-AG-06"
    assert audit_rec["dispatch_id"] == dispatch_res["dispatch_id"]
