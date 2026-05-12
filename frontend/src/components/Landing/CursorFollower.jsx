import { useEffect, useRef } from 'react'

export default function CursorFollower() {
  const dotRef = useRef()

  useEffect(() => {
    let rafId
    let mx = -200, my = -200

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
    }

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx - 6}px, ${my - 6}px)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <div ref={dotRef} style={styles.dot} />
}

const styles = {
  dot: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--accent)',
    pointerEvents: 'none',
    zIndex: 9999,
    willChange: 'transform',
    opacity: 0.5,
    mixBlendMode: 'difference',
  },
}
