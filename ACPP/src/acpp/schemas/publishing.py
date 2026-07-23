"""
Publishing Agent Schemas
=========================
Pydantic validation schemas for Publishing Agent (ACPP-AG-06) endpoints and channel dispatch packages.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ApprovalRecordSchema(BaseModel):
    approval_token: str = Field(..., description="Phase 37 AEGS Human Approval Token", json_schema_extra={"example": "HA-TOKEN-2026-OK"})
    approval_status: str = Field("APPROVED", description="Status (APPROVED, PENDING, REJECTED)")
    approved_by: str = Field("human_editor", description="Approver user ID")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PublishPackage(BaseModel):
    content: Dict[str, Any] = Field(..., description="Writing Agent draft content")
    metadata: Dict[str, Any] = Field(..., description="SEO metadata & Q-Code lineage")
    media: Dict[str, Any] = Field(default_factory=dict, description="Media Manifest & visual assets")
    provenance: Dict[str, Any] = Field(default_factory=dict, description="Source provenance lineage")
    approval_record: ApprovalRecordSchema = Field(..., description="AEGS Human Approval Record")


class PublishingRequest(BaseModel):
    content_asset_id: str = Field(..., description="ID of Writing Agent Content Asset", json_schema_extra={"example": "KA-KIMCHI-20260723-001"})
    seo_asset_id: Optional[str] = Field(None, description="Optional SEO asset ID")
    media_manifest_id: Optional[str] = Field(None, description="Optional Media Manifest ID")
    target_channel: str = Field("cms", description="Publishing channel (cms, wordpress, ghost, social, twitter, linkedin)")
    approval_token: str = Field(..., description="Phase 37 AEGS Human Approval Token", json_schema_extra={"example": "HA-TOKEN-2026-OK"})


class PublishingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    job_id: str = Field(..., description="Workflow execution run ID", json_schema_extra={"example": "WF-PUB-20260723-001"})
    publish_status: str = Field("PUBLISHED", description="Dispatch status")
    channel: str = Field(..., description="Target publishing channel")
    published_url: str = Field(..., description="Live dispatched content URL")
    approval_status: str = Field("APPROVED", description="Human approval verification status")
    dispatch_id: str = Field(..., description="Channel dispatch receipt ID")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PublishingJobStatusResponse(BaseModel):
    job_id: str = Field(..., description="Workflow job execution ID")
    agent_id: str = Field("ACPP-AG-06", description="Agent ID")
    status: str = Field(..., description="Execution status")
    metrics: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Job execution metrics")
    error_message: Optional[str] = Field(None, description="Error message if failed")
    execution_time_ms: float = Field(0.0, description="Execution time in milliseconds")
