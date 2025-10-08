

import React, { useMemo } from 'react';
import { DepartmentInfo, Employee, Project, Service } from '../../types';
// FIX: Added missing icon imports.
import { EditIcon, TrashIcon, UsersIcon, ProjectIcon, ServiceIcon } from '../icons/Icons';

interface Props {
    department: DepartmentInfo;
    employees: Employee[];
    projects: Project[];
    services: Service[];
    onEdit: () => void;
    onDelete: () => void;
}

const DepartmentCard: React.FC<Props> = ({ department, employees, projects, services, onEdit, onDelete }) => {
    const manager = useMemo(() => employees.find(e => e.id === department.managerId), [employees, department.managerId]);
    const departmentEmployees = useMemo(() => employees.filter(e => e.department === department.name), [employees, department.name]);
    
    const stats = useMemo(() => {
        const activeProjects = projects.filter(p => p.department === department.name && p.status === 'Active').length;
        
        // A simple logic to assign services to a department
        const serviceDeptMap: Record<Service['category'], Project['department']> = {
            'Tax': 'Finance', 'GST': 'Finance', 'Startup': 'Finance',
            'Legal': 'HR', 'Audit': 'Finance'
        };
        const openServices = services.filter(s => {
            const dept = serviceDeptMap[s.category];
            return dept === department.name && s.status !== 'Completed';
        }).length;

        return { activeProjects, openServices };
    }, [projects, services, department.name]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-primary dark:text-blue-400">{department.name}</h3>
                        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">{department.description}</p>
                    </div>
                     <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={onEdit} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"><EditIcon /></button>
                        <button onClick={onDelete} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500"><TrashIcon /></button>
                    </div>
                </div>

                {manager && (
                    <div className="mt-4 border-t dark:border-gray-700 pt-4">
                        <p className="text-xs font-semibold text-text-secondary dark:text-gray-400 uppercase">Manager</p>
                        <div className="flex items-center gap-3 mt-2">
                            <img src={manager.avatar} alt={manager.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-text-primary dark:text-gray-200">{manager.name}</p>
                                <p className="text-sm text-text-secondary dark:text-gray-400">{manager.position}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-center border-t dark:border-gray-700 pt-4">
                     <div>
                        <p className="text-xs text-text-secondary dark:text-gray-400">Employees</p>
                        <p className="text-2xl font-bold text-text-primary dark:text-gray-200 flex items-center justify-center gap-1"><UsersIcon className="w-5 h-5" /> {departmentEmployees.length}</p>
                    </div>
                     <div>
                        <p className="text-xs text-text-secondary dark:text-gray-400">Active Projects</p>
                        <p className="text-2xl font-bold text-text-primary dark:text-gray-200 flex items-center justify-center gap-1"><ProjectIcon className="w-5 h-5" /> {stats.activeProjects}</p>
                    </div>
                     <div>
                        <p className="text-xs text-text-secondary dark:text-gray-400">Open Services</p>
                        <p className="text-2xl font-bold text-text-primary dark:text-gray-200 flex items-center justify-center gap-1"><ServiceIcon className="w-5 h-5" /> {stats.openServices}</p>
                    </div>
                </div>
            </div>

            <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                <p className="text-xs font-medium text-text-secondary dark:text-gray-400 mb-2">Team Members:</p>
                <div className="flex items-center">
                    <div className="flex -space-x-2">
                        {departmentEmployees.slice(0, 8).map(emp => (
                            <img key={emp.id} className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" src={emp.avatar} alt={emp.name} title={emp.name} />
                        ))}
                    </div>
                    {departmentEmployees.length > 8 && (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-full h-8 w-8 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                            +{departmentEmployees.length - 8}
                        </span>
                    )}
                     {departmentEmployees.length === 0 && (
                        <p className="text-xs text-text-secondary dark:text-gray-400 italic">No employees assigned.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentCard;
