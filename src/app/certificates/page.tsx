'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Certificate } from '@/lib/types';
import { 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Download, 
  Printer, 
  Eye, 
  ShieldCheck,
  UploadCloud,
  X
} from 'lucide-react';

export default function CertificatesPage() {
  const { currentUser, certificates } = useAppStore();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadIssuer, setUploadIssuer] = useState('');

  // Certificates for current student
  const studentCerts = certificates.filter(c => c.studentId === currentUser.id);

  const totalCount = studentCerts.length;
  const issuedCount = studentCerts.filter(c => c.status === 'ISSUED').length;
  const pendingCount = studentCerts.filter(c => c.status === 'PENDING_REVIEW' || c.status === 'PENDING_SIGNATURE' || c.status === 'APPROVED' || c.status === 'RETURNED_FOR_CORRECTION').length;
  const rejectedCount = studentCerts.filter(c => c.status === 'REJECTED' || c.status === 'REVOKED').length;

  const handleExternalUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('External certificate submitted! It will appear with label "USER-SUBMITTED (Pending Review)" until certified by the academic office.');
    setShowUploadModal(false);
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
                <FileCheck2 className="w-4 h-4" />
                <span>Authorized Institutional Credentials</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                My Official Certificates Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                All certificates issued, under General Secretary review, or verified with cryptographic non-guessable tokens.
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 self-start md:self-auto transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-purple-400" />
              <span>Upload External Certificate</span>
            </button>
          </div>

          {/* 4 Required Summary Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400">Total Certificates</span>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalCount}</p>
              <p className="text-[10px] text-purple-300 mt-0.5">Assigned to Account</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400">Officially Issued</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{issuedCount}</p>
              <p className="text-[10px] text-emerald-300 mt-0.5">Principal Authorized</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400">Pending Approval</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{pendingCount}</p>
              <p className="text-[10px] text-amber-300 mt-0.5">In Signer Queue</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 shadow-lg">
              <span className="text-xs text-slate-400">Rejected / Returned</span>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{rejectedCount}</p>
              <p className="text-[10px] text-rose-300 mt-0.5">Requires Correction</p>
            </div>
          </div>

          {/* Certificates Listing Cards */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Issued & Pending Credentials</h2>

            {studentCerts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0D1220] border border-slate-800 text-slate-400 text-sm">
                No certificates have been issued yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentCerts.map((cert) => {
                  const isIssued = cert.status === 'ISSUED';

                  return (
                    <div
                      key={cert.id}
                      className={`rounded-2xl p-6 bg-[#121A2B] border flex flex-col justify-between space-y-5 transition-all shadow-xl ${
                        isIssued ? 'border-purple-500/40' : 'border-slate-800/90'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block">
                              ID: {cert.certificateNumber}
                            </span>
                            <h3 className="font-bold text-base text-white mt-1">{cert.title}</h3>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isIssued
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : cert.status === 'REJECTED'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {cert.status.replace('_', ' ')}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 font-medium">
                          Event: <span className="text-purple-300">{cert.competitionTitle}</span>
                        </p>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {cert.awardText}
                        </p>

                        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Conferment Date:</span>
                            <span className="text-slate-300 font-semibold">{cert.issueDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Signer Authority:</span>
                            <span className="text-slate-300">{cert.signerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Signature Mode:</span>
                            <span className="text-purple-300 font-mono text-[11px]">{cert.signatureMode}</span>
                          </div>
                        </div>

                        {cert.rejectionReason && (
                          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                            <strong>Correction Note: </strong>{cert.rejectionReason}
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCert(cert)}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View & Download</span>
                          </button>

                          <Link
                            href={`/verify?token=${cert.verificationToken}`}
                            target="_blank"
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1"
                            title="Inspect public authenticity"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="hidden sm:inline">Verify</span>
                          </Link>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono">
                          {cert.verificationToken.substring(0, 10)}...
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </main>
      </div>

      {/* External Certificate Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D1220] border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Upload External Achievement</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 leading-relaxed">
              <strong>Institutional Policy: </strong> External documents are labelled <span className="underline">USER-SUBMITTED</span> until verified against official issuing registries by the AIT academic coordinator.
            </div>

            <form onSubmit={handleExternalUploadSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Award Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. ACM ICPC Regional Finalist"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={uploadIssuer}
                  onChange={(e) => setUploadIssuer(e.target.value)}
                  placeholder="e.g. ACM / IEEE / IIT Bombay"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  required
                />
              </div>

              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center text-xs text-slate-400 hover:border-purple-500 cursor-pointer transition-colors">
                <UploadCloud className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p>Click to attach PDF document (max 5MB)</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  Submit for Roster Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Preview & Print Modal */}
      <CertificateModal
        certificate={selectedCert}
        isOpen={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
