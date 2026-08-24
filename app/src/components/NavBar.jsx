import { Link, NavLink } from 'react-router-dom'
import './navbar.css'

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="mark" />
          QUORUM SENTINEL
        </Link>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Pitch
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Live Demo
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
