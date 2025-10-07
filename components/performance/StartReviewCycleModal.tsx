
import React, { useState } from 'react';
import { XIcon } from '../icons/Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartCycle: (cycleData: { reviewPeriod: string; startDate: string; endDate: string }) => void;
}

const StartReviewCycleModal: React.FC<Props> = ({ isOpen, onClose, onStartCycle }) => {
  const [reviewPeriod, setReviewPeriod] = useState(`Q${Math.floor(new Date().getMonth() / 3) + 1} ${new Date().getFullYear()}`);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewPeriod && startDate && endDate) {
      onStartCycle({ reviewPeriod, startDate, endDate });
    } else {
      alert('Please fill in all fields.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-text-primary">Start New Review Cycle</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <XIcon className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="reviewPeriod" className="block text-sm font-medium text-gray-700 mb-1">Review Period Name *</label>
              <input 
                type="text" 
                id="reviewPeriod"
                value={reviewPeriod}
                onChange={e => setReviewPeriod(e.target.value)}
                required 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input 
                  type="date" 
                  id="startDate"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input 
                  type="date" 
                  id="endDate"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                        This action will create a new, pending performance review for all active employees.
                        </p>
                    </div>
                </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-emerald-600 transition">Start Cycle</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartReviewCycleModal;
