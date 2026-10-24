-- ============================================================================
-- COMPETIHUB - AIT PUNE STUDENT COMPETITION & CERTIFICATE PLATFORM
-- PRODUCTION POSTGRESQL / SUPABASE DATABASE SCHEMA
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Permanent student identity, faculty, admins, principal)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    ait_reg_no TEXT UNIQUE,
    ait_roll_no TEXT UNIQUE,
    college_email TEXT UNIQUE NOT NULL,
    branch TEXT, -- e.g. "Computer Engineering", "IT", "ENTC", "Mechanical"
    graduation_year INTEGER,
    role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'JOINT_SECRETARY', 'CLUB_SECRETARY', 'GENERAL_SECRETARY')),
    verification_status TEXT NOT NULL DEFAULT 'PENDING_AIT_VERIFICATION' CHECK (verification_status IN ('PENDING_AIT_VERIFICATION', 'VERIFIED', 'REJECTED')),
    avatar_url TEXT,
    bio TEXT,
    github_profile TEXT,
    linkedin_profile TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for authentication search (Reg No & Roll No)
CREATE INDEX IF NOT EXISTS idx_profiles_reg_roll ON profiles(ait_reg_no, ait_roll_no);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(verification_status);

-- 2. STUDENT VERIFICATIONS (Official roster / institution verification records)
CREATE TABLE IF NOT EXISTS student_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    notes TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMPETITIONS (Hackathons, coding challenges, robotics events)
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Hackathon', 'Coding Challenge', 'Robotics', 'AI / ML', 'Design Sprint', 'Project Exhibition', 'Cybersecurity')),
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    venue_type TEXT NOT NULL CHECK (venue_type IN ('ON_CAMPUS', 'VIRTUAL', 'HYBRID')),
    venue_details TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    rules TEXT,
    eligibility TEXT,
    banner_url TEXT,
    prize_pool TEXT,
    max_team_size INTEGER DEFAULT 4,
    min_team_size INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COMPETITION ORGANISERS (Permission mapping for organisers)
CREATE TABLE IF NOT EXISTS competition_organisers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    organiser_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_description TEXT DEFAULT 'Lead Organiser',
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(competition_id, organiser_id)
);

-- 5. TEAMS (Fluid teams created for competitions)
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TEAM MEMBERSHIPS (Student identity remains permanent; team membership is fluid)
CREATE TABLE IF NOT EXISTS team_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_in_team TEXT DEFAULT 'Member' CHECK (role_in_team IN ('Leader', 'Developer', 'Designer', 'Researcher', 'Member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, student_id)
);

-- 7. COMPETITION REGISTRATIONS (Links a team to a specific competition)
CREATE TABLE IF NOT EXISTS competition_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED', 'SHORTLISTED', 'SUBMITTED', 'DISQUALIFIED')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(competition_id, team_id)
);

-- 8. PROJECTS (Student solutions developed for competitions)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover_image TEXT,
    short_description TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    competition_id UUID REFERENCES competitions(id) ON DELETE SET NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    demo_url TEXT,
    github_url TEXT,
    challenges_lessons TEXT,
    future_scope TEXT,
    visibility TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'UNLISTED', 'PRIVATE')),
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PROJECT CONTRIBUTORS (Individual member contributions)
CREATE TABLE IF NOT EXISTS project_contributors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    specific_contribution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, student_id)
);

-- 10. COMPETITION RESULTS (Verified official competition rankings)
CREATE TABLE IF NOT EXISTS competition_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    award_title TEXT NOT NULL, -- e.g. "1st Place Winner", "Best Hardware Hack"
    rank_position INTEGER, -- 1, 2, 3 etc. (NULL for special recognitions)
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ACHIEVEMENT DEFINITIONS (Badges and criteria)
CREATE TABLE IF NOT EXISTS achievement_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('PODIUM', 'PARTICIPATION', 'INNOVATION', 'COMMUNITY', 'SPECIAL')),
    tier TEXT DEFAULT 'BRONZE' CHECK (tier IN ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. STUDENT ACHIEVEMENTS (Earned persistent badges)
CREATE TABLE IF NOT EXISTS student_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievement_definitions(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES competitions(id) ON DELETE SET NULL,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    is_official_verified BOOLEAN DEFAULT TRUE,
    UNIQUE(student_id, achievement_id, competition_id)
);

-- 13. CERTIFICATES (Formal certificates issued to students)
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number TEXT UNIQUE NOT NULL, -- e.g. "AIT-CERT-2026-00129"
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    result_id UUID REFERENCES competition_results(id) ON DELETE SET NULL,
    title TEXT NOT NULL, -- "Certificate of Merit", "Certificate of Participation"
    recipient_name TEXT NOT NULL,
    award_text TEXT NOT NULL,
    issue_date DATE NOT NULL,
    issuing_authority TEXT NOT NULL DEFAULT 'Army Institute of Technology, Pune',
    signer_name TEXT DEFAULT 'Aditya Vardhan',
    signer_title TEXT DEFAULT 'General Secretary, Technical Affairs, AIT Pune',
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PENDING_SIGNATURE', 'SIGNED', 'ISSUED', 'REJECTED', 'RETURNED_FOR_CORRECTION', 'REVOKED', 'SUPERSEDED')),
    verification_token TEXT UNIQUE NOT NULL, -- Cryptographically non-guessable token for public verification
    signature_mode TEXT DEFAULT 'PENDING' CHECK (signature_mode IN ('PENDING', 'MODE_A_IMAGE_SEAL', 'MODE_B_CRYPTOGRAPHIC_PDF')),
    signature_hash TEXT, -- Cryptographic hash or signature seal timestamp
    signed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CERTIFICATE VERSIONS (Immutable historical versions upon correction)
CREATE TABLE IF NOT EXISTS certificate_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    snapshot_data JSONB NOT NULL,
    reason_for_change TEXT,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CERTIFICATE APPROVALS (Workflow log for principal & authorities)
CREATE TABLE IF NOT EXISTS certificate_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('SUBMIT', 'APPROVE', 'REJECT', 'RETURN_FOR_CORRECTION', 'SIGN', 'REVOKE')),
    comments TEXT,
    action_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CERTIFICATE SIGNATURES (Security metadata for approved signatures)
CREATE TABLE IF NOT EXISTS certificate_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
    signed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    signing_mode TEXT NOT NULL CHECK (signing_mode IN ('MODE_A_IMAGE_SEAL', 'MODE_B_CRYPTOGRAPHIC_PDF')),
    signature_fingerprint TEXT NOT NULL,
    signer_public_key_id TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 17. CERTIFICATE VERIFICATIONS (Public verification lookup logs)
CREATE TABLE IF NOT EXISTS certificate_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
    verification_ip_hash TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. NOTIFICATIONS (In-app database-backed notification system)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    type TEXT NOT NULL CHECK (type IN ('VERIFICATION', 'COMPETITION', 'TEAM', 'RESULT', 'CERTIFICATE', 'BADGE', 'SYSTEM')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. AUDIT LOGS (Immutable security and operations audit trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. ACADEMIC YEAR CORRECTIONS (Immutable audit trail for student academic records)
CREATE TABLE IF NOT EXISTS academic_year_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_roll_no TEXT NOT NULL,
    previous_graduation_year INTEGER NOT NULL,
    new_graduation_year INTEGER NOT NULL,
    previous_year_of_study INTEGER NOT NULL,
    new_year_of_study INTEGER NOT NULL,
    corrected_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    corrected_by_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 21. HACKATHON APPLICATIONS (Dynamic form submissions)
CREATE TABLE IF NOT EXISTS hackathon_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    club_id UUID,
    applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_roll_no TEXT NOT NULL,
    applicant_reg_no TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_branch TEXT NOT NULL,
    applicant_year INTEGER NOT NULL,
    is_team_application BOOLEAN DEFAULT FALSE,
    team_name TEXT,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    team_members JSONB DEFAULT '[]',
    project_title TEXT,
    project_description TEXT,
    technologies TEXT,
    experience TEXT,
    github_link TEXT,
    custom_answers JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'WITHDRAWN')),
    total_score NUMERIC(5,2),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. JUDGING SCORES (Rubric scores recorded by authorized judges)
CREATE TABLE IF NOT EXISTS judging_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES hackathon_applications(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    team_id TEXT NOT NULL,
    team_name TEXT NOT NULL,
    judge_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    judge_name TEXT NOT NULL,
    technical_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    innovation_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    design_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    presentation_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    total_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    comments TEXT,
    notes TEXT,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. RESULT CORRECTION LOGS (Immutable audit trail for result modifications)
CREATE TABLE IF NOT EXISTS result_correction_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    result_id UUID REFERENCES competition_results(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    competition_title TEXT NOT NULL,
    original_award TEXT NOT NULL,
    new_award TEXT NOT NULL,
    original_team_name TEXT NOT NULL,
    new_team_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    responsible_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    responsible_user_name TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE judging_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_year_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_correction_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Students can read public profiles; only General Secretary can update verification status
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile bio" ON profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (role = (SELECT role FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "General Secretary manage student verifications" ON profiles FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'GENERAL_SECRETARY'));

-- 2. Competitions: Public view published; Club Secretaries & Gen Sec manage
CREATE POLICY "Public view published competitions" ON competitions FOR SELECT USING (status != 'DRAFT');
CREATE POLICY "Club Secretaries manage own club competitions" ON competitions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('CLUB_SECRETARY', 'GENERAL_SECRETARY'))
);

-- 3. Applications: Students view and submit their own; Club Secretary views for their club; GS views all
CREATE POLICY "Students view own applications" ON hackathon_applications FOR SELECT USING (
    applicant_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Club Secretaries manage applications" ON hackathon_applications FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('CLUB_SECRETARY', 'GENERAL_SECRETARY'))
);

-- 4. Judging Scores: Judges and Secretaries manage scores; applicants cannot alter scores
CREATE POLICY "Secretaries view and manage judging scores" ON judging_scores FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('CLUB_SECRETARY', 'GENERAL_SECRETARY'))
);

-- 5. Audit Trails: Append-only / read by authorized administrators
CREATE POLICY "Admin view year corrections" ON academic_year_corrections FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'GENERAL_SECRETARY')
);
CREATE POLICY "Admin view result corrections" ON result_correction_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('CLUB_SECRETARY', 'GENERAL_SECRETARY'))
);

-- 6. Certificates: Students view their own or issued; Gen Sec reviews & signs
CREATE POLICY "Students view own certificates" ON certificates FOR SELECT USING (
    status = 'ISSUED' OR student_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "General Secretary manage certificates" ON certificates FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'GENERAL_SECRETARY')
);

-- 24. NOTICE REACTIONS (WhatsApp-style emoji reactions with 1 active reaction per user per notice)
CREATE TABLE IF NOT EXISTS notice_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reaction TEXT NOT NULL CHECK (reaction IN ('LIKE', 'LOVE', 'LAUGH', 'WOW', 'THANKS', 'CELEBRATE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_notice_reaction UNIQUE(notice_id, user_id)
);

ALTER TABLE notice_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read notice reactions" ON notice_reactions FOR SELECT USING (true);
CREATE POLICY "Users manage own notice reaction" ON notice_reactions FOR ALL USING (
    user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
);

