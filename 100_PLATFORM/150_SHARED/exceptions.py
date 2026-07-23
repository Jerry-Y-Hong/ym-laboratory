"""
Platform Custom Exception Hierarchy
"""

class PlatformBaseException(Exception):
    """Base exception for all food platform errors."""
    def __init__(self, message: str, code: str = "PLATFORM_ERROR"):
        super().__init__(message)
        self.message = message
        self.code = code

class APIException(PlatformBaseException):
    """Raised when an external OpenAPI call fails."""
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message, code="API_ERROR")
        self.status_code = status_code

class APIKeyMissingException(APIException):
    """Raised when required API key is missing from environment."""
    def __init__(self, key_name: str = "RDA_API_KEY"):
        super().__init__(f"Required API key '{key_name}' is missing in environment variables.", status_code=401)

class DatabaseException(PlatformBaseException):
    """Raised when database operations fail."""
    def __init__(self, message: str):
        super().__init__(message, code="DB_ERROR")

class RawDataIntegrityException(DatabaseException):
    """Raised when RAW data immutability or hashing check fails."""
    def __init__(self, message: str):
        super().__init__(f"RAW Data Integrity Error: {message}")

class ValidationException(PlatformBaseException):
    """Raised when data model validation fails."""
    def __init__(self, message: str):
        super().__init__(message, code="VALIDATION_ERROR")
