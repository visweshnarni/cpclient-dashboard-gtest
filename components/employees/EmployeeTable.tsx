import React from 'react';
import { Employee } from '../../types';
// FIX: Added missing EditIcon import.
import { EditIcon, TrashIcon } from '../icons/Icons';

interface Props {
  employees: Employee[];
  onViewDetails: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: number) => void;
}

const statusStyles = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'On Leave': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Terminated: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const EmployeeTable: React.FC<Props> = ({ employees, onViewDetails, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3">Employee</th>
                        <th scope="col" className="px-6 py-3">Position</th>
                        <th scope="col" className="px-6 py-3">Department</th>
                        <th scope="col" className="px-6 py-3">Contact</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full" />
                                    <div>{employee.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">{employee.position}</td>
                            <td className="px-6 py-4">{employee.department}</td>
                            <td className="px-6 py-4">
                                <div>{employee.email}</div>
                                <div className="text-xs text-gray-500">{employee.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[employee.status]}`}>
                                    {employee.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => onViewDetails(employee)} className="text-primary hover:underline font-medium">View</button>
                                    <button onClick={() => onEdit(employee)} className="p-2 text-gray-500 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => onDelete(employee.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
             {employees.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-gray-200">No Employees Found</h3>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">Try adjusting your search or filter criteria.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default EmployeeTable;
