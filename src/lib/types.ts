// Exactly 4 Designations supported in CompetiHub
export type UserRole = 
  | 'STUDENT' 
  | 'JOINT_SECRETARY' 
  | 'CLUB_SECRETARY' 
  | 'GENERAL_SECRETARY';

export type VerificationStatus = 
  | 'PENDING_AIT_VERIFICATION' 
  | 'VERIFIED' 
  | 'REJECTED';

export type CompetitionStatus = 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export type CompetitionCategory = 
  | 'Hackathon' 
  | 'Coding Challenge' 
  | 'Robotics' 
  | 'AI / ML' 
  | 'Design Sprint' 
  | 'Project Exhibition' 
  | 'Cybersecurity'
  | 'DESIGN'
  | 'HACKATHON'
  | 'CODING'
  | 'ROBOTICS'
  | 'AI_ML';

export type CertificateStatus = 
  | 'DRAFT' 
  | 'PENDING_REVIEW'
  | 'APPROVED' 
  | 'PENDING_SIGNATURE'
  | 'SIGNED' 
  | 'ISSUED' 
  | 'REJECTED' 
  | 'RETURNED_FOR_CORRECTION'
  | 'REVOKED' 
  | 'SUPERSEDED'
  // Legacy aliases
  | 'SUBMITTED'
  | 'UNDER_REVIEW';

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
  | 'NOTICE'
  | 'PRIORITY_NOTICE'
  | 'APPOINTMENT'
  | 'SYSTEM';

export interface AcademicYearCorrection {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  previousGraduationYear: number;
  newGraduationYear: number;
  previousYearOfStudy: number;
  newYearOfStudy: number;
  correctedBy: string;
  correctedByName: string;
  reason: string;
  timestamp: string;
}

export type FormFieldType = 
  | 'text' 
  | 'textarea' 
  | 'dropdown' 
  | 'radio' 
  | 'checkbox' 
  | 'email' 
  | 'url' 
  | 'file'
  | 'TEXT'
  | 'TEXTAREA'
  | 'DROPDOWN'
  | 'RADIO'
  | 'CHECKBOX'
  | 'EMAIL'
  | 'URL'
  | 'FILE';

export interface FormFieldDefinition {
  id: string;
  name?: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

export type ApplicationStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'SHORTLISTED' 
  | 'ACCEPTED' 
  | 'CONFIRMED'
  | 'REJECTED' 
  | 'WAITLISTED' 
  | 'WITHDRAWN';

export interface HackathonApplication {
  id: string;
  competitionId: string;
  competitionTitle: string;
  clubId: string;
  clubName: string;
  applicantId: string;
  applicantName: string;
  applicantRollNo: string;
  applicantEmail: string;
  applicantBranch: string;
  applicantYear: number;
  isYearVerified: boolean;
  teamId?: string;
  teamName?: string;
  teamMembers?: {
    studentId?: string;
    fullName?: string;
    name: string;
    rollNo: string;
    aitRollNo?: string;
    email: string;
    branch?: string;
    year?: number;
    yearOfStudy?: number;
  }[];
  projectTitle?: string;
  projectDescription?: string;
  technologies?: string | string[];
  githubUrl?: string;
  githubLink?: string;
  demoUrl?: string;
  answers?: Record<string, any>;
  customAnswers?: Record<string, any>;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
  totalScore?: number;
}

export interface JudgingScore {
  id: string;
  competitionId: string;
  applicationId?: string;
  teamId?: string;
  teamName: string;
  projectTitle?: string;
  judgeId: string;
  judgeName: string;
  technicalScore: number; // 0 - 25
  innovationScore: number; // 0 - 25
  designScore: number; // 0 - 25
  presentationScore: number; // 0 - 25
  totalScore: number; // Sum of above
  comments: string;
  notes?: string;
  evaluatedAt: string;
}

export type ResultsStatus = 
  | 'NOT_DECLARED' 
  | 'RESULTS_DRAFT' 
  | 'PENDING_VERIFICATION' 
  | 'PUBLISHED' 
  | 'RETURNED_FOR_CORRECTION';

export interface ResultCorrectionLog {
  id: string;
  resultId: string;
  competitionId: string;
  competitionTitle: string;
  originalAward: string;
  newAward: string;
  originalTeamName: string;
  newTeamName: string;
  reason: string;
  responsibleUserId: string;
  responsibleUserName: string;
  timestamp: string;
}

export interface Profile {
  id: string;
  fullName: string;
  aitRegNo: string; // Format: AIT/YYYY/BRANCH/ROLL
  aitRollNo: string; // 5-digit roll number
  collegeEmail: string; // Must be @aitpune.edu.in
  branch: string;
  graduationYear: number;
  yearOfStudy?: number; // 1, 2, 3, 4
  isYearVerified: boolean; // Institutional verification status for year of study
  academicYearNotes?: string;
  role: UserRole;
  assignedClubId?: string;
  assignedClubName?: string;
  verificationStatus: VerificationStatus;
  verificationOtp?: string;
  verificationToken?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  avatarUrl?: string;
  bio?: string;
  githubProfile?: string;
  linkedinProfile?: string;
  passwordHash?: string;
  passwordSalt?: string;
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  logoUrl?: string;
  clubSecretaryId?: string;
  clubSecretaryName?: string;
  jointSecretaryIds?: string[];
  totalHackathons: number;
  createdAt: string;
}

export type NoticeReactionType = 'LIKE' | 'LOVE' | 'LAUGH' | 'WOW' | 'THANKS' | 'CELEBRATE';

export interface NoticeReaction {
  id: string;
  noticeId: string;
  userId: string;
  reaction: NoticeReactionType;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'HACKATHON' | 'CLUB' | 'RESULTS' | 'URGENT' | 'SCHEDULE';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  isPriorityNotice: boolean;
  authorId: string;
  authorName: string;
  authorDesignation: UserRole;
  clubId?: string;
  clubName?: string;
  publishedAt: string;
  expiryDate?: string;
  attachmentName?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'WITHDRAWN';
  readCount: number;
}

export interface Appointment {
  id: string;
  targetStudentId: string;
  targetStudentName: string;
  targetStudentRollNo: string;
  targetStudentEmail: string;
  role: 'JOINT_SECRETARY' | 'CLUB_SECRETARY';
  clubId: string;
  clubName: string;
  appointedById: string;
  appointedByName: string;
  appointedByRole: UserRole;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
}

export interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: CompetitionCategory;
  eventType?: 'COMPETITION' | 'HACKATHON';
  participationType?: 'INDIVIDUAL' | 'TEAM';
  officialUrl?: string;
  status: CompetitionStatus;
  startDate: string;
  endDate: string;
  venueType: 'ON_CAMPUS' | 'VIRTUAL' | 'HYBRID';
  venueDetails: string;
  clubId?: string;
  clubName?: string;
  createdBy: string;
  rules?: string;
  eligibility?: string;
  bannerUrl: string;
  prizePool: string;
  maxTeamSize: number;
  minTeamSize: number;
  organisingCommittee?: {
    name: string;
    rollNo: string;
    role: string;
    avatarUrl?: string;
  }[];
  formFields?: FormFieldDefinition[];
  isRegistrationPublished?: boolean;
  registrationOpenDate?: string;
  registrationCloseDate?: string;
  resultsStatus?: ResultsStatus;
  resultsCorrectionNotes?: string;
  requiresGsApproval?: boolean; // Configurable institution approval requirement (default: true)
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description: string;
  competitionId?: string;
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
  clubId?: string;
  clubName?: string;
  teamId: string;
  teamName: string;
  projectId?: string;
  projectTitle?: string;
  awardTitle: string;
  rankPosition: number | null;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  submittedBy?: string;
  submittedAt?: string;
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
  recipientRollNo?: string;
  competitionId: string;
  competitionTitle: string;
  clubName?: string;
  clubSecretaryName?: string;
  clubSecretaryTitle?: string;
  resultId?: string;
  title: string;
  awardText: string;
  category?: 'FIRST_PLACE' | 'SECOND_PLACE' | 'THIRD_PLACE' | 'PARTICIPATION' | 'ORGANISER' | 'SPECIAL_AWARD';
  issueDate: string;
  issuingAuthority: string;
  signerName: string;
  signerTitle: string;
  status: CertificateStatus;
  verificationToken: string;
  signatureMode: SignatureMode;
  signatureHash?: string;
  signedAt?: string;
  rejectionReason?: string;
  createdAt: string;
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
  actorRole: UserRole | string;
  action: string;
  targetType: string;
  targetId?: string;
  details: string;
  timestamp: string;
}
