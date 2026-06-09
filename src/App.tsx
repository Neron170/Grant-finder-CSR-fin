/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { LivePlayground } from './components/LivePlayground';
import { 
  Search, 
  Network,
  ShieldCheck
} from 'lucide-react';

type AppTab = 'dashboard' | 'search';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col antialiased">
      {/* Geometric Slate Header with balanced indicators */}
      <header className="bg-[#1e293b] text-white border-b-4 border-[#121c2c] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Branding - Geometric Balance Theme Accent */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest bg-slate-800 border border-slate-700 px-2 py-0.5">
                  RoC Master Sync v4.1
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-slate-800 border border-teal-900 px-2 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Deterministic DB
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight font-sans text-white">
                NGO-CSR <span className="text-orange-400">PORTAL</span>
              </h1>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Verified MCA Corporate Data Framework & Schedule VII Grants
              </p>
            </div>

            {/* Quick Metrics (Geometric block design) */}
            <div className="flex flex-wrap items-center gap-2 md:self-end">
              <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 text-slate-300">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Issuers</p>
                <p className="text-base font-bold font-mono text-white">10 Enterprise Masters</p>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 text-slate-300">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Verified Openings</p>
                <p className="text-base font-bold font-mono text-orange-400">22 Checked Grants</p>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 text-slate-300">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">System Date</p>
                <p className="text-base font-bold font-mono text-emerald-400">2026-06-09</p>
              </div>
            </div>

          </div>

          {/* Navigation Tabs - Geometric flat tabs */}
          <div className="flex border-t border-slate-700/60 mt-5 pt-3 -mb-5 overflow-x-auto gap-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-3 pt-2.5 px-4 text-xs font-bold font-sans uppercase tracking-widest border-b-4 transition duration-150 flex items-center gap-2 shrink-0 ${
                activeTab === 'dashboard'
                  ? 'border-orange-500 text-white bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/45'
              }`}
              id="tab-dashboard"
            >
              <Network className="w-4 h-4" />
              Architecture Overview
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`pb-3 pt-2.5 px-4 text-xs font-bold font-sans uppercase tracking-widest border-b-4 transition duration-150 flex items-center gap-2 shrink-0 ${
                activeTab === 'search'
                  ? 'border-orange-500 text-white bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/45'
              }`}
              id="tab-search"
            >
              <Search className="w-4 h-4" />
              Live Grant Finder Directory
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
        {activeTab === 'dashboard' && (
          <Dashboard onNavigateToSearch={() => setActiveTab('search')} />
        )}
        
        {activeTab === 'search' && (
          <LivePlayground />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-950 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-300">India RoC Master CSR Data Exchange</span> (Section 135)
          </div>
          <p className="text-[11px] text-slate-500">
            For development review. Engineered strictly with deterministic relational indexes and 100% verified corporate contact entries. Zero probabilistic LLMs.
          </p>
        </div>
      </footer>
    </div>
  );
}
