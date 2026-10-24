'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { 
  FolderGit2, 
  Search, 
  Heart, 
  Bookmark, 
  ExternalLink, 
  Plus, 
  Code2, 
  Sparkles,
  Users
} from 'lucide-react';

export default function ProjectsPage() {
  const { 
    projects, 
    currentUser, 
    teams, 
    competitions, 
    toggleLikeProject, 
    toggleSaveProject, 
    savedProjectIds, 
    createProject 
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('ALL');
  const [showPublishModal, setShowPublishModal] = useState(false);

  // New Project Form state
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [technologiesStr, setTechnologiesStr] = useState('Next.js, PyTorch, Tailwind CSS');
  const [teamId, setTeamId] = useState(teams[0]?.id || '');
  const [competitionId, setCompetitionId] = useState(competitions[0]?.id || '');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [challengesLessons, setChallengesLessons] = useState('');
  const [futureScope, setFutureScope] = useState('');

  // Extract all unique technologies
  const allTechs = ['ALL', ...Array.from(new Set(projects.flatMap(p => p.technologies)))];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.problemStatement.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech = selectedTech === 'ALL' || p.technologies.includes(selectedTech);
    return matchesSearch && matchesTech;
  });

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDescription.trim() || !problemStatement.trim() || !proposedSolution.trim()) {
      alert('Please complete the mandatory project problem statement and solution fields.');
      return;
    }

    const selectedComp = competitions.find(c => c.id === competitionId);
    const selectedTeam = teams.find(t => t.id === teamId);

    const techArray = technologiesStr.split(',').map(s => s.trim()).filter(Boolean);

    createProject({
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      shortDescription: shortDescription.trim(),
      problemStatement: problemStatement.trim(),
      proposedSolution: proposedSolution.trim(),
      technologies: techArray,
      competitionId,
      competitionTitle: selectedComp?.title,
      teamId,
      teamName: selectedTeam?.name,
      demoUrl: demoUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      challengesLessons: challengesLessons.trim() || undefined,
      futureScope: futureScope.trim() || undefined,
      visibility: 'PUBLIC',
      contributors: [
        {
          studentId: currentUser.id,
          studentName: currentUser.fullName,
          contribution: 'Lead Architect & Implementation'
        }
      ]
    });

    // Reset & close
    setTitle('');
    setShortDescription('');
    setProblemStatement('');
    setProposedSolution('');
    setShowPublishModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Code2 className="w-4 h-4" />
                <span>Open Innovation Repository</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Student Projects & Solutions
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Explore real-world engineering solutions, hardware architectures, and AI models built by AIT Pune students.
              </p>
            </div>

            <button
              onClick={() => setShowPublishModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Your Project</span>
            </button>
          </div>

          {/* Search & Tech Filter */}
          <div className="p-4 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, technology, or problem statement..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#121A2B] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Tech filter badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs text-slate-500 mr-1 shrink-0">Technology:</span>
              {allTechs.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    selectedTech === tech
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length === 0 ? (
              <div className="col-span-3 text-center py-16 text-slate-400 text-sm">
                No projects have been published yet.
              </div>
            ) : (
              filteredProjects.map((p) => {
              const isSaved = savedProjectIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  className="group rounded-2xl bg-[#121A2B] border border-slate-800 hover:border-sky-500/40 transition-all overflow-hidden flex flex-col shadow-lg"
                >
                  <div className="h-44 w-full bg-slate-900 overflow-hidden relative">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121A2B] via-transparent to-black/30" />
                    
                    {/* Action buttons (Like & Save) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLikeProject(p.id);
                        }}
                        className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                          p.isLikedByUser ? 'bg-rose-500/80 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-rose-400'
                        }`}
                        title="Like this innovation"
                      >
                        <Heart className="w-3.5 h-3.5" fill={p.isLikedByUser ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSaveProject(p.id);
                        }}
                        className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                          isSaved ? 'bg-purple-600/90 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-purple-300'
                        }`}
                        title="Save to portfolio"
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                      <span className="font-semibold text-sky-300 truncate">{p.teamName}</span>
                      <span className="text-[11px] bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
                        ❤️ {p.likesCount}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {p.shortDescription}
                      </p>
                    </div>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {p.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-purple-300 border border-slate-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/projects/${p.slug}`}
                      className="w-full text-center py-2.5 rounded-xl bg-slate-800/80 hover:bg-sky-600 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                    >
                      View Architecture, Demo & Code
                    </Link>
                  </div>
                </div>
              );
            }))}
          </div>

        </main>
      </div>

      {/* Publish Project Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D1220] border border-slate-700 p-6 rounded-2xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto my-8">
            <h3 className="text-base font-bold text-white">Publish Student Project</h3>
            <p className="text-xs text-slate-400">
              Contribute your technical solution to the institutional project gallery.
            </p>

            <form onSubmit={handlePublishSubmit} className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AeroSurveil: LoRa Edge UAV"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One sentence summary of the project"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Statement</label>
                <textarea
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="What critical challenge or limitation does this project solve?"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proposed Solution</label>
                <textarea
                  value={proposedSolution}
                  onChange={(e) => setProposedSolution(e.target.value)}
                  placeholder="Describe your architecture, algorithmic approach, and implementation."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies (Comma separated)</label>
                <input
                  type="text"
                  value={technologiesStr}
                  onChange={(e) => setTechnologiesStr(e.target.value)}
                  placeholder="e.g. PyTorch, YOLOv8, Next.js, C++, ESP32"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Team Affiliation</label>
                  <select
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Competition Association</label>
                  <select
                    value={competitionId}
                    onChange={(e) => setCompetitionId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {competitions.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Demonstration Link (URL)</label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub / Repository (URL)</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md"
                >
                  Publish to Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
