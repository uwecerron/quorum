import { Link } from 'react-router-dom'
import './navbar.css'

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="mark" />
          QUORUM SENTINEL
        </Link>
        <nav className="nav-right">
          <Link to="/#scan" className="nav-btn">Explore DAOs</Link>
          <Link to="/dashboard" className="nav-btn">
            Replay incident
          </Link>
        </nav>
      </div>
    </header>
  )
}
