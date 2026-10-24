'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store';
import { Bookmark, ArrowRight, Code2 } from 'lucide-react';

export default function SavedProjectsPage() {
  const { projects, savedProjectIds, toggleSaveProject } = useAppStore();

  const savedList = projects.filter(p => savedProjectIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Bookmark className="w-4 h-4" />
              <span>Personal Knowledge Archive</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Saved Student Projects
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Technical architectures, models, and reference implementations you have bookmarked for study and collaboration.
            </p>
          </div>

          {savedList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0D1220] border border-slate-800 space-y-3">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Saved Projects Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore the open project repository and click the bookmark icon on any innovation to save it here.
              </p>
              <Link
                href="/projects"
                className="inline-block px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedList.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-[#121A2B] border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-purple-300">{p.teamName}</span>
                      <button
                        onClick={() => toggleSaveProject(p.id)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <h3 className="font-bold text-base text-white">{p.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.shortDescription}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">{p.technologies.slice(0, 3).join(', ')}</span>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
