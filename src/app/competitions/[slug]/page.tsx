'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Certificate } from '@/lib/types';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Medal, 
  FolderGit2, 
  FileCheck2, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  ExternalLink 
} from 'lucide-react';

import { Suspense } from 'react';

function CompetitionDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { 
    currentUser, 
    competitions, 
    teams, 
    projects, 
    results, 
    certificates, 
    applications, 
    submitHackathonApplication 
  } = useAppStore();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Dynamic application form fields
  const [teamName, setTeamName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [teamMembersList, setTeamMembersList] = useState<{ name: string; rollNo: string; email: string; branch: string; year: number }[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRoll, setNewMemberRoll] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  const competition = competitions.find(c => c.slug === resolvedParams.slug || c.id === resolvedParams.slug);

  const isOrganizer = currentUser.role === 'CLUB_SECRETARY' || currentUser.role === 'GENERAL_SECRETARY';
  if (!competition || (competition.status === 'DRAFT' && !isOrganizer)) {
    return (
      <DashboardShell>
        <div className="p-8 text-center space-y-4">
          <h1 className="text-xl font-bold text-white">Event Not Found</h1>
          <p className="text-xs text-slate-400 mt-1">The requested event does not exist or has not been published yet.</p>
          <Link href="/competitions" className="mt-4 inline-block px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold text-white">
            Back to Competitions
          </Link>
        </div>
      </DashboardShell>
    );
  }

  // Filter strictly to verified results
  const compResults = results.filter(r => r.competitionId === competition.id && r.isVerified);
  const hasPendingResults = competition.resultsStatus === 'PENDING_VERIFICATION' || results.some(r => r.competitionId === competition.id && !r.isVerified);
  const compProjects = projects.filter(p => p.competitionId === competition.id);
  const compCertificates = certificates.filter(c => c.competitionId === competition.id);

  // Check if current student has applied
  const myApplication = applications.find(
    a => a.competitionId === competition.id && a.applicantId === currentUser.id && a.status !== 'WITHDRAWN'
  );

  const [clientNow, setClientNow] = useState<number | null>(null);
  useEffect(() => {
    setClientNow(Date.now());
  }, []);

  const isRegistrationOpen = competition.isRegistrationPublished !== false && (!competition.registrationCloseDate || (clientNow ? new Date(competition.registrationCloseDate).getTime() >= clientNow : true));

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberRoll.trim() || !newMemberEmail.trim()) {
      setApplyError('Please fill in Member Name, Roll No, and Email.');
      return;
    }
    const totalMembers = teamMembersList.length + 2; // +1 for applicant, +1 for this member
    if (totalMembers > competition.maxTeamSize) {
      setApplyError(`Maximum team size for this competition is ${competition.maxTeamSize} members.`);
      return;
    }

    setTeamMembersList(prev => [
      ...prev,
      {
        name: newMemberName.trim(),
        rollNo: newMemberRoll.trim(),
        email: newMemberEmail.trim(),
        branch: 'Computer Engineering',
        year: 2,
      }
    ]);
    setNewMemberName('');
    setNewMemberRoll('');
    setNewMemberEmail('');
    setApplyError('');
  };

  const handleRemoveMember = (idx: number) => {
    setTeamMembersList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError('');
    setApplySuccess('');

    if (!projectTitle.trim() || !projectDesc.trim()) {
      setApplyError('Project Title and Description are required.');
      return;
    }

    const totalMembers = teamMembersList.length + 1; // including applicant
    if (totalMembers < competition.minTeamSize) {
      setApplyError(`This competition requires a minimum of ${competition.minTeamSize} members per team.`);
      return;
    }
    if (totalMembers > competition.maxTeamSize) {
      setApplyError(`Maximum allowed team size is ${competition.maxTeamSize} members.`);
      return;
    }

    const res = submitHackathonApplication({
      competitionId: competition.id,
      competitionTitle: competition.title,
      clubId: competition.clubId || 'club-general',
      clubName: competition.clubName || 'AIT Technical Club',
      applicantId: currentUser.id,
      applicantName: currentUser.fullName,
      applicantRollNo: currentUser.aitRollNo,
      applicantEmail: currentUser.collegeEmail,
      applicantBranch: currentUser.branch,
      applicantYear: currentUser.yearOfStudy || 1,
      isYearVerified: currentUser.isYearVerified,
      teamName: teamName.trim() || `${currentUser.fullName}'s Team`,
      teamMembers: teamMembersList,
      projectTitle: projectTitle.trim(),
      projectDescription: projectDesc.trim(),
      technologies: technologies.split(',').map(t => t.trim()).filter(Boolean),
      githubUrl: githubUrl.trim(),
      answers: customAnswers,
    });

    if (res.success) {
      setApplySuccess('Your application has been successfully submitted to the organizing committee!');
      setTimeout(() => {
        setShowApplyModal(false);
      }, 1500);
    } else {
      setApplyError(res.error || 'Failed to submit application.');
    }
  };

  return (
    <>
      <DashboardShell>
        <div className="space-y-8">
          
          {/* Back button */}
          <Link
            href="/competitions"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Competitions</span>
          </Link>

          {/* Banner Hero Card */}
          <div className="rounded-3xl bg-[#0D1220] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="relative h-64 sm:h-80 w-full bg-slate-900">
              <img
                src={competition.bannerUrl}
                alt={competition.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220] via-[#0D1220]/60 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600/90 text-white backdrop-blur-sm">
                    {competition.category}
                  </span>
                  
                  {/* Status Badges */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isRegistrationOpen 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {isRegistrationOpen ? 'Registration Open' : 'Registration Closed'}
                  </span>

                  {competition.resultsStatus === 'PUBLISHED' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Results Published
                    </span>
                  )}
                  {competition.resultsStatus === 'PENDING_VERIFICATION' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      Results Pending Verification
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {competition.title}
                  </h1>

                  {/* Apply Button or Application Status */}
                  {currentUser.role === 'STUDENT' && (
                    <div>
                      {myApplication ? (
                        <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-slate-300">Status: <strong className="text-purple-300 font-bold uppercase">{myApplication.status}</strong></span>
                        </div>
                      ) : isRegistrationOpen ? (
                        <button
                          onClick={() => setShowApplyModal(true)}
                          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          <span>Register Application</span>
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Specs Bar */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 bg-[#121A2B]/40 text-xs">
              <div>
                <span className="text-slate-500 block">Dates</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Venue & Format</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {competition.venueType} • {competition.venueDetails}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Prize Pool</span>
                <span className="font-semibold text-amber-400 mt-0.5 block">
                  {competition.prizePool}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Team Formation</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {competition.minTeamSize} to {competition.maxTeamSize} Members
                </span>
              </div>
            </div>
          </div>

          {/* Description & Rules & Eligibility Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col (2 cols): Overview & Rules & Results */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                <h2 className="text-base font-bold text-white">Event Overview</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {competition.description}
                </p>
              </div>

              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                <h2 className="text-base font-bold text-white">Official Rules & Protocol</h2>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800 font-mono">
                  {competition.rules || 'Standard AIT Pune technical competition code of conduct applies. All solutions must be authored by enrolled students.'}
                </p>
              </div>

              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-3">
                <h2 className="text-base font-bold text-white">Eligibility Criteria</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {competition.eligibility || 'Open to all bona-fide engineering students across accredited AICTE / UGC universities.'}
                </p>
              </div>

              {/* Official Podium Standings with Exact Empty States */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">Official Podium Standings</h2>
                </div>

                {compResults.length > 0 ? (
                  <div className="space-y-3">
                    {compResults.map((res) => (
                      <div
                        key={res.id}
                        className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                            res.rankPosition === 1 ? 'bg-amber-400 text-black'
                            : res.rankPosition === 2 ? 'bg-slate-300 text-black'
                            : 'bg-amber-700 text-white'
                          }`}>
                            {res.rankPosition}
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{res.awardTitle}</span>
                            <h4 className="font-bold text-sm text-white">{res.teamName}</h4>
                            <p className="text-[11px] text-slate-400">Project: {res.projectTitle}</p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Official
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-[#121A2B]/60 border border-slate-800 text-center space-y-2">
                    <p className="text-sm font-bold text-slate-200">
                      {hasPendingResults ? 'Results are awaiting verification.' : 'No winners have been officially announced yet.'}
                    </p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      {hasPendingResults 
                        ? 'Proposed results have been submitted by the Club Secretary and are under formal verification by the General Secretary.'
                        : 'Official winners will be published here upon completion of judging and General Secretary verification.'}
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Col: Submissions & Certificates */}
            <div className="space-y-6">

              {/* Official External Event Portal */}
              {competition.officialUrl && (
                <div className="rounded-2xl bg-[#0D1220] border border-indigo-500/30 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <ExternalLink className="w-4 h-4" />
                    <span>Official Event Portal</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Access the external registration platform, official challenge dossier, and updates directly:
                  </p>
                  <a
                    href={competition.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md shadow-indigo-600/20"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
              
              {/* My Application Status (if student applied) */}
              {myApplication && (
                <div className="rounded-2xl bg-[#0D1220] border border-purple-500/30 p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Your Application</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 uppercase">
                      {myApplication.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p><strong className="text-slate-400 font-normal">Team: </strong>{myApplication.teamName || 'Individual'}</p>
                    <p><strong className="text-slate-400 font-normal">Project: </strong>{myApplication.projectTitle}</p>
                    <p className="text-[11px] text-slate-500">Submitted: {new Date(myApplication.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {/* Submitted Projects */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-bold text-white">Submitted Projects</h3>
                  </div>
                  <span className="text-xs text-slate-500">{compProjects.length}</span>
                </div>

                {compProjects.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No projects submitted yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {compProjects.map((p) => (
                      <Link
                        key={p.id}
                        href={`/projects/${p.slug}`}
                        className="p-3 rounded-xl bg-[#121A2B] hover:bg-slate-800 border border-slate-800/80 block transition-colors space-y-1"
                      >
                        <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{p.title}</h4>
                        <p className="text-[10px] text-purple-300">{p.teamName}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Associated Certificates */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Authorized Certificates</h3>
                  </div>
                  <span className="text-xs text-slate-500">{compCertificates.length}</span>
                </div>

                {compCertificates.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Certificates generated upon result approval.</p>
                ) : (
                  <div className="space-y-2.5">
                    {compCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-3 rounded-xl bg-[#121A2B] border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate">{cert.recipientName}</p>
                          <p className="text-[10px] text-slate-400">{cert.title}</p>
                        </div>
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-purple-600 text-[10px] font-semibold text-white transition-colors shrink-0"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </DashboardShell>

      {/* Dynamic Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0D1220] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Hackathon Application Form</h3>
                <p className="text-xs text-slate-400">{competition.title} • {competition.clubName}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {applyError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {applyError}
              </div>
            )}
            {applySuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                {applySuccess}
              </div>
            )}

            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              {/* Applicant Identity (Read-only verified) */}
              <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Applicant Identity</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Name</span>
                    <span className="font-semibold">{currentUser.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Roll No</span>
                    <span className="font-mono">{currentUser.aitRollNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Branch</span>
                    <span>{currentUser.branch}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Academic Year</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-300">
                      Year {currentUser.yearOfStudy || 1}
                      {currentUser.isYearVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Information */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Team Name (Optional for individual, mandatory for teams)
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. CyberKnights"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Team Members List (Validates min/max team size) */}
                <div className="p-4 rounded-xl bg-[#121A2B]/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Team Members</span>
                      <span className="text-[10px] text-slate-400">
                        Total team size: {teamMembersList.length + 1} (Required: {competition.minTeamSize} - {competition.maxTeamSize} members)
                      </span>
                    </div>
                  </div>

                  {teamMembersList.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white">{m.name} <span className="text-slate-400 font-mono text-[11px]">({m.rollNo})</span></p>
                        <p className="text-[10px] text-slate-400">{m.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-rose-400 hover:text-rose-300 text-xs px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* Add Member Inputs */}
                  {teamMembersList.length + 1 < competition.maxTeamSize && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="Member Full Name"
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                      />
                      <input
                        type="text"
                        value={newMemberRoll}
                        onChange={(e) => setNewMemberRoll(e.target.value)}
                        placeholder="AIT Roll No (e.g. 23019)"
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono"
                      />
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          placeholder="member@aitpune.edu.in"
                          className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddMember}
                          className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white font-bold rounded-lg text-xs"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project / Solution Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Autonomous Campus Drone Telemetry"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Problem Statement & Proposed Architecture *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="Describe the challenge your team addresses, the architectural workflow, and hardware/software components..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Technologies & Libraries Used
                    </label>
                    <input
                      type="text"
                      value={technologies}
                      onChange={(e) => setTechnologies(e.target.value)}
                      placeholder="e.g. Next.js, Python, OpenCV, ROS2"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      GitHub Repository / Project URL
                    </label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Questions (if configured on competition) */}
              {competition.formFields && competition.formFields.filter(f => !['fullName', 'aitRegNo', 'aitRollNo', 'collegeEmail', 'branch', 'yearOfStudy', 'teamName', 'projectTitle', 'projectDescription', 'technologies', 'githubUrl'].includes(f.name || '')).map((field) => (
                <div key={field.id}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {field.label} {field.required && '*'}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      rows={2}
                      placeholder={field.placeholder || ''}
                      value={customAnswers[field.name || field.id] || ''}
                      onChange={(e) => setCustomAnswers(prev => ({ ...prev, [field.name || field.id]: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  ) : field.type === 'dropdown' ? (
                    <select
                      required={field.required}
                      value={customAnswers[field.name || field.id] || ''}
                      onChange={(e) => setCustomAnswers(prev => ({ ...prev, [field.name || field.id]: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
                      required={field.required}
                      placeholder={field.placeholder || ''}
                      value={customAnswers[field.name || field.id] || ''}
                      onChange={(e) => setCustomAnswers(prev => ({ ...prev, [field.name || field.id]: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30"
                >
                  Submit Registration
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </>
  );
}

export default function CompetitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080B14] p-8 text-center text-slate-400">Loading competition details...</div>}>
      <CompetitionDetailContent params={params} />
    </Suspense>
  );
}
