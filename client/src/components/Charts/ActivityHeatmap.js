import './ActivityHeatmap.css';

function ActivityHeatmap() {
  // generate random activity (0–4 levels)
  const data = Array.from({ length: 140 }, () =>
    Math.floor(Math.random() * 5)
  );

  return (
    <div className="heatmap">
      {data.map((value, index) => (
        <div
          key={index}
          className={`cell level-${value}`}
        />
      ))}
    </div>
  );
}

export default ActivityHeatmap;