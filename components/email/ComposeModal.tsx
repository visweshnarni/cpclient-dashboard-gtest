
import React, { useState } from 'react';
import { XIcon } from '../icons/Icons';

interface Props {
  onClose: () => void;
  onSend: (data: { to: string; subject: string; body: string }) => void;
}

const ComposeModal: React.FC<Props> = ({ onClose, onSend }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !body) {
      alert('Please fill all fields.');
      return;
    }
    onSend({ to, subject, body });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-text-primary">New Message</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <XIcon className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input type="email" id="to" value={to} onChange={e => setTo(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="recipient@corporatesaathi.com" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Email subject" />
            </div>
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <textarea id="body" rows={8} value={body} onChange={e => setBody(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Write your message..."></textarea>
            </div>
          </div>
          <div className="flex justify-end items-center gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeModal;
