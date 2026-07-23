"""
Image Engine Gateway Interface
==============================
Abstract Base Class defining the vendor-neutral contract for image generation engines.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict


class ImageEngineGateway(ABC):
    """
    Vendor-neutral interface for image generation engines.
    Allows seamless switching between DALL-E, Open Source models, or enterprise image gateways.
    """

    @property
    @abstractmethod
    def engine_name(self) -> str:
        """Return canonical name of the underlying engine."""
        pass

    @abstractmethod
    def validate_request(self, prompt: str) -> bool:
        """Validate input prompt compliance before sending to provider."""
        pass

    @abstractmethod
    def generate_image(
        self, prompt: str, style: str = "PHOTOREALISTIC", aspect_ratio: str = "16:9"
    ) -> Dict[str, Any]:
        """
        Execute image generation call and return normalized payload dict:
        {
          "image_url": str,
          "revised_prompt": str,
          "engine": str,
          "dimensions": str,
          "status": str
        }
        """
        pass

    @abstractmethod
    def get_generation_status(self, task_id: str) -> Dict[str, Any]:
        """Query generation status for async tasks."""
        pass
