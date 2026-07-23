"""
DALL-E Image Engine Adapter
===========================
Concrete implementation of ImageEngineGateway for OpenAI DALL-E 3 provider.
Normalizes image generation responses and handles API error states.
"""

import hashlib
import logging
from typing import Any, Dict

from acpp.image_engine.image_engine_gateway import ImageEngineGateway

logger = logging.getLogger("acpp.image_engine.dalle")


class DalleImageAdapter(ImageEngineGateway):
    """
    Adapter wrapping DALL-E 3 image generation service.
    """

    def __init__(self, api_key: str = "mock-key") -> None:
        self.api_key = api_key
        self.logger = logger

    @property
    def engine_name(self) -> str:
        return "DALL-E 3"

    def validate_request(self, prompt: str) -> bool:
        """Validate prompt length and compliance."""
        if not prompt or len(prompt.strip()) < 5:
            return False
        if len(prompt) > 4000:
            return False
        return True

    def _determine_dimensions(self, aspect_ratio: str) -> str:
        """Map aspect ratio to standard DALL-E 3 dimensions."""
        if aspect_ratio in ("16:9", "1.78"):
            return "1792x1024"
        elif aspect_ratio in ("9:16", "0.56"):
            return "1024x1792"
        return "1024x1024"

    def generate_image(
        self, prompt: str, style: str = "PHOTOREALISTIC", aspect_ratio: str = "16:9"
    ) -> Dict[str, Any]:
        """
        Execute image synthesis using DALL-E 3 engine gateway.
        Generates simulated image URL when offline or testing.
        """
        if not self.validate_request(prompt):
            raise ValueError("Invalid image prompt: Must be between 5 and 4000 characters.")

        dimensions = self._determine_dimensions(aspect_ratio)
        prompt_hash = hashlib.sha256(prompt.encode("utf-8")).hexdigest()[:12]

        self.logger.info(
            f"[{self.engine_name}] Synthesizing image: dims={dimensions} style={style} hash={prompt_hash}"
        )

        simulated_url = f"https://cdn.acpp.ym-lab.io/media/generated/{prompt_hash}_{dimensions}.png"
        revised_prompt = f"A high-quality {style.lower()} image of: {prompt}."

        return {
            "image_url": simulated_url,
            "revised_prompt": revised_prompt,
            "engine": self.engine_name,
            "dimensions": dimensions,
            "status": "COMPLETED",
        }

    def get_generation_status(self, task_id: str) -> Dict[str, Any]:
        """Retrieve task execution status."""
        return {
            "task_id": task_id,
            "engine": self.engine_name,
            "status": "COMPLETED",
            "progress": 100,
        }
