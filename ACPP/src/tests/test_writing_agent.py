"""
Writing Agent Unit Tests
========================
Tests for WritingAgent (ACPP-AG-03) multi-channel content generation,
Q-Code reference preservation, and metadata traceability.
"""

from acpp.agents.writing_agent import WritingAgent
from acpp.schemas.writing import WritingRequest


def test_writing_agent_all_channels():
    agent = WritingAgent()
    asset = {
        "title": "Kimchi Fermentation Microorganisms",
        "summary": "Analysis of Leuconostoc mesenteroides and Lactobacillus plantarum kinetics.",
        "claims": [
            {
                "claim_id": "CLM-001",
                "statement": "Lactobacillus plantarum dominates late-stage fermentation at 18 deg C.",
                "confidence_score": 0.95,
                "citation_url": "https://ncbi.nlm.nih.gov/articles/PMC001",
            }
        ],
    }

    req = WritingRequest(
        knowledge_asset_id="KA-KIMCHI-20260723-001",
        q_code="Q-KIM-FERM-001",
        content_type="all",
        target_audience="GENERAL_PUBLIC",
        language="EN",
        tone="PROFESSIONAL",
    )

    content_package = agent.generate_content(asset, req)

    assert len(content_package) == 5
    asset_types = {a.asset_type for a in content_package}
    assert asset_types == {"blog", "html", "newsletter", "social", "technical_brief"}

    for item in content_package:
        assert item.metadata["q_code"] == "Q-KIM-FERM-001"
        assert item.metadata["source_asset_id"] == "KA-KIMCHI-20260723-001"
        assert item.metadata["agent_id"] == "ACPP-AG-03"
        assert "Q-KIM-FERM-001" in item.body
        assert "KA-KIMCHI-20260723-001" in item.body


def test_writing_agent_single_channel_blog():
    agent = WritingAgent()
    asset = {
        "title": "Kimchi Probiotics Study",
        "summary": "Probiotic strain vitality evaluation.",
        "claims": [],
    }

    req = WritingRequest(
        knowledge_asset_id="KA-KIMCHI-20260723-002",
        q_code="Q-KIM-PRO-001",
        content_type="blog",
    )

    package = agent.generate_content(asset, req)

    assert len(package) == 1
    blog_asset = package[0]
    assert blog_asset.asset_type == "blog"
    assert "Blog Post: Kimchi Probiotics Study" in blog_asset.title
    assert "# Kimchi Probiotics Study" in blog_asset.body
    assert "Q-KIM-PRO-001" in blog_asset.body


def test_writing_agent_html_and_technical_brief():
    agent = WritingAgent()
    asset = {
        "title": "Technical Assay",
        "summary": "Assay parameters for fermentation.",
        "claims": [],
    }

    req = WritingRequest(
        knowledge_asset_id="KA-KIMCHI-20260723-003",
        q_code="Q-KIM-TECH-001",
        content_type="technical_brief",
    )

    tb = agent.generate_technical_brief(asset, req)
    assert tb.asset_type == "technical_brief"
    assert "TECHNICAL BRIEF:" in tb.body
    assert "Q-KIM-TECH-001" in tb.body

    html_asset = agent.generate_html_content(asset, req)
    assert html_asset.asset_type == "html"
    assert "<!DOCTYPE html>" in html_asset.body
    assert "meta name=\"qcode\" content=\"Q-KIM-TECH-001\"" in html_asset.body
