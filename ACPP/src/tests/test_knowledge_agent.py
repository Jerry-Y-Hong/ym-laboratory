"""
Knowledge Agent Unit Tests
===========================
Tests for KnowledgeAgent (ACPP-AG-02) Q-Code generation, vector embeddings,
claim extraction, and Markdown frontmatter formatting.
"""

from acpp.agents.knowledge_agent import KnowledgeAgent
from acpp.schemas.knowledge_structuring import KnowledgeStructureRequest


def test_qcode_generation():
    agent = KnowledgeAgent()

    qcode1 = agent.generate_qcode("Q-KIM-FERM", 1)
    assert qcode1 == "Q-KIM-FERM-001"

    qcode2 = agent.generate_qcode("KIM-FERM", 42)
    assert qcode2 == "Q-KIM-FERM-042"


def test_vector_embedding_generation():
    agent = KnowledgeAgent()
    text = "Kimchi lactic acid fermentation kinetics"

    vector = agent.generate_vector_embedding(text, dim=1536)

    assert len(vector) == 1536
    assert isinstance(vector[0], float)

    # Test normalization (magnitude approximately equal to 1.0)
    magnitude = sum(x * x for x in vector)
    assert abs(magnitude - 1.0) < 0.01


def test_claim_extraction():
    agent = KnowledgeAgent()
    items = [
        {
            "title": "Empirical Fermentation Study",
            "content": "Fermentation rate increases exponentially with temperature up to 25 degrees.",
            "url": "https://ncbi.nlm.nih.gov/articles/123",
            "credibility_score": 0.95,
        }
    ]

    claims = agent.extract_claims(items)
    assert len(claims) == 1
    assert claims[0].claim_id == "CLM-001"
    assert claims[0].confidence_score == 0.95
    assert "Fermentation rate increases" in claims[0].statement


def test_execute_structuring():
    agent = KnowledgeAgent()
    raw_payload = {
        "raw_asset_id": "RAW-KIMCHI-001",
        "query": "Lactobacillus in Kimchi",
        "average_credibility": 0.90,
        "items": [
            {
                "title": "Item 1",
                "content": "Sample content body for testing claim extraction.",
                "url": "https://example.com/item1",
                "credibility_score": 0.90,
            }
        ],
    }
    req = KnowledgeStructureRequest(
        raw_asset_id="RAW-KIMCHI-001",
        domain_code="KIMCHI",
        qcode_prefix="Q-KIM-FERM",
        title="Custom Structured Title",
    )

    result = agent.execute_structuring(raw_payload, req)

    assert "metadata" in result
    assert result["metadata"]["qcode"] == "Q-KIM-FERM-001"
    assert result["metadata"]["title"] == "Custom Structured Title"
    assert result["claims_count"] == 1
    assert result["vector_dim"] == 1536
    assert "---" in result["markdown_content"]
    assert "yaml_frontmatter" not in result["markdown_content"]  # Frontmatter format check
