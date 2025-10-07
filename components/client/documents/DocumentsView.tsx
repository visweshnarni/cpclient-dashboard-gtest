import React, { useState, useMemo, useRef } from 'react';
import { ClientDocument } from '../../../types';
import { mockDocuments } from './data';
import { DocumentIcon, UploadIcon, DownloadIcon } from '../../icons/Icons';
import { mockEnrolledServices } from '../services/data';

interface Props {
  searchQuery: string;
}

const DocumentsView: React.FC<Props> = ({ searchQuery }) => {
    const [documents, setDocuments] = useState<ClientDocument[]>(mockDocuments);
    const [serviceFilter, setServiceFilter] = useState<string>('All');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const serviceMatch = serviceFilter === 'All' || doc.serviceId === serviceFilter;
            const searchMatch = searchQuery ? doc.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
            return serviceMatch && searchMatch;
        });
    }, [documents, serviceFilter, searchQuery]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`Uploading "${file.name}"...`);
            // Here you would handle the actual upload
            const newDoc: ClientDocument = {
                id: `doc-${Date.now()}`,
                name: file.name,
                serviceId: 'gst-001', // Example service
                serviceName: 'Quarterly GST Filing',
                type: 'Uploaded by You',
                uploadDate: new Date().toISOString().split('T')[0],
                size: `${(file.size / 1024).toFixed(1)} KB`,
                url: '#',
            };
            setDocuments(prev => [newDoc, ...prev]);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-text-primary dark:text-gray-200">Documents</h2>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">Manage all your shared and uploaded documents.</p>
                </div>
                 <button onClick={handleUploadClick} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    <UploadIcon />
                    <span>Upload Document</span>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-text-secondary dark:text-gray-400">Filter by Service:</label>
                    <select
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        className="p-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="All">All Services</option>
                        {mockEnrolledServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Document Name</th>
                                <th scope="col" className="px-6 py-3">Related Service</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Size</th>
                                <th scope="col" className="px-6 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocuments.map((doc) => (
                                <tr key={doc.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <DocumentIcon className="w-5 h-5 text-primary" />
                                        <span>{doc.name}</span>
                                    </td>
                                    <td className="px-6 py-4">{doc.serviceName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${doc.type === 'Uploaded by You' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{doc.type}</span>
                                    </td>
                                    <td className="px-6 py-4">{doc.uploadDate}</td>
                                    <td className="px-6 py-4">{doc.size}</td>
                                    <td className="px-6 py-4 text-center">
                                        <a href={doc.url} download className="font-medium text-primary hover:underline flex items-center justify-center gap-1 mx-auto">
                                            <DownloadIcon className="w-4 h-4" /> Download
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredDocuments.length === 0 && (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-text-primary dark:text-gray-200">No Documents Found</h3>
                            <p className="text-text-secondary dark:text-gray-400 mt-1">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentsView;
