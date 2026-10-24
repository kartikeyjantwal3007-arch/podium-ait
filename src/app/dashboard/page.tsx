'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Certificate } from '@/lib/types';
import { 
  Trophy, 
  Medal, 
  FolderGit2, 
  FileCheck2, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  ExternalLink,
  Flame,
  Calendar,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    currentUser, 
    competitions, 
    results, 
    projects, 
    certificates, 
    badges, 
    teams 
  } = useAppStore();

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Filter dynamic metrics for current student
  const studentTeams = teams.filter(t => t.members.some(m => m.studentId === currentUser.id));
  const studentTeamIds = studentTeams.map(t => t.id);

  const studentResults = results.filter(r => 
    r.members.some(m => m.studentId === currentUser.id) || studentTeamIds.includes(r.teamId)
  );

  const studentProjects = projects.filter(p => 
    p.contributors.some(c => c.studentId === currentUser.id) || (p.teamId && studentTeamIds.includes(p.teamId))
  );

  const studentCertificates = certificates.filter(c => c.studentId === currentUser.id);
  const issuedCertificates = studentCertificates.filter(c => c.status === 'ISSUED');

  const earnedBadges = badges.slice(0, 3); // demo earned badges for Aryan

  // Active competitions
  const ongoingCompetitions = competitions.filter(c => c.status === 'ONGOING' || c.status === 'PUBLISHED');

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
          
          {/* Welcome Header */}
          <div className="rounded-3xl bg-gradient-to-r from-purple-900/40 via-[#121A2B] to-[#0D1220] border border-purple-500/20 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    AIT Student Portal
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="text-xs text-slate-400 font-mono">
                    {currentUser.aitRegNo}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Welcome back, <span className="text-purple-300">{currentUser.fullName}</span>!
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Your academic competition history, team affiliations, project submissions, and authorized certificates are securely cataloged here.
                </p>
              </div>

              {/* Status Pill & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  currentUser.verificationStatus === 'VERIFIED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {currentUser.verificationStatus === 'VERIFIED' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Roster: Verified Student</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Roster: Pending Review</span>
                    </>
                  )}
                </div>

                <Link
                  href="/projects"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/50 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit Project</span>
                </Link>
              </div>

            </div>
          </div>

          {/* 5 Authorized Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Competitions Participated */}
            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Participated</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{studentTeams.length > 0 ? 2 : 1}</p>
              <p className="text-[11px] text-purple-300">Hackathons & Sprints</p>
            </div>

            {/* Podium Finishes */}
            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Podium Finishes</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Medal className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{studentResults.length}</p>
              <p className="text-[11px] text-amber-300">Verified Top 3</p>
            </div>

            {/* Projects Published */}
            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Projects</span>
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <FolderGit2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-sky-400">{studentProjects.length}</p>
              <p className="text-[11px] text-sky-300">Published to Hub</p>
            </div>

            {/* Certificates Earned */}
            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Certificates</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FileCheck2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">{issuedCertificates.length}</p>
              <p className="text-[11px] text-emerald-300">Officially Signed</p>
            </div>

            {/* Badges Earned */}
            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg space-y-2 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Badges</span>
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-indigo-400">{earnedBadges.length}</p>
              <p className="text-[11px] text-indigo-300">Achievement Milestones</p>
            </div>

          </div>

          {/* Main Grid: Certificates & Active Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (2 Cols): Issued Certificates & Verified Achievements */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Issued Certificates Card */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-purple-400" />
                    <h2 className="text-base font-bold text-white">Your Official Certificates</h2>
                  </div>
                  <Link
                    href="/certificates"
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <span>View all certificates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {studentCertificates.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No certificates generated yet.</p>
                ) : (
                  <div className="space-y-3">
                    {studentCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 rounded-xl bg-[#121A2B] border border-slate-800/80 hover:border-purple-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-100">{cert.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              cert.status === 'ISSUED'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}>
                              {cert.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{cert.competitionTitle}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: {cert.certificateNumber}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setSelectedCert(cert)}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-sm"
                          >
                            Inspect & Download
                          </button>
                          <Link
                            href={`/verify?token=${cert.verificationToken}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                            title="Verify public authenticity"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Podium & Project Highlights */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-bold text-white">Verified Competition Record</h2>
                  </div>
                  <Link
                    href="/performance"
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <span>Full Performance Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#121A2B] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Competition</th>
                        <th className="p-3">Team</th>
                        <th className="p-3">Result</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {studentResults.map((res) => (
                        <tr key={res.id} className="hover:bg-slate-900/40">
                          <td className="p-3 font-semibold text-white">{res.competitionTitle}</td>
                          <td className="p-3 text-purple-300">{res.teamName}</td>
                          <td className="p-3 text-amber-400 font-bold">{res.awardTitle}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              Official
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column: Active Opportunities & Badges */}
            <div className="space-y-6">
              
              {/* Ongoing Hackathons */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">Open Sprints</h3>
                  </div>
                  <Link href="/competitions" className="text-xs text-purple-400 hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {ongoingCompetitions.slice(0, 2).map((comp) => (
                    <div key={comp.id} className="p-3.5 rounded-xl bg-[#121A2B] border border-slate-800/80 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{comp.title}</h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          {comp.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {comp.description}
                      </p>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Prize: <strong className="text-amber-400 font-semibold">{comp.prizePool}</strong></span>
                        <Link href={`/competitions/${comp.slug}`} className="text-purple-400 font-semibold hover:underline">
                          Register →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earned Badges Portfolio Preview */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Earned Badges</h3>
                  </div>
                  <Link href="/achievements" className="text-xs text-purple-400 hover:underline">
                    Gallery
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {earnedBadges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#121A2B] border border-slate-800/60">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                        badge.tier === 'GOLD' ? 'bg-amber-400 text-black' 
                        : badge.tier === 'SILVER' ? 'bg-slate-300 text-black'
                        : 'bg-amber-700 text-white'
                      }`}>
                        ★
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-100">{badge.title}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

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
