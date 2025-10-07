

import React, { useState } from 'react';
import { Email } from '../../types';
import { mockEmails } from './data';
// FIX: Imported missing EditIcon.
import { EditIcon } from '../icons/Icons';
import ComposeModal from './ComposeModal';
import { format, formatDistanceToNow } from 'date-fns';

const EmailView: React.FC = () => {
    const [emails, setEmails] = useState<Email[]>(mockEmails);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0] || null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent'>('inbox');

    // FIX: Updated handleSendEmail signature to match the data structure provided by ComposeModal.
    const handleSendEmail = (emailData: { to: string; subject: string; body: string }) => {
        const newEmail: Email = {
            id: `email-${Date.now()}`,
            from: { name: 'Admin User', email: 'admin@corporatesaathi.com', avatar: 'https://picsum.photos/100/100' },
            to: { name: emailData.to, email: emailData.to },
            subject: emailData.subject,
            body: emailData.body,
            timestamp: new Date().toISOString(),
            read: true,
        };
        setEmails(prev => [newEmail, ...prev]);
        setIsComposeOpen(false);
        setActiveFolder('sent');
        setSelectedEmail(newEmail);
        alert('Email sent successfully!');
    };

    const currentEmails = emails.filter(e => {
        if (activeFolder === 'inbox') return e.to.email === 'admin@corporatesaathi.com';
        if (activeFolder === 'sent') return e.from.email === 'admin@corporatesaathi.com';
        return [];
    }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b">
                <h2 className="text-xl font-bold text-text-primary">Internal Mail</h2>
            </div>

            <div className="flex flex-grow min-h-0">
                {/* Sidebar */}
                <div className="w-64 flex-shrink-0 bg-gray-50 border-r p-4">
                    <button 
                        onClick={() => setIsComposeOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                        <EditIcon className="w-4 h-4" />
                        <span>Compose</span>
                    </button>
                    <nav className="mt-6 space-y-2">
                         <a href="#" onClick={() => setActiveFolder('inbox')} className={`flex items-center justify-between p-2 rounded-md text-sm font-medium ${activeFolder === 'inbox' ? 'bg-secondary text-primary' : 'text-text-secondary hover:bg-gray-100'}`}>
                            <span>Inbox</span>
                            <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5">{emails.filter(e => e.to.email === 'admin@corporatesaathi.com' && !e.read).length}</span>
                        </a>
                        <a href="#" onClick={() => setActiveFolder('sent')} className={`flex items-center p-2 rounded-md text-sm font-medium ${activeFolder === 'sent' ? 'bg-secondary text-primary' : 'text-text-secondary hover:bg-gray-100'}`}>
                            Sent
                        </a>
                    </nav>
                </div>

                {/* Email List */}
                <div className="w-1/3 flex-shrink-0 border-r overflow-y-auto">
                    {currentEmails.map(email => (
                         <div key={email.id} onClick={() => setSelectedEmail(email)} className={`p-4 border-b cursor-pointer ${selectedEmail?.id === email.id ? 'bg-blue-100' : 'hover:bg-gray-50'} ${!email.read && activeFolder==='inbox' ? 'border-l-4 border-primary bg-blue-50' : ''}`}>
                             <div className="flex justify-between items-start">
                                 <p className="font-semibold text-sm text-text-primary truncate">{activeFolder === 'inbox' ? email.from.name : `To: ${email.to.name}`}</p>
                                 <p className="text-xs text-text-secondary flex-shrink-0 ml-2">{formatDistanceToNow(new Date(email.timestamp), { addSuffix: true })}</p>
                             </div>
                            <p className="text-sm text-text-primary font-medium truncate mt-1">{email.subject}</p>
                            <p className="text-xs text-text-secondary truncate mt-1">{email.body}</p>
                        </div>
                    ))}
                </div>

                {/* Email Content */}
                <div className="flex-grow p-6 overflow-y-auto">
                    {selectedEmail ? (
                        <div>
                            <h3 className="text-xl font-bold text-text-primary">{selectedEmail.subject}</h3>
                            <div className="flex items-center gap-3 mt-4 pb-4 border-b">
                                <img src={selectedEmail.from.avatar} alt={selectedEmail.from.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-text-primary">{selectedEmail.from.name}</p>
                                    <p className="text-sm text-text-secondary">To: {selectedEmail.to.name}</p>
                                </div>
                                <p className="ml-auto text-sm text-text-secondary">{format(new Date(selectedEmail.timestamp), 'MMM d, yyyy, h:mm a')}</p>
                            </div>
                            <div className="mt-6 prose prose-sm max-w-none text-text-secondary">
                                <p>{selectedEmail.body}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-text-secondary">
                            <p>Select an email to read</p>
                        </div>
                    )}
                </div>
            </div>
            {isComposeOpen && <ComposeModal onClose={() => setIsComposeOpen(false)} onSend={handleSendEmail} />}
        </div>
    );
};

export default EmailView;