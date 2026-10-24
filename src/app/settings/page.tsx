'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { Settings, RefreshCw, Database, ShieldCheck, Bell, User } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, isSupabaseActive, resetToDefaultData } = useAppStore();

  const handleResetData = () => {
    if (confirm('Are you sure you want to restore original demonstration seed data? All temporary test entries will be re-initialized.')) {
      resetToDefaultData();
      alert('CompetiHub test state reset to default AIT Pune demonstration records.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-8 overflow-y-auto">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Settings className="w-4 h-4" />
              <span>Platform Configuration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Account & System Settings
            </h1>
          </div>

          {/* Account Profile Summary */}
          <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span>Current Session Profile</span>
            </h2>

            <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1 text-xs">
              <p className="text-slate-200 font-bold">{currentUser.fullName} ({currentUser.role})</p>
              <p className="text-slate-400 font-mono">Roll: {currentUser.aitRollNo} • Reg: {currentUser.aitRegNo}</p>
              <p className="text-slate-400">{currentUser.collegeEmail}</p>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" />
              <span>In-App Alert Channels</span>
            </h2>

            <div className="space-y-3 text-xs text-slate-300">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" />
                <span>Notify me when an official certificate is approved or signed by the Principal.</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" />
                <span>Notify me when podium rankings are officially verified for a registered competition.</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" />
                <span>Notify me upon roster verification changes by the AIT Administration Office.</span>
              </label>
            </div>
          </div>

          {/* Database & State Reset */}
          <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              <span>Database Sync & Sandbox Storage</span>
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed">
              Active Storage Adapter: <strong className="text-purple-300 font-mono">{isSupabaseActive ? 'Supabase PostgreSQL' : 'Browser Persistent LocalStorage'}</strong>.
              If Supabase credentials are configured in <code className="text-slate-300">.env.local</code>, real-time database queries are used automatically.
            </p>

            <div className="pt-2">
              <button
                onClick={handleResetData}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Demonstration Seed Records</span>
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
