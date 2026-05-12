import { useState, useEffect } from 'react'
import { getNodes, getLabels } from '../../services/api'

export default function TableView() {
  const [nodes, setNodes] = useState([])
  const [labels, setLabels] = useState([])
  const [activeLabel, setActiveLabel] = useState(null)

  useEffect(() => {
    getLabels().then((data) => setLabels(data.labels)).catch(() => {})
  }, [])

  useEffect(() => {
    getNodes(activeLabel).then((data) => setNodes(data.nodes)).catch(() => {})
  }, [activeLabel])

  return (
    <div>
      <h3 style={styles.heading}>Table View</h3>

      <div style={styles.filterBar}>
        <span style={styles.filterLabel}>Filter by label:</span>
        <button
          style={{ ...styles.filterBtn, ...(!activeLabel ? styles.activeFilter : {}) }}
          onClick={() => setActiveLabel(null)}
        >
          All
        </button>
        {labels.map((l) => (
          <button
            key={l}
            style={{ ...styles.filterBtn, ...(activeLabel === l ? styles.activeFilter : {}) }}
            onClick={() => setActiveLabel(l)}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Labels</th>
              <th style={styles.th}>Properties</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((n) => (
              <tr key={n.id} style={styles.tr}>
                <td style={styles.td}>{n.id.slice(0, 12)}...</td>
                <td style={styles.td}>{n.labels.join(', ')}</td>
                <td style={styles.td}>
                  {Object.entries(n.properties || {}).slice(0, 3).map(([k, v]) => (
                    <span key={k} style={styles.prop}>{k}: {String(v).slice(0, 30)}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {nodes.length === 0 && <p style={styles.empty}>No nodes found.</p>}
      </div>
    </div>
  )
}

const styles = {
  heading: {
    margin: '0 0 1rem',
    fontWeight: 600,
    color: 'var(--text-inverse)',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  filterLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
  },
  filterBtn: {
    padding: '0.3rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  activeFilter: {
    background: 'rgba(0,229,255,0.15)',
    color: 'var(--accent)',
    borderColor: 'var(--accent)',
  },
  tableWrap: {
    overflowX: 'auto',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    transition: 'border 0.3s',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-color)',
    fontWeight: 600,
  },
  tr: {
    borderBottom: '1px solid var(--border-light)',
  },
  td: {
    padding: '0.65rem 1rem',
    color: 'var(--text-primary)',
  },
  prop: {
    display: 'inline-block',
    marginRight: '0.5rem',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    background: 'var(--bg-card)',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
}
