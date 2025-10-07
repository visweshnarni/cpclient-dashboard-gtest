
import React from 'react';
import { Department } from '../../types';

interface DepartmentScore {
    name: Department;
    projectsCompleted: number;
    servicesDelivered: number;
    totalTasks: number;
    score: number;
}

interface Props {
  departments: DepartmentScore[];
}

const rankStyles = [
    { bg: 'bg-yellow-400', text: 'text-yellow-900', icon: '🏆' },
    { bg: 'bg-gray-300', text: 'text-gray-800', icon: '🥈' },
    { bg: 'bg-yellow-600', text: 'text-yellow-100', icon: '🥉' },
];

const DepartmentLeaderboardTable: React.FC<Props> = ({ departments }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-text-primary">Top Department Rankings</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-center">Rank</th>
                        <th scope="col" className="px-6 py-3">Department</th>
                        <th scope="col" className="px-6 py-3 text-center">Projects Completed</th>
                        <th scope="col" className="px-6 py-3 text-center">Services Delivered</th>
                        <th scope="col" className="px-6 py-3 text-center">Overall Score</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((dept, index) => {
                        // FIX: Added explicit type to rankStyle to handle cases where icon is not present.
                        const rankStyle: { bg: string; text: string; icon?: string; } = rankStyles[index] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                        const rank = index + 1;
                        return (
                             <tr key={dept.name} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 text-center">
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm mx-auto ${rankStyle.bg} ${rankStyle.text}`}>
                                         {rankStyle.icon ? rankStyle.icon : rank}
                                    </span>
                                </td>
                                <td scope="row" className="px-6 py-4 font-bold text-lg text-gray-900 whitespace-nowrap">
                                    {dept.name}
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-text-primary">{dept.projectsCompleted}</td>
                                <td className="px-6 py-4 text-center font-medium text-text-primary">{dept.servicesDelivered}</td>
                                <td className="px-6 py-4 text-center font-bold text-lg text-primary">{dept.score.toFixed(2)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default DepartmentLeaderboardTable;
