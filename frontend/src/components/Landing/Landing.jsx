import { useNavigate } from 'react-router-dom'
import {
  Database, Network, BarChart3, ArrowRight, Server, Code2,
  Box, Layers, Eye, Zap, Globe, ArrowDown,
} from 'lucide-react'
import CursorFollower from './CursorFollower'
import MeshBackground from './MeshBackground'
import GraphCanvas from './GraphCanvas'
import useScrollReveal from '../../hooks/useScrollReveal'

const features = [
  {
    icon: Database, title: 'Live Connection',
    desc: 'Direct Neo4j Bolt driver integration for real-time graph data fetching. Queries run in under 50ms.',
    color: 'var(--accent)',
  },
  {
    icon: Network, title: 'Interactive Graph',
    desc: 'Force-directed graph with drag, zoom, pan, and click-to-inspect. Explore relationships visually.',
    color: 'var(--accent-secondary)',
  },
  {
    icon: BarChart3, title: 'Dashboard Stats',
    desc: 'Real-time node counts, label distribution, relationship metrics, and connection health monitoring.',
    color: 'var(--accent-tertiary)',
  },
  {
    icon: Eye, title: 'Table View',
    desc: 'Filter and inspect raw node data in a clean tabular layout with property previews and label filtering.',
    color: 'var(--accent)',
  },
  {
    icon: Zap, title: 'Dark / Light Mode',
    desc: 'Full theme support with dark and light color schemes. Preference saved to localStorage.',
    color: 'var(--accent-secondary)',
  },
  {
    icon: Globe, title: 'RESTful API',
    desc: 'Well-documented API endpoints for nodes, relationships, labels, and statistics. Easy to extend.',
    color: 'var(--accent-tertiary)',
  },
]

const steps = [
  { num: '01', title: 'Connect', desc: 'Flask backend connects to Neo4j via the Bolt protocol using your credentials.' },
  { num: '02', title: 'Query', desc: 'The GraphService orchestrates Cypher queries through the repository interface.' },
  { num: '03', title: 'Serve', desc: 'REST endpoints return structured JSON with nodes, relationships, and stats.' },
  { num: '04', title: 'Visualize', desc: 'React renders force-directed graphs, tables, and dashboards from the data.' },
]

const techs = [
  { name: 'Python', color: '#3776AB' },
  { name: 'Flask', color: '#000' },
  { name: 'Neo4j', color: '#00E5FF' },
  { name: 'React', color: '#61DAFB' },
  { name: 'Vite', color: '#646CFF' },
  { name: 'Lucide', color: '#e0e0e0' },
]

export default function Landing() {
  const navigate = useNavigate()
  const revealRef = useScrollReveal()

  return (
    <div style={styles.wrapper}>
      <CursorFollower />
      <MeshBackground />

      <header style={styles.header}>
        <div style={styles.logo}>
          <Network size={28} color="var(--accent)" />
          <span style={styles.logoText}>Neo4j Explorer</span>
        </div>
        <button style={styles.ctaBtn} onClick={() => navigate('/app')}>
          Launch App <ArrowRight size={16} />
        </button>
      </header>

      <main ref={revealRef} style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Explore Your Graph Database</h1>
          <p style={styles.subtitle}>
            Visualize, analyze, and interact with Neo4j nodes and relationships
            in real-time through an intuitive graphical interface.
          </p>

          <GraphCanvas />

          <div style={styles.heroActions}>
            <button style={styles.heroBtn} onClick={() => navigate('/app')}>
              Get Started
            </button>
            <a href="#features" style={styles.ghostBtn}>
              Learn More <ArrowDown size={16} />
            </a>
          </div>
        </section>

        <section id="features" data-reveal style={styles.section}>
          <h2 style={styles.sectionTitle}>Everything You Need</h2>
          <p style={styles.sectionSub}>Explore graph data from any angle</p>
          <div style={styles.featuresGrid}>
            {features.map((f) => (
              <div key={f.title} style={styles.card}>
                <f.icon size={32} color={f.color} />
                <h3 style={styles.cardTitle}>{f.title}</h3>
                <p style={styles.cardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" data-reveal style={styles.section}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSub}>From database to visualization in four steps</p>
          <div style={styles.stepsGrid}>
            {steps.map((s) => (
              <div key={s.num} style={styles.stepCard}>
                <span style={styles.stepNum}>{s.num}</span>
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="tech-stack" data-reveal style={styles.section}>
          <h2 style={styles.sectionTitle}>Tech Stack</h2>
          <p style={styles.sectionSub}>Built with modern technologies</p>
          <div style={styles.techGrid}>
            {techs.map((t) => (
              <div key={t.name} style={styles.techCard}>
                <Code2 size={24} color={t.color} />
                <span style={styles.techName}>{t.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section data-reveal style={styles.section}>
          <div style={styles.archBox}>
            <h2 style={styles.sectionTitle}>Hexagonal Architecture</h2>
            <p style={styles.archSub}>
              Backend follows clean architecture with domain, infrastructure, and application layers
            </p>
            <div style={styles.archGrid}>
              <div style={styles.archCard}>
                <Layers size={24} color="var(--accent)" />
                <strong>Domain</strong><br />Entities, Ports, Services
              </div>
              <div style={styles.archCard}>
                <Server size={24} color="var(--accent-secondary)" />
                <strong>Infrastructure</strong><br />Neo4j Adapter, Config
              </div>
              <div style={styles.archCard}>
                <Box size={24} color="var(--accent-tertiary)" />
                <strong>Application</strong><br />Flask Routes, Blueprint
              </div>
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>Ready to explore your graph?</h2>
          <button style={styles.heroBtn} onClick={() => navigate('/app')}>
            Launch Neo4j Explorer <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer style={styles.footer}>
        <Network size={16} color="var(--accent)" />
        <span>Neo4j Graph Explorer &mdash; Built with Python + React</span>
      </footer>
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'relative',
    minHeight: '100vh',
    background: 'var(--landing-bg)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    transition: 'background 0.3s, color 0.3s',
  },
  header: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid var(--border-color)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoText: {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-bold)',
    fontFamily: 'var(--font-title)',
    color: 'var(--text-inverse)',
  },
  ctaBtn: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.5rem 1.2rem', border: '1px solid var(--border-color)',
    borderRadius: '8px', background: 'var(--bg-card)', color: 'var(--text-primary)',
    cursor: 'pointer', fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-body)',
  },
  main: {
    position: 'relative', zIndex: 1,
    maxWidth: '1040px', margin: '0 auto', padding: '3rem 2rem',
    textAlign: 'center',
  },
  hero: {
    marginBottom: '6rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
  },
  title: {
    fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)',
    fontFamily: 'var(--font-title)',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: 'var(--letter-spacing-tight)',
    lineHeight: 'var(--line-height-tight)',
  },
  subtitle: {
    fontSize: 'var(--font-size-lg)',
    fontFamily: 'var(--font-body)',
    maxWidth: '580px', lineHeight: 'var(--line-height-relaxed)',
    color: 'var(--text-secondary)',
  },
  heroActions: {
    display: 'flex', gap: '1rem', alignItems: 'center',
  },
  heroBtn: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.8rem 2rem', fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
    fontFamily: 'var(--font-body)',
    border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
    color: '#fff', cursor: 'pointer',
  },
  ghostBtn: {
    display: 'flex', alignItems: 'center', gap: '0.3rem',
    color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-body)',
    textDecoration: 'none', borderBottom: '1px solid transparent',
  },
  section: {
    marginBottom: '5rem', scrollMarginTop: '2rem',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'var(--font-weight-bold)',
    fontFamily: 'var(--font-title)',
    color: 'var(--text-inverse)',
    marginBottom: '0.5rem',
  },
  sectionSub: {
    color: 'var(--text-secondary)',
    marginBottom: '2.5rem',
    fontSize: 'var(--font-size-md)',
    fontFamily: 'var(--font-body)',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: 'var(--card-bg)', border: '1px solid var(--border-color)',
    borderRadius: '16px', padding: '1.75rem', textAlign: 'left',
    transition: 'transform 0.2s, border-color 0.2s',
    fontFamily: 'var(--font-body)',
  },
  cardTitle: {
    margin: '0.75rem 0 0.4rem',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
    fontFamily: 'var(--font-title)',
    color: 'var(--text-inverse)',
  },
  cardDesc: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--text-secondary)',
    lineHeight: 'var(--line-height-relaxed)',
    fontFamily: 'var(--font-body)',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem',
  },
  stepCard: {
    background: 'var(--card-bg)', border: '1px solid var(--border-color)',
    borderRadius: '16px', padding: '1.75rem', textAlign: 'left',
    fontFamily: 'var(--font-body)',
  },
  stepNum: {
    fontSize: 'var(--font-size-2xl)',
    fontWeight: 'var(--font-weight-extrabold)',
    color: 'var(--accent)', opacity: 0.5,
    fontFamily: 'var(--font-mono)',
  },
  stepTitle: {
    margin: '0.5rem 0 0.3rem',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
    fontFamily: 'var(--font-title)',
    color: 'var(--text-inverse)',
  },
  stepDesc: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--text-secondary)',
    lineHeight: 'var(--line-height-relaxed)',
    fontFamily: 'var(--font-body)',
  },
  techGrid: {
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem',
  },
  techCard: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.6rem 1.2rem', borderRadius: '10px',
    border: '1px solid var(--border-color)', background: 'var(--card-bg)',
    fontFamily: 'var(--font-body)',
  },
  techName: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
  },
  archBox: {
    background: 'var(--card-bg)', border: '1px solid var(--border-color)',
    borderRadius: '20px', padding: '2.5rem',
    fontFamily: 'var(--font-body)',
  },
  archSub: {
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
    fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-body)',
  },
  archGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  archCard: {
    padding: '1.25rem', borderRadius: '12px',
    border: '1px solid var(--border-color)',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-relaxed)',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
  },
  ctaSection: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
    marginBottom: '3rem',
  },
  ctaTitle: {
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'var(--font-weight-bold)',
    fontFamily: 'var(--font-title)',
    color: 'var(--text-inverse)',
  },
  footer: {
    position: 'relative', zIndex: 1,
    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
    padding: '1.5rem', borderTop: '1px solid var(--border-color)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
  },
}
