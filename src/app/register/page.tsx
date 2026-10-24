'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAppStore } from '@/lib/store';
import { 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Mail, 
  GraduationCap, 
  User 
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerStudent } = useAppStore();

  const [fullName, setFullName] = useState('');
  const [aitRegNo, setAitRegNo] = useState('');
  const [aitRollNo, setAitRollNo] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [branch, setBranch] = useState('Computer Engineering');
  const [graduationYear, setGraduationYear] = useState(2027);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ name: string; rollNo: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !aitRegNo.trim() || !aitRollNo.trim() || !collegeEmail.trim() || !password.trim()) {
      setErrorMsg('All fields are mandatory for official AIT student enrolment.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Security requirement: Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (!collegeEmail.toLowerCase().includes('aitpune')) {
      setErrorMsg('Registration requires an authorised @aitpune.edu.in institutional email address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = registerStudent({
        fullName,
        aitRegNo,
        aitRollNo,
        collegeEmail,
        branch,
        graduationYear: Number(graduationYear),
        password
      });

      setIsLoading(false);

      if (result.success && result.profile) {
        setSuccessInfo({
          name: result.profile.fullName,
          rollNo: result.profile.aitRollNo
        });
      } else {
        setErrorMsg(result.error || 'Registration failed.');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          
          <div className="rounded-3xl bg-[#0D1220] border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
            
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-sky-400 p-[1.5px] mx-auto shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#0D1220] rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Create Student Account
              </h1>
              <p className="text-xs text-slate-400">
                Enrol into the official CompetiHub AIT Pune achievement repository.
              </p>
            </div>

            {/* Success View: Pending Verification Flow */}
            {successInfo ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <Clock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Registration Submitted</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                    Account created for <strong className="text-purple-300">{successInfo.name}</strong> (Roll: {successInfo.rollNo}).
                  </p>
                  
                  {/* Security Notice Box */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-left text-xs space-y-2 mt-4">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Security Policy: Pending Verification</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      To safeguard institutional integrity and prevent student identity impersonation, new accounts enter a <strong className="text-amber-300">PENDING</strong> verification state until validated against the AIT central academic roster.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30"
                >
                  Proceed to Student Dashboard
                </button>
              </div>
            ) : (
              <>
                {/* Error Box */}
                {errorMsg && (
                  <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Student Name (As on College ID)
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aryan Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Reg No & Roll No Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        AIT Registration No.
                      </label>
                      <input
                        type="text"
                        value={aitRegNo}
                        onChange={(e) => setAitRegNo(e.target.value)}
                        placeholder="AIT/2023/CE/055"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        AIT Roll Number
                      </label>
                      <input
                        type="text"
                        value={aitRollNo}
                        onChange={(e) => setAitRollNo(e.target.value)}
                        placeholder="23055"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors uppercase font-mono"
                      />
                    </div>
                  </div>

                  {/* College Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Official College Email
                    </label>
                    <input
                      type="email"
                      value={collegeEmail}
                      onChange={(e) => setCollegeEmail(e.target.value)}
                      placeholder="studentname@aitpune.edu.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Branch & Graduation Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Academic Branch
                      </label>
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics & Telecommunication">Electronics & Telecom (ENTC)</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Automation & Robotics">Automation & Robotics</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Graduation Year
                      </label>
                      <select
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value={2025}>2025 (4th Year)</option>
                        <option value={2026}>2026 (3rd Year)</option>
                        <option value={2027}>2027 (2nd Year)</option>
                        <option value={2028}>2028 (1st Year)</option>
                      </select>
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password (min 8 chars)
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    {isLoading ? <span>Submitting To Roster...</span> : <span>Complete Registration</span>}
                  </button>

                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                  <span>Already enrolled? </span>
                  <Link href="/login" className="text-purple-400 font-semibold hover:underline">
                    Sign In
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
