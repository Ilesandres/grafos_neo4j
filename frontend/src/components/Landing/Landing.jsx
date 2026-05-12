import { useNavigate } from 'react-router-dom'
import { Database, Network, BarChart3, ArrowRight } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <Network size={32} color="#00E5FF" />
          <span style={styles.logoText}>Neo4j Explorer</span>
        </div>
        <button style={styles.ctaBtn} onClick={() => navigate('/app')}>
          Launch App <ArrowRight size={18} />
        </button>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Explore Your Graph Database</h1>
          <p style={styles.subtitle}>
            Visualize, analyze, and interact with Neo4j nodes and relationships
            in real-time with an intuitive graphical interface.
          </p>
          <button style={styles.heroBtn} onClick={() => navigate('/app')}>
            Get Started
          </button>
        </section>

        <section style={styles.features}>
          <div style={styles.card}>
            <Database size={40} color="#00E5FF" />
            <h3>Live Connection</h3>
            <p>Direct Neo4j Bolt driver integration for real-time graph data fetching.</p>
          </div>
          <div style={styles.card}>
            <Network size={40} color="#7C4DFF" />
            <h3>Interactive Graph</h3>
            <p>Force-directed graph with drag, zoom, pan — explore relationships visually.</p>
          </div>
          <div style={styles.card}>
            <BarChart3 size={40} color="#00E676" />
            <h3>Dashboard Stats</h3>
            <p>Real-time node counts, label distribution, and database health metrics.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoText: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#fff',
  },
  ctaBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1.2rem',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  main: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  hero: {
    marginBottom: '5rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #00E5FF, #7C4DFF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.15rem',
    maxWidth: '600px',
    margin: '0 auto 2rem',
    lineHeight: 1.6,
    color: '#a0a0b8',
  },
  heroBtn: {
    padding: '0.8rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #00E5FF, #7C4DFF)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '2rem',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
  },
}
