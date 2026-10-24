'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CertificateModal from '@/components/CertificateModal';
import { useAppStore } from '@/lib/store';
import { Certificate } from '@/lib/types';
import { 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Users, 
  FileCheck2, 
  Code2, 
  ExternalLink, 
  ChevronRight,
  Flame,
  Calendar,
  MapPin,
  Medal,
  Star,
  CheckCircle2,
  FolderGit2
} from 'lucide-react';

export default function HomePage() {
  const { competitions, results, projects, teams, certificates } = useAppStore();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Stats calculation from actual records
  const totalCompetitions = competitions.length;
  const verifiedResults = results.filter(r => r.isVerified).length;
  const issuedCertificates = certificates.filter(c => c.status === 'ISSUED').length;
  const totalProjects = projects.length;

  const featuredComps = competitions.slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const podiumResults = results.filter(r => r.isVerified).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-800/80">
        
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>Army Institute of Technology (AIT), Pune</span>
              <span className="w-1 h-1 rounded-full bg-purple-400" />
              <span className="text-slate-400 font-normal">Official Student Achievement Network</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white">
              Ideas Compete.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400">
                People Grow.
              </span>
            </h1>

            {/* Sub-headline description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              The centralized competition, hackathon, and verified achievement management platform for AIT Pune. Permanent student identities, dynamic competition teams, and institutional certificates issued with principal authorisation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/competitions"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 text-white font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 group"
              >
                <span>Explore Competitions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/projects"
                className="px-6 py-3.5 rounded-xl bg-[#121A2B] hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Code2 className="w-4 h-4 text-sky-400" />
                <span>Discover Projects</span>
              </Link>

              <Link
                href="/login"
                className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-purple-300 border border-purple-500/30 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Student Sign-In</span>
              </Link>
            </div>

            {/* Sample data transparency note */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 italic">
                * Demonstration environment with representative AIT Pune hackathons, student projects, and verifiable test records.
              </span>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121A2B]/80 border border-slate-800 shadow-xl text-center">
              <p className="text-2xl sm:text-3xl font-black text-white">{totalCompetitions}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Active Competitions</p>
              <p className="text-[10px] text-purple-400 mt-0.5">Hackathons & Sprints</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#121A2B]/80 border border-slate-800 shadow-xl text-center">
              <p className="text-2xl sm:text-3xl font-black text-sky-400">{verifiedResults}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Podium Results</p>
              <p className="text-[10px] text-sky-300 mt-0.5">Officially Verified</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#121A2B]/80 border border-slate-800 shadow-xl text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{issuedCertificates}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Issued Certificates</p>
              <p className="text-[10px] text-amber-300 mt-0.5">Principal Authorized</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#121A2B]/80 border border-slate-800 shadow-xl text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">{totalProjects}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Student Projects</p>
              <p className="text-[10px] text-emerald-300 mt-0.5">Open Repository</p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Competitions Section */}
      <section className="py-16 border-b border-slate-800/80 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Trophy className="w-4 h-4" />
                <span>Featured Opportunities</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                AIT Hackathons & Challenges
              </h2>
            </div>
            <Link
              href="/competitions"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>View all {competitions.length} competitions</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredComps.map((comp) => (
              <div
                key={comp.id}
                className="group rounded-2xl bg-[#121A2B] border border-slate-800 hover:border-purple-500/50 transition-all overflow-hidden flex flex-col shadow-lg hover:shadow-purple-950/20"
              >
                {/* Banner Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={comp.bannerUrl}
                    alt={comp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121A2B] via-transparent to-black/30" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#080B14]/80 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                    {comp.category}
                  </div>

                  {/* Status Pill */}
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    comp.status === 'ONGOING' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : comp.status === 'COMPLETED'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {comp.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(comp.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{comp.venueDetails}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500">Prize Pool:</span>
                      <span className="font-semibold text-amber-400">{comp.prizePool}</span>
                    </div>
                  </div>

                  <Link
                    href={`/competitions/${comp.slug}`}
                    className="w-full text-center py-2 rounded-lg bg-slate-800/80 hover:bg-purple-600 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    View Details & Submissions
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Recent Podium Standings */}
      <section className="py-16 border-b border-slate-800/80 bg-[#0D1220]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Medal className="w-4 h-4" />
                <span>Verified Achievements</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Recent Podium Holders
              </h2>
            </div>
            <Link
              href="/podium"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Explore All Podium Records</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {podiumResults.length === 0 ? (
            <div className="rounded-2xl p-10 bg-[#121A2B]/60 border border-slate-800 text-center space-y-2 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Medal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No winners have been announced yet.</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Official podium standings will be published here once results are verified and approved by the General Secretary.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {podiumResults.map((res) => {
                const isGold = res.rankPosition === 1;
                const isSilver = res.rankPosition === 2;
                const isBronze = res.rankPosition === 3;

                return (
                  <div
                    key={res.id}
                    className={`relative rounded-2xl p-6 bg-[#121A2B] border transition-all ${
                      isGold 
                        ? 'border-amber-500/50 shadow-lg shadow-amber-950/20' 
                        : isSilver
                        ? 'border-slate-400/50'
                        : 'border-amber-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                          isGold ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                          : isSilver ? 'bg-slate-300 text-black'
                          : 'bg-amber-700 text-white'
                        }`}>
                          {res.rankPosition}
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                            {res.awardTitle}
                          </span>
                          <h4 className="font-bold text-base text-white">{res.teamName}</h4>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                      <p className="text-xs text-slate-300">
                        <strong className="text-slate-400 font-normal">Project: </strong> 
                        <span className="font-semibold text-purple-300">{res.projectTitle || 'Autonomous Innovation'}</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        <strong className="text-slate-400 font-normal">Competition: </strong> 
                        {res.competitionTitle}
                      </p>
                      
                      <div className="pt-2">
                        <p className="text-[11px] text-slate-500 font-medium">Team Members:</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {res.members.map((m) => (
                            <span key={m.studentId} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {m.name} ({m.aitRollNo})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">Verified by: {res.verifiedBy}</span>
                      <Link
                        href="/podium"
                        className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1"
                      >
                        Inspect Result <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Featured Student Projects Showcase */}
      <section className="py-16 border-b border-slate-800/80 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Code2 className="w-4 h-4" />
                <span>Student Innovations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Explore All {projects.length} Student Projects</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((proj) => (
              <div
                key={proj.id}
                className="group rounded-2xl bg-[#121A2B] border border-slate-800 hover:border-sky-500/40 transition-all overflow-hidden flex flex-col"
              >
                <div className="h-44 w-full bg-slate-900 overflow-hidden relative">
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121A2B] via-transparent to-black/30" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-sky-300 truncate">{proj.teamName}</span>
                    <span className="text-[11px] bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
                      ❤️ {proj.likesCount}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {proj.shortDescription}
                    </p>
                  </div>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-purple-300 border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                    {proj.technologies.length > 4 && (
                      <span className="text-[10px] text-slate-500">
                        +{proj.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/projects/${proj.slug}`}
                    className="w-full text-center py-2 rounded-lg bg-slate-800/80 hover:bg-sky-600 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    Explore Architecture & Demo
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Participating Teams & Portfolio Callout */}
      <section className="py-16 bg-[#0D1220]/40 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-purple-900/30 via-slate-900 to-sky-900/30 border border-purple-500/20 p-8 sm:p-12 relative overflow-hidden">
            
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-sky-400">
                AIT Student Achievement Portfolio
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                One Permanent Identity.{' '}
                <span className="text-purple-400">Infinite Teams.</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Whether participating in Innerve, SIH, Robomania, or an algorithmic contest, your records, badges, and verified principal-signed certificates remain permanently credited to your AIT registration number.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30"
                >
                  Create Student Account
                </Link>
                <Link
                  href="/verify"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                >
                  Verify An Existing Certificate
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      {/* Certificate Inspector Modal if opened */}
      <CertificateModal
        certificate={selectedCert}
        isOpen={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
