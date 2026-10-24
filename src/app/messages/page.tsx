'use client';

import React, { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { useAppStore } from '@/lib/store';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Bot
} from 'lucide-react';

export default function MessagesPage() {
  const { currentUser, allProfiles, notifications } = useAppStore();

  const contacts = allProfiles.filter(p => p.id !== currentUser.id);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);

  const [chatHistory, setChatHistory] = useState<{ [contactId: string]: Array<{ sender: string; text: string; time: string; isSelf: boolean }> }>({
    'user-student-2': [
      { sender: 'Priya Deshmukh', text: 'Hey Aryan! Have you checked the latest telemetry test files for the LoRa payload?', time: '10:15 AM', isSelf: false },
      { sender: 'Aryan Sharma', text: 'Yes, just ran the inference pipeline on Jetson. Latency dropped to 14ms!', time: '10:18 AM', isSelf: true },
      { sender: 'Priya Deshmukh', text: 'Awesome. I will update our project submission deck.', time: '10:20 AM', isSelf: false }
    ],
    'user-organiser-1': [
      { sender: 'Prof. Rajesh Verma', text: 'Aryan, please ensure Team Nova registers the demo video link before 6:00 PM today.', time: 'Yesterday', isSelf: false },
      { sender: 'Aryan Sharma', text: 'Understood Sir, the link has been verified and attached to the project showcase.', time: 'Yesterday', isSelf: true }
    ]
  });

  const [inputMessage, setInputMessage] = useState('');

  const currentMessages = chatHistory[selectedContact?.id] || [
    { sender: selectedContact?.fullName || 'Contact', text: 'Hello! Feel free to send a message to coordinate team tasks.', time: 'Just now', isSelf: false }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedContact) return;

    const newMsg = {
      sender: currentUser.fullName,
      text: inputMessage.trim(),
      time: 'Just now',
      isSelf: true
    };

    setChatHistory(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
    }));

    setInputMessage('');
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <MessageSquare className="w-4 h-4" />
            <span>Direct Team Communications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Messages & Squad Channels
          </h1>
        </div>

        {/* Messaging Interface Shell */}
        <div className="rounded-3xl bg-[#0D1220] border border-[#1E293B] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
          
          {/* Left: Contacts List (4 cols) */}
          <div className="md:col-span-4 border-r border-[#1E293B] p-4 flex flex-col space-y-3 bg-[#0A0E1A]">
            <span className="text-xs font-bold text-slate-300">Roster Contacts</span>

            <div className="space-y-1.5 overflow-y-auto max-h-[460px]">
              {contacts.map((contact) => {
                const isSelected = selectedContact?.id === contact.id;

                return (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-purple-600/20 border border-purple-500/40 text-white'
                        : 'hover:bg-slate-800/40 text-slate-400 border border-transparent'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-purple-300 shrink-0">
                      {contact.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs text-slate-200 truncate">{contact.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{contact.role} • {contact.aitRollNo}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Chat Conversation (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between bg-[#121A2B]/40 p-4 sm:p-6 space-y-4">
            
            {/* Chat header */}
            <div className="pb-3 border-b border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-sky-400 p-[1.5px]">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-xs text-white">
                    {selectedContact?.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedContact?.fullName}</h3>
                  <p className="text-[10px] text-purple-300">{selectedContact?.role} • {selectedContact?.branch}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                End-to-End Encrypted
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[360px]">
              {currentMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.isSelf
                        ? 'bg-purple-600 text-white rounded-br-none shadow-md shadow-purple-950/40'
                        : 'bg-[#18233C] text-slate-200 rounded-bl-none border border-[#1E293B]'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-[#1E293B] flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message ${selectedContact?.fullName.split(' ')[0]}...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D1220] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-950/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

          </div>

        </div>

      </div>
    </DashboardShell>
  );
}
