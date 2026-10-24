'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { UserRole, VerificationStatus } from '@/lib/types';
import { 
  ShieldAlert, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  Lock, 
  Sparkles, 
  Database,
  ArrowRight
} from 'lucide-react';

export default function AdminPortalPage() {
  const { 
    currentUser, 
    allProfiles, 
    verifyStudent, 
    auditLogs, 
    isSupabaseActive,
    addAuditLog 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'VERIFICATIONS' | 'ROLES' | 'AUDIT'>('VERIFICATIONS');

  const isAuthorized =
    currentUser.role === 'ADMINISTRATOR' ||
    currentUser.role === 'GENERAL_SECRETARY' ||
    currentUser.role === 'DIRECTOR';

  const pendingStudents = allProfiles.filter(p => p.role === 'STUDENT' && p.verificationStatus === 'PENDING');
  const verifiedStudents = allProfiles.filter(p => p.verificationStatus === 'VERIFIED');

  const handleVerifyStudent = (studentId: string, status: 'VERIFIED' | 'REJECTED') => {
    verifyStudent(studentId, status);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080B14]">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="max-w-md w-full p-8 rounded-3xl bg-[#0D1220] border border-rose-500/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Administrator Access Clearance Required</h2>
              <p className="text-xs text-slate-300">
                Switch to <strong className="text-rose-300">Dr. Sneha Kulkarni (Administrator)</strong> in the top navigation role switcher to access the student roster and audit logs.
              </p>
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
          <div className="rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#121A2B] to-[#0D1220] border border-rose-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Central Administration & Welfare Hub
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span className="text-xs text-slate-400">Dean of Student Affairs Office</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Institutional Administration & Audit Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Validate student identities against the AIT registrar roster, manage role assignments, and review immutable security audit trails.
              </p>
            </div>

            {/* Supabase Status Pill */}
            <div className="p-3 rounded-2xl bg-[#080B14]/80 border border-slate-700 space-y-1 shrink-0 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Backend Database:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-[11px] text-slate-400">
                  {isSupabaseActive ? 'Supabase PostgreSQL Active' : 'Persistent Local Storage Mode'}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('VERIFICATIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'VERIFICATIONS'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Student Roster Verifications</span>
              {pendingStudents.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-bold">
                  {pendingStudents.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ROLES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ROLES'
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Role Assignments ({allProfiles.length})
            </button>

            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'AUDIT'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              System Audit Logs ({auditLogs.length})
            </button>
          </div>

          {/* Tab 1: Student Verifications */}
          {activeTab === 'VERIFICATIONS' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white">Pending Roster Clearances</h2>

              {pendingStudents.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0D1220] border border-slate-800 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-sm font-bold text-white">All Student Roster Accounts Verified</h3>
                  <p className="text-xs text-slate-400">There are no pending registrations requiring manual academic office validation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingStudents.map((student) => (
                    <div
                      key={student.id}
                      className="p-5 rounded-2xl bg-[#121A2B] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{student.fullName}</span>
                          <span className="text-xs font-mono text-purple-300">({student.aitRollNo})</span>
                          <span className="text-[10px] font-mono text-slate-400">{student.aitRegNo}</span>
                        </div>
                        <p className="text-xs text-slate-300">{student.branch} • Grad Year: {student.graduationYear}</p>
                        <p className="text-[11px] text-slate-500">{student.collegeEmail}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleVerifyStudent(student.id, 'VERIFIED')}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                        >
                          Verify & Approve
                        </button>
                        <button
                          onClick={() => handleVerifyStudent(student.id, 'REJECTED')}
                          className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: User Roles */}
          {activeTab === 'ROLES' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white">Provisioned Accounts & Institutional Roles</h2>
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#121A2B] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Name & Email</th>
                        <th className="p-4">Roll / Identifier</th>
                        <th className="p-4">Department / Branch</th>
                        <th className="p-4">Assigned Role</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {allProfiles.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/40">
                          <td className="p-4">
                            <span className="font-bold text-white block">{p.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{p.collegeEmail}</span>
                          </td>
                          <td className="p-4 font-mono">{p.aitRollNo}</td>
                          <td className="p-4">{p.branch}</td>
                          <td className="p-4">
                            <span className="font-bold text-purple-300">{p.role}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.verificationStatus === 'VERIFIED' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                            }`}>
                              {p.verificationStatus}
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

          {/* Tab 3: System Audit Logs */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white">Central Security & Operations Audit Trail</h2>
              <div className="space-y-2.5">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl bg-[#121A2B] border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-400 uppercase tracking-wider text-[11px]">{log.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200">{log.details}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1">
                      <span>Actor: <strong className="text-slate-400">{log.actorName}</strong> ({log.actorRole})</span>
                      <span>Target: <strong className="text-slate-400">{log.targetType}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
