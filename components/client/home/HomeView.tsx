import React from 'react';
import { ViewType } from '../../../App';
import { mockEnrolledServices, mockRecentActivity } from './data';
import { ServiceIcon, ClockIcon, DocumentIcon, ArrowRightIcon, ChatIcon } from '../../icons/Icons';
import { EnrolledService, RecentActivity } from '../../../types';

const KPICard: React.FC<{ title: string; value: string; icon: React.ReactElement }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-text-secondary dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold text-text-primary dark:text-gray-200 mt-1">{value}</p>
    </div>
    <div className="p-3 rounded-full bg-secondary text-primary">
      {icon}
    </div>
  </div>
);

const ServiceStatusCard: React.FC<{ service: EnrolledService }> = ({ service }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-text-primary dark:text-gray-200">{service.name}</p>
                <p className="text-xs text-text-secondary dark:text-gray-400">{service.category}</p>
            </div>
             <span className={`text-xs font-medium px-2 py-1 rounded-full ${service.status === 'Pending Action' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{service.status}</span>
        </div>
        <div className="mt-4">
            <div className="flex justify-between text-xs font-medium text-text-secondary dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{service.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${service.progress}%` }}></div>
            </div>
        </div>
    </div>
);

const ActivityFeedItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
    const icons = {
        document: <DocumentIcon className="w-4 h-4 text-green-500" />,
        service: <ServiceIcon className="w-4 h-4 text-blue-500" />,
        consultation: <ChatIcon className="w-4 h-4 text-indigo-500" />,
    }
    return (
        <div className="flex gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="mt-1 w-8 h-8 flex-shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {icons[activity.type]}
            </div>
            <div>
                <p className="text-sm text-text-primary dark:text-gray-300">{activity.description}</p>
                <p className="text-xs text-text-secondary dark:text-gray-400">{new Date(activity.timestamp).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

interface HomeViewProps {
  setCurrentView: (view: ViewType) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setCurrentView }) => {
  const activeServices = mockEnrolledServices.filter(s => s.status === 'Active' || s.status === 'Pending Action');
  const pendingActions = mockEnrolledServices.filter(s => s.status === 'Pending Action').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Welcome Back, Rishabh!</h2>
        <p className="text-text-secondary dark:text-gray-400 mt-1">Here's a summary of your services and activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Active Services" value={String(activeServices.length)} icon={<ServiceIcon />} />
        <KPICard title="Pending Actions" value={String(pendingActions)} icon={<ClockIcon />} />
        <KPICard title="Documents" value="12" icon={<DocumentIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-text-primary dark:text-gray-200">Your Active Services</h3>
                 <a href="#" onClick={() => setCurrentView('enrolledServices')} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">View All <ArrowRightIcon className="w-4 h-4" /></a>
            </div>
            <div className="space-y-4">
                {activeServices.slice(0, 3).map(service => <ServiceStatusCard key={service.id} service={service} />)}
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-text-primary dark:text-gray-200 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {mockRecentActivity.slice(0, 4).map(activity => <ActivityFeedItem key={activity.id} activity={activity} />)}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
