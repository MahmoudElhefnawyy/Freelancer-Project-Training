import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'مكتملة', value: 3, color: '#10b981' },
  { name: 'قيد التنفيذ', value: 2, color: '#f59e0b' },
  { name: 'متأخرة', value: 0, color: '#ef4444' },
  { name: 'مجدولة', value: 1, color: '#6366f1' }
];

export default function PieChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [value, name]}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => value}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
