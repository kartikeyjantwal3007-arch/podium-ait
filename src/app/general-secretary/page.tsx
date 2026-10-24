'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Certificate, SignatureMode } from '@/lib/types';
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
  PenTool,
  Key,
  XCircle,
  RotateCcw,
  Ban,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  Info
} from 'lucide-react';

function formatLocalDate(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
    academicYearCorrections,
    resultCorrectionLogs,
    publishNotice,
    appointClubSecretary,
    revokeAppointment,
    verifyPodiumResults,
    generalSecretarySignCertificate,
    approveCertificate,
    returnCertificateForCorrection,
    rejectCertificate,
    revokeCertificate,
    batchGeneralSecretarySignCertificates,
    generalSecretaryVerifyStudent,
    adminCorrectStudentYear,
    verifyAndPublishResults,
    correctPublishedResult,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'PODIUM_TABLE' | 'CERTIFICATE_QUEUE' | 'STUDENT_VERIFICATION' | 'ALL_CLUBS' | 'RESULTS_APPROVAL' | 'PRIORITY_NOTICE' | 'APPOINT_CLUB_SEC'
  >('OVERVIEW');

  // Certificate signing modal state
  const [signingCert, setSigningCert] = useState<Certificate | null>(null);
  const [signingPin, setSigningPin] = useState('');
  const [signingError, setSigningError] = useState('');
  const [signingSuccess, setSigningSuccess] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  // Return for correction modal
  const [returnCert, setReturnCert] = useState<Certificate | null>(null);
  const [returnRemarks, setReturnRemarks] = useState('');

  // Revoke modal
  const [revokingCert, setRevokingCert] = useState<Certificate | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  // Certificate preview modal
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  // Certificate queue filter
  const [certFilter, setCertFilter] = useState<string>('ALL');

  // Student verification filter
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');
  const [studentRejectModal, setStudentRejectModal] = useState<string | null>(null);
  const [studentRejectReason, setStudentRejectReason] = useState('');

  // Academic year admin correction modal
  const [correctingStudent, setCorrectingStudent] = useState<any>(null);
  const [correctGradYear, setCorrectGradYear] = useState<number>(2026);
  const [correctStudyYear, setCorrectStudyYear] = useState<number>(3);
  const [correctReason, setCorrectReason] = useState<string>('');
  const [correctError, setCorrectError] = useState<string>('');
  const [correctSuccess, setCorrectSuccess] = useState<string>('');

  // Results return for correction modal
  const [returnCompModal, setReturnCompModal] = useState<string | null>(null);
  const [returnCompReason, setReturnCompReason] = useState<string>('');

  // Published result correction modal
  const [correctingResult, setCorrectingResult] = useState<any>(null);
  const [newAwardTitle, setNewAwardTitle] = useState<string>('');
  const [newRankPos, setNewRankPos] = useState<number>(1);
  const [resCorrectionReason, setResCorrectionReason] = useState<string>('');

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('2027-06-30');
  const [appointError, setAppointError] = useState('');
  const [appointSuccess, setAppointSuccess] = useState('');

  useEffect(() => {
    setStartDate((prev) => prev || formatLocalDate());
  }, []);

  const completedHackathons = competitions.filter((c) => c.status === 'COMPLETED' || c.status === 'ONGOING');
  const pendingResults = results.filter((r) => !r.isVerified);
  const issuedCerts = certificates.filter((c) => c.status === 'ISSUED');
  const pendingCerts = certificates.filter((c) => c.status === 'PENDING_REVIEW' || c.status === 'PENDING_SIGNATURE' || c.status === 'APPROVED');
  const pendingStudents = allProfiles.filter((p) => p.verificationStatus === 'PENDING_AIT_VERIFICATION');

  // Handle Signing
  const handleExecuteSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingCert) return;
    setSigningError('');
    setSigningSuccess('');

    if (!signingPin.trim()) {
      setSigningError('Please enter your General Secretary Authorization PIN.');
      return;
    }

    setIsSigning(true);
    setTimeout(() => {
      const res = generalSecretarySignCertificate(signingCert.id, signingPin);
      setIsSigning(false);

      if (res.success) {
        setSigningSuccess('Certificate officially approved, cryptographically signed, and issued!');
        setTimeout(() => {
          setSigningCert(null);
          setSigningPin('');
          setSigningSuccess('');
        }, 1200);
      } else {
        setSigningError(res.error || 'Authorization failed. Please verify your PIN (ait@gs2026).');
      }
    }, 600);
  };

  // Handle Return for correction
  const handleExecuteReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnCert) return;
    returnCertificateForCorrection(returnCert.id, returnRemarks.trim() || 'Returned for verification of participant records.');
    setReturnCert(null);
    setReturnRemarks('');
  };

  // Handle Revoke
  const handleExecuteRevoke = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokingCert) return;
    revokeCertificate(revokingCert.id, revokeReason.trim() || 'Certificate revoked by General Secretary order.');
    setRevokingCert(null);
    setRevokeReason('');
  };

  // Handle Batch Sign
  const handleBatchSign = () => {
    const certIds = certificates
      .filter((c) => c.status === 'APPROVED' || c.status === 'PENDING_SIGNATURE' || c.status === 'PENDING_REVIEW')
      .map((c) => c.id);
    if (certIds.length === 0) return;
    batchGeneralSecretarySignCertificates(certIds, 'ait@gs2026');
  };

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
      startDate: startDate || formatLocalDate(),
      endDate,
    });

    if (res.success) {
      setAppointSuccess('Club Secretary appointment officially ratified and recorded.');
    } else {
      setAppointError(res.error || 'Failed to appoint Club Secretary.');
    }
  };

  // Group results by competition for the requested podium table
  const competitionPodiumRows = competitions.map((comp) => {
    const compResults = results.filter((r) => r.competitionId === comp.id);
    const firstPlace = compResults.find((r) => r.rankPosition === 1);
    const secondPlace = compResults.find((r) => r.rankPosition === 2);
    const thirdPlace = compResults.find((r) => r.rankPosition === 3);

    const compCerts = certificates.filter((c) => c.competitionId === comp.id);
    const hasUnsigned = compCerts.some((c) => c.status !== 'ISSUED');
    const certStatus = compCerts.length === 0 ? 'NOT_GENERATED' : hasUnsigned ? 'PENDING_GS' : 'OFFICIALLY_SIGNED';

    return {
      comp,
      firstPlace,
      secondPlace,
      thirdPlace,
      certCount: compCerts.length,
      certStatus,
    };
  });

  // Filtered certificates
  const filteredCertificates = certificates.filter((c) => {
    if (certFilter === 'ALL') return true;
    return c.status === certFilter;
  });

  // Filtered students
  const filteredStudents = allProfiles.filter((p) => {
    if (verificationFilter === 'ALL') return true;
    return p.verificationStatus === verificationFilter;
  });

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
                    Apex Institutional Authority
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Institution-wide supervisory governance, podium overview, certificate approval & cryptographic digital signing, student roster verification, and priority notices.
                </p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                  <span>General Secretary: <strong className="text-white">{currentUser.fullName}</strong></span>
                  <span>•</span>
                  <span>Supervised Clubs: <strong className="text-white">{clubs.length}</strong></span>
                  <span>•</span>
                  <span>Pending Student Verifications: <strong className="text-amber-400">{pendingStudents.length}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('PRIORITY_NOTICE')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-rose-900/30"
              >
                <Pin className="w-3.5 h-3.5" />
                Broadcast Notice
              </button>
            </div>
          </div>
        </div>

        {/* ── Key Supervisory Metrics ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Clubs</p>
            <p className="text-xl font-black text-white mt-1">{clubs.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Hackathons</p>
            <p className="text-xl font-black text-indigo-400 mt-1">{competitions.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Registered Students</p>
            <p className="text-xl font-black text-sky-400 mt-1">{allProfiles.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Pending Verification</p>
            <p className="text-xl font-black text-amber-400 mt-1">{pendingStudents.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Certs in Queue</p>
            <p className="text-xl font-black text-rose-400 mt-1">{pendingCerts.length}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Issued Certs</p>
            <p className="text-xl font-black text-emerald-400 mt-1">{issuedCerts.length}</p>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: 'Overview' },
            { id: 'PODIUM_TABLE', label: 'All Podium Holders' },
            { id: 'CERTIFICATE_QUEUE', label: `Certificate Signing (${pendingCerts.length})` },
            { id: 'STUDENT_VERIFICATION', label: `Student Verification (${pendingStudents.length})` },
            { id: 'ALL_CLUBS', label: 'All Technical Clubs' },
            { id: 'RESULTS_APPROVAL', label: 'Verify Results' },
            { id: 'PRIORITY_NOTICE', label: 'Priority Notices' },
            { id: 'APPOINT_CLUB_SEC', label: 'Appoint Secretaries' },
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

        {/* ── TAB 2: PODIUM TABLE (Prompt Requirements) ── */}
        {activeTab === 'PODIUM_TABLE' && (
          <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  All Hackathon Podium Holders Across Clubs
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Institutional overview of 1st, 2nd, and 3rd place podium holders with certificate issuance states.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-[#1e293b] text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-3 px-3">Hackathon Name</th>
                    <th className="py-3 px-3">Club</th>
                    <th className="py-3 px-3">1st Place</th>
                    <th className="py-3 px-3">2nd Place</th>
                    <th className="py-3 px-3">3rd Place</th>
                    <th className="py-3 px-3">Certificate Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {competitionPodiumRows.map(({ comp, firstPlace, secondPlace, thirdPlace, certStatus }) => (
                    <tr key={comp.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-bold text-white">{comp.title}</p>
                        <p className="text-[10px] text-slate-500">{comp.category}</p>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-300">{comp.clubName}</td>
                      <td className="py-3 px-3">
                        {firstPlace ? (
                          <div>
                            <span className="font-bold text-amber-400">{firstPlace.teamName}</span>
                            <p className="text-[10px] text-slate-500">{firstPlace.awardTitle}</p>
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">Not Declared</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {secondPlace ? (
                          <div>
                            <span className="font-semibold text-slate-200">{secondPlace.teamName}</span>
                            <p className="text-[10px] text-slate-500">{secondPlace.awardTitle}</p>
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">Not Declared</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {thirdPlace ? (
                          <div>
                            <span className="font-semibold text-amber-600">{thirdPlace.teamName}</span>
                            <p className="text-[10px] text-slate-500">{thirdPlace.awardTitle}</p>
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">Not Declared</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {certStatus === 'OFFICIALLY_SIGNED' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Signed & Issued
                          </span>
                        ) : certStatus === 'PENDING_GS' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Pending GS Signature
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                            Draft / Not Generated
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: CERTIFICATE REVIEW & SIGNING QUEUE (Transferred Authority) ── */}
        {activeTab === 'CERTIFICATE_QUEUE' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-rose-400" />
                  General Secretary Authorized Certificate Queue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review submitted certificates, return for correction, or apply cryptographic SHA-256 digital signature.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBatchSign}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-rose-900/30"
                >
                  Batch Sign All Approved
                </button>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: 'All Certificates' },
                { id: 'PENDING_REVIEW', label: 'Pending Review' },
                { id: 'APPROVED', label: 'Approved' },
                { id: 'PENDING_SIGNATURE', label: 'Pending Signature' },
                { id: 'ISSUED', label: 'Signed & Issued' },
                { id: 'RETURNED_FOR_CORRECTION', label: 'Returned' },
                { id: 'REVOKED', label: 'Revoked' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setCertFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    certFilter === filter.id
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#111728] text-slate-400 hover:text-white border border-[#1e293b]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Certificates Table */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-[#1e293b] text-slate-400 text-[10px] uppercase font-bold tracking-wider bg-[#0c101d]">
                      <th className="py-3 px-3">Cert ID & Recipient</th>
                      <th className="py-3 px-3">Competition & Club</th>
                      <th className="py-3 px-3">Award Category</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]">
                    {filteredCertificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-bold text-white">{cert.recipientName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Roll: {cert.recipientRollNo}</p>
                          <p className="text-[9px] text-slate-500 font-mono">{cert.certificateNumber}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-200">{cert.competitionTitle}</p>
                          <p className="text-[10px] text-slate-400">{cert.clubName}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0c101d] border border-[#1e293b] text-purple-300">
                            {cert.category ? cert.category.replace('_', ' ') : 'MERIT'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {cert.status === 'ISSUED' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Issued & Signed
                            </span>
                          ) : cert.status === 'APPROVED' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                              Approved
                            </span>
                          ) : cert.status === 'RETURNED_FOR_CORRECTION' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Returned
                            </span>
                          ) : cert.status === 'REVOKED' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              Revoked
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {cert.status.replace('_', ' ')}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Preview */}
                            <button
                              onClick={() => setPreviewCert(cert)}
                              className="p-1.5 rounded-lg bg-[#0c101d] hover:bg-slate-800 text-slate-300 transition-colors"
                              title="Preview PDF Certificate"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Approve */}
                            {cert.status !== 'APPROVED' && cert.status !== 'ISSUED' && cert.status !== 'REVOKED' && (
                              <button
                                onClick={() => approveCertificate(cert.id)}
                                className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[10px]"
                              >
                                Approve
                              </button>
                            )}

                            {/* Sign */}
                            {cert.status !== 'ISSUED' && cert.status !== 'REVOKED' && (
                              <button
                                onClick={() => {
                                  setSigningCert(cert);
                                  setSigningPin('');
                                  setSigningError('');
                                  setSigningSuccess('');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1"
                              >
                                <PenTool className="w-3 h-3" />
                                <span>Sign</span>
                              </button>
                            )}

                            {/* Return for correction */}
                            {cert.status !== 'ISSUED' && cert.status !== 'REVOKED' && (
                              <button
                                onClick={() => {
                                  setReturnCert(cert);
                                  setReturnRemarks('');
                                }}
                                className="p-1.5 rounded-lg bg-[#0c101d] hover:bg-amber-500/20 text-amber-400 transition-colors"
                                title="Return for Correction"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Revoke */}
                            {cert.status === 'ISSUED' && (
                              <button
                                onClick={() => {
                                  setRevokingCert(cert);
                                  setRevokeReason('');
                                }}
                                className="p-1.5 rounded-lg bg-[#0c101d] hover:bg-rose-500/20 text-rose-400 transition-colors"
                                title="Revoke Certificate"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: AIT STUDENT ROSTER VERIFICATION (Genuine Verification Workflow) ── */}
        {activeTab === 'STUDENT_VERIFICATION' && (
          <div className="space-y-4">
            {/* Official Integration Card */}
            <div className="p-5 rounded-2xl bg-[#0c101d] border border-amber-500/30 space-y-3">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Genuine AIT Pune Student Verification Protocol</span>
                    <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono">
                      https://www.aitpune.com/
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    AIT Pune does not provide a public OpenID Connect/OAuth2 endpoint on the open web. To safeguard institutional security without scraping private student portals or collecting passwords, CompetiHub enforces a strict <strong>Pending-Verification Workflow</strong>.
                  </p>
                  <div className="p-3 rounded-xl bg-[#111728] border border-[#1e293b] text-[11px] text-slate-300 space-y-1 mt-2">
                    <p className="font-bold text-amber-300">Required AIT IT Department Integration:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                      <li>Microsoft 365 Azure AD SSO (Tenant Domain: <code className="text-sky-300">aitpune.edu.in</code>)</li>
                      <li>Authorized Student Enrollment Roster Read-Replica API from AIT IT Office</li>
                    </ul>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Until direct IT federation is provisioned, the General Secretary verifies enrolled student identity records against the verified 2025-26 academic roster below.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {[
                { id: 'ALL', label: 'All Students' },
                { id: 'PENDING_AIT_VERIFICATION', label: `Pending Verification (${pendingStudents.length})` },
                { id: 'VERIFIED', label: 'Verified Students' },
                { id: 'REJECTED', label: 'Rejected' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setVerificationFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    verificationFilter === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-[#111728] text-slate-400 hover:text-white border border-[#1e293b]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Student Table */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-[#1e293b] text-slate-400 text-[10px] uppercase font-bold tracking-wider bg-[#0c101d]">
                      <th className="py-3 px-3">Student Name & Roll</th>
                      <th className="py-3 px-3">Registration Number</th>
                      <th className="py-3 px-3">College Email</th>
                      <th className="py-3 px-3">Branch & Verified Year</th>
                      <th className="py-3 px-3">Roster Status</th>
                      <th className="py-3 px-3 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-bold text-white">{student.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Roll: {student.aitRollNo}</p>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-300">{student.aitRegNo}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-sky-400">{student.collegeEmail}</td>
                        <td className="py-3 px-3">
                          <p className="text-slate-200">{student.branch}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                              Year {student.yearOfStudy || 1}
                            </span>
                            <span className="text-[10px] text-slate-500">Grad: {student.graduationYear}</span>
                            {student.isYearVerified && (
                              <span title="Verified Roster Record">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {student.verificationStatus === 'VERIFIED' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3 h-3" /> Verified Student
                            </span>
                          ) : student.verificationStatus === 'PENDING_AIT_VERIFICATION' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-max">
                              <Clock className="w-3 h-3" /> Pending Verification
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-max">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {student.verificationStatus !== 'VERIFIED' && (
                              <button
                                onClick={() => generalSecretaryVerifyStudent(student.id, true)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                              >
                                Approve Roster
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setCorrectingStudent(student);
                                setCorrectGradYear(student.graduationYear);
                                setCorrectStudyYear(student.yearOfStudy || 1);
                                setCorrectReason('');
                                setCorrectError('');
                                setCorrectSuccess('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#0c101d] border border-[#1e293b] hover:border-slate-500 text-slate-300 hover:text-white font-bold text-[10px]"
                            >
                              Correct Record
                            </button>

                            {student.verificationStatus !== 'REJECTED' && (
                              <button
                                onClick={() => {
                                  setStudentRejectModal(student.id);
                                  setStudentRejectReason('');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[10px]"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Academic Year Corrections Audit Trail */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Academic Year Corrections Audit Trail
              </h4>
              <p className="text-[11px] text-slate-400">
                Immutable audit log of all manual corrections to student graduation years and academic study status.
              </p>

              {academicYearCorrections.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No academic record corrections recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c101d] text-slate-400 uppercase text-[10px] border-b border-[#1e293b]">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Student Name & Roll</th>
                        <th className="p-3">Previous Record</th>
                        <th className="p-3">Corrected Record</th>
                        <th className="p-3">Justification Reason</th>
                        <th className="p-3">Corrected By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b] text-slate-300">
                      {academicYearCorrections.map((corr) => (
                        <tr key={corr.id} className="hover:bg-slate-800/20">
                          <td className="p-3 font-mono text-[10px] text-slate-400">
                            {new Date(corr.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-white">{corr.studentName}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">Roll: {corr.studentRollNo}</span>
                          </td>
                          <td className="p-3 text-rose-300">
                            Year {corr.previousYearOfStudy} (Grad {corr.previousGraduationYear})
                          </td>
                          <td className="p-3 text-emerald-300 font-bold">
                            Year {corr.newYearOfStudy} (Grad {corr.newGraduationYear})
                          </td>
                          <td className="p-3 max-w-[200px] truncate text-slate-300">{corr.reason}</td>
                          <td className="p-3 text-slate-400">{corr.correctedByName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 5: ALL CLUBS ── */}
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

        {/* ── TAB 6: RESULTS APPROVAL ── */}
        {activeTab === 'RESULTS_APPROVAL' && (
          <div className="space-y-6">
            {/* Competitions Awaiting Verification */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Competitions Awaiting Official Results Publication
                </h3>
                <p className="text-xs text-slate-400">
                  Podium rankings submitted by Club Secretaries. Approval officially publishes results to the platform, updates achievements, and enqueues certificates for cryptographic signing.
                </p>
              </div>

              {competitions.filter((c) => c.resultsStatus === 'PENDING_VERIFICATION').length === 0 ? (
                <div className="p-6 rounded-xl bg-[#0c101d] border border-[#1e293b] text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  No pending competition results awaiting verification.
                </div>
              ) : (
                <div className="space-y-4">
                  {competitions
                    .filter((c) => c.resultsStatus === 'PENDING_VERIFICATION')
                    .map((comp) => {
                      const compProposedResults = results.filter((r) => r.competitionId === comp.id);
                      return (
                        <div
                          key={comp.id}
                          className="p-5 rounded-xl bg-[#0c101d] border border-amber-500/40 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e293b] pb-3">
                            <div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                                Pending Verification
                              </span>
                              <h4 className="text-base font-bold text-white mt-1">{comp.title}</h4>
                              <p className="text-xs text-slate-400">Organized by {comp.clubName}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => verifyAndPublishResults(comp.id, true)}
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve & Publish Official Results
                              </button>

                              <button
                                onClick={() => {
                                  setReturnCompModal(comp.id);
                                  setReturnCompReason('');
                                }}
                                className="px-3.5 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Return for Correction
                              </button>
                            </div>
                          </div>

                          {/* Proposed Winners */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                            {compProposedResults.map((r) => (
                              <div
                                key={r.id}
                                className="p-3 rounded-xl bg-[#111728] border border-[#1e293b] space-y-1"
                              >
                                <span className="text-[10px] font-bold text-amber-400 block">
                                  {r.awardTitle}
                                </span>
                                <p className="font-bold text-white text-xs">{r.teamName}</p>
                                <p className="text-[10px] text-slate-400">
                                  Members: {r.members.map((m) => m.name).join(', ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Published Results Table */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Officially Published Merit Results</h3>
                  <p className="text-xs text-slate-400">Verified rankings visible on public leaderboard and podium.</p>
                </div>
              </div>

              <div className="divide-y divide-[#1e293b]">
                {results.filter((r) => r.isVerified).length === 0 ? (
                  <p className="py-4 text-xs text-slate-500 italic">No published official results declared yet.</p>
                ) : (
                  results
                    .filter((r) => r.isVerified)
                    .map((r) => (
                      <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{r.teamName}</span>
                            <span className="text-xs font-semibold text-amber-400">({r.awardTitle})</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">Event: {r.competitionTitle}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Team: {r.members.map((m) => `${m.name} (${m.aitRollNo})`).join(', ')}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Published & Verified
                          </span>

                          <button
                            onClick={() => {
                              setCorrectingResult(r);
                              setNewAwardTitle(r.awardTitle);
                              setNewRankPos(r.rankPosition || 1);
                              setResCorrectionReason('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#0c101d] border border-[#1e293b] hover:border-slate-500 text-slate-300 hover:text-white text-[10px] font-semibold"
                          >
                            Audit Correct Result
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Results Correction Audit Log */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                Published Results Correction Audit Log
              </h4>
              <p className="text-[11px] text-slate-400">
                Audited records of any administrative corrections to published competition awards.
              </p>

              {resultCorrectionLogs.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No result corrections recorded.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0c101d] text-slate-400 uppercase text-[10px] border-b border-[#1e293b]">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Competition</th>
                        <th className="p-3">Team</th>
                        <th className="p-3">Original Award</th>
                        <th className="p-3">Corrected Award</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3">Authorized By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b] text-slate-300">
                      {resultCorrectionLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/20">
                          <td className="p-3 font-mono text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="p-3 font-bold text-white">{log.competitionTitle}</td>
                          <td className="p-3">{log.originalTeamName}</td>
                          <td className="p-3 text-rose-300">{log.originalAward}</td>
                          <td className="p-3 text-emerald-300 font-bold">{log.newAward}</td>
                          <td className="p-3 text-slate-300">{log.reason}</td>
                          <td className="p-3 text-slate-400">{log.responsibleUserName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 7: PRIORITY NOTICE BOARD ── */}
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

        {/* ── TAB 8: APPOINT CLUB SECRETARIES ── */}
        {activeTab === 'APPOINT_CLUB_SEC' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  Appoint Club Secretary
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  General Secretary prerogative to appoint technical heads as Club Secretaries.
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

      {/* ── Signing Modal ── */}
      {signingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-rose-500/40 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">General Secretary Cryptographic E-Sign</h3>
                <p className="text-xs text-slate-400">Apply verified SHA-256 digital stamp</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111728] border border-[#1e293b] space-y-1.5 text-xs">
              <p><span className="text-slate-400">Recipient:</span> <strong className="text-white">{signingCert.recipientName}</strong></p>
              <p><span className="text-slate-400">Roll No:</span> <strong className="text-white">{signingCert.recipientRollNo}</strong></p>
              <p><span className="text-slate-400">Event:</span> <strong className="text-white">{signingCert.competitionTitle}</strong></p>
              <p><span className="text-slate-400">Award:</span> <strong className="text-rose-400">{signingCert.title}</strong></p>
            </div>

            {signingError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {signingError}
              </div>
            )}
            {signingSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                {signingSuccess}
              </div>
            )}

            <form onSubmit={handleExecuteSign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  General Secretary PIN
                </label>
                <input
                  type="password"
                  value={signingPin}
                  onChange={(e) => setSigningPin(e.target.value)}
                  placeholder="Enter PIN (Default: ait@gs2026)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSigningCert(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSigning}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-50"
                >
                  {isSigning ? 'Signing...' : 'Authorize & Sign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Return for Correction Modal ── */}
      {returnCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-amber-500/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              Return Certificate for Correction
            </h3>
            <p className="text-xs text-slate-400">
              Returning certificate for {returnCert.recipientName} ({returnCert.competitionTitle}). The Club Secretary will be notified to revise details.
            </p>

            <form onSubmit={handleExecuteReturn} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Correction Remarks</label>
                <textarea
                  rows={3}
                  value={returnRemarks}
                  onChange={(e) => setReturnRemarks(e.target.value)}
                  placeholder="e.g. Please verify spelling of team members or update project demonstration link..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReturnCert(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Confirm Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Revoke Modal ── */}
      {revokingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-rose-500/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Ban className="w-4 h-4 text-rose-400" />
              Revoke Issued Certificate
            </h3>
            <p className="text-xs text-slate-400">
              Revoking certificate <strong className="text-white">{revokingCert.certificateNumber}</strong> for {revokingCert.recipientName}. This action will be recorded in institutional audit logs.
            </p>

            <form onSubmit={handleExecuteRevoke} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Revocation</label>
                <textarea
                  rows={3}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="e.g. Disqualification after academic review or code duplication violation..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRevokingCert(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Confirm Revocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Student Reject Modal ── */}
      {studentRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-rose-500/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              Reject Student Verification Request
            </h3>
            <p className="text-xs text-slate-400">
              Specify reason for rejecting student verification against the official academic roster.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                generalSecretaryVerifyStudent(studentRejectModal, false, studentRejectReason);
                setStudentRejectModal(null);
                setStudentRejectReason('');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mismatch Details</label>
                <textarea
                  rows={3}
                  value={studentRejectReason}
                  onChange={(e) => setStudentRejectReason(e.target.value)}
                  placeholder="e.g. Registration number does not match 2025-26 academic roster..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStudentRejectModal(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Student Academic Year Correction Modal ── */}
      {correctingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-amber-500/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Administrative Academic Year Correction
            </h3>
            <p className="text-xs text-slate-400">
              Modifying official records for <strong className="text-white">{correctingStudent.fullName}</strong> (Roll: {correctingStudent.aitRollNo}). This change will create an immutable audit record.
            </p>

            {correctError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {correctError}
              </div>
            )}
            {correctSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                {correctSuccess}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCorrectError('');
                setCorrectSuccess('');

                if (!correctReason.trim()) {
                  setCorrectError('A mandatory justification reason is required for correcting official academic records.');
                  return;
                }

                const res = adminCorrectStudentYear(
                  correctingStudent.id,
                  Number(correctGradYear),
                  Number(correctStudyYear),
                  correctReason.trim()
                );

                if (res.success) {
                  setCorrectSuccess('Academic record updated and audit log committed.');
                  setTimeout(() => {
                    setCorrectingStudent(null);
                    setCorrectSuccess('');
                  }, 1200);
                } else {
                  setCorrectError(res.error || 'Failed to correct record.');
                }
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Graduation Year</label>
                  <select
                    value={correctGradYear}
                    onChange={(e) => setCorrectGradYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                  >
                    {[2025, 2026, 2027, 2028, 2029].map((yr) => (
                      <option key={yr} value={yr}>
                        Class of {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Year of Study</label>
                  <select
                    value={correctStudyYear}
                    onChange={(e) => setCorrectStudyYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                  >
                    <option value={1}>1st Year (FE)</option>
                    <option value={2}>2nd Year (SE)</option>
                    <option value={3}>3rd Year (TE)</option>
                    <option value={4}>4th Year (BE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Official Justification / Audit Reason</label>
                <textarea
                  rows={3}
                  required
                  value={correctReason}
                  onChange={(e) => setCorrectReason(e.target.value)}
                  placeholder="e.g. Verified with AIT Academic Section roster or year-down correction..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCorrectingStudent(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save & Commit Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Return Competition Results Modal ── */}
      {returnCompModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-rose-500/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Return Competition Results for Correction
            </h3>
            <p className="text-xs text-slate-400">
              The Club Secretary will receive this feedback and will be required to rectify the podium before resubmission.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!returnCompReason.trim()) return;
                verifyAndPublishResults(returnCompModal, false, returnCompReason.trim());
                setReturnCompModal(null);
                setReturnCompReason('');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mandatory Correction Notes</label>
                <textarea
                  rows={3}
                  required
                  value={returnCompReason}
                  onChange={(e) => setReturnCompReason(e.target.value)}
                  placeholder="e.g. 2nd place team contains member who was not registered for this hackathon track..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReturnCompModal(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Return to Club Secretary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Published Result Correction Modal ── */}
      {correctingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0c101d] border border-indigo-500/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              Correct Published Official Result
            </h3>
            <p className="text-xs text-slate-400">
              Correcting official result for <strong className="text-white">{correctingResult.teamName}</strong> in {correctingResult.competitionTitle}.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!resCorrectionReason.trim()) return;
                correctPublishedResult(
                  correctingResult.id,
                  newAwardTitle.trim(),
                  Number(newRankPos),
                  resCorrectionReason.trim()
                );
                setCorrectingResult(null);
                setResCorrectionReason('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Award Title</label>
                <input
                  type="text"
                  required
                  value={newAwardTitle}
                  onChange={(e) => setNewAwardTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Rank Position</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={newRankPos}
                  onChange={(e) => setNewRankPos(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Correction Reason (Mandatory Audit)</label>
                <textarea
                  rows={3}
                  required
                  value={resCorrectionReason}
                  onChange={(e) => setResCorrectionReason(e.target.value)}
                  placeholder="e.g. Corrected typo in award category as per organizing jury consensus..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCorrectingResult(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Certificate Preview Modal ── */}
      {previewCert && (
        <CertificateModal
          certificate={previewCert}
          onClose={() => setPreviewCert(null)}
        />
      )}
    </DashboardShell>
  );
}
