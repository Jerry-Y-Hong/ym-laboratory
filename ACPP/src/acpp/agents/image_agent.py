"""
Image Agent (ACPP-AG-05) Core Module
====================================
Synthesizes visual prompts, generates accessible alt text, invokes Image Engine Gateway,
and constructs comprehensive Media Manifests under ADF v3.1.
Strictly preserves source Q-Code references and content lineage.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from acpp.image_engine.dalle_adapter import DalleImageAdapter
from acpp.image_engine.image_engine_gateway import ImageEngineGateway
from acpp.schemas.image import (
    ImageAsset,
    ImageGenerationRequest,
    MediaManifest,
)

logger = logging.getLogger("acpp.agents.image")


class ImageAgent:
    """
    Image Agent (ACPP-AG-05)
    Analyzes visual requirements, synthesizes image prompts, calls gateway adapters,
    and builds complete media manifest packages.
    """

    AGENT_ID = "ACPP-AG-05"
    AGENT_NAME = "Image Agent"
    VERSION = "v1.0.0"

    def __init__(self, gateway: Optional[ImageEngineGateway] = None) -> None:
        self.gateway = gateway or DalleImageAdapter()
        self.logger = logger

    def analyze_visual_requirements(
        self, content_asset: Dict[str, Any], request: ImageGenerationRequest
    ) -> Dict[str, Any]:
        """Analyze content theme, key subjects, and visual requirements."""
        title = content_asset.get("title", "Research Overview")
        summary = content_asset.get("summary", "Scientific domain findings.")

        return {
            "title": title,
            "summary": summary,
            "style": request.style,
            "aspect_ratio": request.aspect_ratio,
            "image_type": request.image_type,
            "q_code": request.q_code,
        }

    def generate_image_prompt(
        self, content_title: str, topic: str, style: str, aspect_ratio: str
    ) -> str:
        """Synthesize detailed visual prompt for image generation engine."""
        style_desc = {
            "PHOTOREALISTIC": "High-resolution professional photography, crisp focus, studio lighting",
            "ILLUSTRATION": "Modern vector illustration, vibrant harmonious colors, clean layout",
            "SCHEMATIC": "Detailed scientific schematic infographic, clear labeled elements",
        }.get(style.upper(), "High-quality professional visual")

        prompt = (
            f"A {style_desc} representing '{content_title}'. "
            f"Focusing on scientific theme of {topic}. "
            f"Aspect ratio {aspect_ratio}, ultra-detailed 8k resolution, suitable for enterprise publishing."
        )
        return prompt

    def generate_alt_text(self, title: str, prompt: str, q_code: str) -> str:
        """Generate accessible HTML alt text containing title and Q-Code index."""
        return f"Visual representation of {title} (Q-Code: {q_code}). Synthesized media asset."

    def create_media_manifest(
        self,
        primary_image: ImageAsset,
        thumbnails: List[ImageAsset],
        social_variants: List[ImageAsset],
    ) -> MediaManifest:
        """Construct MediaManifest bundling all generated image variants."""
        now_iso = datetime.now(timezone.utc).isoformat()
        return MediaManifest(
            images=[primary_image],
            thumbnails=thumbnails,
            social_variants=social_variants,
            metadata={
                "agent_id": self.AGENT_ID,
                "engine": primary_image.engine,
                "q_code": primary_image.q_code,
                "source_content_id": primary_image.source_content_id,
                "total_media_count": 1 + len(thumbnails) + len(social_variants),
                "created_at": now_iso,
            },
        )

    def generate_visual_asset(
        self,
        content_asset: Dict[str, Any],
        request: ImageGenerationRequest,
        gateway_override: Optional[ImageEngineGateway] = None,
    ) -> Tuple[ImageAsset, MediaManifest]:
        """
        Main entrypoint: Synthesize visual prompt, call Image Engine Gateway,
        and build primary ImageAsset + MediaManifest package.
        """
        active_gateway = gateway_override or self.gateway
        self.logger.info(
            f"[{self.AGENT_ID}] Synthesizing visual assets for '{request.content_asset_id}' / Q-Code '{request.q_code}' "
            f"via engine '{active_gateway.engine_name}'"
        )

        vis_reqs = self.analyze_visual_requirements(content_asset, request)
        prompt = self.generate_image_prompt(
            vis_reqs["title"], vis_reqs["summary"][:100], request.style, request.aspect_ratio
        )
        alt_text = self.generate_alt_text(vis_reqs["title"], prompt, request.q_code)

        # 1. Generate primary image
        primary_gen = active_gateway.generate_image(
            prompt=prompt, style=request.style, aspect_ratio=request.aspect_ratio
        )

        now_utc = datetime.now(timezone.utc)
        timestamp_str = now_utc.strftime("%Y%m%d%H%M%S")
        img_id = f"IMG-{request.q_code.replace('Q-', '')}-{timestamp_str}"

        primary_asset = ImageAsset(
            asset_id=img_id,
            source_content_id=request.content_asset_id,
            q_code=request.q_code,
            prompt=prompt,
            alt_text=alt_text,
            engine=active_gateway.engine_name,
            usage=request.image_type,
            image_url=primary_gen["image_url"],
            created_at=now_utc,
        )

        # 2. Generate thumbnail variant (1:1 aspect ratio)
        thumb_asset = ImageAsset(
            asset_id=f"{img_id}-THUMB",
            source_content_id=request.content_asset_id,
            q_code=request.q_code,
            prompt=f"{prompt} (Thumbnail variant)",
            alt_text=f"{alt_text} (Thumbnail)",
            engine=active_gateway.engine_name,
            usage="thumbnail",
            image_url=primary_gen["image_url"].replace(".png", "_thumb.png"),
            created_at=now_utc,
        )

        # 3. Generate social media variant (4:5 aspect ratio)
        social_asset = ImageAsset(
            asset_id=f"{img_id}-SOCIAL",
            source_content_id=request.content_asset_id,
            q_code=request.q_code,
            prompt=f"{prompt} (Social media card variant)",
            alt_text=f"{alt_text} (Social Variant)",
            engine=active_gateway.engine_name,
            usage="social_card",
            image_url=primary_gen["image_url"].replace(".png", "_social.png"),
            created_at=now_utc,
        )

        # 4. Construct MediaManifest
        manifest = self.create_media_manifest(
            primary_image=primary_asset,
            thumbnails=[thumb_asset],
            social_variants=[social_asset],
        )

        return primary_asset, manifest
