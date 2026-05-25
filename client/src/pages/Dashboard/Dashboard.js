import { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard/StatCard';
import RepoCard from '../../components/RepoCard/RepoCard';
import RepoChart from '../../components/Charts/RepoChart';
import LanguageChart from '../../components/Charts/LanguageChart';
import ActivityHeatmap from '../../components/Charts/ActivityHeatmap';
import './Dashboard.css';
import './../../components/Skeleton/Skeleton.css';

function Dashboard({ username, setUsername }) {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [activityData, setActivityData] = useState({});
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setUserData(null);
        setRepos([]);

        // USER API
        const userRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/github/user/${username}`
        );

        if (userRes.status === 404) {
          setError({ type: 'not_found', message: `"${username}" not found on GitHub` });
          return;
        }

        if (userRes.status === 403) {
          setError({ type: 'rate_limit', message: 'GitHub API rate limit hit. Try again in a minute.' });
          return;
        }

        if (userRes.status !== 200) {
          setError({ type: 'server', message: 'Something went wrong. Try again.' });
          return;
        }

        const userData = await userRes.json();

        // REPOS API
        const reposRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/github/repos/${username}`
        );

        const reposData = reposRes.status === 200
          ? await reposRes.json()
          : [];

        // EVENTS API
        const eventsRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/github/events/${username}`
        );

        const eventsData = eventsRes.status === 200
          ? await eventsRes.json()
          : {};

        // SAFE SET
        setUserData(userData);
        setRepos(reposData);
        setActivityData(eventsData);
        setSelectedRepo(reposData.length > 0 ? reposData[0] : null);

      } catch (error) {
        console.error(error);
        setError({ type: 'server', message: 'Could not connect to server. Is it running?' });
        setUserData(null);
        setRepos([]);
        setSelectedRepo(null);
        setActivityData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchRecentSearches();
fetchFavorites();

}, [username]);



const fetchRecentSearches = async () => {
  try {

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/github/recent/searches`
    );

    const data = await response.json();

    setRecentSearches(data);

  } catch (error) {

    console.log("Recent searches error:", error);
  }
};



const fetchFavorites = async () => {
  try {

    const response = await fetch(

  `${process.env.REACT_APP_API_URL}/api/github/favorites?userId=${
    JSON.parse(localStorage.getItem('user'))?.id
  }`

);

    const data = await response.json();

    setFavorites(data);

  } catch (error) {

    console.log('Favorites fetch error:', error);
  }
};
    
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

  const topLanguage = repos
    .map(r => r.language)
    .filter(Boolean)
    .reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

  const mostUsedLang =
    Object.entries(topLanguage).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="dashboard">
      <div className="recent-searches-box">
  <h3>Recent Searches</h3>
  <div className="recent-searches-list"></div>

  {recentSearches.length === 0 ? (
  <p>No recent searches</p>
) : (
  recentSearches.map((search) => (
    <button
      key={search._id}
      className="recent-search-btn"
      onClick={() => setUsername(search.username)}
    >
      {search.username}
    </button>
  ))
)}
</div>
<div className="favorites-box">

  <h3>Favorite Developers</h3>

  <div className="favorites-list">

    {favorites.length === 0 ? (

      <p>No favorites yet</p>

    ) : (

      favorites.map((fav) => (

  <div
    key={fav._id}
    className="favorite-card"
  >

    <div
      className="favorite-info"
      onClick={() => setUsername(fav.username)}
    >

      <img
        src={fav.avatar}
        alt={fav.username}
        className="favorite-avatar"
      />

      <span className="favorite-username">
        {fav.username}
      </span>

    </div>

    <button
      className="remove-favorite-btn"
      onClick={async () => {

        try {

          await fetch(
            `${process.env.REACT_APP_API_URL}/api/github/favorites/${fav._id}`,
            {
              method: 'DELETE'
            }
          );

          fetchFavorites();

        } catch (error) {

          console.log(error);
        }
      }}
    >
      ✕
    </button>

  </div>

))
    )}

  </div>

</div>
  


      {/* LOADING — skeleton */}
      {loading && (
        <div className="dashboard">
          <div className="skeleton-profile">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-profile-lines">
              <div className="skeleton skeleton-line-lg" />
              <div className="skeleton skeleton-line-md" />
              <div className="skeleton skeleton-line-sm" />
            </div>
          </div>
          <div className="stat-cards-grid">
            <div className="skeleton skeleton-stat-card" />
            <div className="skeleton skeleton-stat-card" />
            <div className="skeleton skeleton-stat-card" />
            <div className="skeleton skeleton-stat-card" />
          </div>
          <div style={{ marginTop: '24px' }}>
            <div className="skeleton skeleton-repo-card" />
            <div className="skeleton skeleton-repo-card" />
            <div className="skeleton skeleton-repo-card" />
          </div>
        </div>
      )}

      {/* ERROR STATE */}
{!loading && error && (
  <div className="error-card">
    <div className="error-icon">
      {error.type === 'not_found' && '🔍'}
      {error.type === 'rate_limit' && '⏳'}
      {error.type === 'server' && '⚠️'}
    </div>
    <h3 className="error-title">
      {error.type === 'not_found' && 'User not found'}
      {error.type === 'rate_limit' && 'Rate limit hit'}
      {error.type === 'server' && 'Server error'}
    </h3>
    <p className="error-message">{error.message}</p>
  </div>
)}

{/* EMPTY STATE — no search yet */}
{!loading && !error && !userData && (
  <div className="empty-state">
    <p>Enter a GitHub username above to get started</p>
  </div>
)}

      {/* MAIN DATA */}
      {userData && !loading && (
        <>
          {/* Tabs */}
          <div className="tabs">
            <button
              className={activeTab === 'overview' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={activeTab === 'repos' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('repos')}
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
              <div className="profile-card">
                <img src={userData.avatar_url} alt="avatar" />
                <div>
                  <h2>{userData.name || userData.login}</h2>
                  <p>@{userData.login}</p>
                  <p>{userData.bio}</p>
                  <div className="profile-location">
  <span className="location-symbol">⌖</span>

  <span>
    {userData.location}
  </span>
</div>
                  <div className="favorite-actions">

  <button
    className="favorite-btn"
    onClick={async () => {
      try {

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/github/favorites`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({

  userId: JSON.parse(
    localStorage.getItem('user')
  )?.id,

  username: userData.login,

  avatar: userData.avatar_url,

  profileUrl: userData.html_url
})
          }
        );

        const data = await response.json();

        alert(data.message || 'Added to favorites');

      } catch (error) {

        console.log(error);

        alert('Failed to add favorite');
      }
    }}
  >

    <span className="favorite-star">
      ⭐
    </span>

    <span className="favorite-text">
      Added to Favorites
    </span>

  </button>

  <button className="heart-btn">
    ♡
  </button>

</div>
 
                </div>
              </div>

              <div className="stat-cards-grid">
                <StatCard label="Stars" value={totalStars} />
                <StatCard label="Forks" value={totalForks} />
                <StatCard label="Repos" value={userData.public_repos} />
                <StatCard label="Top Language" value={mostUsedLang} />
              </div>

              <RepoChart repos={repos} />
              <LanguageChart repos={repos} />
            </>
          )}

          {/* REPOS */}
          {activeTab === 'repos' && (
            <div className="repos-section">

              {/* Left — repo list */}
              <div className="repos-list">
                {repos.map(repo => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    selected={selectedRepo?.id === repo.id}
                    onClick={() => setSelectedRepo(repo)}
                                      />
                ))}
              </div>

              {/* Right — detail panel */}
              {selectedRepo && (
                <div className="repo-detail">

                  <div className="repo-detail-header">
                    <h3 className="repo-detail-name">{selectedRepo.name}</h3>

                    <a
                      href={selectedRepo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="repo-detail-link"
                    >
                      View on GitHub ↗
                    </a>

                  </div>

                  {selectedRepo.description
                    ? <p className="repo-detail-desc">{selectedRepo.description}</p>
                    : <p className="repo-detail-desc repo-detail-empty">No description provided.</p>
                  }

                  <div className="repo-detail-stats">
                    <div className="repo-detail-stat">
                      <span className="repo-detail-stat-icon">⭐</span>
                      <span className="repo-detail-stat-value">{selectedRepo.stargazers_count}</span>
                      <span className="repo-detail-stat-label">Stars</span>
                    </div>

                    <div className="repo-detail-stat">
                      <span className="repo-detail-stat-icon">🍴</span>
                      <span className="repo-detail-stat-value">{selectedRepo.forks_count}</span>
                      <span className="repo-detail-stat-label">Forks</span>
                    </div>

                    <div className="repo-detail-stat">
                      <span className="repo-detail-stat-icon">👁</span>
                      <span className="repo-detail-stat-value">{selectedRepo.watchers_count}</span>
                      <span className="repo-detail-stat-label">Watchers</span>
                    </div>

                    <div className="repo-detail-stat">
                      <span className="repo-detail-stat-icon">🔴</span>
                      <span className="repo-detail-stat-value">{selectedRepo.open_issues_count}</span>
                      <span className="repo-detail-stat-label">Issues</span>
                    </div>
                  </div>

                  <div className="repo-detail-meta">

                    {selectedRepo.language && (
                      <div className="repo-detail-meta-row">
                        <span className="repo-detail-meta-label">Language</span>
                        <span className="repo-detail-meta-value">{selectedRepo.language}</span>
                      </div>
                    )}

                    <div className="repo-detail-meta-row">
                      <span className="repo-detail-meta-label">Visibility</span>
                      <span className="repo-detail-meta-value">
                        {selectedRepo.private ? 'Private' : 'Public'}
                      </span>
                    </div>

                    <div className="repo-detail-meta-row">
                      <span className="repo-detail-meta-label">Created</span>
                      <span className="repo-detail-meta-value">
                        {new Date(selectedRepo.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="repo-detail-meta-row">
                      <span className="repo-detail-meta-label">Last updated</span>
                      <span className="repo-detail-meta-value">
                        {new Date(selectedRepo.updated_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {selectedRepo.license && (
                      <div className="repo-detail-meta-row">
                        <span className="repo-detail-meta-label">License</span>
                        <span className="repo-detail-meta-value">
                          {selectedRepo.license.spdx_id}
                        </span>
                      </div>
                    )}

                  </div>

                  {selectedRepo.topics && selectedRepo.topics.length > 0 && (
                    <div className="repo-detail-topics">
                      {selectedRepo.topics.map(topic => (
                        <span
                          key={topic}
                          className="repo-topic-tag"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {selectedRepo.fork && (
                    <p className="repo-detail-fork-note">
                      Forked repository
                    </p>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ACTIVITY */}
          {activeTab === 'activity' && (
            <ActivityHeatmap
              activityData={activityData}
              username={username}
            />
          )}
        </>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && !userData && (
        <div className="empty-state">
          <p>Enter a GitHub username above to get started</p>
        </div>
      )}

    </div>
  );
}

export default Dashboard;