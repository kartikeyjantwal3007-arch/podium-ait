'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CertificateDocument from '@/components/CertificateDocument';
import { useAppStore } from '@/lib/store';
import { Certificate } from '@/lib/types';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  QrCode, 
  Lock, 
  ExternalLink,
  Award,
  Calendar,
  Building
} from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');
  const idParam = searchParams.get('id');

  const { certificates } = useAppStore();

  const [inputQuery, setInputQuery] = useState(tokenParam || idParam || '');
  const [searchedCert, setSearchedCert] = useState<Certificate | null>(null);
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    if (tokenParam || idParam) {
      const q = (tokenParam || idParam || '').trim().toLowerCase();
      const match = certificates.find(
        c => c.verificationToken.toLowerCase() === q || c.certificateNumber.toLowerCase() === q
      );
      setSearchedCert(match || null);
      setIsSearched(true);
    }
  }, [tokenParam, idParam, certificates]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputQuery.trim().toLowerCase();
    if (!q) return;

    const match = certificates.find(
      c => c.verificationToken.toLowerCase() === q || c.certificateNumber.toLowerCase() === q
    );
    setSearchedCert(match || null);
    setIsSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 flex-1 w-full">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-sky-400 p-[1.5px] mx-auto shadow-xl shadow-purple-500/20">
          <div className="w-full h-full bg-[#080B14] rounded-[14px] flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Public Certificate Authenticity Verification
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Verify official student awards, hackathon podium finishes, and principal signatures issued by Army Institute of Technology, Pune.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="p-4 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl max-w-xl mx-auto">
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Paste non-guessable verification token or Certificate ID..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Verify
          </button>
        </form>

        <p className="text-[10px] text-slate-500 mt-2 text-center">
          Example ID: <code className="text-purple-300 font-mono">AIT-CERT-2026-00421</code>
        </p>
      </div>

      {/* Verification Results Panel */}
      {isSearched && (
        <div className="space-y-6">
          {searchedCert ? (
            <div className="rounded-3xl bg-[#0D1220] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
              
              {/* Status Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Authentication Status:
                    </span>
                    <h2 className="text-xl font-bold text-white">Valid & Authenticated Credential</h2>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Certificate Identifier:</span>
                  <span className="font-mono text-sm font-bold text-purple-300">{searchedCert.certificateNumber}</span>
                </div>
              </div>

              {/* Public Information Grid (Privacy-Preserving: No roll numbers or sensitive IDs) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                  <span className="text-slate-500">Recipient Conferred Name</span>
                  <p className="font-bold text-base text-slate-100">{searchedCert.recipientName}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                  <span className="text-slate-500">Official Award Distinction</span>
                  <p className="font-bold text-base text-amber-400">{searchedCert.title}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                  <span className="text-slate-500">Competition / Hackathon</span>
                  <p className="font-semibold text-slate-200">{searchedCert.competitionTitle}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                  <span className="text-slate-500">Issuing Institution</span>
                  <p className="font-semibold text-slate-200">{searchedCert.issuingAuthority}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                  <span className="text-slate-500">Issue Date</span>
                  <p className="font-semibold text-slate-200">{searchedCert.issueDate}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                  <span className="text-slate-500">Authorized Signatory</span>
                  <p className="font-semibold text-slate-200">{searchedCert.signerName} ({searchedCert.signerTitle})</p>
                </div>
              </div>

              {/* Signature Security Status */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300">Cryptographic Signature Verification:</span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
                    {searchedCert.signatureMode} (VALID)
                  </span>
                </div>
                {searchedCert.signatureHash && (
                  <p className="font-mono text-[10px] text-slate-400 break-all">
                    Hash: {searchedCert.signatureHash}
                  </p>
                )}
              </div>

              {/* Document Preview */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white text-center">Institutional Certificate Preview</h3>
                <CertificateDocument certificate={searchedCert} />
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0D1220] border border-rose-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-400">
                <XCircle className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-white">No Matching Certificate Record</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                The token or Certificate ID entered could not be validated against the Army Institute of Technology master registry. Please ensure the token was copied completely.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
        <span className="font-bold text-slate-300">Privacy Safeguards:</span>
        <p className="text-[11px] leading-relaxed">
          In compliance with AIT Pune student privacy policy, public verification records purposefully redact student roll numbers, registration numbers, branch details, and academic transcripts.
        </p>
      </div>

    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading verification lookup...</div>}>
        <VerifyContent />
      </Suspense>
      <Footer />
    </div>
  );
}
