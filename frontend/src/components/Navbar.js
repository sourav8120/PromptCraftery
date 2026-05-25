import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, getPlanDetails, getRemainingPrompts } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const planDetails = user ? getPlanDetails(user.subscription?.plan || 'free') : null;
  const remainingPrompts = getRemainingPrompts();

  // Hide auth buttons on login/register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Prompt<span className="logo-accent">Craftery</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/prompts" className={location.pathname.startsWith('/prompts') ? 'active' : ''}>Browse</Link>
          <Link to="/prompts?featured=true" className="">Featured</Link>
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-info-section">
                <span className="user-name">👤 {user.name}</span>
                {planDetails && (
                  <div className="subscription-info">
                    <span className="plan-badge" title={planDetails.name}>
                      {planDetails.badge}
                    </span>
                    <span className="prompts-remaining">
                      📊 {remainingPrompts}/{planDetails.prompts} Prompts
                    </span>
                  </div>
                )}
              </div>
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          ) : !isAuthPage && (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
