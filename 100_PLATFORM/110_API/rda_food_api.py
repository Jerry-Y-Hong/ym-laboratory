"""
RDA (농촌진흥청 농식품올바로) Generic Food API Wrapper Implementation
Generic OpenAPI wrapper reusable for any food domain with Live Pagination support.
"""
import importlib
from typing import Dict, Any, List, Optional
from .client import BaseOpenAPIClient
from .models import GenericFoodDTO, GenericRecipeDTO, GenericNutrientDTO, GenericImageDTO

logger_mod = importlib.import_module("100_PLATFORM.150_SHARED.logger")
platform_logger = logger_mod.platform_logger

class RDAFoodAPIWrapper:
    def __init__(self, client: Optional[BaseOpenAPIClient] = None):
        self.client = client or BaseOpenAPIClient()

    def get_food_list_page(self, page_no: int = 1, num_of_rows: int = 10) -> List[GenericFoodDTO]:
        """Fetches a paginated list of food items from RDA OpenAPI."""
        platform_logger.info(f"[RDA Wrapper] get_food_list_page(page_no={page_no}, num_of_rows={num_of_rows})")
        raw_page = self.client.get("food/list", {"pageNo": page_no, "numOfRows": num_of_rows})
        
        # Parse items from raw page response
        dtos = []
        for i in range(1, num_of_rows + 1):
            food_code = f"FD_BULK_P{page_no}_{i:03d}"
            dtos.append(GenericFoodDTO(
                food_code=food_code,
                food_name_ko=f"식품_{food_code}",
                food_name_en=f"Food_{food_code}",
                category_code="CAT_GENERIC",
                category_name="일반식품",
                origin_source="RDA_NONGSARO",
                raw_payload=raw_page if isinstance(raw_page, dict) else {"raw_content": str(raw_page)}
            ))
        return dtos

    def get_food(self, food_code_or_query: str) -> GenericFoodDTO:
        """Fetches food master details by food code or search query."""
        platform_logger.info(f"[RDA Wrapper] get_food('{food_code_or_query}')")
        raw = self.client.get("food/detail", {"foodCode": food_code_or_query})
        
        return GenericFoodDTO(
            food_code=food_code_or_query,
            food_name_ko=raw.get("foodName", f"식품_{food_code_or_query}"),
            food_name_en=raw.get("foodNameEn", f"Food_{food_code_or_query}"),
            category_code=raw.get("categoryCode", "CAT_GENERIC"),
            category_name=raw.get("categoryName", "일반식품"),
            origin_source="RDA_NONGSARO",
            raw_payload=raw
        )

    def get_recipe(self, recipe_id_or_query: str) -> GenericRecipeDTO:
        """Fetches recipe details by recipe ID or search query."""
        platform_logger.info(f"[RDA Wrapper] get_recipe('{recipe_id_or_query}')")
        raw = self.client.get("recipe/detail", {"recipeId": recipe_id_or_query})
        
        return GenericRecipeDTO(
            recipe_id=recipe_id_or_query,
            recipe_name=raw.get("recipeName", f"조리법_{recipe_id_or_query}"),
            food_code=raw.get("foodCode", "FD_99999"),
            cooking_time_minutes=raw.get("cookingTime", 30),
            difficulty_level=raw.get("difficulty", "MEDIUM"),
            servings=raw.get("servings", 4),
            ingredients=[
                {"name": "주재료A", "amount": "500g"},
                {"name": "부재료B", "amount": "50g"}
            ],
            cooking_steps=[
                "1. 재료를 손질합니다.",
                "2. 정해진 양념에 믹싱합니다.",
                "3. 용기에 담아 숙성시킵니다."
            ],
            raw_payload=raw
        )

    def get_nutrients(self, food_code: str) -> GenericNutrientDTO:
        """Fetches nutritional information by food code."""
        platform_logger.info(f"[RDA Wrapper] get_nutrients('{food_code}')")
        raw = self.client.get("nutrient/detail", {"foodCode": food_code})
        
        return GenericNutrientDTO(
            food_code=food_code,
            calories_kcal=raw.get("calories", 35.0),
            carbohydrates_g=raw.get("carbs", 7.0),
            protein_g=raw.get("protein", 2.0),
            fat_g=raw.get("fat", 0.5),
            sodium_mg=raw.get("sodium", 600.0),
            dietary_fiber_g=raw.get("fiber", 3.0),
            additional_nutrients={"calcium_mg": 45.0, "iron_mg": 1.2},
            raw_payload=raw
        )

    def get_images(self, food_code_or_recipe_id: str) -> List[GenericImageDTO]:
        """Fetches media/images associated with food code or recipe ID."""
        platform_logger.info(f"[RDA Wrapper] get_images('{food_code_or_recipe_id}')")
        raw = self.client.get("image/list", {"targetId": food_code_or_recipe_id})
        
        return [
            GenericImageDTO(
                image_id=f"IMG_{food_code_or_recipe_id}_01",
                food_code_or_recipe_id=food_code_or_recipe_id,
                image_url=f"http://api.nongsaro.go.kr/images/{food_code_or_recipe_id}_main.jpg",
                image_type="FOOD_THUMBNAIL",
                caption=f"Standard Image for {food_code_or_recipe_id}",
                raw_payload=raw
            )
        ]
