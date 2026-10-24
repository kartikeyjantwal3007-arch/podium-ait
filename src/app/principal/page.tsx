'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import CertificateModal from '@/components/CertificateModal';
import CertificateDocument from '@/components/CertificateDocument';
import { useAppStore } from '@/lib/store';
import { Certificate, SignatureMode } from '@/lib/types';
import { 
  PenTool, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Layers, 
  Lock, 
  Sparkles, 
  ArrowRight,
  Info,
  Check
} from 'lucide-react';

export default function PrincipalPortalPage() {
  const { 
    currentUser, 
    certificates, 
    approveCertificate, 
    rejectCertificate, 
    batchApproveCertificates,
    auditLogs 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'SIGNED' | 'AUDIT' | 'SETTINGS'>('QUEUE');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [signingMode, setSigningMode] = useState<SignatureMode>('MODE_A_IMAGE_SEAL');
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);
  const [showBatchConfirmModal, setShowBatchConfirmModal] = useState(false);
  const [rejectingCertId, setRejectingCertId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Principal & Director authorization check
  const isAuthorized = currentUser.role === 'PRINCIPAL' || currentUser.role === 'DIRECTOR';

  // Certificate queues
  const pendingQueue = certificates.filter(c => c.status === 'UNDER_REVIEW' || c.status === 'SUBMITTED');
  const signedIssuedList = certificates.filter(c => c.status === 'ISSUED' || c.status === 'SIGNED');
  const rejectedList = certificates.filter(c => c.status === 'REJECTED');

  // Summary Metrics
  const pendingCount = pendingQueue.length;
  const signedCount = signedIssuedList.filter(c => c.signatureMode !== 'PENDING').length;
  const issuedCount = signedIssuedList.length;
  const rejectedCount = rejectedList.length;

  const handleSelectAll = () => {
    if (selectedCertIds.length === pendingQueue.length) {
      setSelectedCertIds([]);
    } else {
      setSelectedCertIds(pendingQueue.map(c => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedCertIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const executeBatchApproval = () => {
    batchApproveCertificates(selectedCertIds, signingMode);
    setSelectedCertIds([]);
    setShowBatchConfirmModal(false);
    alert(`Successfully approved & signed ${selectedCertIds.length} certificates via ${signingMode}. Notifications dispatched to students.`);
  };

  const executeReject = () => {
    if (!rejectingCertId || !rejectReason.trim()) return;
    rejectCertificate(rejectingCertId, rejectReason.trim());
    setRejectingCertId(null);
    setRejectReason('');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080B14]">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="max-w-md w-full p-8 rounded-3xl bg-[#0D1220] border border-rose-500/30 text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Principal Signer Clearance Required</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                You are currently signed in as <strong className="text-purple-300">{currentUser.fullName} ({currentUser.role})</strong>. This interface is strictly restricted to the Principal & Director of Army Institute of Technology, Pune.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 text-left">
                <strong>Evaluation Helper: </strong> Use the Role Switcher in the top navigation bar or click below to switch to Brig. (Dr.) S. K. Joshi.
              </div>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider"
              >
                Switch Role via Top Navbar
              </button>
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
          <div className="rounded-3xl bg-gradient-to-r from-amber-950/30 via-[#121A2B] to-[#0D1220] border border-amber-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Supreme Institutional Signatory
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-xs text-slate-400">AIT Pune Director Office</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Principal&apos;s Certificate Approval Portal
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Review verified competition winners, inspect certificate wording, and authorise cryptographic or seal-stamped certificate issuance.
                </p>
              </div>

              {/* Signing Mode Selector */}
              <div className="p-3 rounded-2xl bg-[#080B14]/80 border border-slate-700 space-y-1.5 shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Active Signing Mode:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSigningMode('MODE_A_IMAGE_SEAL')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      signingMode === 'MODE_A_IMAGE_SEAL'
                        ? 'bg-amber-500 text-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Mode A: Seal & Signature
                  </button>
                  <button
                    onClick={() => setSigningMode('MODE_B_CRYPTOGRAPHIC_PDF')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      signingMode === 'MODE_B_CRYPTOGRAPHIC_PDF'
                        ? 'bg-sky-500 text-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Mode B: Cryptographic PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Dashboard Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400">Pending Approvals</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{pendingCount}</p>
              <p className="text-[10px] text-amber-300 mt-0.5">Awaiting Review</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400">Certificates Signed</span>
              <p className="text-2xl sm:text-3xl font-black text-sky-400 mt-1">{signedCount}</p>
              <p className="text-[10px] text-sky-300 mt-0.5">Cryptographically Sealed</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400">Certificates Issued</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{issuedCount}</p>
              <p className="text-[10px] text-emerald-300 mt-0.5">Live for Students</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400">Rejected / Returned</span>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{rejectedCount}</p>
              <p className="text-[10px] text-rose-300 mt-0.5">Returned to Organiser</p>
            </div>
          </div>

          {/* Portal Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('QUEUE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'QUEUE'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Approval Queue</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('SIGNED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'SIGNED'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Signed & Issued ({issuedCount})
            </button>

            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'AUDIT'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Signer Audit Trail
            </button>
          </div>

          {/* Tab 1: Approval Queue */}
          {activeTab === 'QUEUE' && (
            <div className="space-y-4">
              
              {/* Batch Actions Bar */}
              {pendingQueue.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#0D1220] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSelectAll}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                    >
                      {selectedCertIds.length === pendingQueue.length ? 'Deselect All' : 'Select All In Batch'}
                    </button>
                    <span className="text-xs text-slate-400">
                      {selectedCertIds.length} of {pendingQueue.length} selected for batch signing
                    </span>
                  </div>

                  {selectedCertIds.length > 0 && (
                    <button
                      onClick={() => setShowBatchConfirmModal(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-950/40 flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4" />
                      <span>Batch Sign ({selectedCertIds.length}) Certificates</span>
                    </button>
                  )}
                </div>
              )}

              {/* Queue List */}
              {pendingQueue.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0D1220] border border-slate-800 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-sm font-bold text-white">Queue Empty: All Certificates Processed</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    There are no pending certificate requests awaiting principal sign-off at this time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingQueue.map((cert) => {
                    const isSelected = selectedCertIds.includes(cert.id);

                    return (
                      <div
                        key={cert.id}
                        className={`p-5 rounded-2xl bg-[#121A2B] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isSelected ? 'border-amber-500/80 bg-amber-950/10' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(cert.id)}
                            className="mt-1 w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                          />

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{cert.recipientName}</span>
                              <span className="text-[10px] font-mono text-slate-400">({cert.certificateNumber})</span>
                            </div>
                            <p className="text-xs font-semibold text-purple-300">{cert.title}</p>
                            <p className="text-xs text-slate-400">{cert.competitionTitle}</p>
                            <p className="text-[11px] text-slate-500 italic max-w-xl line-clamp-1">{cert.awardText}</p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          <button
                            onClick={() => setSelectedCert(cert)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-400" />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => {
                              approveCertificate(cert.id, signingMode);
                              alert(`Certificate ${cert.certificateNumber} officially approved & signed via ${signingMode}!`);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-sm"
                          >
                            Approve & Sign
                          </button>

                          <button
                            onClick={() => setRejectingCertId(cert.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30"
                          >
                            Return
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* Tab 2: Signed & Issued */}
          {activeTab === 'SIGNED' && (
            <div className="space-y-3">
              {signedIssuedList.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{cert.recipientName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                        Issued
                      </span>
                    </div>
                    <p className="text-xs text-purple-300 font-semibold">{cert.title} • {cert.competitionTitle}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Signed: {cert.signedAt ? new Date(cert.signedAt).toLocaleString() : 'Recent'} | Fingerprint: {cert.signatureHash?.substring(0, 32)}...
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-xs font-semibold text-slate-200 hover:text-white transition-colors self-end md:self-auto"
                  >
                    Inspect Document
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Signer Audit Trail */}
          {activeTab === 'AUDIT' && (
            <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Immutable Institutional Signature Logs</h3>
              <div className="space-y-3">
                {auditLogs.filter(l => l.targetType === 'CERTIFICATE' || l.actorRole === 'PRINCIPAL').map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400">{log.action}</span>
                      <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-300">{log.details}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Actor: {log.actorName} ({log.actorRole})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Batch Approval Confirmation Modal */}
      {showBatchConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D1220] border border-slate-700 p-6 rounded-2xl max-w-lg w-full space-y-4">
            <h3 className="text-base font-bold text-white">Confirm Batch Signature Execution</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are about to approve and stamp <strong className="text-amber-400 font-bold">{selectedCertIds.length} certificates</strong> using <strong className="text-purple-300 font-mono">{signingMode}</strong>.
            </p>

            <div className="max-h-48 overflow-y-auto divide-y divide-slate-800 border border-slate-800 rounded-xl p-2 bg-slate-900/60">
              {pendingQueue.filter(c => selectedCertIds.includes(c.id)).map(c => (
                <div key={c.id} className="py-1.5 text-xs text-slate-300 flex justify-between">
                  <span>{c.recipientName}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{c.certificateNumber}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
              Security note: This operation is non-reversible and creates permanent audit logs credited to your principal credentials.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBatchConfirmModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeBatchApproval}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold"
              >
                Confirm & Sign All {selectedCertIds.length} Certificates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection / Correction Modal */}
      {rejectingCertId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D1220] border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-3">
            <h3 className="text-base font-bold text-white">Return Certificate for Correction</h3>
            <p className="text-xs text-slate-400">
              Specify the reason for returning this certificate request to the competition organiser.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Spelling correction required in recipient roll number, or rank category requires re-verification."
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingCertId(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeReject}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal Preview */}
      <CertificateModal
        certificate={selectedCert}
        isOpen={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
