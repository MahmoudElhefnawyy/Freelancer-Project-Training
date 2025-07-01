import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'يناير', completed: 12, overdue: 2 },
  { name: 'فبراير', completed: 19, overdue: 3 },
  { name: 'مارس', completed: 15, overdue: 1 },
  { name: 'أبريل', completed: 17, overdue: 2 },
  { name: 'مايو', completed: 14, overdue: 1 },
  { name: 'يونيو', completed: 20, overdue: 0 },
];

export default function BarChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          labelFormatter={(value) => value}
          formatter={(value, name) => [
            value, 
            name === 'completed' ? 'المهام المكتملة' : 'المهام المتأخرة'
          ]}
        />
        <Bar dataKey="completed" fill="#10b981" name="completed" />
        <Bar dataKey="overdue" fill="#ef4444" name="overdue" />
      </BarChart>
    </ResponsiveContainer>
  );
}
