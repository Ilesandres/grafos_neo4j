import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Network, Table2, LogOut } from 'lucide-react'

const links = [
  { to: '/app', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/graph', label: 'Graph View', icon: Network },
  { to: '/app/table', label: 'Table View', icon: Table2 },
]

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <Network size={24} color="#00E5FF" />
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
    background: '#0f0f1e',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0',
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
    color: '#fff',
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
    color: '#a0a0b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.15s',
  },
  activeLink: {
    background: 'rgba(0,229,255,0.1)',
    color: '#00E5FF',
    fontWeight: 500,
  },
  spacer: {
    flex: 1,
  },
}
