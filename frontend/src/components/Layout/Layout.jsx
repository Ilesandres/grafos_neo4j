import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
        <header style={styles.header}>
          <h2 style={styles.title}>Neo4j Graph Explorer</h2>
        </header>
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    transition: 'background 0.3s, color 0.3s',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid var(--border-light)',
  },
  title: {
    margin: 0,
    fontSize: '1.15rem',
    fontWeight: 600,
    color: 'var(--text-inverse)',
  },
  content: {
    flex: 1,
    padding: '1.5rem',
    overflow: 'auto',
  },
}
