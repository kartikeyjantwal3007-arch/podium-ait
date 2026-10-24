'use client';

import React from 'react';
import { Certificate } from '@/lib/types';
import { Award, QrCode, CheckCircle2 } from 'lucide-react';

interface CertificateDocumentProps {
  certificate: Certificate;
  forPrinting?: boolean;
}

export default function CertificateDocument({ certificate, forPrinting = false }: CertificateDocumentProps) {
  const isIssued = certificate.status === 'ISSUED';

  // Category specific accent themes
  const getTheme = () => {
    switch (certificate.category) {
      case 'FIRST_PLACE':
        return {
          innerBorder: 'border-amber-500/80',
          gradientBg: 'from-amber-50/40 via-white to-amber-100/20',
          ornamentColor: 'text-amber-700',
          tagBg: 'text-amber-900 bg-amber-100 border-amber-400/80',
          underline: 'decoration-amber-500',
          sealBorder: 'border-amber-500',
          sealBg: 'from-amber-400 via-amber-200 to-amber-500',
          sealText: 'GOLD TROPHY',
          badgeLabel: '1ST PLACE • GOLD'
        };
      case 'SECOND_PLACE':
        return {
          innerBorder: 'border-slate-400/80',
          gradientBg: 'from-slate-50/50 via-white to-slate-100/30',
          ornamentColor: 'text-slate-600',
          tagBg: 'text-slate-800 bg-slate-100 border-slate-400/80',
          underline: 'decoration-slate-400',
          sealBorder: 'border-slate-400',
          sealBg: 'from-slate-300 via-slate-100 to-slate-400',
          sealText: 'SILVER MEDAL',
          badgeLabel: '2ND PLACE • SILVER'
        };
      case 'THIRD_PLACE':
        return {
          innerBorder: 'border-amber-700/80',
          gradientBg: 'from-orange-50/30 via-white to-amber-100/20',
          ornamentColor: 'text-amber-800',
          tagBg: 'text-amber-950 bg-amber-100 border-amber-600/80',
          underline: 'decoration-amber-700',
          sealBorder: 'border-amber-700',
          sealBg: 'from-amber-600 via-amber-300 to-amber-700',
          sealText: 'BRONZE MEDAL',
          badgeLabel: '3RD PLACE • BRONZE'
        };
      case 'PARTICIPATION':
      default:
        return {
          innerBorder: 'border-indigo-400/60',
          gradientBg: 'from-indigo-50/20 via-white to-slate-50/40',
          ornamentColor: 'text-indigo-800',
          tagBg: 'text-indigo-950 bg-indigo-50 border-indigo-300',
          underline: 'decoration-indigo-400',
          sealBorder: 'border-indigo-600',
          sealBg: 'from-indigo-300 via-slate-100 to-indigo-400',
          sealText: 'OFFICIAL RECORD',
          badgeLabel: 'CERTIFICATE OF PARTICIPATION'
        };
    }
  };

  const theme = getTheme();

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
      <div className={`border-2 ${theme.innerBorder} p-6 sm:p-10 relative bg-gradient-to-b ${theme.gradientBg}`}>
        
        {/* Corner Ornaments */}
        <div className={`absolute top-2 left-2 ${theme.ornamentColor} text-xl select-none`}>❖</div>
        <div className={`absolute top-2 right-2 ${theme.ornamentColor} text-xl select-none`}>❖</div>
        <div className={`absolute bottom-2 left-2 ${theme.ornamentColor} text-xl select-none`}>❖</div>
        <div className={`absolute bottom-2 right-2 ${theme.ornamentColor} text-xl select-none`}>❖</div>

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
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-slate-400 to-transparent mx-auto mt-2" />
        </div>

        {/* Certificate Title */}
        <div className="text-center my-6">
          <span className={`text-xs font-sans uppercase font-bold tracking-[0.2em] px-4 py-1.5 rounded-full border shadow-sm ${theme.tagBg}`}>
            {certificate.title}
          </span>
          <p className="text-xs text-slate-500 font-sans mt-2.5 italic">
            Certificate ID: <strong className="font-mono text-slate-700 font-bold">{certificate.certificateNumber}</strong>
          </p>
        </div>

        {/* Recipient Presentation */}
        <div className="text-center my-4 space-y-2">
          <p className="text-sm font-sans text-slate-600">This honor is officially conferred upon</p>
          <h2 className={`text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 underline ${theme.underline} underline-offset-8`}>
            {certificate.recipientName}
          </h2>
          {certificate.recipientRollNo && (
            <p className="text-xs font-sans text-slate-500 font-mono">
              Roll No: {certificate.recipientRollNo}
            </p>
          )}
        </div>

        {/* Award Body Description */}
        <div className="max-w-2xl mx-auto text-center my-6 text-sm sm:text-base leading-relaxed text-slate-700">
          <p>{certificate.awardText}</p>
        </div>

        {/* Event & Date */}
        <div className="text-center text-xs font-sans text-slate-600 my-4 bg-white/60 py-2 rounded-lg border border-slate-200/60 max-w-lg mx-auto">
          <span>Event: <strong className="text-slate-800 font-semibold">{certificate.competitionTitle}</strong></span>
          <span className="mx-2 text-slate-400">•</span>
          <span>Club: <strong className="text-slate-800 font-semibold">{certificate.clubName || 'AIT Technical Chapters'}</strong></span>
          <span className="mx-2 text-slate-400">•</span>
          <span>Date: <strong className="text-slate-800 font-semibold">{certificate.issueDate}</strong></span>
        </div>

        {/* Signatures & Verification Row (Requirement 5: Two Separate Signature Areas) */}
        <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          
          {/* 1. Club Secretary Signature Area */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1">
            <div className="h-14 flex items-end justify-center sm:justify-start pb-1 w-full">
              <div className="font-serif italic text-lg text-slate-800 border-b border-slate-900 pb-1 px-2 select-none">
                {certificate.clubSecretaryName || 'Club Secretary'}
              </div>
            </div>
            <p className="text-xs font-sans font-bold text-slate-900">
              {certificate.clubSecretaryName || 'Authorized Club Secretary'}
            </p>
            <p className="text-[10px] font-sans text-slate-600">
              {certificate.clubSecretaryTitle || 'Designation: Club Secretary'}
            </p>
            <p className="text-[10px] font-sans text-slate-500 font-medium">
              Club: {certificate.clubName || 'Organizing Club'}
            </p>
          </div>

          {/* 2. Verification QR & Institutional Seal (Center) */}
          <div className="flex flex-col items-center justify-center text-center space-y-1.5">
            <div className="p-1.5 bg-white rounded border border-slate-300 shadow-sm flex items-center justify-center w-16 h-16">
              <QrCode className="w-12 h-12 text-slate-800" />
            </div>
            <p className="text-[10px] font-sans text-slate-600 font-semibold">QR Authenticity Verification</p>
            <p className="text-[9px] font-mono text-slate-400 break-all max-w-[150px]">
              ID: {certificate.certificateNumber}
            </p>
            <div className="inline-flex items-center gap-1 text-[8px] font-sans text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              <Award className="w-2.5 h-2.5 text-amber-600" />
              <span>AIT Pune Institutional Record</span>
            </div>
          </div>

          {/* 3. General Secretary Signature Area */}
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right space-y-1">
            <div className="h-14 flex items-end justify-center sm:justify-end pb-1 w-full">
              {isIssued ? (
                <div className="font-serif italic text-xl text-slate-800 border-b border-slate-900 pb-1 px-4 select-none">
                  {certificate.signerName || 'Nishant Singh'}
                </div>
              ) : (
                <div className="text-xs font-sans text-amber-700 bg-amber-50 border border-amber-300 px-3 py-1 rounded">
                  Pending GS Signature
                </div>
              )}
            </div>
            <p className="text-xs font-sans font-bold text-slate-900">
              {certificate.signerName || 'Nishant Singh'}
            </p>
            <p className="text-[10px] font-sans text-slate-600">
              {certificate.signerTitle || 'Designation: General Secretary'}
            </p>
            
            {/* Signature Status Tag */}
            {isIssued ? (
              <div className="inline-flex items-center gap-1 text-[9px] font-sans text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Digitally Signed & Valid</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 text-[9px] font-sans text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Pending Authorization</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
