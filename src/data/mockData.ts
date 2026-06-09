/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Company, CsrGrantOpportunity } from '../types';

export const companies: Company[] = [
  {
    company_id: 1,
    cin_number: "L17110MH1973PLC019786",
    company_name: "Reliance Industries Limited",
    mca_registered_email: "csr.governance@reliance.com",
    registered_office_address: "3rd Floor, Maker Chambers IV, 222, Nariman Point, Mumbai, Maharashtra 400021",
    authorized_capital: 150000000000, // 15,000 Crores
    paid_up_capital: 67650000000,
    linkedin_url: "https://www.linkedin.com/company/reliance"
  },
  {
    company_id: 2,
    cin_number: "L72200MH1995PLC090030",
    company_name: "Tata Consultancy Services Limited",
    mca_registered_email: "corporate.csr@tcs.com",
    registered_office_address: "9th Floor, Nirmal Building, Nariman Point, Mumbai, Maharashtra 400021",
    authorized_capital: 4000000000, // 400 Crores
    paid_up_capital: 3660000000,
    linkedin_url: "https://www.linkedin.com/company/tata-consultancy-services"
  },
  {
    company_id: 3,
    cin_number: "L72200KA1981PLC013173",
    company_name: "Infosys Limited",
    mca_registered_email: "infosys.foundation@infosys.com",
    registered_office_address: "Electronics City, Hosur Road, Bengaluru, Karnataka 560100",
    authorized_capital: 25000000000, // 2,500 Crores
    paid_up_capital: 20680000000,
    linkedin_url: "https://www.linkedin.com/company/infosys"
  },
  {
    company_id: 4,
    cin_number: "L32102KA1945PLC020800",
    company_name: "Wipro Limited",
    mca_registered_email: "wipro.csr@wipro.com",
    registered_office_address: "Doddakannelli, Sarjapur Road, Bengaluru, Karnataka 560035",
    authorized_capital: 25000000000,
    paid_up_capital: 10450000000,
    linkedin_url: "https://www.linkedin.com/company/wipro"
  },
  {
    company_id: 5,
    cin_number: "L65920MH1994PLC080618",
    company_name: "HDFC Bank Limited",
    mca_registered_email: "parivartan.csr@hdfcbank.com",
    registered_office_address: "Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
    authorized_capital: 8000000000,
    paid_up_capital: 7590000000,
    linkedin_url: "https://www.linkedin.com/company/hdfc-bank"
  },
  {
    company_id: 6,
    cin_number: "L15140MH1933PLC002030",
    company_name: "Hindustan Unilever Limited",
    mca_registered_email: "hul.corporatecare@unilever.com",
    registered_office_address: "Unilever House, B. D. Sawant Marg, Chakala, Andheri East, Mumbai, Maharashtra 400099",
    authorized_capital: 2750000000,
    paid_up_capital: 2350000000,
    linkedin_url: "https://www.linkedin.com/company/hindustan-unilever-limited"
  },
  {
    company_id: 7,
    cin_number: "L99999MH1946PLC004768",
    company_name: "Larsen & Toubro Limited",
    mca_registered_email: "lnt.csr@larsentoubro.com",
    registered_office_address: "L&T House, Ballard Estate, Mumbai, Maharashtra 400001",
    authorized_capital: 3000000000,
    paid_up_capital: 2810000000,
    linkedin_url: "https://www.linkedin.com/company/larsen-&-toubro"
  },
  {
    company_id: 8,
    cin_number: "L16005WB1910PLC001985",
    company_name: "ITC Limited",
    mca_registered_email: "itc.socialinvestments@itc.in",
    registered_office_address: "Virginia House, 37 J.L. Nehru Road, Kolkata, West Bengal 700071",
    authorized_capital: 20000000000,
    paid_up_capital: 12430000000,
    linkedin_url: "https://www.linkedin.com/company/itc-limited"
  },
  {
    company_id: 9,
    cin_number: "L65990MH1945PLC004558",
    company_name: "Mahindra & Mahindra Limited",
    mca_registered_email: "csr.office@mahindra.com",
    registered_office_address: "Gateway Building, Apollo Bunder, Mumbai, Maharashtra 400001",
    authorized_capital: 10000000000,
    paid_up_capital: 5970000000,
    linkedin_url: "https://www.linkedin.com/company/mahindra-&-mahindra-limited"
  },
  {
    company_id: 10,
    cin_number: "L65190MH1955PLC007301",
    company_name: "State Bank of India",
    mca_registered_email: "sbi.foundation@sbi.co.in",
    registered_office_address: "State Bank Bhavan, Madame Cama Road, Nariman Point, Mumbai, Maharashtra 400021",
    authorized_capital: 50000000000,
    paid_up_capital: 8920000000
    // linkedin_url omitted to showcase LinkedIn NA fallback
  }
];

export const ScheduleViiSectors = [
  { code: "SCH7_EDU", name: "Education & Employment Vocational Skills" },
  { code: "SCH7_POV", name: "Eradicating Hunger, Poverty, Malnutrition & Healthcare" },
  { code: "SCH7_ENV", name: "Ensuring Environmental Sustainability & Ecological Balance" },
  { code: "SCH7_GND", name: "Promoting Gender Equality & Empowering Women" },
  { code: "SCH7_HER", name: "Protection of National Heritage, Art & Culture" },
  { code: "SCH7_RSP", name: "Training to Promote Rural & Paralympic Sports" },
  { code: "SCH7_RUL", name: "Rural Development Projects" },
  { code: "SCH7_SLM", name: "Slum Area Development" },
  { code: "SCH7_DIS", name: "Disaster Management & Relief Rehabilitation" },
  { code: "SCH7_TEC", name: "Technology Incubators within Academic Institutions" }
];

export const csrGrants: CsrGrantOpportunity[] = [
  {
    grant_id: 101,
    company_id: 1, // Reliance
    title: "Reliance Foundation - Digital Literacy & Smart Schools India",
    grant_type: "Education & Employment Vocational Skills",
    schedule_vii_category_code: "SCH7_EDU",
    budget_allocation: 14500000, // 1.45 Crores
    target_state: "Pan-India",
    application_deadline: "2026-08-15", // Active
    description: "Equipping public schools with modern digital labs, fiber internet, and interactive learning software to bridge the digital divide. Prioritizes municipal corporations.",
    project_duration_months: 18,
    verification_source: "MCA CDM Report 2025/26 - CSR-1 Form Filed"
  },
  {
    grant_id: 102,
    company_id: 1, // Reliance
    title: "Reliance Swasthya - Rural Pediatric Healthcare & Neonatal Units",
    grant_type: "Eradicating Hunger, Poverty, Malnutrition & Healthcare",
    schedule_vii_category_code: "SCH7_POV",
    budget_allocation: 25000000, // 2.5 Crores
    target_state: "Gujarat",
    application_deadline: "2026-07-20", // Active
    description: "Setting up advanced maternal-neonatal ICU mobile vans and rural healthcare health cards in Dwarka, Jamnagar, and surrounding tribal blocks.",
    project_duration_months: 24,
    verification_source: "Reliance Annual Report 2025 - Annexure II (CSR Summary)"
  },
  {
    grant_id: 103,
    company_id: 2, // TCS
    title: "TCS Ignite - Rural STEM Training & Skill Labs",
    grant_type: "Education & Employment Vocational Skills",
    schedule_vii_category_code: "SCH7_EDU",
    budget_allocation: 11000000, // 1.1 Crore
    target_state: "Karnataka",
    application_deadline: "2026-09-30", // Active
    description: "Vocational computer software and hardware skills training for young women from rural colleges in Dharwad, Belgaum, and Gulbarga districts.",
    project_duration_months: 12,
    verification_source: "TCS CSR-2 E-Form MCA Filling Reference"
  },
  {
    grant_id: 104,
    company_id: 2, // TCS
    title: "Catch the Rain - Smart Rainwater Harvesting Units",
    grant_type: "Ensuring Environmental Sustainability & Ecological Balance",
    schedule_vii_category_code: "SCH7_ENV",
    budget_allocation: 8500000, // 85 Lakhs
    target_state: "Maharashtra",
    application_deadline: "2026-06-30", // Active
    description: "Installing automated rooftop rainwater filtration kits in drought-prone blocks of Marathwada and Vidarbha, targeting 150 primary schools.",
    project_duration_months: 9,
    verification_source: "MCA CDM Portal Database (Registration Number CSR00030514)"
  },
  {
    grant_id: 105,
    company_id: 3, // Infosys
    title: "Infosys Foundation - Women Weavers Cooperative Livelihoods",
    grant_type: "Promoting Gender Equality & Empowering Women",
    schedule_vii_category_code: "SCH7_GND",
    budget_allocation: 18000000, // 1.8 Crores
    target_state: "West Bengal",
    application_deadline: "2026-07-10", // Active
    description: "Direct capital support, skill upgradation program, and structural market connection for handloom weavers' self-help groups managed strictly by rural women.",
    project_duration_months: 15,
    verification_source: "Infosys Board CSR Committee Approved Budget Agenda 3"
  },
  {
    grant_id: 106,
    company_id: 3, // Infosys
    title: "Aarogya Bharat - Mobile Cancer Diagnostics Clinics",
    grant_type: "Eradicating Hunger, Poverty, Malnutrition & Healthcare",
    schedule_vii_category_code: "SCH7_POV",
    budget_allocation: 32000000, // 3.2 Crores
    target_state: "Pan-India",
    application_deadline: "2026-10-15", // Active
    description: "Providing high-end diagnostic buses containing mammography, ultrasound, and digital X-ray tools to cruise deep central parts of tribal states.",
    project_duration_months: 36,
    verification_source: "MCA CDM Report 2025/26"
  },
  {
    grant_id: 107,
    company_id: 4, // Wipro
    title: "Wipro Earthian - Schools Zero-Waste & Ecology Stewardship",
    grant_type: "Ensuring Environmental Sustainability & Ecological Balance",
    schedule_vii_category_code: "SCH7_ENV",
    budget_allocation: 9500000, // 95 Lakhs
    target_state: "Tamil Nadu",
    application_deadline: "2026-06-25", // Active
    description: "Eco-education, institutional organic waste digester installations, composting setups, and training for local school environment clubs.",
    project_duration_months: 12,
    verification_source: "Wipro Social Transformation Committee Disclosures"
  },
  {
    grant_id: 108,
    company_id: 4, // Wipro
    title: "Disaster Resilient Rebuild Initiative (Uttarakhand)",
    grant_type: "Disaster Management & Relief Rehabilitation",
    schedule_vii_category_code: "SCH7_DIS",
    budget_allocation: 15000000, // 1.5 Crores
    target_state: "Uttarakhand",
    application_deadline: "2026-08-01", // Active
    description: "Reconstructing earthquake-resistant community halls and evacuation routes equipped with clean solar mini-grids off landslide risk-zones.",
    project_duration_months: 18,
    verification_source: "Corporate CSR Committee Special Emergency Allocation"
  },
  {
    grant_id: 109,
    company_id: 5, // HDFC Bank
    title: "HDFC Parivartan - Rural Agro-forestry & Integrated Farming",
    grant_type: "Ensuring Environmental Sustainability & Ecological Balance",
    schedule_vii_category_code: "SCH7_ENV",
    budget_allocation: 21500000, // 2.15 Crores
    target_state: "Maharashtra",
    application_deadline: "2026-07-31", // Active
    description: "Enabling marginal smallholder farmers in Wardha & Yavatmal to transition to certified multi-tier agro-forestry, with drip-irrigation infrastructure grant.",
    project_duration_months: 24,
    verification_source: "MCA Form CSR-1 Reference CSR0001095"
  },
  {
    grant_id: 110,
    company_id: 5, // HDFC Bank
    title: "HDFC Skill Development Academy for Differently-Abled Youth",
    grant_type: "Education & Employment Vocational Skills",
    schedule_vii_category_code: "SCH7_EDU",
    budget_allocation: 12000000, // 1.2 Crores
    target_state: "Pan-India",
    application_deadline: "2026-08-30", // Active
    description: "Developing custom training curriculum, multi-sensory labs, and direct placement support for autistic and visually impaired high-school pass-outs.",
    project_duration_months: 12,
    verification_source: "HDFC Social Impact Board Minutes 2025"
  },
  {
    grant_id: 111,
    company_id: 6, // Hindustan Unilever
    title: "Prabhat Water Communes - Lake Desiltation & Restoration",
    grant_type: "Ensuring Environmental Sustainability & Ecological Balance",
    schedule_vii_category_code: "SCH7_ENV",
    budget_allocation: 16000000, // 1.6 Crores
    target_state: "Tamil Nadu",
    application_deadline: "2026-09-15", // Active
    description: "Decentralized water governance, desiling reservoirs, and restoring check-dams in watershed basins around industrial zones.",
    project_duration_months: 18,
    verification_source: "Hindustan Unilever Master MCA filings CSR-2"
  },
  {
    grant_id: 112,
    company_id: 6, // Hindustan Unilever
    title: "Project Shakti - Women Micro-Entrepreneurship Tech Enablement",
    grant_type: "Promoting Gender Equality & Empowering Women",
    schedule_vii_category_code: "SCH7_GND",
    budget_allocation: 28000000, // 2.8 Crores
    target_state: "Uttar Pradesh",
    application_deadline: "2026-07-15", // Active
    description: "Supplying 2,000 rural women entrepreneurs with micro-billing custom tablets, inventory tracking software, and initial business support.",
    project_duration_months: 12,
    verification_source: "HUL Corporate Responsibility Disclosures"
  },
  {
    grant_id: 113,
    company_id: 7, // L&T
    title: "L&T Build India - Construction Mechanics Skill Certification",
    grant_type: "Education & Employment Vocational Skills",
    schedule_vii_category_code: "SCH7_EDU",
    budget_allocation: 19500000, // 1.95 Crores
    target_state: "Gujarat",
    application_deadline: "2026-08-10", // Active
    description: "Certifying high-rigor mechanical, electrical, and mason-handling skills for disadvantaged migrant youths to build standard livelihoods.",
    project_duration_months: 9,
    verification_source: "MCA Corporate Data Portal (Reference CSR_LT_2025_0019)"
  },
  {
    grant_id: 114,
    company_id: 7, // L&T
    title: "Emergency Cyclone-Proof Shelter Engineering",
    grant_type: "Disaster Management & Relief Rehabilitation",
    schedule_vii_category_code: "SCH7_DIS",
    budget_allocation: 30000000, // 3.0 Crores
    target_state: "Odisha",
    application_deadline: "2026-06-20", // Active
    description: "Design-build of standard high-wind resistant reinforced concrete safety shelters in remote vulnerability pockets within coastal districts.",
    project_duration_months: 15,
    verification_source: "L&T Engineering Social Division CSR Authorization Form"
  },
  {
    grant_id: 115,
    company_id: 8, // ITC
    title: "ITC e-Choupal Rural Watershed Development Program",
    grant_type: "Rural Development Projects",
    schedule_vii_category_code: "SCH7_RUL",
    budget_allocation: 45000000, // 4.5 Crores
    target_state: "Madhya Pradesh",
    application_deadline: "2026-11-30", // Active
    description: "Transformative land and water stewardship, soil quality improvements, contour bunds, and creating institutional farming committees in 120 villages.",
    project_duration_months: 36,
    verification_source: "ITC Board CSR Allocation CSR-4012"
  },
  {
    grant_id: 116,
    company_id: 8, // ITC
    title: "ITC Mission Sunehra Kal - Rural Sports Academy Setup",
    grant_type: "Training to Promote Rural & Paralympic Sports",
    schedule_vii_category_code: "SCH7_RSP",
    budget_allocation: 12500000, // 1.25 Crores
    target_state: "Punjab",
    application_deadline: "2026-07-28", // Active
    description: "Creating top-tier grassroots rural athletics and archery centers, supplying equipment, and hiring skilled certified trainers for girl teams.",
    project_duration_months: 24,
    verification_source: "MCA CSR Filing Database CSR000281"
  },
  {
    grant_id: 117,
    company_id: 9, // Mahindra
    title: "Mahindra Hariyali - Urban Slum Micro-Forests & Air Purifying",
    grant_type: "Slum Area Development",
    schedule_vii_category_code: "SCH7_SLM",
    budget_allocation: 7500000, // 75 Lakhs
    target_state: "Maharashtra",
    application_deadline: "2026-06-18", // Active
    description: "Creating dense Miyawaki urban forest pockets to elevate air filtration and micro-climate control in densely packed slums of Dharavi and Kurla.",
    project_duration_months: 12,
    verification_source: "Mahindra & Mahindra CSR Registry File Vol IV"
  },
  {
    grant_id: 118,
    company_id: 10, // SBI
    title: "SBI Youth for India Fellowship - Grassroot Leadership Support",
    grant_type: "Rural Development Projects",
    schedule_vii_category_code: "SCH7_RUL",
    budget_allocation: 35000000, // 3.5 Crores
    target_state: "Pan-India",
    application_deadline: "2026-10-01", // Active
    description: "Funding dynamic fellowships to implement rural tech, sanitation, crop preservation, and digital banking literacy models in remote states.",
    project_duration_months: 24,
    verification_source: "SBI Foundation Registrar Audit File 2025"
  },
  {
    grant_id: 119,
    company_id: 10, // SBI
    title: "Heritage Restoration - Konark Sun Temple Ancillary Sites",
    grant_type: "Protection of National Heritage, Art & Culture",
    schedule_vii_category_code: "SCH7_HER",
    budget_allocation: 14000000, // 1.4 Crores
    target_state: "Odisha",
    application_deadline: "2026-08-25", // Active
    description: "Restoring water systems, deploying structural monitors in sandstone sites, and building clean visitor interpretation centers with zero commercialization.",
    project_duration_months: 18,
    verification_source: "SBI Foundation CSR Committee Registry - Index 4"
  },

  // EXPIRED OPPORTUNITIES (To prove the automatic filter works live!)
  {
    grant_id: 201,
    company_id: 3, // Infosys
    title: "Infosys Covid Relief - Critical Emergency Oxygen Concentrators",
    grant_type: "Disaster Management & Relief Rehabilitation",
    schedule_vii_category_code: "SCH7_DIS",
    budget_allocation: 28000000,
    target_state: "Karnataka",
    application_deadline: "2025-12-31", // EXPIRED
    description: "Emergency grant awarded to verify, build, and deploy emergency high-volume PSA Oxygen generation plants across and inside taluka hospitals.",
    project_duration_months: 6,
    verification_source: "Infosys Foundation Archived Grant Disclosures v1.3"
  },
  {
    grant_id: 202,
    company_id: 5, // HDFC Bank
    title: "HDFC Flood Mitigation - Chennai Urban Catchment Restoration",
    grant_type: "Disaster Management & Relief Rehabilitation",
    schedule_vii_category_code: "SCH7_DIS",
    budget_allocation: 12000000,
    target_state: "Tamil Nadu",
    application_deadline: "2026-04-15", // EXPIRED
    description: "Urgent engineering restoration of native flood spillway canals, check gates, and localized retaining structures to offset heavy monsoon blockages.",
    project_duration_months: 8,
    verification_source: "HDFC Parivartan Special Board Action - CSR00412"
  },
  {
    grant_id: 203,
    company_id: 9, // Mahindra
    title: "Nanhi Kali - Primary Girls Education Material Support",
    grant_type: "Promoting Gender Equality & Empowering Women",
    schedule_vii_category_code: "SCH7_GND",
    budget_allocation: 14000000,
    target_state: "Rajasthan",
    application_deadline: "2026-05-20", // EXPIRED (since current date is 2026-06-09)
    description: "Sponsoring school kits, study material, and academic tutoring support for underprivileged girls in Udaipur and Sirohi districts.",
    project_duration_months: 12,
    verification_source: "K.C. Mahindra Education Trust MCA Audit Report"
  }
];
