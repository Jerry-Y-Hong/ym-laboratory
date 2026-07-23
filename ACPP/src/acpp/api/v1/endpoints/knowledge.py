"""
Knowledge Asset Endpoints
==========================
REST API routes for Knowledge Asset CRUD operations.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query, status

from acpp.dependencies.services import (
    get_knowledge_service,
    get_knowledge_structuring_service,
)
from acpp.schemas.common import PaginatedMeta
from acpp.schemas.knowledge import (
    KnowledgeAssetCreate,
    KnowledgeAssetListResponse,
    KnowledgeAssetResponse,
    KnowledgeAssetUpdate,
)
from acpp.schemas.knowledge_structuring import (
    KnowledgeStructureRequest,
    KnowledgeStructureResponse,
)
from acpp.services.knowledge_service import KnowledgeService
from acpp.services.knowledge_structuring_service import KnowledgeStructuringService

router = APIRouter(tags=["Knowledge Asset"])


@router.get(
    "/knowledge",
    response_model=KnowledgeAssetListResponse,
    summary="List Knowledge Assets",
    description="Retrieve paginated knowledge assets with optional domain code filter or search query.",
)
def list_knowledge_assets(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    domain: Optional[str] = Query(None, description="Filter by domain code"),
    query: Optional[str] = Query(None, description="Search query across title and Q-Code"),
    service: KnowledgeService = Depends(get_knowledge_service),
) -> KnowledgeAssetListResponse:
    items, total_items, total_pages = service.list_assets(
        page=page, page_size=page_size, domain_code=domain, query=query
    )

    meta = PaginatedMeta(
        page=page,
        page_size=page_size,
        total_items=total_items,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1,
    )
    return KnowledgeAssetListResponse(
        items=[KnowledgeAssetResponse.model_validate(item) for item in items],
        meta=meta,
    )


@router.post(
    "/knowledge/structure",
    response_model=KnowledgeStructureResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Structure Raw Research Payload",
    description="Trigger Knowledge Agent (ACPP-AG-02) to convert raw research data into structured SSOT Knowledge Asset with Q-Code index and vector embedding.",
)
def structure_knowledge(
    payload: KnowledgeStructureRequest,
    service: KnowledgeStructuringService = Depends(get_knowledge_structuring_service),
) -> KnowledgeStructureResponse:
    return service.structure_knowledge(payload)


@router.get(
    "/knowledge/{id}",
    response_model=KnowledgeAssetResponse,
    summary="Get Knowledge Asset by ID or Q-Code",
    description="Retrieve a specific knowledge asset by canonical asset_id or Q-Code.",
)
def get_knowledge_asset(
    id: str,
    service: KnowledgeService = Depends(get_knowledge_service),
) -> KnowledgeAssetResponse:
    asset = service.get_asset_by_id(id)
    return KnowledgeAssetResponse.model_validate(asset)


@router.post(
    "/knowledge",
    response_model=KnowledgeAssetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Knowledge Asset",
    description="Register a new structured Knowledge Asset into the repository.",
)
def create_knowledge_asset(
    payload: KnowledgeAssetCreate,
    service: KnowledgeService = Depends(get_knowledge_service),
) -> KnowledgeAssetResponse:
    asset = service.create_asset(payload)
    return KnowledgeAssetResponse.model_validate(asset)


@router.put(
    "/knowledge/{id}",
    response_model=KnowledgeAssetResponse,
    summary="Update Knowledge Asset",
    description="Update metadata attributes of an existing Knowledge Asset.",
)
def update_knowledge_asset(
    id: str,
    payload: KnowledgeAssetUpdate,
    service: KnowledgeService = Depends(get_knowledge_service),
) -> KnowledgeAssetResponse:
    asset = service.update_asset(id, payload)
    return KnowledgeAssetResponse.model_validate(asset)


@router.delete(
    "/knowledge/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Knowledge Asset",
    description="Soft-delete a Knowledge Asset from active repository views.",
)
def delete_knowledge_asset(
    id: str,
    service: KnowledgeService = Depends(get_knowledge_service),
) -> dict:
    service.delete_asset(id)
    return {"status": "SUCCESS", "message": f"KnowledgeAsset '{id}' deleted successfully."}

