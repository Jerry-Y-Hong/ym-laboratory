"""
Food Data Ingestion Pipeline Orchestrator
Automates fetching from OpenAPI -> RAW Layer (with Source Metadata) -> STANDARD Layer -> SEMANTIC Layer.
"""
import importlib
from typing import Dict, Any, Optional

api_wrapper_mod = importlib.import_module("100_PLATFORM.110_API.rda_food_api")
RDAFoodAPIWrapper = api_wrapper_mod.RDAFoodAPIWrapper

raw_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.raw_repository")
RAWRepository = raw_repo_mod.RAWRepository

std_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.standard_repository")
StandardRepository = std_repo_mod.StandardRepository

sem_repo_mod = importlib.import_module("100_PLATFORM.120_DATABASE.repository.semantic_repository")
SemanticRepository = sem_repo_mod.SemanticRepository

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

class FoodIngestionPipeline:
    def __init__(
        self,
        api_wrapper: Optional[RDAFoodAPIWrapper] = None,
        raw_repo: Optional[RAWRepository] = None,
        std_repo: Optional[StandardRepository] = None,
        sem_repo: Optional[SemanticRepository] = None
    ):
        self.api_wrapper = api_wrapper or RDAFoodAPIWrapper()
        self.raw_repo = raw_repo or RAWRepository()
        self.std_repo = std_repo or StandardRepository()
        self.sem_repo = sem_repo or SemanticRepository()

    def run_full_e2e_ingestion(
        self,
        food_code: str,
        source_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Runs full 3-Tier End-to-End Ingestion Pipeline (API -> RAW -> STANDARD -> SEMANTIC)."""
        platform_logger.info(f"[E2E Pipeline] Starting Full 3-Tier Ingestion for '{food_code}'")

        # 1. API Fetch
        food_dto = self.api_wrapper.get_food(food_code)
        recipe_dto = self.api_wrapper.get_recipe(f"RC_{food_code}")

        # 2. RAW Layer Storage (Immutable & SHA-256 Hash Idempotent with Source Metadata)
        raw_id = self.raw_repo.save_raw_payload(
            source_system="RDA_AGRICULTURAL_SCIENCE_OPENAPI",
            endpoint="food/detail",
            target_code=food_code,
            raw_data=food_dto.raw_payload,
            source_metadata=source_metadata
        )

        # 3. STANDARD Layer Storage
        std_food_id = self.std_repo.save_standard_food(food_dto, raw_id)

        # 4. SEMANTIC Layer Storage (Knowledge Graph & Relations)
        food_node_id = self.sem_repo.save_knowledge_node(
            entity_type="FOOD",
            entity_id=std_food_id,
            canonical_name=food_dto.food_name_ko,
            metadata={"category": food_dto.category_name, "raw_id": raw_id}
        )
        recipe_node_id = self.sem_repo.save_knowledge_node(
            entity_type="RECIPE",
            entity_id=recipe_dto.recipe_id,
            canonical_name=recipe_dto.recipe_name,
            metadata={"cooking_time": recipe_dto.cooking_time_minutes}
        )
        rel_id = self.sem_repo.save_relation(
            source_node_id=food_node_id,
            target_node_id=recipe_node_id,
            relation_type="HAS_RECIPE",
            weight=1.0
        )

        platform_logger.info(f"[E2E Pipeline] PASS for '{food_code}'. RAW={raw_id}, STD={std_food_id}, NODE={food_node_id}")

        return {
            "food_code": food_code,
            "raw_id": raw_id,
            "std_food_id": std_food_id,
            "food_node_id": food_node_id,
            "recipe_node_id": recipe_node_id,
            "relation_id": rel_id,
            "status": "PASS"
        }

    def run_food_ingestion(self, food_code: str) -> Dict[str, str]:
        """Backward compatible ingestion pipeline method."""
        return self.run_full_e2e_ingestion(food_code)
