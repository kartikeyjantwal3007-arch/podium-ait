'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { useAppStore } from '@/lib/store';
import {
  Briefcase,
  Trophy,
  Users,
  Award,
  ScrollText,
  Calendar,
  Plus,
  Crown,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  AlertCircle,
  FileCheck2,
  ArrowRight,
  ShieldAlert,
  Send,
  Trash2,
} from 'lucide-react';

export default function ClubSecretaryPage() {
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
    submitOfficialResult,
    generateCertificatesForCompetition,
    appointJointSecretary,
    revokeAppointment,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HACKATHONS' | 'PODIUM' | 'CERTIFICATES' | 'APPOINTMENTS'>('OVERVIEW');

  // Find club assigned to this secretary (defaults to Design & Innovation Club)
  const myClub =
    clubs.find((c) => c.id === currentUser.assignedClubId || c.clubSecretaryId === currentUser.id) ||
    clubs[0];

  const clubCompetitions = competitions.filter(
    (c) => c.clubId === myClub.id || c.slug.includes('graphica') || c.slug.includes('design')
  );

  const completedHackathons = clubCompetitions.filter((c) => c.status === 'COMPLETED' || c.status === 'ONGOING');
  const upcomingHackathons = clubCompetitions.filter((c) => c.status === 'PUBLISHED');

  const clubResults = results.filter((r) => r.clubId === myClub.id || r.competitionTitle.includes('Graphica'));
  const clubCerts = certificates.filter((c) => c.clubName === myClub.name || c.competitionTitle.includes('Graphica'));
  const pendingCerts = clubCerts.filter((c) => c.status === 'PENDING_SIGNATURE' || c.status === 'PENDING_REVIEW');

  const clubAppointments = appointments.filter((a) => a.clubId === myClub.id && a.role === 'JOINT_SECRETARY');

  // Form: Declare Winners & Submit Podium
  const [selectedCompId, setSelectedCompId] = useState(clubCompetitions[0]?.id || '');
  const [firstTeamId, setFirstTeamId] = useState(teams[0]?.id || '');
  const [secondTeamId, setSecondTeamId] = useState(teams[1]?.id || '');
  const [thirdTeamId, setThirdTeamId] = useState(teams[2]?.id || '');
  const [podiumError, setPodiumError] = useState('');
  const [podiumSuccess, setPodiumSuccess] = useState('');

  // Form: Appoint Joint Secretary
  const [targetStudentId, setTargetStudentId] = useState(allProfiles[1]?.id || '');
  const [jsStartDate, setJsStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [jsEndDate, setJsEndDate] = useState('2027-05-31');
  const [appointError, setAppointError] = useState('');
  const [appointSuccess, setAppointSuccess] = useState('');

  // Batch Certificate Generation feedback
  const [certGenMessage, setCertGenMessage] = useState('');

  const handleDeclarePodium = (e: React.FormEvent) => {
    e.preventDefault();
    setPodiumError('');
    setPodiumSuccess('');

    if (firstTeamId === secondTeamId || firstTeamId === thirdTeamId || secondTeamId === thirdTeamId) {
      setPodiumError('Contradictory podium entry: 1st, 2nd, and 3rd place must be distinct teams.');
      return;
    }

    const comp = competitions.find((c) => c.id === selectedCompId);
    const t1 = teams.find((t) => t.id === firstTeamId);
    if (!comp || !t1) {
      setPodiumError('Selected competition or team not found.');
      return;
    }

    const res = submitOfficialResult({
      competitionId: comp.id,
      competitionTitle: comp.title,
      clubId: myClub.id,
      clubName: myClub.name,
      teamId: t1.id,
      teamName: t1.name,
      awardTitle: '1st Place Winner - Gold Trophy',
      rankPosition: 1,
      isVerified: false,
      members: t1.members.map((m) => ({
        studentId: m.studentId,
        name: m.fullName,
        aitRollNo: m.aitRollNo,
      })),
    });

    if (res.success) {
      setPodiumSuccess('Podium declaration submitted successfully! Forwarded to General Secretary & Director for verification.');
    } else {
      setPodiumError(res.error || 'Failed to submit podium result.');
    }
  };

  const handleAppointJS = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointError('');
    setAppointSuccess('');

    const res = appointJointSecretary({
      targetStudentId,
      clubId: myClub.id,
      startDate: jsStartDate,
      endDate: jsEndDate,
    });

    if (res.success) {
      setAppointSuccess('Joint Secretary appointed successfully! Permissions have been granted.');
    } else {
      setAppointError(res.error || 'Failed to appoint Joint Secretary.');
    }
  };

  const handleGenerateCerts = (compId: string) => {
    const count = generateCertificatesForCompetition(compId, 'ALL_WINNERS');
    setCertGenMessage(`Successfully generated ${count} certificates. Enqueued for Director cryptographic signature.`);
    setTimeout(() => setCertGenMessage(''), 5000);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* ── Club Overview Header ── */}
        <div className="p-6 rounded-3xl bg-[#0c101d] border border-[#1a2236] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/30 shrink-0">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">{myClub.name}</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Club Secretary Desk
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {myClub.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                  <span>Secretary: <strong className="text-white">{currentUser.fullName}</strong></span>
                  <span>•</span>
                  <span>Active Hackathons: <strong className="text-white">{clubCompetitions.length}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/notices"
                className="px-3.5 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-xs font-semibold text-purple-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ScrollText className="w-3.5 h-3.5" />
                Publish Notice
              </Link>
            </div>
          </div>
        </div>

        {/* ── Metrics Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Hackathons</p>
            <p className="text-2xl font-black text-white mt-1">{clubCompetitions.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Organised under club banner</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Participating Teams</p>
            <p className="text-2xl font-black text-sky-400 mt-1">{teams.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Registered across active events</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Declared Podium Holders</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{clubResults.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Verified merit rankings</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Pending Cert Requests</p>
            <p className="text-2xl font-black text-purple-400 mt-1">{pendingCerts.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">In Director signing queue</p>
          </div>
        </div>

        {/* ── Tabs Navigation ── */}
        <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: 'Club Overview' },
            { id: 'HACKATHONS', label: 'Hackathons & Teams' },
            { id: 'PODIUM', label: 'Declare Podium & Winners' },
            { id: 'CERTIFICATES', label: 'Generate Certificates' },
            { id: 'APPOINTMENTS', label: 'Appoint Joint Secretary' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#5b50f6] text-white shadow-sm'
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
            {/* Organising Committee */}
            <div className="lg:col-span-2 rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Organising Committee & Leadership
                </h3>
              </div>

              <div className="divide-y divide-[#1e293b]">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                      CS
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                      <p className="text-[10px] text-slate-400">Club Secretary (Convener)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
                    Lead Organiser
                  </span>
                </div>

                {clubAppointments.map((app) => (
                  <div key={app.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-xs font-bold text-purple-300">
                        JS
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{app.targetStudentName}</p>
                        <p className="text-[10px] text-slate-400">Joint Secretary (Roll: {app.targetStudentRollNo})</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300">
                      Appointed JS
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Club Activities */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">Recent Club Activities</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0c101d] border border-[#1e293b] space-y-1">
                  <p className="font-semibold text-slate-200">Official Graphica 2026 Rankings</p>
                  <p className="text-[11px] text-slate-400">1st: Pixel Forge, 2nd: Team Zenith, 3rd: CodeCanvas</p>
                  <span className="text-[9px] text-emerald-400">● Declared by Secretary</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0c101d] border border-[#1e293b] space-y-1">
                  <p className="font-semibold text-slate-200">Ananya Roy appointed Joint Secretary</p>
                  <p className="text-[11px] text-slate-400">Tenure assigned until May 2027</p>
                  <span className="text-[9px] text-purple-400">● Appointment active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: HACKATHONS & TEAMS ── */}
        {activeTab === 'HACKATHONS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Hackathons Managed by {myClub.name}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubCompetitions.map((comp) => (
                <div
                  key={comp.id}
                  className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                        {comp.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{comp.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{comp.description}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                      {comp.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-[#1e293b]">
                    <span>📅 {new Date(comp.startDate).toLocaleDateString()} – {new Date(comp.endDate).toLocaleDateString()}</span>
                    <span>🏆 Prize: {comp.prizePool}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleGenerateCerts(comp.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-semibold"
                    >
                      Generate Winner Certificates
                    </button>
                    <Link
                      href={`/competitions/${comp.slug}`}
                      className="px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-slate-300 hover:text-white text-xs font-medium"
                    >
                      View Public Page
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {certGenMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{certGenMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: DECLARE PODIUM & WINNERS ── */}
        {activeTab === 'PODIUM' && (
          <div className="max-w-2xl rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Official Results & Podium Declaration
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select the completed hackathon and assign the official 1st, 2nd, and 3rd place teams. Contradictory duplicate entries are prevented.
              </p>
            </div>

            {podiumError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{podiumError}</span>
              </div>
            )}

            {podiumSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{podiumSuccess}</span>
              </div>
            )}

            <form onSubmit={handleDeclarePodium} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Completed Hackathon</label>
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  {clubCompetitions.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* 1st Place */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Crown className="w-4 h-4" /> 1st Place Winner (Gold)
                </label>
                <select
                  value={firstTeamId}
                  onChange={(e) => setFirstTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.members.length} members)</option>
                  ))}
                </select>
              </div>

              {/* 2nd Place */}
              <div className="p-3.5 rounded-xl bg-slate-400/10 border border-slate-400/30 space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-slate-400" /> 2nd Place Runner-Up (Silver)
                </label>
                <select
                  value={secondTeamId}
                  onChange={(e) => setSecondTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.members.length} members)</option>
                  ))}
                </select>
              </div>

              {/* 3rd Place */}
              <div className="p-3.5 rounded-xl bg-amber-700/10 border border-amber-700/30 space-y-1">
                <label className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-600" /> 3rd Place Runner-Up (Bronze)
                </label>
                <select
                  value={thirdTeamId}
                  onChange={(e) => setThirdTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.members.length} members)</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Official Podium for Verification
              </button>
            </form>
          </div>
        )}

        {/* ── TAB 4: CERTIFICATES ── */}
        {activeTab === 'CERTIFICATES' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Generated Club Certificates</h3>
                <p className="text-xs text-slate-400">
                  Certificates remain in PENDING status until approved and digitally signed by the Director.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c101d] text-slate-400 uppercase text-[10px] border-b border-[#1e293b]">
                    <tr>
                      <th className="p-3.5">Cert ID</th>
                      <th className="p-3.5">Recipient</th>
                      <th className="p-3.5">Competition</th>
                      <th className="p-3.5">Distinction</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Signature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b] text-slate-300">
                    {clubCerts.map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-800/20">
                        <td className="p-3.5 font-mono text-purple-400">{cert.certificateNumber}</td>
                        <td className="p-3.5 font-bold text-white">{cert.recipientName}</td>
                        <td className="p-3.5">{cert.competitionTitle}</td>
                        <td className="p-3.5">{cert.title}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cert.status === 'ISSUED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {cert.status}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[10px] text-slate-400">
                          {cert.signatureHash ? `${cert.signatureHash.substring(0, 14)}...` : 'Pending Director'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: APPOINT JOINT SECRETARY ── */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Appointment Form */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                  Appoint Joint Secretary
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Appoint a verified 2nd-year student as Joint Secretary for {myClub.name}. Granted notice publishing powers.
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

              <form onSubmit={handleAppointJS} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Verified Student</label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                  >
                    {allProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.aitRollNo} - {p.branch})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={jsStartDate}
                      onChange={(e) => setJsStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={jsEndDate}
                      onChange={(e) => setJsEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors shadow-lg shadow-purple-900/30"
                >
                  Confirm Joint Secretary Appointment
                </button>
              </form>
            </div>

            {/* Active Appointments List */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Active Joint Secretary Appointments</h3>

              <div className="space-y-3">
                {clubAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-[#0c101d] border border-[#1e293b] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{app.targetStudentName}</p>
                      <p className="text-[10px] text-slate-400">Roll: {app.targetStudentRollNo} • {app.clubName}</p>
                      <p className="text-[9px] text-slate-500 mt-1">Tenure: {app.startDate} – {app.endDate || 'Present'}</p>
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
