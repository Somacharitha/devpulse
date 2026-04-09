import './StatCard.css';

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="stat-card" style={{ '--accent-color': accent || '#00FFA3' }}>
      <div className="stat-card-bar" />
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default StatCard;