import { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard/StatCard';
import RepoCard from '../../components/RepoCard/RepoCard';
import RepoChart from '../../components/Charts/RepoChart';
import LanguageChart from '../../components/Charts/LanguageChart';
import ActivityHeatmap from '../../components/Charts/ActivityHeatmap';
import './Dashboard.css';
import './../../components/Skeleton/Skeleton.css';

function Dashboard({ username }) {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [activityData, setActivityData] = useState({});

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
          `${process.env.REACT_APP_API_URL}/api/user/${username}`
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
          `${process.env.REACT_APP_API_URL}/api/repos/${username}`
        );

        const reposData = reposRes.status === 200
          ? await reposRes.json()
          : [];

        // EVENTS API
        const eventsRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/events/${username}`
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
  }, [username]);

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
                  <p>📍 {userData.location}</p>
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
                    
                      href={selectedRepo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="repo-detail-link"
                    
                      View on GitHub ↗
                  
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
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="repo-detail-meta-row">
                      <span className="repo-detail-meta-label">Last updated</span>
                      <span className="repo-detail-meta-value">
                        {new Date(selectedRepo.updated_at).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                    {selectedRepo.license && (
                      <div className="repo-detail-meta-row">
                        <span className="repo-detail-meta-label">License</span>
                        <span className="repo-detail-meta-value">{selectedRepo.license.spdx_id}</span>
                      </div>
                    )}
                  </div>

                  {selectedRepo.topics && selectedRepo.topics.length > 0 && (
                    <div className="repo-detail-topics">
                      {selectedRepo.topics.map(topic => (
                        <span key={topic} className="repo-topic-tag">{topic}</span>
                      ))}
                    </div>
                  )}

                  {selectedRepo.fork && (
                    <p className="repo-detail-fork-note">Forked repository</p>
                  )}

                </div>
              )}
            </div>
          )}

          {/* ACTIVITY */}
          {activeTab === 'activity' && (
            <ActivityHeatmap activityData={activityData} username={username} />
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