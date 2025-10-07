import React from 'react';
import { Project, Employee } from '../../types';
import { EditIcon, TrashIcon } from '../icons/Icons';

interface Props {
  project: Project;
  employees: Employee[];
  onEdit: () => void;
  onDelete: () => void;
}

const statusStyles = {
  Active: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
  Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  Completed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
};

const ProjectCard: React.FC<Props> = ({ project, employees, onEdit, onDelete }) => {
  const assigned = employees.filter(emp => project.assignedEmployees.includes(emp.id));
  const { bg, text, border } = statusStyles[project.status];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border-t-4 ${border}`}>
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
            {project.status}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors">
              <EditIcon />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 transition-colors">
              <TrashIcon />
            </button>
          </div>
        </div>
        <h3 className="mt-2 text-lg font-bold text-text-primary dark:text-gray-200 truncate">{project.name}</h3>
        <p className="text-sm text-text-secondary dark:text-gray-400">{project.department}{project.subDepartment ? ` (${project.subDepartment})` : ''}</p>

        <div className="mt-4">
            <div className="flex justify-between text-xs font-medium text-text-secondary dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
            </div>
        </div>
        
         <div className="mt-4 text-sm">
            <p className="text-text-secondary dark:text-gray-400"><strong>Deadline:</strong> <span className="font-medium text-text-primary dark:text-gray-200">{formatDate(project.endDate)}</span></p>
        </div>

      </div>
      
      <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
            <p className="text-xs font-medium text-text-secondary dark:text-gray-400 mb-2">Team:</p>
            <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                    {assigned.slice(0, 4).map(emp => (
                        <img key={emp.id} className="h-7 w-7 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" src={emp.avatar} alt={emp.name} title={emp.name} />
                    ))}
                </div>
                {assigned.length > 4 && (
                    <span className="text-xs font-semibold text-gray-500 bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-full h-7 w-7 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        +{assigned.length - 4}
                    </span>
                )}
            </div>
      </div>
    </div>
  );
};

export default ProjectCard;