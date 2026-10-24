'use client';

import React from 'react';
import { Certificate } from '@/lib/types';
import CertificateDocument from './CertificateDocument';
import { X, Printer, Download, Share2, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({ certificate, isOpen, onClose }: CertificateModalProps) {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const verificationUrl = `/verify?token=${certificate.verificationToken}`;

  const copyVerificationLink = () => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${verificationUrl}`;
      navigator.clipboard.writeText(fullUrl);
      alert('Verification URL copied to clipboard: ' + fullUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#0D1220] rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#121A2B] no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Official Certificate Inspector</h3>
              <p className="text-xs text-slate-400">{certificate.certificateNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
              title="Print to PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={copyVerificationLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              title="Copy public verification link"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Share Link</span>
            </button>

            <Link
              href={verificationUrl}
              target="_blank"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
              title="Open public verification page"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Document Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/70">
          <CertificateDocument certificate={certificate} />
        </div>

        {/* Modal Footer info */}
        <div className="p-3 border-t border-slate-800 bg-[#0D1220] flex items-center justify-between text-xs text-slate-400 no-print">
          <span>Status: <strong className="text-purple-300 font-semibold">{certificate.status}</strong></span>
          <span className="text-[11px] text-slate-500">Security Mode: {certificate.signatureMode}</span>
        </div>

      </div>
    </div>
  );
}
