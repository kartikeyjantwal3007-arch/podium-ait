'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { useAppStore } from '@/lib/store';
import { 
  Globe2, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Sparkles, 
  Send, 
  Users, 
  Flame, 
  Award,
  Hash
} from 'lucide-react';

export default function CommunityPage() {
  const { currentUser } = useAppStore();

  const [posts, setPosts] = useState([
    {
      id: 'post-1',
      author: 'Aryan Sharma',
      authorRole: 'Team Nova • Comp Engg',
      authorAvatar: 'AS',
      time: '2 hours ago',
      content: 'Any teams looking for an edge AI / computer vision developer for the upcoming RoboGenesis drone challenge? Our team has open slots for firmware integration.',
      tags: ['RoboGenesis', 'EdgeAI', 'TeamRecruitment'],
      likes: 18,
      replies: 4,
      isLiked: false
    },
    {
      id: 'post-2',
      author: 'Priya Deshmukh',
      authorRole: 'Team ByteForge • IT',
      authorAvatar: 'PD',
      time: '5 hours ago',
      content: 'We just open-sourced the zk-SNARK verification circuits from our MediChain hackathon project. Feel free to clone the repo or submit PRs on the student hub!',
      tags: ['OpenSource', 'Innerve2026', 'Solidity'],
      likes: 34,
      replies: 9,
      isLiked: true
    },
    {
      id: 'post-3',
      author: 'Prof. Rajesh Verma',
      authorRole: 'Innerve Faculty Convener',
      authorAvatar: 'RV',
      time: '1 day ago',
      content: 'Reminder for all Smart India Hackathon internal aspirants: Project review slots will be conducted in batches of 4 teams. Keep your test benchmarks ready.',
      tags: ['SIH2026', 'FacultyNotice', 'Evaluation'],
      likes: 56,
      replies: 12,
      isLiked: false
    }
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      author: currentUser.fullName,
      authorRole: `${currentUser.branch} • ${currentUser.aitRollNo}`,
      authorAvatar: currentUser.fullName.split(' ').map(n => n[0]).join(''),
      time: 'Just now',
      content: newPostContent.trim(),
      tags: ['StudentUpdate', 'Discussion'],
      likes: 0,
      replies: 0,
      isLiked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  const allTags = ['ALL', 'RoboGenesis', 'SIH2026', 'Innerve2026', 'EdgeAI', 'TeamRecruitment', 'OpenSource'];

  const filteredPosts = posts.filter(p => 
    selectedTag === 'ALL' || p.tags.includes(selectedTag)
  );

  return (
    <DashboardShell>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Globe2 className="w-4 h-4" />
              <span>AIT Student Tech Community</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Community & Collaboration Arena
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Connect with fellow student hackers, recruit team members, share project learnings, and discuss competition briefs.
            </p>
          </div>
        </div>

        {/* Create Post Card */}
        <div className="rounded-3xl bg-[#0D1220] border border-[#1E293B] p-5 shadow-xl">
          <form onSubmit={handlePostSubmit} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-sky-400 p-[1.5px] shrink-0">
                <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center font-bold text-xs text-white">
                  {currentUser.fullName.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share a hackathon update, question, or team recruitment call..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#121A2B] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#1E293B]/70">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-950/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post to Community</span>
              </button>
            </div>
          </form>
        </div>

        {/* Tags filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-500 mr-1 shrink-0">Filter Topic:</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedTag === tag
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[#121A2B] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Posts Stream */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-3xl bg-[#0D1220] border border-[#1E293B] hover:border-purple-500/30 p-6 space-y-4 shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-purple-300">
                    {post.authorAvatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{post.author}</h3>
                    <p className="text-[10px] text-slate-400">{post.authorRole}</p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">{post.time}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {post.content}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-[#121A2B] text-sky-400 border border-[#1E293B]">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center gap-4 text-xs text-slate-400">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.isLiked ? 'text-rose-400 font-bold' : 'hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes} Likes</span>
                </button>

                <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.replies} Replies</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardShell>
  );
}
