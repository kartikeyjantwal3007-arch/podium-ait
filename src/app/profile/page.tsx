'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { 
  UserCircle, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Mail, 
  Building, 
  ShieldCheck,
  Edit3,
  Calendar
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/Icons';

export default function ProfilePage() {
  const { currentUser } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8 overflow-y-auto">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <UserCircle className="w-4 h-4" />
              <span>Academic Credential Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Student Profile & Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Permanent institutional record tied to your Army Institute of Technology student registration.
            </p>
          </div>

          {/* Profile Card */}
          <div className="rounded-3xl bg-[#0D1220] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-400 p-[2px] shadow-lg shrink-0">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-bold text-xl text-white">
                    {currentUser.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{currentUser.fullName}</h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      currentUser.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {currentUser.verificationStatus}
                    </span>
                  </div>

                  <p className="text-xs text-purple-300 font-mono">
                    Roll No: <span className="text-white font-bold">{currentUser.aitRollNo}</span> • Reg No: {currentUser.aitRegNo}
                  </p>
                  <p className="text-xs text-slate-400">{currentUser.collegeEmail}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#121A2B] border border-slate-800 text-xs space-y-1">
                <span className="text-slate-500 block">Enrolled Institution:</span>
                <span className="font-semibold text-slate-200 block">Army Institute of Technology, Pune</span>
                <span className="text-[11px] text-purple-400 font-semibold">{currentUser.role} Account</span>
              </div>
            </div>

            {/* Academic Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                <span className="text-slate-500">Department / Branch</span>
                <p className="font-bold text-sm text-slate-200">{currentUser.branch}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                <span className="text-slate-500">Graduation Year</span>
                <p className="font-bold text-sm text-slate-200">Class of {currentUser.graduationYear}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1">
                <span className="text-slate-500">Registered Since</span>
                <p className="font-bold text-sm text-slate-200">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Biography */}
            <div className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-300">Technical Bio & Focus</span>
              <p className="text-slate-300 leading-relaxed">
                {currentUser.bio || 'Computer engineering student at AIT Pune actively building solutions for technical hackathons.'}
              </p>
            </div>

            {/* Public Profile Links */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs">
              {currentUser.githubProfile && (
                <a
                  href={currentUser.githubProfile}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Profile</span>
                </a>
              )}
              {currentUser.linkedinProfile && (
                <a
                  href={currentUser.linkedinProfile}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
