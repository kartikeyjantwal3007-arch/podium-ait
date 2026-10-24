'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Certificate } from '@/lib/types';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  CheckCircle2, 
  Award, 
  Trophy, 
  FileCheck2, 
  ExternalLink 
} from 'lucide-react';

export default function PerformancePage() {
  const { currentUser, results, certificates, competitions, teams } = useAppStore();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Student specific teams
  const userTeamIds = teams.filter(t => t.members.some(m => m.studentId === currentUser.id)).map(t => t.id);

  // Filtered performance entries for current student
  const studentResults = results.filter(r => 
    r.members.some(m => m.studentId === currentUser.id) || userTeamIds.includes(r.teamId)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <TrendingUp className="w-4 h-4" />
              <span>Permanent Academic Track Record</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              My Competition Performance Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Verified record of individual participation, team contributions, and distinctions across all AIT hackathons and coding competitions.
            </p>
          </div>

          {/* Performance Table Card */}
          <div className="rounded-2xl bg-[#0D1220] border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800/80 bg-[#121A2B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-200">
                Official Roster Entries for {currentUser.fullName} ({currentUser.aitRollNo})
              </span>
              <span className="text-[11px] text-slate-400">
                Total Verified Entries: <strong className="text-purple-300">{studentResults.length}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121A2B] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Competition</th>
                    <th className="p-4">Team</th>
                    <th className="p-4">Submitted Solution</th>
                    <th className="p-4">Official Result</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {studentResults.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No competition submissions recorded yet for this student account.
                      </td>
                    </tr>
                  ) : (
                    studentResults.map((entry) => {
                      const matchedCert = certificates.find(
                        c => c.studentId === currentUser.id && c.competitionId === entry.competitionId
                      );

                      return (
                        <tr key={entry.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4 font-semibold text-white">
                            {entry.competitionTitle}
                          </td>
                          <td className="p-4 text-purple-300 font-medium">
                            {entry.teamName}
                          </td>
                          <td className="p-4 text-slate-300 font-mono text-[11px]">
                            {entry.projectTitle || 'Autonomous System'}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-amber-400">
                              {entry.awardTitle}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {matchedCert ? (
                              <button
                                onClick={() => setSelectedCert(matchedCert)}
                                className="px-3 py-1 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-[11px] font-semibold transition-colors"
                              >
                                View Certificate
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Processing</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Institutional Note */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-slate-300">Performance Philosophy & Scoring Integrity:</span>
            <p className="leading-relaxed text-[11px]">
              Every competition record reflects verified experiential learning. Non-podium participants receive official recognition of technical completion without punitive rank deductions or arbitrary universal scores.
            </p>
          </div>

        </main>
      </div>

      <CertificateModal
        certificate={selectedCert}
        isOpen={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
