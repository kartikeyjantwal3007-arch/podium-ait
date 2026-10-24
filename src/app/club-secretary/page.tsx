'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import CertificateModal from '@/components/CertificateModal';
import CertificateDocument from '@/components/CertificateDocument';
import { useAppStore } from '@/lib/store';
import {
  FormFieldDefinition,
  FormFieldType,
  ApplicationStatus,
  Competition,
  CompetitionCategory,
  HackathonApplication,
  CompetitionResult,
  Certificate,
} from '@/lib/types';
import { DEFAULT_FORM_FIELDS } from '@/lib/data/mockData';
import {
  Briefcase,
  Trophy,
  Users,
  Award,
  ScrollText,
  Calendar,
  Plus,
  Crown,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  AlertCircle,
  FileCheck2,
  ArrowRight,
  ShieldAlert,
  Send,
  Trash2,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Sliders,
  Check,
  X,
  FileText,
  ChevronDown,
  Layers,
  Star,
  ExternalLink,
  Lock,
  Globe,
  Tag,
} from 'lucide-react';

function formatLocalDate(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getFutureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatLocalDate(d);
}

export default function ClubSecretaryPage() {
  const {
    currentUser,
    clubs,
    competitions,
    teams,
    projects,
    results,
    certificates,
    notices,
    appointments,
    allProfiles,
    applications,
    judgingScores,
    createCompetition,
    updateCompetitionDetails,
    updateCompetitionForm,
    publishCompetitionRegistration,
    updateApplicationStatus,
    recordJudgingScore,
    submitResultsForVerification,
    generateCertificatesForCompetition,
    allocateCertificates,
    appointJointSecretary,
    revokeAppointment,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'HACKATHONS' | 'FORM_BUILDER' | 'APPLICANTS' | 'JUDGING' | 'PODIUM' | 'CERTIFICATES' | 'APPOINTMENTS'
  >('OVERVIEW');

  // Find club assigned to this secretary (defaults to Design & Innovation Club)
  const myClub =
    clubs.find((c) => c.id === currentUser.assignedClubId || c.clubSecretaryId === currentUser.id) ||
    clubs[0];

  // Competitions strictly belonging to this club
  const clubCompetitions = competitions.filter(
    (c) => c.clubId === myClub.id || c.createdBy === currentUser.id
  );

  const clubResults = results.filter((r) => r.clubId === myClub.id || clubCompetitions.some((c) => c.id === r.competitionId));
  const clubCerts = certificates.filter((cert) => cert.clubName === myClub.name || clubCompetitions.some((comp) => comp.id === cert.competitionId));
  const pendingCerts = clubCerts.filter((c) => c.status === 'PENDING_SIGNATURE' || c.status === 'PENDING_REVIEW');
  const clubAppointments = appointments.filter((a) => a.clubId === myClub.id && a.role === 'JOINT_SECRETARY');

  // Selected competition for forms & applicants
  const [selectedCompId, setSelectedCompId] = useState<string>(clubCompetitions[0]?.id || '');
  const activeComp = competitions.find((c) => c.id === selectedCompId) || clubCompetitions[0];

  // Applications for active competition
  const compApplications = applications.filter((a) => a.competitionId === (activeComp?.id || ''));

  // ── Tab 2: Create Competition / Hackathon State (Requirement 1) ──
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CompetitionCategory>('Hackathon');
  const [newEventType, setNewEventType] = useState<'COMPETITION' | 'HACKATHON'>('HACKATHON');
  const [newParticipationType, setNewParticipationType] = useState<'INDIVIDUAL' | 'TEAM'>('TEAM');
  const [newDesc, setNewDesc] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newRegOpenDate, setNewRegOpenDate] = useState('');
  const [newRegCloseDate, setNewRegCloseDate] = useState('');
  const [newPrizePool, setNewPrizePool] = useState('₹50,000');
  const [newMinTeam, setNewMinTeam] = useState(1);
  const [newMaxTeam, setNewMaxTeam] = useState(4);
  const [newEligibility, setNewEligibility] = useState('Open to all bona-fide engineering students across accredited institutions.');
  const [newRules, setNewRules] = useState('1. All project submissions must be developed during the official event timeframe.\n2. Submissions must adhere to the AIT code of academic integrity.\n3. Third-party open-source libraries are permitted with proper attribution.');
  const [newOfficialUrl, setNewOfficialUrl] = useState('');
  const [newEnableForm, setNewEnableForm] = useState(true);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [previewEventData, setPreviewEventData] = useState<Competition | null>(null);

  // ── Tab 2: Edit Competition State ──
  const [editingComp, setEditingComp] = useState<Competition | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState<CompetitionCategory>('Hackathon');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editPrize, setEditPrize] = useState('');
  const [editMinTeam, setEditMinTeam] = useState(1);
  const [editMaxTeam, setEditMaxTeam] = useState(4);
  const [editCloseDate, setEditCloseDate] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // ── Tab 3: Dynamic Form Builder State ──
  const [formFields, setFormFields] = useState<FormFieldDefinition[]>(
    activeComp?.formFields && activeComp.formFields.length > 0 ? activeComp.formFields : DEFAULT_FORM_FIELDS
  );
  const [formOpenDate, setFormOpenDate] = useState(activeComp?.registrationOpenDate || '2026-10-01');
  const [formCloseDate, setFormCloseDate] = useState(activeComp?.registrationCloseDate || '2026-11-15');
  const [showFormPreview, setShowFormPreview] = useState(false);
  const [formSaveSuccess, setFormSaveSuccess] = useState('');

  // New field state
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FormFieldType>('TEXT');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');

  // ── Tab 4: Applicants State ──
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('ALL');
  const [selectedAppModal, setSelectedAppModal] = useState<HackathonApplication | null>(null);

  // ── Tab 5: Judging & Evaluation State ──
  const [judgingAppId, setJudgingAppId] = useState('');
  const [scoreTechnical, setScoreTechnical] = useState(20);
  const [scoreInnovation, setScoreInnovation] = useState(20);
  const [scoreDesign, setScoreDesign] = useState(20);
  const [scorePresentation, setScorePresentation] = useState(20);
  const [judgeComments, setJudgeComments] = useState('');
  const [judgeNotes, setJudgeNotes] = useState('');
  const [judgingSuccess, setJudgingSuccess] = useState('');

  // ── Tab 6: Declare Winners & Submit Podium State (Requirement 3) ──
  const [podiumCompId, setPodiumCompId] = useState(clubCompetitions[0]?.id || '');
  const activePodiumComp = competitions.find((c) => c.id === podiumCompId) || clubCompetitions[0];

  // Strictly filter candidate participants to confirmed applicants of this event
  const compEligibleApps = applications.filter(
    (a) => a.competitionId === activePodiumComp?.id && (a.status === 'ACCEPTED' || a.status === 'SHORTLISTED' || a.status === 'CONFIRMED')
  );

  const [firstAppId, setFirstAppId] = useState('');
  const [secondAppId, setSecondAppId] = useState('');
  const [thirdAppId, setThirdAppId] = useState('');
  const [specialAwardAppId, setSpecialAwardAppId] = useState('');
  const [specialAwardTitle, setSpecialAwardTitle] = useState('Best Innovative Solution');
  const [judgingEvaluationNotes, setJudgingEvaluationNotes] = useState('');
  const [podiumError, setPodiumError] = useState('');
  const [podiumSuccess, setPodiumSuccess] = useState('');

  // ── Tab 7: Certificate Allocation State (Requirement 4 & 5) ──
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocCompId, setAllocCompId] = useState(clubCompetitions[0]?.id || '');
  const activeAllocComp = competitions.find((c) => c.id === allocCompId) || clubCompetitions[0];
  const allocCompResults = results.filter((r) => r.competitionId === activeAllocComp?.id && r.isVerified);
  const allocCompApps = applications.filter(
    (a) => a.competitionId === activeAllocComp?.id && (a.status === 'ACCEPTED' || a.status === 'SHORTLISTED' || a.status === 'CONFIRMED')
  );

  const [selectedAllocRecipients, setSelectedAllocRecipients] = useState<string[]>([]);
  const [recipientCategories, setRecipientCategories] = useState<Record<string, 'FIRST_PLACE' | 'SECOND_PLACE' | 'THIRD_PLACE' | 'PARTICIPATION'>>({});
  const [previewingCertificate, setPreviewingCertificate] = useState<Certificate | null>(null);
  const [allocError, setAllocError] = useState('');
  const [allocSuccess, setAllocSuccess] = useState('');

  // ── Tab 8: Appoint Joint Secretary State ──
  const [targetStudentId, setTargetStudentId] = useState(allProfiles[1]?.id || '');
  const [jsStartDate, setJsStartDate] = useState('');
  const [jsEndDate, setJsEndDate] = useState('2027-05-31');
  const [appointError, setAppointError] = useState('');
  const [appointSuccess, setAppointSuccess] = useState('');

  const [clientNow, setClientNow] = useState<number | null>(null);

  // Synchronize selected competition when club competitions list loads or updates
  useEffect(() => {
    if (clubCompetitions.length > 0 && (!selectedCompId || !clubCompetitions.some((c) => c.id === selectedCompId))) {
      setSelectedCompId(clubCompetitions[0].id);
    }
  }, [clubCompetitions, selectedCompId]);

  // Client-side mount effect to safely initialize time/dates without prerender mismatches
  useEffect(() => {
    setClientNow(Date.now());
    setNewStartDate((prev) => prev || formatLocalDate());
    setNewRegOpenDate((prev) => prev || formatLocalDate());
    setNewEndDate((prev) => prev || getFutureDate(14));
    setNewRegCloseDate((prev) => prev || getFutureDate(7));
    setJsStartDate((prev) => prev || formatLocalDate());
  }, []);

  const handleOpenCreateModal = () => {
    setNewStartDate((prev) => prev || formatLocalDate());
    setNewRegOpenDate((prev) => prev || formatLocalDate());
    setNewEndDate((prev) => prev || getFutureDate(14));
    setNewRegCloseDate((prev) => prev || getFutureDate(7));
    setCreateError('');
    setCreateSuccess('');
    setShowCreateModal(true);
  };

  // Helper for status badge rendering
  const renderCompetitionStatusBadge = (comp: Competition) => {
    if (comp.status === 'DRAFT') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30 flex items-center gap-1">
          <Lock className="w-2.5 h-2.5" /> Draft (Private)
        </span>
      );
    }
    if (comp.resultsStatus === 'PUBLISHED') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Published
        </span>
      );
    }
    if (comp.resultsStatus === 'PENDING_VERIFICATION') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Pending Verification
        </span>
      );
    }
    if (comp.resultsStatus === 'RETURNED_FOR_CORRECTION') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          Returned for Correction
        </span>
      );
    }
    if (comp.resultsStatus === 'RESULTS_DRAFT') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Results Draft
        </span>
      );
    }
    if (comp.status === 'ONGOING') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Judging in Progress
        </span>
      );
    }
    if (comp.isRegistrationPublished) {
      const isPast = comp.registrationCloseDate && clientNow
        ? new Date(comp.registrationCloseDate).getTime() < clientNow
        : false;
      if (isPast) {
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">
            Registration Closed
          </span>
        );
      }
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
          Registration Open
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
        Applications Under Review
      </span>
    );
  };

  // Handle Create Event (Requirement 1: Save Draft, Preview, Publish Event)
  const handleSaveEvent = (asDraft: boolean) => {
    setCreateError('');
    setCreateSuccess('');

    if (!newTitle.trim()) {
      setCreateError('Event name is required.');
      return;
    }
    if (!newDesc.trim()) {
      setCreateError('Event description is required.');
      return;
    }
    const startDateVal = newStartDate || formatLocalDate();
    const endDateVal = newEndDate || getFutureDate(14);
    const regOpenDateVal = newRegOpenDate || formatLocalDate();
    const regCloseDateVal = newRegCloseDate || getFutureDate(7);

    if (!startDateVal || !endDateVal) {
      setCreateError('Event start and end dates are required.');
      return;
    }
    if (newParticipationType === 'TEAM' && Number(newMinTeam) > Number(newMaxTeam)) {
      setCreateError('Minimum team size cannot be greater than maximum team size.');
      return;
    }

    const res = createCompetition({
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newDesc.trim(),
      clubId: myClub.id,
      clubName: myClub.name,
      category: newCategory,
      eventType: newEventType,
      participationType: newParticipationType,
      startDate: startDateVal,
      endDate: endDateVal,
      registrationOpenDate: regOpenDateVal,
      registrationCloseDate: regCloseDateVal,
      venueType: 'ON_CAMPUS',
      venueDetails: 'AIT Pune Campus, Ramanujan IT Complex',
      createdBy: currentUser.id,
      bannerUrl: newEventType === 'HACKATHON' ? '/images/competitions/graphica.webp' : '/images/competitions/algo-sprint.webp',
      prizePool: newPrizePool.trim(),
      status: asDraft ? 'DRAFT' : 'PUBLISHED',
      isRegistrationPublished: !asDraft,
      minTeamSize: newParticipationType === 'INDIVIDUAL' ? 1 : Number(newMinTeam),
      maxTeamSize: newParticipationType === 'INDIVIDUAL' ? 1 : Number(newMaxTeam),
      eligibility: newEligibility.trim(),
      rules: newRules.trim(),
      officialUrl: newOfficialUrl.trim() || undefined,
      resultsStatus: 'NOT_DECLARED',
      requiresGsApproval: true,
      formFields: newEnableForm ? DEFAULT_FORM_FIELDS : undefined,
    });

    if (res && (res as any).error) {
      setCreateError((res as any).error);
      return;
    }

    setCreateSuccess(asDraft ? 'Event saved as private draft!' : 'Event published successfully and now visible to students!');
    setTimeout(() => {
      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewOfficialUrl('');
      setCreateSuccess('');
    }, 1200);
  };

  const handleOpenPreview = () => {
    if (!newTitle.trim()) {
      setCreateError('Please enter an event name first to preview.');
      return;
    }
    setPreviewEventData({
      id: 'preview-comp',
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newDesc.trim() || 'Event preview description...',
      clubId: myClub.id,
      clubName: myClub.name,
      category: newCategory,
      eventType: newEventType,
      participationType: newParticipationType,
      startDate: newStartDate || formatLocalDate(),
      endDate: newEndDate || getFutureDate(14),
      registrationOpenDate: newRegOpenDate || formatLocalDate(),
      registrationCloseDate: newRegCloseDate || getFutureDate(7),
      venueType: 'ON_CAMPUS',
      venueDetails: 'AIT Pune Campus',
      createdBy: currentUser.id,
      bannerUrl: '/images/competitions/graphica.webp',
      prizePool: newPrizePool.trim(),
      status: 'PUBLISHED',
      isRegistrationPublished: true,
      minTeamSize: newParticipationType === 'INDIVIDUAL' ? 1 : Number(newMinTeam),
      maxTeamSize: newParticipationType === 'INDIVIDUAL' ? 1 : Number(newMaxTeam),
      eligibility: newEligibility.trim(),
      rules: newRules.trim(),
      officialUrl: newOfficialUrl.trim(),
      createdAt: new Date().toISOString(),
    });
  };

  // Handle Edit Hackathon
  const handleStartEdit = (comp: Competition) => {
    setEditingComp(comp);
    setEditTitle(comp.title);
    setEditDesc(comp.description);
    setEditCategory(comp.category);
    setEditStartDate(comp.startDate);
    setEditEndDate(comp.endDate);
    setEditPrize(comp.prizePool);
    setEditMinTeam(comp.minTeamSize || 1);
    setEditMaxTeam(comp.maxTeamSize || 4);
    setEditCloseDate(comp.registrationCloseDate || comp.endDate);
    setEditError('');
    setEditSuccess('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComp) return;
    setEditError('');
    setEditSuccess('');

    const res = updateCompetitionDetails(editingComp.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      category: editCategory,
      startDate: editStartDate,
      endDate: editEndDate,
      prizePool: editPrize.trim(),
      minTeamSize: Number(editMinTeam),
      maxTeamSize: Number(editMaxTeam),
      registrationCloseDate: editCloseDate,
    });

    if (res.success) {
      setEditSuccess('Competition details updated successfully!');
      setTimeout(() => {
        setEditingComp(null);
        setEditSuccess('');
      }, 1200);
    } else {
      setEditError(res.error || 'Failed to update competition.');
    }
  };

  // Handle Dynamic Form Field Addition
  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: FormFieldDefinition = {
      id: `field-${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
      placeholder: newFieldPlaceholder.trim() || undefined,
      options:
        ['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(newFieldType) && newFieldOptions.trim()
          ? newFieldOptions.split(',').map((o) => o.trim()).filter(Boolean)
          : undefined,
    };
    setFormFields([...formFields, newField]);
    setNewFieldLabel('');
    setNewFieldPlaceholder('');
    setNewFieldOptions('');
    setNewFieldRequired(false);
  };

  const handleRemoveField = (fieldId: string) => {
    setFormFields(formFields.filter((f) => f.id !== fieldId));
  };

  const handleSaveForm = (publishNow = false) => {
    if (!activeComp) return;
    updateCompetitionForm(activeComp.id, formFields, formOpenDate, formCloseDate);
    if (publishNow) {
      publishCompetitionRegistration(activeComp.id, true);
    }
    setFormSaveSuccess(publishNow ? 'Registration Form saved and published to students!' : 'Registration Form saved successfully.');
    setTimeout(() => setFormSaveSuccess(''), 3000);
  };

  // Handle Applicant Status Change
  const handleUpdateStatus = (appId: string, status: ApplicationStatus) => {
    updateApplicationStatus(appId, status);
  };

  // Export Applicants to CSV
  const handleExportCSV = () => {
    if (!activeComp) return;
    const rows = [
      ['Application ID', 'Applicant Name', 'Roll No', 'Email', 'Branch', 'Year', 'Team Name', 'Project Title', 'Status', 'Submitted At'],
      ...compApplications.map((a) => [
        a.id,
        `"${a.applicantName}"`,
        a.applicantRollNo,
        a.applicantEmail,
        a.applicantBranch,
        a.applicantYear,
        `"${a.teamName || 'Solo'}"`,
        `"${a.projectTitle || ''}"`,
        a.status,
        a.submittedAt,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeComp.slug}_applicants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Judging Score Submission
  const handleSaveJudging = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgingAppId) return;
    const targetApp = applications.find((a) => a.id === judgingAppId);
    if (!targetApp) return;

    recordJudgingScore({
      applicationId: targetApp.id,
      competitionId: targetApp.competitionId,
      teamId: targetApp.teamId || targetApp.id,
      teamName: targetApp.teamName || targetApp.applicantName,
      judgeId: currentUser.id,
      judgeName: currentUser.fullName,
      technicalScore: Number(scoreTechnical),
      innovationScore: Number(scoreInnovation),
      designScore: Number(scoreDesign),
      presentationScore: Number(scorePresentation),
      comments: judgeComments.trim(),
      notes: judgeNotes.trim(),
    });

    setJudgingSuccess(`Score recorded: ${(Number(scoreTechnical) + Number(scoreInnovation) + Number(scoreDesign) + Number(scorePresentation))}/100 for ${targetApp.teamName || targetApp.applicantName}`);
    setTimeout(() => {
      setJudgingSuccess('');
      setJudgeComments('');
      setJudgeNotes('');
    }, 2500);
  };

  // Handle Declare Podium & Winners (Requirement 3: Save Draft & Submit for Verification)
  const handleSavePodium = (asDraft: boolean) => {
    setPodiumError('');
    setPodiumSuccess('');

    if (!activePodiumComp) {
      setPodiumError('Please select a competition.');
      return;
    }

    if (!firstAppId || !secondAppId || !thirdAppId) {
      setPodiumError('Please select 1st, 2nd, and 3rd place winners from confirmed participants.');
      return;
    }

    if (firstAppId === secondAppId || firstAppId === thirdAppId || secondAppId === thirdAppId) {
      setPodiumError('Contradictory podium entry: 1st, 2nd, and 3rd place must be distinct participants.');
      return;
    }

    const app1 = applications.find((a) => a.id === firstAppId);
    const app2 = applications.find((a) => a.id === secondAppId);
    const app3 = applications.find((a) => a.id === thirdAppId);

    if (!app1 || !app2 || !app3) {
      setPodiumError('Selected participants not found in event roster.');
      return;
    }

    const getMembers = (app: HackathonApplication) => {
      if (app.teamMembers && app.teamMembers.length > 0) {
        return app.teamMembers.map((m) => ({
          studentId: m.studentId || app.applicantId,
          name: m.fullName || m.name,
          aitRollNo: m.aitRollNo || m.rollNo,
        }));
      }
      return [
        {
          studentId: app.applicantId,
          name: app.applicantName,
          aitRollNo: app.applicantRollNo,
        },
      ];
    };

    const proposedResults: Omit<CompetitionResult, 'id'>[] = [
      {
        competitionId: activePodiumComp.id,
        competitionTitle: activePodiumComp.title,
        clubId: myClub.id,
        clubName: myClub.name,
        teamId: app1.teamId || app1.id,
        teamName: app1.teamName || `${app1.applicantName}'s Team`,
        awardTitle: '1st Place Winner — Gold Trophy',
        rankPosition: 1,
        isVerified: false,
        members: getMembers(app1),
      },
      {
        competitionId: activePodiumComp.id,
        competitionTitle: activePodiumComp.title,
        clubId: myClub.id,
        clubName: myClub.name,
        teamId: app2.teamId || app2.id,
        teamName: app2.teamName || `${app2.applicantName}'s Team`,
        awardTitle: '2nd Place Runner-Up — Silver Medal',
        rankPosition: 2,
        isVerified: false,
        members: getMembers(app2),
      },
      {
        competitionId: activePodiumComp.id,
        competitionTitle: activePodiumComp.title,
        clubId: myClub.id,
        clubName: myClub.name,
        teamId: app3.teamId || app3.id,
        teamName: app3.teamName || `${app3.applicantName}'s Team`,
        awardTitle: '3rd Place Runner-Up — Bronze Medal',
        rankPosition: 3,
        isVerified: false,
        members: getMembers(app3),
      },
    ];

    if (specialAwardAppId) {
      const spApp = applications.find((a) => a.id === specialAwardAppId);
      if (spApp) {
        proposedResults.push({
          competitionId: activePodiumComp.id,
          competitionTitle: activePodiumComp.title,
          clubId: myClub.id,
          clubName: myClub.name,
          teamId: spApp.teamId || spApp.id,
          teamName: spApp.teamName || `${spApp.applicantName}'s Team`,
          awardTitle: specialAwardTitle || 'Special Category Award',
          rankPosition: 4,
          isVerified: false,
          members: getMembers(spApp),
        });
      }
    }

    if (asDraft) {
      updateCompetitionDetails(activePodiumComp.id, {
        resultsStatus: 'RESULTS_DRAFT' as any,
      } as any);
      setPodiumSuccess('Podium results saved as private draft! Draft results are strictly hidden from students.');
    } else {
      const res = submitResultsForVerification(activePodiumComp.id, proposedResults);
      if (res.success) {
        setPodiumSuccess('Podium results declared and submitted for General Secretary verification! Status is now Pending Verification.');
      } else {
        setPodiumError(res.error || 'Failed to submit podium results.');
      }
    }
  };

  // Handle Certificate Allocation (Requirement 4: Gold, Silver, Bronze, Participation)
  const handleExecuteAllocation = () => {
    setAllocError('');
    setAllocSuccess('');

    if (selectedAllocRecipients.length === 0) {
      setAllocError('Please select at least one recipient to allocate certificates.');
      return;
    }

    if (!activeAllocComp) {
      setAllocError('Please select an active competition.');
      return;
    }

    const payload: {
      competitionId: string;
      studentId: string;
      recipientName: string;
      recipientRollNo?: string;
      category: 'FIRST_PLACE' | 'SECOND_PLACE' | 'THIRD_PLACE' | 'PARTICIPATION';
      awardTitle?: string;
    }[] = [];

    for (const recKey of selectedAllocRecipients) {
      let studentId = '';
      let recipientName = '';
      let recipientRollNo = '';
      let cat: 'FIRST_PLACE' | 'SECOND_PLACE' | 'THIRD_PLACE' | 'PARTICIPATION' = recipientCategories[recKey] || 'PARTICIPATION';

      // Check in results members
      let foundInResult = false;
      for (const res of allocCompResults) {
        const mem = res.members.find((m) => m.studentId === recKey || `${res.id}-${m.studentId}` === recKey);
        if (mem) {
          studentId = mem.studentId;
          recipientName = mem.name;
          recipientRollNo = mem.aitRollNo;
          foundInResult = true;
          if (!recipientCategories[recKey]) {
            cat = res.rankPosition === 1 ? 'FIRST_PLACE' : res.rankPosition === 2 ? 'SECOND_PLACE' : 'THIRD_PLACE';
          }
          break;
        }
      }

      if (!foundInResult) {
        const app = allocCompApps.find((a) => a.applicantId === recKey || a.id === recKey);
        if (app) {
          studentId = app.applicantId;
          recipientName = app.applicantName;
          recipientRollNo = app.applicantRollNo;
          cat = recipientCategories[recKey] || 'PARTICIPATION';
        }
      }

      if (studentId && recipientName) {
        payload.push({
          competitionId: activeAllocComp.id,
          studentId,
          recipientName,
          recipientRollNo,
          category: cat,
        });
      }
    }

    if (payload.length === 0) {
      setAllocError('Could not resolve selected recipients.');
      return;
    }

    const res = allocateCertificates(payload);
    if (res.success) {
      const skippedNote = res.skippedDuplicates ? ` (Skipped ${res.skippedDuplicates} duplicate requests)` : '';
      setAllocSuccess(`Successfully generated ${res.count} certificate allocations! Submitted to General Secretary signing queue.${skippedNote}`);
      setSelectedAllocRecipients([]);
      setTimeout(() => {
        setShowAllocateModal(false);
        setAllocSuccess('');
      }, 2000);
    } else {
      setAllocError(res.error || 'Failed to allocate certificates.');
    }
  };

  // Handle Appoint JS
  const handleAppointJS = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointError('');
    setAppointSuccess('');

    const res = appointJointSecretary({
      targetStudentId,
      clubId: myClub.id,
      startDate: jsStartDate || formatLocalDate(),
      endDate: jsEndDate || '2027-05-31',
    });

    if (res.success) {
      setAppointSuccess('Joint Secretary appointed successfully! Permissions have been granted.');
    } else {
      setAppointError(res.error || 'Failed to appoint Joint Secretary.');
    }
  };

  // Filtered applicants
  const filteredApplicants = compApplications.filter((a) => {
    const matchesSearch =
      a.applicantName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.applicantRollNo.toLowerCase().includes(appSearch.toLowerCase()) ||
      (a.teamName && a.teamName.toLowerCase().includes(appSearch.toLowerCase())) ||
      (a.projectTitle && a.projectTitle.toLowerCase().includes(appSearch.toLowerCase()));

    const matchesStatus = appStatusFilter === 'ALL' || a.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* ── Club Overview Header ── */}
        <div className="p-6 rounded-3xl bg-[#0c101d] border border-[#1a2236] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/30 shrink-0">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">{myClub.name}</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Club Secretary Desk
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {myClub.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                  <span>Secretary: <strong className="text-white">{currentUser.fullName}</strong></span>
                  <span>•</span>
                  <span>Active Hackathons: <strong className="text-white">{clubCompetitions.length}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  setCreateError('');
                  setCreateSuccess('');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-xs font-semibold text-white shadow-lg shadow-purple-900/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                + Create Competition / Hackathon
              </button>
              <Link
                href="/notices"
                className="px-3.5 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-xs font-semibold text-purple-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ScrollText className="w-3.5 h-3.5" />
                Publish Notice
              </Link>
            </div>
          </div>
        </div>

        {/* ── Metrics Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Hackathons</p>
            <p className="text-2xl font-black text-white mt-1">{clubCompetitions.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Organised under club banner</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Applicants</p>
            <p className="text-2xl font-black text-sky-400 mt-1">{applications.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Across all club events</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Declared Podium Holders</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{clubResults.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Merit rankings submitted</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b]">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Pending Cert Requests</p>
            <p className="text-2xl font-black text-purple-400 mt-1">{pendingCerts.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">In General Secretary signing queue</p>
          </div>
        </div>

        {/* ── Tabs Navigation ── */}
        <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: 'Club Overview' },
            { id: 'HACKATHONS', label: 'Hackathons & Teams' },
            { id: 'FORM_BUILDER', label: 'Form Builder' },
            { id: 'APPLICANTS', label: `Applicants (${compApplications.length})` },
            { id: 'JUDGING', label: 'Judging & Evaluation' },
            { id: 'PODIUM', label: 'Declare Podium & Winners' },
            { id: 'CERTIFICATES', label: 'Generate Certificates' },
            { id: 'APPOINTMENTS', label: 'Appoint Joint Secretary' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#5b50f6] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Organising Committee */}
            <div className="lg:col-span-2 rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Organising Committee & Leadership
                </h3>
              </div>

              <div className="divide-y divide-[#1e293b]">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                      CS
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                      <p className="text-[10px] text-slate-400">Club Secretary (Convener)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
                    Lead Organiser
                  </span>
                </div>

                {clubAppointments.map((app) => (
                  <div key={app.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-xs font-bold text-purple-300">
                        JS
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{app.targetStudentName}</p>
                        <p className="text-[10px] text-slate-400">Joint Secretary (Roll: {app.targetStudentRollNo})</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300">
                      Appointed JS
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Club Activities */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">Recent Club Activities</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0c101d] border border-[#1e293b] space-y-1">
                  <p className="font-semibold text-slate-200">Dynamic Registration Form Active</p>
                  <p className="text-[11px] text-slate-400">Applications open with customizable question rubric</p>
                  <span className="text-[9px] text-emerald-400">● Live Form</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0c101d] border border-[#1e293b] space-y-1">
                  <p className="font-semibold text-slate-200">Ananya Roy appointed Joint Secretary</p>
                  <p className="text-[11px] text-slate-400">Tenure assigned until May 2027</p>
                  <span className="text-[9px] text-purple-400">● Appointment active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: HACKATHONS & COMPETITIONS (Requirement 1) ── */}
        {activeTab === 'HACKATHONS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">Competitions & Hackathons Managed by {myClub.name}</h3>
                <p className="text-xs text-slate-400">
                  Create, configure, publish events, and manage student registration status.
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-purple-900/30 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                + Create Competition / Hackathon
              </button>
            </div>

            {clubCompetitions.length === 0 ? (
              <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 shadow-xl shadow-indigo-950/20">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">No Competitions or Hackathons Created Yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                    The {myClub.name} currently has zero hackathons or competitions. Click below to create your first official event with custom rules, dates, and registration rubric.
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-5 py-2.5 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-xs font-bold text-white shadow-lg shadow-purple-900/30 inline-flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  + Create Competition / Hackathon
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubCompetitions.map((comp) => {
                  const isRegOpen = comp.isRegistrationPublished && (!comp.registrationCloseDate || (clientNow ? new Date(comp.registrationCloseDate).getTime() >= clientNow : true));
                  const compApps = applications.filter((a) => a.competitionId === comp.id);

                  return (
                    <div
                      key={comp.id}
                      className={`rounded-2xl bg-[#111728] border p-5 space-y-3 transition-all ${
                        comp.status === 'DRAFT' ? 'border-dashed border-slate-700/80' : 'border-[#1e293b]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                              {comp.category}
                            </span>
                            {comp.eventType && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                                {comp.eventType}
                              </span>
                            )}
                            {renderCompetitionStatusBadge(comp)}
                          </div>
                          <h4 className="text-base font-bold text-white mt-1.5">{comp.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{comp.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-[#1e293b]">
                        <div>
                          <span className="text-[10px] text-slate-500 block">DATES</span>
                          <span>{new Date(comp.startDate).toLocaleDateString()} – {new Date(comp.endDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">PRIZE POOL</span>
                          <span className="text-amber-400 font-bold">{comp.prizePool}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">PARTICIPATION</span>
                          <span>{comp.participationType || 'TEAM'} ({comp.minTeamSize || 1} - {comp.maxTeamSize || 4} members)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">APPLICANTS</span>
                          <span className="text-sky-400 font-bold">{compApps.length} registered</span>
                        </div>
                      </div>

                      {comp.officialUrl && (
                        <div className="text-[11px] text-indigo-300 flex items-center gap-1.5 pt-1">
                          <Globe className="w-3.5 h-3.5 text-indigo-400" />
                          <a href={comp.officialUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                            {comp.officialUrl}
                          </a>
                        </div>
                      )}

                      {comp.resultsCorrectionNotes && comp.resultsStatus === 'RETURNED_FOR_CORRECTION' && (
                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                          <span className="font-bold block text-rose-400">Returned for Correction:</span>
                          {comp.resultsCorrectionNotes}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1e293b]">
                        <button
                          onClick={() => handleStartEdit(comp)}
                          className="px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit Details
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCompId(comp.id);
                            setActiveTab('FORM_BUILDER');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-purple-300 hover:text-white text-xs font-medium flex items-center gap-1"
                        >
                          <Sliders className="w-3 h-3" />
                          Form Builder
                        </button>

                        {comp.status === 'DRAFT' ? (
                          <button
                            onClick={() => {
                              updateCompetitionDetails(comp.id, {
                                status: 'PUBLISHED' as any,
                              } as any);
                              publishCompetitionRegistration(comp.id, true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-950/20"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Publish Event
                          </button>
                        ) : (
                          <button
                            onClick={() => publishCompetitionRegistration(comp.id, !comp.isRegistrationPublished)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                              comp.isRegistrationPublished
                                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            }`}
                          >
                            {comp.isRegistrationPublished ? 'Close Registration' : 'Reopen Registration'}
                          </button>
                        )}

                        <Link
                          href={`/competitions/${comp.slug}`}
                          className="px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-slate-400 hover:text-white text-xs font-medium ml-auto flex items-center gap-1"
                        >
                          Public Page <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: DYNAMIC FORM BUILDER ── */}
        {activeTab === 'FORM_BUILDER' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  Dynamic Hackathon Application Form Builder
                </h3>
                <p className="text-xs text-slate-400">
                  Configure custom fields and eligibility questions for <strong className="text-white">{activeComp?.title}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCompId}
                  onChange={(e) => {
                    setSelectedCompId(e.target.value);
                    const comp = competitions.find((c) => c.id === e.target.value);
                    if (comp?.formFields) setFormFields(comp.formFields);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                >
                  {clubCompetitions.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>

                <button
                  onClick={() => setShowFormPreview(!showFormPreview)}
                  className="px-3 py-1.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showFormPreview ? 'Hide Preview' : 'Form Preview'}
                </button>

                <button
                  onClick={() => handleSaveForm(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-lg shadow-purple-900/30 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save & Publish
                </button>
              </div>
            </div>

            {formSaveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{formSaveSuccess}</span>
              </div>
            )}

            {/* Registration Schedule Settings */}
            <div className="p-4 rounded-2xl bg-[#111728] border border-[#1e293b] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Opening Date</label>
                <input
                  type="date"
                  value={formOpenDate}
                  onChange={(e) => setFormOpenDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Deadline (Closing Date)</label>
                <input
                  type="date"
                  value={formCloseDate}
                  onChange={(e) => setFormCloseDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Form Preview Mode */}
            {showFormPreview ? (
              <div className="p-6 rounded-2xl bg-[#0c101d] border border-indigo-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400">Student Preview</span>
                    <h4 className="text-base font-bold text-white mt-0.5">{activeComp?.title} - Registration Form</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    Live Form Preview
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formFields.map((field) => (
                    <div key={field.id} className={field.type === 'TEXTAREA' ? 'md:col-span-2' : ''}>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {field.label} {field.required && <span className="text-rose-400">*</span>}
                      </label>
                      {field.type === 'TEXTAREA' ? (
                        <textarea
                          disabled
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                          className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-slate-500 text-xs cursor-not-allowed"
                          rows={3}
                        />
                      ) : field.type === 'DROPDOWN' ? (
                        <select
                          disabled
                          className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-slate-500 text-xs cursor-not-allowed"
                        >
                          <option>Select an option...</option>
                          {field.options?.map((opt, i) => (
                            <option key={i}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'FILE' ? (
                        <div className="px-3 py-3 rounded-xl bg-[#111728] border border-dashed border-[#1e293b] text-center text-xs text-slate-500">
                          Upload file (PDF, ZIP, max 10MB)
                        </div>
                      ) : (
                        <input
                          disabled
                          type={field.type === 'EMAIL' ? 'email' : field.type === 'URL' ? 'url' : 'text'}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                          className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-slate-500 text-xs cursor-not-allowed"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Current Form Fields List */}
                <div className="lg:col-span-2 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Configured Form Fields ({formFields.length})
                  </h4>

                  <div className="space-y-2">
                    {formFields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="p-3.5 rounded-xl bg-[#111728] border border-[#1e293b] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[#0c101d] flex items-center justify-center text-[10px] font-bold text-slate-400">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{field.label}</span>
                              {field.required && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Type: <strong className="text-slate-300">{field.type}</strong>
                              {field.options && field.options.length > 0 && ` • Options: ${field.options.join(', ')}`}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveField(field.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove Field"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Custom Question Form */}
                <div className="p-5 rounded-2xl bg-[#111728] border border-[#1e293b] space-y-4 h-fit">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-indigo-400" />
                    Add Custom Form Field
                  </h4>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Field Label / Question</label>
                    <input
                      type="text"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      placeholder="e.g. Previous Hackathon Experience"
                      className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Field Type</label>
                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as FormFieldType)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                    >
                      <option value="TEXT">Short Text</option>
                      <option value="TEXTAREA">Long Text / Paragraph</option>
                      <option value="DROPDOWN">Dropdown Menu</option>
                      <option value="RADIO">Single Choice (Radio)</option>
                      <option value="CHECKBOX">Multiple Choice (Checkbox)</option>
                      <option value="EMAIL">Email Address</option>
                      <option value="URL">Project Link / URL</option>
                      <option value="FILE">File Upload (PDF / Presentation)</option>
                    </select>
                  </div>

                  {['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(newFieldType) && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Options (Comma-separated)</label>
                      <input
                        type="text"
                        value={newFieldOptions}
                        onChange={(e) => setNewFieldOptions(e.target.value)}
                        placeholder="Option 1, Option 2, Option 3"
                        className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Placeholder Text (Optional)</label>
                    <input
                      type="text"
                      value={newFieldPlaceholder}
                      onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                      placeholder="e.g. Briefly describe..."
                      className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="reqCheckbox"
                      checked={newFieldRequired}
                      onChange={(e) => setNewFieldRequired(e.target.checked)}
                      className="rounded border-[#1e293b] text-indigo-600 focus:ring-0"
                    />
                    <label htmlFor="reqCheckbox" className="text-xs text-slate-300">
                      Mandatory / Required Field
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddField}
                    className="w-full py-2 rounded-xl bg-[#1e293b] hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                  >
                    Add Field to Form
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: APPLICANTS ── */}
        {activeTab === 'APPLICANTS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  Hackathon Applicants & Team Management
                </h3>
                <p className="text-xs text-slate-400">
                  Manage participant eligibility and shortlisting for <strong className="text-white">{activeComp?.title}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                >
                  {clubCompetitions.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl bg-[#0c101d] border border-[#1e293b] hover:border-slate-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download CSV
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by student name, roll number, team name, or project..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WAITLISTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setAppStatusFilter(st)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                      appStatusFilter === st
                        ? 'bg-[#5b50f6] text-white'
                        : 'bg-[#111728] text-slate-400 hover:text-white border border-[#1e293b]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Applicants Table */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c101d] text-slate-400 uppercase text-[10px] border-b border-[#1e293b]">
                    <tr>
                      <th className="p-3.5">Applicant / Lead</th>
                      <th className="p-3.5">Team & Members</th>
                      <th className="p-3.5">Project Title</th>
                      <th className="p-3.5">Verified Year</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b] text-slate-300">
                    {filteredApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500 text-xs">
                          No applications match the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredApplicants.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-800/20 transition-colors">
                          <td className="p-3.5">
                            <p className="font-bold text-white">{app.applicantName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Roll: {app.applicantRollNo} • {app.applicantBranch}
                            </p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-semibold text-slate-200">{app.teamName || 'Solo Applicant'}</p>
                            <p className="text-[10px] text-slate-500">
                              {app.teamMembers?.length || 1} member(s)
                            </p>
                          </td>
                          <td className="p-3.5">
                            <p className="font-medium text-slate-300 truncate max-w-[200px]">
                              {app.projectTitle || 'Proposal Pending'}
                            </p>
                            {app.githubLink && (
                              <a
                                href={app.githubLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-sky-400 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                GitHub <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                              Year {app.applicantYear}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                app.status === 'SHORTLISTED'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : app.status === 'ACCEPTED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : app.status === 'REJECTED'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedAppModal(app)}
                                className="px-2.5 py-1 rounded-lg bg-[#0c101d] border border-[#1e293b] text-slate-300 hover:text-white text-[10px] font-semibold flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                Details
                              </button>

                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                                className="px-2 py-1 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white text-[10px] font-semibold focus:outline-none"
                              >
                                <option value="SUBMITTED">Submitted</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                                <option value="SHORTLISTED">Shortlist</option>
                                <option value="ACCEPTED">Accept</option>
                                <option value="WAITLISTED">Waitlist</option>
                                <option value="REJECTED">Reject</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Application Detail Modal */}
            {selectedAppModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="w-full max-w-xl rounded-2xl bg-[#0c101d] border border-[#1e293b] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">{selectedAppModal.teamName || selectedAppModal.applicantName}</h4>
                      <p className="text-xs text-slate-400">Application ID: {selectedAppModal.id}</p>
                    </div>
                    <button
                      onClick={() => setSelectedAppModal(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#111728] border border-[#1e293b]">
                      <div>
                        <span className="text-slate-500 block text-[10px]">APPLICANT</span>
                        <strong className="text-white">{selectedAppModal.applicantName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">ROLL & BRANCH</span>
                        <span className="text-slate-300">{selectedAppModal.applicantRollNo} ({selectedAppModal.applicantBranch})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">VERIFIED YEAR</span>
                        <span className="text-indigo-400 font-semibold">Year {selectedAppModal.applicantYear}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">STATUS</span>
                        <span className="text-amber-400 font-semibold">{selectedAppModal.status}</span>
                      </div>
                    </div>

                    {selectedAppModal.teamMembers && selectedAppModal.teamMembers.length > 0 && (
                      <div className="p-3 rounded-xl bg-[#111728] border border-[#1e293b] space-y-2">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Team Members</span>
                        <div className="space-y-1">
                          {selectedAppModal.teamMembers.map((m, i) => (
                            <div key={i} className="flex justify-between text-slate-300 text-xs">
                              <span>{m.fullName} ({m.aitRollNo})</span>
                              <span className="text-slate-500">{m.branch} - Year {m.yearOfStudy}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedAppModal.projectTitle && (
                      <div className="p-3 rounded-xl bg-[#111728] border border-[#1e293b] space-y-1">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Project Proposal</span>
                        <p className="font-bold text-white">{selectedAppModal.projectTitle}</p>
                        <p className="text-slate-300 text-xs">{selectedAppModal.projectDescription}</p>
                        {selectedAppModal.technologies && (
                          <p className="text-indigo-400 text-[11px] pt-1">Technologies: {selectedAppModal.technologies}</p>
                        )}
                      </div>
                    )}

                    {selectedAppModal.customAnswers && Object.keys(selectedAppModal.customAnswers).length > 0 && (
                      <div className="p-3 rounded-xl bg-[#111728] border border-[#1e293b] space-y-2">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Form Responses</span>
                        {Object.entries(selectedAppModal.customAnswers).map(([k, v]) => (
                          <div key={k} className="text-xs">
                            <span className="text-slate-400 block">{k}:</span>
                            <span className="text-slate-200 font-medium">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#1e293b]">
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedAppModal.id, 'SHORTLISTED');
                        setSelectedAppModal({ ...selectedAppModal, status: 'SHORTLISTED' });
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                    >
                      Shortlist Team
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedAppModal.id, 'ACCEPTED');
                        setSelectedAppModal({ ...selectedAppModal, status: 'ACCEPTED' });
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      Accept Application
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 5: JUDGING & EVALUATION ── */}
        {activeTab === 'JUDGING' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Scoring Form */}
            <div className="lg:col-span-1 rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Record Evaluation Score
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Scores are strictly calculated using configured criteria out of 100. Never randomly assigned.
                </p>
              </div>

              {judgingSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                  {judgingSuccess}
                </div>
              )}

              <form onSubmit={handleSaveJudging} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Select Participant / Team</label>
                  <select
                    value={judgingAppId}
                    onChange={(e) => setJudgingAppId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white focus:outline-none"
                  >
                    <option value="">Select applicant team...</option>
                    {compApplications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.teamName || app.applicantName} ({app.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#1e293b]">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Technical Implementation (25)</span>
                      <strong className="text-indigo-400">{scoreTechnical}/25</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={scoreTechnical}
                      onChange={(e) => setScoreTechnical(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Innovation & Uniqueness (25)</span>
                      <strong className="text-indigo-400">{scoreInnovation}/25</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={scoreInnovation}
                      onChange={(e) => setScoreInnovation(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Design & UI/UX (25)</span>
                      <strong className="text-indigo-400">{scoreDesign}/25</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={scoreDesign}
                      onChange={(e) => setScoreDesign(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Presentation & Pitch (25)</span>
                      <strong className="text-indigo-400">{scorePresentation}/25</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      value={scorePresentation}
                      onChange={(e) => setScorePresentation(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0c101d] border border-[#1e293b] flex items-center justify-between">
                  <span className="font-bold text-slate-300">Total Calculated Score</span>
                  <span className="text-lg font-black text-amber-400">
                    {Number(scoreTechnical) + Number(scoreInnovation) + Number(scoreDesign) + Number(scorePresentation)} / 100
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Judge Comments</label>
                  <input
                    type="text"
                    value={judgeComments}
                    onChange={(e) => setJudgeComments(e.target.value)}
                    placeholder="e.g. Robust architecture and clean interface"
                    className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!judgingAppId}
                  className="w-full py-2.5 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] disabled:opacity-50 text-white font-bold transition-colors"
                >
                  Record Evaluation Score
                </button>
              </form>
            </div>

            {/* Judging Scores Table */}
            <div className="lg:col-span-2 rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-400" />
                Recorded Judging Results
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c101d] text-slate-400 uppercase text-[10px] border-b border-[#1e293b]">
                    <tr>
                      <th className="p-3">Team / Project</th>
                      <th className="p-3">Judge</th>
                      <th className="p-3">Tech</th>
                      <th className="p-3">Innov</th>
                      <th className="p-3">Design</th>
                      <th className="p-3">Pres</th>
                      <th className="p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b] text-slate-300">
                    {judgingScores.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500">
                          No judging scores recorded yet. Select an applicant team on the left.
                        </td>
                      </tr>
                    ) : (
                      judgingScores.map((sc) => (
                        <tr key={sc.id} className="hover:bg-slate-800/20">
                          <td className="p-3 font-bold text-white">{sc.teamName}</td>
                          <td className="p-3 text-slate-400">{sc.judgeName}</td>
                          <td className="p-3">{sc.technicalScore}</td>
                          <td className="p-3">{sc.innovationScore}</td>
                          <td className="p-3">{sc.designScore}</td>
                          <td className="p-3">{sc.presentationScore}</td>
                          <td className="p-3 font-bold text-amber-400">{sc.totalScore}/100</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: DECLARE PODIUM & WINNERS ── */}
        {activeTab === 'PODIUM' && (
          <div className="max-w-3xl space-y-5">
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    Declare Podium & Winners
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select confirmed participants from this event to award 1st, 2nd, and 3rd place. Results can be saved as private draft or submitted to General Secretary (Nishant Singh) for verification.
                  </p>
                </div>
                {activePodiumComp?.resultsStatus && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 self-start ${
                      activePodiumComp.resultsStatus === 'PUBLISHED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : activePodiumComp.resultsStatus === 'PENDING_VERIFICATION'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : activePodiumComp.resultsStatus === 'RESULTS_DRAFT'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}
                  >
                    Status: {activePodiumComp.resultsStatus.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {podiumError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{podiumError}</span>
                </div>
              )}

              {podiumSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{podiumSuccess}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Event Belonging to {myClub.name}
                  </label>
                  <select
                    value={podiumCompId}
                    onChange={(e) => {
                      setPodiumCompId(e.target.value);
                      setFirstAppId('');
                      setSecondAppId('');
                      setThirdAppId('');
                      setSpecialAwardAppId('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    {clubCompetitions.length === 0 ? (
                      <option value="">No events created for this club yet</option>
                    ) : (
                      clubCompetitions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.status})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {compEligibleApps.length === 0 ? (
                  <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
                    <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                    <p className="text-xs text-amber-200 font-semibold">
                      No confirmed participants found for this event.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Go to the <strong>Applicants</strong> tab to review and accept/confirm student registrations before declaring winners.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-[11px] text-slate-400">
                      Showing <strong>{compEligibleApps.length}</strong> confirmed participant(s) eligible for podium placement:
                    </p>

                    {/* 1st Place */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                      <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Crown className="w-4 h-4" /> 1st Place Winner (Gold Trophy)
                      </label>
                      <select
                        value={firstAppId}
                        onChange={(e) => setFirstAppId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="">Select 1st Place Winner...</option>
                        {compEligibleApps.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.teamName ? `${a.teamName} (Lead: ${a.applicantName} - ${a.applicantRollNo})` : `${a.applicantName} (${a.applicantRollNo})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 2nd Place */}
                    <div className="p-4 rounded-xl bg-slate-400/10 border border-slate-400/30 space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-slate-400" /> 2nd Place Runner-Up (Silver Medal)
                      </label>
                      <select
                        value={secondAppId}
                        onChange={(e) => setSecondAppId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-slate-400"
                      >
                        <option value="">Select 2nd Place Runner-Up...</option>
                        {compEligibleApps.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.teamName ? `${a.teamName} (Lead: ${a.applicantName} - ${a.applicantRollNo})` : `${a.applicantName} (${a.applicantRollNo})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 3rd Place */}
                    <div className="p-4 rounded-xl bg-amber-700/10 border border-amber-700/30 space-y-1.5">
                      <label className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-600" /> 3rd Place Runner-Up (Bronze Medal)
                      </label>
                      <select
                        value={thirdAppId}
                        onChange={(e) => setThirdAppId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-amber-700"
                      >
                        <option value="">Select 3rd Place Runner-Up...</option>
                        {compEligibleApps.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.teamName ? `${a.teamName} (Lead: ${a.applicantName} - ${a.applicantRollNo})` : `${a.applicantName} (${a.applicantRollNo})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Special Award */}
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                      <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-purple-400" /> Special Category Award (Optional)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={specialAwardTitle}
                          onChange={(e) => setSpecialAwardTitle(e.target.value)}
                          placeholder="e.g. Best UI/UX Design or Most Innovative"
                          className="px-3 py-2 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                        />
                        <select
                          value={specialAwardAppId}
                          onChange={(e) => setSpecialAwardAppId(e.target.value)}
                          className="px-3 py-2 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                        >
                          <option value="">None / Select recipient...</option>
                          {compEligibleApps.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.teamName ? `${a.teamName} (${a.applicantName})` : a.applicantName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Judging / Evaluation details */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Judging & Evaluation Details (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={judgingEvaluationNotes}
                        onChange={(e) => setJudgingEvaluationNotes(e.target.value)}
                        placeholder="Evaluation summary, scores, or panel remarks for verification..."
                        className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[#1e293b]">
                      <button
                        type="button"
                        onClick={() => handleSavePodium(true)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <FileCheck2 className="w-4 h-4 text-slate-400" />
                        Save Results as Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSavePodium(false)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Submit Results for Verification
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 7: CERTIFICATES ── */}
        {activeTab === 'CERTIFICATES' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Certificate Management System
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Allocate Gold, Silver, Bronze, and Participation certificates to confirmed participants. Certificates route to General Secretary (Nishant Singh) for digital signature.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllocateModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors shadow-lg shadow-purple-900/30 flex items-center gap-2 shrink-0 self-start"
              >
                <Plus className="w-4 h-4" />
                + Allocate Certificates
              </button>
            </div>

            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c101d] text-slate-400 uppercase text-[10px] border-b border-[#1e293b]">
                    <tr>
                      <th className="p-3.5">Certificate ID</th>
                      <th className="p-3.5">Recipient</th>
                      <th className="p-3.5">Competition</th>
                      <th className="p-3.5">Distinction</th>
                      <th className="p-3.5">Club Secretary</th>
                      <th className="p-3.5">General Secretary</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b] text-slate-300">
                    {clubCerts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500 space-y-2">
                          <Award className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="text-sm font-medium text-slate-400">No certificates allocated yet.</p>
                          <p className="text-xs text-slate-500">
                            Click <strong className="text-purple-400">+ Allocate Certificates</strong> above to generate certificates for your event participants and winners.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      clubCerts.map((cert) => (
                        <tr key={cert.id} className="hover:bg-slate-800/20">
                          <td className="p-3.5 font-mono text-purple-400 font-semibold">{cert.certificateNumber}</td>
                          <td className="p-3.5">
                            <div className="font-bold text-white">{cert.recipientName}</div>
                            {cert.recipientRollNo && (
                              <div className="text-[10px] text-slate-400">{cert.recipientRollNo}</div>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-300 max-w-[160px] truncate">{cert.competitionTitle}</td>
                          <td className="p-3.5 font-medium">{cert.title}</td>
                          <td className="p-3.5 text-[11px] text-slate-300">
                            <span className="text-emerald-400 font-semibold">✓ {cert.clubSecretaryName || myClub.clubSecretaryName || currentUser.fullName}</span>
                          </td>
                          <td className="p-3.5 text-[11px]">
                            {cert.status === 'ISSUED' ? (
                              <span className="text-emerald-400 font-semibold">✓ Nishant Singh</span>
                            ) : (
                              <span className="text-amber-400">Pending Nishant Singh</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                cert.status === 'ISSUED'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {cert.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setPreviewingCertificate(cert)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Preview
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 8: APPOINT JOINT SECRETARY ── */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Appointment Form */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                  Appoint Joint Secretary
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Appoint a verified 2nd-year student as Joint Secretary for {myClub.name}. Granted notice publishing powers.
                </p>
              </div>

              {appointError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {appointError}
                </div>
              )}
              {appointSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                  {appointSuccess}
                </div>
              )}

              <form onSubmit={handleAppointJS} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Verified Student</label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                  >
                    {allProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.aitRollNo} - {p.branch})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={jsStartDate}
                      onChange={(e) => setJsStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={jsEndDate}
                      onChange={(e) => setJsEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0c101d] border border-[#1e293b] text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors shadow-lg shadow-purple-900/30"
                >
                  Confirm Joint Secretary Appointment
                </button>
              </form>
            </div>

            {/* Active Appointments List */}
            <div className="rounded-2xl bg-[#111728] border border-[#1e293b] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Active Joint Secretary Appointments</h3>

              <div className="space-y-3">
                {clubAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-[#0c101d] border border-[#1e293b] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{app.targetStudentName}</p>
                      <p className="text-[10px] text-slate-400">Roll: {app.targetStudentRollNo} • {app.clubName}</p>
                      <p className="text-[9px] text-slate-500 mt-1">Tenure: {app.startDate} – {app.endDate || 'Present'}</p>
                    </div>

                    <button
                      onClick={() => revokeAppointment(app.id)}
                      className="text-slate-500 hover:text-rose-400 text-xs transition-colors p-2"
                      title="Revoke Appointment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CREATE COMPETITION / HACKATHON MODAL (Requirement 1) ── */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl bg-[#0c101d] border border-[#1e293b] p-6 space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-400" />
                    Create Competition / Hackathon
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure your event. Save as private draft or publish directly to student dashboards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {createError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}
              {createSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{createSuccess}</span>
                </div>
              )}

              <div className="space-y-4 text-xs">
                {/* 1. Organizing Club (Automatically locked to Secretary's assigned club) */}
                <div className="p-3 rounded-xl bg-[#111728] border border-[#1e293b] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Organizing Club</span>
                    <span className="text-sm font-bold text-white">{myClub.name}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Auto-Assigned Organizer
                  </span>
                </div>

                {/* 2. Event Name & Event Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-300 mb-1">
                      Event Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Graphica 2026 Innovation Hackathon"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Event Type <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={newEventType}
                      onChange={(e) => setNewEventType(e.target.value as 'COMPETITION' | 'HACKATHON')}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="HACKATHON">Hackathon</option>
                      <option value="COMPETITION">Competition</option>
                    </select>
                  </div>
                </div>

                {/* 3. Category & Prize Pool */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Domain / Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="DESIGN">Design & Innovation</option>
                      <option value="HACKATHON">General Hackathon</option>
                      <option value="CODING">Competitive Coding</option>
                      <option value="ROBOTICS">Robotics & Hardware</option>
                      <option value="AI_ML">AI & Machine Learning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Prize Pool / Awards</label>
                    <input
                      type="text"
                      value={newPrizePool}
                      onChange={(e) => setNewPrizePool(e.target.value)}
                      placeholder="e.g. ₹50,000 + Trophies"
                      className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* 4. Event Description */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Event Description <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Provide full problem statements, tracks, judging criteria, and schedule..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* 5. Participation Type & Team Sizes */}
                <div className="p-3 rounded-xl bg-[#111728] border border-[#1e293b] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-300">Participation Format</label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                        <input
                          type="radio"
                          name="participationType"
                          value="INDIVIDUAL"
                          checked={newParticipationType === 'INDIVIDUAL'}
                          onChange={() => setNewParticipationType('INDIVIDUAL')}
                          className="accent-purple-500"
                        />
                        <span>Individual (Solo)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                        <input
                          type="radio"
                          name="participationType"
                          value="TEAM"
                          checked={newParticipationType === 'TEAM'}
                          onChange={() => setNewParticipationType('TEAM')}
                          className="accent-purple-500"
                        />
                        <span>Team Participation</span>
                      </label>
                    </div>
                  </div>

                  {newParticipationType === 'TEAM' && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1e293b]/60">
                      <div>
                        <label className="block text-slate-400 mb-1">Minimum Team Size</label>
                        <input
                          type="number"
                          min={1}
                          max={6}
                          value={newMinTeam}
                          onChange={(e) => setNewMinTeam(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Maximum Team Size</label>
                        <input
                          type="number"
                          min={1}
                          max={6}
                          value={newMaxTeam}
                          onChange={(e) => setNewMaxTeam(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Registration Dates & Event Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2 p-3 rounded-xl bg-[#111728] border border-[#1e293b]">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">Registration Timeline</span>
                    <div>
                      <label className="block text-slate-400 mb-1">Registration Opening Date</label>
                      <input
                        type="date"
                        value={newRegOpenDate}
                        onChange={(e) => setNewRegOpenDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Registration Deadline</label>
                      <input
                        type="date"
                        value={newRegCloseDate}
                        onChange={(e) => setNewRegCloseDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-3 rounded-xl bg-[#111728] border border-[#1e293b]">
                    <span className="text-[10px] uppercase font-bold text-sky-400 block">Event Schedule</span>
                    <div>
                      <label className="block text-slate-400 mb-1">Event Start Date</label>
                      <input
                        type="date"
                        value={newStartDate}
                        onChange={(e) => setNewStartDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Event End Date</label>
                      <input
                        type="date"
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0c101d] border border-[#1e293b] text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 7. Eligibility Criteria & Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Eligibility Criteria</label>
                    <textarea
                      rows={2}
                      value={newEligibility}
                      onChange={(e) => setNewEligibility(e.target.value)}
                      placeholder="e.g. Open to all engineering students of AIT Pune (All Years & Branches)"
                      className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Rules and Instructions</label>
                    <textarea
                      rows={2}
                      value={newRules}
                      onChange={(e) => setNewRules(e.target.value)}
                      placeholder="e.g. Original code only, Plagiarism leads to disqualification, Follow code of conduct"
                      className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 8. Official Website / Registration Link */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Official Event Website or External Registration Link
                  </label>
                  <input
                    type="url"
                    value={newOfficialUrl}
                    onChange={(e) => setNewOfficialUrl(e.target.value)}
                    placeholder="https://graphica2026.aitpune.edu.in or https://unstop.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    When provided, students can view and visit the official external event portal directly from the event details.
                  </p>
                </div>

                {/* 9. Registration Form Configuration */}
                <div className="p-3 rounded-xl bg-[#111728] border border-[#1e293b] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">CompetiHub Application Form</span>
                    <span className="text-[11px] text-slate-400">
                      Enable in-platform application submission with student profile verification & team details
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newEnableForm}
                      onChange={(e) => setNewEnableForm(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* 10. Actions: Save Draft, Preview, Publish Event, Cancel */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#111728] hover:bg-[#1e293b] text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenPreview}
                      className="px-3.5 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-slate-200 font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4 text-slate-400" />
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEvent(true)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEvent(false)}
                      className="px-4 py-2 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white font-bold transition-colors shadow-lg shadow-purple-900/30 flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      Publish Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PREVIEW EVENT MODAL ── */}
        {previewEventData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl bg-[#0c101d] border border-[#1e293b] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    PREVIEW MODE
                  </span>
                  <h4 className="text-sm font-bold text-white">Student View Preview</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewEventData(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#111728] border border-[#1e293b] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                      {previewEventData.eventType} • {previewEventData.category}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Organized by: <strong className="text-white">{previewEventData.clubName}</strong>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{previewEventData.title}</h3>
                  <p className="text-slate-300 whitespace-pre-wrap">{previewEventData.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-lg bg-[#111728] border border-[#1e293b]">
                    <span className="text-[10px] text-slate-400 block">Format</span>
                    <span className="font-bold text-white">
                      {previewEventData.participationType === 'INDIVIDUAL' ? 'Solo' : `Team (${previewEventData.minTeamSize}-${previewEventData.maxTeamSize})`}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#111728] border border-[#1e293b]">
                    <span className="text-[10px] text-slate-400 block">Registration Deadline</span>
                    <span className="font-bold text-white">{previewEventData.registrationCloseDate || 'Open'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#111728] border border-[#1e293b]">
                    <span className="text-[10px] text-slate-400 block">Event Date</span>
                    <span className="font-bold text-white">{previewEventData.startDate}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#111728] border border-[#1e293b]">
                    <span className="text-[10px] text-slate-400 block">Prize Pool</span>
                    <span className="font-bold text-amber-400">{previewEventData.prizePool || 'Certificates'}</span>
                  </div>
                </div>

                {previewEventData.officialUrl && (
                  <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
                    <span className="text-indigo-300 font-semibold">Official Event Link:</span>
                    <a
                      href={previewEventData.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline hover:text-indigo-400 flex items-center gap-1"
                    >
                      {previewEventData.officialUrl}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => setPreviewEventData(null)}
                    className="px-4 py-2 rounded-xl bg-[#111728] text-slate-300 hover:text-white"
                  >
                    Back to Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewEventData(null);
                      handleSaveEvent(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    Publish Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ALLOCATE CERTIFICATES MODAL (Requirement 4) ── */}
        {showAllocateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-2xl bg-[#0c101d] border border-[#1e293b] p-6 space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Allocate Certificates for {myClub.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select event and eligible recipients. Certificates are routed to General Secretary (Nishant Singh) for digital signature.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {allocError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{allocError}</span>
                </div>
              )}
              {allocSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{allocSuccess}</span>
                </div>
              )}

              <div className="space-y-4 text-xs">
                {/* 1. Select Competition */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Select Event
                  </label>
                  <select
                    value={allocCompId}
                    onChange={(e) => {
                      setAllocCompId(e.target.value);
                      setSelectedAllocRecipients([]);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none focus:border-purple-500"
                  >
                    {clubCompetitions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Eligibility Rules Banner */}
                <div className="p-3.5 rounded-xl bg-[#111728] border border-[#1e293b] space-y-1.5 text-slate-300 text-[11px]">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> CompetiHub Certificate Categories & Rules
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                    <li><strong className="text-amber-400">First Place — Gold:</strong> Awarded to confirmed 1st place winners.</li>
                    <li><strong className="text-slate-300">Second Place — Silver:</strong> Awarded to confirmed 2nd place winners.</li>
                    <li><strong className="text-amber-600">Third Place — Bronze:</strong> Awarded to confirmed 3rd place winners.</li>
                    <li><strong className="text-indigo-300">Certificate of Participation:</strong> Awarded to confirmed participants who did not win.</li>
                    <li className="text-slate-400">All student names, dates, and club metadata are populated automatically from verified records. Duplicate certificates are blocked.</li>
                  </ul>
                </div>

                {/* 3. Eligible Recipients Table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">Eligible Event Participants & Winners</span>
                    <button
                      type="button"
                      onClick={() => {
                        const allKeys: string[] = [];
                        allocCompResults.forEach((r) =>
                          r.members.forEach((m) => allKeys.push(`${r.id}-${m.studentId}`))
                        );
                        allocCompApps.forEach((a) => {
                          if (!allKeys.some((k) => k.includes(a.applicantId))) {
                            allKeys.push(a.id);
                          }
                        });
                        setSelectedAllocRecipients(allKeys);
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                    >
                      Select All
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto rounded-xl border border-[#1e293b] bg-[#0c101d] divide-y divide-[#1e293b]">
                    {allocCompResults.length === 0 && allocCompApps.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">
                        No confirmed participants or verified results for this event yet.
                      </div>
                    ) : (
                      <>
                        {/* Verified Winners */}
                        {allocCompResults.map((res) =>
                          res.members.map((mem) => {
                            const key = `${res.id}-${mem.studentId}`;
                            const isSelected = selectedAllocRecipients.includes(key);
                            const currentCat =
                              recipientCategories[key] ||
                              (res.rankPosition === 1
                                ? 'FIRST_PLACE'
                                : res.rankPosition === 2
                                ? 'SECOND_PLACE'
                                : 'THIRD_PLACE');

                            return (
                              <div
                                key={key}
                                className={`p-3 flex items-center justify-between gap-3 ${
                                  isSelected ? 'bg-purple-950/20' : 'hover:bg-slate-800/20'
                                }`}
                              >
                                <label className="flex items-center gap-3 cursor-pointer flex-1">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedAllocRecipients([...selectedAllocRecipients, key]);
                                      } else {
                                        setSelectedAllocRecipients(selectedAllocRecipients.filter((k) => k !== key));
                                      }
                                    }}
                                    className="accent-purple-500 rounded"
                                  />
                                  <div>
                                    <div className="font-bold text-white flex items-center gap-1.5">
                                      {mem.name}
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        Rank #{res.rankPosition} ({res.awardTitle})
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                      Roll: {mem.aitRollNo} • Team: {res.teamName}
                                    </div>
                                  </div>
                                </label>

                                <select
                                  value={currentCat}
                                  onChange={(e) =>
                                    setRecipientCategories({
                                      ...recipientCategories,
                                      [key]: e.target.value as any,
                                    })
                                  }
                                  className="px-2.5 py-1.5 rounded-lg bg-[#111728] border border-[#1e293b] text-white text-[11px] focus:outline-none"
                                >
                                  <option value="FIRST_PLACE">First Place — Gold</option>
                                  <option value="SECOND_PLACE">Second Place — Silver</option>
                                  <option value="THIRD_PLACE">Third Place — Bronze</option>
                                  <option value="PARTICIPATION">Certificate of Participation</option>
                                </select>
                              </div>
                            );
                          })
                        )}

                        {/* Confirmed Participants (Non-winners) */}
                        {allocCompApps.map((app) => {
                          const isWinner = allocCompResults.some((r) =>
                            r.members.some((m) => m.studentId === app.applicantId)
                          );
                          if (isWinner) return null;

                          const key = app.id;
                          const isSelected = selectedAllocRecipients.includes(key);
                          const currentCat = recipientCategories[key] || 'PARTICIPATION';

                          return (
                            <div
                              key={key}
                              className={`p-3 flex items-center justify-between gap-3 ${
                                isSelected ? 'bg-purple-950/20' : 'hover:bg-slate-800/20'
                              }`}
                            >
                              <label className="flex items-center gap-3 cursor-pointer flex-1">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedAllocRecipients([...selectedAllocRecipients, key]);
                                    } else {
                                      setSelectedAllocRecipients(selectedAllocRecipients.filter((k) => k !== key));
                                    }
                                  }}
                                  className="accent-purple-500 rounded"
                                />
                                <div>
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    {app.applicantName}
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300">
                                      Confirmed Participant
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    Roll: {app.applicantRollNo} • {app.applicantBranch} • {app.teamName || 'Solo'}
                                  </div>
                                </div>
                              </label>

                              <select
                                value={currentCat}
                                onChange={(e) =>
                                  setRecipientCategories({
                                    ...recipientCategories,
                                    [key]: e.target.value as any,
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-[#111728] border border-[#1e293b] text-white text-[11px] focus:outline-none"
                              >
                                <option value="PARTICIPATION">Certificate of Participation</option>
                                <option value="FIRST_PLACE">First Place — Gold</option>
                                <option value="SECOND_PLACE">Second Place — Silver</option>
                                <option value="THIRD_PLACE">Third Place — Bronze</option>
                              </select>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>

                {/* 4. Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]">
                  <span className="text-slate-400 text-xs">
                    Selected recipients: <strong>{selectedAllocRecipients.length}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAllocateModal(false)}
                      className="px-4 py-2 rounded-xl bg-[#111728] text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteAllocation}
                      disabled={selectedAllocRecipients.length === 0}
                      className="px-4 py-2 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-purple-900/30"
                    >
                      <Award className="w-4 h-4" />
                      Allocate & Route to General Secretary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CERTIFICATE PREVIEW MODAL (Requirement 5 & 6) ── */}
        {previewingCertificate && (
          <CertificateModal
            certificate={previewingCertificate}
            onClose={() => setPreviewingCertificate(null)}
          />
        )}

        {/* ── EDIT HACKATHON MODAL ── */}
        {editingComp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-[#0c101d] border border-[#1e293b] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
                <h4 className="text-base font-bold text-white">Edit Competition Details</h4>
                <button
                  onClick={() => setEditingComp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                  {editSuccess}
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Prize Pool</label>
                    <input
                      type="text"
                      value={editPrize}
                      onChange={(e) => setEditPrize(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Min Team</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={editMinTeam}
                      onChange={(e) => setEditMinTeam(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Max Team</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={editMaxTeam}
                      onChange={(e) => setEditMaxTeam(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Registration Deadline</label>
                  <input
                    type="date"
                    value={editCloseDate}
                    onChange={(e) => setEditCloseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => setEditingComp(null)}
                    className="px-3.5 py-2 rounded-xl bg-[#111728] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
