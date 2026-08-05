import RecommendationCard from './RecommendationCard.jsx'

export default function RecommendationList({ recommendations, loading, error, hasSearched }) {
  if (error) {
    return (
      <div className="state-panel state-error">
        <h3>The kitchen hit a snag</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="state-panel state-loading">
        <div className="spinner" aria-hidden="true" />
        <p>Tasting through the menu…</p>
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="state-panel state-empty">
        <h3>Your menu is waiting</h3>
        <p>Set your preferences on the left and plate up your matches.</p>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="state-panel state-empty">
        <h3>Nothing fit that brief</h3>
        <p>Try loosening the prep-time limit or dietary filter.</p>
      </div>
    )
  }

  return (
    <div className="rec-grid">
      {recommendations.map((rec, i) => (
        <RecommendationCard key={rec.food.id} recommendation={rec} index={i} />
      ))}
    </div>
  )
}
