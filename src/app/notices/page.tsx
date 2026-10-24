'use client';

import React, { useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { useAppStore } from '@/lib/store';
import {
  ScrollText,
  Plus,
  AlertCircle,
  Pin,
  Calendar,
  FileText,
  User,
  ShieldAlert,
  Sparkles,
  Paperclip,
  CheckCircle2,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react';

export default function NoticesPage() {
  const { currentUser, notices, publishNotice, withdrawNotice } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'GENERAL' | 'HACKATHON' | 'CLUB' | 'RESULTS' | 'URGENT' | 'SCHEDULE'>('HACKATHON');
  const [isPriority, setIsPriority] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const canPublishNotice = [
    'JOINT_SECRETARY',
    'CLUB_SECRETARY',
    'GENERAL_SECRETARY',
    'DIRECTOR',
    'ADMINISTRATOR',
    'PRINCIPAL',
    'COMPETITION_ORGANISER',
  ].includes(currentUser.role);

  const canPublishPriority = ['GENERAL_SECRETARY', 'DIRECTOR', 'ADMINISTRATOR', 'PRINCIPAL'].includes(currentUser.role);

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!title.trim() || !content.trim()) {
      setFormError('Please enter both title and notice content.');
      return;
    }

    const res = publishNotice({
      title: title.trim(),
      content: content.trim(),
      category,
      priority: isPriority && canPublishPriority ? 'HIGH' : 'NORMAL',
      isPriorityNotice: isPriority && canPublishPriority,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorDesignation: currentUser.role,
      clubId: currentUser.assignedClubId,
      clubName: currentUser.assignedClubName,
      expiryDate: expiryDate || undefined,
      attachmentName: attachmentName.trim() || undefined,
      status,
    });

    if (res.success) {
      setFormSuccess('Notice successfully published to the platform!');
      setTitle('');
      setContent('');
      setAttachmentName('');
      setExpiryDate('');
      setIsPriority(false);
      setTimeout(() => {
        setShowCreateModal(false);
        setFormSuccess('');
      }, 700);
    } else {
      setFormError(res.error || 'Failed to publish notice.');
    }
  };

  const priorityNotices = notices.filter(
    (n) => n.isPriorityNotice && n.status === 'PUBLISHED'
  );

  const regularNotices = notices.filter(
    (n) =>
      !n.isPriorityNotice &&
      (selectedCategory === 'ALL' || n.category === selectedCategory) &&
      (n.status === 'PUBLISHED' || n.authorId === currentUser.id)
  );

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0c101d] border border-[#1a2236]">
          <div>
            <div className="flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-purple-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">
                Notices & Institutional Bulletins
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Official notifications broadcasted by Joint Secretaries, Club Secretaries, General Secretary, and the Directorate.
            </p>
          </div>

          {canPublishNotice && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors shadow-lg shadow-purple-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Draft New Notice</span>
            </button>
          )}
        </div>

        {/* ── Priority Notices Section (Prominent, High-Priority) ── */}
        {priorityNotices.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Priority Institutional Directives</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {priorityNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-2xl bg-gradient-to-r from-rose-950/30 via-[#111728] to-purple-950/20 border border-rose-500/40 p-5 space-y-3 shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                        <Pin className="w-3 h-3 text-rose-400" />
                        HIGH PRIORITY
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Published by {notice.authorName} ({notice.authorDesignation.replace('_', ' ')})
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500">
                      {new Date(notice.publishedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {notice.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]/60 text-[11px] text-slate-400">
                    <div className="flex items-center gap-3">
                      {notice.attachmentName && (
                        <div className="flex items-center gap-1.5 text-sky-400 font-medium">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>Attachment: {notice.attachmentName}</span>
                        </div>
                      )}
                      {notice.expiryDate && (
                        <span>Valid until: {new Date(notice.expiryDate).toLocaleDateString()}</span>
                      )}
                    </div>

                    {(notice.authorId === currentUser.id || currentUser.role === 'DIRECTOR') && (
                      <button
                        onClick={() => withdrawNotice(notice.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Withdraw
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Category Filters ── */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          {['ALL', 'HACKATHON', 'CLUB', 'RESULTS', 'GENERAL', 'URGENT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#5b50f6] text-white shadow-sm'
                  : 'bg-[#111728] text-slate-400 hover:text-white border border-[#1e293b]'
              }`}
            >
              {cat === 'ALL' ? 'All Notices' : cat}
            </button>
          ))}
        </div>

        {/* ── Standard Notices Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regularNotices.length === 0 ? (
            <div className="col-span-2 text-center py-12 rounded-2xl bg-[#0c101d] border border-[#1a2236] text-slate-500 text-xs">
              No active notices found in this category.
            </div>
          ) : (
            regularNotices.map((notice) => (
              <div
                key={notice.id}
                className="rounded-2xl bg-[#111728] border border-[#1e293b] p-5 flex flex-col justify-between space-y-3 hover:border-purple-500/30 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0c101d] border border-[#1e293b] text-purple-300">
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(notice.publishedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{notice.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line line-clamp-4">
                    {notice.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1e293b]/70 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-300 font-medium">{notice.authorName}</span>
                    <span className="text-[10px] text-slate-500">({notice.authorDesignation.replace('_', ' ')})</span>
                  </div>

                  {(notice.authorId === currentUser.id || currentUser.role === 'DIRECTOR') && (
                    <button
                      onClick={() => withdrawNotice(notice.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 text-[10px]"
                    >
                      <Trash2 className="w-3 h-3" /> Withdraw
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ── Notice Creation Modal (Joint Secretary, Club Secretary, General Secretary, Director) ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#0c101d] border border-[#1e293b] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <h3 className="text-sm font-bold text-white">Create Official Notice</h3>
                <p className="text-[11px] text-slate-400">
                  Author: {currentUser.fullName} ({currentUser.role.replace('_', ' ')})
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handlePublishSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Graphica 2026 Submission Deadline Extension"
                  className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="HACKATHON">Hackathon</option>
                    <option value="CLUB">Club Activity</option>
                    <option value="RESULTS">Results & Podium</option>
                    <option value="SCHEDULE">Schedule Change</option>
                    <option value="GENERAL">General Notice</option>
                    <option value="URGENT">Urgent Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detailed notice description and instructions for students..."
                  className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Attachment File Name (Optional)</label>
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  placeholder="e.g. Schedule_V2.pdf or Guidelines.pdf"
                  className="w-full px-3 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {canPublishPriority && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
                  <input
                    type="checkbox"
                    id="priorityCheck"
                    checked={isPriority}
                    onChange={(e) => setIsPriority(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 bg-[#111728] border-[#1e293b]"
                  />
                  <label htmlFor="priorityCheck" className="text-xs font-semibold text-rose-300">
                    Broadcast as High-Priority Notice across all platform dashboards
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#111728] border border-[#1e293b] text-slate-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => setStatus('DRAFT')}
                  className="px-4 py-2 rounded-xl bg-[#111728] border border-purple-500/40 text-purple-300 hover:bg-purple-950/30 text-xs font-semibold"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  onClick={() => setStatus('PUBLISHED')}
                  className="px-4 py-2 rounded-xl bg-[#5b50f6] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md shadow-purple-900/30"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
