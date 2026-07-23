"""
API Layer Configuration Loader
Manages environment variables for RDA OpenAPI integration without hardcoding.
"""
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class APIConfig:
    def __init__(self):
        self.rda_api_key: str = os.getenv("RDA_API_KEY", "MOCK_RDA_API_KEY_DEMO")
        self.rda_api_base_url: str = os.getenv("RDA_API_BASE_URL", "http://api.nongsaro.go.kr/service")
        self.timeout: int = int(os.getenv("RDA_API_TIMEOUT", "10"))
        self.max_retries: int = int(os.getenv("RDA_API_MAX_RETRIES", "3"))
        self.app_env: str = os.getenv("APP_ENV", "DEVELOPMENT")

    def is_mock_mode(self) -> bool:
        """Returns True if running in mock/demo mode without real key."""
        return self.rda_api_key in ["YOUR_RDA_OPENAPI_KEY_HERE", "MOCK_RDA_API_KEY_DEMO", ""]

api_config = APIConfig()
