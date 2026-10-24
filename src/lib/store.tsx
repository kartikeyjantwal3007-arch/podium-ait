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
  SignatureMode
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
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { isSupabaseConfigured } from './supabaseClient';

interface AppContextType {
  currentUser: Profile;
  allProfiles: Profile[];
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
  submitOfficialResult: (result: Omit<CompetitionResult, 'id'>) => void;
  approveCertificate: (certId: string, mode: SignatureMode) => void;
  rejectCertificate: (certId: string, reason: string) => void;
  batchApproveCertificates: (certIds: string[], mode: SignatureMode) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAuditLog: (action: string, targetType: string, targetId: string, details: string) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'competihub_state_';

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Current user defaults to student Aryan Sharma
  const [currentUser, setCurrentUser] = useState<Profile>(INITIAL_PROFILES[0]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [results, setResults] = useState<CompetitionResult[]>(INITIAL_RESULTS);
  const [badges] = useState<AchievementBadge[]>(INITIAL_ACHIEVEMENT_DEFINITIONS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>(['proj-rakshavigil']);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(`${STORAGE_KEY_PREFIX}profiles`);
      if (storedProfiles) setAllProfiles(JSON.parse(storedProfiles));

      const storedUser = localStorage.getItem(`${STORAGE_KEY_PREFIX}currentUser`);
      if (storedUser) setCurrentUser(JSON.parse(storedUser));

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
  }, [allProfiles, currentUser, competitions, teams, projects, results, certificates, notifications, auditLogs, savedProjectIds, isInitialized]);

  const switchUser = (userId: string) => {
    const target = allProfiles.find(p => p.id === userId);
    if (target) {
      setCurrentUser(target);
      addAuditLog('USER_SWITCHED_SESSION', 'PROFILE', target.id, `Switched active session to ${target.fullName} (${target.role})`);
    }
  };

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
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const loginWithRegAndRoll = (regNo: string, rollNo: string, _password: string) => {
    const cleanReg = regNo.trim().toUpperCase();
    const cleanRoll = rollNo.trim().toUpperCase();

    const matchedProfile = allProfiles.find(
      p => (p.aitRegNo.toUpperCase() === cleanReg || p.aitRegNo.toUpperCase().includes(cleanReg)) &&
           p.aitRollNo.toUpperCase() === cleanRoll
    );

    if (!matchedProfile) {
      return { 
        success: false, 
        error: 'No active AIT Pune record found matching the provided Registration and Roll number.' 
      };
    }

    setCurrentUser(matchedProfile);
    addAuditLog('AUTH_LOGIN_SUCCESS', 'PROFILE', matchedProfile.id, `Student / Member ${matchedProfile.fullName} logged in.`);
    return { success: true };
  };

  const registerStudent = (data: {
    fullName: string;
    aitRegNo: string;
    aitRollNo: string;
    collegeEmail: string;
    branch: string;
    graduationYear: number;
    password: string;
  }) => {
    // Validation
    if (!data.collegeEmail.endsWith('@aitpune.edu.in') && !data.collegeEmail.includes('aitpune')) {
      return {
        success: false,
        error: 'Registration requires an authorised @aitpune.edu.in college email address.'
      };
    }

    const duplicate = allProfiles.find(
      p => p.aitRegNo.toUpperCase() === data.aitRegNo.trim().toUpperCase() ||
           p.aitRollNo.toUpperCase() === data.aitRollNo.trim().toUpperCase() ||
           p.collegeEmail.toLowerCase() === data.collegeEmail.trim().toLowerCase()
    );

    if (duplicate) {
      return {
        success: false,
        error: 'An account with this AIT Registration Number, Roll Number, or College Email already exists.'
      };
    }

    const newProfile: Profile = {
      id: `user-student-${Date.now()}`,
      fullName: data.fullName.trim(),
      aitRegNo: data.aitRegNo.trim().toUpperCase(),
      aitRollNo: data.aitRollNo.trim().toUpperCase(),
      collegeEmail: data.collegeEmail.trim().toLowerCase(),
      branch: data.branch,
      graduationYear: data.graduationYear,
      role: 'STUDENT',
      verificationStatus: 'PENDING', // Security rule: default pending verification
      createdAt: new Date().toISOString()
    };

    setAllProfiles(prev => [newProfile, ...prev]);
    setCurrentUser(newProfile);

    // Add notification to user
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: newProfile.id,
      title: 'Registration Submitted - Pending Roster Verification',
      message: 'Your AIT student account is created and queued for automated verification against the college registrar roster.',
      type: 'VERIFICATION',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    addAuditLog('STUDENT_REGISTRATION', 'PROFILE', newProfile.id, `New student account created: ${newProfile.fullName} (${newProfile.aitRollNo}), Status: PENDING`);

    return { success: true, profile: newProfile };
  };

  const verifyStudent = (studentId: string, status: 'VERIFIED' | 'REJECTED', notes?: string) => {
    setAllProfiles(prev => prev.map(p => {
      if (p.id === studentId) {
        return { ...p, verificationStatus: status };
      }
      return p;
    }));

    if (currentUser.id === studentId) {
      setCurrentUser(prev => ({ ...prev, verificationStatus: status }));
    }

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: studentId,
      title: status === 'VERIFIED' ? 'Student Identity Verified' : 'Student Verification Notice',
      message: status === 'VERIFIED' 
        ? 'Your student profile has been verified by the AIT Administration Office. Full platform features are unlocked.'
        : `Your profile verification was declined. ${notes || 'Please contact the academic office.'}`,
      type: 'VERIFICATION',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('STUDENT_VERIFICATION_STATUS_CHANGED', 'PROFILE', studentId, `Verification changed to ${status}. Notes: ${notes || 'None'}`);
  };

  const createCompetition = (competitionData: Omit<Competition, 'id' | 'createdAt'>) => {
    const newComp: Competition = {
      ...competitionData,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCompetitions(prev => [newComp, ...prev]);
    addAuditLog('COMPETITION_CREATED', 'COMPETITION', newComp.id, `Competition created: "${newComp.title}" by ${currentUser.fullName}`);
  };

  const updateCompetitionStatus = (id: string, status: Competition['status']) => {
    setCompetitions(prev => prev.map(c => c.id === id ? { ...c, status } : c));
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
          avatarUrl: currentUser.avatarUrl
        }
      ]
    };
    setTeams(prev => [newTeam, ...prev]);
    addAuditLog('TEAM_CREATED', 'TEAM', newTeam.id, `Team "${newTeam.name}" created by ${currentUser.fullName}`);
    return newTeam;
  };

  const joinTeam = (teamId: string, studentId: string, role = 'Member') => {
    const student = allProfiles.find(p => p.id === studentId);
    if (!student) return;

    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        if (t.members.some(m => m.studentId === studentId)) return t;
        return {
          ...t,
          members: [
            ...t.members,
            {
              studentId,
              fullName: student.fullName,
              aitRollNo: student.aitRollNo,
              roleInTeam: role as any,
              joinedAt: new Date().toISOString(),
              avatarUrl: student.avatarUrl
            }
          ]
        };
      }
      return t;
    }));

    addAuditLog('TEAM_MEMBER_JOINED', 'TEAM', teamId, `${student.fullName} joined team ${teamId} as ${role}`);
  };

  const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'likesCount'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };
    setProjects(prev => [newProject, ...prev]);
    addAuditLog('PROJECT_PUBLISHED', 'PROJECT', newProject.id, `Published project "${newProject.title}"`);
    return newProject;
  };

  const toggleLikeProject = (projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const isLiked = p.isLikedByUser;
        return {
          ...p,
          likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1,
          isLikedByUser: !isLiked
        };
      }
      return p;
    }));
  };

  const toggleSaveProject = (projectId: string) => {
    setSavedProjectIds(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const submitOfficialResult = (resultData: Omit<CompetitionResult, 'id'>) => {
    const newResultId = `res-${Date.now()}`;
    const newResult: CompetitionResult = {
      ...resultData,
      id: newResultId,
      isVerified: true,
      verifiedBy: currentUser.fullName,
      verifiedAt: new Date().toISOString()
    };

    setResults(prev => [newResult, ...prev]);

    // Automatically generate draft certificates for all team members
    const newCerts: Certificate[] = resultData.members.map((member, idx) => {
      const certId = `cert-ait-${Date.now()}-${idx}`;
      const token = `ait-vtoken-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      return {
        id: certId,
        certificateNumber: `AIT-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: member.studentId,
        recipientName: member.name,
        competitionId: resultData.competitionId,
        competitionTitle: resultData.competitionTitle,
        resultId: newResultId,
        title: resultData.rankPosition === 1 ? 'Certificate of Merit & 1st Place Distinction' 
              : resultData.rankPosition === 2 ? 'Certificate of Merit & 2nd Place Runner-Up'
              : resultData.rankPosition === 3 ? 'Certificate of Merit & 3rd Place Runner-Up'
              : 'Certificate of Outstanding Achievement',
        awardText: `This is to officially certify that ${member.name} (Roll No: ${member.aitRollNo}) representing ${resultData.teamName} secured ${resultData.awardTitle} in ${resultData.competitionTitle} at Army Institute of Technology, Pune.`,
        issueDate: new Date().toISOString().split('T')[0],
        issuingAuthority: 'Army Institute of Technology, Pune',
        signerName: 'Brig. (Dr.) S. K. Joshi',
        signerTitle: 'Principal & Director, AIT Pune',
        status: 'UNDER_REVIEW', // Queued for Principal's approval!
        verificationToken: token,
        signatureMode: 'PENDING',
        createdAt: new Date().toISOString()
      };
    });

    setCertificates(prev => [...newCerts, ...prev]);

    addAuditLog(
      'OFFICIAL_RESULT_RECORDED', 
      'COMPETITION', 
      resultData.competitionId, 
      `Verified podium ranking "${resultData.awardTitle}" for ${resultData.teamName}. Generated ${newCerts.length} draft certificates for Principal queue.`
    );
  };

  const approveCertificate = (certId: string, mode: SignatureMode) => {
    const now = new Date().toISOString();
    const signatureHash = mode === 'MODE_B_CRYPTOGRAPHIC_PDF'
      ? `ED25519-SHA512:${Array.from({length: 48}, () => Math.floor(Math.random()*16).toString(16)).join('')}`
      : `SEAL-TIMESTAMP-SHA256:${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

    let updatedCert: Certificate | null = null;

    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        updatedCert = {
          ...c,
          status: 'ISSUED',
          signatureMode: mode,
          signatureHash,
          signedAt: now
        };
        return updatedCert;
      }
      return c;
    }));

    if (updatedCert) {
      const c = updatedCert as Certificate;
      // Send notification to the student
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: c.studentId,
        title: 'Official Certificate Approved & Signed',
        message: `Your certificate for ${c.competitionTitle} has been officially approved and signed by the Principal.`,
        link: '/certificates',
        type: 'CERTIFICATE',
        isRead: false,
        createdAt: now
      };
      setNotifications(prev => [notif, ...prev]);

      addAuditLog(
        'CERTIFICATE_APPROVED_AND_ISSUED',
        'CERTIFICATE',
        c.id,
        `Principal approved & signed certificate ${c.certificateNumber} for ${c.recipientName} (${mode})`
      );
    }
  };

  const rejectCertificate = (certId: string, reason: string) => {
    let targetStudentId = '';
    let targetTitle = '';

    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        targetStudentId = c.studentId;
        targetTitle = c.competitionTitle;
        return {
          ...c,
          status: 'REJECTED',
          rejectionReason: reason
        };
      }
      return c;
    }));

    if (targetStudentId) {
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: targetStudentId,
        title: 'Certificate Returned for Correction',
        message: `Your certificate for ${targetTitle} was returned: ${reason}`,
        link: '/certificates',
        type: 'CERTIFICATE',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }

    addAuditLog('CERTIFICATE_REJECTED', 'CERTIFICATE', certId, `Principal rejected certificate: ${reason}`);
  };

  const batchApproveCertificates = (certIds: string[], mode: SignatureMode) => {
    certIds.forEach(id => approveCertificate(id, mode));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
  };

  const resetToDefaultData = () => {
    try {
      localStorage.clear();
      setAllProfiles(INITIAL_PROFILES);
      setCurrentUser(INITIAL_PROFILES[0]);
      setCompetitions(INITIAL_COMPETITIONS);
      setTeams(INITIAL_TEAMS);
      setProjects(INITIAL_PROJECTS);
      setResults(INITIAL_RESULTS);
      setCertificates(INITIAL_CERTIFICATES);
      setNotifications(INITIAL_NOTIFICATIONS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setSavedProjectIds(['proj-rakshavigil']);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allProfiles,
        competitions,
        teams,
        projects,
        results,
        badges,
        certificates,
        notifications,
        auditLogs,
        savedProjectIds,
        isSupabaseActive: isSupabaseConfigured,
        switchUser,
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
        submitOfficialResult,
        approveCertificate,
        rejectCertificate,
        batchApproveCertificates,
        markNotificationRead,
        markAllNotificationsRead,
        addAuditLog,
        resetToDefaultData
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
