import React, { useState, useEffect } from 'react';
import { Project, Employee, Department, ITSubDepartment, ProjectPriority, ProjectStatus } from '../../types';
import { XIcon } from '../icons/Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  projectToEdit: Project | null;
  employees: Employee[];
}

const emptyProject: Omit<Project, 'id' | 'progress'> = {
  name: '',
  department: 'IT',
  status: 'Pending',
  priority: 'Medium',
  description: '',
  startDate: '',
  endDate: '',
  assignedEmployees: [],
};

const AddEditProjectModal: React.FC<Props> = ({ isOpen, onClose, onSave, projectToEdit, employees }) => {
  const [project, setProject] = useState<Omit<Project, 'id' | 'progress'> & { id?: string, progress?: number }>(emptyProject);

  useEffect(() => {
    if (projectToEdit) {
      setProject(projectToEdit);
    } else {
      setProject(emptyProject);
    }
  }, [projectToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => {
        const newState = {...prev, [name]: value};
        // Reset subDepartment if department is not IT
        if (name === 'department' && value !== 'IT') {
            delete newState.subDepartment;
        }
        return newState;
    });
  };
  
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => Number(option.value));
    setProject(prev => ({...prev, assignedEmployees: selectedIds}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (project.name && project.startDate && project.endDate) {
      onSave(project as Project);
    } else {
      alert('Please fill in all required fields (*).');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-text-primary dark:text-gray-200">{projectToEdit ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-5 h-5 text-text-secondary dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-6">
             <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name *</label>
                        <input type="text" name="name" value={project.name} onChange={handleChange} placeholder="Enter project name" required className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary" />
                    </div>
                     <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department *</label>
                        <select name="department" value={project.department} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white">
                            <option value="IT">IT Development</option>
                            <option value="Finance">Finance</option>
                            <option value="HR">Human Resources</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>
                    {project.department === 'IT' && (
                         <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IT Sub-Department</label>
                            <select name="subDepartment" value={project.subDepartment || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white">
                                <option value="">Select sub-department</option>
                                <option value="Web Development">Web Development</option>
                                <option value="App Development">App Development</option>
                                <option value="Server Development">Server Development</option>
                            </select>
                        </div>
                    )}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority *</label>
                        <select name="priority" value={project.priority} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white">
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                     <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                        <select name="status" value={project.status} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white">
                             <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Description</label>
                        <textarea name="description" value={project.description} onChange={handleChange} placeholder="Describe the project..." rows={3} className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary"></textarea>
                    </div>
                </div>
             </div>

             <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                        <input type="date" name="startDate" value={project.startDate} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date *</label>
                        <input type="date" name="endDate" value={project.endDate} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary"/>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Team Assignment</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Team Members</label>
                    <select
                        multiple
                        name="assignedEmployees"
                        value={project.assignedEmployees.map(String)}
                        onChange={handleMultiSelectChange}
                        className="w-full h-32 p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary"
                    >
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple members.</p>
                </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-3 p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">{projectToEdit ? 'Save Changes' : 'Create Project'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProjectModal;