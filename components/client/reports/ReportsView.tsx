import React from 'react';
import ReportCard from './ReportCard';
import { ServiceIcon, DocumentIcon, CalendarIcon, ReportIcon } from '../../icons/Icons';

const ReportsView: React.FC = () => {
  const handleDownload = (reportType: string) => {
    alert(`Generating and downloading your ${reportType} report...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Reports Center</h2>
            <p className="text-text-secondary dark:text-gray-400 mt-1">Generate and download reports for your records.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard 
                icon={<ServiceIcon />}
                title="Service History Report"
                description="Export a detailed summary of all your past and present services, including timelines and statuses."
                onDownload={() => handleDownload('Service History')}
                color="blue"
            />
            <ReportCard 
                icon={<DocumentIcon />}
                title="Document Archive"
                description="Download a ZIP archive of all documents you've uploaded and received from us."
                onDownload={() => handleDownload('Document Archive')}
                color="green"
            />
            <ReportCard 
                icon={<CalendarIcon />}
                title="Annual Compliance Calendar"
                description="Get a personalized calendar with all your important compliance deadlines for the year."
                onDownload={() => handleDownload('Compliance Calendar')}
                color="yellow"
            />
             <ReportCard 
                icon={<ReportIcon />}
                title="Annual Financial Summary"
                description="A summary report of all financial services undertaken, useful for accounting purposes."
                onDownload={() => handleDownload('Financial Summary')}
                color="indigo"
            />
        </div>
    </div>
  );
};

export default ReportsView;
