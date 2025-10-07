
import React, { useState, useMemo } from 'react';
import { PayrollRecord, Employee, ManualPayment } from '../../types';
import { mockPayroll, mockManualPayments } from './data';
import { mockEmployees } from '../projects/data';
import PayrollTable from './PayrollTable';
import SalarySlipModal from './SalarySlipModal';
import KPICard from '../dashboard/KPICard';
// FIX: Added missing PayrollIcon import.
import { PayrollIcon, ReportIcon, PlusIcon } from '../icons/Icons';
import ManualPaymentsTable from './ManualPaymentsTable';
import AddManualPaymentModal from './AddManualPaymentModal';

interface Props {
  searchQuery: string;
}

const PayrollView: React.FC<Props> = ({ searchQuery }) => {
    const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayroll);
    const [manualPayments, setManualPayments] = useState<ManualPayment[]>(mockManualPayments);
    const [employees] = useState<Employee[]>(mockEmployees);
    const [selectedSlip, setSelectedSlip] = useState<{ record: PayrollRecord, employee: Employee } | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
    
    const [activeTab, setActiveTab] = useState<'payroll' | 'manual'>('payroll');
    const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] = useState(false);
    const [paymentToEdit, setPaymentToEdit] = useState<ManualPayment | null>(null);

    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

    const filteredRecords = useMemo(() => {
        return payrollRecords
            .filter(r => r.month === currentMonth)
            .filter(r => {
                if (!searchQuery) return true;
                const employee = employeeMap.get(r.employeeId);
                return employee ? employee.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
            });
    }, [payrollRecords, currentMonth, searchQuery, employeeMap]);

    const filteredManualPayments = useMemo(() => {
        const [monthName, year] = currentMonth.split(' ');
        const monthIndex = new Date(Date.parse(monthName +" 1, 2012")).getMonth();
        
        return manualPayments
            .filter(p => {
                const paymentDate = new Date(p.date);
                return paymentDate.getFullYear() === parseInt(year) && paymentDate.getMonth() === monthIndex;
            })
            .filter(p => {
                if (!searchQuery) return true;
                const employee = employeeMap.get(p.employeeId);
                return employee ? employee.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
            });
    }, [manualPayments, currentMonth, searchQuery, employeeMap]);
    
    const payrollStats = useMemo(() => {
        const monthRecords = payrollRecords.filter(r => r.month === currentMonth);
        const totalPaid = monthRecords.reduce((acc, r) => acc + r.netSalary, 0);
        
        const manualTotal = filteredManualPayments.reduce((acc, p) => acc + p.amount, 0);

        return {
            totalPaid,
            employeesPaid: monthRecords.length,
            manualTotal
        };
    }, [payrollRecords, filteredManualPayments, currentMonth]);
    
    const handleViewSlip = (recordId: string) => {
        const record = payrollRecords.find(r => r.id === recordId);
        if (record) {
            const employee = employeeMap.get(record.employeeId);
            if (employee) {
                setSelectedSlip({ record, employee });
            }
        }
    };

    const generatePayrollForMonth = (employee: Employee, month: string): PayrollRecord => {
        const basicSalary = 50000 + (employee.id * 1000);
        const allowances = basicSalary * 0.2;
        const deductions = basicSalary * 0.1;
        const netSalary = basicSalary + allowances - deductions;

        return {
            id: `payroll-${employee.id}-${month.replace(' ', '-')}`,
            employeeId: employee.id,
            month,
            basicSalary,
            allowances,
            deductions,
            netSalary,
            status: 'Paid',
        };
    };

    const handleGeneratePayroll = () => {
        const recordsExist = payrollRecords.some(