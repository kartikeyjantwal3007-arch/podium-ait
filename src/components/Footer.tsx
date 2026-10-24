'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, ShieldCheck, Mail, MapPin, ExternalLink, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#080B14] text-slate-400 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-sky-400 p-[1px]">
                <div className="w-full h-full bg-[#080B14] rounded-[7px] flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-sky-400" />
                </div>
              </div>
              <span className="font-black text-base tracking-wider text-white">
                COMPETI<span className="text-purple-400">HUB</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              &quot;Your Ideas. Your Achievements. Your Legacy.&quot;
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Official Student Competition, Achievement & Verified Certificate Management System for Army Institute of Technology (AIT), Pune.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform Portals</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link href="/competitions" className="hover:text-purple-400 transition-colors">Hackathons & Competitions</Link></li>
              <li><Link href="/podium" className="hover:text-purple-400 transition-colors">Winners & Podium Standings</Link></li>
              <li><Link href="/projects" className="hover:text-purple-400 transition-colors">Student Project Repository</Link></li>
              <li><Link href="/teams" className="hover:text-purple-400 transition-colors">Participating Teams</Link></li>
              <li><Link href="/verify" className="hover:text-purple-400 transition-colors">Certificate Authenticity Verification</Link></li>
            </ul>
          </div>

          {/* Role Access Portals */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Role Portals</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">Student Dashboard</Link></li>
              <li><Link href="/principal" className="hover:text-purple-400 transition-colors">Principal’s Approval Portal</Link></li>
              <li><Link href="/organiser" className="hover:text-purple-400 transition-colors">Competition Organiser Desk</Link></li>
              <li><Link href="/admin" className="hover:text-purple-400 transition-colors">Administration & Audit Hub</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">AIT Registration Sign-In</Link></li>
            </ul>
          </div>

          {/* Institution & Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Institution & Notice</h4>
            <div className="flex items-start gap-2 text-[11px] text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>Army Institute of Technology, Dighi Hills, Alandi Road, Pune - 411015, Maharashtra</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Demonstration Notice</span>
              </div>
              <p>
                Sample events and achievements are provided for platform preview and testing. No official institutional claims are asserted without signed approval records.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Army Institute of Technology, Pune. CompetiHub Platform.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Next.js & Supabase</span>
            <Link href="/verify" className="hover:text-slate-300">Public Verification</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
