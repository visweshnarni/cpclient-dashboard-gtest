
import React, { useState, useMemo } from 'react';
import { AttendanceRecord, Employee, AttendanceStatus } from '../../types';

interface Props {
    records: AttendanceRecord[];
    employees: Employee[];
}

const statusBadge = (status: AttendanceStatus) => {
    switch (status) {
        case 'Present': return <span className="text-green-600 font-bold" title="Present">P</span>;
        case 'Absent': return <span className="text-red-600 font-bold" title="Absent">A</span>;
        case 'Half-day': return <span className="text-yellow-600 font-bold" title="Half-day">HD</span>;
        case 'On Leave': return <span className="text-blue-600 font-bold" title="On Leave">L</span>;
        case 'Holiday': return <span className="text-gray-500 font-bold" title="Holiday">H</span>;
        default: return <span className="text-gray-400">-</span>;
    }
};

const MonthlySummaryTable: React.FC<Props> = ({ records, employees }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    
    const { daysInMonth, monthName } = useMemo(() => {
        const [year, month] = currentMonth.split('-').map(Number);
        const date = new Date(year, month - 1, 1);
        const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const days = new Date(year, month, 0).getDate();
        return { daysInMonth: Array.from({ length: days }, (_, i) => i + 1), monthName };
    }, [currentMonth]);
    
    const monthlyData = useMemo(() => {
        const [year, month] = currentMonth.split('-').map(Number);

        return employees.map(emp => {
            const empRecords = records.filter(r => 
                r.employeeId === emp.id && new Date(r.date).getFullYear() === year && new Date(r.date).getMonth() === month - 1
            );
            const recordMap = new Map(empRecords.map(r => [new Date(r.date).getDate(), r.status]));
            
            const summary = empRecords.reduce((acc, record) => {
                acc[record.status] = (acc[record.status] || 0) + 1;
                return acc;
            }, {} as Record<AttendanceStatus, number>);
            
            return {
                employee: emp,
                statuses: daysInMonth.map(day => {
                    const date = new Date(year, month - 1, day);
                    const dayOfWeek = date.getDay();
                    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
                        return recordMap.get(day) || 'Holiday';
                    }
                    return recordMap.get(day);
                }),
                summary,
            };
        });
    }, [currentMonth, records, employees, daysInMonth]);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
             <div className="p-4 flex justify-between items-center border-b">
                 <h3 className="font-semibold text-text-primary">Summary for {monthName}</h3>
                 <input 
                    type="month" 
                    value={currentMonth}
                    onChange={e => setCurrentMonth(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-20">
                        <tr>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap min-w-[200px] sticky left-0 bg-gray-50 z-30">Employee</th>
                            {daysInMonth.map(day => <th key={day} scope="col" className="px-2 py-3 text-center w-8">{day}</th>)}
                            <th scope="col" className="px-3 py-3 text-center whitespace-nowrap bg-gray-100 sticky right-0 z-30">Present</th>
                            <th scope="col" className="px-3 py-3 text-center whitespace-nowrap bg-gray-100 sticky right-0 z-30">Absent</th>
                            <th scope="col" className="px-3 py-3 text-center whitespace-nowrap bg-gray-100 sticky right-0 z-30">Leave</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyData.map(({ employee, statuses, summary }) => (
                            <tr key={employee.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap sticky left-0 bg-white hover:bg-gray-50 z-10">
                                    {employee.name}
                                </td>
                                {statuses.map((status, i) => (
                                    <td key={i} className="px-2 py-2 text-center w-8">{status ? statusBadge(status) : '-'}</td>
                                ))}
                                <td className="px-3 py-2 text-center font-semibold bg-gray-50 sticky right-0 z-10">{(summary.Present || 0) + (summary['Half-day'] || 0)}</td>
                                <td className="px-3 py-2 text-center font-semibold bg-gray-50 sticky right-0 z-10">{summary.Absent || 0}</td>
                                <td className="px-3 py-2 text-center font-semibold bg-gray-50 sticky right-0 z-10">{summary['On Leave'] || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlySummaryTable;
