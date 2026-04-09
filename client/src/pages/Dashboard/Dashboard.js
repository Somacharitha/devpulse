import { useState } from 'react';
import StatCard from '../../components/StatCard/StatCard';
import './Dashboard.css';

function Dashboard({ username }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async (uname) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.github.com/users/${uname}`);
      if (!res.ok) throw new Error('User not found');
      const data = await res.json();
      setUserData(data);
    } catch (e) {
      setError(e.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    if (username) fetchUser(username);
  }, [username]);

  return (
    <div className="dashboard">

      {/* Hero / Empty state */}
      {!username && !userData && (
        <div className="dashboard-hero">
          <div className="hero-glow" />
          <h1 className="hero-title">
            GitHub Analytics<br />
            <span className="hero-accent">Reimagined.</span>
          </h1>
          <p className="hero-sub">
            Enter any GitHub username above to explore commits,
            repos, languages, and activity — beautifully.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <p>Fetching GitHub data...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="dashboard-error">
          ⚠ {error} — please try another username.
        </div>
      )}

      {/* Profile + Stats */}
      {userData && !loading && (
        <>
          {/* Profile Card */}
          <div className="profile-card">
            <img
              src={userData.avatar_url}
              alt="avatar"
              className="profile-avatar"
            />
            <div className="profile-info">
              <h2 className="profile-name">
                {userData.name || userData.login}
              </h2>
              <p className="profile-username">@{userData.login}</p>
              {userData.bio && (
                <p className="profile-bio">{userData.bio}</p>
              )}
              {userData.location && (
                <p className="profile-location">📍 {userData.location}</p>
              )}
            </div>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">
                  {userData.public_repos}
                </span>
                <span className="profile-stat-label">Repos</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">
                  {userData.followers}
                </span>
                <span className="profile-stat-label">Followers</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">
                  {userData.following}
                </span>
                <span className="profile-stat-label">Following</span>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="stat-cards-grid">
            <StatCard
              label="Public Repos"
              value={userData.public_repos}
              sub="total repositories"
              accent="#00FFA3"
            />
            <StatCard
              label="Followers"
              value={userData.followers}
              sub="people following"
              accent="#7B61FF"
            />
            <StatCard
              label="Following"
              value={userData.following}
              sub="people followed"
              accent="#FF6B6B"
            />
            <StatCard
              label="Public Gists"
              value={userData.public_gists}
              sub="shared gists"
              accent="#FFB347"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;