import React from 'react';
import { Employee } from '../../types';
import { mockEmployeeDocuments } from './data';
// FIX: Added missing icon imports.
import { MailIcon, PhoneIcon, CalendarIcon, MapPinIcon, BriefcaseIcon, DownloadIcon } from '../icons/Icons';
import PerformanceHistoryChart from './charts/PerformanceHistoryChart';
import AttendanceSummaryChart from './charts/AttendanceSummaryChart';

interface Props {
  employee: Employee;
  onBack: () => void;
}

const EmployeeDetail: React.FC<Props> = ({ employee, onBack }) => {
    const documents = mockEmployeeDocuments[employee.id] || [];
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

    return (
        <div className="space-y-6 animate-fade-in">
            <button onClick={onBack} className="text-sm font-medium text-primary dark:text-blue-400 hover:underline">
                &larr; Back to All Employees
            </button>

            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-6">
                <img src={employee.avatar} alt={employee.name} className="w-24 h-24 rounded-full border-4 border-primary/50 shadow-lg" />
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-text-primary dark:text-gray-200">{employee.name}</h2>
                    <p className="text-md text-text-secondary dark:text-gray-400">{employee.position}</p>
                    <p className="text-sm text-primary dark:text-blue-400 font-semibold">{employee.department} Department</p>
                </div>
                <div className="sm:ml-auto text-center sm:text-right">
                    <p className="text-sm text-text-secondary dark:text-gray-400">Joining Date</p>
                    <p className="font-semibold text-text-primary dark:text-gray-200">{formatDate(employee.joiningDate)}</p>
                </div>
            </div>

            {/* Personal & Professional Details */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-text-primary dark:text-gray-200">Personal & Professional Details</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <li className="flex items-center gap-3"><MailIcon className="w-5 h-5 text-primary" /> <span>{employee.email}</span></li>
                    <li className="flex items-center gap-3"><PhoneIcon className="w-5 h-5 text-primary" /> <span>{employee.phone}</span></li>
                    <li className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-primary" /> <span><strong>DOB:</strong> {formatDate(employee.dob)}</span></li>
                    <li className="flex items-center gap-3"><BriefcaseIcon className="w-5 h-5 text-primary" /> <span><strong>Experience:</strong> 5 Years</span></li>
                    <li className="md:col-span-2 flex items-center gap-3"><MapPinIcon className="w-5 h-5 text-primary" /> <span>{employee.address}</span></li>
                </ul>
            </div>

            {/* Documents */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-text-primary dark:text-gray-200">Documents</h3>
                <ul className="space-y-3">
                    {documents.map(doc => (
                        <li key={doc.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <div>
                                <p className="font-medium text-text-primary dark:text-gray-200">{doc.name}</p>
                                <p className="text-xs text-text-secondary dark:text-gray-400">{doc.type} &bull; {doc.size} &bull; Uploaded {doc.uploadDate}</p>
                            </div>
                            <a href={doc.url} download className="flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-blue-700">
                                <DownloadIcon className="w-4 h-4"/> Download
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Performance & Assignments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-text-primary dark:text-gray-200">Performance History</h3>
                    <div className="h-56">
                        <PerformanceHistoryChart />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-text-primary dark:text-gray-200">Current Assignments</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between items-center border-b dark:border-gray-700 pb-2"><p>Corporate Website Redesign</p><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Active</span></li>
                        <li className="flex justify-between items-center border-b dark:border-gray-700 pb-2"><p>Client Mobile App</p><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Completed</span></li>
                        <li className="flex justify-between items-center"><p>Q4 Marketing Campaign</p><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Pending</span></li>
                    </ul>
                </div>
            </div>

            {/* Attendance & Leave */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-text-primary dark:text-gray-200">Monthly Attendance</h3>
                    <div className="h-56">
                       <AttendanceSummaryChart />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-text-primary dark:text-gray-200">Recent Leave Records</h3>
                    <table className="w-full text-sm">
                        <thead className="text-left">
                            <tr className="border-b dark:border-gray-700">
                                <th className="py-2 font-semibold">Date</th>
                                <th className="py-2 font-semibold">Type</th>
                                <th className="py-2 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="py-2">2024-07-10</td><td className="py-2">Sick Leave</td><td className="py-2 text-green-500">Approved</td></tr>
                            <tr><td className="py-2">2024-06-05</td><td className="py-2">Casual Leave</td><td className="py-2 text-green-500">Approved</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail;
