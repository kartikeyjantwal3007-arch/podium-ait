'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { Competition, CompetitionCategory, CompetitionStatus } from '@/lib/types';
import { 
  CalendarPlus, 
  Trophy, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Medal, 
  FileCheck2, 
  Lock,
  Sparkles
} from 'lucide-react';

export default function OrganiserPortalPage() {
  const { 
    currentUser, 
    competitions, 
    teams, 
    projects, 
    createCompetition, 
    updateCompetitionStatus,
    submitOfficialResult 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'COMPETITIONS' | 'RESULTS'>('COMPETITIONS');

  // Create Competition Form
  const [showCreateCompModal, setShowCreateCompModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CompetitionCategory>('Hackathon');
  const [venueType, setVenueType] = useState<'ON_CAMPUS' | 'VIRTUAL' | 'HYBRID'>('ON_CAMPUS');
  const [venueDetails, setVenueDetails] = useState('Ramanujan Computing Hall, AIT Pune');
  const [startDate, setStartDate] = useState('2026-11-20T09:00');
  const [endDate, setEndDate] = useState('2026-11-22T18:00');
  const [prizePool, setPrizePool] = useState('₹1,50,000 INR');
  const [rules, setRules] = useState('Strict original code requirement. 36-hour sprint.');
  const [eligibility, setEligibility] = useState('All AIT Pune engineering batches.');

  // Result submission state
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedCompId, setSelectedCompId] = useState(competitions[0]?.id || '');
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [awardTitle, setAwardTitle] = useState('1st Place Champions');
  const [rankPosition, setRankPosition] = useState<1 | 2 | 3>(1);

  const isAuthorized = currentUser.role === 'COMPETITION_ORGANISER' || currentUser.role === 'ADMINISTRATOR';

  const handleCreateCompSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createCompetition({
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      category,
      status: 'PUBLISHED',
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      venueType,
      venueDetails,
      createdBy: currentUser.id,
      rules,
      eligibility,
      bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
      prizePool,
      maxTeamSize: 4,
      minTeamSize: 2
    });

    setTitle('');
    setDescription('');
    setShowCreateCompModal(false);
    alert('New competition created & published successfully!');
  };

  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = competitions.find(c => c.id === selectedCompId);
    const team = teams.find(t => t.id === selectedTeamId);

    if (!comp || !team) return;

    submitOfficialResult({
      competitionId: comp.id,
      competitionTitle: comp.title,
      teamId: team.id,
      teamName: team.name,
      awardTitle,
      rankPosition,
      isVerified: true,
      verifiedBy: currentUser.fullName,
      verifiedAt: new Date().toISOString(),
      members: team.members.map(m => ({
        studentId: m.studentId,
        name: m.fullName,
        aitRollNo: m.aitRollNo
      }))
    });

    setShowResultModal(false);
    alert(`Official podium result recorded for ${team.name}! Draft certificates queued for Principal's approval.`);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080B14]">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="max-w-md w-full p-8 rounded-3xl bg-[#0D1220] border border-sky-500/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Competition Organiser Access Only</h2>
              <p className="text-xs text-slate-300">
                Switch to <strong className="text-sky-300">Prof. Rajesh Verma (Organiser)</strong> in the top navigation role switcher to access this desk.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-sky-950/40 via-[#121A2B] to-[#0D1220] border border-sky-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Organiser Control Desk
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span className="text-xs text-slate-400">{currentUser.fullName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Competition & Official Result Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Configure competition rules, register participants, and officially record verified podium rankings that feed the Principal&apos;s signing queue.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowCreateCompModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>New Competition</span>
              </button>

              <button
                onClick={() => setShowResultModal(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Medal className="w-4 h-4" />
                <span>Record Podium Result</span>
              </button>
            </div>
          </div>

          {/* Competitions Management Table */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Active Competitions Schedule</h2>

            <div className="rounded-2xl bg-[#0D1220] border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121A2B] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Timeline</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {competitions.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-white">{c.title}</td>
                        <td className="p-4 text-purple-300">{c.category}</td>
                        <td className="p-4 text-slate-400 font-mono text-[11px]">
                          {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            c.status === 'ONGOING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : c.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select
                            value={c.status}
                            onChange={(e) => updateCompetitionStatus(c.id, e.target.value as CompetitionStatus)}
                            className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-200"
                          >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ONGOING">Ongoing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Create Competition Modal */}
      {showCreateCompModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D1220] border border-slate-700 p-6 rounded-2xl max-w-xl w-full space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white">Create New Competition</h3>
            
            <form onSubmit={handleCreateCompSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CodePulse 2026 Sprint"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CompetitionCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Coding Challenge">Coding Challenge</option>
                    <option value="Robotics">Robotics</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Design Sprint">Design Sprint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={prizePool}
                    onChange={(e) => setPrizePool(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateCompModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  Create & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D1220] border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Record Verified Podium Result</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Commits official ranking and triggers draft certificates for all team members to enter the Principal&apos;s signing queue.
            </p>

            <form onSubmit={handleResultSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Competition</label>
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  {competitions.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Winning Team</label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.members.length} members)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rank Position</label>
                  <select
                    value={rankPosition}
                    onChange={(e) => setRankPosition(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value={1}>1st Place</option>
                    <option value={2}>2nd Place</option>
                    <option value={3}>3rd Place</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Award Title</label>
                  <input
                    type="text"
                    value={awardTitle}
                    onChange={(e) => setAwardTitle(e.target.value)}
                    placeholder="e.g. 1st Place Champions"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold"
                >
                  Verify & Generate Draft Certificates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
