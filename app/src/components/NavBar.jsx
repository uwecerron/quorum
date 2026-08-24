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
        <div className="nav-tag mono">Governance risk ratings · Covalent GoldRush</div>
      </div>
    </header>
  )
}
