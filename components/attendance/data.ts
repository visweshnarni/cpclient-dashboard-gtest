
import { AttendanceRecord } from '../../types';
import { mockEmployees } from '../projects/data';

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const generateRandomTime = (startHour: number, endHour: number): string => {
  const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
  const minute = Math.floor(Math.random() * 60);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const mockAttendance: AttendanceRecord[] = mockEmployees.flatMap((employee) => {
    const records: AttendanceRecord[] = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayOfWeek = date.getDay();
        
        let status: AttendanceRecord['status'] = 'Present';
        let checkIn: string | null = null;
        let checkOut: string | null = null;

        if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
            status = 'Holiday';
        } else {
            const random = Math.random();
            if (employee.id === 3 && i === 1) { // Example: John Doe was on leave yesterday
                 status = 'On Leave';
            } else if (random < 0.85) { // 85% present
                status = 'Present';
                checkIn = generateRandomTime(9, 10);
                checkOut = generateRandomTime(17, 18);
            } else if (random < 0.9) { // 5% half-day
                status = 'Half-day';
                checkIn = generateRandomTime(9, 10);
                checkOut = generateRandomTime(13, 14);
            } else if (random < 0.95) { // 5% on leave
                status = 'On Leave';
            } else { // 5% absent
                status = 'Absent';
            }
        }
        
        // Make today's data more consistent for demo
        if (i === 0) {
            const rand = Math.random();
            if (rand < 0.8) {
                status = 'Present';
                checkIn = generateRandomTime(9, 10);
                // For some, checkout might not be available yet
                if (Math.random() > 0.3) {
                    checkOut = null; // Still checked in
                } else {
                    checkOut = generateRandomTime(17, 18);
                }
            } else if (rand < 0.9) {
                 status = 'On Leave';
            } else {
                 status = 'Absent';
            }
        }
        
        records.push({
            id: `att-${employee.id}-${formatDate(date)}`,
            employeeId: employee.id,
            date: formatDate(date),
            checkIn,
            checkOut,
            status
        });
    }
    return records;
});
