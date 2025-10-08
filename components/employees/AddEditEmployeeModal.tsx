import React, { useState, useEffect } from 'react';
import { Employee } from '../../types';
import { XIcon } from '../icons/Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  employeeToEdit: Employee | null;
}

const emptyEmployee: Partial<Employee> = {
  name: '',
  email: '',
  phone: '',
  position: 'Developer',
  department: 'IT',
  address: '',
  status: 'Active',
  avatar: 'https://picsum.photos/seed/new/40/40',
  joiningDate: new Date().toISOString().split('T')[0],
  dob: '',
};

const AddEditEmployeeModal: React.FC<Props> = ({ isOpen, onClose, onSave, employeeToEdit }) => {
  const [employee, setEmployee] = useState<Partial<Employee>>(emptyEmployee);

  useEffect(() => {
    setEmployee(employeeToEdit || emptyEmployee);
  }, [employeeToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee.name && employee.email && employee.position) {
      onSave(employee as Employee);
    } else {
      alert('Please fill in all required fields (*).');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-text-primary dark:text-gray-200">{employeeToEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-5 h-5 text-text-secondary dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                    <input type="text" name="name" value={employee.name} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                    <input type="email" name="email" value={employee.email} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary" required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <input type="tel" name="phone" value={employee.phone} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                    <input type="date" name="dob" value={employee.dob} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position *</label>
                    <input type="text" name="position" value={employee.position} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                    <select name="department" value={employee.department} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 bg-white focus:ring-primary focus:border-primary">
                        <option>IT</option>
                        <option>Finance</option>
                        <option>HR</option>
                        <option>Marketing</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea name="address" value={employee.address} onChange={handleChange} rows={2} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div className="flex justify-end items-center gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-primary hover:bg-blue-700 text-white font-semibold shadow">Save Employee</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditEmployeeModal;
