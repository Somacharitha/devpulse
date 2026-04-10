import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function RepoChart({ repos }) {
  const data = repos.map(repo => ({
    name: repo.name.length > 10
      ? repo.name.slice(0, 10) + '...'
      : repo.name,
    stars: repo.stargazers_count,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888" />
          <Tooltip />
          <Bar dataKey="stars" fill="#00FFA3" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RepoChart;