
import React from 'react';
import { PayrollRecord, Employee } from '../../types';
import { XIcon, DownloadIcon } from '../icons/Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord;
  employee: Employee;
}

const SalarySlipModal: React.FC<Props> = ({ isOpen, onClose, record, employee }) => {
    if (!isOpen) return null;

    const formatCurrency = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const handlePrint = () => {
        const printContent = document.getElementById('salary-slip-content');
        if (printContent) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // to restore event listeners
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Salary Slip</h2>
                        <p className="text-sm text-text-secondary">{employee.name} - {record.month}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <XIcon className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>
                
                <div id="salary-slip-content" className="flex-grow overflow-y-auto p-8 space-y-6">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-primary">CorporateSaathi</h1>
                        <p className="text-text-secondary">Payslip for {record.month}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-y py-4">
                        <div>
                            <p className="font-semibold">{employee.name}</p>
                            <p className="text-sm text-text-secondary">{employee.position}</p>
                            <p className="text-sm text-text-secondary">{employee.department} Department</p>
                        </div>
                        <div className="text-right">
                             <p className="text-sm text-text-secondary">Employee ID: <span className="font-medium text-text-primary">EMP00{employee.id}</span></p>
                             <p className="text-sm text-text-secondary">Pay Date: <span className="font-medium text-text-primary">{new Date().toLocaleDateString()}</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-semibold text-green-600 border-b pb-2 mb-2">Earnings</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between"><p>Basic Salary</p> <p>{formatCurrency(record.basicSalary)}</p></div>
                                <div className="flex justify-between"><p>Allowances</p> <p>{formatCurrency(record.allowances)}</p></div>
                            </div>
                             <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                <p>Total Earnings</p> <p>{formatCurrency(record.basicSalary + record.allowances)}</p>
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-red-600 border-b pb-2 mb-2">Deductions</h4>
                             <div className="space-y-1">
                                <div className="flex justify-between"><p>Tax</p> <p>{formatCurrency(record.deductions * 0.8)}</p></div>
                                <div className="flex justify-between"><p>Provident Fund</p> <p>{formatCurrency(record.deductions * 0.2)}</p></div>
                            </div>
                             <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                <p>Total Deductions</p> <p>{formatCurrency(record.deductions)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary p-4 rounded-lg text-center mt-4">
                        <p className="text-lg font-bold text-primary">Net Salary</p>
                        <p className="text-3xl font-extrabold text-primary">{formatCurrency(record.netSalary)}</p>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                    <button type="button" onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition">
                        <DownloadIcon /> Download/Print
                    </button>
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">Close</button>
                </div>
            </div>
        </div>
    );
};

export default SalarySlipModal;
