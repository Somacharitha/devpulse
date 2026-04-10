import './RepoCard.css';

const LANG_COLORS = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3572A5',
  CSS: '#563D7C',
  HTML: '#E34F26',
  Java: '#B07219',
  'C++': '#F34B7D',
  Go: '#00ADD8',
  Rust: '#DEA584',
};

function RepoCard({ repo, onClick, selected }) {
  return (
    <div
      className={`repo-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="repo-card-header">
        <span className="repo-name">{repo.name}</span>
        <div className="repo-meta">
          <span className="repo-stat">⭐ {repo.stargazers_count}</span>
          <span className="repo-stat">🍴 {repo.forks_count}</span>
        </div>
      </div>

      {repo.description && (
        <p className="repo-description">{repo.description}</p>
      )}

      <div className="repo-card-footer">
        {repo.language && (
          <div className="repo-language">
            <span
              className="lang-dot"
              style={{
                background: LANG_COLORS[repo.language] || '#888'
              }}
            />
            <span>{repo.language}</span>
          </div>
        )}
        <span className="repo-updated">
          Updated {new Date(repo.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default RepoCard;