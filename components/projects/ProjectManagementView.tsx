import React, { useState, useMemo } from 'react';
import { Project, Employee } from '../../types';
import { mockProjects, mockEmployees } from './data';
import { PlusIcon, FilterIcon, ReportIcon, ProjectIcon, UsersIcon } from '../icons/Icons';
import AddEditProjectModal from './AddEditProjectModal';
import ProjectCard from './ProjectCard';

const departmentConfig = {
    'IT': { icon: <ProjectIcon />, color: 'blue' },
    'Finance': { icon: <ReportIcon />, color: 'green' },
    'HR': { icon: <UsersIcon />, color: 'indigo' },
    'Marketing': { icon: <UsersIcon />, color: 'yellow' },
};

interface Props {
  searchQuery: string;
}

const ProjectManagementView: React.FC<Props> = ({ searchQuery }) => {
    const [projects, setProjects] = useState<Project[]>(mockProjects);
    const [employees] = useState<Employee[]>(mockEmployees);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

    const [filters, setFilters] = useState({
        department: 'all',
        status: 'all',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const searchMatch = searchQuery ? 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.description.toLowerCase().includes(searchQuery.toLowerCase()) 
                : true;
            const departmentMatch = filters.department === 'all' || p.department === filters.department;
            const statusMatch = filters.status === 'all' || p.status === filters.status;
            return searchMatch && departmentMatch && statusMatch;
        });
    }, [projects, filters, searchQuery]);
    
    const departmentOverviews = useMemo(() => {
        return Object.keys(departmentConfig).map(dept => {
            const deptProjects = projects.filter(p => p.department === dept);
            if (deptProjects.length === 0) return null;

            const completed = deptProjects.filter(p => p.status === 'Completed').length;
            const inProgress = deptProjects.length - completed;
            const progress = deptProjects.length > 0 ? Math.round((completed / deptProjects.length) * 100) : 0;
            
            return {
                name: dept,
                activeProjects: inProgress,
                progress,
                completed,
                inProgress,
                ...departmentConfig[dept as keyof typeof departmentConfig]
            };
        }).filter(Boolean);
    }, [projects]);


    const handleOpenModal = (project: Project | null) => {
        setProjectToEdit(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProjectToEdit(null);
    };

    const handleSaveProject = (projectData: Project) => {
        if (projectData.id) {
            // Edit existing project
            setProjects(projects.map(p => p.id === projectData.id ? projectData : p));
        } else {
            // Add new project
            const newProject = { ...projectData, id: `proj-${Date.now()}`, progress: projectData.status === 'Completed' ? 100 : projectData.progress || 0 };
            setProjects([newProject, ...projects]);
        }
        handleCloseModal();
    };
    
    const handleDeleteProject = (projectId: string) => {
        if(window.confirm('Are you sure you want to delete this project?')) {
            setProjects(projects.filter(p => p.id !== projectId));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Projects</h2>
                     <p className="text-text-secondary dark:text-gray-400 mt-1">Track, manage, and collaborate on all company projects.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal(null)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <PlusIcon />
                    <span>Add Project</span>
                </button>
            </div>

            {/* Department Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {departmentOverviews.map(dept => dept && (
                     <div key={dept.name} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-l-4" style={{ borderLeftColor: `var(--color-${dept.color}-500, #3B82F6)`}}>
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full bg-${dept.color}-100 text-${dept.color}-600`}>
                                   {dept.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary dark:text-gray-200">{dept.name}</h3>
                                    <p className="text-xs text-text-secondary dark:text-gray-400">{dept.activeProjects} Active Projects</p>
                                </div>
                           </div>
                           <span className="font-bold text-lg text-text-primary dark:text-gray-200">{dept.progress}%</span>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className={`bg-${dept.color}-500 h-2 rounded-full`} style={{ width: `${dept.progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-text-secondary dark:text-gray-400 mt-1">
                                <span>{dept.completed} Completed</span>
                                <span>{dept.inProgress} In Progress</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="department" className="text-sm font-medium text-text-secondary dark:text-gray-400 block mb-1">Department</label>
                        <select name="department" id="department" value={filters.department} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="all">All</option>
                            <option value="IT">IT</option>
                            <option value="Finance">Finance</option>
                            <option value="HR">HR</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="text-sm font-medium text-text-secondary dark:text-gray-400 block mb-1">Status</label>
                        <select name="status" id="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="all">All</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            employees={employees} 
                            onEdit={() => handleOpenModal(project)}
                            onDelete={() => handleDeleteProject(project.id)}
                        />
                    ))
                ) : (
                    <div className="md:col-span-2 xl:col-span-3 text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold text-text-primary dark:text-gray-200">No Projects Found</h3>
                        <p className="text-text-secondary dark:text-gray-400 mt-2">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <AddEditProjectModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveProject}
                    projectToEdit={projectToEdit}
                    employees={employees}
                />
            )}
        </div>
    );
};

export default ProjectManagementView;