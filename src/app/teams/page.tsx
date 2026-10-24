'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { 
  Users, 
  Plus, 
  Search, 
  Trophy, 
  FolderGit2, 
  ShieldCheck, 
  UserPlus, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function TeamsPage() {
  const { teams, currentUser, createTeam, joinTeam } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    createTeam(newTeamName.trim(), newTeamDescription.trim());
    setNewTeamName('');
    setNewTeamDescription('');
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Users className="w-4 h-4" />
                <span>Fluid Student Alliances</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Teams & Competition Collectives
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                A student&apos;s identity remains permanent, while team membership adapts dynamically per hackathon or challenge.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Team</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams by name or specialty..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => {
              const isCurrentUserMember = team.members.some(m => m.studentId === currentUser.id);

              return (
                <div
                  key={team.id}
                  className="rounded-2xl bg-[#121A2B] border border-slate-800 hover:border-purple-500/40 p-6 flex flex-col justify-between space-y-5 transition-all shadow-lg group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center">
                        {team.logoUrl ? (
                          <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-sm text-purple-400">{team.name.substring(0, 2).toUpperCase()}</span>
                        )}
                      </div>

                      {isCurrentUserMember && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          Your Team
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {team.description}
                      </p>
                    </div>

                    {/* Member Rosters */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                        Active Members ({team.members.length}):
                      </span>
                      <div className="space-y-1.5">
                        {team.members.map((m) => (
                          <div key={m.studentId} className="flex items-center justify-between text-xs text-slate-300">
                            <span className="font-medium text-slate-200">{m.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {m.roleInTeam} • {m.aitRollNo}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      href={`/teams/${team.id}`}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                    >
                      <span>Full Team Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {!isCurrentUserMember && (
                      <button
                        onClick={() => joinTeam(team.id, currentUser.id, 'Developer')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3 text-sky-400" />
                        <span>Join</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D1220] border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Create New Competition Team</h3>
            <p className="text-xs text-slate-400">
              Form a collaborative roster for an upcoming competition. As creator, you will be assigned as Team Leader.
            </p>

            <form onSubmit={handleCreateTeam} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Team QuantumEdge"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technical Focus / Bio</label>
                <textarea
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="Focus areas: AI, Robotics, Embedded systems, Web3..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  Form Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
