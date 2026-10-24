'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  FolderGit2, 
  Users,
  Clock 
} from 'lucide-react';

export default function PodiumPage() {
  const { results, competitions } = useAppStore();
  const [selectedCompId, setSelectedCompId] = useState<string>('ALL');

  // Filter strictly to verified and official results
  const verifiedResults = results.filter(
    (r) => r.isVerified && (selectedCompId === 'ALL' || r.competitionId === selectedCompId)
  );

  // Determine if results are submitted but awaiting verification
  const selectedComp = selectedCompId !== 'ALL' ? competitions.find((c) => c.id === selectedCompId) : null;
  const isAwaitingVerification = selectedComp
    ? selectedComp.resultsStatus === 'PENDING_VERIFICATION' || results.some((r) => r.competitionId === selectedComp.id && !r.isVerified)
    : competitions.some((c) => c.resultsStatus === 'PENDING_VERIFICATION') || results.some((r) => !r.isVerified);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Crown className="w-4 h-4" />
                <span>Institutional Hall of Champions</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Winners & Official Podium Standings
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Authorized, permanent records of 1st, 2nd, and 3rd place distinctions achieved by AIT Pune students.
              </p>
            </div>

            {/* Filter by Competition */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Event:</span>
              <select
                value={selectedCompId}
                onChange={(e) => setSelectedCompId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="ALL">All Competitions</option>
                {competitions
                  .filter((c) => c.status !== 'DRAFT')
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Podium Content or Required Empty States */}
          {verifiedResults.length === 0 ? (
            <div className="rounded-3xl bg-[#0D1220] border border-slate-800 p-12 text-center max-w-2xl mx-auto space-y-4 my-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
                {isAwaitingVerification ? <Clock className="w-8 h-8 animate-pulse" /> : <Trophy className="w-8 h-8" />}
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {isAwaitingVerification ? 'Results are awaiting verification.' : 'No winners have been officially announced yet.'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  {isAwaitingVerification
                    ? 'Competition evaluation has concluded and proposed rankings have been submitted. Official standings will appear here once authorized by the General Secretary.'
                    : 'Podium standings are published strictly following authorized evaluation, board review, and official General Secretary verification.'}
                </p>
              </div>

              {selectedCompId !== 'ALL' && (
                <button
                  onClick={() => setSelectedCompId('ALL')}
                  className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold transition-colors border border-purple-500/30"
                >
                  View All Competitions
                </button>
              )}
            </div>
          ) : (
            /* Visual 3-Tier Podium Standings */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {verifiedResults.map((res) => {
                const isGold = res.rankPosition === 1;
                const isSilver = res.rankPosition === 2;
                const isBronze = res.rankPosition === 3;

                return (
                  <div
                    key={res.id}
                    className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                      isGold 
                        ? 'bg-gradient-to-b from-[#18233C] to-[#121A2B] border-2 border-amber-500/70 shadow-2xl shadow-amber-950/30 md:-translate-y-2' 
                        : isSilver
                        ? 'bg-gradient-to-b from-[#151D30] to-[#121A2B] border-2 border-slate-400/60 shadow-xl'
                        : 'bg-gradient-to-b from-[#151D30] to-[#121A2B] border-2 border-amber-700/60 shadow-xl'
                    }`}
                  >
                    
                    {/* Top Rank Badge */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
                          isGold ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-black shadow-amber-500/30'
                          : isSilver ? 'bg-gradient-to-tr from-slate-200 to-slate-400 text-black'
                          : 'bg-gradient-to-tr from-amber-700 to-amber-600 text-white'
                        }`}>
                          {res.rankPosition}
                        </div>
                        <div>
                          <span className={`text-[11px] font-black uppercase tracking-wider ${
                            isGold ? 'text-amber-400' : isSilver ? 'text-slate-300' : 'text-amber-500'
                          }`}>
                            {res.awardTitle}
                          </span>
                          <h3 className="text-lg font-extrabold text-white">{res.teamName}</h3>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="my-6 space-y-3">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Submitted Innovation</span>
                        <p className="text-xs font-semibold text-purple-300 line-clamp-1">{res.projectTitle || 'Autonomous System Architecture'}</p>
                      </div>

                      <p className="text-xs text-slate-400">
                        <strong className="text-slate-500 font-normal">Competition: </strong>
                        <span className="text-slate-200">{res.competitionTitle}</span>
                      </p>

                      <div>
                        <span className="text-[11px] font-bold text-slate-400">Podium Members:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {res.members.map((m) => (
                            <span key={m.studentId} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-medium">
                              {m.name} <span className="text-slate-400 font-mono text-[10px]">({m.aitRollNo})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer with Clickable Links */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-500">
                        Verified: {res.verifiedAt ? res.verifiedAt.split('T')[0] : 'Official'}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/teams/${res.teamId}`}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300"
                        >
                          Team
                        </Link>
                        <Link
                          href="/competitions"
                          className="px-2.5 py-1 rounded bg-purple-600/80 hover:bg-purple-600 text-[11px] font-semibold text-white"
                        >
                          Event
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Audit & Integrity Statement */}
          <div className="p-4 rounded-2xl bg-[#0D1220] border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Podium Verification & Anti-Tampering Protocol</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Podium placements can only be committed by authorised competition conveners and verified by the departmental board. Every rank modification creates an immutable audit entry accessible in the administration portal.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
