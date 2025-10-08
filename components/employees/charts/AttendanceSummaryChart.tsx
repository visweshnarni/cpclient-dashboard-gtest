import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Present', Days: 18, fill: '#10B981' },
  { name: 'Half-day', Days: 2, fill: '#F59E0B' },
  { name: 'On Leave', Days: 1, fill: '#3B82F6' },
  { name: 'Absent', Days: 0, fill: '#EF4444' },
];

const AttendanceSummaryChart: React.FC = () => {
  const isDark = document.documentElement.classList.contains('dark');
  const tickColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? '#4B5563' : '#e0e0e0';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis type="number" tick={{ fill: tickColor, fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} width={70} />
        <Tooltip
           cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
           contentStyle={{ 
                backgroundColor: isDark ? '#374151' : '#fff', 
                border: `1px solid ${isDark ? '#4B5563' : '#ccc'}`,
           }} 
        />
        <Bar dataKey="Days" barSize={25} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceSummaryChart;
