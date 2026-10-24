'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Certificate } from '@/lib/types';
import {
  Calendar,
  ArrowRight,
  Eye,
  Heart,
  MessageSquare,
  Star,
  Crown,
  ThumbsUp,
  Code2,
  Palette,
  Settings as SettingsIcon,
  Inbox,
  Pin,
  ScrollText,
} from 'lucide-react';

// Custom Team Logo Components matching screenshot
function PixelForgeLogo() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
      <path d="M6 24L16 6L26 24L16 20L6 24Z" fill="url(#pf-grad)" />
      <path d="M16 6L26 24L16 20V6Z" fill="#2563eb" fillOpacity="0.8" />
      <defs>
        <linearGradient id="pf-grad" x1="6" y1="6" x2="26" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TeamZenithLogo() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
      <path d="M16 6L6 20L10 22L16 13L22 22L26 20L16 6Z" fill="#ffffff" />
      <path d="M16 16L11 24H21L16 16Z" fill="#94a3b8" />
    </svg>
  );
}

function CodeCanvasLogo() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
      {/* 3D Isometric Cube */}
      <path d="M16 5L26 11V21L16 27L6 21V11L16 5Z" fill="#7c3aed" />
      <path d="M16 5L26 11L16 17L6 11L16 5Z" fill="#a855f7" />
      <path d="M16 17L26 11V21L16 27V17Z" fill="#6d28d9" />
    </svg>
  );
}

function InnovatorsLogo() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="10" stroke="#d946ef" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M12 14C12 11.5 13.5 10 16 10C18.5 10 20 11.5 20 14C20 15.5 19 16.5 18 17.5V19H14V17.5C13 16.5 12 15.5 12 14Z" fill="#ec4899" />
      <rect x="14" y="20" width="4" height="2" rx="1" fill="#ec4899" />
    </svg>
  );
}

function CircuitBreakersLogo() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 10C12.69 10 10 12.69 10 16C10 19.31 12.69 22 16 22C19.31 22 22 19.31 22 16C22 12.69 19.31 10 16 10ZM16 19C14.34 19 13 17.66 13 16C13 14.34 14.34 13 16 13C17.66 13 19 14.34 19 16C19 17.66 17.66 19 16 19Z"
        fill="#0284c7"
      />
      <rect x="14.5" y="4" width="3" height="4" rx="1" fill="#0284c7" />
      <rect x="14.5" y="24" width="3" height="4" rx="1" fill="#0284c7" />
      <rect x="4" y="14.5" width="4" height="3" rx="1" fill="#0284c7" />
      <rect x="24" y="14.5" width="4" height="3" rx="1" fill="#0284c7" />
    </svg>
  );
}

function AlphaSquadLogo() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
      <path d="M16 6L6 26H11L16 15L21 26H26L16 6Z" fill="#06b6d4" />
      <path d="M12 21H20V23H12V21Z" fill="#22d3ee" />
    </svg>
  );
}

const TEAM_LOGOS = [
  PixelForgeLogo,
  TeamZenithLogo,
  CodeCanvasLogo,
  InnovatorsLogo,
  CircuitBreakersLogo,
  AlphaSquadLogo,
];

export default function DashboardPage() {
  const {
    currentUser,
    competitions,
    results,
    projects,
    teams,
    notices,
  } = useAppStore();

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Active Priority Notice
  const priorityNotice = notices.find((n) => n.isPriorityNotice && n.status === 'PUBLISHED');

  // Featured competition is Graphica 2026
  const featuredCompetition =
    competitions.find((c) => c.slug === 'graphica-2026') ||
    competitions.find((c) => c.status === 'ONGOING') ||
    competitions[0];

  const upcomingCompetitions = competitions
    .filter((c) => c.id !== featuredCompetition?.id && c.status === 'PUBLISHED')
    .slice(0, 3);

  // Podium results for Graphica 2026
  const podiumWinners = results.slice(0, 3);
  const participatingTeams = teams.slice(0, 6);
  const featuredProjects = projects.slice(0, 4);
  const spotlightProject = projects.find((p) => p.slug === 'urban-oasis') || projects[0];

  const announcements = notices.filter((n) => n.status === 'PUBLISHED').slice(0, 3).map((n) => ({
    id: n.id,
    icon: n.isPriorityNotice ? '🚨' : n.category === 'HACKATHON' ? '🏆' : '💬',
    title: n.title,
    date: new Date(n.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  }));

  return (
    <DashboardShell>
      {/* 2-column layout matching screenshot (Main content + Right sidebar panel) */}
      <div className="flex flex-col xl:flex-row gap-5">

        {/* ─── LEFT / MAIN CONTENT AREA (Takes ~72% width) ─── */}
        <div className="flex-1 space-y-5 min-w-0">

          {/* Priority Notice Banner (if active) */}
          {priorityNotice && (
            <div className="rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#131728] to-purple-950/30 border border-rose-500/50 p-4 flex items-start justify-between gap-4 shadow-lg shadow-rose-950/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                  <Pin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      HIGH PRIORITY DIRECTIVE
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Issued by {priorityNotice.authorName} ({priorityNotice.authorDesignation.replace('_', ' ')})
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{priorityNotice.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{priorityNotice.content}</p>
                </div>
              </div>
              <Link href="/notices" className="text-xs text-rose-300 hover:text-white font-semibold underline shrink-0">
                View All
              </Link>
            </div>
          )}

          {/* Joint Secretary Quick Notice Bar */}
          {currentUser.role === 'JOINT_SECRETARY' && (
            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ScrollText className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-200">
                  Signed in as <strong>Joint Secretary ({currentUser.assignedClubName || 'Technical Club'})</strong>.
                </span>
              </div>
              <Link
                href="/notices"
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-sm"
              >
                + Draft Notice
              </Link>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              1. HERO BANNER
              ═══════════════════════════════════════════ */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0c101d] border border-[#1a2236] min-h-[250px] sm:min-h-[270px] flex items-center">

            {/* Background trophy art on right */}
            <div
              className="absolute right-0 top-0 bottom-0 w-full sm:w-[65%] bg-cover bg-right bg-no-repeat opacity-85"
              style={{
                backgroundImage: 'url(/hero-banner.jpg)',
              }}
            />

            {/* Dark gradient fade from left to right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c101d] via-[#0c101d]/95 sm:via-[#0c101d]/85 to-transparent z-10" />

            {/* Hero Left Content */}
            <div className="relative z-20 p-6 sm:p-8 max-w-lg">
              <p className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase mb-2.5">
                IDEAS &nbsp;&nbsp; TEAMS &nbsp;&nbsp; INNOVATION
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-white leading-[1.12] tracking-tight">
                Celebrate.
                <br />
                Showcase.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#38bdf8]">
                  Learn. Grow.
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-sm">
                A platform to recognise talent, explore ideas and build a stronger community through
                competitions.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <Link
                  href="/competitions"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0c101d] text-xs font-bold hover:bg-slate-100 transition-colors shadow-md"
                >
                  Explore Competitions
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/podium"
                  className="px-4 py-2.5 rounded-xl bg-[#111728]/80 hover:bg-[#1a2236] border border-slate-700/80 text-white text-xs font-semibold transition-colors"
                >
                  View Leaderboard
                </Link>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              2. CURRENT COMPETITION & PODIUM HOLDERS (Side-by-side)
              ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* Current Competition Card (lg:col-span-5) */}
            <div className="lg:col-span-5 rounded-2xl bg-[#111728] border border-[#1e293b] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">Current Competition</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#064e3b]/50 text-[#34d399] border border-[#059669]/30">
                    Ongoing
                  </span>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700/50">
                    <img
                      src={
                        featuredCompetition?.bannerUrl ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={featuredCompetition?.title || 'Competition'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-white truncate">
                      {featuredCompetition?.title || 'Graphica 2026'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {featuredCompetition?.description || 'Visualise Ideas. Design the Future.'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>15 Oct – 25 Oct 2026</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Design', 'Presentation', 'Creativity'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-[#0c101d] border border-[#1e293b] text-[11px] text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 mt-5">
                <Link
                  href={`/competitions/${featuredCompetition?.slug || 'graphica-2026'}`}
                  className="px-4 py-2 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
                >
                  View Details
                </Link>
                <Link
                  href={`/competitions/${featuredCompetition?.slug || 'graphica-2026'}`}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  Participate
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Podium Holders Card (lg:col-span-7) */}
            <div className="lg:col-span-7 rounded-2xl bg-[#111728] border border-[#1e293b] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-white">Podium Holders</h2>
                <Link
                  href="/podium"
                  className="text-xs text-[#818cf8] hover:text-[#a5b4fc] flex items-center gap-1 font-medium transition-colors"
                >
                  View Full Leaderboard
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* 3 Podium cards side-by-side: 2nd (left), 1st (center, taller), 3rd (right) */}
              <div className="grid grid-cols-3 gap-3 items-end pt-2">

                {/* 2nd Place: Team Zenith */}
                <div className="rounded-xl border border-slate-700/60 bg-[#0c101d] p-3 flex flex-col items-center text-center">
                  <Crown className="w-3.5 h-3.5 text-slate-400 mb-1" />
                  <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-bold text-xs flex items-center justify-center mb-1.5">
                    2
                  </div>
                  <p className="text-xs font-bold text-white truncate w-full">Team Zenith</p>
                  <p className="text-[10px] text-slate-500 mb-2">Graphica 2026</p>
                  <div className="w-full h-14 rounded-lg overflow-hidden bg-slate-800 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&auto=format&fit=crop&q=80"
                      alt="Team Zenith"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center -space-x-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80"
                      className="w-5 h-5 rounded-full border border-[#0c101d] object-cover"
                      alt="member"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
                      className="w-5 h-5 rounded-full border border-[#0c101d] object-cover"
                      alt="member"
                    />
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-[#0c101d] flex items-center justify-center text-[8px] font-bold text-slate-300">
                      +1
                    </div>
                  </div>
                </div>

                {/* 1st Place: Pixel Forge (Taller, Gold border, Warm glow) */}
                <div className="rounded-xl border border-amber-400/80 bg-gradient-to-b from-[#251f0c] to-[#121008] p-3 flex flex-col items-center text-center shadow-lg shadow-amber-950/20 -mt-2">
                  <Crown className="w-4 h-4 text-amber-400 mb-1" />
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center mb-1.5 shadow-sm">
                    1
                  </div>
                  <p className="text-xs font-bold text-white truncate w-full">Pixel Forge</p>
                  <p className="text-[10px] text-amber-300/80 mb-2 font-medium">Graphica 2026</p>
                  <div className="w-full h-16 rounded-lg overflow-hidden bg-slate-800 mb-2 border border-amber-400/30">
                    <img
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80"
                      alt="Pixel Forge"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center -space-x-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80"
                      className="w-5 h-5 rounded-full border border-[#0c101d] object-cover"
                      alt="Sanyam"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80"
                      className="w-5 h-5 rounded-full border border-[#0c101d] object-cover"
                      alt="member"
                    />
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[8px] font-bold text-amber-300">
                      +2
                    </div>
                  </div>
                </div>

                {/* 3rd Place: CodeCanvas */}
                <div className="rounded-xl border border-amber-700/50 bg-[#0c101d] p-3 flex flex-col items-center text-center">
                  <Crown className="w-3.5 h-3.5 text-amber-600 mb-1" />
                  <div className="w-7 h-7 rounded-full bg-[#b45309] text-white font-bold text-xs flex items-center justify-center mb-1.5">
                    3
                  </div>
                  <p className="text-xs font-bold text-white truncate w-full">CodeCanvas</p>
                  <p className="text-[10px] text-slate-500 mb-2">Graphica 2026</p>
                  <div className="w-full h-14 rounded-lg overflow-hidden bg-slate-800 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80"
                      alt="CodeCanvas"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center -space-x-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
                      className="w-5 h-5 rounded-full border border-[#0c101d] object-cover"
                      alt="member"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&auto=format&fit=crop&q=80"
                      className="w-5 h-5 rounded-full border border-[#0c101d] object-cover"
                      alt="member"
                    />
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-[#0c101d] flex items-center justify-center text-[8px] font-bold text-slate-300">
                      +3
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════════
              3. PARTICIPATED TEAMS (6 teams in a single row)
              ═══════════════════════════════════════════ */}
          <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">Participated Teams</h2>
              <Link
                href="/teams"
                className="text-xs text-[#818cf8] hover:text-[#a5b4fc] flex items-center gap-1 font-medium transition-colors"
              >
                See All Teams
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {participatingTeams.map((team, idx) => {
                const LogoComponent = TEAM_LOGOS[idx] || PixelForgeLogo;
                return (
                  <Link
                    key={team.id}
                    href={`/teams`}
                    className="flex flex-col items-center gap-2 p-3.5 rounded-xl bg-[#0c101d] border border-[#1e293b] hover:border-indigo-500/40 transition-all group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <LogoComponent />
                    </div>
                    <div className="text-center w-full">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {team.name}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{team.members.length} members</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              4. FEATURED PROJECTS (4 cards in a row)
              ═══════════════════════════════════════════ */}
          <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">Featured Projects</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {featuredProjects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`/projects/${proj.slug}`}
                  className="group rounded-xl overflow-hidden bg-[#0c101d] border border-[#1e293b] hover:border-indigo-500/40 transition-all flex flex-col"
                >
                  <div className="h-28 w-full overflow-hidden bg-slate-800">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs font-bold text-white truncate group-hover:text-[#818cf8] transition-colors">
                          {proj.title}
                        </h3>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                          <Heart className="w-2.5 h-2.5 text-slate-400" />
                          {proj.likesCount}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">
                        {proj.teamName} · {proj.competitionTitle}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {proj.technologies.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded bg-[#111728] border border-[#1e293b] text-[9px] text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* ─── RIGHT SIDEBAR PANEL (Upcoming, Spotlight, Announcements) ─── */}
        <div className="w-full xl:w-[300px] shrink-0 space-y-4">

          {/* Card 1: Upcoming Competitions */}
          <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold text-white">Upcoming Competitions</h3>
              <Link href="/competitions" className="text-[11px] text-[#818cf8] hover:text-[#a5b4fc] font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {/* Competition 1: Hackathon 2026 */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0c101d] border border-[#1e293b]">
                <div className="w-8 h-8 rounded-lg bg-[#111728] border border-slate-700/60 flex items-center justify-center shrink-0 text-[#38bdf8]">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">Hackathon 2026</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <Calendar className="w-2.5 h-2.5 text-slate-500" />
                    <span>12 Nov 2026</span>
                  </div>
                </div>
                <Link
                  href="/competitions/hackathon-2026"
                  className="px-2 py-1 rounded-md bg-[#2563eb] text-white text-[10px] font-semibold shrink-0 hover:bg-[#1d4ed8] transition-colors"
                >
                  Registrations Open
                </Link>
              </div>

              {/* Competition 2: Design Fiesta */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0c101d] border border-[#1e293b]">
                <div className="w-8 h-8 rounded-lg bg-[#111728] border border-slate-700/60 flex items-center justify-center shrink-0 text-[#a855f7]">
                  <Palette className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">Design Fiesta</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <Calendar className="w-2.5 h-2.5 text-slate-500" />
                    <span>25 Nov 2026</span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-md bg-[#1e293b] text-slate-400 text-[10px] font-medium shrink-0">
                  Coming Soon
                </span>
              </div>

              {/* Competition 3: Robo Sprint */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0c101d] border border-[#1e293b]">
                <div className="w-8 h-8 rounded-lg bg-[#111728] border border-slate-700/60 flex items-center justify-center shrink-0 text-[#38bdf8]">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">Robo Sprint</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <Calendar className="w-2.5 h-2.5 text-slate-500" />
                    <span>10 Dec 2026</span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-md bg-[#1e293b] text-slate-400 text-[10px] font-medium shrink-0">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Spotlight Project */}
          {spotlightProject && (
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white">Spotlight Project</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  Winner
                </span>
              </div>

              <div className="rounded-xl overflow-hidden h-36 w-full bg-slate-800">
                <img
                  src={spotlightProject.coverImage}
                  alt={spotlightProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-bold text-sm text-white">{spotlightProject.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Team Pixel Forge &nbsp;•&nbsp; Graphica 2026
                </p>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {spotlightProject.shortDescription}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {['Sustainability', '3D Modelling', 'Architecture'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-[#0c101d] border border-[#1e293b] text-[10px] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats & CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]/60">
                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    1.2k
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                    210
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    45
                  </span>
                </div>

                <Link
                  href={`/projects/${spotlightProject.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] hover:border-indigo-500/50 text-white text-[11px] font-semibold transition-colors"
                >
                  View Project
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Card 3: Announcements */}
          <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold text-white">Announcements</h3>
              <Link href="/notifications" className="text-[11px] text-[#818cf8] hover:text-[#a5b4fc] font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0c101d] border border-[#1e293b] flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {ann.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-200 leading-snug">
                      {ann.title}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{ann.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Certificate modal for viewing certificates */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </DashboardShell>
  );
}
