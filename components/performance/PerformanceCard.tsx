
import React from 'react';
import { PerformanceReview, Employee } from '../../types';
import { ProjectIcon, ServiceIcon } from '../icons/Icons';
import StarRating from './StarRating';
import PerformanceTrendChart from './PerformanceTrendChart';

interface Props {
  review: PerformanceReview;
  employee: Employee;
  projectsCompleted: number;
  servicesDelivered: number;
  onViewDetails: () => void;
}

const statusStyles = {
    'Excellent': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
    'Good': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
    'Average': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
    'Needs Improvement': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
    'Pending Review': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-400' },
};

const PerformanceCard: React.FC<Props> = ({ review, employee, projectsCompleted, servicesDelivered, onViewDetails }) => {
    if (!employee) return null;
    const { bg, text, border } = statusStyles[review.status];

    return (
        <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border-t-4 ${border}`}>
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full" />
                        <div>
                            <h3 className="font-bold text-text-primary text-lg">{employee.name}</h3>
                            <p className="text-sm text-text-secondary">{employee.position}</p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
                        {review.status}
                    </span>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-text-secondary">{review.reviewPeriod}</p>
                </div>

                {review.status === 'Pending Review' ? (
                     <div className="mt-2 flex items-center justify-center h-24 bg-gray-50 rounded-md">
                        <p className="text-text-secondary text-sm italic">Review not yet started.</p>
                     </div>
                ) : (
                    <>
                        <div className="mt-4 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-text-secondary">Overall Rating</p>
                                <div className="flex items-center gap-2">
                                   <StarRating rating={review.overallRating} />
                                   <span className="font-bold text-text-primary">{review.overallRating.toFixed(1)}</span>
                                </div>
                            </div>
                            <div className="w-24 h-12">
                               <PerformanceTrendChart data={review.historicalData} />
                            </div>
                        </div>

                        <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <ProjectIcon className="w-4 h-4 text-blue-500"/>
                                <span>Projects: <span className="font-semibold text-text-primary">{projectsCompleted}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <ServiceIcon className="w-4 h-4 text-green-500"/>
                                <span>Services: <span className="font-semibold text-text-primary">{servicesDelivered}</span></span>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="p-4 bg-gray-50 rounded-b-xl">
                 <button 
                    onClick={onViewDetails}
                    disabled={review.status === 'Pending Review'}
                    className="w-full text-center px-4 py-2 bg-white border border-gray-300 text-sm font-semibold text-primary rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {review.status === 'Pending Review' ? 'Pending' : 'View Details'}
                </button>
            </div>
        </div>
    );
};

export default PerformanceCard;
