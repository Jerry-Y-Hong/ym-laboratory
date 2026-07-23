"""
Image Agent Unit Tests
======================
Tests for ImageAgent (ACPP-AG-05) visual requirement analysis, prompt generation,
alt text generation, MediaManifest creation, and ImageEngineGateway abstraction.
"""

from acpp.agents.image_agent import ImageAgent
from acpp.image_engine.dalle_adapter import DalleImageAdapter
from acpp.schemas.image import ImageGenerationRequest


def test_dalle_adapter_generation():
    adapter = DalleImageAdapter(api_key="mock-key")
    assert adapter.engine_name == "DALL-E 3"
    assert adapter.validate_request("Sample prompt for testing DALL-E generation")

    res = adapter.generate_image(
        prompt="Sample scientific fermentation illustration",
        style="ILLUSTRATION",
        aspect_ratio="16:9",
    )

    assert res["engine"] == "DALL-E 3"
    assert res["dimensions"] == "1792x1024"
    assert "https://" in res["image_url"]
    assert res["status"] == "COMPLETED"


def test_image_prompt_synthesis():
    agent = ImageAgent()
    prompt = agent.generate_image_prompt(
        content_title="Kimchi Fermentation Kinetics",
        topic="Lactobacillus population curve",
        style="PHOTOREALISTIC",
        aspect_ratio="16:9",
    )

    assert "Kimchi Fermentation Kinetics" in prompt
    assert "Lactobacillus population curve" in prompt
    assert "16:9" in prompt


def test_alt_text_generation():
    agent = ImageAgent()
    alt_text = agent.generate_alt_text(
        title="Fermentation Assay",
        prompt="Infographic of microbial growth",
        q_code="Q-KIM-FERM-001",
    )

    assert "Fermentation Assay" in alt_text
    assert "Q-KIM-FERM-001" in alt_text


def test_generate_visual_asset_full():
    agent = ImageAgent()
    content_asset = {
        "title": "Empirical Kimchi Fermentation Dynamics",
        "summary": "Microbial kinetics of Lactobacillus plantarum.",
    }
    req = ImageGenerationRequest(
        content_asset_id="KA-KIMCHI-20260723-001",
        q_code="Q-KIM-FERM-001",
        image_type="hero_banner",
        style="PHOTOREALISTIC",
        aspect_ratio="16:9",
    )

    primary_asset, manifest = agent.generate_visual_asset(content_asset, req)

    assert primary_asset.engine == "DALL-E 3"
    assert primary_asset.q_code == "Q-KIM-FERM-001"
    assert primary_asset.source_content_id == "KA-KIMCHI-20260723-001"
    assert primary_asset.usage == "hero_banner"

    assert len(manifest.images) == 1
    assert len(manifest.thumbnails) == 1
    assert len(manifest.social_variants) == 1
    assert manifest.metadata["q_code"] == "Q-KIM-FERM-001"
