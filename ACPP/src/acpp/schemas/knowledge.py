"""
Knowledge Asset Schemas
========================
Pydantic validation schemas for KnowledgeAsset endpoints.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

from acpp.schemas.common import PaginatedMeta


class KnowledgeAssetBase(BaseModel):
    qcode: str = Field(..., description="Unique Q-Code index", json_schema_extra={"example": "Q-KIM-FERM-001"})
    domain_code: str = Field(..., description="Knowledge domain identifier", json_schema_extra={"example": "KIMCHI"})
    title: str = Field(..., description="Asset title", json_schema_extra={"example": "Kimchi Fermentation Dynamics"})
    version: str = Field("v1.0.0", description="Asset version tag", json_schema_extra={"example": "v1.0.0"})
    author_agent_id: str = Field("ACPP-AG-02", description="ID of authoring micro-agent", json_schema_extra={"example": "ACPP-AG-02"})
    verification_score: float = Field(0.0, ge=0.0, le=1.0, description="Confidence/Verification score (0.0 - 1.0)", json_schema_extra={"example": 0.95})
    security_level: str = Field("PUBLIC", description="Security classification level", json_schema_extra={"example": "PUBLIC"})
    file_path: str = Field(..., description="Repository file path", json_schema_extra={"example": "repository/structured/KA-KIMCHI-001.md"})
    summary: Optional[str] = Field(None, description="Executive summary of knowledge asset")
    category_id: Optional[str] = Field(None, description="Optional parent category ID")

    @field_validator("security_level")
    @classmethod
    def validate_security_level(cls, v: str) -> str:
        allowed = {"PUBLIC", "INTERNAL", "RESTRICTED", "CONFIDENTIAL"}
        if v.upper() not in allowed:
            raise ValueError(f"security_level must be one of {allowed}")
        return v.upper()


class KnowledgeAssetCreate(KnowledgeAssetBase):
    asset_id: str = Field(..., description="Canonical asset ID", json_schema_extra={"example": "KA-KIMCHI-001"})


class KnowledgeAssetUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Updated title")
    version: Optional[str] = Field(None, description="Updated version tag")
    verification_score: Optional[float] = Field(None, ge=0.0, le=1.0, description="Updated verification score")
    security_level: Optional[str] = Field(None, description="Updated security classification")
    file_path: Optional[str] = Field(None, description="Updated file path")
    summary: Optional[str] = Field(None, description="Updated summary")
    category_id: Optional[str] = Field(None, description="Updated category ID")

    @field_validator("security_level")
    @classmethod
    def validate_security_level(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        allowed = {"PUBLIC", "INTERNAL", "RESTRICTED", "CONFIDENTIAL"}
        if v.upper() not in allowed:
            raise ValueError(f"security_level must be one of {allowed}")
        return v.upper()


class KnowledgeAssetResponse(KnowledgeAssetBase):
    model_config = ConfigDict(from_attributes=True)

    asset_id: str
    is_deleted: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class KnowledgeAssetListResponse(BaseModel):
    items: List[KnowledgeAssetResponse]
    meta: PaginatedMeta
