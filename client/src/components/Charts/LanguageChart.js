import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#00FFA3',
  '#7B61FF',
  '#FF6B6B',
  '#FFB347',
  '#00C2FF',
  '#FF69B4',
  '#98FB98',
];

function LanguageChart({ repos }) {
  if (!repos || repos.length === 0) return null;

  const langCount = repos
    .map(r => r.language)
    .filter(Boolean)
    .reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

  const data = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const renderCustomLabel = ({ name, value }) => {
    const pct = Math.round((value / total) * 100);
    return pct > 8 ? `${pct}%` : '';
  };

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '14px', color: '#888' }}>
        Language breakdown
      </h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={3}
              label={renderCustomLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} repo${value > 1 ? 's' : ''}`,
                name,
              ]}
              contentStyle={{
                background: '#1a1a2e',
                border: '1px solid #333',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: '12px', color: '#aaa' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LanguageChart;