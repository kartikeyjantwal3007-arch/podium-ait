'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Certificate } from '@/lib/types';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Medal, 
  FolderGit2, 
  FileCheck2, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  ExternalLink 
} from 'lucide-react';

import { Suspense } from 'react';

function CompetitionDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { competitions, teams, projects, results, certificates } = useAppStore();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const competition = competitions.find(c => c.slug === resolvedParams.slug || c.id === resolvedParams.slug);

  if (!competition) {
    return (
      <DashboardShell>
        <div className="p-8 text-center space-y-4">
          <h1 className="text-xl font-bold text-white">Competition Not Found</h1>
          <p className="text-xs text-slate-400 mt-1">The requested competition does not exist or has been archived.</p>
          <Link href="/competitions" className="mt-4 inline-block px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
            Back to Competitions
          </Link>
        </div>
      </DashboardShell>
    );
  }

  // Related data
  const compResults = results.filter(r => r.competitionId === competition.id);
  const compProjects = projects.filter(p => p.competitionId === competition.id);
  const compCertificates = certificates.filter(c => c.competitionId === competition.id);

  return (
    <DashboardShell>
      <div className="space-y-8">
          
          {/* Back button */}
          <Link
            href="/competitions"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Competitions</span>
          </Link>

          {/* Banner Hero Card */}
          <div className="rounded-3xl bg-[#0D1220] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="relative h-64 sm:h-80 w-full bg-slate-900">
              <img
                src={competition.bannerUrl}
                alt={competition.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220] via-[#0D1220]/60 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600/90 text-white backdrop-blur-sm">
                    {competition.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    competition.status === 'ONGOING' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : competition.status === 'COMPLETED'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {competition.status}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {competition.title}
                </h1>
              </div>
            </div>

            {/* Quick Specs Bar */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 bg-[#121A2B]/40 text-xs">
              <div>
                <span className="text-slate-500 block">Dates</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Venue & Format</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {competition.venueType} • {competition.venueDetails}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Prize Pool</span>
                <span className="font-semibold text-amber-400 mt-0.5 block">
                  {competition.prizePool}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Team Formation</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {competition.minTeamSize} to {competition.maxTeamSize} Members
                </span>
              </div>
            </div>
          </div>

          {/* Description & Rules & Eligibility Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col (2 cols): Overview & Rules */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                <h2 className="text-base font-bold text-white">Event Overview</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {competition.description}
                </p>
              </div>

              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                <h2 className="text-base font-bold text-white">Official Rules & Protocol</h2>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800 font-mono">
                  {competition.rules || 'Standard AIT Pune technical competition code of conduct applies. All solutions must be authored by enrolled students.'}
                </p>
              </div>

              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                <h2 className="text-base font-bold text-white">Eligibility Criteria</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {competition.eligibility || 'Open to all bona-fide engineering students across accredited AICTE / UGC universities.'}
                </p>
              </div>

              {/* Verified Podium Results (if any) */}
              {compResults.length > 0 && (
                <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-bold text-white">Official Podium Standings</h2>
                  </div>

                  <div className="space-y-3">
                    {compResults.map((res) => (
                      <div
                        key={res.id}
                        className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                            res.rankPosition === 1 ? 'bg-amber-400 text-black'
                            : res.rankPosition === 2 ? 'bg-slate-300 text-black'
                            : 'bg-amber-700 text-white'
                          }`}>
                            {res.rankPosition}
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{res.awardTitle}</span>
                            <h4 className="font-bold text-sm text-white">{res.teamName}</h4>
                            <p className="text-[11px] text-slate-400">Project: {res.projectTitle}</p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Official
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Col: Submissions & Certificates */}
            <div className="space-y-6">
              
              {/* Submitted Projects */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-bold text-white">Submitted Projects</h3>
                  </div>
                  <span className="text-xs text-slate-500">{compProjects.length}</span>
                </div>

                {compProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No projects submitted yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {compProjects.map((p) => (
                      <Link
                        key={p.id}
                        href={`/projects/${p.slug}`}
                        className="p-3 rounded-xl bg-[#121A2B] hover:bg-slate-800 border border-slate-800/80 block transition-colors space-y-1"
                      >
                        <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{p.title}</h4>
                        <p className="text-[10px] text-purple-300">{p.teamName}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Associated Certificates */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Authorized Certificates</h3>
                  </div>
                  <span className="text-xs text-slate-500">{compCertificates.length}</span>
                </div>

                {compCertificates.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Certificates generated upon result approval.</p>
                ) : (
                  <div className="space-y-2.5">
                    {compCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-3 rounded-xl bg-[#121A2B] border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate">{cert.recipientName}</p>
                          <p className="text-[10px] text-slate-400">{cert.title}</p>
                        </div>
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-purple-600 text-[10px] font-semibold text-white transition-colors shrink-0"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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

export default function CompetitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080B14] p-8 text-center text-slate-400">Loading competition details...</div>}>
      <CompetitionDetailContent params={params} />
    </Suspense>
  );
}
