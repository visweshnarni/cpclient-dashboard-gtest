
import React, { useState, useMemo } from 'react';
import { Employee } from '../../types';
import { mockEmployees } from './data';
import { PlusIcon, UsersIcon, UserPlusIcon, LeaveIcon, DownloadIcon } from '../icons/Icons';
import KPICard from '../dashboard/KPICard';
import EmployeeTable from './EmployeeTable';
import EmployeeDetail from './EmployeeDetail';
import AddEditEmployeeModal from './AddEditEmployeeModal';

interface Props {
  searchQuery: string;
}

const EmployeeManagementView: React.FC<Props> = ({ searchQuery }) => {
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
    
    const [filters, setFilters] = useState({
        department: 'all',
        status: 'all',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const searchMatch = searchQuery ? emp.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
            const departmentMatch = filters.department === 'all' || emp.department === filters.department;
            const statusMatch = filters.status === 'all' || emp.status === filters.status;
            return searchMatch && departmentMatch && statusMatch;
        });
    }, [employees, filters, searchQuery]);

    const stats = useMemo(() => ({
        total: employees.length,
        active: employees.filter(e => e.status === 'Active').length,
        onLeave: employees.filter(e => e.status === 'On Leave').length,
    }), [employees]);
    
    const handleOpenModal = (employee: Employee | null) => {
        setEmployeeToEdit(employee);
        setIsModalOpen(true);
    };

    const handleSaveEmployee = (employeeData: Employee) => {
        if (employeeData.id && employees.some(e => e.id === employeeData.id)) {
            setEmployees(employees.map(e => e.id === employeeData.id ? employeeData : e));
        } else {
            const newEmployee = { ...employeeData, id: Math.max(...employees.map(e => e.id)) + 1 };
            setEmployees([newEmployee, ...employees]);
        }
        setIsModalOpen(false);
        setEmployeeToEdit(null);
    };
    
    const handleDeleteEmployee = (employeeId: number) => {
        if(window.confirm('Are you sure you want to delete this employee record? This action cannot be undone.')) {
            setEmployees(employees.filter(e => e.id !== employeeId));
        }
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Position', 'Department', 'Status', 'Joining Date', 'Date of Birth', 'Address'];
        
        const escapeCSV = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

        const csvRows = [
            headers.join(','),
            ...filteredEmployees.map(emp => [
                emp.id,
                escapeCSV(emp.name),
                escapeCSV(emp.email),
                escapeCSV(emp.phone),
                escapeCSV(emp.position),
                emp.department,
                emp.status,
                emp.joiningDate,
                emp.dob,
                escapeCSV(emp.address)
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'employees.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (selectedEmployee) {
        return <EmployeeDetail employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Employee Management</h2>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">Manage all employee records, roles, and profiles.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-text-primary dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        <DownloadIcon />
                        <span>Export CSV</span>
                    </button>
                    <button 
                        onClick={() => handleOpenModal(null)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <UserPlusIcon />
                        <span>Add Employee</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard title="Total Employees" value={String(stats.total)} icon={<UsersIcon />} color="blue" />
                <KPICard title="Active Employees" value={String(stats.active)} icon={<UserPlusIcon />} color="green" />
                <KPICard title="Employees On Leave" value={String(stats.onLeave)} icon={<LeaveIcon />} color="yellow" />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="department" className="text-sm font-medium text-text-secondary dark:text-gray-400 block mb-1">Filter by Department</label>
                        <select name="department" id="department" value={filters.department} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="all">All</option>
                            <option value="IT">IT</option>
                            <option value="Finance">Finance</option>
                            <option value="HR">HR</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="text-sm font-medium text-text-secondary dark:text-gray-400 block mb-1">Filter by Status</label>
                        <select name="status" id="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="all">All</option>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Terminated">Terminated</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <EmployeeTable
                employees={filteredEmployees}
                onViewDetails={setSelectedEmployee}
                onEdit={handleOpenModal}
                onDelete={handleDeleteEmployee}
            />

            {isModalOpen && (
                <AddEditEmployeeModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEmployeeToEdit(null); }}
                    onSave={handleSaveEmployee}
                    employeeToEdit={employeeToEdit}
                />
            )}
        </div>
    );
};

export default EmployeeManagementView;