import React, { useState, useMemo } from 'react';
import { EnrolledService, ServiceStatus } from '../../../types';
import { mockEnrolledServices } from './data';
import ServiceCard from './ServiceCard';

interface Props {
  searchQuery: string;
}

const EnrolledServiceView: React.FC<Props> = ({ searchQuery }) => {
    const [services] = useState<EnrolledService[]>(mockEnrolledServices);
    const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'All'>('All');

    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const statusMatch = statusFilter === 'All' || service.status === statusFilter;
            const searchMatch = searchQuery ? service.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
            return statusMatch && searchMatch;
        });
    }, [services, statusFilter, searchQuery]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Your Services</h2>
                <p className="text-text-secondary dark:text-gray-400 mt-1">Track the progress and details of all your enrolled services.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-text-secondary dark:text-gray-400">Status:</label>
                    {(['All', 'Active', 'Pending Action', 'Completed', 'On Hold'] as const).map(status => (
                        <button 
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${statusFilter === status ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.length > 0 ? (
                    filteredServices.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))
                ) : (
                    <div className="md:col-span-2 xl:col-span-3 text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold text-text-primary dark:text-gray-200">No Services Found</h3>
                        <p className="text-text-secondary dark:text-gray-400 mt-2">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledServiceView;
