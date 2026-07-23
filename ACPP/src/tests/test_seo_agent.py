"""
SEO Agent Unit Tests
====================
Tests for SEOAgent (ACPP-AG-04) readability calculation, keyword density analysis,
OpenGraph metadata, and Schema.org Article JSON-LD generation.
"""

from acpp.agents.seo_agent import SEOAgent
from acpp.schemas.seo import SEOOptimizationRequest


def test_readability_calculation():
    agent = SEOAgent()
    text = (
        "Lactobacillus plantarum is a widespread member of the genus Lactobacillus. "
        "It is commonly found in many fermented food products including kimchi. "
        "The bacteria produces lactic acid which preserves the vegetables."
    )

    result = agent.calculate_readability_score(text)

    assert "flesch_score" in result
    assert 0.0 <= result["flesch_score"] <= 100.0
    assert result["total_words"] > 10
    assert result["total_sentences"] == 3


def test_keyword_analysis():
    agent = SEOAgent()
    text = "Kimchi fermentation involves probiotics and kimchi bacteria strains."
    keywords = ["kimchi", "fermentation", "probiotics"]

    result = agent.analyze_keywords(text, keywords)

    assert result["primary_keyword"] == "kimchi"
    assert result["keyword_metrics"]["kimchi"]["count"] == 2
    assert result["keyword_metrics"]["fermentation"]["count"] == 1


def test_meta_description_generation():
    agent = SEOAgent()
    long_text = "Word " * 100
    meta_desc = agent.generate_meta_description(long_text, max_length=160)

    assert len(meta_desc) <= 160
    assert meta_desc.endswith("...")


def test_json_ld_schema_generation():
    agent = SEOAgent()
    schema = agent.generate_json_ld_schema(
        title="Kimchi Fermentation Optimization",
        description="Empirical study of kimchi fermentation.",
        keywords=["kimchi", "fermentation"],
        q_code="Q-KIM-FERM-001",
        source_id="KA-KIMCHI-20260723-001",
    )

    assert schema["@context"] == "https://schema.org"
    assert schema["@type"] == "Article"
    assert schema["headline"] == "Kimchi Fermentation Optimization"
    assert schema["identifier"] == "Q-KIM-FERM-001"
    assert schema["citation"] == "urn:acpp:knowledge:KA-KIMCHI-20260723-001"


def test_optimize_content_full():
    agent = SEOAgent()
    content_asset = {
        "title": "Empirical Kimchi Fermentation Dynamics",
        "body": "Comprehensive research on Leuconostoc mesenteroides and Lactobacillus plantarum kinetics in kimchi.",
    }
    req = SEOOptimizationRequest(
        content_asset_id="KA-KIMCHI-20260723-001",
        q_code="Q-KIM-FERM-001",
        target_keywords=["kimchi", "fermentation"],
    )

    res = agent.optimize_content(content_asset, req)

    assert res["optimized_asset_id"].startswith("SEO-")
    assert res["seo_score"] > 0.0
    assert res["metadata"].canonical_url == "https://acpp.ym-lab.io/content/KA-KIMCHI-20260723-001"
    assert res["metadata"].json_ld["@type"] == "Article"
