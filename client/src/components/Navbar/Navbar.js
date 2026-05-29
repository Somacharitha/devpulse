import { useState } from 'react';
import { Activity, Search, X } from 'lucide-react';

import './Navbar.css';

function Navbar({ onSearch, showSearch = false }) {

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const handleClear = () => {
    setInput('');
  };

  return (

    <nav className="navbar">

      {/* LOGO */}
      <div className="navbar-logo">

        <div className="logo-icon">
          D
        </div>

        <span className="logo-text">
          Dev<span className="logo-accent">Pulse</span>
        </span>

      </div>

      {/* SEARCH - only shows on dashboard */}
      {showSearch && (
        <div
          className={`navbar-search ${focused ? 'focused' : ''}`}
        >

          <span className="search-prefix">
            github.com/
          </span>

          <input
            type="text"
            placeholder="username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) =>
              e.key === 'Enter' && handleSubmit()
            }
          />

          {input && (
            <button
              className="clear-btn"
              onClick={handleClear}
            >
              <X size={14} />
            </button>
          )}

          <button
            className="search-btn"
            onClick={handleSubmit}
          >
            <Search size={14} />
            ANALYZE
          </button>

        </div>
      )}

      {/* RIGHT SECTION */}
      <div className="navbar-right">

        <Activity
          size={16}
          className="nav-icon"
        />

        <p className="navbar-user">
          Welcome, {user?.name} 👋
        </p>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
          }}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;