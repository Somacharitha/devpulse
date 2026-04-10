import { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard/StatCard';
import RepoCard from '../../components/RepoCard/RepoCard';
import RepoChart from '../../components/Charts/RepoChart';
import LanguageChart from '../../components/Charts/LanguageChart';
import ActivityHeatmap from '../../components/Charts/ActivityHeatmap';
import './Dashboard.css';

function Dashboard({ username }) {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!username) return;

    setLoading(true);

    setTimeout(() => {
      const mockUser = {
        login: username,
        name: "Demo User",
        avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
        bio: "Full Stack Developer 🚀",
        location: "India",
        public_repos: 12,
        followers: 120,
        following: 45,
      };

      const mockRepos = [
        {
          id: 1,
          name: "devpulse",
          stargazers_count: 25,
          forks_count: 10,
          language: "JavaScript",
          updated_at: new Date().toISOString(),
          description: "GitHub analytics dashboard",
          open_issues_count: 2,
          html_url: "https://github.com/demo/devpulse",
        },
        {
          id: 2,
          name: "portfolio",
          stargazers_count: 15,
          forks_count: 5,
          language: "React",
          updated_at: new Date().toISOString(),
          description: "Personal portfolio website",
          open_issues_count: 1,
          html_url: "https://github.com/demo/portfolio",
        },
      ];

      setUserData(mockUser);
      setRepos(mockRepos);
      setSelectedRepo(mockRepos[0]);
      setLoading(false);
    }, 800);
  }, [username]);

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

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

      {!username && (
        <div className="dashboard-hero">
          <div className="hero-glow" />
          <h1 className="hero-title">
            GitHub Analytics<br />
            <span className="hero-accent">Reimagined.</span>
          </h1>
          <p className="hero-sub">
            Enter any GitHub username above to explore repos,
            languages, and activity — beautifully.
          </p>
        </div>
      )}

      {loading && (
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <p>Fetching data...</p>
        </div>
      )}

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
                <img src={userData.avatar_url} alt="avatar" className="profile-avatar" />
                <div className="profile-info">
                  <h2 className="profile-name">{userData.name || userData.login}</h2>
                  <p className="profile-username">@{userData.login}</p>
                  <p className="profile-bio">{userData.bio}</p>
                  <p className="profile-location">📍 {userData.location}</p>
                </div>

                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="profile-stat-value">{userData.public_repos}</span>
                    <span className="profile-stat-label">Repos</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{userData.followers}</span>
                    <span className="profile-stat-label">Followers</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-value">{userData.following}</span>
                    <span className="profile-stat-label">Following</span>
                  </div>
                </div>
              </div>

              <div className="stat-cards-grid">
                <StatCard label="Total Stars" value={totalStars} />
                <StatCard label="Total Forks" value={totalForks} />
                <StatCard label="Repos" value={userData.public_repos} />
                <StatCard label="Top Language" value={mostUsedLang} />
              </div>

              <div style={{ marginTop: '24px' }}>
                <div className="section-title">Stars Overview</div>
                <RepoChart repos={repos} />
              </div>

              <div style={{ marginTop: '24px' }}>
                <div className="section-title">Language Usage</div>
                <LanguageChart repos={repos} />
              </div>
            </>
          )}

          {/* REPOS */}
          {activeTab === 'repos' && (
            <div className="repos-section">
              <div className="repos-list">
                <div className="section-title">
                  Repositories
                  <span className="section-count">{repos.length}</span>
                </div>

                {repos.map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    selected={selectedRepo?.id === repo.id}
                    onClick={() => setSelectedRepo(repo)}
                  />
                ))}
              </div>

              {selectedRepo && (
                <div className="repo-detail">
                  <div className="repo-detail-name">{selectedRepo.name}</div>
                  <div className="repo-detail-url">
                    github.com/{username}/{selectedRepo.name}
                  </div>

                  <p className="repo-detail-desc">{selectedRepo.description}</p>

                  <div className="repo-detail-stats">
                    <StatCard label="Stars" value={selectedRepo.stargazers_count} />
                    <StatCard label="Forks" value={selectedRepo.forks_count} />
                    <StatCard label="Issues" value={selectedRepo.open_issues_count} />
                    <StatCard label="Language" value={selectedRepo.language} />
                  </div>

                  <a
                    href={selectedRepo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-detail-link"
                  >
                    View on GitHub →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 🔥 ACTIVITY (UPDATED) */}
          {activeTab === 'activity' && (
            <div style={{ marginTop: '24px' }}>
              <div className="section-title">Contribution Activity</div>
              <ActivityHeatmap />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;