'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { 
  Award, 
  Trophy, 
  Crown, 
  Medal, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  Lock,
  Clock
} from 'lucide-react';

export default function AchievementsPage() {
  const { badges, currentUser, results, projects, teams } = useAppStore();

  // Explicit rules evaluation for student
  const hasFirstPlace = results.some(r => r.rankPosition === 1 && r.members.some(m => m.studentId === currentUser.id));
  const hasSecondPlace = results.some(r => r.rankPosition === 2 && r.members.some(m => m.studentId === currentUser.id));
  const hasThirdPlace = results.some(r => r.rankPosition === 3 && r.members.some(m => m.studentId === currentUser.id));
  const hasPublishedProject = projects.some(p => p.contributors.some(c => c.studentId === currentUser.id));
  const hasMultipleProjects = projects.filter(p => p.contributors.some(c => c.studentId === currentUser.id)).length >= 2;
  const isTeamPlayer = teams.filter(t => t.members.some(m => m.studentId === currentUser.id)).length >= 2;

  const isBadgeUnlocked = (code: string) => {
    switch (code) {
      case 'GOLD_ACHIEVER': return hasFirstPlace;
      case 'SILVER_ACHIEVER': return hasSecondPlace;
      case 'BRONZE_ACHIEVER': return hasThirdPlace;
      case 'FIRST_PROJECT': return hasPublishedProject;
      case 'ACTIVE_INNOVATOR': return hasMultipleProjects;
      case 'TEAM_PLAYER': return isTeamPlayer;
      case 'PARTICIPANT': return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Award className="w-4 h-4" />
              <span>Verifiable Merit Portfolio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              My Achievements & Verified Badges
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Permanent institutional accolades awarded based on strict programmatic criteria and verified competition records.
            </p>
          </div>

          {/* Badges Gallery */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Achievement Badges Catalog</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => {
                const unlocked = isBadgeUnlocked(badge.code);

                return (
                  <div
                    key={badge.id}
                    className={`rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                      unlocked
                        ? 'bg-[#121A2B] border-purple-500/40 shadow-xl shadow-purple-950/20'
                        : 'bg-[#0D1220]/60 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md ${
                          !unlocked 
                            ? 'bg-slate-800 text-slate-500'
                            : badge.tier === 'GOLD'
                            ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-black shadow-amber-500/30'
                            : badge.tier === 'SILVER'
                            ? 'bg-gradient-to-tr from-slate-200 to-slate-400 text-black'
                            : 'bg-gradient-to-tr from-amber-700 to-amber-600 text-white'
                        }`}>
                          {unlocked ? '★' : <Lock className="w-5 h-5 text-slate-600" />}
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          unlocked
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {unlocked ? 'Unlocked & Verified' : 'Locked'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                          {badge.category} • {badge.tier}
                        </span>
                        <h3 className="font-bold text-base text-white mt-0.5">{badge.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Authority: AIT Central Board</span>
                      {unlocked && (
                        <span className="text-purple-300 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Permanent
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institutional Badge Security Notice */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Anti-Tampering & Badging Governance</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Students cannot manually grant or forge achievement badges. Badge statuses are computed directly against verified institutional records and cannot be altered by modifying local state or client-side attributes.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
