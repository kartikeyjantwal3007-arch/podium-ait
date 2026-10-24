'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  Home,
  Trophy,
  Users,
  BarChart2,
  FolderGit2,
  Globe2,
  User,
  ChevronRight,
  PenTool,
  CalendarPlus,
  ShieldAlert,
  Sparkles,
  ScrollText,
  Briefcase,
  Shield,
  Award,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser, competitions, certificates } = useAppStore();

  const ongoingComp = competitions.find((c) => c.status === 'ONGOING') || competitions[0];

  const [daysLeft, setDaysLeft] = useState(5);
  useEffect(() => {
    if (ongoingComp) {
      const diff = Math.max(
        0,
        Math.ceil((new Date(ongoingComp.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      );
      setDaysLeft(diff > 0 ? diff : 5);
    }
  }, [ongoingComp]);

  const pendingDirectorCerts = certificates.filter(
    (c) => c.status === 'PENDING_SIGNATURE' || c.status === 'PENDING_REVIEW' || c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW'
  ).length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'DIRECTOR':
      case 'PRINCIPAL':
        return { label: 'Director', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'GENERAL_SECRETARY':
      case 'ADMINISTRATOR':
        return { label: 'General Sec', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      case 'CLUB_SECRETARY':
      case 'COMPETITION_ORGANISER':
        return { label: 'Club Sec', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
      case 'JOINT_SECRETARY':
        return { label: 'Joint Sec', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      default:
        return { label: 'Student', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
    }
  };

  const roleMeta = getRoleBadge(currentUser.role);

  // Common student navigation links
  const studentNavItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Competitions', href: '/competitions', icon: Trophy },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Leaderboard', href: '/podium', icon: BarChart2 },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'Community', href: '/community', icon: Globe2 },
    { name: 'My Profile', href: '/profile', icon: User },
  ];

  return (
    <aside className="w-52 bg-[#0c101d] border-r border-[#1a2236] flex flex-col h-screen sticky top-0 select-none z-40 shrink-0">

      {/* Logo */}
      <div className="px-5 py-4 border-b border-[#1a2236]/60">
        <Link
          href="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Trophy className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-[15px] tracking-wide text-white">
            COMPETI HUB
          </span>
        </Link>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-4 py-2 border-b border-[#1a2236]/40 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Designation</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${roleMeta.color}`}>
          {roleMeta.label}
        </span>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">

        {/* 1. Joint Secretary Dedicated Section */}
        {currentUser.role === 'JOINT_SECRETARY' && (
          <div className="pb-2 mb-2 border-b border-[#1a2236]/70">
            <p className="text-[9px] uppercase font-bold text-purple-400 tracking-wider px-3 mb-1 flex items-center gap-1">
              <ScrollText className="w-3 h-3" />
              JS Office
            </p>
            <Link
              href="/notices"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/notices'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                  : 'text-purple-300 hover:bg-purple-500/10'
              }`}
            >
              <ScrollText className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Notices & Broadcasts</span>
            </Link>
          </div>
        )}

        {/* 2. Club Secretary Dedicated Navigation */}
        {(currentUser.role === 'CLUB_SECRETARY' || currentUser.role === 'COMPETITION_ORGANISER') && (
          <div className="pb-2 mb-2 border-b border-[#1a2236]/70">
            <p className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider px-3 mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Club Desk
            </p>
            <Link
              href="/club-secretary"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/club-secretary' || pathname === '/organiser'
                  ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30'
                  : 'text-indigo-300 hover:bg-indigo-500/10'
              }`}
            >
              <Building className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>Club Management</span>
            </Link>
          </div>
        )}

        {/* 3. General Secretary Dedicated Navigation */}
        {(currentUser.role === 'GENERAL_SECRETARY' || currentUser.role === 'ADMINISTRATOR') && (
          <div className="pb-2 mb-2 border-b border-[#1a2236]/70">
            <p className="text-[9px] uppercase font-bold text-rose-400 tracking-wider px-3 mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Gen-Sec Desk
            </p>
            <Link
              href="/general-secretary"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/general-secretary' || pathname === '/admin'
                  ? 'bg-rose-600/20 text-rose-200 border border-rose-500/30'
                  : 'text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Supervisory Console</span>
            </Link>
          </div>
        )}

        {/* 4. Director Dedicated Navigation */}
        {(currentUser.role === 'DIRECTOR' || currentUser.role === 'PRINCIPAL') && (
          <div className="pb-2 mb-2 border-b border-[#1a2236]/70">
            <p className="text-[9px] uppercase font-bold text-amber-400 tracking-wider px-3 mb-1 flex items-center gap-1">
              <Award className="w-3 h-3" />
              Directorate
            </p>
            <Link
              href="/director"
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/director' || pathname === '/principal'
                  ? 'bg-amber-600/20 text-amber-200 border border-amber-500/30'
                  : 'text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PenTool className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Director Portal</span>
              </div>
              {pendingDirectorCerts > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950">
                  {pendingDirectorCerts}
                </span>
              )}
            </Link>
          </div>
        )}

        {/* Standard Student Nav Items */}
        {studentNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#24294a] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Ongoing Competition Widget - matching visual reference */}
      {ongoingComp && (
        <div className="p-3 border-t border-[#1a2236]/60">
          <p className="text-[11px] font-semibold text-slate-400 px-1 mb-2">Ongoing</p>
          <Link
            href={`/competitions/${ongoingComp.slug}`}
            className="block rounded-xl bg-[#111728] border border-[#1e293b] p-3 hover:border-indigo-500/40 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/50">
                <img
                  src={ongoingComp.bannerUrl}
                  alt={ongoingComp.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{ongoingComp.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-[10px] text-slate-300">Submission open</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2.5">
              <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-sky-400 to-indigo-500" />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-slate-400 font-medium">{daysLeft} days left</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
