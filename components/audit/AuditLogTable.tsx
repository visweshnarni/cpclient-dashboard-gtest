
import React, { useState } from 'react';
import { AuditLog } from '../../types';
import { format } from 'date-fns';

interface Props {
  logs: AuditLog[];
}

const ITEMS_PER_PAGE = 10;

const AuditLogTable: React.FC<Props> = ({ logs }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
    const paginatedLogs = logs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                            <th scope="col" className="px-6 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLogs.map((log) => (
                            <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {format(new Date(log.timestamp), 'MMM d, yyyy, h:mm:ss a')}
                                </td>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img src={log.userAvatar} alt={log.user} className="w-8 h-8 rounded-full" />
                                        <div>{log.user}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {logs.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-text-primary">No Logs Found</h3>
                        <p className="text-text-secondary mt-1">There are no audit logs for the selected date.</p>
                    </div>
                )}
            </div>
             {totalPages > 1 && (
                <div className="p-4 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                        Showing <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold">{Math.min(currentPage * ITEMS_PER_PAGE, logs.length)}</span> of <span className="font-semibold">{logs.length}</span> results
                    </span>
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 disabled:opacity-50">
                            Previous
                        </button>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogTable;
