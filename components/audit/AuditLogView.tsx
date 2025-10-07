import React, { useState, useMemo } from 'react';
import { AuditLog } from '../../types';
import { mockAuditLogs } from './data';
import AuditLogTable from './AuditLogTable';

interface Props {
    searchQuery: string;
}

const AuditLogView: React.FC<Props> = ({ searchQuery }) => {
    const [logs] = useState<AuditLog[]>(mockAuditLogs);
    const [filterDate, setFilterDate] = useState('');

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const dateMatch = !filterDate || new Date(log.timestamp).toISOString().slice(0,10) === filterDate;
            const searchMatch = searchQuery
                ? log.action.toLowerCase().includes(searchQuery.toLowerCase()) || log.details.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            return dateMatch && searchMatch;
        });
    }, [logs, filterDate, searchQuery]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Audit Logs</h2>
                <p className="text-text-secondary dark:text-gray-400 mt-1">Track all administrative actions for security and transparency.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-4">
                    <label htmlFor="date-filter" className="text-sm font-medium text-text-secondary dark:text-gray-400">Filter by Date:</label>
                    <input 
                        type="date" 
                        id="date-filter"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        className="p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary"
                    />
                     <button onClick={() => setFilterDate('')} className="text-sm text-primary hover:underline">
                        Clear
                    </button>
                </div>
            </div>

            <AuditLogTable logs={filteredLogs} />
        </div>
    );
};

export default AuditLogView;