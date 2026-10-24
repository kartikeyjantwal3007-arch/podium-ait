'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  Award, 
  Trophy, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function NotificationsPage() {
  const { 
    currentUser, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useAppStore();

  const userNotifs = notifications.filter(n => n.userId === currentUser.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Bell className="w-4 h-4" />
                <span>In-App Event Dispatch</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Notifications Center
              </h1>
            </div>

            {userNotifs.some(n => !n.isRead) && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {userNotifs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0D1220] border border-slate-800 space-y-2 text-slate-500 text-xs">
              <Bell className="w-8 h-8 text-slate-600 mx-auto" />
              <p>You have no notifications at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    notif.isRead
                      ? 'bg-[#0D1220] border-slate-800/80 opacity-75'
                      : 'bg-[#121A2B] border-purple-500/40 shadow-lg'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    notif.type === 'CERTIFICATE' ? 'bg-emerald-500/10 text-emerald-400'
                    : notif.type === 'BADGE' ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-purple-500/10 text-purple-400'
                  }`}>
                    {notif.type === 'CERTIFICATE' ? <FileCheck2 className="w-5 h-5" />
                    : notif.type === 'BADGE' ? <Award className="w-5 h-5" />
                    : <Trophy className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-white">{notif.title}</h3>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.link && (
                      <Link
                        href={notif.link}
                        className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold pt-1"
                      >
                        <span>View Associated Record</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
