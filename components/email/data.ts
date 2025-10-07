
import { Email } from '../../types';

const now = new Date();

export const mockEmails: Email[] = [
  {
    id: 'email-1',
    from: { name: 'Priya Singh', email: 'priya.singh@corporatesaathi.com', avatar: 'https://picsum.photos/seed/7/40/40' },
    to: { name: 'Admin User', email: 'admin@corporatesaathi.com' },
    subject: 'Update on Cloud Migration Project',
    body: 'Hi Admin, Just wanted to give you a quick update. The cloud migration is proceeding as planned. We are currently at 60% completion and expect to finish ahead of schedule. Let me know if you have any questions. Best, Priya.',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    tag: 'work',
  },
  {
    id: 'email-2',
    from: { name: 'Anna Rodriguez', email: 'anna.rodriguez@corporatesaathi.com', avatar: 'https://picsum.photos/seed/4/40/40' },
    to: { name: 'Admin User', email: 'admin@corporatesaathi.com' },
    subject: 'Q3 Performance Review Schedule',
    body: 'Hello, I have finalized the schedule for the Q3 performance reviews. Please review the attached document and let me know if there are any conflicts. Thanks, Anna.',
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    tag: 'important',
  },
  {
    id: 'email-3',
    from: { name: 'John Doe', email: 'john.doe@corporatesaathi.com', avatar: 'https://picsum.photos/seed/3/40/40' },
    to: { name: 'Admin User', email: 'admin@corporatesaathi.com' },
    subject: 'Re: Q3 Financial Audit Docs',
    body: 'Hi, Attached are the final documents needed for the Q3 financial audit. Please let me know if you require anything else from the finance department. Regards, John.',
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'email-4',
    from: { name: 'Admin User', email: 'admin@corporatesaathi.com', avatar: 'https://picsum.photos/100/100' },
    to: { name: 'All Departments', email: 'all@corporatesaathi.com' },
    subject: 'Company Offsite Event Reminder',
    body: 'This is a friendly reminder about the upcoming company offsite event next Friday. Please make sure to RSVP by the end of today so we can finalize the arrangements. Looking forward to seeing you all there!',
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];
