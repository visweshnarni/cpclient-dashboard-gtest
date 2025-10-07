import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Q4 2023', Performance: 4.1 },
  { name: 'Q1 2024', Performance: 4.3 },
  { name: 'Q2 2024', Performance: 4.2 },
  { name: 'Q3 2024', Performance: 4.5 },
];

const PerformanceHistoryChart: React.FC = () => {
  // Dummy component for now, assuming theme context would provide isDark
  const isDark = document.documentElement.classList.contains('dark');
  const tickColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? '#4B5563' : '#e0e0e0';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} />
        <YAxis domain={[0, 5]} tick={{ fill: tickColor, fontSize: 12 }} />
        <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#374151' : '#fff', 
              border: `1px solid ${isDark ? '#4B5563' : '#ccc'}`,
            }}
        />
        <Legend wrapperStyle={{ fontSize: '14px' }}/>
        <Line type="monotone" dataKey="Performance" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceHistoryChart;
