import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import PreferenceForm from './components/PreferenceForm.jsx'
import RecommendationList from './components/RecommendationList.jsx'
import { fetchFilters, fetchRecommendations } from './api.js'

const DEFAULT_PREFS = {
  cuisines: [],
  diet: null,
  spice_level: 2,
  meal_type: null,
  mood_tags: [],
  max_prep_minutes: 45,
  top_n: 6,
}

export default function App() {
  const [filters, setFilters] = useState(null)
  const [prefs, setPrefs] = useState(DEFAULT_PREFS)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [filtersError, setFiltersError] = useState(null)

  useEffect(() => {
    fetchFilters()
      .then(setFilters)
      .catch((err) => setFiltersError(err.message))
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRecommendations(prefs)
      setRecommendations(data.recommendations)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setHasSearched(true)
    }
  }

  return (
    <div className="app-shell">
      <Header />

      {filtersError && (
        <div className="state-panel state-error api-warning">
          <h3>Can't reach the backend</h3>
          <p>
            Make sure the FastAPI server is running on <code>http://localhost:8000</code>. ({filtersError})
          </p>
        </div>
      )}

      <main className="layout">
        <section className="panel form-panel">
          <PreferenceForm
            filters={filters}
            prefs={prefs}
            setPrefs={setPrefs}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </section>

        <section className="panel results-panel">
          <div className="results-heading">
            <span className="legend-index">07</span>
            <h2>Your tasting menu</h2>
          </div>
          <RecommendationList
            recommendations={recommendations}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
          />
        </section>
      </main>

      <footer className="site-footer">
        <p>Palate · a content-based recommendation demo built with React + FastAPI</p>
      </footer>
    </div>
  )
}
