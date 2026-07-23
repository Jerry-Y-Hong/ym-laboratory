"""
API v1 Router
==============
Aggregates all API v1 endpoints into a single router.
"""

from fastapi import APIRouter

from acpp.api.v1.endpoints import health, knowledge, repository, research, seo, writing

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(knowledge.router)
api_router.include_router(repository.router)
api_router.include_router(research.router)
api_router.include_router(writing.router)
api_router.include_router(seo.router)



