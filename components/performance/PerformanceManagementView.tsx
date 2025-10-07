import React, { useState, useMemo } from 'react';
import { PerformanceReview, Employee, PerformanceStatus, Department } from '../../types';
import { mockPerformanceReviews } from './data';
import { mockEmployees } from '../projects/data';
import { mockProjects } from '../projects/data';
import { mockServices } from '../services/data';
import KPICard from '../dashboard/KPICard';
// FIX: Imported PlusIcon to resolve 'Cannot find name' error.
import { PerformanceIcon, StarIcon, TrendingUpIcon, UsersIcon, PlusIcon } from '../icons/Icons';
import PerformanceCard from './PerformanceCard';
import PerformanceDetailModal from './PerformanceDetailModal';
import StartReviewCycleModal from './StartReviewCycleModal';

interface Props {
    searchQuery: string;
}

const PerformanceManagementView: React.FC<Props> = ({ searchQuery }) => {
    const [reviews, setReviews] = useState<PerformanceReview[]>(mockPerformanceReviews);
    const [employees] = useState<Employee[]>(mockEmployees);
    const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
    const [isReviewCycleModalOpen, setIsReviewCycleModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        department: 'all',
        status: 'all',
    });

    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

    const performanceData = useMemo(() => {
        return reviews.map(review => {
            const employee = employeeMap.get(review.employeeId);
            const projectsCompleted = mockProjects.filter(p => p.assignedEmployees.includes(employee.id) && p.status === 'Completed').length;
            const servicesDelivered = mockServices.filter(s => s.assignedEmployeeIds.includes(employee.id) && s.status === 'Completed').length;
            return { review, employee, projectsCompleted, servicesDelivered };
        });
    }, [reviews, employeeMap]);

    const filteredData = useMemo(() => {
        return performanceData.filter(data => {
            if (!data.employee) return false;
            const searchMatch = searchQuery ? data.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
            const departmentMatch = filters.department === 'all' || data.employee.department === filters.department;
            const statusMatch = filters.status === 'all' || data.review.status === filters.status;
            return searchMatch && departmentMatch && statusMatch;
        });
    }, [performanceData, filters, searchQuery]);

    const stats = useMemo(() => {
        const completedReviews = performanceData.filter(d => d.review.status !== 'Pending Review');
        const totalRatings = completedReviews.reduce((acc, data) => acc + data.review.overallRating, 0);
        const avgRating = totalRatings / completedReviews.length || 0;
        const topPerformer = completedReviews.sort((a, b) => b.review.overallRating - a.review.overallRating)[0];
        const needsImprovement = completedReviews.filter(d => d.review.status === 'Needs Improvement').length;
        return { avgRating, topPerformer, needsImprovement };
    }, [performanceData]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleStartNewCycle = (cycleData: { reviewPeriod: string; startDate: string; endDate: string }) => {
        const { reviewPeriod } = cycleData;
        
        const cycleExists = reviews.some(r => r.reviewPeriod === reviewPeriod);
        if (cycleExists) {
            alert(`A review cycle named "${reviewPeriod}" already exists.`);
            return;
        }

        const newReviews: PerformanceReview[] = employees.map(employee => {
            const lastReview = reviews
                .filter(r => r.employeeId === employee.id)
                .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())[0];
            
            return {
                id: `perf-${employee.id}-${reviewPeriod.replace(/\s/g, '-')}`,
                employeeId: employee.id,
                reviewPeriod: reviewPeriod,
                reviewDate: cycleData.endDate,
                overallRating: 0,
                status: 'Pending Review',
                kpis: [],
                managerComments: '',
                employeeComments: '',
                historicalData: lastReview ? lastReview.historicalData : [],
            };
        });
        
        setReviews(prevReviews => [...prevReviews, ...newReviews]);
        setIsReviewCycleModalOpen(false);
        alert(`New review cycle '${reviewPeriod}' started for ${employees.length} employees.`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Performance Management</h2>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">Review, rate, and track employee performance.</p>
                </div>
                <button 
                    onClick={() => setIsReviewCycleModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon />
                    <span>Start New Review Cycle</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Avg. Company Rating" value={stats.avgRating.toFixed(2)} icon={<StarIcon />} color="yellow" />
                <KPICard title="Top Performer" value={stats.topPerformer?.employee?.name || 'N/A'} icon={<TrendingUpIcon />} color="green" />
                <KPICard title="Needs Improvement" value={String(stats.needsImprovement)} icon={<UsersIcon />} color="red" />
                <KPICard title="Review Completion" value={`${reviews.filter(r => r.status !== 'Pending Review').length}/${employees.length}`} icon={<PerformanceIcon />} color="blue" />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-text-secondary dark:text-gray-400 block mb-1">Department</label>
                        <select name="department" id="department" value={filters.department} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="all">All Departments</option>
                            {(['IT', 'Finance', 'HR', 'Marketing'] as Department[]).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-text-secondary dark:text-gray-400 block mb-1">Status</label>
                        <select name="status" id="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="all">All Statuses</option>
                            {(['Excellent', 'Good', 'Average', 'Needs Improvement', 'Pending Review'] as PerformanceStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.length > 0 ? (
                    filteredData.map(({ review, employee, projectsCompleted, servicesDelivered }) => (
                        <PerformanceCard 
                            key={review.id}
                            review={review}
                            employee={employee}
                            projectsCompleted={projectsCompleted}
                            servicesDelivered={servicesDelivered}
                            onViewDetails={() => setSelectedReview(review)}
                        />
                    ))
                ) : (
                    <div className="md:col-span-2 xl:col-span-3 text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold text-text-primary dark:text-gray-200">No Employees Found</h3>
                        <p className="text-text-secondary dark:text-gray-400 mt-2">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
            
            {selectedReview && (
                <PerformanceDetailModal
                    isOpen={!!selectedReview}
                    onClose={() => setSelectedReview(null)}
                    review={selectedReview}
                    employee={employeeMap.get(selectedReview.employeeId)}
                />
            )}

            <StartReviewCycleModal
                isOpen={isReviewCycleModalOpen}
                onClose={() => setIsReviewCycleModalOpen(false)}
                onStartCycle={handleStartNewCycle}
            />
        </div>
    );
};

export default PerformanceManagementView;
