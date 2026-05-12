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
      color: '#00E5FF',
    },
    {
      label: 'Labels',
      value: stats?.labels?.length ?? '—',
      icon: Tags,
      color: '#7C4DFF',
    },
    {
      label: 'Relationships',
      value: stats?.totalRelationships ?? '—',
      icon: Share2,
      color: '#00E676',
    },
    {
      label: 'Status',
      value: stats ? 'Connected' : 'Waiting',
      icon: Activity,
      color: stats ? '#00E676' : '#FF5252',
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
    color: '#fff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#fff',
    margin: '0.5rem 0 0.25rem',
  },
  cardLabel: {
    fontSize: '0.85rem',
    color: '#a0a0b8',
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
    color: '#00E5FF',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
}
