'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { useAppStore } from '@/lib/store';
import {
  Trophy,
  Search,
  Calendar,
  MapPin,
} from 'lucide-react';

export default function CompetitionsPage() {
  const { competitions } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const categories = ['ALL', 'Hackathon', 'Coding Challenge', 'Robotics', 'AI / ML'];
  const statuses = ['ALL', 'ONGOING', 'PUBLISHED', 'COMPLETED'];

  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch =
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase());
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
              <span>AIT Pune Technical Events</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Explore Competitions {'&'} Hackathons
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Discover flagship college hackathons, robotics challenges, and coding sprints.
            </p>
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
                placeholder="Search by name, theme, or technology..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 md:col-span-2">
              <span className="text-xs text-slate-500 mr-1 shrink-0">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
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
            <div className="col-span-3 text-center py-16 text-slate-500 text-sm">
              No competitions match your filters.
            </div>
          )}
          {filteredCompetitions.map((comp) => (
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

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#080B14]/80 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                  {comp.category}
                </div>

                <div
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    comp.status === 'ONGOING'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : comp.status === 'COMPLETED'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {comp.status}
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {comp.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {comp.description}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-400 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {new Date(comp.startDate).toLocaleDateString()} -{' '}
                      {new Date(comp.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{comp.venueDetails}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">Prize Pool:</span>
                    <span className="font-semibold text-amber-400">{comp.prizePool}</span>
                  </div>
                </div>

                <Link
                  href={`/competitions/${comp.slug}`}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-800 hover:bg-purple-600 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  View Schedule, Rules {'&'} Teams
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardShell>
  );
}
