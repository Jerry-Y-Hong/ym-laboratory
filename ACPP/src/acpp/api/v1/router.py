"""
API v1 Router
==============
Aggregates all API v1 endpoints into a single router.
"""

from fastapi import APIRouter

from acpp.api.v1.endpoints import health, knowledge, repository, research

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(knowledge.router)
api_router.include_router(repository.router)
api_router.include_router(research.router)

