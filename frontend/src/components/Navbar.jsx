import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" id="navbar-logo">
          <span className="brand-icon">◈</span>
          TraceBack
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link" id="nav-browse">
            Browse Items
          </Link>
          {isAuthenticated && (
            <Link to="/post-item" className="nav-link" id="nav-post">
              Post Item
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/my-claims" className="nav-link" id="nav-claims">
              My Claims
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="nav-link nav-link-admin" id="nav-admin">
              Admin
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="navbar-user" id="navbar-username">
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                id="btn-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" id="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="btn-register">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="mobile-toggle" id="mobile-menu-toggle" onClick={() => {
          document.querySelector('.navbar-links')?.classList.toggle('open');
          document.querySelector('.navbar-actions')?.classList.toggle('open');
        }}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
