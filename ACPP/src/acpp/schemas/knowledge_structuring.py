"""
Knowledge Structuring Schemas
=============================
Pydantic validation schemas for Knowledge Agent (ACPP-AG-02) structuring pipeline.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class KnowledgeClaim(BaseModel):
    claim_id: str = Field(..., description="Unique claim ID", json_schema_extra={"example": "CLM-001"})
    statement: str = Field(..., description="Factual claim statement")
    confidence_score: float = Field(0.9, ge=0.0, le=1.0, description="Claim confidence score")
    citation_url: Optional[str] = Field(None, description="Source reference URL")


class KnowledgeStructureRequest(BaseModel):
    raw_asset_id: str = Field(..., description="ID of raw research asset to structure", json_schema_extra={"example": "RAW-KIMCHI-20260723-001"})
    domain_code: str = Field("KIMCHI", description="Domain classification code", json_schema_extra={"example": "KIMCHI"})
    qcode_prefix: str = Field("Q-KIM-FERM", description="Prefix for generated Q-Codes", json_schema_extra={"example": "Q-KIM-FERM"})
    title: Optional[str] = Field(None, description="Optional custom title for knowledge asset")


class KnowledgeStructureResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    asset_id: str = Field(..., description="Canonical structured asset ID", json_schema_extra={"example": "KA-KIMCHI-20260723-001"})
    qcode: str = Field(..., description="Indexed Q-Code identifier", json_schema_extra={"example": "Q-KIM-FERM-001"})
    domain_code: str
    title: str
    verification_score: float
    file_path_md: str = Field(..., description="Path to Markdown file with YAML frontmatter")
    file_path_json: str = Field(..., description="Path to structured JSON metadata file")
    claims_count: int
    vector_dim: int = Field(1536, description="Dimension of vector embedding")
    created_at: datetime = Field(default_factory=datetime.utcnow)
