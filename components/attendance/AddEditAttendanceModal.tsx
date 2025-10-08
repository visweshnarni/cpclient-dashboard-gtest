
import React, { useState, useEffect } from 'react';
import { AttendanceRecord, Employee } from '../../types';
import { XIcon } from '../icons/Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: AttendanceRecord) => void;
  recordToEdit: AttendanceRecord | null;
  employees: Employee[];
}

const AddEditAttendanceModal: React.FC<Props> = ({ isOpen, onClose, onSave, recordToEdit, employees }) => {
  const [record, setRecord] = useState<Partial<AttendanceRecord>>({});

  useEffect(() => {
    if (recordToEdit) {
      setRecord(recordToEdit);
    } else {
      setRecord({
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      });
    }
  }, [recordToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecord(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (record.employeeId && record.date && record.status) {
        // Here you would typically generate a real ID
        const finalRecord = { ...record, id: record.id || `att-${Date.now()}` } as AttendanceRecord;
        onSave(finalRecord);
    } else {
      alert('Please select an employee and set a date and status.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-text-primary">{recordToEdit ? 'Edit Attendance' : 'Add Manual Entry'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <XIcon className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
              <select name="employeeId" value={record.employeeId || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white" disabled={!!recordToEdit}>
                <option value="" disabled>Select an employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input type="date" name="date" value={record.date || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select name="status" value={record.status || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white">
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Half-day">Half-day</option>
                        <option value="On Leave">On Leave</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                <input type="time" name="checkIn" value={record.checkIn || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                <input type="time" name="checkOut" value={record.checkOut || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">Save Record</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditAttendanceModal;
