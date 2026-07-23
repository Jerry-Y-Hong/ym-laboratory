"""
Research Agent Schemas
======================
Pydantic validation schemas for Research Agent (ACPP-AG-01) endpoints and payload operations.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ResearchSourceProvenance(BaseModel):
    url: str = Field(..., description="Source URL or document reference", json_schema_extra={"example": "https://example.com/kimchi-research"})
    title: str = Field(..., description="Source title", json_schema_extra={"example": "Microbial Dynamics in Kimchi Fermentation"})
    retrieved_at: datetime = Field(default_factory=datetime.utcnow, description="Ingestion timestamp")
    sha256_hash: str = Field(..., description="Cryptographic SHA-256 hash of raw source content", json_schema_extra={"example": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"})
    credibility_score: float = Field(1.0, ge=0.0, le=1.0, description="Domain & source reliability score", json_schema_extra={"example": 0.92})


class RawResearchItem(BaseModel):
    title: str = Field(..., description="Item title")
    content: str = Field(..., description="Extracted content text")
    url: Optional[str] = Field(None, description="Source URL")
    source_type: str = Field("web", description="Type of source (web, paper, dataset, pdf)")
    credibility_score: float = Field(0.8, ge=0.0, le=1.0, description="Individual item credibility score")
    sha256_hash: str = Field(..., description="SHA-256 integrity hash of content")


class ResearchIngestRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Research query topic or seed search term", json_schema_extra={"example": "Kimchi Fermentation Microorganisms"})
    domain_code: str = Field("KIMCHI", description="Domain classification code", json_schema_extra={"example": "KIMCHI"})
    depth: int = Field(1, ge=1, le=5, description="Scraping depth limit", json_schema_extra={"example": 2})
    max_sources: int = Field(5, ge=1, le=50, description="Maximum number of sources to collect", json_schema_extra={"example": 5})
    simulated: bool = Field(True, description="Whether to use simulated/offline ingestion engine for testing")


class ResearchIngestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    job_id: str = Field(..., description="Workflow job execution ID", json_schema_extra={"example": "WF-RES-2026-001"})
    status: str = Field(..., description="Ingestion status (COMPLETED, FAILED, RUNNING)", json_schema_extra={"example": "COMPLETED"})
    raw_asset_id: str = Field(..., description="Generated raw research asset ID", json_schema_extra={"example": "RAW-KIMCHI-20260723-001"})
    payload_path: str = Field(..., description="File path relative to repository root", json_schema_extra={"example": "repository/raw/2026/07/RAW-KIMCHI-20260723-001.json"})
    sha256_provenance_hash: str = Field(..., description="Overall payload SHA-256 provenance hash", json_schema_extra={"example": "a1b2c3d4..."})
    items_count: int = Field(..., description="Number of ingested research items")
    credibility_avg: float = Field(..., description="Average credibility score across sources")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ResearchJobStatusResponse(BaseModel):
    job_id: str = Field(..., description="Workflow job execution ID")
    agent_id: str = Field("ACPP-AG-01", description="Agent ID")
    status: str = Field(..., description="Execution status")
    metrics: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Job execution metrics")
    error_message: Optional[str] = Field(None, description="Error message if failed")
    execution_time_ms: float = Field(0.0, description="Execution time in milliseconds")
