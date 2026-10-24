'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { useAppStore } from '@/lib/store';
import {
  Shield,
  Building,
  Trophy,
  Users,
  Award,
  ScrollText,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Send,
  Trash2,
  Eye,
  FileCheck2,
  Clock,
  Pin,
} from 'lucide-react';

export default function GeneralSecretaryPage() {
  const {
    currentUser,
    clubs,
    competitions,
    teams,
    projects,
    results,
    certificates,
    notices,
    appointments,
    allProfiles,
    publishNotice,
    appointClubSecretary,
    revokeAppointment,
    verifyPodiumResults,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ALL_CLUBS' | 'RESULTS_APPROVAL' | 'PRIORITY_NOTICE' | 'APPOINT_CLUB_SEC'>('OVERVIEW');

  // Priority Notice Form
  const [priorityTitle, setPriorityTitle] = useState('');
  const [priorityContent, setPriorityContent] = useState('');
  const [priorityExpiry, setPriorityExpiry] = useState('');
  const [priorityAttachment, setPriorityAttachment] = useState('');
  const [priorityError, setPriorityError] = useState('');
  const [prioritySuccess, setPrioritySuccess] = useState('');

  // Appoint Club Secretary Form
  const [targetStudentId, setTargetStudentId] = useState(allProfiles[2]?.id || '');
  const [targetClubId, setTargetClubId] = useState(clubs[0]?.id || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2027-06-30');
  const [appointError, setAppointError] = useState('');
  const [appointSuccess, setAppointSuccess] = useState('');

  const completedHackathons = competitions.filter((c) => c.status === 'COMPLETED' || c.status === 'ONGOING');
  const pendingResults = results.filter((r) => !r.isVerified);
  const issuedCerts = certificates.filter((c) => c.status === 'ISSUED');
  const pendingCerts = certificates.filter((c) => c.status !== 'ISSUED');

  const handleBroadcastPriorityNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setPriorityError('');
    setPrioritySuccess('');

    if (!priorityTitle.trim() || !priorityContent.trim()) {
      setPriorityError('Please fill in both title and notice content.');
      return;
    }

    const res = publishNotice({
      title: priorityTitle.trim(),
      content: priorityContent.trim(),
      category: 'URGENT',
      priority: 'HIGH',
      isPriorityNotice: true,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorDesignation: 'GENERAL_SECRETARY',
      expiryDate: priorityExpiry || undefined,
      attachmentName: priorityAttachment.trim() || undefined,
      status: 'PUBLISHED',
    });

    if (res.success) {
      setPrioritySuccess('Institution-wide Priority Notice broadcasted to all students & dashboards!');
      setPriorityTitle('');
      setPriorityContent('');
      setPriorityAttachment('');
      setPriorityExpiry('');
    } else {
      setPriorityError(res.error || 'Failed to publish priority notice.');
    }
  };

  const handleAppointClubSecretary = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointError('');
    setAppointSuccess('');

    const res = appointClubSecretary({
      targetStudentId,
      clubId: targetClubId,
      startDate,
      endDate,
    });

    if (res.success) {
      setAppointSuccess('Club Secretary appointment officially ratified and recorded.');
    } else {
      setAppointError(res.error || 'Failed to appoint Club Secretary.');
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* ── Gen-Sec Supervisory Header ── */}
        <div className="p-6 rounded-3xl bg-[#0c101d] border border-[#1a2236] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/30 shrink-0">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">General Secretary Supervisory Console</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Apex Student Body
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Supervisory jurisdiction across all technical clubs, hackathon governance, Club Secretary appointments, and institutional priority notices.
                </p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                  <span>General Secretary: <strong className="text-white">{currentUser.fullName}</strong></span>
                  <span>•</span>
                  <span>Supervised Clubs: <strong className="text-white">{clubs.length}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('PRIORITY_NOTICE')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-rose-900/30"
            >
              <Pin className="w-3.5 h-3.5" />
              Broadcast Priority Notice
            </button>
          </div>
        </div>

        {/* ── Key Supervisory Metrics ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Clubs</p>
            <p className="text-xl font-black text-white mt-1">{clubs.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Hackathons</p>
            <p className="text-xl font-black text-indigo-400 mt-1">{competitions.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Registered Teams</p>
            <p className="text-xl font-black text-sky-400 mt-1">{teams.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Students</p>
            <p className="text-xl font-black text-purple-400 mt-1">{allProfiles.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Pending Results</p>
            <p className="text-xl font-black text-amber-400 mt-1">{pendingResults.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Issued Certs</p>
            <p className="text-xl font-black text-emerald-400 mt-1">{issuedCerts.length}</p>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: 'Supervisory Overview' },
            { id: 'ALL_CLUBS', label: 'All Technical Clubs' },
            { id: 'RESULTS_APPROVAL', label: 'Verify Podium Results' },
            { id: 'PRIORITY_NOTICE', label: 'Priority Notice Board' },
            { id: 'APPOINT_CLUB_SEC', label: 'Appoint Club Secretaries' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Recent Institutional Results */}
            <div className="lg:col-span-2 rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Latest Declared Hackathon Podiums
              </h3>

              <div className="divide-y divide-[#1e293b]">
                {results.map((res) => (
                  <div key={res.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{res.teamName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                          {res.awardTitle}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {res.competitionTitle} • {res.members.length} team members
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {res.isVerified ? (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => verifyPodiumResults(res.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px]"
                        >
                          Verify Result
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Leadership Records */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">Active Club Secretary Appointments</h3>
              <div className="space-y-3">
                {clubs.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-[#0c101d] border border-[#1e293b] space-y-1">
                    <p className="text-xs font-bold text-white">{c.name}</p>
                    <p className="text-[11px] text-indigo-300">Secretary: {c.clubSecretaryName || 'Unassigned'}</p>
                    <span className="text-[9px] text-slate-500">Hackathons: {c.totalHackathons}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ALL CLUBS ── */}
        {activeTab === 'ALL_CLUBS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubs.map((club) => (
              <div key={club.id} className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                      {club.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5">{club.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{club.description}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400">
                  <span>Lead: <strong className="text-white">{club.clubSecretaryName || 'Pending Appointment'}</strong></span>
                  <span>Hackathons: <strong className="text-white">{club.totalHackathons}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 3: RESULTS APPROVAL ── */}
        {activeTab === 'RESULTS_APPROVAL' && (
          <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Competition Results Verification</h3>
              <p className="text-xs text-slate-400">
                General Secretary review ensures no duplicate podium entries before routing certificates to Director for signing.
              </p>
            </div>

            <div className="divide-y divide-[#1e293b]">
              {results.map((r) => (
                <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{r.teamName}</span>
                      <span className="text-xs font-semibold text-amber-400">({r.awardTitle})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Event: {r.competitionTitle}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Team Members: {r.members.map((m) => `${m.name} (${m.aitRollNo})`).join(', ')}
                    </p>
                  </div>

                  <div>
                    {r.isVerified ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified by GS
                      </span>
                    ) : (
                      <button
                        onClick={() => verifyPodiumResults(r.id)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                      >
                        Approve & Verify Podium
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: PRIORITY NOTICE BROADCASTER ── */}
        {activeTab === 'PRIORITY_NOTICE' && (
          <div className="max-w-xl rounded-2xl bg-[#111728] border border-rose-500/40 p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Pin className="w-5 h-5 text-rose-400" />
                Broadcast Priority Platform Notice
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Priority notices appear prominently above regular notices on all student and authority dashboards.
              </p>
            </div>

            {priorityError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {priorityError}
              </div>
            )}
            {prioritySuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                {prioritySuccess}
              </div>
            )}

            <form onSubmit={handleBroadcastPriorityNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Directive Title</label>
                <input
                  type="text"
                  value={priorityTitle}
                  onChange={(e) => setPriorityTitle(e.target.value)}
                  placeholder="e.g. SIH 2026 Internal Evaluation Schedule & Guidelines"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Directive Details</label>
                <textarea
                  rows={4}
                  value={priorityContent}
                  onChange={(e) => setPriorityContent(e.target.value)}
                  placeholder="Official guidelines, requirements, and compliance instructions for students..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={priorityExpiry}
                    onChange={(e) => setPriorityExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Attachment Name</label>
                  <input
                    type="text"
                    value={priorityAttachment}
                    onChange={(e) => setPriorityAttachment(e.target.value)}
                    placeholder="e.g. SIH_Guidelines.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-lg shadow-rose-900/30"
              >
                Broadcast Priority Notice
              </button>
            </form>
          </div>
        )}

        {/* ── TAB 5: APPOINT CLUB SECRETARIES ── */}
        {activeTab === 'APPOINT_CLUB_SEC' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  Appoint Club Secretary
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  General Secretary prerogative to appoint 3rd-year technical heads as Club Secretaries.
                </p>
              </div>

              {appointError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {appointError}
                </div>
              )}
              {appointSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                  {appointSuccess}
                </div>
              )}

              <form onSubmit={handleAppointClubSecretary} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Verified Student</label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                  >
                    {allProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.aitRollNo} - {p.branch})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Technical Club</label>
                  <select
                    value={targetClubId}
                    onChange={(e) => setTargetClubId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                  >
                    {clubs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30"
                >
                  Ratify Club Secretary Appointment
                </button>
              </form>
            </div>

            {/* Existing Appointments */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Active Club Secretary Records</h3>
              <div className="space-y-3">
                {appointments
                  .filter((a) => a.role === 'CLUB_SECRETARY')
                  .map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-[#0c101d] border border-[#1e293b] flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{app.targetStudentName}</p>
                        <p className="text-[10px] text-slate-400">Club: {app.clubName}</p>
                        <p className="text-[9px] text-slate-500 mt-1">Tenure: {app.startDate} – {app.endDate || 'Active'}</p>
                      </div>

                      <button
                        onClick={() => revokeAppointment(app.id)}
                        className="text-slate-500 hover:text-rose-400 text-xs transition-colors p-2"
                        title="Revoke Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
