const BASE = '/api/graph'

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function getNodes(label) {
  const url = label ? `${BASE}/nodes/${label}` : `${BASE}/nodes`
  return fetchJson(url)
}

export function getLabels() {
  return fetchJson(`${BASE}/labels`)
}

export function getStats() {
  return fetchJson(`${BASE}/stats`)
}
