'use client';

import React from 'react';
import { Certificate } from '@/lib/types';
import { ShieldCheck, Award, QrCode, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CertificateDocumentProps {
  certificate: Certificate;
  forPrinting?: boolean;
}

export default function CertificateDocument({ certificate, forPrinting = false }: CertificateDocumentProps) {
  const isIssued = certificate.status === 'ISSUED';
  const isUnderReview = certificate.status === 'UNDER_REVIEW' || certificate.status === 'SUBMITTED';

  // Base URL for verification link
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify?token=${certificate.verificationToken}`
    : `https://competihub.aitpune.ac.in/verify?token=${certificate.verificationToken}`;

  return (
    <div 
      className={`print-certificate-container relative bg-[#FDFBF7] text-slate-900 mx-auto rounded-lg shadow-2xl overflow-hidden border-[10px] border-[#1E293B] ${
        forPrinting ? 'w-full p-8' : 'max-w-4xl p-6 sm:p-10'
      }`}
      style={{
        boxShadow: forPrinting ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        fontFamily: "'Georgia', 'Times New Roman', serif"
      }}
    >
      {/* Decorative inner border */}
      <div className="border-2 border-amber-600/60 p-6 sm:p-10 relative bg-gradient-to-b from-amber-50/30 to-amber-100/10">
        
        {/* Corner Ornaments */}
        <div className="absolute top-2 left-2 text-amber-700 text-xl select-none">❖</div>
        <div className="absolute top-2 right-2 text-amber-700 text-xl select-none">❖</div>
        <div className="absolute bottom-2 left-2 text-amber-700 text-xl select-none">❖</div>
        <div className="absolute bottom-2 right-2 text-amber-700 text-xl select-none">❖</div>

        {/* Draft watermark if not officially issued */}
        {!isIssued && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-25deg]">
            <span className="text-6xl sm:text-8xl font-black text-rose-900 border-8 border-dashed border-rose-900 p-8 rounded-2xl uppercase tracking-widest">
              {certificate.status.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Header Institution Branding */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-base border-2 border-amber-500 shadow-sm">
              AIT
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-slate-900">
            Army Institute of Technology, Pune
          </h1>
          <p className="text-xs text-slate-600 tracking-wide font-sans">
            Affiliated to Savitribai Phule Pune University • Approved by AICTE • Dighi Hills, Pune - 411015
          </p>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-2" />
        </div>

        {/* Certificate Title */}
        <div className="text-center my-6">
          <span className="text-xs font-sans uppercase font-bold tracking-[0.25em] text-amber-800 bg-amber-100/60 px-4 py-1 rounded-full border border-amber-300/60">
            {certificate.title}
          </span>
          <p className="text-xs text-slate-500 font-sans mt-2 italic">
            Certificate ID: <strong className="font-mono text-slate-700 font-bold">{certificate.certificateNumber}</strong>
          </p>
        </div>

        {/* Recipient Presentation */}
        <div className="text-center my-4 space-y-2">
          <p className="text-sm font-sans text-slate-600">This honor is officially conferred upon</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 underline decoration-amber-500/50 underline-offset-8">
            {certificate.recipientName}
          </h2>
        </div>

        {/* Award Body Description */}
        <div className="max-w-2xl mx-auto text-center my-6 text-sm sm:text-base leading-relaxed text-slate-700">
          <p>{certificate.awardText}</p>
        </div>

        {/* Event & Date */}
        <div className="text-center text-xs font-sans text-slate-500 my-4">
          <span>Event: <strong className="text-slate-800 font-semibold">{certificate.competitionTitle}</strong></span>
          <span className="mx-2">•</span>
          <span>Date of Conferment: <strong className="text-slate-800 font-semibold">{certificate.issueDate}</strong></span>
        </div>

        {/* Signatures & Verification Row */}
        <div className="mt-10 pt-6 border-t border-amber-600/30 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          
          {/* Verification QR Representation */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1">
            <div className="p-2 bg-white rounded border border-slate-300 shadow-sm flex items-center justify-center w-20 h-20">
              <QrCode className="w-16 h-16 text-slate-800" />
            </div>
            <p className="text-[10px] font-sans text-slate-500">Scan to Verify Authenticity</p>
            <p className="text-[9px] font-mono text-slate-400 break-all max-w-[160px]">
              {certificate.verificationToken.substring(0, 22)}...
            </p>
          </div>

          {/* Institutional Gold Seal */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full border-4 border-amber-500 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 flex flex-col items-center justify-center shadow-md p-1">
              <Award className="w-6 h-6 text-amber-900" />
              <span className="text-[8px] font-sans font-black text-amber-950 uppercase tracking-tighter">
                OFFICIAL SEAL
              </span>
              <span className="text-[7px] font-sans text-amber-900 font-bold">AIT PUNE</span>
            </div>
            <p className="text-[10px] font-sans text-slate-500 mt-1">Authorized Institutional Record</p>
          </div>

          {/* Principal's Signature Block */}
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right space-y-1">
            <div className="h-14 flex items-end justify-center sm:justify-end pb-1 w-full">
              {isIssued ? (
                <div className="font-serif italic text-xl text-slate-800 border-b border-slate-900 pb-1 px-4 select-none">
                  Brig. S. K. Joshi
                </div>
              ) : (
                <div className="text-xs font-sans text-amber-700 bg-amber-50 border border-amber-300 px-3 py-1 rounded">
                  Pending Principal Approval
                </div>
              )}
            </div>
            <p className="text-xs font-sans font-bold text-slate-900">{certificate.signerName}</p>
            <p className="text-[10px] font-sans text-slate-600">{certificate.signerTitle}</p>
            
            {/* Signature Mode Tag */}
            {isIssued && (
              <div className="inline-flex items-center gap-1 text-[9px] font-sans text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>
                  {certificate.signatureMode === 'MODE_B_CRYPTOGRAPHIC_PDF' 
                    ? 'Digitally Signed (ED25519)' 
                    : 'Institutional Sign & Seal'}
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Security Hash Footnote */}
        {certificate.signatureHash && (
          <div className="mt-4 pt-2 border-t border-slate-200 text-[9px] font-mono text-slate-400 text-center break-all">
            Cryptographic Integrity Fingerprint: {certificate.signatureHash}
          </div>
        )}

      </div>
    </div>
  );
}
