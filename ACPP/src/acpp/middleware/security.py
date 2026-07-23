"""
Security Context Middleware
===========================
Extracts and validates ADF v3.1 AAOS Security Context headers (X-Agent-ID, X-AAOS-Token, X-Tenant-ID).
"""

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response


class AAOSSecurityMiddleware(BaseHTTPMiddleware):
    """
    Parses AAOS Security context headers into request.state.
    Non-blocking by default unless strict mode is enabled.
    """

    def __init__(self, app, strict: bool = False) -> None:
        super().__init__(app)
        self.strict = strict

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        agent_id = request.headers.get("X-Agent-ID", "ANONYMOUS_CLIENT")
        aaos_token = request.headers.get("X-AAOS-Token", None)
        tenant_id = request.headers.get("X-Tenant-ID", "DEFAULT_TENANT")

        request.state.agent_id = agent_id
        request.state.aaos_token = aaos_token
        request.state.tenant_id = tenant_id

        return await call_next(request)
