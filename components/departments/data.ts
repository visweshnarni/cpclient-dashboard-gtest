
import { DepartmentInfo } from '../../types';

export const mockDepartments: DepartmentInfo[] = [
  {
    id: 'dept-it',
    name: 'IT',
    managerId: 1, // Jayesh Patel
    description: 'Handles all technology, software development, and infrastructure needs of the company.',
  },
  {
    id: 'dept-finance',
    name: 'Finance',
    managerId: 3, // John Doe
    description: 'Manages financial planning, accounting, and economic strategy for the organization.',
  },
  {
    id: 'dept-hr',
    name: 'HR',
    managerId: 4, // Anna Rodriguez
    description: 'Responsible for recruitment, employee relations, and talent management.',
  },
  {
    id: 'dept-mktg',
    name: 'Marketing',
    managerId: null, // Unassigned
    description: 'Develops and executes marketing strategies to drive growth and brand awareness.',
  },
];
