
import React from 'react';
import ReportCard from './ReportCard';
import { AttendanceIcon, ProjectIcon, ServiceIcon, PayrollIcon } from '../icons/Icons';

const ReportsView: React.FC = () => {
  const handleDownload = (reportType: string) => {
    alert(`Generating and downloading ${reportType} report... (CSV)`);
    // In a real app, this would trigger a data fetch and CSV/PDF generation.
  };

  return (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary">Reports Center</h2>
            <p className="text-text-secondary mt-1">Generate and export data for management and analysis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard 
                icon={<AttendanceIcon />}
                title="Attendance Report"
                description="Export a detailed monthly or daily attendance summary for all employees."
                onDownload={() => handleDownload('Attendance')}
                color="blue"
            />
            <ReportCard 
                icon={<ProjectIcon />}
                title="Project Status Report"
                description="Generate a comprehensive report on the status, progress, and deadlines of all projects."
                onDownload={() => handleDownload('Project Status')}
                color="green"
            />
            <ReportCard 
                icon={<ServiceIcon />}
                title="Service Delivery Report"
                description="Get an overview of all service requests, including status, priority, and completion rates."
                onDownload={() => handleDownload('Service Delivery')}
                color="yellow"
            />
             <ReportCard 
                icon={<PayrollIcon />}
                title="Payroll Summary"
                description="Export monthly payroll data, including salary details, deductions, and net pay for all employees."
                onDownload={() => handleDownload('Payroll Summary')}
                color="indigo"
            />
             <ReportCard 
                icon={<ProjectIcon />}
                title="Employee Performance"
                description="A report detailing performance review scores and statuses for a selected review cycle."
                onDownload={() => handleDownload('Employee Performance')}
                color="red"
            />
        </div>
    </div>
  );
};

export default ReportsView;
