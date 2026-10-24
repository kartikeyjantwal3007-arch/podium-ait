import { 
  Profile, 
  Competition, 
  Team, 
  Project, 
  CompetitionResult, 
  AchievementBadge, 
  Certificate, 
  Notification, 
  AuditLog 
} from '../types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'user-student-1',
    fullName: 'Aryan Sharma',
    aitRegNo: 'AIT/2022/CE/042',
    aitRollNo: '22042',
    collegeEmail: 'aryan.sharma@aitpune.edu.in',
    branch: 'Computer Engineering',
    graduationYear: 2026,
    role: 'STUDENT',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Passionate full-stack developer & competitive programmer. Lead developer at Team Nova. Focus areas: Computer Vision & Edge AI.',
    githubProfile: 'https://github.com/aryansharma-ait',
    linkedinProfile: 'https://linkedin.com/in/aryan-sharma-ait',
    createdAt: '2024-08-15T10:00:00Z',
  },
  {
    id: 'user-student-2',
    fullName: 'Priya Deshmukh',
    aitRegNo: 'AIT/2022/IT/088',
    aitRollNo: '22088',
    collegeEmail: 'priya.deshmukh@aitpune.edu.in',
    branch: 'Information Technology',
    graduationYear: 2026,
    role: 'STUDENT',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Machine learning researcher and UI designer. Winner of SIH 2025 Internal Round. Passionate about healthcare robotics.',
    githubProfile: 'https://github.com/priya-deshmukh',
    linkedinProfile: 'https://linkedin.com/in/priya-deshmukh-ait',
    createdAt: '2024-08-16T11:20:00Z',
  },
  {
    id: 'user-student-3',
    fullName: 'Rohan Patil',
    aitRegNo: 'AIT/2023/ENTC/115',
    aitRollNo: '23115',
    collegeEmail: 'rohan.patil@aitpune.edu.in',
    branch: 'Electronics & Telecommunication',
    graduationYear: 2027,
    role: 'STUDENT',
    verificationStatus: 'PENDING',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Hardware geek, IoT embedded firmware developer. Building autonomous drones and smart surveillance nodes.',
    createdAt: '2026-09-01T09:15:00Z',
  },
  {
    id: 'user-organiser-1',
    fullName: 'Prof. Rajesh Verma',
    aitRegNo: 'AIT/FAC/CE/014',
    aitRollNo: 'FAC014',
    collegeEmail: 'rverma@aitpune.edu.in',
    branch: 'Computer Engineering Department',
    graduationYear: 2008,
    role: 'COMPETITION_ORGANISER',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    bio: 'Faculty Coordinator - AIT Technical Board & Convener for Innerve 2026 Flagship Hackathon.',
    createdAt: '2023-01-10T08:00:00Z',
  },
  {
    id: 'user-admin-1',
    fullName: 'Dr. Sneha Kulkarni',
    aitRegNo: 'AIT/STAFF/ADMIN/002',
    aitRollNo: 'ADM002',
    collegeEmail: 'admin.competihub@aitpune.edu.in',
    branch: 'Student Welfare & Academic Records',
    graduationYear: 2005,
    role: 'ADMINISTRATOR',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'System Administrator & Dean of Student Affairs office. Manages student rosters, permissions, and institution audits.',
    createdAt: '2022-07-01T08:00:00Z',
  },
  {
    id: 'user-principal-1',
    fullName: 'Brig. (Dr.) S. K. Joshi',
    aitRegNo: 'AIT/OFFICE/DIR/001',
    aitRollNo: 'DIR001',
    collegeEmail: 'principal@aitpune.edu.in',
    branch: 'Directorate & Principal Office',
    graduationYear: 1989,
    role: 'PRINCIPAL',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Principal & Director, Army Institute of Technology, Pune. Supreme institutional authority and official certificate signer.',
    createdAt: '2020-01-01T08:00:00Z',
  }
];

export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'comp-innerve-2026',
    title: 'Innerve 2026: All-India Flagship Hackathon',
    slug: 'innerve-2026',
    description: 'AIT Pune’s premier national 36-hour hackathon. Tackle real-world challenges across Defence-Tech, AI/ML, Cyber Defense, and Smart Cities.',
    category: 'Hackathon',
    status: 'COMPLETED',
    startDate: '2026-03-12T09:00:00Z',
    endDate: '2026-03-14T18:00:00Z',
    venueType: 'ON_CAMPUS',
    venueDetails: 'Ramanujan Computing Hall & Main Auditorium, AIT Campus, Dighi, Pune',
    createdBy: 'user-organiser-1',
    rules: 'Teams must consist of 2 to 4 members. All code must be authored during the hackathon. Plagiarism leads to immediate disqualification.',
    eligibility: 'Open to all engineering students with valid college ID.',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    prizePool: '₹2,50,000 INR + Incubation Grants',
    maxTeamSize: 4,
    minTeamSize: 2,
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'comp-sih-2026',
    title: 'Smart India Hackathon (SIH) 2026 Internal Round',
    slug: 'sih-internal-2026',
    description: 'Official college evaluation round to select top teams representing Army Institute of Technology at the national Smart India Hackathon.',
    category: 'Hackathon',
    status: 'ONGOING',
    startDate: '2026-10-20T08:00:00Z',
    endDate: '2026-10-28T20:00:00Z',
    venueType: 'HYBRID',
    venueDetails: 'AIT Innovation & Incubation Cell (IIC) + Virtual Evaluation Portal',
    createdBy: 'user-organiser-1',
    rules: 'Strict adherence to Ministry of Education problem statements. Hardware and software categories evaluated separately.',
    eligibility: 'AIT Pune undergraduate students across all disciplines.',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    prizePool: 'Official College Nomination + Project Seed Fund',
    maxTeamSize: 6,
    minTeamSize: 4,
    createdAt: '2026-09-15T12:00:00Z'
  },
  {
    id: 'comp-robogenesis-2026',
    title: 'RoboGenesis: Autonomous Drone & Bot Sprint',
    slug: 'robogenesis-2026',
    description: 'Inter-collegiate robotics and autonomous aerial vehicle battle organised by the AIT Robotics Club. Precision obstacle navigation & target tracking.',
    category: 'Robotics',
    status: 'PUBLISHED',
    startDate: '2026-11-15T09:00:00Z',
    endDate: '2026-11-16T18:00:00Z',
    venueType: 'ON_CAMPUS',
    venueDetails: 'AIT Sports Complex & Open Ground Arena, Pune',
    createdBy: 'user-organiser-1',
    rules: 'Autonomous navigation mode compulsory for 60% of track length. Custom telemetry telemetry allowed.',
    eligibility: 'Teams from recognised AICTE / UGC technical institutes.',
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    prizePool: '₹1,00,000 INR',
    maxTeamSize: 4,
    minTeamSize: 2,
    createdAt: '2026-10-01T14:00:00Z'
  },
  {
    id: 'comp-codepulse-2026',
    title: 'CodePulse: Speed Algorithmic Sprint',
    slug: 'codepulse-2026',
    description: 'Intense 4-hour competitive programming showdown testing dynamic programming, graph theory, and mathematical optimization.',
    category: 'Coding Challenge',
    status: 'PUBLISHED',
    startDate: '2026-11-05T14:00:00Z',
    endDate: '2026-11-05T18:00:00Z',
    venueType: 'VIRTUAL',
    venueDetails: 'CompetiHub Online Sandbox & Automated Test Arena',
    createdBy: 'user-organiser-1',
    rules: 'Individual or pair participation. Standard ICPC scoring with time penalties.',
    eligibility: 'All registered AIT students.',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    prizePool: '₹35,000 INR + Placement Mentorship',
    maxTeamSize: 2,
    minTeamSize: 1,
    createdAt: '2026-10-10T16:00:00Z'
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-nova',
    name: 'Team Nova',
    slug: 'team-nova',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    description: 'Specializing in computer vision, edge AI algorithms, and military situational awareness systems.',
    createdBy: 'user-student-1',
    createdAt: '2025-11-10T10:00:00Z',
    members: [
      {
        studentId: 'user-student-1',
        fullName: 'Aryan Sharma',
        aitRollNo: '22042',
        roleInTeam: 'Leader',
        joinedAt: '2025-11-10T10:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-2',
        fullName: 'Priya Deshmukh',
        aitRollNo: '22088',
        roleInTeam: 'Developer',
        joinedAt: '2025-11-12T14:30:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'team-byteforge',
    name: 'Team ByteForge',
    slug: 'team-byteforge',
    logoUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=100&auto=format&fit=crop&q=80',
    description: 'Decentralized systems, blockchain integrity, and verifiable health tech solutions.',
    createdBy: 'user-student-2',
    createdAt: '2025-12-01T15:00:00Z',
    members: [
      {
        studentId: 'user-student-2',
        fullName: 'Priya Deshmukh',
        aitRollNo: '22088',
        roleInTeam: 'Leader',
        joinedAt: '2025-12-01T15:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      {
        studentId: 'user-student-3',
        fullName: 'Rohan Patil',
        aitRollNo: '23115',
        roleInTeam: 'Researcher',
        joinedAt: '2026-01-05T11:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'team-circuit',
    name: 'Team Circuit',
    slug: 'team-circuit',
    logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
    description: 'Embedded IoT devices, smart renewable grids, and industrial telemetry systems.',
    createdBy: 'user-student-3',
    createdAt: '2026-01-15T09:00:00Z',
    members: [
      {
        studentId: 'user-student-3',
        fullName: 'Rohan Patil',
        aitRollNo: '23115',
        roleInTeam: 'Leader',
        joinedAt: '2026-01-15T09:00:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-rakshavigil',
    title: 'RakshaVigil: AI Perimeter Threat Detection & Alert System',
    slug: 'rakshavigil',
    coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Thermal sensor and optical camera surveillance pipeline with edge neural inference to detect intrusions in zero-visibility conditions.',
    problemStatement: 'Military border outposts and critical defence installations require 24/7 automated situational awareness without reliance on persistent cloud connectivity.',
    proposedSolution: 'Engineered an on-device YOLO-v8 edge pipeline deploying to NVIDIA Jetson hardware. Uses thermal fusion and low-power LoRa mesh alerts to warn guards instantaneously.',
    technologies: ['PyTorch', 'YOLOv8', 'NVIDIA Jetson', 'LoRaWAN', 'FastAPI', 'Next.js', 'WebSockets'],
    competitionId: 'comp-innerve-2026',
    competitionTitle: 'Innerve 2026: All-India Flagship Hackathon',
    teamId: 'team-nova',
    teamName: 'Team Nova',
    demoUrl: 'https://rakshavigil-demo.aitpune.ac.in',
    githubUrl: 'https://github.com/team-nova-ait/rakshavigil',
    challengesLessons: 'Calibrating thermal infrared sensor noise during dawn transitions required training custom synthetic illumination transforms.',
    futureScope: 'Integration with autonomous patrol quadcopters and automated spotlight tracking.',
    visibility: 'PUBLIC',
    likesCount: 64,
    isLikedByUser: true,
    contributors: [
      {
        studentId: 'user-student-1',
        studentName: 'Aryan Sharma',
        contribution: 'Model quantization, edge inference architecture, and realtime WebSocket dashboard.'
      },
      {
        studentId: 'user-student-2',
        studentName: 'Priya Deshmukh',
        contribution: 'Thermal image preprocessing pipeline and ground-station UI design.'
      }
    ],
    createdAt: '2026-03-14T16:00:00Z'
  },
  {
    id: 'proj-medichain',
    title: 'MediChain: Decentralized E-Health Integrity for Veteran Clinics',
    slug: 'medichain',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Zero-knowledge verifiable medical history verification for military healthcare centers and civilian referrals.',
    problemStatement: 'Medical records of service veterans often get fragmented across regional military hospitals and empanelled clinics, causing diagnostic delays.',
    proposedSolution: 'Developed an encrypted distributed data ledger using zk-SNARKs allowing doctors to verify prescription authenticity without leaking confidential patient identities.',
    technologies: ['Solidity', 'zk-SNARKs', 'Next.js', 'Ethers.js', 'IPFS', 'Tailwind CSS'],
    competitionId: 'comp-innerve-2026',
    competitionTitle: 'Innerve 2026: All-India Flagship Hackathon',
    teamId: 'team-byteforge',
    teamName: 'Team ByteForge',
    demoUrl: 'https://medichain-ait.vercel.app',
    githubUrl: 'https://github.com/team-byteforge/medichain',
    challengesLessons: 'Handling IPFS pin latency on congested military intranet nodes required local caching layers.',
    futureScope: 'Incorporating ABDM (Ayushman Bharat Digital Mission) compliant FHIR APIs.',
    visibility: 'PUBLIC',
    likesCount: 42,
    isLikedByUser: false,
    contributors: [
      {
        studentId: 'user-student-2',
        studentName: 'Priya Deshmukh',
        contribution: 'Zero-knowledge proof verification circuits and smart contract architecture.'
      },
      {
        studentId: 'user-student-3',
        studentName: 'Rohan Patil',
        contribution: 'Hardware biometric scanner integration for cryptographic patient key retrieval.'
      }
    ],
    createdAt: '2026-03-14T15:30:00Z'
  },
  {
    id: 'proj-smartgrid',
    title: 'SmartGrid Pune: IoT Automated Energy Load Balancer',
    slug: 'smartgrid-pune',
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Decentralized microcontroller network dynamically balancing campus solar microgrid feeds with the municipal grid.',
    problemStatement: 'Peak load spikes cause unnecessary diesel generator switch-on during campus academic hours.',
    proposedSolution: 'ESP32 IoT sensor nodes measuring power factor and harmonics in real time, switching non-critical transformer loads automatically.',
    technologies: ['ESP32', 'C++', 'MQTT', 'InfluxDB', 'Grafana', 'Node.js'],
    competitionId: 'comp-innerve-2026',
    competitionTitle: 'Innerve 2026: All-India Flagship Hackathon',
    teamId: 'team-circuit',
    teamName: 'Team Circuit',
    demoUrl: 'https://smartgrid-demo.aitpune.ac.in',
    githubUrl: 'https://github.com/team-circuit/smartgrid',
    challengesLessons: 'Managing electromagnetic interference from heavy induction motors near the mechanical workshop.',
    futureScope: 'Deploying neural predictive battery bank charging schedules based on weather satellite APIs.',
    visibility: 'PUBLIC',
    likesCount: 29,
    isLikedByUser: false,
    contributors: [
      {
        studentId: 'user-student-3',
        studentName: 'Rohan Patil',
        contribution: 'PCB design, firmware coding, and telemetry MQTT integration.'
      }
    ],
    createdAt: '2026-03-14T14:45:00Z'
  }
];

export const INITIAL_RESULTS: CompetitionResult[] = [
  {
    id: 'res-innerve-1',
    competitionId: 'comp-innerve-2026',
    competitionTitle: 'Innerve 2026: All-India Flagship Hackathon',
    teamId: 'team-nova',
    teamName: 'Team Nova',
    projectId: 'proj-rakshavigil',
    projectTitle: 'RakshaVigil: AI Perimeter Threat Detection',
    awardTitle: '1st Place Winner - Grand Champions',
    rankPosition: 1,
    isVerified: true,
    verifiedBy: 'Prof. Rajesh Verma',
    verifiedAt: '2026-03-15T12:00:00Z',
    members: [
      { studentId: 'user-student-1', name: 'Aryan Sharma', aitRollNo: '22042' },
      { studentId: 'user-student-2', name: 'Priya Deshmukh', aitRollNo: '22088' }
    ]
  },
  {
    id: 'res-innerve-2',
    competitionId: 'comp-innerve-2026',
    competitionTitle: 'Innerve 2026: All-India Flagship Hackathon',
    teamId: 'team-byteforge',
    teamName: 'Team ByteForge',
    projectId: 'proj-medichain',
    awardTitle: '2nd Place - 1st Runner Up',
    rankPosition: 2,
    isVerified: true,
    verifiedBy: 'Prof. Rajesh Verma',
    verifiedAt: '2026-03-15T12:00:00Z',
    members: [
      { studentId: 'user-student-2', name: 'Priya Deshmukh', aitRollNo: '22088' },
      { studentId: 'user-student-3', name: 'Rohan Patil', aitRollNo: '23115' }
    ]
  },
  {
    id: 'res-innerve-3',
    competitionId: 'comp-innerve-2026',
    competitionTitle: 'Innerve 2026: All-India Flagship Hackathon',
    teamId: 'team-circuit',
    teamName: 'Team Circuit',
    projectId: 'proj-smartgrid',
    awardTitle: '3rd Place - 2nd Runner Up',
    rankPosition: 3,
    isVerified: true,
    verifiedBy: 'Prof. Rajesh Verma',
    verifiedAt: '2026-03-15T12:00:00Z',
    members: [
      { studentId: 'user-student-3', name: 'Rohan Patil', aitRollNo: '23115' }
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
  {
    id: 'cert-ait-00421',
    certificateNumber: 'AIT-CERT-2026-00421',
    studentId: 'user-student-1',
    recipientName: 'Aryan Sharma',
    competitionId: 'comp-innerve-2026',
    competitionTitle: 'Innerve 2026: All-India Flagship Hackathon',
    resultId: 'res-innerve-1',
    title: 'Certificate of Merit & 1st Place Distinction',
    awardText: 'This is to officially certify that Aryan Sharma (Roll No: 22042) representing Team Nova secured First Place in Innerve 2026 for the project "RakshaVigil: AI Perimeter Threat Detection", demonstrated at Army Institute of Technology, Pune.',
    issueDate: '2026-03-18',
    issuingAuthority: 'Army Institute of Technology, Pune',
    signerName: 'Brig. (Dr.) S. K. Joshi',
    signerTitle: 'Principal & Director, AIT Pune',
    status: 'ISSUED',
    verificationToken: 'ait-vtoken-9f82ab47c1e34589d892',
    signatureMode: 'MODE_A_IMAGE_SEAL',
    signatureHash: 'SHA256:8b7a42ec3105fdc90e54d898bfca6a7515e01f52b7ad38e6cfcf2a01',
    signedAt: '2026-03-18T14:30:00Z',
    createdAt: '2026-03-16T10:00:00Z'
  },
  {
    id: 'cert-ait-00422',
    certificateNumber: 'AIT-CERT-2026-00422',
    studentId: 'user-student-2',
    recipientName: 'Priya Deshmukh',
    competitionId: 'comp-innerve-2026',
    competitionTitle: 'Innerve 2026: All-India Flagship Hackathon',
    resultId: 'res-innerve-1',
    title: 'Certificate of Merit & 1st Place Distinction',
    awardText: 'This is to officially certify that Priya Deshmukh (Roll No: 22088) representing Team Nova secured First Place in Innerve 2026 for the project "RakshaVigil: AI Perimeter Threat Detection", demonstrated at Army Institute of Technology, Pune.',
    issueDate: '2026-03-18',
    issuingAuthority: 'Army Institute of Technology, Pune',
    signerName: 'Brig. (Dr.) S. K. Joshi',
    signerTitle: 'Principal & Director, AIT Pune',
    status: 'ISSUED',
    verificationToken: 'ait-vtoken-5b12cd98e4f12345a781',
    signatureMode: 'MODE_A_IMAGE_SEAL',
    signatureHash: 'SHA256:4c2a51bf2904eac10e34d712bfca6a7515e01f52b7ad38e6dfaf3b12',
    signedAt: '2026-03-18T14:30:00Z',
    createdAt: '2026-03-16T10:00:00Z'
  },
  {
    id: 'cert-ait-00423',
    certificateNumber: 'AIT-CERT-2026-00423',
    studentId: 'user-student-3',
    recipientName: 'Rohan Patil',
    competitionId: 'comp-innerve-2026',
    competitionTitle: 'Innerve 2026: All-India Flagship Hackathon',
    resultId: 'res-innerve-3',
    title: 'Certificate of Merit & 3rd Place Distinction',
    awardText: 'This is to officially certify that Rohan Patil (Roll No: 23115) representing Team Circuit secured Third Place in Innerve 2026 for the project "SmartGrid Pune: IoT Automated Energy Load Balancer".',
    issueDate: '2026-03-19',
    issuingAuthority: 'Army Institute of Technology, Pune',
    signerName: 'Brig. (Dr.) S. K. Joshi',
    signerTitle: 'Principal & Director, AIT Pune',
    status: 'UNDER_REVIEW', // In principal queue!
    verificationToken: 'ait-vtoken-11aa22bb33cc44dd55ee',
    signatureMode: 'PENDING',
    createdAt: '2026-03-16T10:00:00Z'
  },
  {
    id: 'cert-ait-00424',
    certificateNumber: 'AIT-CERT-2026-00424',
    studentId: 'user-student-1',
    recipientName: 'Aryan Sharma',
    competitionId: 'comp-codepulse-2026',
    competitionTitle: 'CodePulse: Speed Algorithmic Sprint',
    title: 'Certificate of Participation & High Performance',
    awardText: 'Awarded to Aryan Sharma (Roll No: 22042) for successful qualification and top-tier standing in CodePulse Speed Algorithmic Sprint at AIT Pune.',
    issueDate: '2026-10-15',
    issuingAuthority: 'Army Institute of Technology, Pune',
    signerName: 'Brig. (Dr.) S. K. Joshi',
    signerTitle: 'Principal & Director, AIT Pune',
    status: 'UNDER_REVIEW', // In principal queue!
    verificationToken: 'ait-vtoken-88cc99dd00ee11ff22aa',
    signatureMode: 'PENDING',
    createdAt: '2026-10-16T09:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Certificate Issued & Verified',
    message: 'Your official 1st Place Merit Certificate for Innerve 2026 has been signed by the Principal and is ready for download.',
    link: '/certificates',
    type: 'CERTIFICATE',
    isRead: false,
    createdAt: '2026-03-18T14:35:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Gold Achiever Badge Awarded',
    message: 'Congratulations! You earned the permanent "Gold Achiever" badge for your podium finish.',
    link: '/achievements',
    type: 'BADGE',
    isRead: false,
    createdAt: '2026-03-18T14:36:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-student-1',
    title: 'SIH 2026 Internal Selection Ongoing',
    message: 'The evaluation committee has commenced reviews for shortlisted projects in Ramanujan Hall.',
    link: '/competitions/sih-internal-2026',
    type: 'COMPETITION',
    isRead: true,
    createdAt: '2026-10-21T10:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    actorId: 'user-organiser-1',
    actorName: 'Prof. Rajesh Verma',
    actorRole: 'COMPETITION_ORGANISER',
    action: 'OFFICIAL_RESULT_SUBMITTED',
    targetType: 'COMPETITION',
    targetId: 'comp-innerve-2026',
    details: 'Verified and submitted final podium rankings for Innerve 2026 (1st: Team Nova, 2nd: Team ByteForge, 3rd: Team Circuit).',
    timestamp: '2026-03-15T12:00:00Z'
  },
  {
    id: 'audit-002',
    actorId: 'user-principal-1',
    actorName: 'Brig. (Dr.) S. K. Joshi',
    actorRole: 'PRINCIPAL',
    action: 'CERTIFICATE_APPROVED_AND_SIGNED',
    targetType: 'CERTIFICATE',
    targetId: 'cert-ait-00421',
    details: 'Approved & cryptographically stamped certificate AIT-CERT-2026-00421 for recipient Aryan Sharma.',
    timestamp: '2026-03-18T14:30:00Z'
  },
  {
    id: 'audit-003',
    actorId: 'user-admin-1',
    actorName: 'Dr. Sneha Kulkarni',
    actorRole: 'ADMINISTRATOR',
    action: 'STUDENT_ROSTER_VERIFIED',
    targetType: 'PROFILE',
    targetId: 'user-student-1',
    details: 'Verified student academic credentials against AIT Pune Central Academic ERP registry (Roll: 22042).',
    timestamp: '2024-08-15T10:30:00Z'
  }
];
