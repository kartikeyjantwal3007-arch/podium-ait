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
  Club,
  Notice,
  Appointment,
  FormFieldDefinition,
  HackathonApplication,
  JudgingScore,
  AcademicYearCorrection,
  ResultCorrectionLog
} from '../types';

export const INITIAL_PROFILES: Profile[] = [
  // 1. STUDENT (Verified 3rd Year)
  {
    id: 'user-student-1',
    fullName: 'Sanyam',
    aitRegNo: 'AIT/2022/CE/042',
    aitRollNo: '22042',
    collegeEmail: 'sanyam@aitpune.edu.in',
    branch: 'Computer Engineering',
    graduationYear: 2026,
    yearOfStudy: 3,
    isYearVerified: true,
    academicYearNotes: 'Verified via AIT Central Academic Roster 2024-25',
    role: 'STUDENT',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Passionate UI designer & full-stack developer. Focus: Generative UI, 3D interactive graphics & spatial computing.',
    githubProfile: 'https://github.com/sanyam-ait',
    linkedinProfile: 'https://linkedin.com/in/sanyam-ait',
    passwordHash: 'ait@2026',
    createdAt: '2024-08-15T10:00:00Z',
  },
  // 2. JOINT SECRETARY (2nd Year Student)
  {
    id: 'user-joint-sec-1',
    fullName: 'Ananya Roy',
    aitRegNo: 'AIT/2023/IT/019',
    aitRollNo: '23019',
    collegeEmail: 'ananya.roy@aitpune.edu.in',
    branch: 'Information Technology',
    graduationYear: 2027,
    yearOfStudy: 2,
    isYearVerified: true,
    academicYearNotes: 'Verified via AIT Central Academic Roster 2025-26',
    role: 'JOINT_SECRETARY',
    assignedClubId: 'club-design-innovation',
    assignedClubName: 'Design & Innovation Club',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Second-year IT student and appointed Joint Secretary for Design & Innovation Club. Handles student communications and hackathon notices.',
    githubProfile: 'https://github.com/ananya-roy',
    linkedinProfile: 'https://linkedin.com/in/ananya-roy-ait',
    passwordHash: 'ait@2026',
    createdAt: '2025-08-10T10:00:00Z',
  },
  // 3. CLUB SECRETARY (3rd Year Student / Organiser)
  {
    id: 'user-club-sec-1',
    fullName: 'Rohan Patil',
    aitRegNo: 'AIT/2022/ENTC/115',
    aitRollNo: '22115',
    collegeEmail: 'rohan.patil@aitpune.edu.in',
    branch: 'Electronics & Telecommunication',
    graduationYear: 2026,
    yearOfStudy: 3,
    isYearVerified: true,
    academicYearNotes: 'Verified via AIT Central Academic Roster 2024-25',
    role: 'CLUB_SECRETARY',
    assignedClubId: 'club-design-innovation',
    assignedClubName: 'Design & Innovation Club',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Club Secretary for Design & Innovation Club. Manages technical club hackathons, applicant registration workflows, judging, and certificate allocations.',
    githubProfile: 'https://github.com/rohan-patil',
    linkedinProfile: 'https://linkedin.com/in/rohan-patil-ait',
    passwordHash: 'ait@2026',
    createdAt: '2024-08-16T11:20:00Z',
  },
  // 4. GENERAL SECRETARY (4th Year Senior Student - Nishant Singh)
  {
    id: 'user-gen-sec-1',
    fullName: 'Nishant Singh',
    aitRegNo: 'AIT/2021/COMP/008',
    aitRollNo: '21008',
    collegeEmail: 'gensec@aitpune.edu.in',
    branch: 'Computer Engineering',
    graduationYear: 2025,
    yearOfStudy: 4,
    isYearVerified: true,
    academicYearNotes: 'Institutional Record Confirmed by Academic Office',
    role: 'GENERAL_SECRETARY',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    bio: 'General Secretary (Technical Affairs), AIT Pune Student Council. Oversees all student technical chapters, hackathons, inter-collegiate delegations, verified student results, and institutional announcements.',
    githubProfile: 'https://github.com/nishant-singh-ait',
    linkedinProfile: 'https://linkedin.com/in/nishant-singh',
    passwordHash: 'ait@2026',
    createdAt: '2023-08-01T08:00:00Z',
  },
  // 5. Additional student with pending institutional verification
  {
    id: 'user-student-2',
    fullName: 'Priya Deshmukh',
    aitRegNo: 'AIT/2022/IT/088',
    aitRollNo: '22088',
    collegeEmail: 'priya.deshmukh@aitpune.edu.in',
    branch: 'Information Technology',
    graduationYear: 2026,
    yearOfStudy: 3,
    isYearVerified: false,
    academicYearNotes: 'Awaiting institutional student enrollment record match',
    role: 'STUDENT',
    verificationStatus: 'PENDING_AIT_VERIFICATION',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Machine learning researcher and UI designer. Winner of SIH 2025 Internal Round. Passionate about healthcare robotics.',
    githubProfile: 'https://github.com/priya-deshmukh',
    linkedinProfile: 'https://linkedin.com/in/priya-deshmukh-ait',
    passwordHash: 'ait@2026',
    createdAt: '2024-08-16T11:20:00Z',
  }
];

export const INITIAL_CLUBS: Club[] = [
  {
    id: 'club-design-innovation',
    name: 'Design & Innovation Club',
    slug: 'design-innovation-club',
    description: 'Premier student design chapter cultivating generative UI/UX, product ergonomics, and architectural visualization.',
    category: 'Design & Creative',
    logoUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=150&auto=format&fit=crop&q=80',
    clubSecretaryId: 'user-club-sec-1',
    clubSecretaryName: 'Rohan Patil',
    jointSecretaryIds: ['user-joint-sec-1'],
    totalHackathons: 0,
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'club-coding',
    name: 'Coding & Algorithmic Club',
    slug: 'coding-club',
    description: 'Competitive programming, ICPC coaching, speed algorithmic hackathons, and systems engineering.',
    category: 'Computer Science',
    logoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
    clubSecretaryId: 'user-club-sec-1',
    clubSecretaryName: 'Rohan Patil',
    jointSecretaryIds: [],
    totalHackathons: 0,
    createdAt: '2023-09-01T10:00:00Z'
  },
  {
    id: 'club-robotics',
    name: 'Robotics & Automation Club',
    slug: 'robotics-club',
    description: 'Autonomous ground rovers, defense aerial drones, embedded telemetry, and sensor fusion.',
    category: 'Hardware & IoT',
    logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80',
    clubSecretaryId: 'user-club-sec-1',
    clubSecretaryName: 'Rohan Patil',
    jointSecretaryIds: [],
    totalHackathons: 0,
    createdAt: '2023-10-10T12:00:00Z'
  },
  {
    id: 'club-cyber',
    name: 'Cyber Defense & Security Club',
    slug: 'cyber-defense-club',
    description: 'Offensive and defensive cybersecurity, network penetration testing, and digital forensics.',
    category: 'Security & Intelligence',
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80',
    totalHackathons: 0,
    createdAt: '2024-02-01T14:00:00Z'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-gs-official-1',
    title: 'AIT Technical Chapters & SIH 2026 Code of Conduct',
    content: 'All student clubs, participants, and project teams across technical chapters must adhere to institutional project verification norms. Official certificates will be counter-signed and cryptographically verified upon formal publication of competition results.',
    category: 'URGENT',
    priority: 'HIGH',
    isPriorityNotice: true,
    authorId: 'user-gen-sec-1',
    authorName: 'Nishant Singh',
    authorDesignation: 'GENERAL_SECRETARY',
    publishedAt: '2026-10-24T09:00:00Z',
    expiryDate: '2026-12-31T23:59:59Z',
    attachmentName: 'AIT_Institutional_Guidelines_2026.pdf',
    status: 'PUBLISHED',
    readCount: 184
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-001',
    targetStudentId: 'user-joint-sec-1',
    targetStudentName: 'Ananya Roy',
    targetStudentRollNo: '23019',
    targetStudentEmail: 'ananya.roy@aitpune.edu.in',
    role: 'JOINT_SECRETARY',
    clubId: 'club-design-innovation',
    clubName: 'Design & Innovation Club',
    appointedById: 'user-club-sec-1',
    appointedByName: 'Rohan Patil',
    appointedByRole: 'CLUB_SECRETARY',
    startDate: '2026-08-01',
    endDate: '2027-05-31',
    status: 'ACTIVE',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'app-002',
    targetStudentId: 'user-club-sec-1',
    targetStudentName: 'Rohan Patil',
    targetStudentRollNo: '22115',
    targetStudentEmail: 'rohan.patil@aitpune.edu.in',
    role: 'CLUB_SECRETARY',
    clubId: 'club-design-innovation',
    clubName: 'Design & Innovation Club',
    appointedById: 'user-gen-sec-1',
    appointedByName: 'Nishant Singh',
    appointedByRole: 'GENERAL_SECRETARY',
    startDate: '2026-07-15',
    endDate: '2027-06-30',
    status: 'ACTIVE',
    createdAt: '2026-07-15T11:00:00Z'
  }
];

export const DEFAULT_FORM_FIELDS: FormFieldDefinition[] = [
  { id: 'f-name', name: 'fullName', label: 'Applicant Full Name', type: 'text', required: true, placeholder: 'As on official College ID card' },
  { id: 'f-reg', name: 'aitRegNo', label: 'AIT Registration Number', type: 'text', required: true, placeholder: 'AIT/YYYY/BRANCH/ROLL' },
  { id: 'f-roll', name: 'aitRollNo', label: 'AIT Roll Number', type: 'text', required: true, placeholder: '5-digit roll number' },
  { id: 'f-email', name: 'collegeEmail', label: 'Official College Email', type: 'email', required: true, placeholder: 'username@aitpune.edu.in' },
  { id: 'f-branch', name: 'branch', label: 'Academic Branch', type: 'dropdown', required: true, options: ['Computer Engineering', 'Information Technology', 'Electronics & Telecommunication', 'Mechanical Engineering', 'Automation & Robotics'] },
  { id: 'f-year', name: 'yearOfStudy', label: 'Academic Year of Study', type: 'dropdown', required: true, options: ['Year 1', 'Year 2', 'Year 3', 'Year 4'], helpText: 'Subject to AIT central academic roster verification' },
  { id: 'f-team', name: 'teamName', label: 'Team Name (if participating as team)', type: 'text', required: false, placeholder: 'e.g. Pixel Forge' },
  { id: 'f-title', name: 'projectTitle', label: 'Project / Innovation Title', type: 'text', required: true, placeholder: 'Proposed hackathon solution title' },
  { id: 'f-desc', name: 'projectDescription', label: 'Problem Statement & Architecture', type: 'textarea', required: true, placeholder: 'Detailed description of your solution and system architecture...' },
  { id: 'f-tech', name: 'technologies', label: 'Technologies & Tools Used', type: 'text', required: true, placeholder: 'e.g. React, Next.js, PyTorch, ROS2' },
  { id: 'f-github', name: 'githubUrl', label: 'GitHub Repository or Project Link', type: 'url', required: false, placeholder: 'https://github.com/username/project' },
  { id: 'f-exp', name: 'experience', label: 'Relevant Prior Experience', type: 'textarea', required: false, placeholder: 'Brief summary of relevant engineering experience' }
];

// Clean presentation state: STRICTLY EMPTY by default.
// The Club Secretary must create and publish actual competitions and hackathons.
export const INITIAL_COMPETITIONS: Competition[] = [];

// Clean presentation state: STRICTLY EMPTY by default.
export const INITIAL_TEAMS: Team[] = [];

// Clean presentation state: STRICTLY EMPTY by default.
export const INITIAL_PROJECTS: Project[] = [];

// Clean presentation state: STRICTLY EMPTY by default.
export const INITIAL_APPLICATIONS: HackathonApplication[] = [];

// Clean presentation state: STRICTLY EMPTY by default.
export const INITIAL_JUDGING_SCORES: JudgingScore[] = [];

// Clean presentation state: STRICTLY EMPTY by default.
// Winners and podium positions are ONLY created through real judging scores and approved publication.
export const INITIAL_RESULTS: CompetitionResult[] = [];

export const DEMO_TEST_RESULTS_FIXTURE: CompetitionResult[] = [];

export const INITIAL_ACHIEVEMENT_DEFINITIONS: AchievementBadge[] = [
  {
    id: 'badge-gold-champion',
    code: 'GOLD_CHAMPION',
    title: 'Hackathon Champion',
    description: 'Secured First Place (Gold Trophy) in an official AIT hackathon.',
    iconName: 'Trophy',
    category: 'PODIUM',
    tier: 'GOLD'
  },
  {
    id: 'badge-silver-runnerup',
    code: 'SILVER_FINALIST',
    title: 'Silver Finalist',
    description: 'Secured Second Place (Silver Medal) in an official AIT competition.',
    iconName: 'Medal',
    category: 'PODIUM',
    tier: 'SILVER'
  },
  {
    id: 'badge-bronze-podium',
    code: 'BRONZE_ACHIEVER',
    title: 'Bronze Achiever',
    description: 'Secured Third Place (Bronze Medal) in an official AIT competition.',
    iconName: 'Award',
    category: 'PODIUM',
    tier: 'BRONZE'
  },
  {
    id: 'badge-active-participant',
    code: 'PARTICIPANT',
    title: 'Verified Competitor',
    description: 'Completed full project submission in an institutional hackathon.',
    iconName: 'Flag',
    category: 'PARTICIPATION',
    tier: 'BRONZE'
  }
];

// Clean presentation state: STRICTLY EMPTY by default.
// Certificates are generated through the Club Secretary generator and General Secretary signing workflow.
export const INITIAL_CERTIFICATES: Certificate[] = [];

// Clean notifications
export const INITIAL_NOTIFICATIONS: Notification[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
