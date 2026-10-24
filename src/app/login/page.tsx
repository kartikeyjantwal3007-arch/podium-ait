'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import {
  GraduationCap,
  ScrollText,
  Briefcase,
  Shield,
  Award,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  UserPlus,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface DesignationOption {
  role: UserRole;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
  targetDashboard: string;
}

const DESIGNATIONS: DesignationOption[] = [
  {
    role: 'STUDENT',
    title: 'Student',
    subtitle: '1st - 4th Year',
    description: 'Explore hackathons, join teams, submit projects, track podium rankings, and download verified certificates.',
    icon: GraduationCap,
    accentColor: 'border-sky-500/60 text-sky-400 bg-sky-500/10',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    targetDashboard: '/dashboard',
  },
  {
    role: 'JOINT_SECRETARY',
    title: 'Joint Secretary',
    subtitle: '2nd Year Office',
    description: 'Publish and manage club hackathon notices, track student communication, and access complete student features.',
    icon: ScrollText,
    accentColor: 'border-purple-500/60 text-purple-400 bg-purple-500/10',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    targetDashboard: '/dashboard',
  },
  {
    role: 'CLUB_SECRETARY',
    title: 'Club Secretary',
    subtitle: '3rd Year Head',
    description: 'Manage club hackathons, review submitted projects, declare official winners & podium, and generate certificates.',
    icon: Briefcase,
    accentColor: 'border-indigo-500/60 text-indigo-400 bg-indigo-500/10',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    targetDashboard: '/club-secretary',
  },
  {
    role: 'GENERAL_SECRETARY',
    title: 'General Secretary',
    subtitle: '4th Year Apex',
    description: 'Institution-wide supervisory authority: oversee all clubs, appoint Club Secretaries, verify podium results, approve and cryptographically sign certificates, and publish priority notices.',
    icon: Shield,
    accentColor: 'border-rose-500/60 text-rose-400 bg-rose-500/10',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    targetDashboard: '/general-secretary',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { loginWithDesignation, registerStudent, switchUser, allProfiles } = useAppStore();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [selectedDesignation, setSelectedDesignation] = useState<UserRole>('STUDENT');
  const [regNo, setRegNo] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Registration form state
  const [regFullName, setRegFullName] = useState('');
  const [regAitRegNo, setRegAitRegNo] = useState('');
  const [regAitRollNo, setRegAitRollNo] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regBranch, setRegBranch] = useState('Computer Engineering');
  const [regYear, setRegYear] = useState('2027');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regErrorMsg, setRegErrorMsg] = useState('');

  const currentDesignationMeta = DESIGNATIONS.find((d) => d.role === selectedDesignation) || DESIGNATIONS[0];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regNo.trim() || !rollNo.trim() || !password.trim()) {
      setErrorMsg('Please enter your AIT Registration Number, Roll Number, and Password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithDesignation(selectedDesignation, regNo, rollNo, password);
      setIsLoading(false);

      if (res.success) {
        setSuccessMsg(`Authenticated as ${res.profile?.fullName}! Redirecting to ${res.targetRoute}...`);
        setTimeout(() => {
          router.push(res.targetRoute || '/dashboard');
        }, 500);
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrorMsg('');

    if (!regFullName.trim() || !regAitRegNo.trim() || !regAitRollNo.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegErrorMsg('All fields are mandatory for student verification.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (regPassword.length < 6) {
      setRegErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerStudent({
        fullName: regFullName,
        aitRegNo: regAitRegNo,
        aitRollNo: regAitRollNo,
        collegeEmail: regEmail,
        branch: regBranch,
        graduationYear: parseInt(regYear, 10),
        password: regPassword,
      });

      setIsLoading(false);

      if (res.success) {
        setSuccessMsg('Account created successfully! Default role: Student. Redirecting to your dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        setRegErrorMsg(res.error || 'Registration failed.');
      }
    }, 600);
  };

  // Quick 1-Click Persona Login
  const handleQuickPersonaSelect = (profileId: string) => {
    const target = allProfiles.find((p) => p.id === profileId);
    if (!target) return;
    switchUser(profileId);
    if (target.role === 'GENERAL_SECRETARY') router.push('/general-secretary');
    else if (target.role === 'CLUB_SECRETARY') router.push('/club-secretary');
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[250px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-4xl relative z-10 space-y-6">

          {/* ═══════════════════════════════════════════
              MODE TOGGLE & HEADER
              ═══════════════════════════════════════════ */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-inner mb-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Army Institute of Technology, Pune</span>
              <span className="w-1 h-1 rounded-full bg-purple-400" />
              <span className="text-slate-400 font-normal">Official Portal Authentication</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {mode === 'LOGIN' ? 'Sign In to CompetiHub' : 'Create Student Account'}
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {mode === 'LOGIN'
                ? 'Select your designated official role and enter your verified AIT academic credentials.'
                : 'Register as an AIT student. Privileged leadership designations are assigned through institutional appointments.'}
            </p>

            {/* Toggle Tab */}
            <div className="inline-flex p-1 rounded-xl bg-[#0c101d] border border-[#1e293b] mt-3">
              <button
                type="button"
                onClick={() => {
                  setMode('LOGIN');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'LOGIN'
                    ? 'bg-[#5b50f6] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Designated Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('REGISTER');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'REGISTER'
                    ? 'bg-[#5b50f6] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create New Account
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              LOGIN VIEW: 5-DESIGNATION CARDS + FORM
              ═══════════════════════════════════════════ */}
          {mode === 'LOGIN' ? (
            <div className="space-y-6">

              {/* 1. Five Designation Cards */}
              <div>
                <p className="text-xs font-bold text-slate-300 mb-2.5 flex items-center justify-between">
                  <span>1. Select Official Designation:</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    Permissions verified by backend
                  </span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {DESIGNATIONS.map((desig) => {
                    const isSelected = selectedDesignation === desig.role;
                    const Icon = desig.icon;

                    return (
                      <button
                        key={desig.role}
                        type="button"
                        onClick={() => {
                          setSelectedDesignation(desig.role);
                          setErrorMsg('');
                        }}
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between relative group ${
                          isSelected
                            ? 'bg-[#151c30] border-purple-500 shadow-lg shadow-purple-950/40 scale-[1.02]'
                            : 'bg-[#0c101d] border-[#1e293b] hover:border-slate-600 hover:bg-[#111728]'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}

                        <div>
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 border ${desig.accentColor}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-bold text-white leading-tight">
                            {desig.title}
                          </p>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold border mt-1 ${desig.badgeBg}`}
                          >
                            {desig.subtitle}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {desig.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Login Form Container */}
              <div className="max-w-md mx-auto rounded-3xl bg-[#0c101d] border border-[#1e293b] p-6 sm:p-7 shadow-2xl backdrop-blur-md">
                
                {/* Active Designation Banner */}
                <div className="p-3 rounded-xl bg-[#111728] border border-[#1e293b] flex items-center gap-3 mb-5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${currentDesignationMeta.accentColor} shrink-0`}>
                    <currentDesignationMeta.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">
                      Signing in as {currentDesignationMeta.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      Routes to {currentDesignationMeta.targetDashboard}
                    </p>
                  </div>
                </div>

                {/* Alerts */}
                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* AIT Registration Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      AIT Registration Number
                    </label>
                    <input
                      type="text"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="e.g. AIT/2022/CE/042"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 uppercase font-mono transition-colors"
                    />
                  </div>

                  {/* AIT Roll Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      AIT Roll Number
                    </label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g. 22042 (or 21008 for Gen-Sec)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 uppercase font-mono transition-colors"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-purple-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 pr-10 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Verifying Authority...</span>
                    ) : (
                      <>
                        <span>Authenticate & Enter</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Click Fast Test Personas for Reviewers */}
                <div className="mt-6 pt-5 border-t border-[#1e293b] space-y-2.5">
                  <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Quick Test Login (1-Click Switch):</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <button
                      onClick={() => handleQuickPersonaSelect('user-student-1')}
                      className="p-2 rounded-lg bg-[#111728] border border-[#1e293b] hover:border-sky-500 text-left text-slate-300 transition-colors"
                    >
                      <p className="font-bold text-sky-400 truncate">Sanyam</p>
                      <p className="text-[9px] text-slate-500">Student (Roll: 22042)</p>
                    </button>

                    <button
                      onClick={() => handleQuickPersonaSelect('user-joint-sec-1')}
                      className="p-2 rounded-lg bg-[#111728] border border-[#1e293b] hover:border-purple-500 text-left text-slate-300 transition-colors"
                    >
                      <p className="font-bold text-purple-400 truncate">Ananya Roy</p>
                      <p className="text-[9px] text-slate-500">Joint Secretary (IT)</p>
                    </button>

                    <button
                      onClick={() => handleQuickPersonaSelect('user-club-sec-1')}
                      className="p-2 rounded-lg bg-[#111728] border border-[#1e293b] hover:border-indigo-500 text-left text-slate-300 transition-colors"
                    >
                      <p className="font-bold text-indigo-400 truncate">Rohan Patil</p>
                      <p className="text-[9px] text-slate-500">Club Secretary (Design)</p>
                    </button>

                    <button
                      onClick={() => handleQuickPersonaSelect('user-gen-sec-1')}
                      className="p-2 rounded-lg bg-[#111728] border border-[#1e293b] hover:border-rose-500 text-left text-slate-300 transition-colors"
                    >
                      <p className="font-bold text-rose-400 truncate">Nishant Singh</p>
                      <p className="text-[9px] text-slate-500">General Secretary</p>
                    </button>

                    <button
                      onClick={() => handleQuickPersonaSelect('user-student-2')}
                      className="col-span-2 p-2 rounded-lg bg-[#111728] border border-[#1e293b] hover:border-amber-500 text-left text-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-amber-400 truncate">Priya Deshmukh</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">TEST PENDING VERIFICATION</span>
                      </div>
                      <p className="text-[9px] text-slate-500">Student (Roll: 22088) — Awaiting AIT Roster Verification</p>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* ═══════════════════════════════════════════
               REGISTER VIEW: NEW STUDENT ACCOUNT CREATION
               ═══════════════════════════════════════════ */
            <div className="max-w-xl mx-auto rounded-3xl bg-[#0c101d] border border-[#1e293b] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300">
                <Info className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  New accounts are strictly provisioned with the <strong>Student</strong> role with <strong>Pending AIT Verification</strong> status. Leadership roles (Joint Secretary, Club Secretary, General Secretary) require official institutional appointments.
                </span>
              </div>

              {regErrorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{regErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Student Name
                  </label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Kartik Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Registration Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      AIT Registration Number
                    </label>
                    <input
                      type="text"
                      value={regAitRegNo}
                      onChange={(e) => setRegAitRegNo(e.target.value)}
                      placeholder="e.g. AIT/2023/CE/099"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white placeholder-slate-500 text-xs font-mono uppercase focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Roll Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      AIT Roll Number
                    </label>
                    <input
                      type="text"
                      value={regAitRollNo}
                      onChange={(e) => setRegAitRollNo(e.target.value)}
                      placeholder="e.g. 23099"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white placeholder-slate-500 text-xs font-mono uppercase focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* College Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official College Email Address
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. student@aitpune.edu.in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Branch */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Academic Branch
                    </label>
                    <select
                      value={regBranch}
                      onChange={(e) => setRegBranch(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                    </select>
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Graduation Year
                    </label>
                    <select
                      value={regYear}
                      onChange={(e) => setRegYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="2025">2025 (Final Year)</option>
                      <option value="2026">2026 (Third Year)</option>
                      <option value="2027">2027 (Second Year)</option>
                      <option value="2028">2028 (First Year)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Registration */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Validating Registry...</span>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Complete Registration</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#0c101d] border border-[#1e293b] p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Reset Account Password</h3>
            <p className="text-xs text-slate-400">
              Please contact the Student Welfare & Technical Affairs coordinator or submit an institutional ticket via your official AIT Pune college email.
            </p>
            <div className="p-3 rounded-xl bg-[#111728] text-xs text-slate-300 font-mono">
              admin.competihub@aitpune.edu.in
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
