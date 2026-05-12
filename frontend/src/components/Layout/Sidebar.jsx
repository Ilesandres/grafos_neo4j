import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Network, Table2, LogOut, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const links = [
  { to: '/app', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/graph', label: 'Graph View', icon: Network },
  { to: '/app/table', label: 'Table View', icon: Table2 },
]

export default function Sidebar() {
  const { theme, toggle } = useTheme()

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <Network size={24} color="var(--accent)" />
        <span style={styles.logoText}>Neo4j</span>
      </div>

      <nav style={styles.nav}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            <link.icon size={18} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.spacer} />

      <button onClick={toggle} style={styles.themeBtn}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      <a href="/" style={styles.link}>
        <LogOut size={18} />
        <span>Exit</span>
      </a>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '220px',
    minHeight: '100vh',
    background: 'var(--sidebar-bg)',
    borderRight: '1px solid var(--border-light)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0',
    transition: 'background 0.3s',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    marginBottom: '1.5rem',
  },
  logoText: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: 'var(--text-inverse)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    padding: '0 0.5rem',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.65rem 0.75rem',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.15s',
  },
  activeLink: {
    background: 'rgba(0,229,255,0.1)',
    color: 'var(--accent)',
    fontWeight: 500,
  },
  spacer: {
    flex: 1,
  },
  themeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.65rem 0.75rem',
    margin: '0 0.5rem 0.5rem',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
    background: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.15s',
  },
}
