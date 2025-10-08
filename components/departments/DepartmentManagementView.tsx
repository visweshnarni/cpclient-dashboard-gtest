

import React, { useState, useMemo } from 'react';
import { DepartmentInfo, Employee, Project, Service } from '../../types';
import { mockDepartments } from './data';
import { mockEmployees, mockProjects } from '../projects/data';
import { mockServices } from '../services/data';
// FIX: Added missing icon imports.
import { PlusIcon, DepartmentIcon, UsersIcon } from '../icons/Icons';
import KPICard from '../dashboard/KPICard';
import DepartmentCard from './DepartmentCard';
import AddEditDepartmentModal from './AddEditDepartmentModal';

const DepartmentManagementView: React.FC = () => {
    const [departments, setDepartments] = useState<DepartmentInfo[]>(mockDepartments);
    const [employees] = useState<Employee[]>(mockEmployees);
    const [projects] = useState<Project[]>(mockProjects);
    const [services] = useState<Service[]>(mockServices);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departmentToEdit, setDepartmentToEdit] = useState<DepartmentInfo | null>(null);

    const stats = useMemo(() => ({
        totalDepartments: departments.length,
        totalEmployees: employees.length,
    }), [departments, employees]);

    const handleOpenModal = (department: DepartmentInfo | null) => {
        setDepartmentToEdit(department);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDepartmentToEdit(null);
    };

    const handleSaveDepartment = (deptData: DepartmentInfo) => {
        if (departments.some(d => d.id === deptData.id)) {
            setDepartments(departments.map(d => d.id === deptData.id ? deptData : d));
        } else {
            const newDept = { ...deptData, id: `dept-${deptData.name.toLowerCase()}-${Date.now()}` };
            setDepartments([...departments, newDept]);
        }
        handleCloseModal();
    };

    const handleDeleteDepartment = (deptId: string) => {
        const dept = departments.find(d => d.id === deptId);
        if (dept && window.confirm(`Are you sure you want to delete the ${dept.name} department?`)) {
            setDepartments(departments.filter(d => d.id !== deptId));
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Departments</h2>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">Manage company departments and resource allocation.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal(null)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon />
                    <span>Add Department</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <KPICard title="Total Departments" value={String(stats.totalDepartments)} icon={<DepartmentIcon />} color="indigo" />
                 <KPICard title="Total Employees" value={String(stats.totalEmployees)} icon={<UsersIcon />} color="teal" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {departments.map(dept => (
                    <DepartmentCard
                        key={dept.id}
                        department={dept}
                        employees={employees}
                        projects={projects}
                        services={services}
                        onEdit={() => handleOpenModal(dept)}
                        onDelete={() => handleDeleteDepartment(dept.id)}
                    />
                ))}
            </div>

            {isModalOpen && (
                <AddEditDepartmentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveDepartment}
                    departmentToEdit={departmentToEdit}
                    employees={employees}
                />
            )}
        </div>
    );
};

export default DepartmentManagementView;
