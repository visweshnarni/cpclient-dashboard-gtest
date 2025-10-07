
import React from 'react';
import { Employee } from '../../types';
import { TrendingUpIcon } from '../icons/Icons';

interface Props {
  employees: Employee[];
}

const rankStyles = [
    { bg: 'bg-yellow-400', text: 'text-yellow-900', icon: '🏆' },
    { bg: 'bg-gray-300', text: 'text-gray-800', icon: '🥈' },
    { bg: 'bg-yellow-600', text: 'text-yellow-100', icon: '🥉' },
];

const EmployeeLeaderboardTable: React.FC<Props> = ({ employees }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-text-primary">Top Employee Rankings</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-center">Rank</th>
                        <th scope="col" className="px-6 py-3">Employee</th>
                        <th scope="col" className="px-6 py-3">Department</th>
                        <th scope="col" className="px-6 py-3 text-center">Performance Score</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => {
                        // FIX: Added explicit type to rankStyle to handle cases where icon is not present.
                        const rankStyle: { bg: string; text: string; icon?: string } = rankStyles[index] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                        const rank = index + 1;
                        return (
                             <tr key={employee.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 text-center">
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm mx-auto ${rankStyle.bg} ${rankStyle.text}`}>
                                        {rankStyle.icon ? rankStyle.icon : rank}
                                    </span>
                                </td>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="font-bold">{employee.name}</div>
                                            <div className="text-xs text-gray-500">{employee.position}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{employee.department}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2 font-bold text-lg text-green-600">
                                        <TrendingUpIcon className="w-5 h-5" />
                                        <span>{employee.performanceScore}</span>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default EmployeeLeaderboardTable;
