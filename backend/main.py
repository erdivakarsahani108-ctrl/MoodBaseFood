import json
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import Food, PreferenceRequest, RecommendationResponse
from recommender import recommend

DATA_PATH = Path(__file__).parent / "data" / "foods.json"

app = FastAPI(
    title="AI Food Recommendation API",
    description="Content-based food recommendation engine",
    version="1.0.0",
)

# Allow the Vite dev server (and any local frontend) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _load_foods() -> List[Food]:
    with open(DATA_PATH, "r", encoding="utf-8") as fh:
        raw = json.load(fh)
    return [Food(**item) for item in raw]


FOODS: List[Food] = _load_foods()


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/foods", response_model=List[Food])
def list_foods():
    """Return the full food catalog."""
    return FOODS


@app.get("/api/foods/{food_id}", response_model=Food)
def get_food(food_id: int):
    for food in FOODS:
        if food.id == food_id:
            return food
    raise HTTPException(status_code=404, detail="Food not found")


@app.get("/api/filters")
def get_filters():
    """Return the distinct filter values available, for populating UI dropdowns."""
    cuisines = sorted({f.cuisine for f in FOODS})
    diets = sorted({d for f in FOODS for d in f.diet})
    meal_types = sorted({m for f in FOODS for m in f.meal_type})
    mood_tags = sorted({t for f in FOODS for t in f.flavor_tags})
    return {
        "cuisines": cuisines,
        "diets": diets,
        "meal_types": meal_types,
        "mood_tags": mood_tags,
        "spice_levels": [1, 2, 3, 4],
    }


@app.post("/api/recommend", response_model=RecommendationResponse)
def get_recommendations(prefs: PreferenceRequest):
    """Score the full catalog against the user's preferences and return the top matches."""
    results = recommend(FOODS, prefs)
    return RecommendationResponse(recommendations=results, total_considered=len(FOODS))
