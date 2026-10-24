'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  Trophy,
  Medal,
  Users,
  FolderGit2,
  Award,
  TrendingUp,
  FileCheck2,
  UserCircle,
  Bookmark,
  Bell,
  Settings,
  ShieldAlert,
  CalendarPlus,
  PenTool,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, certificates, notifications } = useAppStore();

  const unreadNotifsCount = notifications.filter(n => !n.isRead && n.userId === currentUser.id).length;
  const pendingPrincipalCerts = certificates.filter(c => c.status === 'UNDER_REVIEW' || c.status === 'SUBMITTED').length;

  const standardNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Competitions', href: '/competitions', icon: Trophy },
    { name: 'Winners & Podium', href: '/podium', icon: Medal },
    { name: 'Teams & Participants', href: '/teams', icon: Users },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'My Achievements', href: '/achievements', icon: Award },
    { name: 'My Performance', href: '/performance', icon: TrendingUp },
    { 
      name: 'My Certificates', 
      href: '/certificates', 
      icon: FileCheck2,
      badge: certificates.filter(c => c.studentId === currentUser.id && c.status === 'ISSUED').length.toString()
    },
    { name: 'My Profile', href: '/profile', icon: UserCircle },
    { name: 'Saved Projects', href: '/saved-projects', icon: Bookmark },
    { 
      name: 'Notifications', 
      href: '/notifications', 
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount.toString() : undefined
    },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0D1220] border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* User Quick Info */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-sky-400 p-[2px] shrink-0">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs text-white">
              {currentUser.fullName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-slate-100 truncate">
                {currentUser.fullName}
              </span>
              {currentUser.verificationStatus === 'VERIFIED' ? (
                <span title="Verified AIT Student" className="shrink-0 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </span>
              ) : (
                <span title="Pending Verification" className="shrink-0 flex items-center">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 truncate">
              {currentUser.aitRollNo} • {currentUser.branch}
            </span>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="mt-3 flex items-center justify-between px-2 py-1 rounded bg-slate-800/60 border border-slate-700/60 text-[10px]">
          <span className="text-slate-400">Roster Status:</span>
          <span className={`font-semibold uppercase tracking-wider ${
            currentUser.verificationStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {currentUser.verificationStatus}
          </span>
        </div>
      </div>

      {/* Role-Specific Portal Links (Dynamic based on permissions) */}
      {(currentUser.role === 'PRINCIPAL' || currentUser.role === 'ADMINISTRATOR' || currentUser.role === 'COMPETITION_ORGANISER') && (
        <div className="p-3 border-b border-slate-800/80 bg-purple-950/20">
          <p className="text-[10px] uppercase font-bold text-purple-300 tracking-wider mb-2 px-1">
            Authorised Management
          </p>
          <div className="space-y-1">
            {currentUser.role === 'PRINCIPAL' && (
              <Link
                href="/principal"
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  pathname === '/principal'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-amber-400/90 hover:bg-amber-500/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  <span>Principal's Portal</span>
                </div>
                {pendingPrincipalCerts > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                    {pendingPrincipalCerts}
                  </span>
                )}
              </Link>
            )}

            {(currentUser.role === 'COMPETITION_ORGANISER' || currentUser.role === 'ADMINISTRATOR') && (
              <Link
                href="/organiser"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  pathname === '/organiser'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-sky-400/90 hover:bg-sky-500/10'
                }`}
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Organiser Portal</span>
              </Link>
            )}

            {currentUser.role === 'ADMINISTRATOR' && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  pathname === '/admin'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-rose-400/90 hover:bg-rose-500/10'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin & Audit Hub</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Student Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 px-2">
          Student Portal
        </p>
        {standardNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  isActive ? 'bg-purple-500/40 text-purple-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
        <span>CompetiHub • AIT Pune v1.0</span>
      </div>
    </aside>
  );
}
