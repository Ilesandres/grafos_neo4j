import { useState, useEffect, useRef } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { getNodes } from '../../services/api'

export default function GraphView() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const fgRef = useRef()

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

  return (
    <div>
      <h3 style={styles.heading}>Graph Visualization</h3>
      <p style={styles.hint}>Drag nodes • Scroll to zoom • Click to inspect</p>
      <div style={styles.graphContainer}>
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(n) => {
            const colors = { Person: '#00E5FF', Company: '#7C4DFF', Product: '#00E676' }
            return colors[n.label] || '#FF5252'
          }}
          nodeRelSize={6}
          linkDirectionalParticles={1}
          linkDirectionalParticleSpeed={0.005}
          linkLabel="label"
          backgroundColor="#0d0d1a"
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
    color: '#fff',
  },
  hint: {
    margin: '0 0 1rem',
    fontSize: '0.85rem',
    color: '#a0a0b8',
  },
  graphContainer: {
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'inline-block',
  },
}
