"""
Image Agent Schemas
====================
Pydantic validation schemas for Image Agent (ACPP-AG-05) endpoints and visual media manifests.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ImageAsset(BaseModel):
    asset_id: str = Field(..., description="Unique Image Asset ID", json_schema_extra={"example": "IMG-KIM-20260723-001"})
    source_content_id: str = Field(..., description="Source Content Asset or Knowledge Asset ID", json_schema_extra={"example": "KA-KIMCHI-20260723-001"})
    q_code: str = Field(..., description="Source Q-Code index", json_schema_extra={"example": "Q-KIM-FERM-001"})
    prompt: str = Field(..., description="Synthesized visual prompt")
    alt_text: str = Field(..., description="Accessible HTML alt text")
    engine: str = Field("DALL-E 3", description="Image generation engine name")
    usage: str = Field("blog_thumbnail", description="Image usage classification (hero_banner, blog_thumbnail, social_card)")
    image_url: Optional[str] = Field(None, description="Image URL or local file path")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MediaManifest(BaseModel):
    images: List[ImageAsset] = Field(default_factory=list, description="Primary full-resolution images")
    thumbnails: List[ImageAsset] = Field(default_factory=list, description="Thumbnail variants")
    social_variants: List[ImageAsset] = Field(default_factory=list, description="Social media aspect ratio variants")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Manifest metadata")


class ImageGenerationRequest(BaseModel):
    content_asset_id: str = Field(..., description="ID of source Content Asset or Knowledge Asset", json_schema_extra={"example": "KA-KIMCHI-20260723-001"})
    q_code: str = Field(..., description="Source Q-Code index", json_schema_extra={"example": "Q-KIM-FERM-001"})
    image_type: str = Field("hero_banner", description="Image type (hero_banner, blog_thumbnail, social_card)")
    style: str = Field("PHOTOREALISTIC", description="Visual aesthetic style (PHOTOREALISTIC, ILLUSTRATION, SCHEMATIC)")
    aspect_ratio: str = Field("16:9", description="Aspect ratio (16:9, 1:1, 4:5)")
    language: str = Field("EN", description="Language code")


class ImageGenerationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    job_id: str = Field(..., description="Workflow execution run ID", json_schema_extra={"example": "WF-IMG-20260723-001"})
    image_asset_id: str = Field(..., description="Primary Image Asset ID")
    prompt: str = Field(..., description="Synthesized prompt")
    generation_status: str = Field("COMPLETED", description="Job status")
    image_metadata: ImageAsset = Field(..., description="Primary image asset metadata")
    media_manifest: MediaManifest = Field(..., description="Complete media manifest with variants")


class ImageJobStatusResponse(BaseModel):
    job_id: str = Field(..., description="Workflow job execution ID")
    agent_id: str = Field("ACPP-AG-05", description="Agent ID")
    status: str = Field(..., description="Execution status")
    metrics: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Job execution metrics")
    error_message: Optional[str] = Field(None, description="Error message if failed")
    execution_time_ms: float = Field(0.0, description="Execution time in milliseconds")
