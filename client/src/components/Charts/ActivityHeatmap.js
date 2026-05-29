import { useEffect, useState } from 'react';
import './ActivityHeatmap.css';

const LEVELS = [
  { min: 0,  max: 0,        className: 'level-0' },
  { min: 1,  max: 3,        className: 'level-1' },
  { min: 4,  max: 7,        className: 'level-2' },
  { min: 8,  max: 14,       className: 'level-3' },
  { min: 15, max: Infinity,  className: 'level-4' },
];

function getLevel(count) {
  return LEVELS.find(l => count >= l.min && count <= l.max)?.className || 'level-0';
}

function getLast90Days() {
  const days = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    days.push({ key, label });
  }
  return days;
}

function ActivityHeatmap({ username }) {

  const [activityData, setActivityData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!username) return;

    const fetchActivity = async () => {

      setLoading(true);

      try {

        // GitHub gives max 300 events across 3 pages
        const pages = [1, 2, 3];
        const counts = {};

        await Promise.all(
          pages.map(async (page) => {
            const res = await fetch(
              `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`
            );
            const events = await res.json();

            if (!Array.isArray(events)) return;

            events.forEach(event => {
              const day = event.created_at?.split('T')[0];
              if (day) {
                counts[day] = (counts[day] || 0) + 1;
              }
            });
          })
        );

        setActivityData(counts);

      } catch (err) {
        console.error('Failed to fetch activity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();

  }, [username]);

  const days = getLast90Days();
  const totalEvents = Object.values(activityData).reduce((s, v) => s + v, 0);
  const activeDays = Object.values(activityData).filter(v => v > 0).length;

  if (loading) {
    return (
      <div className="heatmap-wrapper">
        <p className="heatmap-empty">Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="heatmap-wrapper">

      {/* Header */}
      <div className="heatmap-header">
        <h3 className="heatmap-title">Activity — last 90 days</h3>
        <div className="heatmap-summary">
          <span>{totalEvents} events</span>
          <span>{activeDays} active days</span>
        </div>
      </div>

      {/* Grid */}
      <div className="heatmap">
        {days.map(({ key, label }) => {
          const count = activityData[key] || 0;
          const level = getLevel(count);
          return (
            <div
              key={key}
              className={`cell ${level}`}
              title={`${label}: ${count} event${count !== 1 ? 's' : ''}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        <div className="cell level-0" />
        <div className="cell level-1" />
        <div className="cell level-2" />
        <div className="cell level-3" />
        <div className="cell level-4" />
        <span className="legend-label">More</span>
      </div>

      {/* No activity fallback */}
      {totalEvents === 0 && (
        <p className="heatmap-empty">
          No public activity found for @{username} in the last 90 days.
        </p>
      )}

    </div>
  );
}

export default ActivityHeatmap;