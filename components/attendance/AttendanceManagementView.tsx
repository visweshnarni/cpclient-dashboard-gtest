import React, { useState, useMemo } from 'react';
import { AttendanceRecord, Employee } from '../../types';
import { mockAttendance } from './data';
import { mockEmployees } from '../projects/data';
import KPICard from '../dashboard/KPICard';
import { AttendanceIcon, UserPlusIcon, DownloadIcon, UsersIcon, LeaveIcon } from '../icons/Icons';
import DailyAttendanceTable from './DailyAttendanceTable';
import MonthlySummaryTable from './MonthlySummaryTable';
import AddEditAttendanceModal from './AddEditAttendanceModal';

interface Props {
  searchQuery: string;
}

const AttendanceManagementView: React.FC<Props> = ({ searchQuery }) => {
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);
    const [employees] = useState<Employee[]>(mockEmployees);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<AttendanceRecord | null>(null);
    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

    const todaysRecords = useMemo(() => {
        const records = attendanceRecords.filter(r => r.date === currentDate);
        if (!searchQuery) {
            return records;
        }
        return records.filter(r => {
            const employee = employeeMap.get(r.employeeId);
            return employee ? employee.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
        });

    }, [attendanceRecords, currentDate, searchQuery, employeeMap]);

    const dailyStats = useMemo(() => {
        const allTodaysRecords = attendanceRecords.filter(r => r.date === currentDate);
        const present = allTodaysRecords.filter(r => r.status === 'Present' || r.status === 'Half-day').length;
        const onLeave = allTodaysRecords.filter(r => r.status === 'On Leave').length;
        
        const presentOrOnLeaveIds = new Set(allTodaysRecords.filter(r => r.status === 'Present' || r.status === 'Half-day' || r.status === 'On Leave').map(r => r.employeeId));
        const absent = employees.length - presentOrOnLeaveIds.size;

        return { present, onLeave, absent };
    }, [attendanceRecords, currentDate, employees]);
    
    const handleSaveRecord = (record: AttendanceRecord) => {
        setAttendanceRecords(prevRecords => {
            const index = prevRecords.findIndex(r => r.id === record.id);
            if (index > -1) {
                const newRecords = [...prevRecords];
                newRecords[index] = record;
                return newRecords;
            }
            return [record, ...prevRecords];
        });
        setIsModalOpen(false);
        setRecordToEdit(null);
    };
    
    const handleOpenModal = (record: AttendanceRecord | null) => {
        setRecordToEdit(record);
        setIsModalOpen(true);
    };

    const TabButton: React.FC<{ tabName: 'daily' | 'monthly'; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none ${
                activeTab === tabName ? 'bg-primary text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Attendance Management</h2>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">Track daily attendance and view monthly summaries.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleOpenModal(null)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <UserPlusIcon />
                        <span>Manual Entry</span>
                    </button>
                     <button 
                        onClick={() => alert('Exporting attendance report...')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-text-primary dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        <DownloadIcon />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard title="Present Today" value={`${dailyStats.present} / ${employees.length}`} icon={<AttendanceIcon />} color="green" />
                <KPICard title="On Leave" value={String(dailyStats.onLeave)} icon={<LeaveIcon />} color="yellow" />
                <KPICard title="Absent" value={String(dailyStats.absent)} icon={<UsersIcon />} color="red" />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border dark:border-gray-600 space-x-1">
                        <TabButton tabName="daily" label="Daily Tracking" />
                        <TabButton tabName="monthly" label="Monthly Summary" />
                    </div>
                    {activeTab === 'daily' && (
                         <div>
                            <label htmlFor="date-picker" className="text-sm font-medium text-text-secondary dark:text-gray-400 mr-2">Date:</label>
                            <input 
                                type="date" 
                                id="date-picker"
                                value={currentDate}
                                onChange={e => setCurrentDate(e.target.value)}
                                className="p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary"
                            />
                        </div>
                    )}
                </div>
            </div>
            
            <div className="animate-fade-in">
                {activeTab === 'daily' ? (
                    <DailyAttendanceTable 
                        records={todaysRecords} 
                        employees={employees} 
                        onEdit={handleOpenModal}
                        searchQuery={searchQuery}
                    />
                ) : (
                    <MonthlySummaryTable 
                        records={attendanceRecords} 
                        employees={employees} 
                    />
                )}
            </div>
            
            {isModalOpen && (
                <AddEditAttendanceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveRecord}
                    recordToEdit={recordToEdit}
                    employees={employees}
                />
            )}
        </div>
    );
};

export default AttendanceManagementView;