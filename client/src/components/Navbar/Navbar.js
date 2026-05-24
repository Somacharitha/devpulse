import { useState } from 'react';
import { GitBranch, Activity, Search, X } from 'lucide-react';
import './Navbar.css';

function Navbar({ onSearch }) {
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
      <div className="navbar-logo">
        <div className="logo-icon">D</div>
        <span className="logo-text">
          Dev<span className="logo-accent">Pulse</span>
        </span>
      </div>

      <div className={`navbar-search ${focused ? 'focused' : ''}`}>
        <span className="search-prefix">github.com/</span>
        <input
          type="text"
          placeholder="username"
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {input && (
          <button className="clear-btn" onClick={handleClear}>
            <X size={14} />
          </button>
        )}
        <button className="search-btn" onClick={handleSubmit}>
          <Search size={14} />
          ANALYZE
        </button>
      </div>

      <div className="navbar-right">
        <Activity size={16} className="nav-icon" />
        
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="github-link"
          <GitBranch size={18} />
      </div>
    </nav>
  );
}

export default Navbar;