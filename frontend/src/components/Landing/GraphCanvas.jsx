import { useEffect, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

const NODES = 12
const EDGES = 18

function createGraph(w, h) {
  const nodes = []
  for (let i = 0; i < NODES; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: 3 + Math.random() * 5,
    })
  }
  const edges = []
  for (let i = 0; i < EDGES; i++) {
    const a = Math.floor(Math.random() * NODES)
    let b = Math.floor(Math.random() * NODES)
    while (b === a) b = Math.floor(Math.random() * NODES)
    edges.push({ a, b })
  }
  return { nodes, edges }
}

export default function GraphCanvas() {
  const canvasRef = useRef()
  const simRef = useRef()
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      ctx.scale(dpr, dpr)
      simRef.current = createGraph(rect.width, rect.height)
    }
    resize()

    let rafId

    const draw = () => {
      const { nodes, edges } = simRef.current
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      const accent = theme === 'dark' ? '#00e5ff' : '#0097a7'
      const muted = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
      const nodeFill = theme === 'dark' ? '#00e5ff' : '#0097a7'

      ctx.strokeStyle = muted
      ctx.lineWidth = 1
      for (const e of edges) {
        ctx.beginPath()
        ctx.moveTo(nodes[e.a].x, nodes[e.a].y)
        ctx.lineTo(nodes[e.b].x, nodes[e.b].y)
        ctx.stroke()
      }

      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = nodeFill
        ctx.globalAlpha = 0.3
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.fillStyle = accent
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [theme])

  return (
    <div style={styles.wrap}>
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  )
}

const styles = {
  wrap: {
    width: '100%',
    maxWidth: '500px',
    height: '320px',
    margin: '0 auto',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
  },
  canvas: {
    display: 'block',
  },
}
