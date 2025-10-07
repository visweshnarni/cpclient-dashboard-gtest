import React, { useMemo } from 'react';
import { AttendanceRecord, Employee } from '../../types';
import { EditIcon } from '../icons/Icons';

interface Props {
    records: AttendanceRecord[];
    employees: Employee[];
    onEdit: (record: AttendanceRecord) => void;
    searchQuery: string;
}

const statusStyles = {
    Present: 'bg-green-100 text-green-800',
    Absent: 'bg-red-100 text-red-800',
    'Half-day': 'bg-yellow-100 text-yellow-800',
    'On Leave': 'bg-blue-100 text-blue-800',
    'Holiday': 'bg-gray-100 text-gray-800',
};

const calculateDuration = (checkIn: string | null, checkOut: string | null): string => {
    if (!checkIn || !checkOut) return '-';
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    
    const inTime = new Date();
    inTime.setHours(inH, inM, 0);
    
    const outTime = new Date();
    outTime.setHours(outH, outM, 0);
    
    if (outTime < inTime) return '-';
    
    let diff = (outTime.getTime() - inTime.getTime()) / 1000 / 60; // difference in minutes
    const hours = Math.floor(diff / 60);
    const minutes = Math.floor(diff % 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const DailyAttendanceTable: React.FC<Props> = ({ records, employees, onEdit, searchQuery }) => {
    const employeeRecordMap = useMemo(() => new Map(records.map(r => [r.employeeId, r])), [records]);

    const allEmployeeStatuses = useMemo(() => {
        let employeeList = employees;
        // If there's a search query, only show employees who are in the `records` list.
        if (searchQuery) {
            const presentEmployeeIds = new Set(records.map(r => r.employeeId));
            employeeList = employees.filter(e => presentEmployeeIds.has(e.id));
        }

        return employeeList.map(emp => {
            return employeeRecordMap.get(emp.id) || {
                id: `temp-${emp.id}`,
                employeeId: emp.id,
                date: new Date().toISOString().split('T')[0],
                checkIn: null,
                checkOut: null,
                status: 'Absent',
            };
        });
    }, [employees, records, searchQuery, employeeRecordMap]);


    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Employee</th>
                            <th scope="col" className="px-6 py-3">Check-in</th>
                            <th scope="col" className="px-6 py-3">Check-out</th>
                            <th scope="col" className="px-6 py-3">Total Hours</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {allEmployeeStatuses.map((record) => {
                            const employee = employees.find(e => e.id === record.employeeId);
                            if (!employee) return null;
                            
                            const duration = calculateDuration(record.checkIn, record.checkOut);

                            return (
                                <tr key={employee.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={employee.avatar} alt={employee.name} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <div>{employee.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{employee.position}</div>
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{record.checkIn || '-'}</td>
                                    <td className="px-6 py-4">{record.checkOut || '-'}</td>
                                    <td className="px-6 py-4">{duration}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[record.status as keyof typeof statusStyles]}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => onEdit(record as AttendanceRecord)} className="font-medium text-primary hover:underline">
                                           <EditIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                 {allEmployeeStatuses.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-text-primary dark:text-gray-200">No Records Found</h3>
                        <p className="text-text-secondary dark:text-gray-400 mt-1">No attendance records for the selected date or filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyAttendanceTable;