
import { AuditLog } from '../../types';

const now = new Date();

export const mockAuditLogs: AuditLog[] = [
    {
        id: 'log-1',
        timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
        user: 'Admin User',
        userAvatar: 'https://picsum.photos/100/100',
        action: 'PROJECT_CREATE',
        details: 'Created a new project: "Social Media Campaign Q4".',
    },
    {
        id: 'log-2',
        timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        user: 'Admin User',
        userAvatar: 'https://picsum.photos/100/100',
        action: 'USER_PERMISSION_CHANGE',
        details: 'Updated permissions for user "Sarah Smith" to "Project Lead".',
    },
    {
        id: 'log-3',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User',
        userAvatar: 'https://picsum.photos/100/100',
        action: 'SERVICE_STATUS_UPDATE',
        details: 'Changed status of service "GST Registration (Acme Corp)" to "Completed".',
    },
    {
        id: 'log-4',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User',
        userAvatar: 'https://picsum.photos/100/100',
        action: 'PAYROLL_GENERATED',
        details: 'Generated payroll for the month of July 2024.',
    },
    {
        id: 'log-5',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User',
        userAvatar: 'https://picsum.photos/100/100',
        action: 'REPORT_DOWNLOADED',
        details: 'Downloaded "Attendance Report" for June 2024.',
    },
     {
        id: 'log-6',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User',
        userAvatar: 'https://picsum.photos/100/100',
        action: 'PROJECT_DELETE',
        details: 'Deleted project: "Old Marketing Site Backup".',
    },
    ...Array.from({ length: 15 }, (_, i) => ({
        id: `log-${i + 7}`,
        timestamp: new Date(now.getTime() - (i + 3) * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Admin User',
        userAvatar: 'https://picsum.photos/100/100',
        action: 'SYSTEM_LOGIN',
        details: `User logged in from IP address 192.168.1.${i+10}.`,
    }))
].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
