import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import './Dashboard.css';

import StatCard from '../../components/StatCard/StatCard';
import RepoCard from '../../components/RepoCard/RepoCard';
import ActivityHeatmap from '../../components/Charts/ActivityHeatmap';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const COLORS = [
  '#00FFA3',
  '#7C3AED',
  '#F59E0B',
  '#EF4444',
  '#3B82F6',
  '#EC4899'
];

const Dashboard = () => {

  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  const [expandedAI, setExpandedAI] = useState(false);
  const [aiInsights, setAiInsights] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  const canvasRef = useRef(null);

  /* PARTICLE ANIMATION */

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 55 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a:  Math.random(),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,232,122,${p.a * 0.35})`;
        ctx.fill();
      });

      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,232,122,${0.06 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };

  }, []);

  /* LOAD STORAGE */

  useEffect(() => {

    const savedFavs =
      JSON.parse(localStorage.getItem('favorites')) || [];

    const savedRecent =
      JSON.parse(localStorage.getItem('recentSearches')) || [];

    setFavorites(savedFavs);
    setRecentSearches(savedRecent);

  }, []);

  /* SHOW POPUP HELPER */

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '' });
    }, 3000);
  };

  /* FETCH AI INSIGHTS */
  const fetchAIInsights = async (user, repoList, topLang, stars) => {

    setAiLoading(true);
    setAiInsights('');

    await new Promise(res => setTimeout(res, 1200));

    const forks = repoList.reduce((s, r) => s + r.forks_count, 0);
    const avgStars = repoList.length > 0 ? (stars / repoList.length).toFixed(1) : 0;
    const topRepo = repoList[0];

    const insights = `1. ${user.login} has ${user.public_repos} public repositories with a strong focus on ${topLang}, showing consistent specialization in this tech stack.

2. Top repository "${topRepo?.name || 'N/A'}" has earned ${topRepo?.stargazers_count || 0} stars, indicating strong community recognition and real-world usefulness.

3. With ${stars} total stars and ${forks} forks across all repos, this developer has an average of ${avgStars} stars per repo — a solid indicator of code quality.

4. ${user.followers} followers on GitHub places this developer in a visible position within the open-source community, suggesting consistent contribution and engagement.

5. The breadth of ${user.public_repos} repositories combined with a ${topLang} focus suggests a developer who ships frequently — a key trait valued by top tech companies.`;

    setAiInsights(insights);
    setAiLoading(false);
  };
  /* FETCH SUGGESTIONS */
  const fetchSuggestions = async (value) => {

  if (value.length < 2) {
    setSuggestions([]);
    return;
  }

  try {

    const response = await axios.get(
      `https://api.github.com/search/users?q=${value}&per_page=5`
    );

    setSuggestions(response.data.items);

  } catch (error) {

    console.log('Suggestion Error');
  }
};
  

  

  /* FETCH USER */

  const fetchGitHubData = async () => {

    if (!username.trim()) return;

    try {

      setLoading(true);
      setError('');
      setAiInsights('');
      const userResponse =
  await axios.get(
    `http://localhost:5000/api/github/user/${username}`
  );

const repoResponse =
  await axios.get(
    `http://localhost:5000/api/github/repos/${username}`
  );

      

      setUserData(userResponse.data);

      const sortedRepos =
        repoResponse.data.sort(
          (a, b) =>
            b.stargazers_count -
            a.stargazers_count
        );

      setRepos(sortedRepos);

      /* RECENT SEARCHES */

      let updatedRecent = [
        username,
        ...recentSearches.filter(
          item => item !== username
        )
      ];

      updatedRecent = updatedRecent.slice(0, 5);

      setRecentSearches(updatedRecent);

      localStorage.setItem(
        'recentSearches',
        JSON.stringify(updatedRecent)
      );

      /* COMPUTE STATS FOR AI */

      const langCount = {};
      repoResponse.data.forEach(repo => {
        if (repo.language) {
          langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        }
      });
      const topLang = Object.keys(langCount)[0] || 'N/A';
      const stars = repoResponse.data.reduce((s, r) => s + r.stargazers_count, 0);

      fetchAIInsights(userResponse.data, sortedRepos, topLang, stars);

    } catch (err) {

      setError('User not found. Try another GitHub username.');
      setUserData(null);
      setRepos([]);

    } finally {
      setLoading(false);
    }
  };

  /* FAVORITES */

  const addToFavorites = () => {

    if (!userData) return;

    const alreadyExists =
      favorites.find(fav => fav.login === userData.login);

    if (alreadyExists) {
      showPopup(`@${userData.login} is already in your favorites!`, 'warning');
      return;
    }

    const updatedFavs = [
      ...favorites,
      {
        login: userData.login,
        avatar_url: userData.avatar_url
      }
    ];

    setFavorites(updatedFavs);
    localStorage.setItem('favorites', JSON.stringify(updatedFavs));
    showPopup(`⭐ @${userData.login} added to favorites!`, 'success');
  };

  const removeFavorite = (login) => {

    const updated = favorites.filter(fav => fav.login !== login);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
    showPopup(`❌ @${login} removed from favorites!`, 'warning');
  };

  /* STATS */

  const totalStars =
    repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

  const totalForks =
    repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  const languageCount = {};

  repos.forEach(repo => {
    if (repo.language) {
      languageCount[repo.language] =
        (languageCount[repo.language] || 0) + 1;
    }
  });

  const languageData =
    Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

  const mostUsedLang =
    Object.keys(languageCount)[0] || 'N/A';

  const topRepos = repos.slice(0, 10);

  return (

    <div className="dashboard">

      {/* PARTICLES */}
      <canvas ref={canvasRef} className="dashboard-particles" />

      {/* POPUP TOAST */}
      {popup.show && (
        <div className={`toast-popup ${popup.type}`}>
          {popup.message}
        </div>
      )}

      {/* HERO */}

      {!userData && !loading && (
        <div className="dashboard-hero">

          <div className="hero-glow"></div>

          <h1 className="hero-title">
            Analyze GitHub <br />
            <span className="hero-accent">Like Never Before.</span>
          </h1>

          <p className="hero-sub">
            Explore developer profiles, repositories, AI insights,
            coding activity and tech stack with futuristic analytics.
          </p>

          <div className="dashboard-search">
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => {

  setUsername(e.target.value);

  fetchSuggestions(e.target.value);

  setShowSuggestions(true);

}}
              onKeyDown={(e) => {
                if (e.key === 'Enter') fetchGitHubData();
              }}
            />
            <button onClick={fetchGitHubData}>Analyze</button>
            {showSuggestions && suggestions.length > 0 && (

  <div className="suggestions-box">

    {suggestions.map((user) => (

      <div
        key={user.id}
        className="suggestion-item"
        onClick={() => {

          setUsername(user.login);

          setSuggestions([]);

          setShowSuggestions(false);

        }}
      >

        <img
          src={user.avatar_url}
          alt={user.login}
          className="suggestion-avatar"
        />

        <span>{user.login}</span>

      </div>

    ))}

  </div>

)}
          </div>

          <div className="hero-tags">
            <button className="hero-tag" onClick={() => setUsername('torvalds')}>torvalds</button>
            <button className="hero-tag" onClick={() => setUsername('gaearon')}>gaearon</button>
            <button className="hero-tag" onClick={() => setUsername('openai')}>openai</button>
            <button className="hero-tag" onClick={() => setUsername('vercel')}>vercel</button>
          </div>

        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="empty-state">Loading GitHub analytics...</div>
      )}

      {/* ERROR */}
      {error && (
        <div className="error-card">{error}</div>
      )}

      {/* DASHBOARD */}

      {userData && !loading && (
        <div className="dashboard-content">

          {/* PROFILE */}
          <div className="profile-card">

            <img src={userData.avatar_url} alt="avatar" />

            <div>

              <h2>{userData.name || userData.login}</h2>
              <p>@{userData.login}</p>
              <p>{userData.bio || 'No bio available'}</p>

              <div className="favorite-actions">

                <button
                  className="favorite-btn"
                  onClick={addToFavorites}
                >
                  ⭐ Add to Favorites
                </button>
                href={userData.html_url}
                  target="_blank"
                  rel="noreferrer"
                
                  <button className="heart-btn">
                    GitHub →
                  </button>
                

                
                  

              </div>

            </div>

          </div>

          {/* RECENT */}
          <div className="recent-searches-box">

            <h3>Recent Searches</h3>

            {recentSearches.map((item, index) => (
              <button
                key={index}
                className="recent-search-btn"
                onClick={() => setUsername(item)}
              >
                {item}
              </button>
            ))}

          </div>

          {/* FAVORITES */}
          <div className="favorites-box">

            <h3>Favorite Developers</h3>

            {favorites.length === 0 ? (
              <p>No favorites yet.</p>
            ) : (
              favorites.map((fav, index) => (
                <div key={index} className="favorite-card">

                  <div
                    className="favorite-info"
                    onClick={() => setUsername(fav.login)}
                  >
                    <img
                      src={fav.avatar_url}
                      alt=""
                      className="favorite-avatar"
                    />
                    <span>{fav.login}</span>
                  </div>

                  <button
                    className="remove-favorite-btn"
                    onClick={() => removeFavorite(fav.login)}
                  >
                    ✕
                  </button>

                </div>
              ))
            )}

          </div>

          {/* STATS */}
          <div className="stat-cards-grid">
            <StatCard title="Repositories" value={repos.length} />
            <StatCard title="Stars" value={totalStars} />
            <StatCard title="Forks" value={totalForks} />
            <StatCard title="Top Language" value={mostUsedLang} />
          </div>

          {/* TABS */}
          <div className="tabs">
            <button
              className={activeTab === 'overview' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={activeTab === 'repositories' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('repositories')}
            >
              Repositories
            </button>
            <button
              className={activeTab === 'activity' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
          </div>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <>

              {/* BAR CHART */}
              <div className="chart-section">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={topRepos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stargazers_count" fill="#00FFA3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* PIE CHART */}
              <div className="chart-section">
                <ResponsiveContainer width="100%" height={380}>
                  <PieChart>
                    <Pie
                      data={languageData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={130}
                      innerRadius={50}
                      paddingAngle={3}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {languageData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} repos`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* AI INSIGHTS */}
              <div
                className="ai-insights-card"
                onClick={() => setExpandedAI(!expandedAI)}
              >

                <h2>🤖 AI Developer Insights</h2>

                {aiLoading ? (
                  <p className="ai-loading-text">
                    Analyzing profile with AI...
                  </p>
                ) : (
                  <p>
                    {expandedAI
                      ? aiInsights
                      : aiInsights.slice(0, 200) + '...'}
                  </p>
                )}

                {!aiLoading && (
                  <span className="ai-expand-text">
                    {expandedAI ? 'Show Less' : 'Read More'}
                  </span>
                )}

              </div>

            </>
          )}

          {/* REPOSITORIES */}
          {activeTab === 'repositories' && (
            <div className="repos-section">
              <div className="repos-list">
                {repos.map(repo => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITY */}
          {activeTab === 'activity' && (
            <ActivityHeatmap username={userData.login} />
          )}

        </div>
      )}

    </div>
  );
};


export default Dashboard;