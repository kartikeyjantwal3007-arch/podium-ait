'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/DashboardShell';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PrincipalPortalPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/general-secretary');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/50">
          <Shield className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            System Designation Update
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Principal / Director Portal Decommissioned
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            All institutional supervisory governance, certificate approvals, and cryptographic digital signing responsibilities have been transferred to the <strong className="text-rose-400">General Secretary</strong>.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/general-secretary"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-colors"
          >
            <span>Proceed to General Secretary Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] text-slate-500 mt-2">
            Redirecting automatically in 2 seconds...
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
