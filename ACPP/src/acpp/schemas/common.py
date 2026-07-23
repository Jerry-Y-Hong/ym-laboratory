"""
Common Pydantic Schemas
========================
Provides unified API error structures and pagination metadata.
"""

from typing import Any, Dict, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class APIErrorDetail(BaseModel):
    code: str = Field(..., json_schema_extra={"example": "ACPP-ERR-4001"})
    message: str = Field(..., json_schema_extra={"example": "Invalid request payload."})
    details: Optional[Dict[str, Any]] = Field(default=None)


class APIErrorResponse(BaseModel):
    error: APIErrorDetail


class PaginatedMeta(BaseModel):
    page: int = Field(..., ge=1, json_schema_extra={"example": 1})
    page_size: int = Field(..., ge=1, json_schema_extra={"example": 20})
    total_items: int = Field(..., ge=0, json_schema_extra={"example": 100})
    total_pages: int = Field(..., ge=0, json_schema_extra={"example": 5})
    has_next: bool = Field(..., json_schema_extra={"example": True})
    has_prev: bool = Field(..., json_schema_extra={"example": False})


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    meta: PaginatedMeta
