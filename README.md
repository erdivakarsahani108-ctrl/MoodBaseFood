# Palate — AI Food Recommendation System

A full-stack food recommendation app: a FastAPI backend that scores a food
catalog against user preferences, and a React (Vite) frontend for entering
preferences and browsing ranked results.

```
food-recommendation-system/
├── backend/
│   ├── main.py            # FastAPI app + routes
│   ├── models.py          # Pydantic schemas
│   ├── recommender.py     # Content-based scoring engine
│   ├── requirements.txt
│   └── data/
│       └── foods.json     # 30-item mock food catalog
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        ├── index.css
        └── components/
            ├── Header.jsx
            ├── PreferenceForm.jsx
            ├── RecommendationList.jsx
            └── RecommendationCard.jsx
```

## How recommendations work

`recommender.py` scores every food against five weighted signals:

| Signal      | Weight | Logic                                                        |
|-------------|--------|----------------------------------------------------------------|
| Cuisine     | 30     | Exact match against selected cuisines                         |
| Diet        | 25     | Vegan/vegetarian are hard filters; others are soft preferences |
| Spice level | 15     | Full points for exact match, partial for ±1                   |
| Meal type   | 15     | Exact match against breakfast/lunch/dinner/dessert             |
| Flavor mood | 15     | Overlap between requested mood tags and a dish's flavor tags   |

Scores are normalized to a 0–100 match percentage, and each result includes
plain-language reasons explaining why it was recommended. `max_prep_minutes`
is applied as a hard filter before scoring.

## Running the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Interactive docs are auto-
generated at `http://localhost:8000/docs`.

Key endpoints:
- `GET /api/foods` — full catalog
- `GET /api/foods/{id}` — single dish
- `GET /api/filters` — distinct cuisines/diets/meal types/mood tags for building UI controls
- `POST /api/recommend` — send a `PreferenceRequest` JSON body, get back ranked `Recommendation`s

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` and proxies `/api/*` requests
to the backend on port 8000 (see `vite.config.js`), so make sure the backend
is running first.

## Example request

```bash
curl -X POST http://localhost:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "cuisines": ["Indian", "Thai"],
    "diet": "vegetarian",
    "spice_level": 3,
    "meal_type": "dinner",
    "mood_tags": ["creamy", "comforting"],
    "max_prep_minutes": 45,
    "top_n": 5
  }'
```

## Notes

- The catalog lives in `backend/data/foods.json` — add dishes there and they
  are picked up automatically on server restart.
- CORS is wide open (`allow_origins=["*"]`) for local development; tighten
  this before deploying anywhere public.
- No database is used — this is an in-memory demo. Swapping `foods.json` for
  a real database is a drop-in change inside `main.py`'s `_load_foods()`.
