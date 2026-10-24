export type UserRole = 'STUDENT' | 'COMPETITION_ORGANISER' | 'ADMINISTRATOR' | 'PRINCIPAL';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type CompetitionStatus = 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export type CompetitionCategory = 
  | 'Hackathon' 
  | 'Coding Challenge' 
  | 'Robotics' 
  | 'AI / ML' 
  | 'Design Sprint' 
  | 'Project Exhibition' 
  | 'Cybersecurity';

export type CertificateStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'SIGNED' 
  | 'ISSUED' 
  | 'REJECTED' 
  | 'REVOKED' 
  | 'SUPERSEDED';

export type SignatureMode = 'PENDING' | 'MODE_A_IMAGE_SEAL' | 'MODE_B_CRYPTOGRAPHIC_PDF';

export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type BadgeCategory = 'PODIUM' | 'PARTICIPATION' | 'INNOVATION' | 'COMMUNITY' | 'SPECIAL';

export type NotificationType = 
  | 'VERIFICATION' 
  | 'COMPETITION' 
  | 'TEAM' 
  | 'RESULT' 
  | 'CERTIFICATE' 
  | 'BADGE' 
  | 'SYSTEM';

export interface Profile {
  id: string;
  fullName: string;
  aitRegNo: string;
  aitRollNo: string;
  collegeEmail: string;
  branch: string;
  graduationYear: number;
  role: UserRole;
  verificationStatus: VerificationStatus;
  avatarUrl?: string;
  bio?: string;
  githubProfile?: string;
  linkedinProfile?: string;
  createdAt: string;
}

export interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: CompetitionCategory;
  status: CompetitionStatus;
  startDate: string;
  endDate: string;
  venueType: 'ON_CAMPUS' | 'VIRTUAL' | 'HYBRID';
  venueDetails: string;
  createdBy: string;
  rules?: string;
  eligibility?: string;
  bannerUrl: string;
  prizePool: string;
  maxTeamSize: number;
  minTeamSize: number;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description: string;
  createdBy: string;
  createdAt: string;
  members: TeamMember[];
}

export interface TeamMember {
  studentId: string;
  fullName: string;
  aitRollNo: string;
  roleInTeam: 'Leader' | 'Developer' | 'Designer' | 'Researcher' | 'Member';
  joinedAt: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  shortDescription: string;
  problemStatement: string;
  proposedSolution: string;
  technologies: string[];
  competitionId?: string;
  competitionTitle?: string;
  teamId?: string;
  teamName?: string;
  demoUrl?: string;
  githubUrl?: string;
  challengesLessons?: string;
  futureScope?: string;
  visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
  likesCount: number;
  isLikedByUser?: boolean;
  contributors: {
    studentId: string;
    studentName: string;
    contribution: string;
  }[];
  createdAt: string;
}

export interface CompetitionResult {
  id: string;
  competitionId: string;
  competitionTitle: string;
  teamId: string;
  teamName: string;
  projectId?: string;
  projectTitle?: string;
  awardTitle: string; // "1st Place Winner", "2nd Place Runner-Up", "Best AI Innovation"
  rankPosition: 1 | 2 | 3 | null;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  members: {
    studentId: string;
    name: string;
    aitRollNo: string;
  }[];
}

export interface AchievementBadge {
  id: string;
  code: string;
  title: string;
  description: string;
  iconName: string;
  category: BadgeCategory;
  tier: BadgeTier;
  awardedAt?: string;
  competitionTitle?: string;
  isOfficialVerified?: boolean;
}

export interface Certificate {
  id: string;
  certificateNumber: string; // e.g. "AIT-CERT-2026-00101"
  studentId: string;
  recipientName: string;
  competitionId: string;
  competitionTitle: string;
  resultId?: string;
  title: string; // "Certificate of Merit", "Certificate of Outstanding Achievement"
  awardText: string;
  issueDate: string;
  issuingAuthority: string;
  signerName: string;
  signerTitle: string;
  status: CertificateStatus;
  verificationToken: string;
  signatureMode: SignatureMode;
  signatureHash?: string;
  signedAt?: string;
  createdAt: string;
  rejectionReason?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  link?: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId?: string;
  details: string;
  timestamp: string;
}
