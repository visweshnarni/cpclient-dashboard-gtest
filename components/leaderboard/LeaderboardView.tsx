
import React, { useState } from 'react';
import EmployeeLeaderboardTable from './EmployeeLeaderboardTable';
import DepartmentLeaderboardTable from './DepartmentLeaderboardTable';
import { mockEmployees, mockProjects } from '../projects/data';
import { mockServices } from '../services/data';
import { calculateDepartmentScores } from './data';
import { LeaderboardIcon } from '../icons/Icons';

const LeaderboardView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'employees' | 'departments'>('employees');
    
    const employeeData = [...mockEmployees].sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0));
    const departmentData = calculateDepartmentScores(mockProjects, mockServices);

    const TabButton: React.FC<{ tabName: 'employees' | 'departments'; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none ${
                activeTab === tabName ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-text-primary">Leaderboard</h2>
                    <p className="text-text-secondary mt-1">Recognizing top performers and team achievements.</p>
                </div>
                <div className="flex items-center bg-white rounded-lg p-1 border space-x-1">
                    <TabButton tabName="employees" label="Top Employees" />
                    <TabButton tabName="departments" label="Top Departments" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl shadow-lg text-white">
                    <h3 className="font-bold text-lg">#1 Employee</h3>
                    <div className="flex items-center gap-4 mt-2">
                        <img src={employeeData[0].avatar} alt={employeeData[0].name} className="w-16 h-16 rounded-full border-4 border-white" />
                        <div>
                            <p className="font-bold text-2xl">{employeeData[0].name}</p>
                            <p className="font-medium opacity-90">{employeeData[0].department} Department</p>
                        </div>
                    </div>
                </div>
                 <div className="lg:col-span-1 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
                    <h3 className="font-bold text-lg">#1 Department</h3>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-16 h-16 rounded-full border-4 border-white bg-white/20 flex items-center justify-center">
                            <LeaderboardIcon className="w-8 h-8"/>
                        </div>
                        <div>
                            <p className="font-bold text-2xl">{departmentData[0].name}</p>
                             <p className="font-medium opacity-90">{departmentData[0].projectsCompleted} Projects Completed</p>
                        </div>
                    </div>
                </div>
                 <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
                     <h3 className="font-bold text-lg text-text-primary">Leaderboard Insights</h3>
                     <p className="text-text-secondary text-sm mt-2">The IT Department leads with the highest project completion rate this quarter, while Priya Singh from IT holds the top spot for individual performance.</p>
                </div>
            </div>

            <div className="animate-fade-in">
                {activeTab === 'employees' ? (
                    <EmployeeLeaderboardTable employees={employeeData} />
                ) : (
                    <DepartmentLeaderboardTable departments={departmentData} />
                )}
            </div>
        </div>
    );
};

export default LeaderboardView;
