import { useState, useEffect, useRef, useCallback } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { getNodes } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'

export default function GraphView() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [ready, setReady] = useState(false)
  const fgRef = useRef()
  const { theme } = useTheme()

  useEffect(() => {
    getNodes()
      .then((data) => {
        const nodes = data.nodes.map((n) => ({
          id: n.id,
          name: n.properties?.nombre || n.properties?.name || n.properties?.title || n.labels?.[0] || n.id.slice(0, 8),
          label: n.labels?.[0] || 'Node',
        }))
        const links = data.relationships.map((r) => ({
          source: r.source,
          target: r.target,
          type: r.type,
        }))
        setGraphData({ nodes, links })
        setReady(true)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!ready || !fgRef.current) return
    try {
      const fg = fgRef.current
      fg.d3Force('link')?.distance(160)
      fg.d3Force('charge')?.strength(-500)
      fg.d3Force('center', null)
    } catch (e) {
      // non-critical
    }
  }, [ready])

  const isDark = theme === 'dark'

  const linkLabel = useCallback((l) => l.type, [])

  const paintLink = useCallback((link, ctx) => {
    if (typeof link.source !== 'object' || typeof link.target !== 'object') return
    const text = link.type
    if (!text) return
    const { x: sx, y: sy } = link.source
    const { x: tx, y: ty } = link.target
    const mx = (sx + tx) / 2
    const my = (sy + ty) / 2
    const angle = Math.atan2(ty - sy, tx - sx)
    const bg = isDark ? 'rgba(13,13,26,0.75)' : 'rgba(245,245,249,0.75)'
    const fg = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'
    ctx.save()
    ctx.translate(mx, my)
    ctx.rotate(angle)
    ctx.font = '3.5px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    const w = ctx.measureText(text).width
    ctx.fillStyle = bg
    ctx.fillRect(-w / 2 - 2, -5, w + 4, 8)
    ctx.fillStyle = fg
    ctx.fillText(text, 0, -2)
    ctx.restore()
  }, [isDark])

  const paintNode = useCallback((node, ctx) => {
    const label = node.name
    if (!label) return
    ctx.save()
    ctx.font = '4px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'
    ctx.fillText(label, node.x, node.y + 5)
    ctx.restore()
  }, [isDark])

  const nodeColor = useCallback((n) => {
    const pal = {
      Persona: '#00e5ff', Microservicio: '#7c4dff', Interfaz: '#00e676',
      Servicio: '#ffab00', BaseDatos: '#ff5252', Dispositivo: '#ff80ab',
      Servidor: '#b388ff', Entidad: '#ffd740',
    }
    return pal[n.label] || '#888'
  }, [])

  return (
    <div>
      <h3 style={s.heading}>Graph Visualization</h3>
      <p style={s.hint}>Drag nodes to rearrange &bull; Scroll to zoom</p>
      {ready ? (
        <div style={s.wrap}>
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            nodeLabel="name"
            nodeColor={nodeColor}
            nodeRelSize={8}
            nodeCanvasObjectMode={() => 'after'}
            nodeCanvasObject={paintNode}
            linkLabel={linkLabel}
            linkCanvasObject={paintLink}
            linkColor={() => (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.003}
            linkDirectionalArrowLength={8}
            linkDirectionalArrowRelPos={0.95}
            backgroundColor={isDark ? '#0d0d1a' : '#f5f5f9'}
            width={800}
            height={600}
          />
        </div>
      ) : (
        <div style={s.loading}>Loading graph data...</div>
      )}
    </div>
  )
}

const s = {
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
  wrap: {
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'inline-block',
  },
  loading: {
    padding: '3rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-sm)',
  },
}
