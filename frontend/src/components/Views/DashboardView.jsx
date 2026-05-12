import { useState, useEffect } from 'react'
import { Database, Tags, Share2, Activity } from 'lucide-react'
import { getStats } from '../../services/api'

export default function DashboardView() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStats().then(setStats).catch(() => {})
  }, [])

  const cards = [
    {
      label: 'Total Nodes',
      value: stats?.totalNodes ?? '—',
      icon: Database,
      color: 'var(--accent)',
    },
    {
      label: 'Labels',
      value: stats?.labels?.length ?? '—',
      icon: Tags,
      color: 'var(--accent-secondary)',
    },
    {
      label: 'Relationships',
      value: stats?.totalRelationships ?? '—',
      icon: Share2,
      color: 'var(--accent-tertiary)',
    },
    {
      label: 'Status',
      value: stats ? 'Connected' : 'Waiting',
      icon: Activity,
      color: stats ? 'var(--accent-tertiary)' : 'var(--accent-red)',
    },
  ]

  return (
    <div>
      <h3 style={styles.heading}>Dashboard</h3>
      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.label} style={styles.card}>
            <card.icon size={32} color={card.color} />
            <div style={styles.cardValue}>{card.value}</div>
            <div style={styles.cardLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      {stats?.labels && (
        <div style={styles.section}>
          <h4 style={styles.heading}>Available Labels</h4>
          <div style={styles.labelList}>
            {stats.labels.map((label) => (
              <span key={label} style={styles.labelBadge}>{label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  heading: {
    margin: '0 0 1rem',
    fontWeight: 600,
    color: 'var(--text-inverse)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  card: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    transition: 'background 0.3s, border 0.3s',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-inverse)',
    margin: '0.5rem 0 0.25rem',
  },
  cardLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  section: {
    marginTop: '1rem',
  },
  labelList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  labelBadge: {
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    background: 'rgba(0,229,255,0.1)',
    color: 'var(--accent)',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
}
