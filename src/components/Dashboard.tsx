/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Network, 
  ShieldCheck, 
  UserMinus, 
  FileCheck2, 
  ArrowRight, 
  CheckCircle,
  Database,
  CalendarCheck2,
  BookOpen
} from 'lucide-react';

export function Dashboard({ onNavigateToSearch }: { onNavigateToSearch: () => void }) {
  return (
    <div className="space-y-6 font-sans">
      
      {/* Hero Header - Geometric Slate Block */}
      <div className="relative overflow-hidden bg-[#1e293b] text-white p-8 border-4 border-[#121c2c] shadow-md rounded-none">
        <div className="absolute top-0 right-0 w-32 h-full bg-orange-500/10 -skew-x-12 transform origin-top"></div>
        
        <div className="relative max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-slate-800 text-orange-400 text-[10px] px-2.5 py-1 font-bold uppercase tracking-widest border border-slate-700">
              Ministry of Corporate Affairs (MCA) CDM Framework
            </span>
            <span className="bg-slate-800 text-teal-400 text-[10px] px-2.5 py-1 font-bold uppercase tracking-widest border border-slate-700">
              Schedule VII Complete Compatibility
            </span>
          </div>

          <h2 className="text-2xl md:text-3.5xl font-bold tracking-tight text-white uppercase leading-none">
            Deterministic Indian NGO CSR Grant Discovery Engine
          </h2>
          
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed font-light">
            Eliminating accessibility friction for grassroots nonprofit organizations. A completely offline, non-LLM, index-optimized relational database platform hosting verified Company Master Data and active grant opportunities.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={onNavigateToSearch}
              className="bg-orange-500 hover:bg-orange-600 text-[#1e293b] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-none transition duration-150 flex items-center gap-2 shadow"
              id="hero-search-btn"
            >
              Launch Interactive Search Directory <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars - Flat bordered layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 border-2 border-slate-300 shadow-sm space-y-3 rounded-none relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
            <h3 className="font-bold text-[#1e293b] text-xs uppercase tracking-wider">1. Zero-AI / Non-Scrape Safety</h3>
          </div>
          <p className="text-xs text-slate-650 leading-relaxed font-light">
            All listings are pulled directly from a static, pre-compiled relational database of official <code>Form CSR-1</code> and <code>Form CSR-2</code> filings. No runtime web scrapers, no probabilistic AI models, and absolutely zero simulated contacts.
          </p>
        </div>

        <div className="bg-white p-6 border-2 border-slate-300 shadow-sm space-y-3 rounded-none relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500"></div>
          <div className="flex items-center gap-2">
            <UserMinus className="w-5 h-5 text-teal-500 shrink-0" />
            <h3 className="font-bold text-[#1e293b] text-xs uppercase tracking-wider">2. Frictionless Open Access</h3>
          </div>
          <p className="text-xs text-slate-650 leading-relaxed font-light">
            Eliminates registration barriers. Small rural NGOs do not need to sign up, sign in, or provide an MCA registration number. The directory operates entirely in open public-access space to guarantee maximum equality of discovery.
          </p>
        </div>

        <div className="bg-white p-6 border-2 border-slate-300 shadow-sm space-y-3 rounded-none relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1e293b]"></div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#1e293b] shrink-0" />
            <h3 className="font-bold text-[#1e293b] text-xs uppercase tracking-wider">3. Direct Verified Contacts</h3>
          </div>
          <p className="text-xs text-slate-650 leading-relaxed font-light">
            Every registered enterprise includes verified contact details. Hand-coded <code>mca_registered_email</code> fields represent historical data audited via RoC company registers. Hallucinated emails are structurally database-prevented.
          </p>
        </div>

      </div>

      {/* How NGO Discovery Works */}
      <div className="bg-white p-6 border-2 border-slate-300 shadow-sm space-y-6 rounded-none">
        <div>
          <h3 className="font-bold text-[#1e293b] text-xs uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-orange-500" /> Simplified NGO Discovery Process
          </h3>
          <p className="text-xs text-slate-650 uppercase tracking-wider font-light">
            An intuitive roadmap to help public-interest organizations discover and secure eligible CSR corporate support.
          </p>
        </div>

        {/* User process block diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-50 p-5 border border-slate-200 text-center space-y-3 rounded-none relative">
            <div className="mx-auto w-8 h-8 bg-orange-500 flex items-center justify-center text-[#1e293b] text-xs font-bold">1</div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Filter focus sectors</h4>
            <span className="text-[11px] text-slate-600 block leading-normal font-light">
              Filter campaigns corresponding tightly to Schedule VII focus sectors matching your NGO's goals (e.g., Education, Poverty, Livelihoods).
            </span>
          </div>

          <div className="bg-slate-50 p-5 border border-slate-200 text-center space-y-3 rounded-none relative">
            <div className="mx-auto w-8 h-8 bg-slate-800 flex items-center justify-center text-white text-xs font-bold">2</div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Confirm geography eligibility</h4>
            <span className="text-[11px] text-slate-600 block leading-normal font-light">
              Check target geography parameters. Verify that your state operations match regional requirements or search for Pan-India options.
            </span>
          </div>

          <div className="bg-slate-50 p-5 border border-slate-200 text-center space-y-3 rounded-none relative">
            <div className="mx-auto w-8 h-8 bg-[#1e293b] flex items-center justify-center text-orange-400 text-xs font-bold">3</div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Direct Verified Inquiries</h4>
            <span className="text-[11px] text-slate-600 block leading-normal font-light">
              Instantly review verified Corporate Social Responsibility contact communications directly from RoC records, completely skipping mediators.
            </span>
          </div>

        </div>

        {/* Informational parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1e293b] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-orange-500" /> Transparent Eligibility Standards
            </h4>
            <div className="space-y-2 leading-relaxed font-light text-xs text-slate-650">
              <p>
                <strong>No Middlemen:</strong> All information is sourced straight from public corporate filings. Eliminating agency fees ensures maximum direct funding reaches grassroot communities.
              </p>
              <p>
                <strong>Reliable Master Identification:</strong> Search companies directly with their 21-character Corporate Identity Numbers (CIN). Double-checked entries yield accurate profiles.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1e293b] uppercase tracking-wider flex items-center gap-1.5">
              <CalendarCheck2 className="w-4 h-4 text-teal-650" /> Up-to-Date Opportunities
            </h4>
            <div className="space-y-2 leading-relaxed font-light text-xs text-slate-655">
              <p>
                <strong>Automatic Deadline Tracking:</strong> The directory handles dates responsibly. Outdated grants are hidden from the active directory after the deadline expires to save NGO submission costs and effort.
              </p>
              <p>
                <strong>Flexible Matching Sliders:</strong> Discover grants that align perfectly with your program's budget requirements (from 5 Lakhs up to 5 Crores).
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Corporate Social Responsibility Guidelines Index card (Schedule VII) */}
      <div className="bg-slate-100 p-6 border-2 border-slate-300 flex flex-col md:flex-row gap-5 items-center justify-between rounded-none">
        <div className="space-y-2">
          <h3 className="font-bold text-[#1e293b] text-xs uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-500" /> Complete Schedule VII Compatibility List Included
          </h3>
          <p className="text-xs text-slate-700 leading-normal max-w-2xl font-light">
            All mock entries and SQL schemas mapped correspond tightly to the official 12 broad items listed in Schedule VII of Section 135 of the Indian Companies Act, 2013 (Eradicating Hunger, Promotion of Education, Water resources management, Environmental Stewardship, Rural Livelihoods improvement, and more).
          </p>
        </div>
        <button
          onClick={onNavigateToSearch}
          className="bg-[#1e293b] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-none whitespace-nowrap transition"
          id="cta-playground-btn"
        >
          Check Active Grants &rarr;
        </button>
      </div>

    </div>
  );
}
