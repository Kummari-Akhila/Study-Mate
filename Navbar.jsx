import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, LogIn, LogOut, ChevronDown, User } from 'lucide-react';

export default function Navbar({ currentTitle, onGoHome, user, onLoginClick, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="navbar">
      <a href="#" onClick={(e) => { e.preventDefault(); onGoHome(); }} className="nav-brand">
        <BookOpen size={28} />
        <span>Student Assistant</span>
      </a>

      {currentTitle && (
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          maxWidth: '260px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          📚 {currentTitle}
        </div>
      )}

      <div className="nav-links">
        <button
          onClick={onGoHome}
          className="btn btn-secondary"
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
        >
          Reset Notes
        </button>

        {/* Auth section */}
        {user ? (
          <div className="nav-user-wrap" ref={dropdownRef}>
            <button
              className="nav-user-btn"
              onClick={() => setDropdownOpen(o => !o)}
              aria-label="Account menu"
            >
              <div className="nav-avatar">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                : (user.name?.charAt(0)?.toUpperCase() || <User size={16} />)
              }
            </div>
              <span className="nav-user-name">{user.name}</span>
              <ChevronDown size={14} style={{ opacity: 0.6, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {dropdownOpen && (
              <div className="nav-dropdown">
                <div className="nav-dropdown-header">
                  <p className="dropdown-name">{user.name}</p>
                  <p className="dropdown-email">{user.email}</p>
                </div>
                <div className="nav-dropdown-divider" />
                <button
                  className="nav-dropdown-item"
                  onClick={() => { setDropdownOpen(false); onLogout?.(); }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="btn btn-signin"
            aria-label="Sign in to your account"
            id="navbar-signin-btn"
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
