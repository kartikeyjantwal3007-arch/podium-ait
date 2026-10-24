'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Certificate, Notice, NoticeReactionType } from '@/lib/types';
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
  Pin,
  ScrollText,
  Shield,
  Paperclip,
  CheckCircle2,
  X,
  Trophy,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

// Custom Team Logo Components
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

// Exactly 6 WhatsApp-style emoji reactions (Requirement 8)
const EMOJI_REACTIONS: { type: NoticeReactionType; emoji: string; label: string }[] = [
  { type: 'LIKE', emoji: '👍', label: 'Like' },
  { type: 'LOVE', emoji: '❤️', label: 'Love' },
  { type: 'LAUGH', emoji: '😂', label: 'Laugh' },
  { type: 'WOW', emoji: '😮', label: 'Wow' },
  { type: 'THANKS', emoji: '🙏', label: 'Thanks' },
  { type: 'CELEBRATE', emoji: '👏', label: 'Celebrate' },
];

export default function DashboardPage() {
  const {
    currentUser,
    competitions,
    results,
    projects,
    teams,
    notices,
    noticeReactions,
    toggleNoticeReaction,
    verifyStudentOtp,
    requestVerificationOtp,
  } = useAppStore();

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Active published notices sorted by priority then date (newest first)
  const publishedNotices = notices
    .filter((n) => n.status === 'PUBLISHED')
    .sort((a, b) => {
      if (a.isPriorityNotice && !b.isPriorityNotice) return -1;
      if (!a.isPriorityNotice && b.isPriorityNotice) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  // Featured competition (excluding private organizer drafts)
  const publishedComps = competitions.filter((c) => c.status !== 'DRAFT');
  const featuredCompetition =
    publishedComps.find((c) => c.status === 'ONGOING') ||
    publishedComps.find((c) => c.status === 'PUBLISHED') ||
    publishedComps[0];

  const upcomingCompetitions = competitions
    .filter((c) => c.id !== featuredCompetition?.id && c.status === 'PUBLISHED')
    .slice(0, 3);

  // Verified podium results only
  const verifiedResults = results
    .filter((r) => r.isVerified)
    .sort((a, b) => (a.rankPosition || 99) - (b.rankPosition || 99));

  const hasPendingVerification = results.some((r) => !r.isVerified);

  const participatingTeams = teams.slice(0, 6);
  const featuredProjects = projects.slice(0, 4);
  const spotlightProject = projects[0];

  // Helper to count reactions for a notice
  const getReactionCount = (noticeId: string, type: NoticeReactionType) => {
    return noticeReactions.filter((r) => r.noticeId === noticeId && r.reaction === type).length;
  };

  // Helper to check if current user selected this reaction
  const hasUserReacted = (noticeId: string, type: NoticeReactionType) => {
    return noticeReactions.some((r) => r.noticeId === noticeId && r.userId === currentUser.id && r.reaction === type);
  };

  return (
    <DashboardShell>
      {/* 2-column layout matching original dark dashboard */}
      <div className="flex flex-col xl:flex-row gap-5">

        {/* ─── LEFT / MAIN CONTENT AREA (Takes ~72% width) ─── */}
        <div className="flex-1 space-y-6 min-w-0">

          {/* Pending AIT Verification Banner */}
          {currentUser.verificationStatus === 'PENDING_AIT_VERIFICATION' && (
            <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#131728] to-purple-950/30 border border-amber-500/50 p-4 space-y-3 shadow-lg shadow-amber-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Pin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        AIT STUDENT VERIFICATION PENDING
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {currentUser.collegeEmail}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">AIT Pune Institutional Verification Required</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Your account is in Student Preview mode. Official hackathon submissions and certificate issuance require verified AIT student status. Enter the 6-digit OTP sent to your college email (default testing OTP: <strong className="text-amber-300">729401</strong>) or await General Secretary roster confirmation.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      AIT IT Department integration: Microsoft 365 Azure AD SSO (Tenant: <code className="text-sky-300">aitpune.edu.in</code>). Official site: <a href="https://www.aitpune.com/" target="_blank" rel="noreferrer" className="underline text-amber-400">aitpune.com</a>.
                    </p>
                  </div>
                </div>
              </div>

              {otpError && (
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {otpError}
                </div>
              )}
              {otpSuccess && (
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                  {otpSuccess}
                </div>
              )}

              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.trim())}
                  placeholder="Enter 6-digit code (e.g. 729401)"
                  className="px-3.5 py-1.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs font-mono tracking-widest placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  disabled={isVerifyingOtp}
                  onClick={() => {
                    setOtpError('');
                    setOtpSuccess('');
                    if (!otpInput) {
                      setOtpError('Please enter the 6-digit verification code.');
                      return;
                    }
                    setIsVerifyingOtp(true);
                    setTimeout(() => {
                      const res = verifyStudentOtp(currentUser.id, otpInput);
                      setIsVerifyingOtp(false);
                      if (res.success) {
                        setOtpSuccess('AIT Student Identity officially verified! You now have full platform access.');
                        setOtpInput('');
                      } else {
                        setOtpError(res.error || 'Invalid code. Try 729401 for testing.');
                      }
                    }, 500);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
                >
                  {isVerifyingOtp ? 'Verifying...' : 'Submit OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const res = requestVerificationOtp(currentUser.id);
                    if (res.message) setOtpSuccess(res.message);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0c101d] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors shrink-0"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              1. HERO BANNER (Header Welcome Section)
              ═══════════════════════════════════════════ */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0c101d] border border-[#1a2236] min-h-[220px] flex items-center">
            {/* Background 3D/Tech Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80')",
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
                A platform to recognise talent, explore ideas and build stronger technical teams through competitions.
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
              PROMINENT ANNOUNCEMENTS & NOTICES SECTION
              Placed directly below header/welcome section (Requirement 6, 7, 8)
              ═══════════════════════════════════════════ */}
          <section className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <ScrollText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                    Announcements & Notices
                    {publishedNotices.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {publishedNotices.length} Active
                      </span>
                    )}
                  </h2>
                </div>
              </div>

              <Link
                href="/notices"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                View All Notices
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {publishedNotices.length === 0 ? (
              <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-8 text-center space-y-2">
                <ScrollText className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No announcements available right now.</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Official directives from the General Secretary and club updates will be posted here as they are published.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {publishedNotices.slice(0, 3).map((notice) => {
                  const isGeneralSecretaryNotice = notice.authorDesignation === 'GENERAL_SECRETARY';
                  const isPriority = notice.isPriorityNotice || notice.priority === 'HIGH' || notice.priority === 'URGENT';

                  return (
                    <article
                      key={notice.id}
                      className={`rounded-2xl p-4 sm:p-5 transition-all space-y-3 relative overflow-hidden ${
                        isGeneralSecretaryNotice
                          ? 'bg-gradient-to-r from-indigo-950/30 via-[#111728] to-purple-950/20 border border-indigo-500/40 shadow-lg shadow-indigo-950/20'
                          : 'bg-[#111728] border border-[#1e293b] hover:border-slate-700'
                      }`}
                    >
                      {/* Top Header Row with Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isGeneralSecretaryNotice && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wide">
                              <Shield className="w-3 h-3 text-rose-400" />
                              GENERAL SECRETARY
                            </span>
                          )}

                          {isGeneralSecretaryNotice && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                              Institution-Wide Announcement
                            </span>
                          )}

                          {!isGeneralSecretaryNotice && notice.clubName && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0c101d] text-purple-300 border border-[#1e293b]">
                              {notice.clubName}
                            </span>
                          )}

                          {isPriority && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <Pin className="w-2.5 h-2.5" /> High Priority
                            </span>
                          )}
                        </div>

                        {/* Timestamp */}
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(notice.publishedAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Notice Title & Summary */}
                      <div>
                        <h3
                          onClick={() => setSelectedNotice(notice)}
                          className="font-bold text-sm sm:text-base text-white hover:text-indigo-300 cursor-pointer transition-colors leading-snug"
                        >
                          {notice.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                          {notice.content}
                        </p>
                      </div>

                      {/* Publisher Details & Attachment */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1e293b]/70 text-[11px]">
                        <div className="flex items-center gap-2 text-slate-400">
                          <span>
                            Published by:{' '}
                            <strong className="text-white font-semibold">
                              {isGeneralSecretaryNotice ? 'Nishant Singh' : notice.authorName}
                            </strong>
                          </span>
                          <span>•</span>
                          <span className="text-slate-400 font-medium">
                            {notice.authorDesignation.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {notice.attachmentName && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-mono">
                              <Paperclip className="w-3 h-3 text-sky-400" />
                              {notice.attachmentName}
                            </span>
                          )}

                          <button
                            onClick={() => setSelectedNotice(notice)}
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                          >
                            Read Full Notice <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* WhatsApp-Style Emoji Reaction Controls (Requirement 8) */}
                      <div className="pt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mr-1">
                          React:
                        </span>
                        {EMOJI_REACTIONS.map((opt) => {
                          const count = getReactionCount(notice.id, opt.type);
                          const isSelected = hasUserReacted(notice.id, opt.type);

                          return (
                            <button
                              key={opt.type}
                              type="button"
                              onClick={() => toggleNoticeReaction(notice.id, opt.type)}
                              title={`${opt.label} (${count})`}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                                isSelected
                                  ? 'bg-indigo-600/30 text-white border-indigo-400 scale-105 shadow-md shadow-indigo-950/40'
                                  : 'bg-[#0c101d] text-slate-300 border-[#1e293b] hover:border-slate-600 hover:bg-[#151b2e]'
                              }`}
                            >
                              <span className="text-sm">{opt.emoji}</span>
                              <span className={`text-[11px] ${isSelected ? 'font-bold text-indigo-300' : 'text-slate-400'}`}>
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* ═══════════════════════════════════════════
              2. CURRENT COMPETITION & PODIUM HOLDERS (Side-by-side)
              Dynamic and clean without fake content (Requirement 3, 11, 12)
              ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* Current Competition Card (lg:col-span-5) */}
            <div className="lg:col-span-5 rounded-2xl bg-[#111728] border border-[#1e293b] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">Current Competition</h2>
                  {featuredCompetition && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#064e3b]/50 text-[#34d399] border border-[#059669]/30">
                      {featuredCompetition.status}
                    </span>
                  )}
                </div>

                {!featuredCompetition ? (
                  <div className="py-10 text-center space-y-2">
                    <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">No competitions have been published yet.</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Events will appear here once authorized by an assigned Club Secretary.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start gap-3.5">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700/50">
                        <img
                          src={featuredCompetition.bannerUrl}
                          alt={featuredCompetition.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base text-white truncate">
                          {featuredCompetition.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                          {featuredCompetition.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>
                            {new Date(featuredCompetition.startDate).toLocaleDateString()} –{' '}
                            {new Date(featuredCompetition.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0c101d] border border-[#1e293b] text-[11px] text-slate-300">
                        {featuredCompetition.category}
                      </span>
                      {featuredCompetition.clubName && (
                        <span className="px-2.5 py-1 rounded-lg bg-[#0c101d] border border-[#1e293b] text-[11px] text-indigo-300">
                          {featuredCompetition.clubName}
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-lg bg-[#0c101d] border border-[#1e293b] text-[11px] text-amber-300">
                        Pool: {featuredCompetition.prizePool}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mt-5">
                      <Link
                        href={`/competitions/${featuredCompetition.slug}`}
                        className="px-4 py-2 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/competitions/${featuredCompetition.slug}`}
                        className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        Participate
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
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

              {verifiedResults.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    {hasPendingVerification ? <Clock className="w-6 h-6 animate-pulse" /> : <Trophy className="w-6 h-6" />}
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {hasPendingVerification ? 'Results are awaiting verification.' : 'No winners have been officially announced yet.'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {hasPendingVerification
                      ? 'Judging scores have been submitted and are in the verification queue.'
                      : 'Podium positions will be revealed strictly upon formal completion of judging and official verification.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 items-end pt-2">
                  {/* 2nd Place */}
                  {verifiedResults.find((r) => r.rankPosition === 2) ? (
                    (() => {
                      const silver = verifiedResults.find((r) => r.rankPosition === 2)!;
                      return (
                        <div className="rounded-xl border border-slate-700/60 bg-[#0c101d] p-3 flex flex-col items-center text-center">
                          <Crown className="w-3.5 h-3.5 text-slate-400 mb-1" />
                          <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-bold text-xs flex items-center justify-center mb-1.5">
                            2
                          </div>
                          <p className="text-xs font-bold text-white truncate w-full">{silver.teamName}</p>
                          <p className="text-[10px] text-slate-500 mb-2 truncate w-full">{silver.competitionTitle}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{silver.projectTitle || 'Project Innovation'}</p>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="rounded-xl border border-slate-800 bg-[#0c101d] p-3 text-center text-[10px] text-slate-500">
                      Silver Medalist Pending
                    </div>
                  )}

                  {/* 1st Place (Gold, taller, glowing) */}
                  {verifiedResults.find((r) => r.rankPosition === 1) ? (
                    (() => {
                      const gold = verifiedResults.find((r) => r.rankPosition === 1)!;
                      return (
                        <div className="rounded-xl border border-amber-400/80 bg-gradient-to-b from-[#251f0c] to-[#121008] p-3 flex flex-col items-center text-center shadow-lg shadow-amber-950/20 -mt-2">
                          <Crown className="w-4 h-4 text-amber-400 mb-1" />
                          <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center mb-1.5 shadow-sm">
                            1
                          </div>
                          <p className="text-xs font-bold text-white truncate w-full">{gold.teamName}</p>
                          <p className="text-[10px] text-amber-300/80 mb-2 font-medium truncate w-full">{gold.competitionTitle}</p>
                          <p className="text-[10px] text-amber-200/70 line-clamp-1">{gold.projectTitle || 'Champion Innovation'}</p>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="rounded-xl border border-slate-800 bg-[#0c101d] p-3 text-center text-[10px] text-slate-500 -mt-2">
                      Gold Champion Pending
                    </div>
                  )}

                  {/* 3rd Place */}
                  {verifiedResults.find((r) => r.rankPosition === 3) ? (
                    (() => {
                      const bronze = verifiedResults.find((r) => r.rankPosition === 3)!;
                      return (
                        <div className="rounded-xl border border-amber-700/50 bg-[#0c101d] p-3 flex flex-col items-center text-center">
                          <Crown className="w-3.5 h-3.5 text-amber-600 mb-1" />
                          <div className="w-7 h-7 rounded-full bg-[#b45309] text-white font-bold text-xs flex items-center justify-center mb-1.5">
                            3
                          </div>
                          <p className="text-xs font-bold text-white truncate w-full">{bronze.teamName}</p>
                          <p className="text-[10px] text-slate-500 mb-2 truncate w-full">{bronze.competitionTitle}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{bronze.projectTitle || 'Project Innovation'}</p>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="rounded-xl border border-slate-800 bg-[#0c101d] p-3 text-center text-[10px] text-slate-500">
                      Bronze Medalist Pending
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* ═══════════════════════════════════════════
              3. PARTICIPATED TEAMS
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

            {participatingTeams.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No teams registered yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {participatingTeams.map((team, idx) => {
                  const LogoComponent = TEAM_LOGOS[idx] || PixelForgeLogo;
                  return (
                    <Link
                      key={team.id}
                      href="/teams"
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
            )}
          </div>

          {/* ═══════════════════════════════════════════
              4. FEATURED PROJECTS
              ═══════════════════════════════════════════ */}
          <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">Featured Projects</h2>
              <Link
                href="/projects"
                className="text-xs text-[#818cf8] hover:text-[#a5b4fc] flex items-center gap-1 font-medium transition-colors"
              >
                Explore Projects
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {featuredProjects.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No projects have been published yet.</p>
            ) : (
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
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {proj.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 mt-3">
                        <span className="text-[10px] text-slate-500 truncate">
                          By <strong className="text-slate-300 font-medium">{proj.teamName || 'Independent'}</strong>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ─── RIGHT SIDEBAR PANEL ─── */}
        <div className="w-full xl:w-[300px] shrink-0 space-y-4">

          {/* Card 1: Upcoming Competitions */}
          <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold text-white">Upcoming Competitions</h3>
              <Link href="/competitions" className="text-[11px] text-[#818cf8] hover:text-[#a5b4fc] font-medium">
                View All
              </Link>
            </div>

            {upcomingCompetitions.length === 0 ? (
              <p className="text-[11px] text-slate-500 py-4 text-center">No upcoming competitions scheduled.</p>
            ) : (
              <div className="space-y-3">
                {upcomingCompetitions.map((comp) => (
                  <div key={comp.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0c101d] border border-[#1e293b]">
                    <div className="w-8 h-8 rounded-lg bg-[#111728] border border-slate-700/60 flex items-center justify-center shrink-0 text-[#38bdf8]">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{comp.title}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <Calendar className="w-2.5 h-2.5 text-slate-500" />
                        <span>{new Date(comp.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link
                      href={`/competitions/${comp.slug}`}
                      className="px-2 py-1 rounded-md bg-[#2563eb] text-white text-[10px] font-semibold shrink-0 hover:bg-[#1d4ed8] transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Spotlight Project */}
          {spotlightProject && (
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white">Spotlight Project</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  Featured
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
                  {spotlightProject.teamName} &nbsp;•&nbsp; {spotlightProject.competitionTitle || 'Campus Hackathon'}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {spotlightProject.shortDescription}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]/60">
                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    {spotlightProject.likesCount}
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

          {/* Card 3: Quick Notice Feed */}
          <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-4">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold text-white">Announcements</h3>
              <Link href="/notices" className="text-[11px] text-[#818cf8] hover:text-[#a5b4fc] font-medium">
                View All
              </Link>
            </div>

            {publishedNotices.length === 0 ? (
              <p className="text-[11px] text-slate-500 py-3 text-center">No announcements available right now.</p>
            ) : (
              <div className="space-y-3">
                {publishedNotices.slice(0, 3).map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => setSelectedNotice(ann)}
                    className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-800/30 p-1.5 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#0c101d] border border-[#1e293b] flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {ann.authorDesignation === 'GENERAL_SECRETARY' ? '🏛️' : '📢'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-200 leading-snug line-clamp-1 hover:text-indigo-300">
                        {ann.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(ann.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Complete Notice Modal (Requirement 6, 7, 8) */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0c101d] border border-[#1e293b] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1e293b]">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedNotice.authorDesignation === 'GENERAL_SECRETARY' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                      <Shield className="w-3 h-3 text-rose-400" /> GENERAL SECRETARY
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                      {selectedNotice.authorDesignation.replace('_', ' ')}
                    </span>
                  )}

                  {selectedNotice.clubName && (
                    <span className="text-[10px] font-semibold text-slate-400">
                      {selectedNotice.clubName}
                    </span>
                  )}

                  {selectedNotice.isPriorityNotice && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Priority
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {selectedNotice.title}
                </h2>

                <p className="text-xs text-slate-400">
                  Published by <strong className="text-white">{selectedNotice.authorDesignation === 'GENERAL_SECRETARY' ? 'Nishant Singh' : selectedNotice.authorName}</strong> on {new Date(selectedNotice.publishedAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedNotice(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-2 text-sm text-slate-200 leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-line space-y-3">
              <p>{selectedNotice.content}</p>

              {selectedNotice.attachmentName && (
                <div className="mt-4 p-3 rounded-xl bg-[#111728] border border-[#1e293b] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-sky-400" />
                    <div>
                      <p className="text-xs font-bold text-white">{selectedNotice.attachmentName}</p>
                      <p className="text-[10px] text-slate-500">Official Institutional Attachment</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-indigo-400 font-semibold">Available</span>
                </div>
              )}
            </div>

            {/* Emoji Reactions inside Modal */}
            <div className="pt-4 border-t border-[#1e293b] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {EMOJI_REACTIONS.map((opt) => {
                  const count = getReactionCount(selectedNotice.id, opt.type);
                  const isSelected = hasUserReacted(selectedNotice.id, opt.type);

                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => toggleNoticeReaction(selectedNotice.id, opt.type)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 text-white border-indigo-400 scale-105'
                          : 'bg-[#111728] text-slate-300 border-[#1e293b] hover:bg-[#182035]'
                      }`}
                    >
                      <span>{opt.emoji}</span>
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setSelectedNotice(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

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
