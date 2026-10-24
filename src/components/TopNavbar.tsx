'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Menu,
  Plus,
} from 'lucide-react';

interface TopNavbarProps {
  onToggleMobileMenu?: () => void;
}

export default function TopNavbar({ onToggleMobileMenu }: TopNavbarProps) {
  const router = useRouter();
  const {
    currentUser,
    allProfiles,
    switchUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(
    (n) => !n.isRead && n.userId === currentUser.id
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/projects?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'DIRECTOR':
      case 'PRINCIPAL':
        return 'Director';
      case 'GENERAL_SECRETARY':
      case 'ADMINISTRATOR':
        return 'General Sec';
      case 'CLUB_SECRETARY':
      case 'COMPETITION_ORGANISER':
        return 'Club Sec';
      case 'JOINT_SECRETARY':
        return 'Joint Sec';
      default:
        return 'Student';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0c101d] border-b border-[#1a2236] h-14 flex items-center px-4 sm:px-6 gap-3">

      {/* Mobile hamburger */}
      <button
        onClick={onToggleMobileMenu}
        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors shrink-0"
        aria-label="Toggle navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search bar — centered, rounded */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex-1 max-w-md mx-auto"
      >
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams, projects, competitions..."
          className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-[#111728] border border-[#1e293b] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/60 transition-all"
        />
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-3">

        {/* + Participate Button */}
        <Link
          href="/competitions"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Participate
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileMenuOpen(false);
            }}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0c101d]" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0d1220] border border-[#1e293b] shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
                <span className="text-xs font-bold text-white">Notifications</span>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#1e293b]/70 mt-1">
                {notifications.filter((n) => n.userId === currentUser.id).length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No notifications yet</p>
                ) : (
                  notifications
                    .filter((n) => n.userId === currentUser.id)
                    .slice(0, 8)
                    .map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`py-2 px-2 cursor-pointer rounded-xl transition-colors ${
                          notif.isRead ? 'opacity-60 hover:opacity-100' : 'bg-indigo-950/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200 leading-snug">{notif.title}</p>
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                        {notif.link && (
                          <Link
                            href={notif.link}
                            onClick={() => setIsNotifOpen(false)}
                            className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline mt-1"
                          >
                            View Details <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar + name + role */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/40 transition-colors"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                {currentUser.fullName[0]}
              </div>
            )}

            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white truncate">
                {currentUser.fullName.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-400">{getRoleLabel(currentUser.role)}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0d1220] border border-[#1e293b] shadow-2xl p-2 z-50"
            >
              <div className="px-3 py-2 border-b border-[#1e293b] mb-1">
                <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
                <p className="text-[11px] text-indigo-300 font-mono truncate">{currentUser.collegeEmail}</p>
              </div>

              {/* Persona Switcher */}
              <div className="px-3 py-1.5 border-b border-[#1e293b] mb-1">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Switch Persona
                </p>
                {allProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchUser(p.id);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] flex items-center justify-between transition-colors ${
                      currentUser.id === p.id
                        ? 'bg-indigo-600/20 text-indigo-200 font-semibold'
                        : 'hover:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <span>{p.fullName}</span>
                    {currentUser.id === p.id && (
                      <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>

              <Link
                href="/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/50 block"
              >
                Profile & Badges
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
