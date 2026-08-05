const SPICE_LABELS = ['Mild', 'Gentle heat', 'Spicy', 'Fiery']

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      className={`chip ${active ? 'chip-active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}

export default function PreferenceForm({ filters, prefs, setPrefs, onSubmit, loading }) {
  if (!filters) return null

  const toggleCuisine = (cuisine) => {
    setPrefs((p) => ({
      ...p,
      cuisines: p.cuisines.includes(cuisine)
        ? p.cuisines.filter((c) => c !== cuisine)
        : [...p.cuisines, cuisine],
    }))
  }

  const toggleMood = (tag) => {
    setPrefs((p) => ({
      ...p,
      mood_tags: p.mood_tags.includes(tag)
        ? p.mood_tags.filter((t) => t !== tag)
        : [...p.mood_tags, tag],
    }))
  }

  return (
    <form
      className="preference-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <fieldset>
        <legend>
          <span className="legend-index">01</span> Cuisines you're craving
        </legend>
        <div className="chip-row">
          {filters.cuisines.map((c) => (
            <Chip key={c} label={c} active={prefs.cuisines.includes(c)} onClick={() => toggleCuisine(c)} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <span className="legend-index">02</span> Dietary preference
        </legend>
        <div className="chip-row">
          <Chip
            label="Any"
            active={!prefs.diet}
            onClick={() => setPrefs((p) => ({ ...p, diet: null }))}
          />
          {filters.diets.map((d) => (
            <Chip
              key={d}
              label={d}
              active={prefs.diet === d}
              onClick={() => setPrefs((p) => ({ ...p, diet: d }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <span className="legend-index">03</span> Meal
        </legend>
        <div className="chip-row">
          <Chip
            label="Any"
            active={!prefs.meal_type}
            onClick={() => setPrefs((p) => ({ ...p, meal_type: null }))}
          />
          {filters.meal_types.map((m) => (
            <Chip
              key={m}
              label={m}
              active={prefs.meal_type === m}
              onClick={() => setPrefs((p) => ({ ...p, meal_type: m }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <span className="legend-index">04</span> Spice level: {SPICE_LABELS[(prefs.spice_level ?? 2) - 1]}
        </legend>
        <input
          type="range"
          min="1"
          max="4"
          value={prefs.spice_level ?? 2}
          onChange={(e) => setPrefs((p) => ({ ...p, spice_level: Number(e.target.value) }))}
          className="slider"
        />
      </fieldset>

      <fieldset>
        <legend>
          <span className="legend-index">05</span> Flavor mood
        </legend>
        <div className="chip-row">
          {filters.mood_tags.map((tag) => (
            <Chip key={tag} label={tag} active={prefs.mood_tags.includes(tag)} onClick={() => toggleMood(tag)} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <span className="legend-index">06</span> Max prep time: {prefs.max_prep_minutes} min
        </legend>
        <input
          type="range"
          min="5"
          max="60"
          step="5"
          value={prefs.max_prep_minutes}
          onChange={(e) => setPrefs((p) => ({ ...p, max_prep_minutes: Number(e.target.value) }))}
          className="slider"
        />
      </fieldset>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Composing your menu…' : 'Plate up my matches'}
      </button>
    </form>
  )
}
