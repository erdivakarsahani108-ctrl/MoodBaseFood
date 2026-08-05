"""
Simple, explainable content-based recommender.

Each food is scored against the user's stated preferences on five weighted
signals: cuisine match, diet compatibility, spice-level closeness, meal-type
fit, and flavor/mood tag overlap. Scores are normalized to a 0-100 match
percentage and a list of plain-language reasons is generated for each result.
"""
from typing import List
from models import Food, PreferenceRequest, Recommendation

WEIGHTS = {
    "cuisine": 30,
    "diet": 25,
    "spice": 15,
    "meal_type": 15,
    "mood": 15,
}


def _score_cuisine(food: Food, prefs: PreferenceRequest) -> tuple[float, str | None]:
    if not prefs.cuisines:
        return WEIGHTS["cuisine"] * 0.5, None
    if food.cuisine in prefs.cuisines:
        return WEIGHTS["cuisine"], f"Matches your love of {food.cuisine} cuisine"
    return 0.0, None


def _score_diet(food: Food, prefs: PreferenceRequest) -> tuple[float, str | None]:
    if not prefs.diet:
        return WEIGHTS["diet"] * 0.5, None
    if prefs.diet in food.diet:
        return WEIGHTS["diet"], f"Fits your {prefs.diet} diet"
    return 0.0, None


def _score_spice(food: Food, prefs: PreferenceRequest) -> tuple[float, str | None]:
    if prefs.spice_level is None:
        return WEIGHTS["spice"] * 0.5, None
    diff = abs(food.spice_level - prefs.spice_level)
    if diff == 0:
        return WEIGHTS["spice"], "Spice level is exactly what you asked for"
    if diff == 1:
        return WEIGHTS["spice"] * 0.6, "Spice level is close to your preference"
    return 0.0, None


def _score_meal_type(food: Food, prefs: PreferenceRequest) -> tuple[float, str | None]:
    if not prefs.meal_type:
        return WEIGHTS["meal_type"] * 0.5, None
    if prefs.meal_type in food.meal_type:
        return WEIGHTS["meal_type"], f"Great choice for {prefs.meal_type}"
    return 0.0, None


def _score_mood(food: Food, prefs: PreferenceRequest) -> tuple[float, str | None]:
    if not prefs.mood_tags:
        return WEIGHTS["mood"] * 0.5, None
    overlap = set(t.lower() for t in prefs.mood_tags) & set(t.lower() for t in food.flavor_tags)
    if overlap:
        pct = min(len(overlap) / len(prefs.mood_tags), 1.0)
        tags = ", ".join(sorted(overlap))
        return WEIGHTS["mood"] * pct, f"Delivers the {tags} flavor you're craving"
    return 0.0, None


def recommend(foods: List[Food], prefs: PreferenceRequest) -> List[Recommendation]:
    candidates = foods

    # Hard filters applied first so results always respect explicit constraints.
    if prefs.max_prep_minutes is not None:
        candidates = [f for f in candidates if f.prep_minutes <= prefs.max_prep_minutes]
    if prefs.diet:
        # Soft-preferred above, but if the diet is strict (vegan/vegetarian) treat as a hard filter
        if prefs.diet in ("vegan", "vegetarian"):
            candidates = [f for f in candidates if prefs.diet in f.diet]

    scored: List[Recommendation] = []
    for food in candidates:
        total = 0.0
        reasons: List[str] = []
        for scorer in (_score_cuisine, _score_diet, _score_spice, _score_meal_type, _score_mood):
            points, reason = scorer(food, prefs)
            total += points
            if reason:
                reasons.append(reason)

        max_possible = sum(WEIGHTS.values())
        match_score = round((total / max_possible) * 100, 1)
        if not reasons:
            reasons.append("A well-rounded pick based on overall popularity")

        scored.append(Recommendation(food=food, match_score=match_score, match_reasons=reasons))

    scored.sort(key=lambda r: r.match_score, reverse=True)
    return scored[: prefs.top_n]
