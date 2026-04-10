import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#00FFA3',
  '#7B61FF',
  '#FF6B6B',
  '#FFB347',
  '#00C2FF',
];

function LanguageChart({ repos }) {
  const langCount = repos
    .map(r => r.language)
    .filter(Boolean)
    .reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

  const data = Object.entries(langCount).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LanguageChart;