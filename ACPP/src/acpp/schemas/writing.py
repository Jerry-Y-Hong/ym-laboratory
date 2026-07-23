"""
Writing Agent Schemas
======================
Pydantic validation schemas for Writing Agent (ACPP-AG-03) endpoints and multi-channel content generation.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ContentAsset(BaseModel):
    asset_type: str = Field(..., description="Content channel type (blog, html, newsletter, social, technical_brief)", json_schema_extra={"example": "blog"})
    title: str = Field(..., description="Generated content title")
    body: str = Field(..., description="Generated content body")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Metadata including Q-Code and source traceability")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WritingRequest(BaseModel):
    knowledge_asset_id: str = Field(..., description="Canonical ID of structured Knowledge Asset", json_schema_extra={"example": "KA-KIMCHI-20260723-001"})
    q_code: str = Field(..., description="Associated Q-Code identifier", json_schema_extra={"example": "Q-KIM-FERM-001"})
    content_type: str = Field("all", description="Target channel or 'all' for multi-channel package", json_schema_extra={"example": "all"})
    target_audience: str = Field("GENERAL_PUBLIC", description="Target audience tier", json_schema_extra={"example": "GENERAL_PUBLIC"})
    language: str = Field("EN", description="Content language code", json_schema_extra={"example": "EN"})
    tone: str = Field("PROFESSIONAL", description="Tone of voice", json_schema_extra={"example": "PROFESSIONAL"})


class WritingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    job_id: str = Field(..., description="Workflow execution run ID", json_schema_extra={"example": "WF-WRITE-20260723-001"})
    source_asset_id: str = Field(..., description="Source Knowledge Asset ID")
    q_code: str = Field(..., description="Source Q-Code")
    generation_status: str = Field("COMPLETED", description="Status of generation job")
    generated_assets: List[ContentAsset] = Field(..., description="Package of generated multi-channel content assets")


class WritingJobStatusResponse(BaseModel):
    job_id: str = Field(..., description="Workflow job execution ID")
    agent_id: str = Field("ACPP-AG-03", description="Agent ID")
    status: str = Field(..., description="Execution status")
    metrics: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Job execution metrics")
    error_message: Optional[str] = Field(None, description="Error message if failed")
    execution_time_ms: float = Field(0.0, description="Execution time in milliseconds")
