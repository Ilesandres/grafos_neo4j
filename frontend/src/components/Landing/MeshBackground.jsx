import { useMemo } from 'react'
import { useTheme } from '../../context/ThemeContext'

export default function MeshBackground() {
  const { theme } = useTheme()

  const colors = useMemo(
    () =>
      theme === 'dark'
        ? ['#0a0a1a', '#1a1a2e', '#16213e']
        : ['#e0f7fa', '#ede7f6', '#e8f5e9'],
    [theme],
  )

  const orbs = useMemo(
    () => [
      { size: 120, left: '30%', top: '20%', idx: 0 },
      { size: 160, left: '70%', top: '60%', idx: 1 },
      { size: 100, left: '50%', top: '80%', idx: 2 },
    ],
    [],
  )

  return (
    <div style={styles.container}>
      <div style={styles.mesh(colors)} />
      {orbs.map((o, i) => (
        <div
          key={i}
          style={styles.orb(o, colors[i])}
        />
      ))}
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  mesh: (colors) => ({
    position: 'absolute',
    inset: '-50%',
    background: `
      radial-gradient(ellipse at 20% 50%, ${colors[0]}88 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, ${colors[1]}88 0%, transparent 50%),
      radial-gradient(ellipse at 40% 80%, ${colors[2]}88 0%, transparent 50%)
    `,
    animation: 'meshShift 20s ease-in-out infinite alternate',
  }),
  orb: (o, color) => ({
    position: 'absolute',
    width: o.size,
    height: o.size,
    left: o.left,
    top: o.top,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color}44 0%, transparent 70%)`,
    animation: `orbFloat${o.idx} 12s ease-in-out infinite alternate`,
    willChange: 'transform',
  }),
}
