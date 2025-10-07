
import { PerformanceReview, PerformanceStatus } from '../../types';
import { mockEmployees } from '../projects/data';

const getStatusFromRating = (rating: number): PerformanceStatus => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Average';
    return 'Needs Improvement';
};

export const mockPerformanceReviews: PerformanceReview[] = mockEmployees.map(employee => {
    const overallRating = parseFloat((Math.random() * (5 - 2.8) + 2.8).toFixed(1)); // Random rating between 2.8 and 5.0
    const status = getStatusFromRating(overallRating);
    
    const historicalData = [
        { period: 'Q1 2024', rating: parseFloat((overallRating - Math.random() * 0.5).toFixed(1)) },
        { period: 'Q2 2024', rating: parseFloat((overallRating - Math.random() * 0.2).toFixed(1)) },
        { period: 'Q3 2024', rating: overallRating },
    ];

    return {
        id: `perf-${employee.id}`,
        employeeId: employee.id,
        reviewPeriod: 'Q3 2024',
        reviewDate: '2024-07-25',
        overallRating,
        status,
        kpis: [
            { name: 'Quality of Work', rating: parseFloat(Math.min(5, (overallRating + (Math.random() - 0.5))).toFixed(1)), comment: 'Consistently delivers high-quality work.' },
            { name: 'Communication', rating: parseFloat(Math.min(5, (overallRating + (Math.random() - 0.5))).toFixed(1)), comment: 'Clear and effective in team communications.' },
            { name: 'Punctuality & Time Management', rating: parseFloat(Math.min(5, (overallRating + (Math.random() - 0.5))).toFixed(1)), comment: 'Meets deadlines consistently.' },
            { name: 'Teamwork & Collaboration', rating: parseFloat(Math.min(5, (overallRating + (Math.random() - 0.5))).toFixed(1)), comment: 'A proactive and helpful team member.' },
        ],
        managerComments: 'A valuable member of the team. Continues to show growth in their role and takes on new challenges effectively. Keep up the great work!',
        employeeComments: 'Thank you for the feedback. I am committed to improving my skills and contributing to the team\'s success.',
        improvementPlan: status === 'Needs Improvement' ? 'Focus on improving time management for complex tasks. Weekly check-ins with manager scheduled.' : undefined,
        historicalData,
    };
});

// Example of an employee who needs improvement
const employeeToAdjust = mockPerformanceReviews.find(r => r.employeeId === 8);
if (employeeToAdjust) {
    employeeToAdjust.overallRating = 2.4;
    employeeToAdjust.status = getStatusFromRating(2.4);
    employeeToAdjust.kpis[2].rating = 2.0;
    employeeToAdjust.kpis[2].comment = "Struggles to meet deadlines on larger projects.";
    employeeToAdjust.improvementPlan = 'Focus on improving time management for complex tasks. Weekly check-ins with manager scheduled.';
    employeeToAdjust.historicalData = [
        { period: 'Q1 2024', rating: 3.1 },
        { period: 'Q2 2024', rating: 2.8 },
        { period: 'Q3 2024', rating: 2.4 },
    ];
}
