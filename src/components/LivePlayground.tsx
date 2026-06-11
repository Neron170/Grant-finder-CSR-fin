/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { csrGrants, companies, ScheduleViiSectors } from '../data/mockData';
import { JoinedGrantOpportunity, QueryFilter } from '../types';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Mail, 
  Search, 
  SlidersHorizontal, 
  Terminal, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  IndianRupee, 
  ExternalLink,
  Info,
  Linkedin,
  LayoutGrid,
  List,
  Columns
} from 'lucide-react';

const CURRENT_SYSTEM_DATE = "2026-06-09";

export function LivePlayground() {
  // Filter States
  const [filters, setFilters] = useState<QueryFilter>({
    state: '',
    min_budget: 0,
    max_budget: 50000000, // 5 Crores default
    schedule_vii: '',
    exclude_expired: true,
    search_query: ''
  });

  const [contactRevealed, setContactRevealed] = useState<Record<number, boolean>>({});
  const [designFormat, setDesignFormat] = useState<'bento-grid' | 'dense-ledger' | 'immersive-deck'>('bento-grid');
  const [selectedGrantId, setSelectedGrantId] = useState<number | null>(null);

  // Live dynamic web scraping state variables
  const [scanMode, setScanMode] = useState<'static' | 'scraped'>('static');
  const [scrapedGrants, setScrapedGrants] = useState<JoinedGrantOpportunity[]>([]);
  const [webSources, setWebSources] = useState<{ title: string; uri: string }[]>([]);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapingError, setScrapingError] = useState<string | null>(null);
  const [scrapingWarning, setScrapingWarning] = useState<string | null>(null);

  // Core scraper API proxy invoke handler
  const handlePerformLiveScraping = async () => {
    setIsScraping(true);
    setScrapingError(null);
    setScrapingWarning(null);
    try {
      const response = await fetch("/api/grants/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: filters.search_query,
          state: filters.state,
          sector: filters.schedule_vii
        })
      });
      const data = await response.json();
      if (data.success) {
        const mapped: JoinedGrantOpportunity[] = data.grants.map((g: any, index: number) => ({
          ...g,
          grant_id: 2000 + index,
          company_id: 2000 + index,
          grant_type: g.grant_type || "Corporate CSR Program",
          schedule_vii_category_code: g.schedule_vii_category_code || "SCH7_EDU"
        }));
        setScrapedGrants(mapped);
        setWebSources(data.sources || []);
        if (data.warning) {
          setScrapingWarning(data.warning);
        }
        if (mapped.length > 0) {
          setSelectedGrantId(mapped[0].grant_id);
        }
      } else {
        setScrapingError(data.error || "Failed to retrieve dynamic live listings.");
      }
    } catch (err: any) {
      setScrapingError(err.message || "Failed to reach backend scanning portal. Please ensure the dev server is active and GEMINI_API_KEY is configured inside Settings > Secrets.");
    } finally {
      setIsScraping(false);
    }
  };

  // Compile Joined Grants Pool - Toggles dynamically between Static and live Scraped holdings
  const joinedGrants: JoinedGrantOpportunity[] = useMemo(() => {
    if (scanMode === 'scraped') {
      return scrapedGrants;
    }
    return csrGrants.map(grant => {
      const company = companies.find(c => c.company_id === grant.company_id)!;
      return {
        ...grant,
        cin_number: company.cin_number,
        company_name: company.company_name,
        mca_registered_email: company.mca_registered_email,
        linkedin_url: company.linkedin_url
      };
    });
  }, [scanMode, scrapedGrants]);

  // Filter Logic matching Server Schema exactly
  const filteredGrants = useMemo(() => {
    return joinedGrants.filter(grant => {
      // 1. Search Query
      if (filters.search_query.trim() !== '') {
        const query = filters.search_query.toLowerCase();
        const matchesText = 
          grant.title.toLowerCase().includes(query) ||
          grant.company_name.toLowerCase().includes(query) ||
          grant.description.toLowerCase().includes(query) ||
          grant.cin_number.toLowerCase().includes(query);
        if (!matchesText) return false;
      }

      // 2. State Mapping
      if (filters.state !== '') {
        const selectedState = filters.state.toLowerCase();
        const grantState = grant.target_state.toLowerCase();
        if (selectedState !== 'pan-india' && grantState !== 'pan-india' && grantState !== selectedState) {
          return false;
        }
        if (selectedState === 'pan-india' && grantState !== 'pan-india') {
          return false;
        }
      }

      // 3. Budgets Allocation
      if (grant.budget_allocation < filters.min_budget) return false;
      if (grant.budget_allocation > filters.max_budget) return false;

      // 4. Schedule VII Sectors
      if (filters.schedule_vii !== '' && grant.schedule_vii_category_code !== filters.schedule_vii) {
        return false;
      }

      // 5. Expiry Check representation (Strict Date validations)
      if (filters.exclude_expired) {
        const deadlineDate = new Date(grant.application_deadline);
        const systemDate = new Date(CURRENT_SYSTEM_DATE);
        if (deadlineDate < systemDate) return false;
      }

      return true;
    });
  }, [joinedGrants, filters]);

  // Construct exact SQL Query corresponding to the parameters reactive in real-time
  const compiledSqlQuery = useMemo(() => {
    let sql = `SELECT g.title, g.budget_allocation, g.target_state, g.application_deadline,\n       c.company_name, c.cin_number, c.mca_registered_email \nFROM csr_grants_opportunities g\nINNER JOIN companies c ON g.company_id = c.company_id\nWHERE 1 = 1`;
    
    const params: string[] = [];
    let counter = 1;

    if (filters.state) {
      sql += `\n  AND (LOWER(g.target_state) = LOWER($${counter}) OR LOWER(g.target_state) = 'pan-india')`;
      params.push(`'${filters.state}'`);
      counter++;
    }

    if (filters.min_budget > 0) {
      sql += `\n  AND g.budget_allocation >= $${counter}`;
      params.push(`${filters.min_budget}`);
      counter++;
    }

    if (filters.max_budget < 50000000) {
      sql += `\n  AND g.budget_allocation <= $${counter}`;
      params.push(`${filters.max_budget}`);
      counter++;
    }

    if (filters.schedule_vii) {
      sql += `\n  AND g.schedule_vii_category_code = $${counter}`;
      params.push(`'${filters.schedule_vii}'`);
      counter++;
    }

    // Auto expiry validation
    if (filters.exclude_expired) {
      sql += `\n  AND g.application_deadline >= '${CURRENT_SYSTEM_DATE}'::DATE`;
    }

    if (filters.search_query) {
      sql += `\n  AND (LOWER(g.title) LIKE $${counter} OR LOWER(c.company_name) LIKE $${counter})`;
      params.push(`'%${filters.search_query}%'`);
    }

    sql += `\nORDER BY g.application_deadline ASC;`;
    return { sql, params };
  }, [filters]);

  const uniqueStates = useMemo(() => {
    const states = new Set<string>();
    csrGrants.forEach(g => {
      if (g.target_state !== 'Pan-India') {
        states.add(g.target_state);
      }
    });
    return Array.from(states).sort();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Crores`;
    } else {
      return `₹${(val / 100000).toFixed(0)} Lakhs`;
    }
  };

  const getWeeksRemaining = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const system = new Date(CURRENT_SYSTEM_DATE);
    const diffTime = deadline.getTime() - system.getTime();
    if (diffTime < 0) {
      return { text: "Expired", active: false };
    }
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeksVal = diffDays / 7;
    const weeksStr = weeksVal.toFixed(1);
    const text = `${weeksStr} ${weeksStr === "1.0" ? "week" : "weeks"} left`;
    return { text, active: true, days: diffDays, weeks: weeksVal };
  };

  const handleRevealContact = (grantId: number) => {
    setContactRevealed(prev => ({ ...prev, [grantId]: true }));
  };

  const activeGrantId = selectedGrantId !== null && filteredGrants.some(g => g.grant_id === selectedGrantId)
    ? selectedGrantId 
    : (filteredGrants[0]?.grant_id || null);

  const activeGrant = filteredGrants.find(g => g.grant_id === activeGrantId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
      {/* Filters Form Pane (columns: 4) */}
      <div className="lg:col-span-4 bg-white p-6 border border-slate-300 shadow-sm space-y-5 rounded-none">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-widest">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" /> Filter Settings
          </h2>
          <button
            onClick={() => setFilters({
              state: '',
              min_budget: 0,
              max_budget: 50000000,
              schedule_vii: '',
              exclude_expired: true,
              search_query: ''
            })}
            className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-orange-600 transition"
            id="reset-filters-btn"
          >
            Clear Fields
          </button>
        </div>

        {/* Information Directory Pool Mode Selection */}
        <div className="space-y-1.5 border-b border-slate-100 pb-4">
          <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest block">Information Directory Pool</label>
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 border border-slate-300">
            <button
              onClick={() => {
                setScanMode('static');
                setSelectedGrantId(null);
                setScrapingError(null);
              }}
              className={`py-2 px-1 text-[9px] font-extrabold uppercase tracking-wider text-center transition ${
                scanMode === 'static'
                  ? 'bg-[#1e293b] text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Verified Register (Local)
            </button>
            <button
              onClick={() => {
                setScanMode('scraped');
                setSelectedGrantId(null);
                setScrapingError(null);
              }}
              className={`py-2 px-1 text-[9px] font-extrabold uppercase tracking-wider text-center transition ${
                scanMode === 'scraped'
                  ? 'bg-[#1e293b] text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Web Scanner (Live AI)
            </button>
          </div>
        </div>

        {/* Live AI Scraper Interactive Action Panel */}
        {scanMode === 'scraped' && (
          <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-none space-y-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full bg-orange-550 ${isScraping ? 'animate-ping' : ''}`}></span>
              <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Live Dynamic Search Grounder</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-normal font-light">
              Submit sector / state filters or input keywords, then press below to query live search grounding for newly posted active CSR Schedule VII opportunities.
            </p>
            <button
              onClick={handlePerformLiveScraping}
              disabled={isScraping}
              className={`w-full py-2.5 text-[10px] uppercase tracking-widest font-extrabold text-[#1e293b] text-center border-2 border-[#1e293b] cursor-pointer transition ${
                isScraping 
                  ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed'
                  : 'bg-orange-400 hover:bg-orange-500 hover:text-white'
              }`}
            >
              {isScraping ? 'Scraping Live Web...' : 'Run Dynamic Web Scanner'}
            </button>

            {isScraping && (
              <div className="space-y-1.5 pt-2 border-t border-orange-250 font-mono text-[9px] text-orange-850">
                <div className="flex items-center gap-1">
                  <span className="animate-spin text-orange-600">&#9696;</span>
                  <span>Contacting Google search indexers...</span>
                </div>
                <div>Scanning MCA registries & corporate sheets...</div>
              </div>
            )}

            {scrapingError && (
              <div className="p-2 border border-red-200 bg-red-50 text-[9.5px] text-red-700 leading-normal font-mono">
                {scrapingError}
              </div>
            )}
          </div>
        )}

        {/* Global Search */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-555 tracking-widest block">Keyword/CIN Search</label>
          <div className="relative">
            <input
              type="text"
              value={filters.search_query}
              onChange={e => setFilters(prev => ({ ...prev, search_query: e.target.value }))}
              placeholder="Search via company name, or CIN..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-none focus:outline-none focus:border-orange-500 transition-colors"
              id="search-input"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Schedule VII sectors dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-555 tracking-widest block">Schedule VII Focus Sector</label>
          <select
            value={filters.schedule_vii}
            onChange={e => setFilters(prev => ({ ...prev, schedule_vii: e.target.value }))}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#cbd5e1] rounded-none focus:outline-none focus:border-orange-500 transition-colors"
            id="sector-select"
          >
            <option value="">All Filtering Sectors</option>
            {ScheduleViiSectors.map(s => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Target Geography State */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-555 tracking-widest block">Geography State</label>
          <select
            value={filters.state}
            onChange={e => setFilters(prev => ({ ...prev, state: e.target.value }))}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#cbd5e1] rounded-none focus:outline-none focus:border-orange-500 transition-colors"
            id="state-select"
          >
            <option value="">All Locations (Includes Pan-India)</option>
            <option value="Pan-India">Pan-India Opportunities Only</option>
            {uniqueStates.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Budget Allocation slider limits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase text-slate-500 block tracking-widest">Allocation Budget Limit</label>
            <span className="text-[10px] font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5">
              {formatCurrency(filters.min_budget)} - {formatCurrency(filters.max_budget)}
            </span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500 uppercase">
                <span>Minimum Limit</span>
                <span className="font-mono">{formatCurrency(filters.min_budget)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="30000000"
                step="1000000"
                value={filters.min_budget}
                onChange={e => setFilters(prev => ({ ...prev, min_budget: parseInt(e.target.value) }))}
                className="w-full h-1 bg-slate-200 appearance-none cursor-pointer accent-orange-500"
                id="min-budget-range"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500 uppercase">
                <span>Maximum Limit</span>
                <span className="font-mono">{formatCurrency(filters.max_budget)}</span>
              </div>
              <input
                type="range"
                min="5000000"
                max="50000000"
                step="2500000"
                value={filters.max_budget}
                onChange={e => setFilters(prev => ({ ...prev, max_budget: parseInt(e.target.value) }))}
                className="w-full h-1 bg-slate-200 appearance-none cursor-pointer accent-orange-500"
                id="max-budget-range"
              />
            </div>
          </div>
        </div>

        {/* Auto cut off deadline expiry switch */}
        <div className="pt-3 border-t border-slate-200">
          <label className="flex items-center justify-between cursor-pointer" id="expiry-toggle-container">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Exclude Expired</span>
              <span className="text-[10px] text-slate-500 block leading-tight">Deadlines before {CURRENT_SYSTEM_DATE}</span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.exclude_expired}
                onChange={e => setFilters(prev => ({ ...prev, exclude_expired: e.target.checked }))}
                className="sr-only peer"
                id="expiry-chk"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:width-4 after:transition-all peer-checked:bg-orange-500"></div>
            </div>
          </label>
        </div>

        {/* Frictionless Access Grounding Note */}
        <div className="p-4 bg-slate-50 border border-slate-300 rounded-none space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-widest">
            <Info className="w-3.5 h-3.5 text-orange-500" /> 
            <span>Frictionless Access</span>
          </div>
          <p className="text-[10px] text-slate-600 leading-normal font-light">
            NGO core directory searches are 100% friction-free. No master registration portals or credentials required.
          </p>
        </div>
      </div>

      {/* Primary listings + terminal column */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Results Metadata Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-300 pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Verified Industry Opportunities Directory
            </h2>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              {filteredGrants.length} of 22 matched results
            </span>
          </div>

          {/* Design Layout Selector Controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-300 self-start sm:self-auto">
            <button
              onClick={() => setDesignFormat('bento-grid')}
              className={`px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition ${
                designFormat === 'bento-grid'
                  ? 'bg-[#1e293b] text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Bento Card Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>

            <button
              onClick={() => setDesignFormat('dense-ledger')}
              className={`px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all ${
                designFormat === 'dense-ledger'
                  ? 'bg-[#1e293b] text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Dense List Ledger"
            >
              <List className="w-3.5 h-3.5" />
              <span>Ledger View</span>
            </button>

            <button
              onClick={() => setDesignFormat('immersive-deck')}
              className={`px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all ${
                designFormat === 'immersive-deck'
                  ? 'bg-[#1e293b] text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Immersive Profiling Deck"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Dossier View</span>
            </button>
          </div>
        </div>

        {/* Dynamic Layout Delivery */}
        {scanMode === 'scraped' && scrapingWarning && (
          <div className="mb-4 p-4 bg-amber-50/80 border-l-4 border-amber-500 text-amber-900 border border-slate-200/50 flex items-start gap-2.5 rounded-none shadow-xs">
            <span className="text-sm select-none">⚠️</span>
            <div className="space-y-1">
              <strong className="font-bold uppercase tracking-wider text-[10px] block text-amber-800 font-sans">API Quota Notice: Resilient Fallback Enabled</strong>
              <p className="font-sans font-light leading-relaxed text-xs">{scrapingWarning}</p>
            </div>
          </div>
        )}

        {filteredGrants.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 p-12 text-center space-y-3 rounded-none">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto animate-none" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">No Opportunities Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
              There are no opportunities matching the active combination of budget, state, and category filtering settings. Try resetting parameters.
            </p>
          </div>
        ) : (
          <>
            {/* 1. BENTO CARD GRID VIEW */}
            {designFormat === 'bento-grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGrants.map(grant => {
                  const weeksCheck = getWeeksRemaining(grant.application_deadline);
                  
                  // Map Category to Specific geometric border color accents
                  let borderAccentCls = "border-l-orange-500";
                  if (grant.schedule_vii_category_code === 'SCH7_POV') borderAccentCls = "border-l-rose-500";
                  else if (grant.schedule_vii_category_code === 'SCH7_ENV') borderAccentCls = "border-l-emerald-500";
                  else if (grant.schedule_vii_category_code === 'SCH7_GND') borderAccentCls = "border-l-sky-500";
                  else if (grant.schedule_vii_category_code === 'SCH7_DIS') borderAccentCls = "border-l-purple-500";
                  else if (grant.schedule_vii_category_code === 'SCH7_RUL') borderAccentCls = "border-l-amber-500";

                  return (
                    <div 
                      key={grant.grant_id}
                      className={`bg-white border border-slate-200 border-l-4 ${borderAccentCls} p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-150 rounded-none relative`}
                      id={`grant-card-${grant.grant_id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 text-[9px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 uppercase">
                              {grant.grant_type}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              ID: #{grant.grant_id}
                            </span>
                          </div>
                          
                          {weeksCheck.active ? (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 uppercase bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                              {weeksCheck.text}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 uppercase">
                              No Weeks Left
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-[#1e293b] uppercase tracking-tight line-clamp-1">
                            {grant.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1">
                            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                              {grant.company_name}
                            </span>
                            <span className="text-slate-350 font-light text-[10px] select-none">|</span>
                            {grant.linkedin_url ? (
                              <a
                                href={grant.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#0a66c2] hover:text-[#0b56a3] uppercase tracking-wide transition-colors"
                              >
                                <Linkedin className="w-3.5 h-3.5 shrink-0" />
                                <span>LinkedIn Profile</span>
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-400 font-mono uppercase tracking-wide">
                                <Linkedin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                <span>LinkedIn NA</span>
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-2.5 bg-slate-50 border-l-2 border-slate-300 p-2 text-[10px] font-mono text-slate-500 font-bold uppercase">
                            CIN: {grant.cin_number}
                          </div>

                          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-sans font-light line-clamp-3">
                            {grant.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                          <div>
                            <span className="text-slate-400 font-bold uppercase text-[9px] block">Target Geo</span>
                            <strong className="text-slate-800">{grant.target_state}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase text-[9px] block">Duration</span>
                            <strong className="text-slate-800 font-mono">{grant.project_duration_months} Months</strong>
                          </div>
                          <div className="col-span-2 pt-1 border-t border-dotted border-slate-200 flex justify-between items-center text-[10px]">
                            <div>
                              <span className="text-slate-400 font-bold uppercase text-[9px] block">Verified Source</span>
                              {grant.verification_source.startsWith('http') ? (
                                <a
                                  href={grant.verification_source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-orange-600 font-extrabold underline hover:text-orange-700 inline-flex items-center gap-0.5"
                                >
                                  Open Portal Link <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-700 font-semibold">{grant.verification_source}</span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-slate-400 font-bold uppercase text-[9px] block">Allocation</span>
                              <strong className="text-orange-600 font-mono text-xs font-bold">{formatCurrency(grant.budget_allocation)}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="pt-1.5">
                          {contactRevealed[grant.grant_id] ? (
                            <div className="bg-emerald-50 border border-emerald-300 p-2 flex flex-col gap-1.5 rounded-none text-xs font-mono text-emerald-800">
                              <div className="flex items-center gap-1 truncate">
                                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-bold truncate">{grant.mca_registered_email}</span>
                              </div>
                              
                              <a 
                                href={`mailto:${grant.mca_registered_email}?subject=CSR Inquiry: ${grant.title}`}
                                className="bg-[#1e293b] hover:bg-slate-800 text-white text-[9px] py-1.5 px-2 text-center uppercase tracking-widest font-bold font-sans transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Send Direct Inquiry
                              </a>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRevealContact(grant.grant_id)}
                              className="w-full bg-[#1e293b] hover:bg-slate-800 active:scale-98 text-white py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-150 rounded-none flex items-center justify-center gap-1.5"
                              id={`reveal-btn-${grant.grant_id}`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reveal Official MCA Email</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. DENSE LEDGER ROW LISTING VIEW */}
            {designFormat === 'dense-ledger' && (
              <div className="bg-white border-2 border-slate-300 overflow-x-auto rounded-none shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-300 font-bold text-[10px] uppercase tracking-wider text-slate-700">
                      <th className="p-3">Program / Venture</th>
                      <th className="p-3">Focus Area</th>
                      <th className="p-3">Target / Term</th>
                      <th className="p-3">Budget</th>
                      <th className="p-3 text-right">Corporate Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredGrants.map(grant => {
                      const weeksCheck = getWeeksRemaining(grant.application_deadline);
                      const sectorLabel = ScheduleViiSectors.find(s => s.code === grant.schedule_vii_category_code)?.name || grant.schedule_vii_category_code;
                      
                      return (
                        <tr key={grant.grant_id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 align-top max-w-[240px]">
                            <div className="font-bold text-slate-850 uppercase tracking-tight">{grant.title}</div>
                            <div className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5 flex flex-wrap items-center gap-1.5">
                              <span>{grant.company_name}</span>
                              <span className="text-slate-300 font-light select-none">|</span>
                              {grant.linkedin_url ? (
                                <a href={grant.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[#0a66c2] font-mono font-bold hover:underline inline-flex items-center gap-0.5">
                                  <Linkedin className="w-2.5 h-2.5" /> Linkedin
                                </a>
                              ) : (
                                <span className="text-slate-400 font-mono">LinkedIn NA</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 align-top">
                            <span 
                              className="px-2 py-0.5 text-[8.5px] font-bold bg-slate-100 border border-slate-200 text-slate-700 uppercase tracking-wider block text-center rounded-none shadow-3xs truncate max-w-[130px]" 
                              title={sectorLabel}
                            >
                              {grant.schedule_vii_category_code.replace("SCH7_", "")}
                            </span>
                          </td>
                          <td className="p-3 align-top whitespace-nowrap">
                            <div className="font-semibold text-slate-700">{grant.target_state}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{grant.project_duration_months} M • {weeksCheck.text}</div>
                          </td>
                          <td className="p-3 align-top whitespace-nowrap">
                            <div className="font-bold font-mono text-orange-650">{formatCurrency(grant.budget_allocation)}</div>
                            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">{grant.grant_type}</div>
                          </td>
                          <td className="p-3 align-top text-right whitespace-nowrap">
                            {contactRevealed[grant.grant_id] ? (
                              <div className="inline-flex flex-col items-end gap-1 font-mono text-[10px]">
                                <span className="font-bold text-emerald-700 text-[10.5px]">{grant.mca_registered_email}</span>
                                <a
                                  href={`mailto:${grant.mca_registered_email}?subject=CSR Inquiry: ${grant.title}`}
                                  className="bg-slate-800 hover:bg-slate-900 text-white text-[8px] px-2.5 py-1 font-sans uppercase font-bold tracking-widest transition"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Email Direct
                                </a>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleRevealContact(grant.grant_id)}
                                className="bg-slate-900 hover:bg-slate-800 text-white text-[9.5px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-none transition shadow-3xs"
                              >
                                Reveal Email
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. IMMERSIVE PROFILE DOSSIER DECK VIEW */}
            {designFormat === 'immersive-deck' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 border-2 border-slate-300 bg-slate-50 p-4 rounded-none min-h-[550px] shadow-sm">
                {/* Left list pane (col-span-5) */}
                <div className="md:col-span-5 space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-200">
                    Active Catalog Targets ({filteredGrants.length})
                  </div>
                  {filteredGrants.map(g => {
                    const isActive = g.grant_id === activeGrantId;
                    const weeksCheck = getWeeksRemaining(g.application_deadline);
                    return (
                      <button
                        key={g.grant_id}
                        onClick={() => setSelectedGrantId(g.grant_id)}
                        className={`w-full text-left p-3 border transition-all duration-150 rounded-none flex flex-col justify-between ${
                          isActive 
                            ? 'bg-[#1e293b] border-slate-950 text-white shadow-sm' 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 shadow-3xs'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center gap-1 mb-1 text-[9px] font-mono uppercase tracking-wider">
                            <span className={isActive ? 'text-orange-400 font-bold' : 'text-slate-400'}>ID: #{g.grant_id}</span>
                            <span className={isActive ? 'text-slate-300 font-bold' : 'text-slate-500'}>{weeksCheck.text}</span>
                          </div>
                          <h4 className={`text-xs font-bold uppercase tracking-tight line-clamp-1 ${isActive ? 'text-white' : 'text-slate-800'}`}>
                            {g.title}
                          </h4>
                          <div className={`text-[10px] font-mono uppercase mt-0.5 line-clamp-1 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                            {g.company_name}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-dotted border-slate-500/10">
                          <span className={`text-[9.5px] font-mono ${isActive ? 'text-orange-300' : 'text-orange-600 font-bold'}`}>
                            {formatCurrency(g.budget_allocation)}
                          </span>
                          <span className={`text-[8.5px] uppercase font-bold tracking-wider px-1 bg-opacity-10 ${isActive ? 'bg-white text-orange-400' : 'bg-slate-100 text-slate-600'}`}>
                            {g.grant_type}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right details deck content (col-span-7) */}
                <div className="md:col-span-7 bg-white border border-slate-300 p-5 md:p-6 flex flex-col justify-between max-h-[580px] overflow-y-auto shadow-sm">
                  {activeGrant ? (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                        <span className="px-2 py-0.5 text-[9.5px] font-mono font-bold text-slate-755 bg-slate-100 border border-slate-300 uppercase tracking-widest">
                          {activeGrant.grant_type} Dossier
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                          ID: #{activeGrant.grant_id}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-[#1e293b] uppercase tracking-tight leading-snug">
                          {activeGrant.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5 pb-2">
                          <span className="text-xs font-bold text-slate-700 uppercase">
                            {activeGrant.company_name}
                          </span>
                          <span className="text-slate-300 select-none">|</span>
                          {activeGrant.linkedin_url ? (
                            <a
                              href={activeGrant.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0a66c2] hover:text-[#0b56a3] uppercase tracking-wider"
                            >
                              <Linkedin className="w-3.5 h-3.5" />
                              <span>LinkedIn Profile</span>
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 font-mono uppercase">
                              <Linkedin className="w-3.5 h-3.5 text-slate-300" />
                              <span>LinkedIn NA</span>
                            </span>
                          )}
                        </div>

                        <div className="bg-slate-50 border-l-2 border-[#1e293b] p-3 text-xs font-mono text-slate-700 space-y-1.5 mt-3">
                          <div><span className="font-bold text-slate-400">CORP ID (CIN):</span> {activeGrant.cin_number}</div>
                          <div><span className="font-bold text-slate-400">FOCUS CATEGORY:</span> {activeGrant.schedule_vii_category_code}</div>
                          <div>
                            <span className="font-bold text-slate-400">VERIFIED SOURCE:</span>{' '}
                            {activeGrant.verification_source.startsWith('http') ? (
                              <a
                                href={activeGrant.verification_source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 font-extrabold underline hover:text-orange-700 inline-flex items-center gap-0.5 font-sans"
                              >
                                Visited Source Portal <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-slate-700 font-semibold">{activeGrant.verification_source}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest">
                          Opportunity Description & Scope
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans font-light">
                          {activeGrant.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 border-t border-b border-slate-200 py-4 text-xs">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block mb-0.5">Target Location</span>
                          <strong className="text-slate-800 text-sm flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-orange-500" /> {activeGrant.target_state}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block mb-0.5">Budget Allocation</span>
                          <strong className="text-orange-600 text-sm font-mono font-extrabold block">
                            {formatCurrency(activeGrant.budget_allocation)}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block mb-0.5">Project Duration</span>
                          <strong className="text-slate-800 text-sm block font-mono">
                            {activeGrant.project_duration_months} Months
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block mb-0.5">Application Deadline</span>
                          <strong className="text-slate-800 text-sm block font-mono">
                            {activeGrant.application_deadline} ({getWeeksRemaining(activeGrant.application_deadline).text})
                          </strong>
                        </div>
                      </div>

                      {/* Visual Budget Meter Segment */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="uppercase tracking-wider font-bold text-slate-400">Allocation Level Indicator</span>
                          <span className="font-mono text-orange-600 font-bold">Max Limit: ₹5 Cr</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 border border-slate-200 rounded-none overflow-hidden relative">
                          <div 
                            className="bg-orange-500 h-full transition-all duration-300" 
                            style={{ width: `${Math.min(100, (activeGrant.budget_allocation / 50000000) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Actions segment */}
                      <div className="pt-2">
                        {contactRevealed[activeGrant.grant_id] ? (
                          <div className="bg-emerald-50 border border-emerald-300 p-3.5 flex flex-col gap-2 rounded-none text-xs font-mono text-emerald-800">
                            <div className="flex items-center gap-1.5 truncate">
                              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="font-bold truncate text-sm">{activeGrant.mca_registered_email}</span>
                            </div>
                            <a 
                              href={`mailto:${activeGrant.mca_registered_email}?subject=CSR Inquiry: ${activeGrant.title}`}
                              className="bg-[#1e293b] hover:bg-slate-800 text-white text-[10px] py-2 px-3 text-center uppercase tracking-widest font-bold font-sans transition-colors block"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Send Official Email Inquiry
                            </a>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRevealContact(activeGrant.grant_id)}
                            className="w-full bg-[#1e293b] hover:bg-slate-800 active:scale-98 text-white py-3 text-[10px] font-bold uppercase tracking-widest transition-all duration-150 rounded-none flex items-center justify-center gap-2 shadow-xs"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Reveal Contact Credentials</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 p-12">
                      <HelpCircle className="w-8 h-8" />
                      <p className="text-xs uppercase tracking-wider font-bold">Select from catalog list to overview</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
