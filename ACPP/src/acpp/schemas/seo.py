"""
SEO Agent Schemas
==================
Pydantic validation schemas for SEO Agent (ACPP-AG-04) endpoints and metadata optimization.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class SEOMetadata(BaseModel):
    title: str = Field(..., description="SEO optimized title", json_schema_extra={"example": "Kimchi Fermentation Guide | ACPP"})
    meta_description: str = Field(..., description="Meta description (max 160 chars)", json_schema_extra={"example": "Explore empirical dynamics of Kimchi fermentation microorganisms under Q-Code Q-KIM-FERM-001."})
    keywords: List[str] = Field(default_factory=list, description="Target & secondary keywords")
    canonical_url: str = Field(..., description="Canonical page URL")
    open_graph: Dict[str, Any] = Field(default_factory=dict, description="OpenGraph protocol metadata (og:title, og:description, etc.)")
    json_ld: Dict[str, Any] = Field(default_factory=dict, description="Schema.org Article JSON-LD structured data")


class SEOOptimizationRequest(BaseModel):
    content_asset_id: str = Field(..., description="ID of source Content Asset or Knowledge Asset", json_schema_extra={"example": "KA-KIMCHI-20260723-001"})
    q_code: str = Field(..., description="Source Q-Code index", json_schema_extra={"example": "Q-KIM-FERM-001"})
    target_keywords: List[str] = Field(default_factory=lambda: ["kimchi", "fermentation", "probiotics"], description="Target SEO keywords")
    target_audience: str = Field("GENERAL_PUBLIC", description="Audience tier")
    language: str = Field("EN", description="Language code")
    search_intent: str = Field("INFORMATIONAL", description="Search intent category (INFORMATIONAL, COMMERCIAL, NAVIGATIONAL)")
    raw_text: Optional[str] = Field(None, description="Optional raw text content to optimize")


class SEOOptimizationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    job_id: str = Field(..., description="Workflow execution run ID", json_schema_extra={"example": "WF-SEO-20260723-001"})
    optimized_asset_id: str = Field(..., description="Generated SEO asset ID", json_schema_extra={"example": "SEO-KIMCHI-20260723-001"})
    seo_score: float = Field(..., ge=0.0, le=100.0, description="Overall SEO optimization score (0-100)")
    readability_score: float = Field(..., ge=0.0, le=100.0, description="Flesch-Kincaid readability score")
    metadata: SEOMetadata = Field(..., description="Generated SEO metadata package")
    optimization_status: str = Field("COMPLETED", description="Job status")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SEOJobStatusResponse(BaseModel):
    job_id: str = Field(..., description="Workflow job execution ID")
    agent_id: str = Field("ACPP-AG-04", description="Agent ID")
    status: str = Field(..., description="Execution status")
    metrics: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Job execution metrics")
    error_message: Optional[str] = Field(None, description="Error message if failed")
    execution_time_ms: float = Field(0.0, description="Execution time in milliseconds")
