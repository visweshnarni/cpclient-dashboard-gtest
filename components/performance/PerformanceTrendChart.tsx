
import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts';

interface Props {
    data: { period: string, rating: number }[];
}

const PerformanceTrendChart: React.FC<Props> = ({ data }) => {
    const isImproving = data.length > 1 ? data[data.length - 1].rating >= data[0].rating : true;
    const strokeColor = isImproving ? '#10B981' : '#EF4444';

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                <YAxis domain={[0, 5]} hide />
                <Tooltip 
                    contentStyle={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    labelStyle={{ display: 'none' }}
                    formatter={(value) => [`${value}/5.0`, 'Rating']}
                />
                <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke={strokeColor}
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PerformanceTrendChart;
