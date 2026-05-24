import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function RepoChart({ repos }) {
  if (!repos || repos.length === 0) return null;

  const data = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map(repo => ({
      name: repo.name.length > 12
        ? repo.name.slice(0, 12) + '...'
        : repo.name,
      stars: repo.stargazers_count,
    }));

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '14px', color: '#888' }}>
        Top repos by stars
      </h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#888"
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              stroke="#888"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: '#1a1a2e',
                border: '1px solid #333',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="stars" fill="#00FFA3" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RepoChart;