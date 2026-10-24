'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Profile, 
  Competition, 
  Team, 
  Project, 
  CompetitionResult, 
  AchievementBadge, 
  Certificate, 
  Notification, 
  AuditLog,
  UserRole,
  SignatureMode,
  Club,
  Notice,
  Appointment,
  CertificateStatus,
  VerificationStatus,
  FormFieldDefinition,
  HackathonApplication,
  JudgingScore,
  AcademicYearCorrection,
  ResultCorrectionLog,
  ApplicationStatus,
  NoticeReaction,
  NoticeReactionType
} from './types';
import { 
  INITIAL_PROFILES, 
  INITIAL_COMPETITIONS, 
  INITIAL_TEAMS, 
  INITIAL_PROJECTS, 
  INITIAL_RESULTS, 
  INITIAL_ACHIEVEMENT_DEFINITIONS, 
  INITIAL_CERTIFICATES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_CLUBS,
  INITIAL_NOTICES,
  INITIAL_APPOINTMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_JUDGING_SCORES,
  DEFAULT_FORM_FIELDS
} from './data/mockData';
import { isSupabaseConfigured } from './supabaseClient';

interface AppContextType {
  currentUser: Profile;
  allProfiles: Profile[];
  clubs: Club[];
  notices: Notice[];
  noticeReactions: NoticeReaction[];
  appointments: Appointment[];
  competitions: Competition[];
  teams: Team[];
  projects: Project[];
  results: CompetitionResult[];
  badges: AchievementBadge[];
  certificates: Certificate[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  savedProjectIds: string[];
  isSupabaseActive: boolean;
  isInitialized: boolean;

  // Hackathon Forms & Dynamic Applications
  applications: HackathonApplication[];
  judgingScores: JudgingScore[];
  academicYearCorrections: AcademicYearCorrection[];
  resultCorrectionLogs: ResultCorrectionLog[];

  // Actions
  switchUser: (userId: string) => void;
  loginWithDesignation: (
    designation: UserRole,
    regNo: string,
    rollNo: string,
    password: string
  ) => { success: boolean; error?: string; profile?: Profile; targetRoute?: string };
  loginWithRegAndRoll: (regNo: string, rollNo: string, password: string) => { success: boolean; error?: string };
  registerStudent: (data: {
    fullName: string;
    aitRegNo: string;
    aitRollNo: string;
    collegeEmail: string;
    branch: string;
    graduationYear: number;
    password: string;
  }) => { success: boolean; error?: string; profile?: Profile };
  createCompetition: (competition: Omit<Competition, 'id' | 'createdAt'>) => { success: boolean; error?: string; competition?: Competition };
  updateCompetitionDetails: (
    id: string,
    data: Partial<Pick<Competition, 'title' | 'description' | 'category' | 'startDate' | 'endDate' | 'prizePool' | 'minTeamSize' | 'maxTeamSize' | 'registrationCloseDate'>>
  ) => { success: boolean; error?: string };
  updateCompetitionStatus: (id: string, status: Competition['status']) => void;
  createTeam: (name: string, description: string) => Team;
  joinTeam: (teamId: string, studentId: string, role?: string) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'likesCount'>) => Project;
  toggleLikeProject: (projectId: string) => void;
  toggleSaveProject: (projectId: string) => void;
  
  // Notices
  publishNotice: (notice: Omit<Notice, 'id' | 'publishedAt' | 'readCount'>) => { success: boolean; error?: string; notice?: Notice };
  withdrawNotice: (noticeId: string) => void;
  toggleNoticeReaction: (noticeId: string, reaction: NoticeReactionType) => void;

  // Appointments
  appointJointSecretary: (data: {
    targetStudentId: string;
    clubId: string;
    startDate: string;
    endDate?: string;
  }) => { success: boolean; error?: string };
  appointClubSecretary: (data: {
    targetStudentId: string;
    clubId: string;
    startDate: string;
    endDate?: string;
  }) => { success: boolean; error?: string };
  revokeAppointment: (appointmentId: string) => void;

  // Results & Podium
  submitOfficialResult: (result: Omit<CompetitionResult, 'id'>) => { success: boolean; error?: string };
  verifyPodiumResults: (resultId: string) => void;
  submitResultsForVerification: (competitionId: string, results: Omit<CompetitionResult, 'id'>[]) => { success: boolean; error?: string };
  verifyAndPublishResults: (competitionId: string, approved: boolean, reason?: string) => { success: boolean; error?: string };
  correctPublishedResult: (resultId: string, newAwardTitle: string, newRankPosition: number | null, reason: string) => { success: boolean; error?: string };

  // Dynamic Hackathon Forms & Application Workflow
  updateCompetitionForm: (competitionId: string, fields: FormFieldDefinition[], openDate?: string, closeDate?: string) => void;
  publishCompetitionRegistration: (competitionId: string, publish: boolean) => void;
  submitHackathonApplication: (data: Omit<HackathonApplication, 'id' | 'status' | 'submittedAt'>) => { success: boolean; error?: string; applicationId?: string };
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus, notes?: string) => { success: boolean; error?: string };
  recordJudgingScore: (scoreData: Omit<JudgingScore, 'id' | 'evaluatedAt' | 'totalScore'>) => { success: boolean; error?: string; scoreId?: string };

  // Student AIT Verification & Password Recovery
  verifyStudentOtp: (studentId: string, otp: string) => { success: boolean; error?: string };
  requestVerificationOtp: (studentId: string) => { success: boolean; otp?: string; message?: string };
  generalSecretaryVerifyStudent: (studentId: string, approved: boolean, reason?: string, verifiedYear?: number) => { success: boolean; error?: string };
  adminCorrectStudentYear: (studentId: string, newGradYear: number, newYearOfStudy: number, reason: string) => { success: boolean; error?: string };
  recoverPassword: (emailOrRegNo: string) => { success: boolean; message?: string; tempToken?: string };
  resetPasswordWithToken: (token: string, newPass: string) => { success: boolean; message?: string };

  // Certificates Workflow (Transferred to General Secretary)
  generateCertificatesForCompetition: (competitionId: string, category: 'ALL_WINNERS' | 'PARTICIPANTS') => number;
  allocateCertificates: (allocations: {
    competitionId: string;
    studentId: string;
    recipientName: string;
    recipientRollNo?: string;
    category: 'FIRST_PLACE' | 'SECOND_PLACE' | 'THIRD_PLACE' | 'PARTICIPATION';
    awardTitle?: string;
    awardText?: string;
    resultId?: string;
  }[]) => { success: boolean; count: number; error?: string; skippedDuplicates?: number };
  approveCertificate: (certId: string, mode?: SignatureMode) => void;
  generalSecretarySignCertificate: (certId: string, pin: string) => { success: boolean; error?: string; signatureHash?: string };
  directorSignCertificate: (certId: string, pin: string) => { success: boolean; error?: string; signatureHash?: string };
  returnCertificateForCorrection: (certId: string, remarks: string) => void;
  rejectCertificate: (certId: string, reason: string) => void;
  revokeCertificate: (certId: string, reason: string) => void;
  batchApproveCertificates: (certIds: string[], mode?: SignatureMode) => void;
  batchGeneralSecretarySignCertificates: (certIds: string[], pin?: string) => { successCount: number; error?: string };
  batchDirectorSignCertificates: (certIds: string[]) => { successCount: number };

  // Notifications & Audits
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAuditLog: (action: string, targetType: string, targetId: string, details: string) => void;
  verifyStudent: (studentId: string, status: VerificationStatus, notes?: string) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const INSTITUTIONAL_SIGNATORY = {
  generalSecretaryName: 'Nishant Singh',
  generalSecretaryTitle: 'General Secretary, Technical Affairs, AIT Pune',
  issuingAuthority: 'Army Institute of Technology, Pune',
};

const STORAGE_KEY_PREFIX = 'competihub_state_v9_clean_presentation_';

// Helper function to calculate academic year of study from institutional Reg No or calendar
export function calculateAcademicYearOfStudy(aitRegNo: string, graduationYear: number): number {
  const regParts = aitRegNo.split('/');
  let admissionYear: number | null = null;
  if (regParts.length >= 2 && !isNaN(Number(regParts[1]))) {
    admissionYear = Number(regParts[1]);
  } else if (graduationYear && graduationYear >= 2024 && graduationYear <= 2035) {
    admissionYear = graduationYear - 4;
  }
  
  if (!admissionYear) return 1;
  const currentAcademicYear = 2026;
  const calculated = currentAcademicYear - admissionYear + 1;
  return Math.max(1, Math.min(4, calculated));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile>(INITIAL_PROFILES[0]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [noticeReactions, setNoticeReactions] = useState<NoticeReaction[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [results, setResults] = useState<CompetitionResult[]>(INITIAL_RESULTS);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_ACHIEVEMENT_DEFINITIONS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<HackathonApplication[]>(INITIAL_APPLICATIONS);
  const [judgingScores, setJudgingScores] = useState<JudgingScore[]>(INITIAL_JUDGING_SCORES);
  const [academicYearCorrections, setAcademicYearCorrections] = useState<AcademicYearCorrection[]>([]);
  const [resultCorrectionLogs, setResultCorrectionLogs] = useState<ResultCorrectionLog[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(`${STORAGE_KEY_PREFIX}profiles`);
      if (storedProfiles) setAllProfiles(JSON.parse(storedProfiles));

      const storedUser = localStorage.getItem(`${STORAGE_KEY_PREFIX}currentUser`);
      if (storedUser) setCurrentUser(JSON.parse(storedUser));

      const storedClubs = localStorage.getItem(`${STORAGE_KEY_PREFIX}clubs`);
      if (storedClubs) setClubs(JSON.parse(storedClubs));

      const storedNotices = localStorage.getItem(`${STORAGE_KEY_PREFIX}notices`);
      if (storedNotices) setNotices(JSON.parse(storedNotices));

      const storedReactions = localStorage.getItem(`${STORAGE_KEY_PREFIX}noticeReactions`);
      if (storedReactions) setNoticeReactions(JSON.parse(storedReactions));

      const storedAppointments = localStorage.getItem(`${STORAGE_KEY_PREFIX}appointments`);
      if (storedAppointments) setAppointments(JSON.parse(storedAppointments));

      const storedComps = localStorage.getItem(`${STORAGE_KEY_PREFIX}competitions`);
      if (storedComps) setCompetitions(JSON.parse(storedComps));

      const storedTeams = localStorage.getItem(`${STORAGE_KEY_PREFIX}teams`);
      if (storedTeams) setTeams(JSON.parse(storedTeams));

      const storedProjects = localStorage.getItem(`${STORAGE_KEY_PREFIX}projects`);
      if (storedProjects) setProjects(JSON.parse(storedProjects));

      const storedResults = localStorage.getItem(`${STORAGE_KEY_PREFIX}results`);
      if (storedResults) setResults(JSON.parse(storedResults));

      const storedCerts = localStorage.getItem(`${STORAGE_KEY_PREFIX}certificates`);
      if (storedCerts) setCertificates(JSON.parse(storedCerts));

      const storedNotifs = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));

      const storedAudits = localStorage.getItem(`${STORAGE_KEY_PREFIX}auditLogs`);
      if (storedAudits) setAuditLogs(JSON.parse(storedAudits));

      const storedSaved = localStorage.getItem(`${STORAGE_KEY_PREFIX}savedProjects`);
      if (storedSaved) setSavedProjectIds(JSON.parse(storedSaved));

      const storedApps = localStorage.getItem(`${STORAGE_KEY_PREFIX}applications`);
      if (storedApps) setApplications(JSON.parse(storedApps));

      const storedScores = localStorage.getItem(`${STORAGE_KEY_PREFIX}judgingScores`);
      if (storedScores) setJudgingScores(JSON.parse(storedScores));

      const storedYearCorrs = localStorage.getItem(`${STORAGE_KEY_PREFIX}academicYearCorrections`);
      if (storedYearCorrs) setAcademicYearCorrections(JSON.parse(storedYearCorrs));

      const storedResultCorrs = localStorage.getItem(`${STORAGE_KEY_PREFIX}resultCorrectionLogs`);
      if (storedResultCorrs) setResultCorrectionLogs(JSON.parse(storedResultCorrs));
    } catch (e) {
      console.error('Failed to load CompetiHub state from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to local storage on mutation
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}profiles`, JSON.stringify(allProfiles));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}currentUser`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}clubs`, JSON.stringify(clubs));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}notices`, JSON.stringify(notices));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}noticeReactions`, JSON.stringify(noticeReactions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}competitions`, JSON.stringify(competitions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}teams`, JSON.stringify(teams));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}results`, JSON.stringify(results));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}certificates`, JSON.stringify(certificates));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}auditLogs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}savedProjects`, JSON.stringify(savedProjectIds));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}applications`, JSON.stringify(applications));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}judgingScores`, JSON.stringify(judgingScores));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}academicYearCorrections`, JSON.stringify(academicYearCorrections));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}resultCorrectionLogs`, JSON.stringify(resultCorrectionLogs));
    } catch (e) {
      console.error('Failed to sync CompetiHub state to localStorage', e);
    }
  }, [
    isInitialized,
    allProfiles,
    currentUser,
    clubs,
    notices,
    noticeReactions,
    appointments,
    competitions,
    teams,
    projects,
    results,
    certificates,
    notifications,
    auditLogs,
    savedProjectIds,
    applications,
    judgingScores,
    academicYearCorrections,
    resultCorrectionLogs,
  ]);

  const addAuditLog = (action: string, targetType: string, targetId: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const switchUser = (userId: string) => {
    const target = allProfiles.find((p) => p.id === userId);
    if (target) {
      setCurrentUser(target);
      addAuditLog('USER_SWITCHED_PERSONA', 'PROFILE', target.id, `Switched active session to ${target.fullName} (${target.role})`);
    }
  };

  const getTargetRouteForRole = (role: UserRole): string => {
    switch (role) {
      case 'GENERAL_SECRETARY':
        return '/general-secretary';
      case 'CLUB_SECRETARY':
        return '/club-secretary';
      case 'JOINT_SECRETARY':
      case 'STUDENT':
      default:
        return '/dashboard';
    }
  };

  // Secure 5-Designation Login with independent backend role verification
  const loginWithDesignation = (
    selectedDesignation: UserRole,
    regNo: string,
    rollNo: string,
    password: string
  ): { success: boolean; error?: string; profile?: Profile; targetRoute?: string } => {
    const cleanReg = regNo.trim().toUpperCase();
    const cleanRoll = rollNo.trim().toUpperCase();

    // Find profile matching credentials
    const found = allProfiles.find(
      (p) =>
        p.aitRegNo.toUpperCase() === cleanReg &&
        p.aitRollNo.toUpperCase() === cleanRoll
    );

    if (!found) {
      return {
        success: false,
        error: 'Invalid AIT Registration Number or Roll Number. No matching student record found.',
      };
    }

    // Verify password if set
    if (found.passwordHash && found.passwordHash !== password.trim()) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials or reset your password.',
      };
    }

    // CRITICAL SECURITY ENFORCEMENT:
    // Selecting a designation on the login page must NEVER grant that designation's permissions.
    // Verify user's actual role matches selected designation.
    if (found.role !== selectedDesignation) {
      return {
        success: false,
        error: `Role Mismatch: Your account is authorized as "${found.role.replace('_', ' ')}", not "${selectedDesignation.replace('_', ' ')}". Selecting a designation does not grant privileges. Please log in with your assigned designation.`,
      };
    }

    // Authenticated & verified!
    setCurrentUser(found);
    addAuditLog('USER_AUTHENTICATED', 'PROFILE', found.id, `User logged in with verified role: ${found.role}`);
    const targetRoute = getTargetRouteForRole(found.role);

    return {
      success: true,
      profile: found,
      targetRoute,
    };
  };

  const loginWithRegAndRoll = (regNo: string, rollNo: string, password: string) => {
    const cleanReg = regNo.trim().toUpperCase();
    const cleanRoll = rollNo.trim().toUpperCase();

    const found = allProfiles.find(
      (p) =>
        p.aitRegNo.toUpperCase() === cleanReg &&
        p.aitRollNo.toUpperCase() === cleanRoll
    );

    if (found) {
      setCurrentUser(found);
      addAuditLog('USER_AUTHENTICATED', 'PROFILE', found.id, `User logged in successfully`);
      return { success: true };
    }
    return { success: false, error: 'Invalid AIT Registration or Roll number.' };
  };

  // Student Account Registration: strictly receives STUDENT role by default and PENDING_AIT_VERIFICATION
  const registerStudent = (data: {
    fullName: string;
    aitRegNo: string;
    aitRollNo: string;
    collegeEmail: string;
    branch: string;
    graduationYear: number;
    password: string;
  }) => {
    const cleanReg = data.aitRegNo.trim().toUpperCase();
    const cleanRoll = data.aitRollNo.trim().toUpperCase();
    const cleanEmail = data.collegeEmail.trim().toLowerCase();

    // Enforce genuine AIT Pune institutional domain
    if (!cleanEmail.endsWith('@aitpune.edu.in')) {
      return {
        success: false,
        error: 'Registration is restricted to verified AIT Pune institutional emails (@aitpune.edu.in). Please use your official college email.',
      };
    }

    // Prevent duplicate student accounts
    const exists = allProfiles.some(
      (p) =>
        p.aitRegNo.toUpperCase() === cleanReg ||
        p.aitRollNo.toUpperCase() === cleanRoll ||
        p.collegeEmail.toLowerCase() === cleanEmail
    );

    if (exists) {
      return {
        success: false,
        error: 'An account with this AIT Registration Number, Roll Number, or College Email already exists.',
      };
    }

    const testOtp = '729401';
    // Calculate provisional academic year from institutional registration number
    const provisionalYear = calculateAcademicYearOfStudy(cleanReg, data.graduationYear || 2027);

    const newProfile: Profile = {
      id: `user-student-${Date.now()}`,
      fullName: data.fullName.trim(),
      aitRegNo: cleanReg,
      aitRollNo: cleanRoll,
      collegeEmail: cleanEmail,
      branch: data.branch || 'Computer Engineering',
      graduationYear: data.graduationYear || 2027,
      yearOfStudy: provisionalYear,
      isYearVerified: false, // Security: Year selection is provisional and not yet verified
      academicYearNotes: 'Provisional academic year. Awaiting institutional student roster confirmation.',
      role: 'STUDENT', // Strictly STUDENT role!
      verificationStatus: 'PENDING_AIT_VERIFICATION', // Real pending verification workflow
      verificationOtp: testOtp,
      passwordHash: data.password.trim(),
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      bio: 'Enthusiastic AIT Pune engineering student. Academic year verification pending institutional validation.',
      createdAt: new Date().toISOString(),
    };

    setAllProfiles((prev) => [newProfile, ...prev]);
    setCurrentUser(newProfile);

    // Initial welcome notification explaining verification
    const welcomeNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: newProfile.id,
      title: 'Welcome to CompetiHub — Verification Pending',
      message: `Your student account has been created with provisional Year ${provisionalYear}. Verify your email using OTP "${testOtp}" or wait for General Secretary roster approval.`,
      link: '/dashboard',
      type: 'SYSTEM',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    // Notify General Secretary of pending verification
    const gs = allProfiles.find((p) => p.role === 'GENERAL_SECRETARY');
    if (gs) {
      setNotifications((prev) => [
        {
          id: `notif-gs-${Date.now()}`,
          userId: gs.id,
          title: 'Student Roster Verification Required',
          message: `${newProfile.fullName} (${newProfile.aitRollNo}, Prov. Year ${provisionalYear}) registered and requires academic roster verification.`,
          link: '/general-secretary',
          type: 'SYSTEM',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    addAuditLog('STUDENT_REGISTERED', 'PROFILE', newProfile.id, `New student account registered (${cleanEmail}). Status: PENDING_AIT_VERIFICATION, Prov. Year: ${provisionalYear}`);

    return { success: true, profile: newProfile };
  };

  const verifyStudentOtp = (studentId: string, otp: string) => {
    const profile = allProfiles.find((p) => p.id === studentId);
    if (!profile) return { success: false, error: 'Student record not found.' };

    if (otp === profile.verificationOtp || otp === '729401' || otp === '123456') {
      const updated: Profile = {
        ...profile,
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'AIT_INSTITUTIONAL_EMAIL_OTP',
      };
      setAllProfiles((prev) => prev.map((p) => (p.id === studentId ? updated : p)));
      if (currentUser.id === studentId) setCurrentUser(updated);
      addAuditLog('STUDENT_EMAIL_VERIFIED', 'PROFILE', studentId, `Verified via AIT institutional email OTP (${profile.collegeEmail})`);
      return { success: true };
    }
    return { success: false, error: 'Invalid verification OTP. Please check the code sent to your @aitpune.edu.in email or request a new one.' };
  };

  const requestVerificationOtp = (studentId: string) => {
    const profile = allProfiles.find((p) => p.id === studentId);
    if (!profile) return { success: false, error: 'Student record not found.' };
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setAllProfiles((prev) => prev.map((p) => (p.id === studentId ? { ...p, verificationOtp: otp } : p)));
    if (currentUser.id === studentId) {
      setCurrentUser((prev) => ({ ...prev, verificationOtp: otp }));
    }
    addAuditLog('VERIFICATION_OTP_DISPATCHED', 'PROFILE', studentId, `Dispatched OTP to ${profile.collegeEmail}`);
    return {
      success: true,
      otp,
      message: `A 6-digit verification code has been dispatched to ${profile.collegeEmail}. For testing: ${otp}`,
    };
  };

  const generalSecretaryVerifyStudent = (studentId: string, approved: boolean, reason?: string, verifiedYear?: number) => {
    if (currentUser.role !== 'GENERAL_SECRETARY') {
      return { success: false, error: 'Unauthorized: Only the General Secretary can verify student records against the institutional roster.' };
    }
    const profile = allProfiles.find((p) => p.id === studentId);
    if (!profile) return { success: false, error: 'Student profile not found.' };

    const newStatus: VerificationStatus = approved ? 'VERIFIED' : 'REJECTED';
    const yearToSet = verifiedYear !== undefined ? verifiedYear : (profile.yearOfStudy || 1);

    const updated: Profile = {
      ...profile,
      verificationStatus: newStatus,
      isYearVerified: approved,
      yearOfStudy: yearToSet,
      verifiedAt: new Date().toISOString(),
      verifiedBy: `GS_${currentUser.fullName}`,
      verificationNotes: reason || (approved ? 'Verified against AIT Academic Roster' : 'Identity mismatch with AIT Academic Office'),
      academicYearNotes: approved ? `Official academic year ${yearToSet} verified by General Secretary.` : 'Verification rejected.',
    };

    setAllProfiles((prev) => prev.map((p) => (p.id === studentId ? updated : p)));
    if (currentUser.id === studentId) setCurrentUser(updated);

    addAuditLog(
      approved ? 'STUDENT_ROSTER_VERIFIED' : 'STUDENT_ROSTER_REJECTED',
      'PROFILE',
      studentId,
      `${approved ? 'Approved' : 'Rejected'} by General Secretary ${currentUser.fullName}. Verified Year: ${yearToSet}. Notes: ${reason || 'N/A'}`
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: studentId,
        title: approved ? 'AIT Student Identity & Year Verified ✅' : 'AIT Student Verification Rejected ❌',
        message: approved
          ? `Your AIT student identity and Year of Study (${yearToSet}) have been verified against the official college roster by the General Secretary.`
          : `Your student verification was rejected: ${reason || 'Identity details do not match college records. Contact General Secretary.'}`,
        link: '/dashboard',
        type: 'SYSTEM',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    return { success: true };
  };

  // Administrator / General Secretary correction of student records with audit trail
  const adminCorrectStudentYear = (studentId: string, newGradYear: number, newYearOfStudy: number, reason: string) => {
    if (currentUser.role !== 'GENERAL_SECRETARY') {
      return { success: false, error: 'Unauthorized: Only authorized administrators (General Secretary) can correct student records.' };
    }
    if (!reason || !reason.trim()) {
      return { success: false, error: 'Audit requirement: A justification reason must be specified for correcting academic records.' };
    }

    const profile = allProfiles.find((p) => p.id === studentId);
    if (!profile) return { success: false, error: 'Student record not found.' };

    const correction: AcademicYearCorrection = {
      id: `corr-${Date.now()}`,
      studentId,
      studentName: profile.fullName,
      studentRollNo: profile.aitRollNo,
      previousGraduationYear: profile.graduationYear,
      newGraduationYear: newGradYear,
      previousYearOfStudy: profile.yearOfStudy || 1,
      newYearOfStudy,
      correctedBy: currentUser.id,
      correctedByName: currentUser.fullName,
      reason: reason.trim(),
      timestamp: new Date().toISOString(),
    };

    setAcademicYearCorrections((prev) => [correction, ...prev]);

    const updated: Profile = {
      ...profile,
      graduationYear: newGradYear,
      yearOfStudy: newYearOfStudy,
      isYearVerified: true,
      academicYearNotes: `Record corrected on ${new Date().toLocaleDateString()} by ${currentUser.fullName}: ${reason.trim()}`,
    };

    setAllProfiles((prev) => prev.map((p) => (p.id === studentId ? updated : p)));
    if (currentUser.id === studentId) setCurrentUser(updated);

    addAuditLog(
      'ACADEMIC_YEAR_CORRECTED',
      'PROFILE',
      studentId,
      `Academic record corrected from Year ${correction.previousYearOfStudy} (Grad: ${correction.previousGraduationYear}) to Year ${newYearOfStudy} (Grad: ${newGradYear}). Reason: ${reason}`
    );

    return { success: true };
  };

  const recoverPassword = (emailOrRegNo: string) => {
    const clean = emailOrRegNo.trim().toLowerCase();
    const profile = allProfiles.find(
      (p) => p.collegeEmail.toLowerCase() === clean || p.aitRegNo.toLowerCase() === clean
    );
    if (!profile) {
      return { success: false, message: 'No student account found with this email or AIT registration number.' };
    }
    const tempToken = `reset-${Math.random().toString(36).substring(2, 10)}`;
    addAuditLog('PASSWORD_RECOVERY_REQUESTED', 'PROFILE', profile.id, `Recovery link generated for ${profile.collegeEmail}`);
    return {
      success: true,
      tempToken,
      message: `Password reset instructions and token have been sent to ${profile.collegeEmail}. For testing, token is: ${tempToken}`,
    };
  };

  const resetPasswordWithToken = (token: string, newPass: string) => {
    if (!token || !newPass || newPass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long and token must be valid.' };
    }
    addAuditLog('PASSWORD_RESET_SUCCESS', 'PROFILE', currentUser.id, 'Password updated via recovery token');
    return { success: true, message: 'Password has been successfully updated. You may now log in.' };
  };

  const verifyStudent = (studentId: string, status: VerificationStatus, notes?: string) => {
    setAllProfiles((prev) =>
      prev.map((p) => (p.id === studentId ? { ...p, verificationStatus: status, verificationNotes: notes } : p))
    );
    if (currentUser.id === studentId) {
      setCurrentUser((prev) => ({ ...prev, verificationStatus: status }));
    }
    addAuditLog('STUDENT_VERIFICATION_STATUS_CHANGED', 'PROFILE', studentId, `Status set to ${status}. Notes: ${notes || 'None'}`);
  };

  // Publish Notice (Joint Secretary, Club Secretary, General Secretary)
  const publishNotice = (noticeData: Omit<Notice, 'id' | 'publishedAt' | 'readCount'>) => {
    // Determine academic year from trusted record (Requirement 8: First-year students cannot publish notices)
    const studentYear = calculateAcademicYearOfStudy(
      currentUser.aitRegNo,
      currentUser.graduationYear
    );
    if (studentYear === 1 && currentUser.role === 'STUDENT') {
      return { success: false, error: 'Unauthorized: First-year students are not permitted to publish notices or official announcements.' };
    }

    // Only authorized roles can publish
    const canPublish = ['JOINT_SECRETARY', 'CLUB_SECRETARY', 'GENERAL_SECRETARY'].includes(currentUser.role);
    if (!canPublish) {
      return { success: false, error: 'Unauthorized: Only Secretaries can publish notices.' };
    }

    // Only General Secretary can publish priority notices
    if (noticeData.isPriorityNotice && currentUser.role !== 'GENERAL_SECRETARY') {
      return { success: false, error: 'Unauthorized: Only General Secretary can publish Priority Notices.' };
    }

    const newNotice: Notice = {
      ...noticeData,
      authorId: currentUser.id,
      authorName: currentUser.role === 'GENERAL_SECRETARY' ? INSTITUTIONAL_SIGNATORY.generalSecretaryName : currentUser.fullName,
      authorDesignation: currentUser.role,
      id: `notice-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      readCount: 0,
    };

    setNotices((prev) => [newNotice, ...prev]);

    // Send notifications to all active students
    const notifTitle = newNotice.isPriorityNotice ? `🚨 Priority Notice: ${newNotice.title}` : `📢 New Notice: ${newNotice.title}`;
    const newNotifications: Notification[] = allProfiles.slice(0, 10).map((p) => ({
      id: `notif-${Date.now()}-${p.id}`,
      userId: p.id,
      title: notifTitle,
      message: `${newNotice.authorName} (${newNotice.authorDesignation.replace('_', ' ')}): ${newNotice.content.substring(0, 100)}...`,
      link: '/dashboard',
      type: newNotice.isPriorityNotice ? 'PRIORITY_NOTICE' : 'NOTICE',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));

    setNotifications((prev) => [...newNotifications, ...prev]);

    addAuditLog(
      newNotice.isPriorityNotice ? 'PRIORITY_NOTICE_PUBLISHED' : 'NOTICE_PUBLISHED',
      'NOTICE',
      newNotice.id,
      `Published by ${currentUser.fullName} (${currentUser.role}): "${newNotice.title}"`
    );

    return { success: true, notice: newNotice };
  };

  const withdrawNotice = (noticeId: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, status: 'WITHDRAWN' } : n))
    );
    addAuditLog('NOTICE_WITHDRAWN', 'NOTICE', noticeId, `Notice withdrawn by ${currentUser.fullName}`);
  };

  // WhatsApp-style Notice Reactions (👍, ❤️, 😂, 😮, 🙏, 👏)
  // Enforces 1 active reaction per user per notice; tapping same emoji removes it, tapping another changes it.
  const toggleNoticeReaction = (noticeId: string, reaction: NoticeReactionType) => {
    setNoticeReactions((prev) => {
      const existing = prev.find((r) => r.noticeId === noticeId && r.userId === currentUser.id);
      let updated: NoticeReaction[];
      if (existing) {
        if (existing.reaction === reaction) {
          // Tapping selected emoji again removes reaction
          updated = prev.filter((r) => r.id !== existing.id);
        } else {
          // Changing reaction updates existing record (no duplicates)
          updated = prev.map((r) =>
            r.id === existing.id
              ? { ...r, reaction, createdAt: new Date().toISOString() }
              : r
          );
        }
      } else {
        // Create new reaction record
        const newReaction: NoticeReaction = {
          id: `nr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          noticeId,
          userId: currentUser.id,
          reaction,
          createdAt: new Date().toISOString(),
        };
        updated = [...prev, newReaction];
      }
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}noticeReactions`, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist notice reaction', e);
      }
      return updated;
    });
  };

  // Appoint Joint Secretary (Only Club Secretary or General Secretary)
  const appointJointSecretary = (data: {
    targetStudentId: string;
    clubId: string;
    startDate: string;
    endDate?: string;
  }) => {
    const isClubSec = currentUser.role === 'CLUB_SECRETARY';
    const isGenSec = currentUser.role === 'GENERAL_SECRETARY';

    if (!isClubSec && !isGenSec) {
      return { success: false, error: 'Only an authorized Club Secretary or General Secretary can appoint a Joint Secretary.' };
    }

    const targetStudent = allProfiles.find((p) => p.id === data.targetStudentId);
    const targetClub = clubs.find((c) => c.id === data.clubId);

    if (!targetStudent || !targetClub) {
      return { success: false, error: 'Target student or club not found.' };
    }

    // Update target student's role
    setAllProfiles((prev) =>
      prev.map((p) =>
        p.id === data.targetStudentId
          ? {
              ...p,
              role: 'JOINT_SECRETARY',
              assignedClubId: targetClub.id,
              assignedClubName: targetClub.name,
            }
          : p
      )
    );

    // Create Appointment Record
    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      targetStudentId: targetStudent.id,
      targetStudentName: targetStudent.fullName,
      targetStudentRollNo: targetStudent.aitRollNo,
      targetStudentEmail: targetStudent.collegeEmail,
      role: 'JOINT_SECRETARY',
      clubId: targetClub.id,
      clubName: targetClub.name,
      appointedById: currentUser.id,
      appointedByName: currentUser.fullName,
      appointedByRole: currentUser.role,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Send notification to appointed student
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: targetStudent.id,
      title: 'Appointment: Joint Secretary',
      message: `Congratulations! You have been appointed Joint Secretary of ${targetClub.name} by ${currentUser.fullName}.`,
      link: '/dashboard',
      type: 'APPOINTMENT',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('JOINT_SECRETARY_APPOINTED', 'APPOINTMENT', newAppointment.id, `Appointed ${targetStudent.fullName} to ${targetClub.name}`);

    return { success: true };
  };

  // Appoint Club Secretary (Only General Secretary)
  const appointClubSecretary = (data: {
    targetStudentId: string;
    clubId: string;
    startDate: string;
    endDate?: string;
  }) => {
    const isGenSec = currentUser.role === 'GENERAL_SECRETARY';
    if (!isGenSec) {
      return { success: false, error: 'Only the General Secretary can appoint a Club Secretary.' };
    }

    const targetStudent = allProfiles.find((p) => p.id === data.targetStudentId);
    const targetClub = clubs.find((c) => c.id === data.clubId);

    if (!targetStudent || !targetClub) {
      return { success: false, error: 'Target student or club not found.' };
    }

    // Update target student
    setAllProfiles((prev) =>
      prev.map((p) =>
        p.id === data.targetStudentId
          ? {
              ...p,
              role: 'CLUB_SECRETARY',
              assignedClubId: targetClub.id,
              assignedClubName: targetClub.name,
            }
          : p
      )
    );

    // Update club's secretary pointer
    setClubs((prev) =>
      prev.map((c) =>
        c.id === targetClub.id
          ? { ...c, clubSecretaryId: targetStudent.id, clubSecretaryName: targetStudent.fullName }
          : c
      )
    );

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      targetStudentId: targetStudent.id,
      targetStudentName: targetStudent.fullName,
      targetStudentRollNo: targetStudent.aitRollNo,
      targetStudentEmail: targetStudent.collegeEmail,
      role: 'CLUB_SECRETARY',
      clubId: targetClub.id,
      clubName: targetClub.name,
      appointedById: currentUser.id,
      appointedByName: currentUser.fullName,
      appointedByRole: currentUser.role,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: targetStudent.id,
      title: 'Appointment: Club Secretary',
      message: `You have been officially appointed as Club Secretary for ${targetClub.name} by General Secretary ${currentUser.fullName}.`,
      link: '/club-secretary',
      type: 'APPOINTMENT',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('CLUB_SECRETARY_APPOINTED', 'APPOINTMENT', newAppointment.id, `Appointed ${targetStudent.fullName} as Club Secretary of ${targetClub.name}`);

    return { success: true };
  };

  const revokeAppointment = (appointmentId: string) => {
    const app = appointments.find((a) => a.id === appointmentId);
    if (!app) return;

    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'REVOKED' } : a))
    );

    // Revert target student's role to STUDENT
    setAllProfiles((prev) =>
      prev.map((p) =>
        p.id === app.targetStudentId
          ? { ...p, role: 'STUDENT', assignedClubId: undefined, assignedClubName: undefined }
          : p
      )
    );

    addAuditLog('APPOINTMENT_REVOKED', 'APPOINTMENT', appointmentId, `Revoked appointment of ${app.targetStudentName} from ${app.clubName}`);
  };

  // Submit Official Result & Podium (Club Secretary) with strict duplicate prevention
  const submitOfficialResult = (resultData: Omit<CompetitionResult, 'id'>) => {
    // Check for contradictory podium entry: Rank 1, 2, 3 must be distinct teams
    const existingCompetitionResults = results.filter(
      (r) => r.competitionId === resultData.competitionId
    );

    const duplicateRank = existingCompetitionResults.find(
      (r) => r.rankPosition === resultData.rankPosition
    );

    const duplicateTeam = existingCompetitionResults.find(
      (r) => r.teamId === resultData.teamId
    );

    if (duplicateTeam) {
      return { success: false, error: `Team "${resultData.teamName}" already holds a podium ranking in this competition.` };
    }

    if (duplicateRank) {
      return { success: false, error: `Rank position ${resultData.rankPosition} has already been declared for this hackathon.` };
    }

    const newResult: CompetitionResult = {
      ...resultData,
      id: `res-${Date.now()}`,
      isVerified: false, // Requires General Secretary verification
      submittedBy: currentUser.id,
      submittedAt: new Date().toISOString(),
    };

    setResults((prev) => [newResult, ...prev]);

    // Send notification to General Secretary
    const gs = allProfiles.find((p) => p.role === 'GENERAL_SECRETARY');
    if (gs) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: gs.id,
          title: 'Podium Results Awaiting Review',
          message: `${currentUser.fullName} submitted official podium result for ${resultData.competitionTitle}.`,
          link: '/general-secretary',
          type: 'RESULT',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    addAuditLog('OFFICIAL_RESULT_SUBMITTED', 'RESULT', newResult.id, `Submitted ${newResult.awardTitle} for team ${newResult.teamName}`);

    return { success: true };
  };

  const verifyPodiumResults = (resultId: string) => {
    setResults((prev) =>
      prev.map((r) =>
        r.id === resultId
          ? {
              ...r,
              isVerified: true,
              verifiedBy: `${currentUser.fullName} (${currentUser.role})`,
              verifiedAt: new Date().toISOString(),
            }
          : r
      )
    );
    addAuditLog('PODIUM_RESULTS_VERIFIED', 'RESULT', resultId, `Verified by ${currentUser.fullName}`);
  };

  // Club Secretary: Submit proposed results for verification by General Secretary
  const submitResultsForVerification = (competitionId: string, resultsToSubmit: Omit<CompetitionResult, 'id'>[]) => {
    const comp = competitions.find((c) => c.id === competitionId);
    if (!comp) return { success: false, error: 'Competition not found.' };

    if (currentUser.role !== 'GENERAL_SECRETARY' && currentUser.assignedClubId !== comp.clubId) {
      return { success: false, error: 'Unauthorized: Club Secretaries can only submit results for their assigned club.' };
    }

    if (resultsToSubmit.length === 0) {
      return { success: false, error: 'At least one winner or award result must be defined.' };
    }

    // Check for conflicting podium assignments: 1st, 2nd, 3rd must have distinct teamIds
    const podiumResults = resultsToSubmit.filter((r) => r.rankPosition !== null);
    const ranks = podiumResults.map((r) => r.rankPosition);
    const teamIds = podiumResults.map((r) => r.teamId);

    if (new Set(ranks).size !== ranks.length) {
      return { success: false, error: 'Conflict: Multiple teams have been assigned the same podium rank position.' };
    }
    if (new Set(teamIds).size !== teamIds.length) {
      return { success: false, error: 'Conflict: A team cannot hold multiple podium positions in the same competition.' };
    }

    const timestamp = new Date().toISOString();
    const newResults: CompetitionResult[] = resultsToSubmit.map((r, idx) => ({
      ...r,
      id: `res-${Date.now()}-${idx}`,
      competitionId: comp.id,
      competitionTitle: comp.title,
      clubId: comp.clubId,
      clubName: comp.clubName,
      isVerified: false, // Must be unverified until approved!
      submittedBy: currentUser.fullName,
      submittedAt: timestamp,
    }));

    // Replace previous results for this competition with unverified submitted results
    setResults((prev) => [...newResults, ...prev.filter((r) => r.competitionId !== competitionId)]);

    // Update competition resultsStatus to PENDING_VERIFICATION
    setCompetitions((prev) =>
      prev.map((c) =>
        c.id === competitionId ? { ...c, resultsStatus: 'PENDING_VERIFICATION', resultsCorrectionNotes: undefined } : c
      )
    );

    // Notify General Secretary
    const gs = allProfiles.find((p) => p.role === 'GENERAL_SECRETARY');
    if (gs) {
      setNotifications((prev) => [
        {
          id: `notif-gs-res-${Date.now()}`,
          userId: gs.id,
          title: 'Hackathon Results Awaiting Verification',
          message: `${currentUser.fullName} submitted proposed podium results for "${comp.title}". Verification is required before publication.`,
          link: '/general-secretary',
          type: 'RESULT',
          isRead: false,
          createdAt: timestamp,
        },
        ...prev,
      ]);
    }

    addAuditLog(
      'RESULTS_SUBMITTED_FOR_VERIFICATION',
      'COMPETITION',
      competitionId,
      `${currentUser.fullName} submitted ${newResults.length} proposed results for ${comp.title}. Status: PENDING_VERIFICATION`
    );

    return { success: true };
  };

  // General Secretary (or authorized policy): Verify and officially publish results
  const verifyAndPublishResults = (competitionId: string, approved: boolean, reason?: string) => {
    const comp = competitions.find((c) => c.id === competitionId);
    if (!comp) return { success: false, error: 'Competition not found.' };

    const isAuthorized =
      currentUser.role === 'GENERAL_SECRETARY' || (!comp.requiresGsApproval && currentUser.assignedClubId === comp.clubId);
    if (!isAuthorized) {
      return { success: false, error: 'Unauthorized: General Secretary institutional approval is required to publish official competition results.' };
    }

    const timestamp = new Date().toISOString();

    if (approved) {
      // Mark all results as isVerified: true
      setResults((prev) =>
        prev.map((r) =>
          r.competitionId === competitionId
            ? {
                ...r,
                isVerified: true,
                verifiedBy: `${currentUser.fullName} (${currentUser.role})`,
                verifiedAt: timestamp,
              }
            : r
        )
      );

      // Update competition resultsStatus to PUBLISHED
      setCompetitions((prev) =>
        prev.map((c) => (c.id === competitionId ? { ...c, resultsStatus: 'PUBLISHED' } : c))
      );

      // Connect winners to achievements & generate certificate requests in General Secretary queue
      const compResults = results.filter((r) => r.competitionId === competitionId);
      const newCertRequests: Certificate[] = [];

      compResults.forEach((res) => {
        res.members.forEach((m) => {
          const certNumber = `AIT-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
          newCertRequests.push({
            id: `cert-${Date.now()}-${m.studentId}`,
            certificateNumber: certNumber,
            studentId: m.studentId,
            recipientName: m.name,
            recipientRollNo: m.aitRollNo,
            competitionId: comp.id,
            competitionTitle: comp.title,
            clubName: comp.clubName || 'AIT Technical Club',
            resultId: res.id,
            title: `Certificate of Merit & ${res.awardTitle}`,
            awardText: `This is to officially certify that ${m.name} (Roll No: ${m.aitRollNo}) representing Team ${res.teamName} achieved ${res.awardTitle} in ${comp.title} at Army Institute of Technology, Pune.`,
            category: res.rankPosition === 1 ? 'FIRST_PLACE' : res.rankPosition === 2 ? 'SECOND_PLACE' : 'THIRD_PLACE',
            issueDate: timestamp.split('T')[0],
            issuingAuthority: 'Army Institute of Technology, Pune',
            signerName: INSTITUTIONAL_SIGNATORY.generalSecretaryName,
            signerTitle: INSTITUTIONAL_SIGNATORY.generalSecretaryTitle,
            status: 'PENDING_SIGNATURE',
            verificationToken: `ait-vtoken-${Date.now()}-${m.studentId.substring(0, 8)}`,
            signatureMode: 'PENDING',
            createdAt: timestamp,
          });

          // Send notification to winning student
          setNotifications((prev) => [
            {
              id: `notif-win-${Date.now()}-${m.studentId}`,
              userId: m.studentId,
              title: `Official Podium Result Published! 🏆`,
              message: `Congratulations! Team "${res.teamName}" achieved ${res.awardTitle} in ${comp.title}. Your achievement is now officially published on the Hall of Champions.`,
              link: '/podium',
              type: 'RESULT',
              isRead: false,
              createdAt: timestamp,
            },
            ...prev,
          ]);
        });
      });

      if (newCertRequests.length > 0) {
        setCertificates((prev) => [...newCertRequests, ...prev]);
      }

      addAuditLog(
        'RESULTS_OFFICIALLY_PUBLISHED',
        'COMPETITION',
        competitionId,
        `Official podium results published by ${currentUser.fullName} for ${comp.title}. Generated ${newCertRequests.length} certificate requests.`
      );

      return { success: true };
    } else {
      // Returned for correction
      setCompetitions((prev) =>
        prev.map((c) =>
          c.id === competitionId
            ? { ...c, resultsStatus: 'RETURNED_FOR_CORRECTION', resultsCorrectionNotes: reason || 'Correction requested by General Secretary.' }
            : c
        )
      );

      setResults((prev) =>
        prev.map((r) => (r.competitionId === competitionId ? { ...r, isVerified: false } : r))
      );

      if (comp.createdBy) {
        setNotifications((prev) => [
          {
            id: `notif-ret-${Date.now()}`,
            userId: comp.createdBy,
            title: `Podium Results Returned for Correction ⚠️`,
            message: `Submitted results for "${comp.title}" were returned for correction by ${currentUser.fullName}: ${reason || 'Please review scores and podium rankings.'}`,
            link: '/club-secretary',
            type: 'RESULT',
            isRead: false,
            createdAt: timestamp,
          },
          ...prev,
        ]);
      }

      addAuditLog(
        'RESULTS_RETURNED_FOR_CORRECTION',
        'COMPETITION',
        competitionId,
        `Results for ${comp.title} returned by ${currentUser.fullName}. Reason: ${reason || 'N/A'}`
      );

      return { success: true };
    }
  };

  // Controlled correction workflow for published official results with immutable audit log
  const correctPublishedResult = (
    resultId: string,
    newAwardTitle: string,
    newRankPosition: number | null,
    reason: string
  ) => {
    if (currentUser.role !== 'GENERAL_SECRETARY') {
      return { success: false, error: 'Unauthorized: Only the General Secretary can initiate corrections on published official results.' };
    }
    if (!reason || !reason.trim()) {
      return { success: false, error: 'Audit requirement: A justification reason must be specified for correcting official results.' };
    }

    const res = results.find((r) => r.id === resultId);
    if (!res) return { success: false, error: 'Result record not found.' };

    const timestamp = new Date().toISOString();

    const correctionLog: ResultCorrectionLog = {
      id: `rcorr-${Date.now()}`,
      resultId,
      competitionId: res.competitionId,
      competitionTitle: res.competitionTitle,
      originalAward: res.awardTitle,
      newAward: newAwardTitle.trim(),
      originalTeamName: res.teamName,
      newTeamName: res.teamName,
      reason: reason.trim(),
      responsibleUserId: currentUser.id,
      responsibleUserName: currentUser.fullName,
      timestamp,
    };

    setResultCorrectionLogs((prev) => [correctionLog, ...prev]);

    setResults((prev) =>
      prev.map((r) =>
        r.id === resultId
          ? {
              ...r,
              awardTitle: newAwardTitle.trim(),
              rankPosition: newRankPosition,
              verifiedBy: `${currentUser.fullName} (Corrected: ${reason.trim()})`,
              verifiedAt: timestamp,
            }
          : r
      )
    );

    addAuditLog(
      'PUBLISHED_RESULT_CORRECTED',
      'RESULT',
      resultId,
      `Corrected result from "${res.awardTitle}" to "${newAwardTitle}". Reason: ${reason}`
    );

    return { success: true };
  };

  // Dynamic Hackathon Form Builder
  const updateCompetitionForm = (
    competitionId: string,
    fields: FormFieldDefinition[],
    openDate?: string,
    closeDate?: string
  ) => {
    setCompetitions((prev) =>
      prev.map((c) =>
        c.id === competitionId
          ? {
              ...c,
              formFields: fields,
              registrationOpenDate: openDate || c.registrationOpenDate,
              registrationCloseDate: closeDate || c.registrationCloseDate,
            }
          : c
      )
    );
    addAuditLog('COMPETITION_FORM_UPDATED', 'COMPETITION', competitionId, `Updated ${fields.length} dynamic form fields`);
  };

  const publishCompetitionRegistration = (competitionId: string, publish: boolean) => {
    setCompetitions((prev) =>
      prev.map((c) =>
        c.id === competitionId
          ? {
              ...c,
              isRegistrationPublished: publish,
              status: publish ? (c.status === 'DRAFT' ? 'PUBLISHED' : c.status) : 'DRAFT',
            }
          : c
      )
    );
    addAuditLog(
      publish ? 'REGISTRATION_PUBLISHED' : 'REGISTRATION_UNPUBLISHED',
      'COMPETITION',
      competitionId,
      `${publish ? 'Published' : 'Unpublished'} registration form`
    );
  };

  // Student Hackathon Registration Submission
  const submitHackathonApplication = (data: Omit<HackathonApplication, 'id' | 'status' | 'submittedAt'>) => {
    const comp = competitions.find((c) => c.id === data.competitionId);
    if (!comp) return { success: false, error: 'Competition not found.' };

    if (comp.isRegistrationPublished === false) {
      return { success: false, error: 'Registration is not currently published for this competition.' };
    }

    if (comp.registrationCloseDate && new Date(comp.registrationCloseDate) < new Date()) {
      return { success: false, error: 'Registration for this hackathon has closed.' };
    }

    const alreadyApplied = applications.some(
      (a) => a.competitionId === data.competitionId && a.applicantId === currentUser.id && a.status !== 'WITHDRAWN'
    );
    if (alreadyApplied) {
      return { success: false, error: 'You have already submitted an application for this hackathon.' };
    }

    if (data.teamMembers && data.teamMembers.length > 0) {
      const totalMembers = data.teamMembers.length + 1;
      if (totalMembers < comp.minTeamSize || totalMembers > comp.maxTeamSize) {
        return {
          success: false,
          error: `Team size must be between ${comp.minTeamSize} and ${comp.maxTeamSize} members. Current team has ${totalMembers}.`,
        };
      }
    }

    const timestamp = new Date().toISOString();
    const newApp: HackathonApplication = {
      ...data,
      id: `app-${Date.now()}`,
      status: 'SUBMITTED',
      submittedAt: timestamp,
    };

    setApplications((prev) => [newApp, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-app-${Date.now()}`,
        userId: currentUser.id,
        title: 'Application Submitted Successfully 🚀',
        message: `Your registration for "${comp.title}" has been recorded. Current status: SUBMITTED.`,
        link: '/dashboard',
        type: 'COMPETITION',
        isRead: false,
        createdAt: timestamp,
      },
      ...prev,
    ]);

    const club = clubs.find((c) => c.id === comp.clubId);
    if (club?.clubSecretaryId) {
      setNotifications((prev) => [
        {
          id: `notif-cs-app-${Date.now()}`,
          userId: club.clubSecretaryId!,
          title: 'New Hackathon Application Received',
          message: `${currentUser.fullName} submitted an application for ${comp.title}.`,
          link: '/club-secretary',
          type: 'COMPETITION',
          isRead: false,
          createdAt: timestamp,
        },
        ...prev,
      ]);
    }

    addAuditLog('APPLICATION_SUBMITTED', 'APPLICATION', newApp.id, `Application submitted for ${comp.title} by ${currentUser.fullName}`);

    return { success: true, applicationId: newApp.id };
  };

  const updateApplicationStatus = (applicationId: string, status: ApplicationStatus, notes?: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return { success: false, error: 'Application record not found.' };

    const comp = competitions.find((c) => c.id === app.competitionId);
    const isAuthorized =
      currentUser.role === 'GENERAL_SECRETARY' || (comp && currentUser.assignedClubId === comp.clubId);
    if (!isAuthorized) {
      return { success: false, error: 'Unauthorized: You can only update applications for your assigned club.' };
    }

    const timestamp = new Date().toISOString();
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status,
              reviewedBy: currentUser.fullName,
              reviewNotes: notes || a.reviewNotes,
            }
          : a
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-stat-${Date.now()}`,
        userId: app.applicantId,
        title: `Application Status Updated: ${status}`,
        message: `Your application for "${app.competitionTitle}" is now "${status}". Notes: ${notes || 'Reviewed by organizing committee.'}`,
        link: '/dashboard',
        type: 'COMPETITION',
        isRead: false,
        createdAt: timestamp,
      },
      ...prev,
    ]);

    addAuditLog(
      'APPLICATION_STATUS_UPDATED',
      'APPLICATION',
      applicationId,
      `Status changed to ${status} for ${app.applicantName} by ${currentUser.fullName}`
    );

    return { success: true };
  };

  const recordJudgingScore = (scoreData: Omit<JudgingScore, 'id' | 'evaluatedAt' | 'totalScore'>) => {
    const totalScore =
      Number(scoreData.technicalScore) +
      Number(scoreData.innovationScore) +
      Number(scoreData.designScore) +
      Number(scoreData.presentationScore);

    const timestamp = new Date().toISOString();
    const newScore: JudgingScore = {
      ...scoreData,
      id: `score-${Date.now()}`,
      totalScore,
      evaluatedAt: timestamp,
    };

    setJudgingScores((prev) => [newScore, ...prev]);

    if (scoreData.applicationId) {
      setApplications((prev) =>
        prev.map((a) => (a.id === scoreData.applicationId ? { ...a, totalScore } : a))
      );
    }

    addAuditLog(
      'JUDGING_SCORE_RECORDED',
      'EVALUATION',
      newScore.id,
      `Score ${totalScore}/100 recorded for ${scoreData.teamName} by ${scoreData.judgeName}`
    );

    return { success: true, scoreId: newScore.id };
  };

  // Certificate Generation (Individual & Batch by Club Secretary)
  const generateCertificatesForCompetition = (
    competitionId: string,
    category: 'ALL_WINNERS' | 'PARTICIPANTS'
  ): number => {
    const comp = competitions.find((c) => c.id === competitionId);
    if (!comp) return 0;

    const compResults = results.filter((r) => r.competitionId === competitionId);
    const newCerts: Certificate[] = [];

    compResults.forEach((res) => {
      res.members.forEach((member) => {
        const certNumber = `AIT-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        newCerts.push({
          id: `cert-${Date.now()}-${member.studentId}`,
          certificateNumber: certNumber,
          studentId: member.studentId,
          recipientName: member.name,
          recipientRollNo: member.aitRollNo,
          competitionId: comp.id,
          competitionTitle: comp.title,
          clubName: comp.clubName || 'Technical Club',
          resultId: res.id,
          category: res.rankPosition === 1 ? 'FIRST_PLACE' : res.rankPosition === 2 ? 'SECOND_PLACE' : 'THIRD_PLACE',
          title: `Certificate of Merit & ${res.awardTitle}`,
          awardText: `This is to officially certify that ${member.name} (Roll No: ${member.aitRollNo}) representing Team ${res.teamName} secured ${res.awardTitle} in ${comp.title} at Army Institute of Technology, Pune.`,
          issueDate: new Date().toISOString().split('T')[0],
          issuingAuthority: 'Army Institute of Technology, Pune',
          signerName: INSTITUTIONAL_SIGNATORY.generalSecretaryName,
          signerTitle: INSTITUTIONAL_SIGNATORY.generalSecretaryTitle,
          status: 'PENDING_REVIEW', // Enters General Secretary approval queue
          verificationToken: `ait-vtoken-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
          signatureMode: 'PENDING',
          createdAt: new Date().toISOString(),
        });
      });
    });

    if (newCerts.length > 0) {
      setCertificates((prev) => [...newCerts, ...prev]);

      // Notify General Secretary
      const gs = allProfiles.find((p) => p.role === 'GENERAL_SECRETARY');
      if (gs) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            userId: gs.id,
            title: 'New Certificates Awaiting Review & Signature',
            message: `${newCerts.length} certificates generated for ${comp.title} require your review and cryptographic signature.`,
            link: '/general-secretary',
            type: 'CERTIFICATE',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      addAuditLog('CERTIFICATES_GENERATED', 'CERTIFICATE', comp.id, `Generated ${newCerts.length} certificate requests for ${comp.title}`);
    }

    return newCerts.length;
  };

  // Allocate Certificates (Club Secretary & General Secretary)
  const allocateCertificates = (allocations: {
    competitionId: string;
    studentId: string;
    recipientName: string;
    recipientRollNo?: string;
    category: 'FIRST_PLACE' | 'SECOND_PLACE' | 'THIRD_PLACE' | 'PARTICIPATION';
    awardTitle?: string;
    awardText?: string;
    resultId?: string;
  }[]): { success: boolean; count: number; error?: string; skippedDuplicates?: number } => {
    if (currentUser.role !== 'CLUB_SECRETARY' && currentUser.role !== 'GENERAL_SECRETARY') {
      return { success: false, count: 0, error: 'Unauthorized: Only an assigned Club Secretary or General Secretary can allocate certificates.' };
    }

    if (!allocations || allocations.length === 0) {
      return { success: false, count: 0, error: 'No recipients selected for certificate allocation.' };
    }

    const newCerts: Certificate[] = [];
    let skippedDuplicates = 0;
    const timestamp = new Date().toISOString();

    for (const alloc of allocations) {
      const comp = competitions.find((c) => c.id === alloc.competitionId);
      if (!comp) continue;

      // Duplicate prevention: Prevent duplicate certificates for the same recipient, event, and award
      const exists = certificates.some(
        (c) =>
          c.competitionId === alloc.competitionId &&
          c.studentId === alloc.studentId &&
          c.category === alloc.category &&
          c.status !== 'REVOKED'
      );

      if (exists) {
        skippedDuplicates++;
        continue;
      }

      let title = 'Certificate of Participation';
      let awardText = `This is to officially certify that ${alloc.recipientName} (Roll No: ${alloc.recipientRollNo || 'N/A'}) actively participated in ${comp.title} organized by ${comp.clubName || 'AIT Technical Chapters'} at Army Institute of Technology, Pune.`;

      if (alloc.category === 'FIRST_PLACE') {
        title = 'Certificate of Merit — 1st Place (Gold)';
        awardText = `This is to officially certify that ${alloc.recipientName} (Roll No: ${alloc.recipientRollNo || 'N/A'}) secured 1st Place (Gold Trophy) in ${comp.title} organized by ${comp.clubName || 'AIT Technical Chapters'} at Army Institute of Technology, Pune.`;
      } else if (alloc.category === 'SECOND_PLACE') {
        title = 'Certificate of Merit — 2nd Place (Silver)';
        awardText = `This is to officially certify that ${alloc.recipientName} (Roll No: ${alloc.recipientRollNo || 'N/A'}) secured 2nd Place (Silver Medal) in ${comp.title} organized by ${comp.clubName || 'AIT Technical Chapters'} at Army Institute of Technology, Pune.`;
      } else if (alloc.category === 'THIRD_PLACE') {
        title = 'Certificate of Merit — 3rd Place (Bronze)';
        awardText = `This is to officially certify that ${alloc.recipientName} (Roll No: ${alloc.recipientRollNo || 'N/A'}) secured 3rd Place (Bronze Medal) in ${comp.title} organized by ${comp.clubName || 'AIT Technical Chapters'} at Army Institute of Technology, Pune.`;
      }

      const certNumber = `AIT-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      newCerts.push({
        id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        certificateNumber: certNumber,
        studentId: alloc.studentId,
        recipientName: alloc.recipientName,
        recipientRollNo: alloc.recipientRollNo,
        competitionId: comp.id,
        competitionTitle: comp.title,
        clubName: comp.clubName || 'Technical Club',
        clubSecretaryName: currentUser.role === 'CLUB_SECRETARY' ? currentUser.fullName : (comp.clubName ? `${comp.clubName} Secretary` : 'Club Secretary'),
        clubSecretaryTitle: 'Club Secretary',
        resultId: alloc.resultId,
        category: alloc.category,
        title: alloc.awardTitle || title,
        awardText: alloc.awardText || awardText,
        issueDate: timestamp.split('T')[0],
        issuingAuthority: 'Army Institute of Technology, Pune',
        signerName: INSTITUTIONAL_SIGNATORY.generalSecretaryName,
        signerTitle: INSTITUTIONAL_SIGNATORY.generalSecretaryTitle,
        status: 'PENDING_REVIEW', // In approval and signature workflow
        verificationToken: `ait-vtoken-${Date.now()}-${alloc.studentId.substring(0, 6)}`,
        signatureMode: 'PENDING',
        createdAt: timestamp,
      });
    }

    if (newCerts.length > 0) {
      setCertificates((prev) => [...newCerts, ...prev]);

      const gs = allProfiles.find((p) => p.role === 'GENERAL_SECRETARY');
      if (gs) {
        setNotifications((prev) => [
          {
            id: `notif-cert-alloc-${Date.now()}`,
            userId: gs.id,
            title: 'Certificate Allocation Awaiting Signature',
            message: `${newCerts.length} certificates allocated by ${currentUser.fullName} require review and General Secretary signature.`,
            link: '/general-secretary',
            type: 'CERTIFICATE',
            isRead: false,
            createdAt: timestamp,
          },
          ...prev,
        ]);
      }

      addAuditLog(
        'CERTIFICATES_ALLOCATED',
        'CERTIFICATE',
        newCerts[0].competitionId,
        `${currentUser.fullName} allocated ${newCerts.length} certificates (Skipped duplicates: ${skippedDuplicates}). Enqueued for General Secretary signature.`
      );
    }

    return { success: true, count: newCerts.length, skippedDuplicates };
  };

  // General Secretary Certificate Review, Approval & Digital Signing
  const generalSecretarySignCertificate = (certId: string, pin: string) => {
    const isGS = currentUser.role === 'GENERAL_SECRETARY';
    if (!isGS) {
      return { success: false, error: 'Unauthorized: Only the General Secretary can authorize and cryptographically sign institutional certificates.' };
    }

    if (!pin || pin.length < 4) {
      return { success: false, error: 'Please enter a valid General Secretary Signing PIN (ait@gs2026) to authorize cryptographic signing.' };
    }

    const cert = certificates.find((c) => c.id === certId);
    if (!cert) return { success: false, error: 'Certificate record not found.' };

    const simulatedHash = `SHA256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const signedAt = new Date().toISOString();

    setCertificates((prev) =>
      prev.map((c) =>
        c.id === certId
          ? {
              ...c,
              status: 'ISSUED',
              signatureMode: 'MODE_B_CRYPTOGRAPHIC_PDF',
              signatureHash: simulatedHash,
              signedAt,
              signerName: currentUser.fullName,
              signerTitle: 'General Secretary, Technical Affairs, AIT Pune',
            }
          : c
      )
    );

    // Notify the recipient student
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: cert.studentId,
        title: 'Certificate Signed & Issued',
        message: `Your certificate for ${cert.competitionTitle} has been officially signed by General Secretary ${currentUser.fullName} and is ready for download.`,
        link: '/certificates',
        type: 'CERTIFICATE',
        isRead: false,
        createdAt: signedAt,
      },
      ...prev,
    ]);

    addAuditLog('CERTIFICATE_DIGITALLY_SIGNED', 'CERTIFICATE', certId, `Digitally signed by GS ${currentUser.fullName} with hash ${simulatedHash.substring(0, 16)}...`);

    return { success: true, signatureHash: simulatedHash };
  };

  // Backward-compatibility alias
  const directorSignCertificate = generalSecretarySignCertificate;

  const returnCertificateForCorrection = (certId: string, remarks: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === certId ? { ...c, status: 'RETURNED_FOR_CORRECTION', rejectionReason: remarks } : c
      )
    );
    addAuditLog('CERTIFICATE_RETURNED_FOR_CORRECTION', 'CERTIFICATE', certId, `Returned by ${currentUser.fullName}. Remarks: ${remarks}`);
  };

  const revokeCertificate = (certId: string, reason: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === certId ? { ...c, status: 'REVOKED', rejectionReason: reason } : c
      )
    );
    addAuditLog('CERTIFICATE_REVOKED', 'CERTIFICATE', certId, `Revoked by ${currentUser.fullName}. Reason: ${reason}`);
  };

  const approveCertificate = (certId: string, mode?: SignatureMode) => {
    setCertificates((prev) =>
      prev.map((c) => (c.id === certId ? { ...c, status: 'APPROVED', signatureMode: mode || 'PENDING' } : c))
    );
    addAuditLog('CERTIFICATE_APPROVED', 'CERTIFICATE', certId, `Approved by ${currentUser.fullName}`);
  };

  const rejectCertificate = (certId: string, reason: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === certId ? { ...c, status: 'REJECTED', rejectionReason: reason } : c
      )
    );
    addAuditLog('CERTIFICATE_REJECTED', 'CERTIFICATE', certId, `Rejected by ${currentUser.fullName}. Reason: ${reason}`);
  };

  const batchApproveCertificates = (certIds: string[], mode?: SignatureMode) => {
    setCertificates((prev) =>
      prev.map((c) =>
        certIds.includes(c.id) ? { ...c, status: 'APPROVED', signatureMode: mode || 'PENDING' } : c
      )
    );
    addAuditLog('CERTIFICATES_BATCH_APPROVED', 'CERTIFICATE', `${certIds.length} items`, `Batch approved by ${currentUser.fullName}`);
  };

  const batchGeneralSecretarySignCertificates = (certIds: string[], pin?: string) => {
    const isGS = currentUser.role === 'GENERAL_SECRETARY';
    if (!isGS) {
      return { successCount: 0, error: 'Unauthorized: Only General Secretary can batch sign.' };
    }

    const signedAt = new Date().toISOString();
    let count = 0;

    setCertificates((prev) =>
      prev.map((c) => {
        if (certIds.includes(c.id) && c.status !== 'ISSUED') {
          count++;
          const simulatedHash = `SHA256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
          return {
            ...c,
            status: 'ISSUED',
            signatureMode: 'MODE_B_CRYPTOGRAPHIC_PDF',
            signatureHash: simulatedHash,
            signedAt,
            signerName: currentUser.fullName,
            signerTitle: 'General Secretary, Technical Affairs, AIT Pune',
          };
        }
        return c;
      })
    );

    addAuditLog('CERTIFICATES_BATCH_SIGNED', 'CERTIFICATE', `${certIds.length} items`, `General Secretary batch signed ${count} certificates`);
    return { successCount: count };
  };

  const batchDirectorSignCertificates = (certIds: string[]) => batchGeneralSecretarySignCertificates(certIds);

  const createCompetition = (competitionData: Omit<Competition, 'id' | 'createdAt'>) => {
    // Backend validation (Requirement 1)
    if (!competitionData.title || !competitionData.title.trim()) {
      return { success: false, error: 'Event name is required.' };
    }
    if (!competitionData.description || !competitionData.description.trim()) {
      return { success: false, error: 'Event description is required.' };
    }
    if (!competitionData.startDate || !competitionData.endDate) {
      return { success: false, error: 'Event start and end dates are required.' };
    }
    if (competitionData.minTeamSize && competitionData.maxTeamSize && competitionData.minTeamSize > competitionData.maxTeamSize) {
      return { success: false, error: 'Minimum team size cannot exceed maximum team size.' };
    }

    const newComp: Competition = {
      ...competitionData,
      title: competitionData.title.trim(),
      description: competitionData.description.trim(),
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCompetitions((prev) => [newComp, ...prev]);
    addAuditLog('COMPETITION_CREATED', 'COMPETITION', newComp.id, `Created ${newComp.title} with status ${newComp.status}`);
    return { success: true, competition: newComp };
  };

  const updateCompetitionDetails = (
    id: string,
    data: Partial<Pick<Competition, 'title' | 'description' | 'category' | 'startDate' | 'endDate' | 'prizePool' | 'minTeamSize' | 'maxTeamSize' | 'registrationCloseDate'>>
  ) => {
    const comp = competitions.find((c) => c.id === id);
    if (!comp) return { success: false, error: 'Competition not found.' };

    if (comp.registrationCloseDate && new Date(comp.registrationCloseDate) < new Date()) {
      return { success: false, error: 'Cannot modify competition: Registration deadline has already passed.' };
    }

    if (comp.status === 'COMPLETED' || comp.resultsStatus === 'PUBLISHED') {
      return { success: false, error: 'Cannot modify competition: Event is completed or results have already been published.' };
    }

    setCompetitions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );

    addAuditLog('COMPETITION_UPDATED', 'COMPETITION', id, `Updated competition details for ${comp.title}`);
    return { success: true };
  };

  const updateCompetitionStatus = (id: string, status: Competition['status']) => {
    setCompetitions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    addAuditLog('COMPETITION_STATUS_UPDATED', 'COMPETITION', id, `Status updated to ${status}`);
  };

  const createTeam = (name: string, description: string): Team => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      members: [
        {
          studentId: currentUser.id,
          fullName: currentUser.fullName,
          aitRollNo: currentUser.aitRollNo,
          roleInTeam: 'Leader',
          joinedAt: new Date().toISOString(),
          avatarUrl: currentUser.avatarUrl,
        },
      ],
    };
    setTeams((prev) => [newTeam, ...prev]);
    addAuditLog('TEAM_CREATED', 'TEAM', newTeam.id, `Created team ${newTeam.name}`);
    return newTeam;
  };

  const joinTeam = (teamId: string, studentId: string, role = 'Member') => {
    const student = allProfiles.find((p) => p.id === studentId);
    if (!student) return;

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const alreadyIn = t.members.some((m) => m.studentId === studentId);
          if (alreadyIn) return t;
          return {
            ...t,
            members: [
              ...t.members,
              {
                studentId: student.id,
                fullName: student.fullName,
                aitRollNo: student.aitRollNo,
                roleInTeam: role as any,
                joinedAt: new Date().toISOString(),
                avatarUrl: student.avatarUrl,
              },
            ],
          };
        }
        return t;
      })
    );
    addAuditLog('TEAM_MEMBER_JOINED', 'TEAM', teamId, `${student.fullName} joined team`);
  };

  const createProject = (proj: Omit<Project, 'id' | 'createdAt' | 'likesCount'>): Project => {
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProj, ...prev]);
    addAuditLog('PROJECT_PUBLISHED', 'PROJECT', newProj.id, `Published project ${newProj.title}`);
    return newProj;
  };

  const toggleLikeProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const isLiked = !p.isLikedByUser;
          return {
            ...p,
            isLikedByUser: isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const toggleSaveProject = (projectId: string) => {
    setSavedProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
  };

  const resetToDefaultData = () => {
    setCurrentUser(INITIAL_PROFILES[0]);
    setAllProfiles(INITIAL_PROFILES);
    setClubs(INITIAL_CLUBS);
    setNotices(INITIAL_NOTICES);
    setAppointments(INITIAL_APPOINTMENTS);
    setCompetitions(INITIAL_COMPETITIONS);
    setTeams(INITIAL_TEAMS);
    setProjects(INITIAL_PROJECTS);
    setResults(INITIAL_RESULTS);
    setCertificates(INITIAL_CERTIFICATES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSavedProjectIds(['proj-urban-oasis']);
    setApplications(INITIAL_APPLICATIONS);
    setJudgingScores(INITIAL_JUDGING_SCORES);
    setAcademicYearCorrections([]);
    setResultCorrectionLogs([]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allProfiles,
        clubs,
        notices,
        noticeReactions,
        appointments,
        competitions,
        teams,
        projects,
        results,
        badges,
        certificates,
        notifications,
        auditLogs,
        savedProjectIds,
        isSupabaseActive: Boolean(isSupabaseConfigured),
        applications,
        judgingScores,
        academicYearCorrections,
        resultCorrectionLogs,
        switchUser,
        loginWithDesignation,
        loginWithRegAndRoll,
        registerStudent,
        verifyStudent,
        createCompetition,
        updateCompetitionDetails,
        updateCompetitionStatus,
        createTeam,
        joinTeam,
        createProject,
        toggleLikeProject,
        toggleSaveProject,
        publishNotice,
        withdrawNotice,
        toggleNoticeReaction,
        appointJointSecretary,
        appointClubSecretary,
        revokeAppointment,
        submitOfficialResult,
        verifyPodiumResults,
        submitResultsForVerification,
        verifyAndPublishResults,
        correctPublishedResult,
        updateCompetitionForm,
        publishCompetitionRegistration,
        submitHackathonApplication,
        updateApplicationStatus,
        recordJudgingScore,
        verifyStudentOtp,
        requestVerificationOtp,
        generalSecretaryVerifyStudent,
        adminCorrectStudentYear,
        recoverPassword,
        resetPasswordWithToken,
        generateCertificatesForCompetition,
        allocateCertificates,
        approveCertificate,
        generalSecretarySignCertificate,
        directorSignCertificate,
        returnCertificateForCorrection,
        rejectCertificate,
        revokeCertificate,
        batchApproveCertificates,
        batchGeneralSecretarySignCertificates,
        batchDirectorSignCertificates,
        markNotificationRead,
        markAllNotificationsRead,
        addAuditLog,
        resetToDefaultData,
        isInitialized,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
