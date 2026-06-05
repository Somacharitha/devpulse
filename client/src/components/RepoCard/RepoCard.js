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
const calculateRepoScore = (repo) => {

  let score = 0;

  score += Math.min(repo.stargazers_count, 100) * 0.4;

  score += Math.min(repo.forks_count, 50) * 0.4;

  if (repo.description) score += 10;

  if (repo.language) score += 10;

  return Math.min(Math.round(score), 100);

};
const getRepoRating = (score) => {

  if (score >= 80) {
    return 'Excellent Repository';
  }

  if (score >= 60) {
    return 'Strong Repository';
  }

  if (score >= 40) {
    return 'Good Repository';
  }

  return 'Needs Improvement';

};

function RepoCard({ repo, onClick, selected }) {
  const repoScore = calculateRepoScore(repo);

const repoRating = getRepoRating(repoScore);
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

<div className="repo-review-section">

  <div className="repo-score">
    Score: {repoScore}/100
  </div>

  <div className="repo-rating">
    {repoRating}
  </div>
  </div>

</div>
  );
}

export default RepoCard;