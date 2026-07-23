"""
Health Check Schema
====================
Schema for GET /health and GET /api/v1/health endpoints.
"""

from typing import Dict, Any
from pydantic import BaseModel, Field


class HealthCheckResponse(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "HEALTHY"})
    version: str = Field(..., json_schema_extra={"example": "v3.1.0"})
    environment: str = Field(..., json_schema_extra={"example": "development"})
    database_status: str = Field(..., json_schema_extra={"example": "CONNECTED"})
    details: Dict[str, Any] = Field(default_factory=dict)
