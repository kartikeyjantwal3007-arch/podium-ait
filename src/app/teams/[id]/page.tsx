'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { 
  Users, 
  ArrowLeft, 
  Trophy, 
  FolderGit2, 
  Medal, 
  ShieldCheck, 
  Award, 
  Calendar,
  ExternalLink 
} from 'lucide-react';

import { Suspense } from 'react';

function TeamDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { teams, projects, results } = useAppStore();

  const team = teams.find(t => t.id === resolvedParams.id || t.slug === resolvedParams.id);

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080B14]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-center space-y-4">
          <div>
            <h1 className="text-xl font-bold text-white">Team Dossier Not Found</h1>
            <p className="text-xs text-slate-400 mt-1">The requested team does not exist or has been modified.</p>
            <Link href="/teams" className="mt-4 inline-block px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
              Back to Teams Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const teamProjects = projects.filter(p => p.teamId === team.id);
  const teamResults = results.filter(r => r.teamId === team.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
          
          <Link
            href="/teams"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Teams Directory</span>
          </Link>

          {/* Team Profile Header */}
          <div className="rounded-3xl bg-[#0D1220] border border-slate-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-purple-500/50 overflow-hidden flex items-center justify-center shrink-0 shadow-lg shadow-purple-950/40">
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-2xl text-purple-400">{team.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    AIT Student Collective
                  </span>
                  <span className="text-xs text-slate-500">• Created {new Date(team.createdAt).toLocaleDateString()}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {team.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {team.description}
                </p>
              </div>

            </div>
          </div>

          {/* Two-Column Dossier: Members and Project Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Members & Contributions */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h2 className="text-base font-bold text-white">Team Roster ({team.members.length})</h2>
                </div>

                <div className="space-y-3">
                  {team.members.map((member) => (
                    <div
                      key={member.studentId}
                      className="p-3.5 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-100">{member.fullName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {member.roleInTeam}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">Roll: {member.aitRollNo}</p>
                      <p className="text-[10px] text-slate-500">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Awards & Ranks */}
              {teamResults.length > 0 && (
                <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-bold text-white">Institutional Honors</h2>
                  </div>

                  <div className="space-y-2.5">
                    {teamResults.map((res) => (
                      <div key={res.id} className="p-3 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{res.awardTitle}</span>
                        <p className="text-xs font-semibold text-slate-200">{res.competitionTitle}</p>
                        <p className="text-[11px] text-slate-500">Verified by: {res.verifiedBy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (2 cols): Project Gallery & Competition History */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Project Gallery */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-sky-400" />
                  <h2 className="text-base font-bold text-white">Team Project Gallery</h2>
                </div>

                {teamProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No projects registered under this team yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teamProjects.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl bg-[#121A2B] border border-slate-800 p-4 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <h3 className="font-bold text-sm text-slate-100">{p.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2">{p.shortDescription}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-purple-300">{p.competitionTitle}</span>
                          <Link href={`/projects/${p.slug}`} className="text-sky-400 hover:underline font-semibold text-[11px]">
                            Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Competition History */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                <h3 className="text-sm font-bold text-white">Competition Affiliations</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every participation record maintained by this collective is tied to individual student identities, preserving lifetime credit even if members later form different teams for subsequent hackathons.
                </p>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080B14] p-8 text-center text-slate-400">Loading team details...</div>}>
      <TeamDetailContent params={params} />
    </Suspense>
  );
}
