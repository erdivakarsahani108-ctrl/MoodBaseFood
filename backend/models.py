from typing import List, Optional
from pydantic import BaseModel, Field


class Food(BaseModel):
    id: int
    name: str
    cuisine: str
    meal_type: List[str]
    diet: List[str]
    spice_level: int
    flavor_tags: List[str]
    prep_minutes: int
    calories: int
    description: str


class PreferenceRequest(BaseModel):
    cuisines: List[str] = Field(default_factory=list, description="Preferred cuisines, e.g. ['Indian', 'Italian']")
    diet: Optional[str] = Field(default=None, description="'vegetarian', 'vegan', 'pescatarian', 'non-vegetarian', or None for any")
    spice_level: Optional[int] = Field(default=None, ge=1, le=4, description="Desired spice level 1-4")
    meal_type: Optional[str] = Field(default=None, description="'breakfast', 'lunch', 'dinner', or 'dessert'")
    max_prep_minutes: Optional[int] = Field(default=None, description="Maximum acceptable preparation time")
    mood_tags: List[str] = Field(default_factory=list, description="Flavor/mood keywords, e.g. ['comforting', 'fresh']")
    top_n: int = Field(default=6, ge=1, le=30)


class Recommendation(BaseModel):
    food: Food
    match_score: float
    match_reasons: List[str]


class RecommendationResponse(BaseModel):
    recommendations: List[Recommendation]
    total_considered: int
