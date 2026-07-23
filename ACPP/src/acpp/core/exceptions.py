"""
ACPP Global Exceptions & Taxonomy
==================================
Defines custom exception classes and error codes per ACPP_API_SPECIFICATION §4.
"""

from typing import Any, Dict, Optional


class ACPPException(Exception):
    """Base exception for all ACPP platform errors."""

    def __init__(
        self,
        code: str = "ACPP-ERR-5000",
        message: str = "Internal server error",
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class KnowledgeAssetNotFoundError(ACPPException):
    """Raised when a KnowledgeAsset cannot be found by ID or Q-Code."""

    def __init__(self, identifier: str) -> None:
        super().__init__(
            code="ACPP-ERR-4040",
            message=f"KnowledgeAsset '{identifier}' not found.",
            status_code=404,
            details={"identifier": identifier},
        )


class ResearchJobNotFoundError(ACPPException):
    """Raised when a Research Job cannot be found by job_id."""

    def __init__(self, job_id: str) -> None:
        super().__init__(
            code="ACPP-ERR-4041",
            message=f"Research job '{job_id}' not found.",
            status_code=404,
            details={"job_id": job_id},
        )


class WritingJobNotFoundError(ACPPException):
    """Raised when a Writing Job cannot be found by job_id."""

    def __init__(self, job_id: str) -> None:
        super().__init__(
            code="ACPP-ERR-4042",
            message=f"Writing job '{job_id}' not found.",
            status_code=404,
            details={"job_id": job_id},
        )


class SEOJobNotFoundError(ACPPException):
    """Raised when an SEO Job cannot be found by job_id."""

    def __init__(self, job_id: str) -> None:
        super().__init__(
            code="ACPP-ERR-4043",
            message=f"SEO job '{job_id}' not found.",
            status_code=404,
            details={"job_id": job_id},
        )


class ImageJobNotFoundError(ACPPException):
    """Raised when an Image Job cannot be found by job_id."""

    def __init__(self, job_id: str) -> None:
        super().__init__(
            code="ACPP-ERR-4044",
            message=f"Image job '{job_id}' not found.",
            status_code=404,
            details={"job_id": job_id},
        )






class ValidationError(ACPPException):
    """Raised when incoming payload fails business domain validation."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None) -> None:
        super().__init__(
            code="ACPP-ERR-4001",
            message=message,
            status_code=400,
            details=details,
        )


class UnauthorizedError(ACPPException):
    """Raised when AAOS security context verification fails."""

    def __init__(self, message: str = "Invalid or missing AAOS Security Token.") -> None:
        super().__init__(
            code="ACPP-ERR-4010",
            message=message,
            status_code=401,
        )


class ApprovalRequiredError(ACPPException):
    """Raised when human approval token is missing or invalid."""

    def __init__(self, message: str = "Publishing dispatch blocked: Human Approval Token required.") -> None:
        super().__init__(
            code="ACPP-ERR-4030",
            message=message,
            status_code=403,
        )


class RateLimitError(ACPPException):
    """Raised when AI gateway rate limit is hit."""

    def __init__(self, message: str = "AI Gateway rate limit exceeded.") -> None:
        super().__init__(
            code="ACPP-ERR-4290",
            message=message,
            status_code=429,
        )


class DatabaseError(ACPPException):
    """Raised on internal database storage engine errors."""

    def __init__(self, message: str = "Database operation failed.", details: Optional[Dict[str, Any]] = None) -> None:
        super().__init__(
            code="ACPP-ERR-5000",
            message=message,
            status_code=500,
            details=details,
        )


class ProviderUnavailableError(ACPPException):
    """Raised when downstream AI provider is unreachable."""

    def __init__(self, message: str = "External AI provider service unavailable.") -> None:
        super().__init__(
            code="ACPP-ERR-5003",
            message=message,
            status_code=503,
        )
