import { CalendarEvent } from '../../../types';

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

export const mockCalendarEvents: CalendarEvent[] = [
    { id: '1', title: 'GST Filing Deadline', date: new Date(year, month, 20).toISOString().split('T')[0], type: 'deadline' },
    { id: '2', title: 'Consultation with Priya', date: new Date(year, month, 15).toISOString().split('T')[0], type: 'consultation' },
    { id: '3', title: 'Submit ITR Documents', date: new Date(year, month, 10).toISOString().split('T')[0], type: 'reminder' },
    { id: '4', title: 'TDS Payment Due', date: new Date(year, month, 7).toISOString().split('T')[0], type: 'deadline' },
    { id: '5', title: 'Follow-up Call', date: new Date(year, month + 1, 5).toISOString().split('T')[0], type: 'consultation' },
];
