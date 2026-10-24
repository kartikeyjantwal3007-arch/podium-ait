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
  CertificateStatus
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
  INITIAL_APPOINTMENTS
} from './data/mockData';
import { isSupabaseConfigured } from './supabaseClient';

interface AppContextType {
  currentUser: Profile;
  allProfiles: Profile[];
  clubs: Club[];
  notices: Notice[];
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
  verifyStudent: (studentId: string, status: 'VERIFIED' | 'REJECTED', notes?: string) => void;
  createCompetition: (competition: Omit<Competition, 'id' | 'createdAt'>) => void;
  updateCompetitionStatus: (id: string, status: Competition['status']) => void;
  createTeam: (name: string, description: string) => Team;
  joinTeam: (teamId: string, studentId: string, role?: string) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'likesCount'>) => Project;
  toggleLikeProject: (projectId: string) => void;
  toggleSaveProject: (projectId: string) => void;
  
  // Notices
  publishNotice: (notice: Omit<Notice, 'id' | 'publishedAt' | 'readCount'>) => { success: boolean; error?: string; notice?: Notice };
  withdrawNotice: (noticeId: string) => void;

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

  // Certificates & Director Digital Signing
  generateCertificatesForCompetition: (competitionId: string, category: 'ALL_WINNERS' | 'PARTICIPANTS') => number;
  approveCertificate: (certId: string, mode: SignatureMode) => void;
  directorSignCertificate: (certId: string, pin: string) => { success: boolean; error?: string; signatureHash?: string };
  rejectCertificate: (certId: string, reason: string) => void;
  batchApproveCertificates: (certIds: string[], mode: SignatureMode) => void;
  batchDirectorSignCertificates: (certIds: string[]) => { successCount: number };

  // Notifications & Audits
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAuditLog: (action: string, targetType: string, targetId: string, details: string) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'competihub_state_v5_';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile>(INITIAL_PROFILES[0]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [results, setResults] = useState<CompetitionResult[]>(INITIAL_RESULTS);
  const [badges] = useState<AchievementBadge[]>(INITIAL_ACHIEVEMENT_DEFINITIONS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>(['proj-urban-oasis']);
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
      localStorage.setItem(`${STORAGE_KEY_PREFIX}appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}competitions`, JSON.stringify(competitions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}teams`, JSON.stringify(teams));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}results`, JSON.stringify(results));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}certificates`, JSON.stringify(certificates));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}auditLogs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}savedProjects`, JSON.stringify(savedProjectIds));
    } catch (e) {
      console.error('Failed to sync CompetiHub state to localStorage', e);
    }
  }, [
    isInitialized,
    allProfiles,
    currentUser,
    clubs,
    notices,
    appointments,
    competitions,
    teams,
    projects,
    results,
    certificates,
    notifications,
    auditLogs,
    savedProjectIds,
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
      case 'DIRECTOR':
      case 'PRINCIPAL':
        return '/director';
      case 'GENERAL_SECRETARY':
      case 'ADMINISTRATOR':
        return '/general-secretary';
      case 'CLUB_SECRETARY':
      case 'COMPETITION_ORGANISER':
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
    // Map legacy aliases
    const normalizeRole = (r: UserRole): string => {
      if (r === 'PRINCIPAL') return 'DIRECTOR';
      if (r === 'ADMINISTRATOR') return 'GENERAL_SECRETARY';
      if (r === 'COMPETITION_ORGANISER') return 'CLUB_SECRETARY';
      return r;
    };

    const actualNormalized = normalizeRole(found.role);
    const selectedNormalized = normalizeRole(selectedDesignation);

    if (actualNormalized !== selectedNormalized) {
      return {
        success: false,
        error: `Role Mismatch: Your account is authorized as "${found.role.replace('_', ' ')}", not "${selectedDesignation.replace('_', ' ')}". Selecting a designation does not grant privileges. Please log in with your assigned role.`,
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

  // Student Account Registration: strictly receives STUDENT role by default
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

    const newProfile: Profile = {
      id: `user-student-${Date.now()}`,
      fullName: data.fullName.trim(),
      aitRegNo: cleanReg,
      aitRollNo: cleanRoll,
      collegeEmail: cleanEmail,
      branch: data.branch || 'Computer Engineering',
      graduationYear: data.graduationYear || 2027,
      yearOfStudy: 1,
      role: 'STUDENT', // Strictly STUDENT role!
      verificationStatus: 'PENDING',
      passwordHash: data.password.trim(),
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      bio: 'Enthusiastic AIT Pune engineering student ready to participate in hackathons and build breakthrough projects.',
      createdAt: new Date().toISOString(),
    };

    setAllProfiles((prev) => [newProfile, ...prev]);
    setCurrentUser(newProfile);

    // Initial welcome notification
    const welcomeNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: newProfile.id,
      title: 'Welcome to CompetiHub AIT Pune',
      message: 'Your student account is created. Browse upcoming hackathons and form teams.',
      link: '/dashboard',
      type: 'SYSTEM',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    addAuditLog('STUDENT_ACCOUNT_CREATED', 'PROFILE', newProfile.id, `New student self-registered: ${newProfile.fullName} (${cleanRoll})`);

    return { success: true, profile: newProfile };
  };

  const verifyStudent = (studentId: string, status: 'VERIFIED' | 'REJECTED', notes?: string) => {
    setAllProfiles((prev) =>
      prev.map((p) => (p.id === studentId ? { ...p, verificationStatus: status } : p))
    );
    if (currentUser.id === studentId) {
      setCurrentUser((prev) => ({ ...prev, verificationStatus: status }));
    }
    addAuditLog('STUDENT_VERIFICATION_STATUS_CHANGED', 'PROFILE', studentId, `Status set to ${status}. Notes: ${notes || 'None'}`);
  };

  // Publish Notice (Joint Secretary, Club Secretary, General Secretary, Director)
  const publishNotice = (noticeData: Omit<Notice, 'id' | 'publishedAt' | 'readCount'>) => {
    // Only authorized roles can publish
    const canPublish = ['JOINT_SECRETARY', 'CLUB_SECRETARY', 'GENERAL_SECRETARY', 'DIRECTOR', 'ADMINISTRATOR', 'PRINCIPAL', 'COMPETITION_ORGANISER'].includes(currentUser.role);
    if (!canPublish) {
      return { success: false, error: 'Unauthorized: Only Secretaries and Directors can publish notices.' };
    }

    // Only General Secretary / Director can publish priority notices
    if (noticeData.isPriorityNotice && !['GENERAL_SECRETARY', 'DIRECTOR', 'ADMINISTRATOR', 'PRINCIPAL'].includes(currentUser.role)) {
      return { success: false, error: 'Unauthorized: Only General Secretary or Director can publish Priority Notices.' };
    }

    const newNotice: Notice = {
      ...noticeData,
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

  // Appoint Joint Secretary (Only Club Secretary or General Secretary)
  const appointJointSecretary = (data: {
    targetStudentId: string;
    clubId: string;
    startDate: string;
    endDate?: string;
  }) => {
    const isClubSec = currentUser.role === 'CLUB_SECRETARY' || currentUser.role === 'COMPETITION_ORGANISER';
    const isGenSec = currentUser.role === 'GENERAL_SECRETARY' || currentUser.role === 'ADMINISTRATOR';

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
    const isGenSec = currentUser.role === 'GENERAL_SECRETARY' || currentUser.role === 'ADMINISTRATOR';
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
      isVerified: false, // Requires General Secretary / Director verification
      submittedBy: currentUser.id,
      submittedAt: new Date().toISOString(),
    };

    setResults((prev) => [newResult, ...prev]);

    // Send notification to General Secretary & Director
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
          signerName: 'Brig. (Dr.) S. K. Joshi',
          signerTitle: 'Director & Principal, AIT Pune',
          status: 'PENDING_SIGNATURE', // Enters Director signing queue
          verificationToken: `ait-vtoken-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
          signatureMode: 'PENDING',
          createdAt: new Date().toISOString(),
        });
      });
    });

    if (newCerts.length > 0) {
      setCertificates((prev) => [...newCerts, ...prev]);

      // Notify Director
      const dir = allProfiles.find((p) => p.role === 'DIRECTOR' || p.role === 'PRINCIPAL');
      if (dir) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            userId: dir.id,
            title: 'New Certificates Awaiting Signature',
            message: `${newCerts.length} certificates generated for ${comp.title} require your digital signature.`,
            link: '/director',
            type: 'CERTIFICATE',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      addAuditLog('CERTIFICATES_GENERATED', 'CERTIFICATE', comp.id, `Generated ${newCerts.length} certificates for ${comp.title}`);
    }

    return newCerts.length;
  };

  // Director Certificate Approval & Digital Signing
  const directorSignCertificate = (certId: string, pin: string) => {
    const isDirector = currentUser.role === 'DIRECTOR' || currentUser.role === 'PRINCIPAL';
    if (!isDirector) {
      return { success: false, error: 'Unauthorized: Only the Director can digitally sign institutional certificates.' };
    }

    if (!pin || pin.length < 4) {
      return { success: false, error: 'Please enter a valid Director Signing PIN to authorise cryptographic signing.' };
    }

    // Cryptographic signature hash calculation
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
            }
          : c
      )
    );

    // Notify the recipient student
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: cert.studentId,
        title: 'Certificate Signed & Issued by Director',
        message: `Your certificate for ${cert.competitionTitle} has been officially signed and is ready for download.`,
        link: '/certificates',
        type: 'CERTIFICATE',
        isRead: false,
        createdAt: signedAt,
      },
      ...prev,
    ]);

    addAuditLog('CERTIFICATE_DIGITALLY_SIGNED', 'CERTIFICATE', certId, `Digitally signed with hash ${simulatedHash.substring(0, 16)}...`);

    return { success: true, signatureHash: simulatedHash };
  };

  const approveCertificate = (certId: string, mode: SignatureMode) => {
    setCertificates((prev) =>
      prev.map((c) => (c.id === certId ? { ...c, status: 'APPROVED', signatureMode: mode } : c))
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

  const batchApproveCertificates = (certIds: string[], mode: SignatureMode) => {
    setCertificates((prev) =>
      prev.map((c) =>
        certIds.includes(c.id) ? { ...c, status: 'APPROVED', signatureMode: mode } : c
      )
    );
    addAuditLog('CERTIFICATES_BATCH_APPROVED', 'CERTIFICATE', `${certIds.length} items`, `Batch approved by ${currentUser.fullName}`);
  };

  const batchDirectorSignCertificates = (certIds: string[]) => {
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
          };
        }
        return c;
      })
    );

    addAuditLog('CERTIFICATES_BATCH_SIGNED', 'CERTIFICATE', `${certIds.length} items`, `Director batch signed ${count} certificates`);

    return { successCount: count };
  };

  const createCompetition = (competitionData: Omit<Competition, 'id' | 'createdAt'>) => {
    const newComp: Competition = {
      ...competitionData,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCompetitions((prev) => [newComp, ...prev]);
    addAuditLog('COMPETITION_CREATED', 'COMPETITION', newComp.id, `Created ${newComp.title}`);
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
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allProfiles,
        clubs,
        notices,
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
        switchUser,
        loginWithDesignation,
        loginWithRegAndRoll,
        registerStudent,
        verifyStudent,
        createCompetition,
        updateCompetitionStatus,
        createTeam,
        joinTeam,
        createProject,
        toggleLikeProject,
        toggleSaveProject,
        publishNotice,
        withdrawNotice,
        appointJointSecretary,
        appointClubSecretary,
        revokeAppointment,
        submitOfficialResult,
        verifyPodiumResults,
        generateCertificatesForCompetition,
        approveCertificate,
        directorSignCertificate,
        rejectCertificate,
        batchApproveCertificates,
        batchDirectorSignCertificates,
        markNotificationRead,
        markAllNotificationsRead,
        addAuditLog,
        resetToDefaultData,
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
