'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { 
  FolderGit2, 
  ArrowLeft, 
  Heart, 
  Bookmark, 
  ExternalLink, 
  Users, 
  Trophy, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle 
} from 'lucide-react';
import { GithubIcon } from '@/components/Icons';

import { Suspense } from 'react';

function ProjectDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { projects, toggleLikeProject, toggleSaveProject, savedProjectIds } = useAppStore();

  const project = projects.find(p => p.slug === resolvedParams.slug || p.id === resolvedParams.slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080B14]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-center space-y-4">
          <div>
            <h1 className="text-xl font-bold text-white">Project Not Found</h1>
            <p className="text-xs text-slate-400 mt-1">The requested project submission does not exist or has been made private.</p>
            <Link href="/projects" className="mt-4 inline-block px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSaved = savedProjectIds.includes(project.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
          
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects Showcase</span>
          </Link>

          {/* Banner & Hero Header */}
          <div className="rounded-3xl bg-[#0D1220] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="relative h-64 sm:h-80 w-full bg-slate-900">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220] via-[#0D1220]/70 to-transparent" />

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => toggleLikeProject(project.id)}
                  className={`px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    project.isLikedByUser ? 'bg-rose-500 text-white' : 'bg-slate-900/80 text-slate-200 hover:text-rose-400'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={project.isLikedByUser ? 'currentColor' : 'none'} />
                  <span>{project.likesCount} Likes</span>
                </button>

                <button
                  onClick={() => toggleSaveProject(project.id)}
                  className={`px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isSaved ? 'bg-purple-600 text-white' : 'bg-slate-900/80 text-slate-200 hover:text-purple-300'
                  }`}
                >
                  <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30 backdrop-blur-sm">
                    {project.teamName || 'Independent Submission'}
                  </span>
                  {project.competitionTitle && (
                    <span className="text-xs text-slate-300 bg-slate-900/70 px-3 py-1 rounded-full backdrop-blur-sm">
                      {project.competitionTitle}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {project.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>
            </div>

            {/* Quick Links Bar */}
            <div className="p-4 sm:p-6 border-t border-slate-800 bg-[#121A2B]/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 text-xs font-mono font-semibold">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-900/40"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demonstration</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Architectural Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Problem Statement & Technical Solution */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Problem Statement */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">Problem Statement</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  {project.problemStatement}
                </p>
              </div>

              {/* Proposed Solution */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-sky-400" />
                  <h2 className="text-base font-bold text-white">Engineering Architecture & Proposed Solution</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  {project.proposedSolution}
                </p>
              </div>

              {/* Challenges and Lessons Learned */}
              {project.challengesLessons && (
                <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                  <h2 className="text-base font-bold text-white">Challenges & Lessons Learned</h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.challengesLessons}
                  </p>
                </div>
              )}

              {/* Future Scope */}
              {project.futureScope && (
                <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                  <h2 className="text-base font-bold text-white">Future Scope & Enhancements</h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.futureScope}
                  </p>
                </div>
              )}

            </div>

            {/* Right Col: Contributors & Member Contributions */}
            <div className="space-y-6">
              
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Project Contributors</h3>
                </div>

                <div className="space-y-3">
                  {project.contributors.map((c) => (
                    <div key={c.studentId} className="p-3.5 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                      <p className="font-bold text-xs text-slate-100">{c.studentName}</p>
                      <p className="text-[11px] text-purple-300 font-medium">Specific Contribution:</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{c.contribution}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-2 text-xs text-slate-400">
                <span className="font-bold text-slate-200">Open Access Repository Notice</span>
                <p className="text-[11px] leading-relaxed">
                  Published openly under the AIT Pune Innovation Commons license. Source code links and hardware schematics have been vetted against malicious payloads and security disclosures.
                </p>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080B14] p-8 text-center text-slate-400">Loading project details...</div>}>
      <ProjectDetailContent params={params} />
    </Suspense>
  );
}
