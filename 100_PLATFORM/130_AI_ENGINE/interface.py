"""
Abstract Base AI Engine Interface
Defines contracts for future AI processing modules without locking into specific LLM vendors.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAIEngineInterface(ABC):
    @abstractmethod
    def process_semantic_enrichment(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Abstract method for extracting semantic knowledge nodes from raw food payloads."""
        pass

    @abstractmethod
    def generate_embeddings(self, text_content: str) -> list[float]:
        """Abstract method for generating text vector embeddings."""
        pass
