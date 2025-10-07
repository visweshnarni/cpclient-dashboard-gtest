

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
        const recordsExist = payrollRecords.some(r => r.month === currentMonth);
        // FIX: Completed the component by adding the missing logic and return statement, which was causing the error.
        if (recordsExist) {
            alert(`Payroll for ${currentMonth} has already been generated.`);
            return;
        }

        if (window.confirm(`Are you sure you want to generate payroll for all employees for ${currentMonth}? This action cannot be undone.`)) {
            const newRecords = employees.map(emp => generatePayrollForMonth(emp, currentMonth));
            setPayrollRecords(prev => [...prev, ...newRecords]);
            alert('Payroll generated successfully!');
        }
    };
    
    const handleSaveManualPayment = (paymentData: ManualPayment) => {
        if (paymentData.id && manualPayments.some(p => p.id === paymentData.id)) {
            setManualPayments(manualPayments.map(p => p.id === paymentData.id ? paymentData : p));
        } else {
            const newPayment = { ...paymentData, id: `manual-${Date.now()}` };
            setManualPayments([newPayment, ...manualPayments]);
        }
        setIsManualPaymentModalOpen(false);
        setPaymentToEdit(null);
    };
    
    const handleDeleteManualPayment = (paymentId: string) => {
        if (window.confirm('Are you sure you want to delete this payment record?')) {
            setManualPayments(manualPayments.filter(p => p.id !== paymentId));
        }
    };
    
    const TabButton: React.FC<{ tabName: 'payroll' | 'manual'; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none ${
                activeTab === tabName ? 'bg-primary text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Payroll</h2>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">Manage employee salaries, payments, and slips.</p>
                </div>
                <button 
                    onClick={handleGeneratePayroll}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg shadow-md hover:bg-emerald-600 transition-colors"
                >
                    <PayrollIcon />
                    <span>Generate Payroll for {currentMonth}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard title="Total Paid this Month" value={`$${payrollStats.totalPaid.toLocaleString()}`} icon={<PayrollIcon />} color="green" />
                <KPICard title="Employees Paid" value={`${payrollStats.employeesPaid} / ${employees.length}`} icon={<ReportIcon />} color="blue" />
                <KPICard title="Manual Payments" value={`$${payrollStats.manualTotal.toLocaleString()}`} icon={<PlusIcon />} color="yellow" />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border dark:border-gray-600 space-x-1">
                        <TabButton tabName="payroll" label="Monthly Payroll" />
                        <TabButton tabName="manual" label="Manual Payments" />
                    </div>
                    <div className="flex items-center gap-2">
                         <label htmlFor="month-picker" className="text-sm font-medium text-text-secondary dark:text-gray-400">Month:</label>
                         <input 
                            type="month" 
                            id="month-picker"
                            value={new Date(Date.parse(currentMonth +" 1, 2012")).toISOString().slice(0, 7)}
                            onChange={e => {
                                if (!e.target.value) return;
                                const date = new Date(`${e.target.value}-02`);
                                setCurrentMonth(date.toLocaleString('default', { month: 'long', year: 'numeric' }))
                            }}
                            className="p-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary"
                        />
                        {activeTab === 'manual' && (
                             <button 
                                onClick={() => { setPaymentToEdit(null); setIsManualPaymentModalOpen(true); }}
                                className="flex items-center justify-center gap-1 px-3 py-2 bg-primary text-white text-sm rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>Add</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="animate-fade-in">
                {activeTab === 'payroll' ? (
                    <PayrollTable 
                        records={filteredRecords}
                        employees={employees}
                        onViewSlip={handleViewSlip}
                    />
                ) : (
                    <ManualPaymentsTable
                        payments={filteredManualPayments}
                        employees={employees}
                        onEdit={(p) => { setPaymentToEdit(p); setIsManualPaymentModalOpen(true); }}
                        onDelete={handleDeleteManualPayment}
                    />
                )}
            </div>

            {selectedSlip && (
                <SalarySlipModal
                    isOpen={!!selectedSlip}
                    onClose={() => setSelectedSlip(null)}
                    record={selectedSlip.record}
                    employee={selectedSlip.employee}
                />
            )}

            {isManualPaymentModalOpen && (
                <AddManualPaymentModal
                    isOpen={isManualPaymentModalOpen}
                    onClose={() => setIsManualPaymentModalOpen(false)}
                    onSave={handleSaveManualPayment}
                    paymentToEdit={paymentToEdit}
                    employees={employees}
                />
            )}
        </div>
    );
};

export default PayrollView;
