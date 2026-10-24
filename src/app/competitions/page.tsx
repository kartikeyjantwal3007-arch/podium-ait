'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { useAppStore } from '@/lib/store';
import {
  Trophy,
  Search,
  Calendar,
  MapPin,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Tag,
} from 'lucide-react';

export default function CompetitionsPage() {
  const { currentUser, competitions, applications } = useAppStore();

  const [clientNow, setClientNow] = useState<number | null>(null);
  useEffect(() => {
    setClientNow(Date.now());
  }, []);

  const [activeTypeTab, setActiveTypeTab] = useState<'ALL' | 'COMPETITIONS' | 'HACKATHONS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const categories = ['ALL', 'DESIGN', 'HACKATHON', 'CODING', 'ROBOTICS', 'AI_ML'];
  const statuses = ['ALL', 'ONGOING', 'PUBLISHED', 'COMPLETED'];

  // Only organizers see drafts; ordinary students see only published/ongoing/completed
  const isOrganizer = currentUser.role === 'CLUB_SECRETARY' || currentUser.role === 'GENERAL_SECRETARY';

  const visibleCompetitions = competitions.filter((comp) => {
    if (comp.status === 'DRAFT' && !isOrganizer) {
      return false;
    }
    return true;
  });

  const filteredCompetitions = visibleCompetitions.filter((comp) => {
    // Type tab filter
    if (activeTypeTab === 'HACKATHONS') {
      const isHack = comp.eventType === 'HACKATHON' || comp.category === ('HACKATHON' as any);
      if (!isHack) return false;
    } else if (activeTypeTab === 'COMPETITIONS') {
      const isComp = comp.eventType === 'COMPETITION' || comp.category !== ('HACKATHON' as any);
      if (!isComp) return false;
    }

    const matchesSearch =
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.clubName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || comp.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || comp.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Trophy className="w-4 h-4" />
              <span>AIT Pune Technical Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Competitions & Hackathons
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Official collegiate events organized by registered student clubs and authorized by General Secretary.
            </p>
          </div>

          {/* Section Tabs (Competitions vs Hackathons) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0D1220] border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTypeTab('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTypeTab === 'ALL'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTypeTab('COMPETITIONS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTypeTab === 'COMPETITIONS'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Competitions
            </button>
            <button
              onClick={() => setActiveTypeTab('HACKATHONS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTypeTab === 'HACKATHONS'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hackathons
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* Search input */}
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, club, or tags..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 md:col-span-2">
              <span className="text-xs text-slate-500 mr-1 shrink-0">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Status filters */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-500">Status:</span>
            {statuses.map((stat) => (
              <button
                key={stat}
                onClick={() => setSelectedStatus(stat)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  selectedStatus === stat
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {stat === 'ALL' ? 'All' : stat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.length === 0 && (
            <div className="col-span-3 text-center py-20 px-4 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-3">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {activeTypeTab === 'HACKATHONS'
                  ? 'No hackathons have been published yet.'
                  : 'No competitions have been published yet.'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Club Secretaries can publish new competitions and hackathons from their authorized organizer dashboard.
              </p>
            </div>
          )}

          {filteredCompetitions.map((comp) => {
            const isRegOpen =
              comp.isRegistrationPublished !== false &&
              comp.status !== 'DRAFT' &&
              comp.status !== 'COMPLETED' &&
              (!comp.registrationCloseDate || (clientNow ? new Date(comp.registrationCloseDate).getTime() >= clientNow : true));

            const myApp = applications.find(
              (a) => a.competitionId === comp.id && a.applicantId === currentUser.id && a.status !== 'WITHDRAWN'
            );

            return (
              <div
                key={comp.id}
                className="group rounded-2xl bg-[#121A2B] border border-slate-800 hover:border-purple-500/40 transition-all overflow-hidden flex flex-col shadow-lg"
              >
                {/* Banner */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                  <img
                    src={comp.bannerUrl}
                    alt={comp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121A2B] via-transparent to-black/30" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#080B14]/85 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                      {comp.eventType || 'COMPETITION'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#080B14]/80 text-slate-300 border border-slate-700">
                      {comp.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {comp.status === 'DRAFT' ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Draft (Private)
                      </span>
                    ) : isRegOpen ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Registration Open
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-500/20 text-slate-300 border border-slate-500/30">
                        Registration Closed
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Organizing Club */}
                    <div className="flex items-center justify-between text-[11px] text-purple-400 font-semibold">
                      <span>Organized by: {comp.clubName}</span>
                      <span className="text-slate-400">
                        {comp.participationType === 'INDIVIDUAL' ? 'Solo' : `Team (max ${comp.maxTeamSize})`}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>

                  {/* Dates & Deadlines */}
                  <div className="space-y-2 text-xs text-slate-400 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        Event Date:
                      </span>
                      <span className="text-slate-300 font-medium">
                        {new Date(comp.startDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Reg Deadline:
                      </span>
                      <span className="text-slate-300 font-medium">
                        {comp.registrationCloseDate ? new Date(comp.registrationCloseDate).toLocaleDateString() : 'Rolling'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Prize Pool:</span>
                      <span className="font-semibold text-amber-400">{comp.prizePool || 'Certificates & Trophies'}</span>
                    </div>

                    {/* Official External Link if provided */}
                    {comp.officialUrl && (
                      <div className="pt-1">
                        <a
                          href={comp.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Official Event Portal</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-2">
                    {myApp ? (
                      <div className="w-full text-center py-2 px-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Applied (Status: <strong>{myApp.status}</strong>)</span>
                      </div>
                    ) : isRegOpen ? (
                      <Link
                        href={`/competitions/${comp.slug}`}
                        className="w-full text-center py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors shadow-lg shadow-purple-600/20 flex items-center justify-center gap-1.5"
                      >
                        <span>Register / Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <div className="w-full text-center py-2 rounded-xl bg-slate-800/60 border border-slate-800 text-slate-400 text-xs">
                        Registration Closed
                      </div>
                    )}

                    <Link
                      href={`/competitions/${comp.slug}`}
                      className="block w-full text-center py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      View Details & Rules
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </DashboardShell>
  );
}
