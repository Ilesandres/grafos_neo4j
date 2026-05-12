import { useState, useEffect, useRef, useCallback } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { getNodes } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'

export default function GraphView() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const fgRef = useRef()
  const containerRef = useRef()
  const { theme } = useTheme()

  useEffect(() => {
    getNodes().then((data) => {
      const nodes = data.nodes.map((n) => ({
        id: n.id,
        name: n.properties?.nombre || n.properties?.name || n.properties?.title || n.labels?.[0] || n.id.slice(0, 8),
        label: n.labels?.[0] || 'Node',
        properties: n.properties || {},
      }))
      const links = data.relationships.map((r) => ({
        source: r.source,
        target: r.target,
        type: r.type,
        properties: r.properties || {},
      }))
      setGraphData({ nodes, links })
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDimensions({ width: Math.max(width, 400), height: Math.max(height, 400) })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const fg = fgRef.current
    if (!fg || graphData.nodes.length === 0) return

    fg.d3Force('link').distance(160)
    fg.d3Force('charge').strength(-500)
    fg.d3Force('center', null)
    fg.d3AlphaDecay(0.02)
    fg.d3VelocityDecay(0.3)
  }, [graphData])

  const handleEngineStop = useCallback(() => {
    const fg = fgRef.current
    if (fg) {
      fg.d3AlphaDecay(0.5)
    }
  }, [])

  const isDark = theme === 'dark'

  const nodeColor = useCallback((n) => {
    const colors = {
      Persona: isDark ? '#00e5ff' : '#0097a7',
      Microservicio: isDark ? '#7c4dff' : '#6200ea',
      Interfaz: isDark ? '#00e676' : '#00897b',
      Servicio: isDark ? '#ffab00' : '#f57c00',
      BaseDatos: isDark ? '#ff5252' : '#d32f2f',
      Dispositivo: isDark ? '#ff80ab' : '#c2185b',
      Servidor: isDark ? '#b388ff' : '#7c4dff',
      Entidad: isDark ? '#ffd740' : '#f9a825',
    }
    return colors[n.label] || '#888'
  }, [isDark])

  const linkColor = useCallback((link) => {
    const palette = {
      DESARROLLA: isDark ? '#4fc3f7' : '#0288d1',
      COLABORA_CON: isDark ? '#aed581' : '#689f38',
      SOLICITA: isDark ? '#ffb74d' : '#e65100',
      REDIRECCIONA: isDark ? '#e0e0e0' : '#616161',
      HOSTEA: isDark ? '#ce93d8' : '#7b1fa2',
      USA: isDark ? '#ef9a9a' : '#c62828',
      CONECTA: isDark ? '#80cbc4' : '#00695c',
    }
    return palette[link.type] || (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)')
  }, [isDark])

  return (
    <div>
      <h3 style={styles.heading}>Graph Visualization</h3>
      <p style={styles.hint}>Drag nodes to rearrange • Scroll to zoom • Relationship labels shown on each edge</p>
      <div ref={containerRef} style={styles.graphContainer}>
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={nodeColor}
          nodeRelSize={8}
          linkColor={linkColor}
          linkWidth={1.5}
          linkDirectionalArrowLength={8}
          linkDirectionalArrowRelPos={0.95}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.003}
          linkCanvasObject={(link, ctx) => {
            const text = link.type
            if (!text) return

            const start = link.source
            const end = link.target
            if (!start || !end || typeof start.x !== 'number' || typeof end.x !== 'number') return

            const mx = (start.x + end.x) / 2
            const my = (start.y + end.y) / 2
            const dx = end.x - start.x
            const dy = end.y - start.y
            const angle = Math.atan2(dy, dx)

            ctx.save()
            ctx.translate(mx, my)
            ctx.rotate(angle)

            ctx.font = '9px monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'

            const padding = 4
            const label = text.replace(/_/g, ' ')
            const textWidth = ctx.measureText(label).width

            ctx.fillStyle = isDark ? 'rgba(13,13,26,0.8)' : 'rgba(245,245,249,0.85)'
            ctx.fillRect(-textWidth / 2 - padding, -14, textWidth + padding * 2, 18)

            ctx.fillStyle = isDark ? '#4fc3f7' : '#0288d1'
            ctx.fillText(label, 0, -2)

            ctx.restore()
          }}
          onEngineStop={handleEngineStop}
          backgroundColor={isDark ? '#0d0d1a' : '#f5f5f9'}
          width={dimensions.width}
          height={dimensions.height}
          warmupTicks={200}
          cooldownTicks={0}
        />
      </div>
    </div>
  )
}

const styles = {
  heading: {
    margin: '0 0 0.25rem',
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-lg)',
    fontFamily: 'var(--font-title)',
    color: 'var(--text-inverse)',
  },
  hint: {
    margin: '0 0 1rem',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
  },
  graphContainer: {
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
    width: '100%',
    height: '600px',
  },
}
