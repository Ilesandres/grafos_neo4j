import { useState, useEffect, useRef, useCallback } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { getNodes } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'

export default function GraphView() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const fgRef = useRef()
  const { theme } = useTheme()

  useEffect(() => {
    getNodes().then((data) => {
      const nodes = data.nodes.map((n) => ({
        id: n.id,
        name: n.properties?.name || n.properties?.title || n.labels?.[0] || n.id,
        label: n.labels?.[0] || 'Node',
      }))
      const links = data.relationships.map((r) => ({
        source: r.source,
        target: r.target,
        label: r.type,
      }))
      setGraphData({ nodes, links })
    }).catch(() => {})
  }, [])

  const nodeColor = useCallback((n) => {
    const isDark = theme === 'dark'
    const colors = {
      Person: isDark ? '#00e5ff' : '#0097a7',
      Company: isDark ? '#7c4dff' : '#6200ea',
      Product: isDark ? '#00e676' : '#00897b',
    }
    return colors[n.label] || (isDark ? '#ff5252' : '#d32f2f')
  }, [])

  return (
    <div>
      <h3 style={styles.heading}>Graph Visualization</h3>
      <p style={styles.hint}>Drag nodes • Scroll to zoom • Click to inspect</p>
      <div style={styles.graphContainer(theme)}>
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={nodeColor}
          nodeRelSize={6}
          linkDirectionalParticles={1}
          linkDirectionalParticleSpeed={0.005}
          linkLabel="label"
          backgroundColor={theme === 'dark' ? '#0d0d1a' : '#f5f5f9'}
          width={800}
          height={600}
        />
      </div>
    </div>
  )
}

const styles = {
  heading: {
    margin: '0 0 0.25rem',
    fontWeight: 600,
    color: 'var(--text-inverse)',
  },
  hint: {
    margin: '0 0 1rem',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  graphContainer: (theme) => ({
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'inline-block',
  }),
}
