'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  Trophy, 
  Bell, 
  User, 
  ShieldCheck, 
  FileCheck, 
  Layers, 
  LogOut, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    currentUser, 
    allProfiles, 
    switchUser, 
    notifications, 
    markNotificationRead,
    markAllNotificationsRead 
  } = useAppStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead && n.userId === currentUser.id);

  const navLinks = [
    { name: 'Competitions', href: '/competitions' },
    { name: 'Podium', href: '/podium' },
    { name: 'Projects', href: '/projects' },
    { name: 'Teams', href: '/teams' },
    { name: 'Verify Certificate', href: '/verify' },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'PRINCIPAL': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ADMINISTRATOR': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'COMPETITION_ORGANISER': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default: return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'PRINCIPAL': return 'Principal / Signer';
      case 'ADMINISTRATOR': return 'Administrator';
      case 'COMPETITION_ORGANISER': return 'Organiser';
      default: return 'Student';
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-slate-800/80 bg-[#080B14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-400 p-[1.5px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
                <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                    COMPETI<span className="text-purple-400">HUB</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    AIT Pune
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:block tracking-tight font-medium">
                  Your Ideas. Your Achievements. Your Legacy.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Controls: Role Switcher, Notification, User Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Interactive Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${getRoleBadgeColor(currentUser.role)} hover:brightness-110`}
                title="Switch test accounts to inspect Student, Organiser, Admin, or Principal portals"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Role:</span>
                <span>{getRoleDisplayName(currentUser.role)}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {isUserSwitcherOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0D1220] border border-slate-700/80 shadow-2xl p-2 z-50"
                  onClick={() => setIsUserSwitcherOpen(false)}
                >
                  <div className="px-2 py-1.5 border-b border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-200">Switch Role / Personas</p>
                    <p className="text-[11px] text-slate-400">Instantly test role-based access control</p>
                  </div>
                  <div className="space-y-1">
                    {allProfiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => switchUser(p.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          currentUser.id === p.id 
                            ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30' 
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{p.fullName}</p>
                          <p className="text-[10px] text-slate-400">{getRoleDisplayName(p.role)} • {p.aitRollNo}</p>
                        </div>
                        {currentUser.id === p.id && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white ring-2 ring-[#080B14]">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#0D1220] border border-slate-700/80 shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-slate-200">Notifications</span>
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-purple-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 mt-1">
                    {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No notifications yet</p>
                    ) : (
                      notifications
                        .filter(n => n.userId === currentUser.id)
                        .map((notif) => (
                          <div 
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`py-2.5 px-2 cursor-pointer transition-colors rounded-lg ${
                              notif.isRead ? 'opacity-70 hover:opacity-100' : 'bg-purple-950/20'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
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

            {/* Dashboard / User Profile Button */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md shadow-purple-950/50"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Portal</span>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0D1220] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800 flex justify-between">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Account Login
            </Link>
            <Link
              href="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs text-purple-400 font-semibold"
            >
              Register Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
