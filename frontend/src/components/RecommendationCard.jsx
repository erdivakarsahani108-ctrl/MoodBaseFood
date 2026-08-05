export default function RecommendationCard({ recommendation, index }) {
  const { food, match_score, match_reasons } = recommendation
  const course = String(index + 1).padStart(2, '0')

  return (
    <article className="rec-card" style={{ '--match': `${match_score}%` }}>
      <div className="rec-card-top">
        <span className="course-index">{course}</span>
        <div className="match-dial" aria-label={`${match_score}% match`}>
          <svg viewBox="0 0 40 40" className="dial-svg">
            <circle cx="20" cy="20" r="17" className="dial-track" />
            <circle cx="20" cy="20" r="17" className="dial-fill" />
          </svg>
          <span className="match-value">{Math.round(match_score)}%</span>
        </div>
      </div>

      <h3 className="rec-name">{food.name}</h3>
      <p className="rec-cuisine">{food.cuisine} · {food.prep_minutes} min · {food.calories} cal</p>
      <p className="rec-description">{food.description}</p>

      <div className="rec-tags">
        {food.flavor_tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <ul className="rec-reasons">
        {match_reasons.map((reason, i) => (
          <li key={i}>{reason}</li>
        ))}
      </ul>
    </article>
  )
}
