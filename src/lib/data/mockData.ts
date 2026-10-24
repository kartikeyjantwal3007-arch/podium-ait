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
  Appointment
} from '../types';

export const INITIAL_PROFILES: Profile[] = [
  // 1. STUDENT
  {
    id: 'user-student-1',
    fullName: 'Sanyam',
    aitRegNo: 'AIT/2022/CE/042',
    aitRollNo: '22042',
    collegeEmail: 'sanyam@aitpune.edu.in',
    branch: 'Computer Engineering',
    graduationYear: 2026,
    yearOfStudy: 3,
    role: 'STUDENT',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Passionate UI designer & full-stack developer. Team Lead at Pixel Forge. Focus: Generative UI, 3D interactive graphics & spatial computing.',
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
    role: 'CLUB_SECRETARY',
    assignedClubId: 'club-design-innovation',
    assignedClubName: 'Design & Innovation Club',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Club Secretary for Design & Innovation Club. Manages Graphica flagship hackathon, team registries, podium submissions, and certificate workflows.',
    githubProfile: 'https://github.com/rohan-patil',
    linkedinProfile: 'https://linkedin.com/in/rohan-patil-ait',
    passwordHash: 'ait@2026',
    createdAt: '2024-08-16T11:20:00Z',
  },
  // 4. GENERAL SECRETARY (4th Year Senior Student)
  {
    id: 'user-gen-sec-1',
    fullName: 'Aditya Vardhan',
    aitRegNo: 'AIT/2021/COMP/008',
    aitRollNo: '21008',
    collegeEmail: 'gensec@aitpune.edu.in',
    branch: 'Computer Engineering',
    graduationYear: 2025,
    yearOfStudy: 4,
    role: 'GENERAL_SECRETARY',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    bio: 'General Secretary (Technical Affairs), AIT Pune Student Council. Oversees all student technical clubs, hackathons, inter-collegiate delegations, and priority college notices.',
    githubProfile: 'https://github.com/aditya-vardhan-ait',
    linkedinProfile: 'https://linkedin.com/in/aditya-vardhan',
    passwordHash: 'ait@2026',
    createdAt: '2023-08-01T08:00:00Z',
  },
  // 5. DIRECTOR (Principal & Institutional Head)
  {
    id: 'user-director-1',
    fullName: 'Brig. (Dr.) S. K. Joshi',
    aitRegNo: 'AIT/OFFICE/DIR/001',
    aitRollNo: 'DIR001',
    collegeEmail: 'director@aitpune.edu.in',
    branch: 'Directorate & Principal Office',
    graduationYear: 1989,
    role: 'DIRECTOR',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Director & Principal, Army Institute of Technology, Pune. Supreme institutional authority, podium overview supervisor, and official cryptographic certificate signer.',
    passwordHash: 'ait@director',
    createdAt: '2020-01-01T08:00:00Z',
  },
  // Additional student for testing
  {
    id: 'user-student-2',
    fullName: 'Priya Deshmukh',
    aitRegNo: 'AIT/2022/IT/088',
    aitRollNo: '22088',
    collegeEmail: 'priya.deshmukh@aitpune.edu.in',
    branch: 'Information Technology',
    graduationYear: 2026,
    yearOfStudy: 3,
    role: 'STUDENT',
    verificationStatus: 'VERIFIED',
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
    totalHackathons: 3,
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'club-coding',
    name: 'Coding & Algorithmic Club',
    slug: 'coding-club',
    description: 'Competitive programming, ICPC coaching, speed algorithmic hackathons, and systems engineering.',
    category: 'Computer Science',
    logoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
    clubSecretaryId: 'user-student-2',
    clubSecretaryName: 'Priya Deshmukh',
    jointSecretaryIds: [],
    totalHackathons: 4,
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
    totalHackathons: 2,
    createdAt: '2023-10-10T12:00:00Z'
  },
  {
    id: 'club-cyber',
    name: 'Cyber Defense & Security Club',
    slug: 'cyber-defense-club',
    description: 'Offensive and defensive cybersecurity, network penetration testing, and digital forensics.',
    category: 'Security & Intelligence',
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80',
    totalHackathons: 2,
    createdAt: '2024-02-01T14:00:00Z'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-priority-1',
    title: 'Mandatory Institutional Hackathon Code of Conduct & SIH 2026 Participation Guidelines',
    content: 'All participating student teams across all technical clubs must complete verified project registrations on CompetiHub. Plagiarism screening is mandatory. Certificates will be signed by the Director upon official result verification.',
    category: 'URGENT',
    priority: 'HIGH',
    isPriorityNotice: true,
    authorId: 'user-gen-sec-1',
    authorName: 'Aditya Vardhan',
    authorDesignation: 'GENERAL_SECRETARY',
    publishedAt: '2026-10-23T10:00:00Z',
    expiryDate: '2026-11-30T23:59:59Z',
    attachmentName: 'AIT_Code_Of_Conduct_2026.pdf',
    status: 'PUBLISHED',
    readCount: 420
  },
  {
    id: 'notice-js-1',
    title: 'Graphica 2026 Project Submission Deadline Extended by 24 Hours',
    content: 'On student request, the submission portal for Graphica 2026 3D prototypes and design system files will remain open until 25 October 2026, 23:59 IST. Please ensure all team members are listed before submission.',
    category: 'HACKATHON',
    priority: 'NORMAL',
    isPriorityNotice: false,
    authorId: 'user-joint-sec-1',
    authorName: 'Ananya Roy',
    authorDesignation: 'JOINT_SECRETARY',
    clubId: 'club-design-innovation',
    clubName: 'Design & Innovation Club',
    publishedAt: '2026-10-20T14:30:00Z',
    status: 'PUBLISHED',
    readCount: 285
  },
  {
    id: 'notice-general-1',
    title: 'New feature: Project Discussions & Peer Reviews on CompetiHub',
    content: 'Students can now leave technical comments and feedback on published hackathon projects. Explore featured campus projects in the Projects directory.',
    category: 'GENERAL',
    priority: 'NORMAL',
    isPriorityNotice: false,
    authorId: 'user-club-sec-1',
    authorName: 'Rohan Patil',
    authorDesignation: 'CLUB_SECRETARY',
    clubId: 'club-design-innovation',
    clubName: 'Design & Innovation Club',
    publishedAt: '2026-10-18T09:00:00Z',
    status: 'PUBLISHED',
    readCount: 310
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
    appointedByName: 'Aditya Vardhan',
    appointedByRole: 'GENERAL_SECRETARY',
    startDate: '2026-07-15',
    endDate: '2027-06-30',
    status: 'ACTIVE',
    createdAt: '2026-07-15T11:00:00Z'
  }
];

export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'comp-graphica-2026',
    title: 'Graphica 2026',
    slug: 'graphica-2026',
    description: 'Visualise Ideas. Design the Future.',
    category: 'Design Sprint',
    status: 'ONGOING',
    startDate: '2026-10-15T09:00:00Z',
    endDate: '2026-10-25T23:59:59Z',
    venueType: 'HYBRID',
    venueDetails: 'AIT Design Lab & Virtual Exhibition Floor',
    clubId: 'club-design-innovation',
    clubName: 'Design & Innovation Club',
    createdBy: 'user-club-sec-1',
    rules: 'Submissions must include high-fidelity interactive prototype, design system rationale, and 3D demonstration assets.',
    eligibility: 'All undergraduate engineering teams across all branches.',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    prizePool: '₹1,50,000 INR + Design Fellowship',
    maxTeamSize: 5,
    minTeamSize: 2,
    organisingCommittee: [
      { name: 'Rohan Patil', rollNo: '22115', role: 'Convener & Club Secretary' },
      { name: 'Ananya Roy', rollNo: '23019', role: 'Joint Secretary (Comms)' },
      { name: 'Vikram Singh', rollNo: '23011', role: 'Technical Logistics' }
    ],
    createdAt: '2026-10-01T10:00:00Z'
  },
  {
    id: 'comp-hackathon-2026',
    title: 'Hackathon 2026',
    slug: 'hackathon-2026',
    description: 'Annual 36-hour hackathon tackling next-gen defense computing, AI, and smart campus solutions.',
    category: 'Hackathon',
    status: 'PUBLISHED',
    startDate: '2026-11-12T09:00:00Z',
    endDate: '2026-11-14T18:00:00Z',
    venueType: 'ON_CAMPUS',
    venueDetails: 'Ramanujan Computing Hall, AIT Campus, Pune',
    clubId: 'club-coding',
    clubName: 'Coding & Algorithmic Club',
    createdBy: 'user-club-sec-1',
    rules: 'Teams of 2 to 4 members. Real-time development verified through automated GitHub commit tracking.',
    eligibility: 'Open to all technical colleges across India.',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    prizePool: '₹2,50,000 INR',
    maxTeamSize: 4,
    minTeamSize: 2,
    organisingCommittee: [
      { name: 'Priya Deshmukh', rollNo: '22088', role: 'Organising Lead' },
      { name: 'Aditya Vardhan', rollNo: '21008', role: 'Chief Supervisor' }
    ],
    createdAt: '2026-10-10T12:00:00Z'
  },
  {
    id: 'comp-design-fiesta',
    title: 'Design Fiesta',
    slug: 'design-fiesta',
    description: 'Premier digital product and sustainable architectural design competition.',
    category: 'Design Sprint',
    status: 'PUBLISHED',
    startDate: '2026-11-25T09:00:00Z',
    endDate: '2026-11-27T18:00:00Z',
    venueType: 'ON_CAMPUS',
    venueDetails: 'AIT Innovation & Incubation Cell (IIC)',
    clubId: 'club-design-innovation',
    clubName: 'Design & Innovation Club',
    createdBy: 'user-club-sec-1',
    rules: 'Comprehensive presentation deck, 3D renders, and working prototypes required.',
    eligibility: 'All students with verified university credentials.',
    bannerUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    prizePool: '₹1,00,000 INR',
    maxTeamSize: 4,
    minTeamSize: 1,
    createdAt: '2026-10-12T14:00:00Z'
  },
  {
    id: 'comp-robo-sprint',
    title: 'Robo Sprint',
    slug: 'robo-sprint',
    description: 'High-speed autonomous bot obstacle course navigation & drone trajectory sprint.',
    category: 'Robotics',
    status: 'PUBLISHED',
    startDate: '2026-12-10T09:00:00Z',
    endDate: '2026-12-12T18:00:00Z',
    venueType: 'ON_CAMPUS',
    venueDetails: 'AIT Sports Complex Arena, Pune',
    clubId: 'club-robotics',
    clubName: 'Robotics & Automation Club',
    createdBy: 'user-club-sec-1',
    rules: 'Bots must operate autonomously during precision navigation corridors.',
    eligibility: 'Recognized AICTE engineering college teams.',
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    prizePool: '₹1,20,000 INR',
    maxTeamSize: 4,
    minTeamSize: 2,
    createdAt: '2026-10-14T15:00:00Z'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-pixel-forge',
    name: 'Pixel Forge',
    slug: 'pixel-forge',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    description: 'Specializing in generative UI/UX, 3D architectural rendering, and sustainable smart campus infrastructure.',
    competitionId: 'comp-graphica-2026',
    createdBy: 'user-student-1',
    createdAt: '2026-09-10T10:00:00Z',
    members: [
      {
        studentId: 'user-student-1',
        fullName: 'Sanyam',
        aitRollNo: '22042',
        roleInTeam: 'Leader',
        joinedAt: '2026-09-10T10:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-2',
        fullName: 'Priya Deshmukh',
        aitRollNo: '22088',
        roleInTeam: 'Designer',
        joinedAt: '2026-09-11T12:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-club-sec-1',
        fullName: 'Rohan Patil',
        aitRollNo: '22115',
        roleInTeam: 'Developer',
        joinedAt: '2026-09-12T14:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-joint-sec-1',
        fullName: 'Ananya Roy',
        aitRollNo: '23019',
        roleInTeam: 'Researcher',
        joinedAt: '2026-09-13T16:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-5',
        fullName: 'Karan Mehra',
        aitRollNo: '22077',
        roleInTeam: 'Member',
        joinedAt: '2026-09-14T10:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'team-zenith',
    name: 'Team Zenith',
    slug: 'team-zenith',
    logoUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&auto=format&fit=crop&q=80',
    description: 'Pioneering healthcare AI, diagnostic computer vision, and autonomous clinical robotics.',
    competitionId: 'comp-graphica-2026',
    createdBy: 'user-student-2',
    createdAt: '2026-09-15T11:00:00Z',
    members: [
      {
        studentId: 'user-student-2',
        fullName: 'Priya Deshmukh',
        aitRollNo: '22088',
        roleInTeam: 'Leader',
        joinedAt: '2026-09-15T11:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-club-sec-1',
        fullName: 'Rohan Patil',
        aitRollNo: '22115',
        roleInTeam: 'Developer',
        joinedAt: '2026-09-16T12:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-6',
        fullName: 'Sameer Joshi',
        aitRollNo: '22099',
        roleInTeam: 'Researcher',
        joinedAt: '2026-09-17T15:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-7',
        fullName: 'Neha Kapoor',
        aitRollNo: '22104',
        roleInTeam: 'Designer',
        joinedAt: '2026-09-18T09:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'team-codecanvas',
    name: 'CodeCanvas',
    slug: 'codecanvas',
    logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    description: 'Graph neural networks, geospatial algorithms, and real-time digital campus twins.',
    competitionId: 'comp-graphica-2026',
    createdBy: 'user-club-sec-1',
    createdAt: '2026-09-18T14:00:00Z',
    members: [
      {
        studentId: 'user-club-sec-1',
        fullName: 'Rohan Patil',
        aitRollNo: '22115',
        roleInTeam: 'Leader',
        joinedAt: '2026-09-18T14:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-1',
        fullName: 'Sanyam',
        aitRollNo: '22042',
        roleInTeam: 'Designer',
        joinedAt: '2026-09-19T10:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-8',
        fullName: 'Vikram Singh',
        aitRollNo: '23011',
        roleInTeam: 'Developer',
        joinedAt: '2026-09-19T11:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-9',
        fullName: 'Tanvi Shinde',
        aitRollNo: '23045',
        roleInTeam: 'Researcher',
        joinedAt: '2026-09-20T12:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-10',
        fullName: 'Aman Deep',
        aitRollNo: '23089',
        roleInTeam: 'Member',
        joinedAt: '2026-09-20T13:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-11',
        fullName: 'Ishita Rawat',
        aitRollNo: '23102',
        roleInTeam: 'Developer',
        joinedAt: '2026-09-21T09:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'team-innovators',
    name: 'The Innovators',
    slug: 'the-innovators',
    logoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&auto=format&fit=crop&q=80',
    description: 'Circular bio-economy, sustainable recycled materials, and zero-carbon building technology.',
    createdBy: 'user-joint-sec-1',
    createdAt: '2026-09-22T10:00:00Z',
    members: [
      {
        studentId: 'user-joint-sec-1',
        fullName: 'Ananya Roy',
        aitRollNo: '23019',
        roleInTeam: 'Leader',
        joinedAt: '2026-09-22T10:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-5',
        fullName: 'Karan Mehra',
        aitRollNo: '22077',
        roleInTeam: 'Researcher',
        joinedAt: '2026-09-22T11:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-8',
        fullName: 'Vikram Singh',
        aitRollNo: '23011',
        roleInTeam: 'Member',
        joinedAt: '2026-09-23T12:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-9',
        fullName: 'Tanvi Shinde',
        aitRollNo: '23045',
        roleInTeam: 'Designer',
        joinedAt: '2026-09-23T14:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-10',
        fullName: 'Aman Deep',
        aitRollNo: '23089',
        roleInTeam: 'Member',
        joinedAt: '2026-09-24T09:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'team-circuit-breakers',
    name: 'Circuit Breakers',
    slug: 'circuit-breakers',
    logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
    description: 'Hardware accelerators, embedded telemetry, and competitive robotics sprint mechanisms.',
    createdBy: 'user-club-sec-1',
    createdAt: '2026-09-25T09:00:00Z',
    members: [
      {
        studentId: 'user-club-sec-1',
        fullName: 'Rohan Patil',
        aitRollNo: '22115',
        roleInTeam: 'Leader',
        joinedAt: '2026-09-25T09:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-6',
        fullName: 'Sameer Joshi',
        aitRollNo: '22099',
        roleInTeam: 'Developer',
        joinedAt: '2026-09-25T11:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-8',
        fullName: 'Vikram Singh',
        aitRollNo: '23011',
        roleInTeam: 'Member',
        joinedAt: '2026-09-26T10:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-11',
        fullName: 'Ishita Rawat',
        aitRollNo: '23102',
        roleInTeam: 'Designer',
        joinedAt: '2026-09-26T14:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'team-alpha-squad',
    name: 'Alpha Squad',
    slug: 'alpha-squad',
    logoUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=100&auto=format&fit=crop&q=80',
    description: 'Autonomous systems, cyber defense simulation, and cloud edge orchestrations.',
    createdBy: 'user-student-1',
    createdAt: '2026-09-28T10:00:00Z',
    members: [
      {
        studentId: 'user-student-1',
        fullName: 'Sanyam',
        aitRollNo: '22042',
        roleInTeam: 'Leader',
        joinedAt: '2026-09-28T10:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-2',
        fullName: 'Priya Deshmukh',
        aitRollNo: '22088',
        roleInTeam: 'Developer',
        joinedAt: '2026-09-28T12:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-7',
        fullName: 'Neha Kapoor',
        aitRollNo: '22104',
        roleInTeam: 'Researcher',
        joinedAt: '2026-09-29T11:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-10',
        fullName: 'Aman Deep',
        aitRollNo: '23089',
        roleInTeam: 'Designer',
        joinedAt: '2026-09-29T15:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-11',
        fullName: 'Ishita Rawat',
        aitRollNo: '23102',
        roleInTeam: 'Member',
        joinedAt: '2026-09-30T10:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-urban-oasis',
    title: 'Urban Oasis',
    slug: 'urban-oasis',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'A sustainable campus design integrating nature and technology.',
    problemStatement: 'Rapid educational campus expansion often creates concrete heat islands with inadequate natural passive ventilation and heavy carbon footprints.',
    proposedSolution: 'Developed an ecologically harmonious architectural blueprint integrating biophilic facades, solar micro-canopies, and stormwater retention ponds.',
    technologies: ['Sustainability', '3D Modelling', 'Architecture'],
    competitionId: 'comp-graphica-2026',
    competitionTitle: 'Graphica 2026',
    teamId: 'team-pixel-forge',
    teamName: 'Team Pixel Forge',
    demoUrl: 'https://urbanoasis-ait.vercel.app',
    githubUrl: 'https://github.com/team-pixel-forge/urban-oasis',
    challengesLessons: 'Harmonizing thermal fluid dynamics models with multi-tier courtyard landscaping structures.',
    futureScope: 'Full integration with AIT Pune future campus expansion master plan.',
    visibility: 'PUBLIC',
    likesCount: 210,
    isLikedByUser: true,
    contributors: [
      {
        studentId: 'user-student-1',
        studentName: 'Sanyam',
        contribution: 'Lead spatial design, procedural terrain generation, and presentation architecture.'
      },
      {
        studentId: 'user-student-2',
        studentName: 'Priya Deshmukh',
        contribution: '3D environment modelling, lighting passes, and material texture mapping.'
      }
    ],
    createdAt: '2026-10-18T14:00:00Z'
  },
  {
    id: 'proj-medbot',
    title: 'MedBot',
    slug: 'medbot',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Intelligent clinical assistance and autonomous triage diagnosis pipeline.',
    problemStatement: 'High patient surges in emergency hospital wings create triage bottlenecks and critical delays.',
    proposedSolution: 'AI-driven physical assistant with computer vision vitals assessment and automated electronic health record updates.',
    technologies: ['Healthcare', 'AI', 'Prototype'],
    competitionId: 'comp-hackathon-2026',
    competitionTitle: 'Hackathon 2026',
    teamId: 'team-zenith',
    teamName: 'Team Zenith',
    demoUrl: 'https://medbot-health.aitpune.ac.in',
    githubUrl: 'https://github.com/team-zenith/medbot',
    challengesLessons: 'Ensuring ultra-low latency inference on edge microcontrollers without network dropouts.',
    futureScope: 'Clinical trials with military cantonment dispensaries.',
    visibility: 'PUBLIC',
    likesCount: 180,
    isLikedByUser: false,
    contributors: [
      {
        studentId: 'user-student-2',
        studentName: 'Priya Deshmukh',
        contribution: 'Neural diagnostic model training and clinical telemetry pipeline.'
      },
      {
        studentId: 'user-club-sec-1',
        studentName: 'Rohan Patil',
        contribution: 'Embedded robotic chassis control and sensor fusion.'
      }
    ],
    createdAt: '2026-10-14T16:00:00Z'
  },
  {
    id: 'proj-campus-navigator',
    title: 'Campus Navigator',
    slug: 'campus-navigator',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Interactive 3D campus routing and network telemetry node mapper.',
    problemStatement: 'Navigating vast university faculties and locating specialized research labs poses challenges for new students and visiting dignitaries.',
    proposedSolution: 'Spatial 3D digital twin map displaying indoor positioning, seminar occupancy, and accessible transit routes.',
    technologies: ['Web App', 'Navigation', 'AI'],
    competitionId: 'comp-hackathon-2026',
    competitionTitle: 'Hackathon 2026',
    teamId: 'team-codecanvas',
    teamName: 'CodeCanvas',
    demoUrl: 'https://campusmap.aitpune.ac.in',
    githubUrl: 'https://github.com/codecanvas/campus-navigator',
    challengesLessons: 'Compressing complex 3D GLTF campus geometries for smooth 60fps mobile execution.',
    futureScope: 'Augmented reality head-up navigation overlay.',
    visibility: 'PUBLIC',
    likesCount: 134,
    isLikedByUser: false,
    contributors: [
      {
        studentId: 'user-club-sec-1',
        studentName: 'Rohan Patil',
        contribution: 'Interactive 3D WebGL renderer and graph shortest path computation.'
      }
    ],
    createdAt: '2026-10-12T11:00:00Z'
  },
  {
    id: 'proj-ecobrick',
    title: 'EcoBrick',
    slug: 'ecobrick',
    coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Carbon-negative structural masonry manufactured from shredded institutional plastic.',
    problemStatement: 'Unrecycled polymeric plastic accumulating in institutional zones creates severe landfill contamination.',
    proposedSolution: 'Compressed high-density thermal interlocking masonry modules requiring zero mortar and providing high insulation values.',
    technologies: ['Recycling', 'Material', 'Design'],
    competitionId: 'comp-design-fiesta',
    competitionTitle: 'Design Fiesta',
    teamId: 'team-innovators',
    teamName: 'The Innovators',
    demoUrl: 'https://ecobrick-ait.org',
    githubUrl: 'https://github.com/the-innovators/ecobrick',
    challengesLessons: 'Achieving consistent compressive load strength exceeding ASTM standards.',
    futureScope: 'Standardization and deployment for military perimeter barrier construction.',
    visibility: 'PUBLIC',
    likesCount: 102,
    isLikedByUser: false,
    contributors: [
      {
        studentId: 'user-joint-sec-1',
        studentName: 'Ananya Roy',
        contribution: 'Material formulation and compressive stress analysis.'
      }
    ],
    createdAt: '2026-10-10T09:30:00Z'
  }
];

export const INITIAL_RESULTS: CompetitionResult[] = [
  {
    id: 'res-graphica-1',
    competitionId: 'comp-graphica-2026',
    competitionTitle: 'Graphica 2026',
    clubId: 'club-design-innovation',
    clubName: 'Design & Innovation Club',
    teamId: 'team-pixel-forge',
    teamName: 'Pixel Forge',
    projectId: 'proj-urban-oasis',
    projectTitle: 'Urban Oasis: Sustainable Campus Design',
    awardTitle: '1st Place Winner - Gold Trophy',
    rankPosition: 1,
    isVerified: true,
    verifiedBy: 'Aditya Vardhan (General Secretary)',
    verifiedAt: '2026-10-20T12:00:00Z',
    submittedBy: 'user-club-sec-1',
    submittedAt: '2026-10-19T18:00:00Z',
    members: [
      { studentId: 'user-student-1', name: 'Sanyam', aitRollNo: '22042' },
      { studentId: 'user-student-2', name: 'Priya Deshmukh', aitRollNo: '22088' },
      { studentId: 'user-club-sec-1', name: 'Rohan Patil', aitRollNo: '22115' },
      { studentId: 'user-joint-sec-1', name: 'Ananya Roy', aitRollNo: '23019' },
      { studentId: 'user-student-5', name: 'Karan Mehra', aitRollNo: '22077' }
    ]
  },
  {
    id: 'res-graphica-2',
    competitionId: 'comp-graphica-2026',
    competitionTitle: 'Graphica 2026',
    clubId: 'club-design-innovation',
    clubName: 'Design & Innovation Club',
    teamId: 'team-zenith',
    teamName: 'Team Zenith',
    projectId: 'proj-medbot',
    projectTitle: 'MedBot: Intelligent Clinical Care System',
    awardTitle: '2nd Place - 1st Runner Up',
    rankPosition: 2,
    isVerified: true,
    verifiedBy: 'Aditya Vardhan (General Secretary)',
    verifiedAt: '2026-10-20T12:00:00Z',
    submittedBy: 'user-club-sec-1',
    submittedAt: '2026-10-19T18:00:00Z',
    members: [
      { studentId: 'user-student-2', name: 'Priya Deshmukh', aitRollNo: '22088' },
      { studentId: 'user-club-sec-1', name: 'Rohan Patil', aitRollNo: '22115' },
      { studentId: 'user-student-6', name: 'Sameer Joshi', aitRollNo: '22099' },
      { studentId: 'user-student-7', name: 'Neha Kapoor', aitRollNo: '22104' }
    ]
  },
  {
    id: 'res-graphica-3',
    competitionId: 'comp-graphica-2026',
    competitionTitle: 'Graphica 2026',
    clubId: 'club-design-innovation',
    clubName: 'Design & Innovation Club',
    teamId: 'team-codecanvas',
    teamName: 'CodeCanvas',
    projectId: 'proj-campus-navigator',
    projectTitle: 'Campus Navigator 3D',
    awardTitle: '3rd Place - 2nd Runner Up',
    rankPosition: 3,
    isVerified: true,
    verifiedBy: 'Aditya Vardhan (General Secretary)',
    verifiedAt: '2026-10-20T12:00:00Z',
    submittedBy: 'user-club-sec-1',
    submittedAt: '2026-10-19T18:00:00Z',
    members: [
      { studentId: 'user-club-sec-1', name: 'Rohan Patil', aitRollNo: '22115' },
      { studentId: 'user-student-1', name: 'Sanyam', aitRollNo: '22042' },
      { studentId: 'user-student-8', name: 'Vikram Singh', aitRollNo: '23011' },
      { studentId: 'user-student-9', name: 'Tanvi Shinde', aitRollNo: '23045' },
      { studentId: 'user-student-10', name: 'Aman Deep', aitRollNo: '23089' },
      { studentId: 'user-student-11', name: 'Ishita Rawat', aitRollNo: '23102' }
    ]
  }
];

export const INITIAL_ACHIEVEMENT_DEFINITIONS: AchievementBadge[] = [
  {
    id: 'badge-gold',
    code: 'GOLD_ACHIEVER',
    title: 'Gold Achiever',
    description: 'Secured 1st Place in an officially verified college or national level competition.',
    iconName: 'Crown',
    category: 'PODIUM',
    tier: 'GOLD'
  },
  {
    id: 'badge-silver',
    code: 'SILVER_ACHIEVER',
    title: 'Silver Achiever',
    description: 'Secured 2nd Place / 1st Runner Up in a verified technical competition.',
    iconName: 'Medal',
    category: 'PODIUM',
    tier: 'SILVER'
  },
  {
    id: 'badge-bronze',
    code: 'BRONZE_ACHIEVER',
    title: 'Bronze Achiever',
    description: 'Secured 3rd Place / 2nd Runner Up in a verified technical competition.',
    iconName: 'Award',
    category: 'PODIUM',
    tier: 'BRONZE'
  },
  {
    id: 'badge-first-project',
    code: 'FIRST_PROJECT',
    title: 'First Project Published',
    description: 'Authored and published an open technical project to the CompetiHub repository.',
    iconName: 'Rocket',
    category: 'INNOVATION',
    tier: 'BRONZE'
  },
  {
    id: 'badge-active-innovator',
    code: 'ACTIVE_INNOVATOR',
    title: 'Active Innovator',
    description: 'Contributed to 2 or more distinct technological innovation projects.',
    iconName: 'Sparkles',
    category: 'INNOVATION',
    tier: 'SILVER'
  },
  {
    id: 'badge-team-player',
    code: 'TEAM_PLAYER',
    title: 'Team Player',
    description: 'Collaborated across multiple teams and competition rosters.',
    iconName: 'Users',
    category: 'COMMUNITY',
    tier: 'SILVER'
  },
  {
    id: 'badge-participant',
    code: 'PARTICIPANT',
    title: 'Competition Participant',
    description: 'Completed full project submission in an institutional hackathon.',
    iconName: 'Flag',
    category: 'PARTICIPATION',
    tier: 'BRONZE'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  // 1. ISSUED & SIGNED (Director approved)
  {
    id: 'cert-ait-00421',
    certificateNumber: 'AIT-CERT-2026-00421',
    studentId: 'user-student-1',
    recipientName: 'Sanyam',
    recipientRollNo: '22042',
    competitionId: 'comp-graphica-2026',
    competitionTitle: 'Graphica 2026',
    clubName: 'Design & Innovation Club',
    resultId: 'res-graphica-1',
    category: 'FIRST_PLACE',
    title: 'Certificate of Merit & 1st Place Distinction',
    awardText: 'This is to officially certify that Sanyam (Roll No: 22042) representing Team Pixel Forge secured First Place in Graphica 2026 for the project "Urban Oasis: Sustainable Campus Design", demonstrated at Army Institute of Technology, Pune.',
    issueDate: '2026-10-21',
    issuingAuthority: 'Army Institute of Technology, Pune',
    signerName: 'Brig. (Dr.) S. K. Joshi',
    signerTitle: 'Director & Principal, AIT Pune',
    status: 'ISSUED',
    verificationToken: 'ait-vtoken-9f82ab47c1e34589d892',
    signatureMode: 'MODE_B_CRYPTOGRAPHIC_PDF',
    signatureHash: 'SHA256:8b7a42ec3105fdc90e54d898bfca6a7515e01f52b7ad38e6cfcf2a01',
    signedAt: '2026-10-21T14:30:00Z',
    createdAt: '2026-10-20T10:00:00Z'
  },
  // 2. PENDING DIRECTOR APPROVAL / SIGNATURE
  {
    id: 'cert-ait-00422',
    certificateNumber: 'AIT-CERT-2026-00422',
    studentId: 'user-student-2',
    recipientName: 'Priya Deshmukh',
    recipientRollNo: '22088',
    competitionId: 'comp-graphica-2026',
    competitionTitle: 'Graphica 2026',
    clubName: 'Design & Innovation Club',
    resultId: 'res-graphica-1',
    category: 'FIRST_PLACE',
    title: 'Certificate of Merit & 1st Place Distinction',
    awardText: 'This is to officially certify that Priya Deshmukh (Roll No: 22088) representing Team Pixel Forge secured First Place in Graphica 2026 for the project "Urban Oasis", demonstrated at Army Institute of Technology, Pune.',
    issueDate: '2026-10-21',
    issuingAuthority: 'Army Institute of Technology, Pune',
    signerName: 'Brig. (Dr.) S. K. Joshi',
    signerTitle: 'Director & Principal, AIT Pune',
    status: 'PENDING_SIGNATURE',
    verificationToken: 'ait-vtoken-5b12cd98e4f12345a781',
    signatureMode: 'PENDING',
    createdAt: '2026-10-20T10:00:00Z'
  },
  // 3. PENDING REVIEW
  {
    id: 'cert-ait-00423',
    certificateNumber: 'AIT-CERT-2026-00423',
    studentId: 'user-club-sec-1',
    recipientName: 'Rohan Patil',
    recipientRollNo: '22115',
    competitionId: 'comp-graphica-2026',
    competitionTitle: 'Graphica 2026',
    clubName: 'Design & Innovation Club',
    resultId: 'res-graphica-2',
    category: 'SECOND_PLACE',
    title: 'Certificate of Merit & 2nd Place Distinction',
    awardText: 'This is to officially certify that Rohan Patil (Roll No: 22115) representing Team Zenith secured Second Place in Graphica 2026.',
    issueDate: '2026-10-22',
    issuingAuthority: 'Army Institute of Technology, Pune',
    signerName: 'Brig. (Dr.) S. K. Joshi',
    signerTitle: 'Director & Principal, AIT Pune',
    status: 'PENDING_REVIEW',
    verificationToken: 'ait-vtoken-11aa22bb33cc44dd55ee',
    signatureMode: 'PENDING',
    createdAt: '2026-10-20T10:00:00Z'
  },
  // 4. PARTICIPATION CERTIFICATE (Generated by Club Secretary)
  {
    id: 'cert-ait-00424',
    certificateNumber: 'AIT-CERT-2026-00424',
    studentId: 'user-joint-sec-1',
    recipientName: 'Ananya Roy',
    recipientRollNo: '23019',
    competitionId: 'comp-graphica-2026',
    competitionTitle: 'Graphica 2026',
    clubName: 'Design & Innovation Club',
    category: 'PARTICIPATION',
    title: 'Certificate of Active Participation',
    awardText: 'Awarded to Ananya Roy (Roll No: 23019) for exceptional technical contribution and high standing in Graphica 2026 at AIT Pune.',
    issueDate: '2026-10-23',
    issuingAuthority: 'Army Institute of Technology, Pune',
    signerName: 'Brig. (Dr.) S. K. Joshi',
    signerTitle: 'Director & Principal, AIT Pune',
    status: 'APPROVED',
    verificationToken: 'ait-vtoken-88cc99dd00ee11ff22aa',
    signatureMode: 'PENDING',
    createdAt: '2026-10-22T09:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Official Certificate Signed & Issued',
    message: 'Your official 1st Place Merit Certificate for Graphica 2026 has been cryptographically signed by the Director and is available in My Certificates.',
    link: '/certificates',
    type: 'CERTIFICATE',
    isRead: false,
    createdAt: '2026-10-21T14:35:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Priority Institutional Notice',
    message: 'General Secretary published: Mandatory Institutional Hackathon Code of Conduct & SIH 2026 Guidelines.',
    link: '/dashboard',
    type: 'PRIORITY_NOTICE',
    isRead: false,
    createdAt: '2026-10-23T10:05:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-joint-sec-1',
    title: 'Notice Published Successfully',
    message: 'Your notice "Graphica 2026 Project Submission Deadline Extended" is now live on the student dashboard.',
    link: '/dashboard',
    type: 'NOTICE',
    isRead: true,
    createdAt: '2026-10-20T14:31:00Z'
  },
  {
    id: 'notif-4',
    userId: 'user-director-1',
    title: 'Certificates Awaiting Signature',
    message: '3 verified merit certificates from Graphica 2026 require Director digital signature.',
    link: '/director',
    type: 'CERTIFICATE',
    isRead: false,
    createdAt: '2026-10-21T10:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    actorId: 'user-club-sec-1',
    actorName: 'Rohan Patil',
    actorRole: 'CLUB_SECRETARY',
    action: 'OFFICIAL_RESULT_SUBMITTED',
    targetType: 'COMPETITION',
    targetId: 'comp-graphica-2026',
    details: 'Submitted final podium rankings for Graphica 2026 (1st: Pixel Forge, 2nd: Team Zenith, 3rd: CodeCanvas).',
    timestamp: '2026-10-19T18:00:00Z'
  },
  {
    id: 'audit-002',
    actorId: 'user-gen-sec-1',
    actorName: 'Aditya Vardhan',
    actorRole: 'GENERAL_SECRETARY',
    action: 'PODIUM_RESULTS_VERIFIED',
    targetType: 'COMPETITION',
    targetId: 'comp-graphica-2026',
    details: 'Verified and approved podium rankings for Graphica 2026. Forwarded certificate batch to Director queue.',
    timestamp: '2026-10-20T12:00:00Z'
  },
  {
    id: 'audit-003',
    actorId: 'user-director-1',
    actorName: 'Brig. (Dr.) S. K. Joshi',
    actorRole: 'DIRECTOR',
    action: 'CERTIFICATE_DIGITALLY_SIGNED',
    targetType: 'CERTIFICATE',
    targetId: 'cert-ait-00421',
    details: 'Cryptographically signed certificate AIT-CERT-2026-00421 with institutional SHA-256 digital stamp for recipient Sanyam.',
    timestamp: '2026-10-21T14:30:00Z'
  },
  {
    id: 'audit-004',
    actorId: 'user-gen-sec-1',
    actorName: 'Aditya Vardhan',
    actorRole: 'GENERAL_SECRETARY',
    action: 'PRIORITY_NOTICE_PUBLISHED',
    targetType: 'NOTICE',
    targetId: 'notice-priority-1',
    details: 'Published institution-wide priority notice: Code of Conduct & SIH 2026 Guidelines.',
    timestamp: '2026-10-23T10:00:00Z'
  }
];
