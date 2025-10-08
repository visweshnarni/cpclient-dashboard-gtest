
import { Project, Service, Department } from '../../types';

export const calculateDepartmentScores = (projects: Project[], services: Service[]) => {
    const departmentData: Record<Department, { projectsCompleted: number, servicesDelivered: number }> = {
        'IT': { projectsCompleted: 0, servicesDelivered: 0 },
        'Finance': { projectsCompleted: 0, servicesDelivered: 0 },
        'HR': { projectsCompleted: 0, servicesDelivered: 0 },
        'Marketing': { projectsCompleted: 0, servicesDelivered: 0 },
    };

    projects.forEach(p => {
        if (p.status === 'Completed' && departmentData[p.department]) {
            departmentData[p.department].projectsCompleted += 1;
        }
    });

    services.forEach(s => {
        // A simple logic to assign services to a department if not explicitly defined
        const serviceDeptMap: Record<Service['category'], Department> = {
            'Tax': 'Finance',
            'GST': 'Finance',
            'Startup': 'Finance',
            'Legal': 'HR',
            'Audit': 'Finance'
        };
        const dept = serviceDeptMap[s.category];
        if (s.status === 'Completed' && departmentData[dept]) {
            departmentData[dept].servicesDelivered += 1;
        }
    });

    const scoredDepartments = (Object.keys(departmentData) as Department[]).map(name => {
        const data = departmentData[name];
        const totalTasks = data.projectsCompleted + data.servicesDelivered;
        // Simple scoring: 2 points per project, 1 per service
        const score = (data.projectsCompleted * 2) + data.servicesDelivered;
        return {
            name,
            ...data,
            totalTasks,
            score
        };
    });

    return scoredDepartments.sort((a, b) => b.score - a.score);
};
