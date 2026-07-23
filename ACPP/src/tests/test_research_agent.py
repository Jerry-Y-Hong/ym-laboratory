"""
Research Agent Unit Tests
==========================
Tests for ResearchAgent core logic, SHA-256 hash computation,
and credibility scoring functions.
"""

from acpp.agents.research_agent import ResearchAgent
from acpp.schemas.research import ResearchIngestRequest


def test_sha256_computation():
    agent = ResearchAgent()
    content = "Sample raw research content for Kimchi fermentation."
    hash1 = agent.compute_sha256(content)
    hash2 = agent.compute_sha256(content)

    assert isinstance(hash1, str)
    assert len(hash1) == 64
    assert hash1 == hash2  # Deterministic hash


def test_credibility_scoring():
    agent = ResearchAgent()

    # Government / Academic domains with academic terms
    high_score = agent.score_credibility(
        "https://ncbi.nlm.nih.gov/pmc/articles/PMC12345",
        "Abstract: Empirical research study with DOI: 10.1000/182 and peer-reviewed methodology.",
    )
    assert high_score >= 0.85

    # General .com site
    lower_score = agent.score_credibility(
        "https://randomblog.com/kimchi",
        "Just a casual blog post about kimchi taste.",
    )
    assert lower_score < high_score


def test_execute_ingestion():
    agent = ResearchAgent()
    req = ResearchIngestRequest(
        query="Kimchi Probiotics",
        domain_code="KIMCHI",
        depth=1,
        max_sources=3,
        simulated=True,
    )

    payload = agent.execute_ingestion(req)

    assert payload["agent_id"] == "ACPP-AG-01"
    assert payload["query"] == "Kimchi Probiotics"
    assert payload["domain_code"] == "KIMCHI"
    assert payload["items_count"] == 3
    assert len(payload["items"]) == 3
    assert len(payload["provenance"]) == 3
    assert isinstance(payload["aggregate_sha256_provenance"], str)
    assert len(payload["aggregate_sha256_provenance"]) == 64
    assert payload["average_credibility"] > 0.0
