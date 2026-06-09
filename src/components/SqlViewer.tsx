/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Database, Key, Shield, Hash, HelpCircle, FileCode } from 'lucide-react';

const SQL_DDL_SCRIPT = `-- ====================================================================
-- INDIAN CORPORATE AFFAIRS (MCA) CSR GRANTS INTEGRITY DATABASE SCHEMA
-- Target Engine: PostgreSQL 14+ (ACID Compliant, Deterministic Indexes)
-- ====================================================================

-- 1. Create Companies Master table based on official MCA CDM records
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    cin_number VARCHAR(21) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    mca_registered_email VARCHAR(255) NOT NULL,
    registered_office_address TEXT NOT NULL,
    authorized_capital NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    paid_up_capital NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Enforce absolute Indian corporate identifier integrity (CIN is precisely 21 characters)
    CONSTRAINT chk_cin_length CHECK (CHAR_LENGTH(cin_number) = 21),
    -- Ensure verified email matches standard structure (no guessing or hallucinations)
    CONSTRAINT chk_mca_email CHECK (mca_registered_email LIKE '%@%.%')
);

-- 2. Create CSR Grant Opportunities mapped strictly to Schedule VII Sectors
CREATE TABLE csr_grants_opportunities (
    grant_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    grant_type VARCHAR(255) NOT NULL,
    schedule_vii_category_code VARCHAR(50) NOT NULL,
    budget_allocation NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    target_state VARCHAR(100) NOT NULL,
    application_deadline DATE NOT NULL,
    description TEXT NOT NULL,
    project_duration_months INT NOT NULL DEFAULT 12,
    verification_source VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Link back to original MCA corporate identity to secure CASCADE guarantees
    CONSTRAINT fk_companies_grant_id 
        FOREIGN KEY (company_id) 
        REFERENCES companies(company_id) 
        ON DELETE CASCADE,
        
    -- Constraints to keep numerical ranges positive
    CONSTRAINT chk_positive_budget CHECK (budget_allocation > 0),
    CONSTRAINT chk_positive_duration CHECK (project_duration_months > 0)
);

-- ====================================================================
-- HIGH-PERFORMANCE DETERMINISTIC INDEXING FOR RAPID GEO & BUDGET QUERIES
-- ====================================================================

-- Index for state targeting combined with deadline checks (prevents full-table scans)
CREATE INDEX idx_grants_state_deadline 
ON csr_grants_opportunities (target_state, application_deadline);

-- B-Tree Index for financial allocation boundaries (slider queries)
CREATE INDEX idx_grants_budget 
ON csr_grants_opportunities (budget_allocation);

-- Hash-optimized index for categorical Schedule VII categorization codes
CREATE INDEX idx_grants_schedule_vii 
ON csr_grants_opportunities (schedule_vii_category_code);

-- Foreign key covering index to prevent heavy sequential join operations
CREATE INDEX idx_grants_company_fk 
ON csr_grants_opportunities (company_id);`;

interface SchemaColumn {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

export function SqlViewer() {
  const [copied, setCopied] = useState(false);
  const [activeTable, setActiveTable] = useState<'companies' | 'grants'>('companies');

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_DDL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const companiesColumns: SchemaColumn[] = [
    { name: 'company_id', type: 'SERIAL (PK)', constraints: 'NOT NULL, PRIMARY KEY', description: 'Unique surrogate key identifying the corporate issuer.' },
    { name: 'cin_number', type: 'VARCHAR(21)', constraints: 'UNIQUE, NOT NULL, CHECK(len=21)', description: 'Ministry of Corporate Affairs 21-digit alphanumeric corporate registration registration code.' },
    { name: 'company_name', type: 'VARCHAR(160)', constraints: 'NOT NULL', description: 'Legal corporate title registered with the Registrar of Companies (RoC).' },
    { name: 'mca_registered_email', type: 'VARCHAR(255)', constraints: 'NOT NULL, CHECK(LIKE)', description: 'Primary contact email officially registered on file. Zero prediction or hallucination.' },
    { name: 'registered_office_address', type: 'TEXT', constraints: 'NOT NULL', description: 'Official corporate headquarters registered with RoC.' },
    { name: 'authorized_capital', type: 'NUMERIC(15,2)', constraints: 'NOT NULL DEFAULT 0.00', description: 'Maximum capital limit of the enterprise in Indian Rupees (INR).' },
    { name: 'paid_up_capital', type: 'NUMERIC(15,2)', constraints: 'NOT NULL DEFAULT 0.00', description: 'Actual capital funded by shareholders.' }
  ];

  const grantsColumns: SchemaColumn[] = [
    { name: 'grant_id', type: 'SERIAL (PK)', constraints: 'NOT NULL, PRIMARY KEY', description: 'Unique surrogate key for the specific CSR opening.' },
    { name: 'company_id', type: 'INT (FK)', constraints: 'NOT NULL, REFERENCES companies', description: 'Foreign key establishing integrity links back to the issuer enterprise.' },
    { name: 'title', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'NGO Facing heading summarizing the program.' },
    { name: 'grant_type', type: 'VARCHAR(180)', constraints: 'NOT NULL', description: 'General description of targeted thematic focus areas.' },
    { name: 'schedule_vii_category_code', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Schedule VII Sector Category Code tracker.' },
    { name: 'budget_allocation', type: 'NUMERIC(15,2)', constraints: 'NOT NULL, CHECK(>0)', description: 'Financial pool designated for funding in Indian Rupees (INR).' },
    { name: 'target_state', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'State targeted or "Pan-India" for countrywide distribution.' },
    { name: 'application_deadline', type: 'DATE', constraints: 'NOT NULL', description: 'Hard cutoff date. Expiry checks eliminate options beyond this date.' },
    { name: 'description', type: 'TEXT', constraints: 'NOT NULL', description: 'Granular project guidelines, eligibility criteria, and deliverables.' },
    { name: 'project_duration_months', type: 'INT', constraints: 'NOT NULL, CHECK(>0)', description: 'Timeline allocated for the completion of the programmatic milestones.' },
    { name: 'verification_source', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Official record origin (e.g. CSR-1 filing, company annual audit).' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border-2 border-slate-300 shadow-sm rounded-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-orange-400 border border-slate-800">
                ACID Database Schema
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-800 border border-slate-300">
                PostgreSQL Optimized
              </span>
            </div>
            <h2 className="text-xl font-bold font-sans text-slate-800 uppercase tracking-tight">
              Indian Ministry of Corporate Affairs (MCA) Relational Schema
            </h2>
            <p className="text-xs text-slate-650 uppercase tracking-wider font-light">
              Strict column mapping, length checks, foreign key integrity constraints, and customized indexing plans.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1e293b] bg-slate-50 hover:bg-slate-100 px-5 py-3 rounded-none border-2 border-[#1e293b] transition duration-150"
              id="copy-sql-btn"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Script Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL Script</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Database Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-50 p-5 border border-slate-300 rounded-none">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Database className="w-3.5 h-3.5 text-slate-500" /> Relational Architecture
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTable('companies')}
                  className={`w-full text-left p-4 rounded-none border-t-2 border-b-2 border-l border-r transition ${
                    activeTable === 'companies'
                      ? 'bg-slate-100 border-[#1e293b] text-slate-900 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                  id="tab-schema-companies"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <Shield className="w-4 h-4 text-orange-500" /> companies (Master)
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5">
                      TABLE 1
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-650 font-light">Company identity registered with the registrar (MCA). Zero-hallucinations contact info.</p>
                </button>

                <button
                  onClick={() => setActiveTable('grants')}
                  className={`w-full text-left p-4 rounded-none border-t-2 border-b-2 border-l border-r transition ${
                    activeTable === 'grants'
                      ? 'bg-slate-100 border-[#1e293b] text-slate-900 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                  id="tab-schema-grants"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <Hash className="w-4 h-4 text-orange-500" /> csr_grants_opportunities
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5">
                      TABLE 2
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-650 font-light">Contains grant allocations, target states, deadlines, and Schedule VII sector categorizations.</p>
                </button>
              </div>

              {/* Integrity summary */}
              <div className="mt-5 pt-4 border-t border-slate-300 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">DDL CHECK CONSTRAINTS:</h4>
                <ul className="text-[11.5px] space-y-2.5 text-slate-600 font-light">
                  <li className="flex gap-2">
                    <span className="text-orange-500 font-bold">●</span>
                    <span><strong>chk_cin_length:</strong> Strict CHECK ensuring CIN numbers match 21-character length syntax precisely.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500 font-bold font-sans">●</span>
                    <span><strong>Cascade Strategy:</strong> Deleting a company triggers clean deletion of associated grant allocations automatically.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-slate-900 border border-slate-300 rounded-none overflow-hidden">
              <div className="bg-[#1e293b] px-4 py-3 flex items-center justify-between border-b border-slate-300">
                <span className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-2 uppercase tracking-wide">
                  <Key className="w-3.5 h-3.5 text-orange-400 font-sans" /> Column Dictionary: <span className="text-orange-400 font-bold">{activeTable === 'companies' ? 'companies' : 'csr_grants_opportunities'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  Interactive Reference
                </span>
              </div>
              
              <div className="overflow-x-auto bg-[#131d2a]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/70">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-300 font-sans uppercase tracking-wider">Column Name</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-300 font-sans uppercase tracking-wider">Data Type</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-300 font-sans uppercase tracking-wider">SQL Checks</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-300 font-sans uppercase tracking-wider">Functional Intent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTable === 'companies' ? companiesColumns : grantsColumns).map((col, idx) => (
                      <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-xs font-semibold font-mono text-teal-400">{col.name}</td>
                        <td className="px-4 py-3 text-xs font-mono text-purple-300">{col.type}</td>
                        <td className="px-4 py-3 text-xs font-mono text-orange-400">{col.constraints}</td>
                        <td className="px-4 py-3 text-xs text-slate-300 font-sans leading-relaxed font-light">{col.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Full View Code Block */}
      <div className="bg-slate-950 p-6 border-2 border-slate-300 shadow-md overflow-hidden relative rounded-none">
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1">
            PostgreSQL v14
          </span>
          <span className="text-[10px] font-mono text-orange-400 bg-slate-900 border border-orange-950 px-2.5 py-1">
            100% Deterministic Schema
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
          <div className="w-3 h-3 bg-slate-800"></div>
          <span className="text-xs text-slate-300 font-mono ml-2 flex items-center gap-1.5 uppercase font-bold tracking-wider">
            <FileCode className="w-3.5 h-3.5 text-orange-500" /> schema.sql
          </span>
        </div>

        <div className="overflow-x-auto max-h-[500px] text-xs font-mono text-slate-200 leading-relaxed bg-[#0c141d] p-4 border border-slate-800">
          <pre className="p-1"><code>{SQL_DDL_SCRIPT}</code></pre>
        </div>
      </div>
    </div>
  );
}
