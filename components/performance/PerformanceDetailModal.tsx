
import React from 'react';
import { PerformanceReview, Employee } from '../../types';
import { XIcon, StarIcon } from '../icons/Icons';
import StarRating from './StarRating';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  review: PerformanceReview;
  employee: Employee;
}

const PerformanceDetailModal: React.FC<Props> = ({ isOpen, onClose, review, employee }) => {
  if (!isOpen || !employee) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Performance Review</h2>
            <p className="text-sm text-text-secondary">{employee.name} - {formatDate(review.reviewDate)}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <XIcon className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {/* Overall Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-text-primary mb-2">Overall Summary</h3>
                <div className="flex items-center gap-4">
                    <img src={employee.avatar} alt={employee.name} className="w-16 h-16 rounded-full" />
                    <div>
                        <p className="text-lg font-bold">{employee.name}</p>
                        <p className="text-sm text-text-secondary">{employee.position} ({employee.department})</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-sm text-text-secondary">Overall Rating</p>
                        <div className="flex items-center gap-2">
                           <StarRating rating={review.overallRating} />
                           <span className="text-xl font-bold">{review.overallRating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Breakdown */}
            <div>
                <h3 className="font-semibold text-text-primary mb-3">KPI Breakdown</h3>
                <div className="space-y-3">
                    {review.kpis.map(kpi => (
                        <div key={kpi.name} className="border p-3 rounded-md">
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-text-primary">{kpi.name}</p>
                                <StarRating rating={kpi.rating} />
                            </div>
                            <p className="text-sm text-text-secondary mt-1 italic">"{kpi.comment}"</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Manager's Comments</h4>
                    <p className="text-sm text-blue-700">{review.managerComments}</p>
                </div>
                 <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Employee's Comments</h4>
                    <p className="text-sm text-green-700">{review.employeeComments}</p>
                </div>
            </div>

            {/* Performance Improvement Plan */}
            {review.improvementPlan && (
                 <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Performance Improvement Plan (PIP)</h4>
                    <p className="text-sm text-red-700">{review.improvementPlan}</p>
                </div>
            )}
        </div>

        <div className="flex justify-end items-center gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
            <button type="button" onClick={() => alert('Editing review...')} className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition">Edit Review</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDetailModal;
