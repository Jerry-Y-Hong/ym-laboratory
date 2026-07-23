"""
Generic Request & Response DTO Models for Food API Layer
Designed for any food domain (not limited to Kimchi).
"""
from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field

@dataclass
class GenericFoodDTO:
    food_code: str
    food_name_ko: str
    food_name_en: Optional[str] = None
    category_code: Optional[str] = None
    category_name: Optional[str] = None
    origin_source: str = "RDA_NONGSARO"
    raw_payload: Dict[str, Any] = field(default_factory=dict)

@dataclass
class GenericRecipeDTO:
    recipe_id: str
    recipe_name: str
    food_code: Optional[str] = None
    cooking_time_minutes: Optional[int] = None
    difficulty_level: Optional[str] = None
    servings: Optional[int] = None
    ingredients: List[Dict[str, Any]] = field(default_factory=list)
    cooking_steps: List[str] = field(default_factory=list)
    raw_payload: Dict[str, Any] = field(default_factory=dict)

@dataclass
class GenericNutrientDTO:
    food_code: str
    calories_kcal: Optional[float] = None
    carbohydrates_g: Optional[float] = None
    protein_g: Optional[float] = None
    fat_g: Optional[float] = None
    sodium_mg: Optional[float] = None
    dietary_fiber_g: Optional[float] = None
    additional_nutrients: Dict[str, float] = field(default_factory=dict)
    raw_payload: Dict[str, Any] = field(default_factory=dict)

@dataclass
class GenericImageDTO:
    image_id: str
    food_code_or_recipe_id: str
    image_url: str
    image_type: str = "FOOD_THUMBNAIL"
    caption: Optional[str] = None
    raw_payload: Dict[str, Any] = field(default_factory=dict)
