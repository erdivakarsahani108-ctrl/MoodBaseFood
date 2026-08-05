const BASE = '/api'

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`Request failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function fetchFilters() {
  const res = await fetch(`${BASE}/filters`)
  return handle(res)
}

export async function fetchRecommendations(preferences) {
  const res = await fetch(`${BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  })
  return handle(res)
}
