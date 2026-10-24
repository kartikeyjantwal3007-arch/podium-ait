'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAppStore } from '@/lib/store';
import { 
  Trophy, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithRegAndRoll, switchUser, allProfiles } = useAppStore();

  const [regNo, setRegNo] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regNo.trim() || !rollNo.trim() || !password.trim()) {
      setErrorMsg('Please enter your AIT Registration Number, Roll Number, and Password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithRegAndRoll(regNo, rollNo, password);
      setIsLoading(false);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 600);
  };

  const handleQuickPersonaSelect = (profileId: string) => {
    switchUser(profileId);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        
        {/* Ambient background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          
          {/* Card Shell */}
          <div className="rounded-3xl bg-[#0D1220] border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
            
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-sky-400 p-[1.5px] mx-auto shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#0D1220] rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-sky-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                AIT Student Portal Login
              </h1>
              <p className="text-xs text-slate-400">
                Sign in with your verified Army Institute of Technology academic credentials.
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* AIT Registration Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  AIT Registration Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. AIT/2022/CE/042"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors uppercase font-mono"
                  />
                </div>
              </div>

              {/* AIT Roll Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  AIT Roll Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 22042"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors uppercase font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Authenticate & Enter Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demonstration Personas */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Demo Login (1-Click Test):</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  onClick={() => handleQuickPersonaSelect('user-student-1')}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-purple-900/40 border border-slate-700 text-left text-slate-200 transition-colors"
                >
                  <p className="font-bold text-purple-300">Aryan Sharma</p>
                  <p className="text-[10px] text-slate-400">Student (Verified)</p>
                </button>

                <button
                  onClick={() => handleQuickPersonaSelect('user-principal-1')}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-amber-900/40 border border-slate-700 text-left text-slate-200 transition-colors"
                >
                  <p className="font-bold text-amber-300">Brig. S. K. Joshi</p>
                  <p className="text-[10px] text-slate-400">Principal / Signer</p>
                </button>

                <button
                  onClick={() => handleQuickPersonaSelect('user-organiser-1')}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-sky-900/40 border border-slate-700 text-left text-slate-200 transition-colors"
                >
                  <p className="font-bold text-sky-300">Prof. Rajesh Verma</p>
                  <p className="text-[10px] text-slate-400">Organiser / Faculty</p>
                </button>

                <button
                  onClick={() => handleQuickPersonaSelect('user-admin-1')}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-900/40 border border-slate-700 text-left text-slate-200 transition-colors"
                >
                  <p className="font-bold text-rose-300">Dr. Sneha Kulkarni</p>
                  <p className="text-[10px] text-slate-400">Administrator</p>
                </button>
              </div>
            </div>

            {/* Registration Link */}
            <div className="mt-6 text-center text-xs text-slate-400">
              <span>New student at AIT Pune? </span>
              <Link href="/register" className="text-purple-400 font-semibold hover:underline">
                Register Student Account
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0D1220] border border-slate-700 p-6 rounded-2xl max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-white">Reset Account Password</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In accordance with AIT Pune cybersecurity protocol, password resets require validation with your official college email (<strong className="text-purple-300">@aitpune.edu.in</strong>).
            </p>
            <input
              type="email"
              placeholder="Enter your college email"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Password reset link dispatched to your registered college email.');
                  setShowForgotModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
