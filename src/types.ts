/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Company {
  company_id: number;
  cin_number: string; // Corporate Identity Number (21 characters)
  company_name: string;
  mca_registered_email: string; // Official registered email pulled directly from MCA master records
  registered_office_address: string;
  authorized_capital: number; // in INR
  paid_up_capital: number; // in INR
  linkedin_url?: string;
}

export interface CsrGrantOpportunity {
  grant_id: number;
  company_id: number;
  title: string;
  grant_type: string; // Matched to Schedule VII sectors
  schedule_vii_category_code: string; // Exact classification identifier (e.g., 'SCH7_EDU', 'SCH7_ENV')
  budget_allocation: number; // in INR (Lakhs/Crores helper representation)
  target_state: string; // Specific Indian State name (e.g., 'Maharashtra', 'Karnataka', 'Pan-India')
  application_deadline: string; // ISO date format 'YYYY-MM-DD'
  description: string;
  project_duration_months: number;
  verification_source: string; // official reference source (e.g., 'MCA CDM Report 2025/26')
}

export interface JoinedGrantOpportunity extends CsrGrantOpportunity {
  cin_number: string;
  company_name: string;
  mca_registered_email: string;
  linkedin_url?: string;
}

export interface QueryFilter {
  state: string;
  min_budget: number;
  max_budget: number;
  schedule_vii: string;
  exclude_expired: boolean;
  search_query: string;
}
