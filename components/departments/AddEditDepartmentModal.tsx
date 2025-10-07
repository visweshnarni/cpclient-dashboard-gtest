
import React, { useState, useEffect } from 'react';
import { DepartmentInfo, Employee, Department } from '../../types';
import { XIcon } from '../icons/Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (department: DepartmentInfo) => void;
  departmentToEdit: DepartmentInfo | null;
  employees: Employee[];
}

const emptyDepartment: Omit<DepartmentInfo, 'id'> = {
  name: 'IT',
  managerId: null,
  description: '',
};

const AddEditDepartmentModal: React.FC<Props> = ({ isOpen, onClose, onSave, departmentToEdit, employees }) => {
  const [department, setDepartment] = useState<Omit<DepartmentInfo, 'id'> & { id?: string }>(emptyDepartment);

  useEffect(() => {
    setDepartment(departmentToEdit || emptyDepartment);
  }, [departmentToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDepartment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (department.name && department.description) {
      onSave({
          ...department,
          managerId: department.managerId ? Number(department.managerId) : null
      } as DepartmentInfo);
    } else {
      alert('Please fill in all required fields (*).');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-text-primary dark:text-gray-200">{departmentToEdit ? 'Edit Department' : 'Add New Department'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-5 h-5 text-text-secondary dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department Name *</label>
              <select name="name" value={department.name} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white">
                {(['IT', 'Finance', 'HR', 'Marketing'] as Department[]).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Manager</label>
              <select name="managerId" value={department.managerId || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white">
                <option value="">None</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
              <textarea name="description" value={department.description} onChange={handleChange} rows={3} required className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary"></textarea>
            </div>
          </div>
          <div className="flex justify-end items-center gap-3 p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">{departmentToEdit ? 'Save Changes' : 'Create Department'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditDepartmentModal;
