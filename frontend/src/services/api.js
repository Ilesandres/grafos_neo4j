const BASE = '/api/graph'

async function fetchJson(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
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

export function createNode(labels, properties) {
  return fetchJson(`${BASE}/nodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ labels, properties }),
  })
}

export function getNode(nodeId) {
  return fetchJson(`${BASE}/node/${encodeURIComponent(nodeId)}`)
}

export function updateNode(nodeId, properties) {
  return fetchJson(`${BASE}/node/${encodeURIComponent(nodeId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties }),
  })
}

export function deleteNode(nodeId) {
  return fetchJson(`${BASE}/node/${encodeURIComponent(nodeId)}`, {
    method: 'DELETE',
  })
}
