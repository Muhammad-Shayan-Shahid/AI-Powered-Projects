import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/hooks/useAuth.js'
import './Navbar.css'

export default function Navbar() {
  const { user, handleLogout } = useAuth()
  const [dropOpen, setDropOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = path => location.pathname === path ? 'navbar-link active' : 'navbar-link'

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <div className="navbar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="navbar-logo-text">NeuralPrep</span>
        </Link>

        {/* Nav Links */}
        <div className="navbar-links">
          <Link to="/dashboard"  className={isActive('/dashboard')}>Dashboard</Link>
          <Link to="/analytics"  className={isActive('/analytics')}>Analytics</Link>
        </div>

        {/* Right */}
        <div className="navbar-right">
          <button className="navbar-start-btn" onClick={() => navigate('/setup')}>
            + New Interview
          </button>

          <div className="navbar-avatar" onClick={() => setDropOpen(p => !p)}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}

            {dropOpen && (
              <div className="navbar-dropdown" onClick={e => e.stopPropagation()}>
                <div className="navbar-dropdown-name">
                  {user?.name}
                  <div className="navbar-dropdown-role">{user?.targetRole}</div>
                </div>
                <button className="navbar-logout-btn" onClick={handleLogout}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  )
}