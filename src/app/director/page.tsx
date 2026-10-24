'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Certificate } from '@/lib/types';
import {
  Award,
  PenTool,
  Trophy,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Key,
  ExternalLink,
  ChevronRight,
  Sparkles,
  XCircle,
} from 'lucide-react';

export default function DirectorPage() {
  const {
    currentUser,
    competitions,
    clubs,
    results,
    certificates,
    auditLogs,
    directorSignCertificate,
    rejectCertificate,
    batchDirectorSignCertificates,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'PODIUM_TABLE' | 'SIGNING_QUEUE' | 'SIGNED_ARCHIVE' | 'AUDIT_LOGS'>('PODIUM_TABLE');

  // Filters for Podium Overview
  const [selectedClubFilter, setSelectedClubFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Signing modal state
  const [signingCert, setSigningCert] = useState<Certificate | null>(null);
  const [signingPin, setSigningPin] = useState('');
  const [signingError, setSigningError] = useState('');
  const [signingSuccess, setSigningSuccess] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  // Rejection modal state
  const [rejectingCert, setRejectingCert] = useState<Certificate | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Certificate document preview modal
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  // Metric values
  const totalPodiumHolders = results.length;
  const certificatesAwaiting = certificates.filter(
    (c) => c.status === 'PENDING_SIGNATURE' || c.status === 'PENDING_REVIEW' || c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW'
  );
  const certificatesSigned = certificates.filter((c) => c.status === 'ISSUED');

  // Group results by competition for the requested podium table:
  // Hackathon Name | Club | First Place | Second Place | Third Place | Certificate Status
  const competitionsWithResults = competitions.map((comp) => {
    const compResults = results.filter((r) => r.competitionId === comp.id);
    const first = compResults.find((r) => r.rankPosition === 1);
    const second = compResults.find((r) => r.rankPosition === 2);
    const third = compResults.find((r) => r.rankPosition === 3);

    const compCerts = certificates.filter((c) => c.competitionId === comp.id);
    const hasUnsigned = compCerts.some((c) => c.status !== 'ISSUED');
    const certStatus = compCerts.length === 0 ? 'NOT_GENERATED' : hasUnsigned ? 'PENDING_DIRECTOR' : 'OFFICIALLY_SIGNED';

    return {
      comp,
      first,
      second,
      third,
      certCount: compCerts.length,
      certStatus,
    };
  });

  const filteredPodiumEntries = competitionsWithResults.filter((entry) => {
    const matchClub = selectedClubFilter === 'ALL' || entry.comp.clubId === selectedClubFilter || entry.comp.clubName?.includes(selectedClubFilter);
    const matchSearch = searchQuery === '' || entry.comp.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClub && matchSearch;
  });

  const handleExecuteDirectorSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingCert) return;
    setSigningError('');
    setSigningSuccess('');

    if (signingPin !== '1989' && signingPin !== '2026') {
      setSigningError('Invalid Director Authorization PIN. Please enter your confidential PIN.');
      return;
    }

    setIsSigning(true);

    setTimeout(() => {
      const res = directorSignCertificate(signingCert.id, signingPin);
      setIsSigning(false);

      if (res.success) {
        setSigningSuccess(`Certificate cryptographically stamped with SHA-256 seal: ${res.signatureHash?.substring(0, 24)}...`);
        setTimeout(() => {
          setSigningCert(null);
          setSigningPin('');
          setSigningSuccess('');
        }, 1200);
      } else {
        setSigningError(res.error || 'Cryptographic signing failed.');
      }
    }, 700);
  };

  const handleExecuteRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingCert) return;
    if (!rejectionReason.trim()) return;

    rejectCertificate(rejectingCert.id, rejectionReason.trim());
    setRejectingCert(null);
    setRejectionReason('');
  };

  const handleBatchSignAll = () => {
    const ids = certificatesAwaiting.map((c) => c.id);
    batchDirectorSignCertificates(ids);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* ── Director Directorate Header ── */}
        <div className="p-6 rounded-3xl bg-[#0c101d] border border-[#1a2236] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-950/40 shrink-0">
                <Award className="w-8 h-8 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">Directorate & Principal Authority</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Supreme Institutional Officer
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {currentUser.fullName} • Official Institutional Seal, Podium Verification & Cryptographic E-Signature Authority.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {certificatesAwaiting.length > 0 && (
                <button
                  onClick={handleBatchSignAll}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-950/30 flex items-center gap-1.5"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  Batch Sign All ({certificatesAwaiting.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── High-Level Statistics Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Hackathons</p>
            <p className="text-2xl font-black text-white mt-1">{competitions.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Technical Clubs</p>
            <p className="text-2xl font-black text-indigo-400 mt-1">{clubs.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Podium Winners</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{totalPodiumHolders}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111728] border border-amber-500/40 bg-amber-950/10">
            <p className="text-[10px] text-amber-300 font-semibold uppercase">Awaiting Signature</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{certificatesAwaiting.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111728] border border-emerald-500/40 bg-emerald-950/10">
            <p className="text-[10px] text-emerald-300 font-semibold uppercase">Signed & Issued</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{certificatesSigned.length}</p>
          </div>
        </div>

        {/* ── Tabs Navigation ── */}
        <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 overflow-x-auto">
          {[
            { id: 'PODIUM_TABLE', label: 'All Podium Holders Overview' },
            { id: 'SIGNING_QUEUE', label: `Certificate Approval Queue (${certificatesAwaiting.length})` },
            { id: 'SIGNED_ARCHIVE', label: `Signed & Issued Certificates (${certificatesSigned.length})` },
            { id: 'AUDIT_LOGS', label: 'Institutional Audit Logs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: ALL PODIUM HOLDERS OVERVIEW (Structured Table required by user) ── */}
        {activeTab === 'PODIUM_TABLE' && (
          <div className="space-y-4">
            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#111728] border border-[#1e293b]">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter competitions..."
                  className="bg-[#0c101d] border border-[#1e293b] px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 w-full sm:w-56"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedClubFilter}
                  onChange={(e) => setSelectedClubFilter(e.target.value)}
                  className="bg-[#0c101d] border border-[#1e293b] px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Technical Clubs</option>
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table: Hackathon Name | Club | First Place | Second Place | Third Place | Certificate Status */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c101d] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1e293b]">
                    <tr>
                      <th className="p-4">Hackathon Name</th>
                      <th className="p-4">Host Club</th>
                      <th className="p-4 text-amber-400">First Place (Gold)</th>
                      <th className="p-4 text-slate-300">Second Place (Silver)</th>
                      <th className="p-4 text-amber-600">Third Place (Bronze)</th>
                      <th className="p-4">Certificate Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b] text-slate-300">
                    {filteredPodiumEntries.map((item) => (
                      <tr key={item.comp.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <Link href={`/competitions/${item.comp.slug}`} className="font-bold text-white hover:text-amber-400 flex items-center gap-1.5">
                            {item.comp.title}
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </Link>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{item.comp.category}</span>
                        </td>

                        <td className="p-4 font-medium text-slate-300">
                          {item.comp.clubName || 'Design & Innovation Club'}
                        </td>

                        <td className="p-4">
                          {item.first ? (
                            <div>
                              <span className="font-bold text-amber-400">{item.first.teamName}</span>
                              <span className="text-[10px] text-slate-400 block">{item.first.projectTitle || 'Urban Oasis'}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Pending Declaration</span>
                          )}
                        </td>

                        <td className="p-4">
                          {item.second ? (
                            <div>
                              <span className="font-bold text-slate-200">{item.second.teamName}</span>
                              <span className="text-[10px] text-slate-400 block">{item.second.projectTitle || 'MedBot'}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Pending Declaration</span>
                          )}
                        </td>

                        <td className="p-4">
                          {item.third ? (
                            <div>
                              <span className="font-bold text-amber-600">{item.third.teamName}</span>
                              <span className="text-[10px] text-slate-400 block">{item.third.projectTitle || 'Campus Navigator'}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Pending Declaration</span>
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.certStatus === 'OFFICIALLY_SIGNED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : item.certStatus === 'PENDING_DIRECTOR'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {item.certStatus.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: CERTIFICATE APPROVAL & E-SIGNING QUEUE ── */}
        {activeTab === 'SIGNING_QUEUE' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Certificates Awaiting Director Cryptographic Signature</h3>
                <p className="text-xs text-slate-400">
                  Inspect candidate certificates, verify associated team records, preview document formatting, and digitally sign.
                </p>
              </div>
            </div>

            {certificatesAwaiting.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#111728] border border-[#1e293b] text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                All issued certificates are signed and up-to-date. No pending items in the queue.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificatesAwaiting.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-2xl bg-[#111728] border border-amber-500/30 p-5 space-y-3.5 relative shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-purple-400">{cert.certificateNumber}</span>
                        <h4 className="text-base font-bold text-white mt-1">{cert.recipientName}</h4>
                        <p className="text-xs text-amber-400 font-semibold">{cert.title}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {cert.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-[#0c101d] p-3 rounded-xl border border-[#1e293b]">
                      {cert.awardText}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1e293b] text-xs">
                      <button
                        onClick={() => setPreviewCert(cert)}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Document
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRejectingCert(cert)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSigningCert(cert);
                            setSigningError('');
                            setSigningSuccess('');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-950/20 flex items-center gap-1"
                        >
                          <PenTool className="w-3.5 h-3.5" /> Sign Certificate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: SIGNED & ISSUED ARCHIVE ── */}
        {activeTab === 'SIGNED_ARCHIVE' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Permanently Issued Certificates (Cryptographic Registry)</h3>

            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c101d] text-slate-400 uppercase text-[10px] border-b border-[#1e293b]">
                    <tr>
                      <th className="p-3.5">Certificate No</th>
                      <th className="p-3.5">Recipient</th>
                      <th className="p-3.5">Hackathon</th>
                      <th className="p-3.5">Date Signed</th>
                      <th className="p-3.5">Cryptographic SHA-256 Stamp</th>
                      <th className="p-3.5">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b] text-slate-300">
                    {certificatesSigned.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/20">
                        <td className="p-3.5 font-mono text-purple-400 font-bold">{c.certificateNumber}</td>
                        <td className="p-3.5 font-bold text-white">{c.recipientName}</td>
                        <td className="p-3.5">{c.competitionTitle}</td>
                        <td className="p-3.5 text-slate-400">{c.signedAt ? new Date(c.signedAt).toLocaleDateString() : c.issueDate}</td>
                        <td className="p-3.5 font-mono text-[10px] text-emerald-400">
                          {c.signatureHash ? `${c.signatureHash.substring(0, 26)}...` : 'Institutional Seal'}
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => setPreviewCert(c)}
                            className="p-1 rounded bg-[#0c101d] border border-[#1e293b] text-indigo-400 hover:text-white"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: AUDIT LOGS ── */}
        {activeTab === 'AUDIT_LOGS' && (
          <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Official Institutional Audit Trail</h3>
            <div className="divide-y divide-[#1e293b]">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-purple-400 font-bold">{log.action}</span>
                    <p className="text-slate-300 mt-0.5">{log.details}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Actor: {log.actorName} ({log.actorRole})
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Director Digital Signature Confirmation Modal ── */}
      {signingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#0c101d] border border-amber-500/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Authorize Director Digital Signature</h3>
                <p className="text-[11px] text-slate-400">Recipient: {signingCert.recipientName}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#111728] border border-[#1e293b] text-xs text-slate-300 space-y-1">
              <p><strong>Award:</strong> {signingCert.title}</p>
              <p><strong>Event:</strong> {signingCert.competitionTitle}</p>
              <p><strong>Certificate ID:</strong> {signingCert.certificateNumber}</p>
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

            <form onSubmit={handleExecuteDirectorSignature} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confidential Director Authorization PIN
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={signingPin}
                    onChange={(e) => setSigningPin(e.target.value)}
                    placeholder="Enter Director PIN (Demo PIN: 1989 or 2026)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setSigningCert(null)}
                  className="px-4 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-slate-400 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSigning}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/30"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  {isSigning ? 'Calculating Hash...' : 'Digitally Sign & Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Certificate Rejection Modal ── */}
      {rejectingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#0c101d] border border-rose-500/40 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Reject or Return Certificate</h3>
            <p className="text-xs text-slate-400">
              Provide an official reason for rejection to notify the Club Secretary and recipient student.
            </p>

            <form onSubmit={handleExecuteRejection} className="space-y-3">
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for returning (e.g. Incomplete project documentation or mismatch in student roll number)..."
                className="w-full p-3 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-rose-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setRejectingCert(null)}
                  className="px-4 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-slate-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Document Preview Modal (Reusable Certificate View) ── */}
      {previewCert && (
        <CertificateModal
          certificate={previewCert}
          onClose={() => setPreviewCert(null)}
        />
      )}
    </DashboardShell>
  );
}
