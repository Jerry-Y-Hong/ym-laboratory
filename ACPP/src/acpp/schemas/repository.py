"""
Repository Status Schemas
==========================
Pydantic schemas for GET /repository/status endpoint.
"""

from typing import Dict, Any
from pydantic import BaseModel, Field


class RepositoryStatusResponse(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "ONLINE"})
    database_connected: bool = Field(..., json_schema_extra={"example": True})
    total_knowledge_assets: int = Field(..., ge=0, json_schema_extra={"example": 42})
    total_categories: int = Field(..., ge=0, json_schema_extra={"example": 8})
    total_workflows: int = Field(..., ge=0, json_schema_extra={"example": 15})
    storage_engine: Dict[str, Any] = Field(
        default_factory=lambda: {
            "raw_dir": "repository/raw",
            "structured_dir": "repository/structured",
            "published_dir": "repository/published",
            "index_dir": "repository/index",
        }
    )
