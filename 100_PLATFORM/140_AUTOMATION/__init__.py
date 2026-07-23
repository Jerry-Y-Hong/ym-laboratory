"""
140_AUTOMATION Module
Data Pipeline, Collection Automation, and Bulk Collector.
"""
from .pipeline import FoodIngestionPipeline
from .bulk_collector import BulkCollector

__all__ = ["FoodIngestionPipeline", "BulkCollector"]
