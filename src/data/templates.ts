import { DocumentTemplate } from '../types/document';

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'student-research-paper',
    title: 'Academic Essay & Research Paper',
    category: 'education',
    badge: 'Student Choice',
    description: 'Standard academic essay format with title block, abstract, structured sections, and references.',
    defaultSettings: {
      fontFamily: 'serif',
      fontSize: 12,
      lineHeight: 1.6,
      accentColor: '#1e3a8a',
      headerText: 'Academic Research • University Submission',
      footerText: 'Department of Science & Humanities',
      showPageNumbers: true,
      paperSize: 'a4',
      margin: 'normal',
    },
    content: `<h1>The Impact of Renewable Micro-Grids on Rural African Economies</h1>
<p style="color: #64748b; font-size: 13px;"><strong>Author:</strong> Samuel K. Junior | <strong>Course:</strong> Applied Economics 301 | <strong>Date:</strong> Fall Semester 2026</p>
<hr/>

<h2>Abstract</h2>
<p>This paper investigates the economic multiplier effect of decentralized solar micro-grids across sub-Saharan farming communities. By reducing reliance on imported kerosene and diesel generators, rural micro-grids increase productive business hours, lower food spoilage rates through cold storage, and stimulate local commerce by an estimated 28% within the first twelve months of deployment.</p>

<h2>1. Introduction & Background</h2>
<p>Energy poverty remains one of the primary constraints to agricultural value-addition across rural communities. Smallholder farmers frequently operate without mechanical refrigeration or evening lighting, forcing them to sell fresh produce at steep market discounts to avoid total post-harvest spoilage.</p>
<p>Recent advances in localized photovoltaic storage systems offer a cost-effective alternative to expensive national grid extension projects.</p>

<h2>2. Key Findings & Economic Indicators</h2>
<p>Data collected across twelve test communities demonstrates significant gains across both household savings and commercial revenue:</p>

<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Community Sector</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Pre-Grid Baseline</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Post-Grid 12-Month</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Net Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Cold Storage Facilities</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">2 Units</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">9 Units</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; color: #16a34a;">+350%</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Average Night Trading Hours</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">1.5 Hours</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">4.5 Hours</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; color: #16a34a;">+200%</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Monthly Energy Expenditure</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">$48 / household</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">$18 / household</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; color: #2563eb;">-62.5%</td>
    </tr>
  </tbody>
</table>

<div class="page-break" style="margin: 20px 0; padding: 6px; background-color: #eff6ff; border: 1px dashed #3b82f6; text-align: center; font-size: 11px; color: #1d4ed8; font-weight: bold;">--- Page Break (Page 2) ---</div>

<h2>3. Policy Recommendations</h2>
<p>To maximize rural electrification ROI, municipal development agencies should prioritize:</p>
<ul>
  <li>Standardizing zero-tariff import policies on high-efficiency lithium phosphate battery cells.</li>
  <li>Providing micro-financing guarantees for agricultural processing machinery such as grain mills and water pumps.</li>
  <li>Establishing localized technical vocational training centers for solar equipment maintenance.</li>
</ul>

<h2>References & Works Cited</h2>
<ol>
  <li>African Development Bank. (2025). <em>Decentralized Energy in Sub-Saharan Agriculture</em>. Abidjan: AfDB Publishing.</li>
  <li>World Bank Group. (2024). <em>State of the Global Mini-Grids Market Report</em>. Washington, D.C.</li>
  <li>Mbeki, T., &amp; Kamau, N. (2025). "Solar Storage Economics in Rural West Africa." <em>Journal of Development Studies</em>, 41(3), 215-230.</li>
</ol>`,
  },

  {
    id: 'student-resume-cv',
    title: 'Modern Student & Graduate Resume',
    category: 'personal',
    badge: 'Popular',
    description: 'Clean, elegant single-page resume highlighting education, technical skills, projects, and leadership.',
    defaultSettings: {
      fontFamily: 'sans',
      fontSize: 10.5,
      lineHeight: 1.45,
      accentColor: '#0f766e',
      headerText: 'Alex Morgan • Curriculum Vitae',
      footerText: 'References Available Upon Request',
      showPageNumbers: false,
      paperSize: 'a4',
      margin: 'compact',
    },
    content: `<h1>Alex Morgan</h1>
<p style="color: #475569; font-size: 13px;">Yaoundé, Cameroon • (+237) 670-000-000 • alex.morgan@email.com • linkedin.com/in/alexmorgan</p>
<hr/>

<h2>Education</h2>
<p><strong>University of Buea</strong> — Bachelor of Science in Software Engineering<br/>
<span style="color: #64748b;">Graduation: June 2026 | GPA: 3.82 / 4.0 (Dean's Honors List)</span></p>
<ul>
  <li>Relevant Coursework: Data Structures, Database Systems, Distributed Architecture, UI/UX Engineering.</li>
  <li>President, Association of Computing Students (2024–2026).</li>
</ul>

<h2>Core Competencies & Technical Skills</h2>
<ul>
  <li><strong>Programming & Web:</strong> TypeScript, JavaScript, Python, React, Next.js, HTML5/CSS3, Tailwind CSS.</li>
  <li><strong>Databases & Cloud:</strong> PostgreSQL, Supabase, Redis, Docker, Git, Google Cloud Platform.</li>
  <li><strong>Soft Skills:</strong> Technical Writing, Project Management, Agile Collaboration, Bilingual (English & French).</li>
</ul>

<h2>Key Projects</h2>
<p><strong>Tex2PDF Document Platform</strong> | <em>Full-Stack Lead Developer</em></p>
<ul>
  <li>Engineered a responsive, web-based document workspace allowing users to format and export multi-page PDFs in real time.</li>
  <li>Architected high-throughput client-side document rendering with instant sub-second vector compilation.</li>
  <li>Integrated automated pagination and custom page-break controls optimized for mobile devices.</li>
</ul>

<p><strong>AgriTrack Logistics Mobile App</strong> | <em>Frontend Developer</em></p>
<ul>
  <li>Built offline-first mobile web application enabling rural poultry farmers to record inventory and track daily egg sales.</li>
  <li>Designed responsive touch interfaces serving over 1,200 active weekly cooperative farmers.</li>
</ul>

<h2>Leadership & Volunteer Experience</h2>
<p><strong>Lead Mentor</strong> — CodeCameroon High School Tech Bootcamp (2025)<br/>
<span style="color: #64748b;">Trained 45 high school students in foundational programming, web design, and algorithmic problem-solving.</span></p>`,
  },

  {
    id: 'poultry-farm-proposal',
    title: 'Commercial Business Proposal',
    category: 'business',
    badge: 'Executive',
    description: 'Complete investment proposal with background, funding table, revenue projections, and formal sign-offs.',
    defaultSettings: {
      fontFamily: 'sans',
      fontSize: 11,
      lineHeight: 1.5,
      accentColor: '#1e3a8a',
      headerText: 'AgriGrowth Enterprises • Commercial Proposal',
      footerText: 'Confidential & Proprietary',
      showPageNumbers: true,
      paperSize: 'a4',
      margin: 'normal',
    },
    content: `<h1>Commercial Expansion Proposal</h1>
<h2 style="color: #1e3a8a;">High-Yield Poultry Production & Cold-Chain Facility</h2>

<p><strong>Prepared For:</strong> Agricultural Investment Committee<br/>
<strong>Prepared By:</strong> AgriGrowth Enterprises Ltd.<br/>
<strong>Target Capital:</strong> 10,000,000 FCFA ($16,500 USD) | <strong>Date:</strong> September 2026</p>
<hr/>

<h2>1. Executive Summary</h2>
<p>AgriGrowth Enterprises is scaling its existing poultry farming operations to address local protein shortages. Operating at 94% efficiency with current facilities, this capital infusion will fund an automated climate-controlled poultry house and a solar-powered cold storage facility to triple monthly capacity.</p>

<h2>2. Projected Growth Metrics</h2>
<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
  <thead>
    <tr style="background-color: #f8fafc;">
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Operational Metric</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Current Phase</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Target Phase</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Projected Change</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Flock Size per Cycle</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">2,500 birds</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">12,000 birds</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; color: #16a34a;">+380%</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Production Cycle Duration</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">42 Days</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">38 Days</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; color: #2563eb;">-9.5% Faster</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Estimated Monthly Revenue</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">3,200,000 FCFA</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">14,800,000 FCFA</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; color: #16a34a;">+362%</td>
    </tr>
  </tbody>
</table>

<div class="page-break" style="margin: 20px 0; padding: 6px; background-color: #eff6ff; border: 1px dashed #3b82f6; text-align: center; font-size: 11px; color: #1d4ed8; font-weight: bold;">--- Page Break (Page 2) ---</div>

<h2>3. Capital Allocation Breakdown</h2>
<p>The total requested capital of 10,000,000 FCFA will be deployed across critical infrastructure assets:</p>
<ul>
  <li><strong>Civil Construction & Automated Ventilation:</strong> 4,200,000 FCFA (42%)</li>
  <li><strong>Solar Cold-Chain Storage (5-ton capacity):</strong> 3,100,000 FCFA (31%)</li>
  <li><strong>Biosecurity, Vaccination & Disinfection Bays:</strong> 1,200,000 FCFA (12%)</li>
  <li><strong>Working Capital (Initial High-Protein Feed Stock):</strong> 1,500,000 FCFA (15%)</li>
</ul>

<h2>4. Signatures & Authorization</h2>
<table style="width: 100%; border: none; margin-top: 30px;">
  <tr>
    <td style="width: 50%; padding: 10px; vertical-align: bottom;">
      <p style="border-top: 1px solid #334155; padding-top: 5px; font-size: 12px;">
        <strong>Managing Director</strong><br/>
        AgriGrowth Enterprises Ltd.<br/>
        Date: September 11, 2026
      </p>
    </td>
    <td style="width: 50%; padding: 10px; vertical-align: bottom;">
      <p style="border-top: 1px solid #334155; padding-top: 5px; font-size: 12px;">
        <strong>Investment Director</strong><br/>
        Credit Committee Representative<br/>
        Date: ________________________
      </p>
    </td>
  </tr>
</table>`,
  },

  {
    id: 'itemized-invoice',
    title: 'Professional Service Invoice',
    category: 'business',
    badge: 'Finance',
    description: 'Clean, formatted billing invoice with itemized line items, totals, tax calculation, and payment details.',
    defaultSettings: {
      fontFamily: 'sans',
      fontSize: 11,
      lineHeight: 1.45,
      accentColor: '#1e3a8a',
      headerText: 'INVOICE #INV-2026-089',
      footerText: 'Payment Due Within 14 Days • Thank you for your business',
      showPageNumbers: false,
      paperSize: 'a4',
      margin: 'normal',
    },
    content: `<h1>INVOICE</h1>
<p style="color: #64748b; font-size: 13px;"><strong>Invoice No:</strong> #INV-2026-089 | <strong>Issue Date:</strong> September 11, 2026 | <strong>Due Date:</strong> September 25, 2026</p>
<hr/>

<table style="width: 100%; border: none; margin-bottom: 20px;">
  <tr>
    <td style="width: 50%; vertical-align: top;">
      <h3 style="margin-top: 0;">Billed From:</h3>
      <p style="font-size: 12px; line-height: 1.5;">
        <strong>Creative Digital Studio Ltd.</strong><br/>
        45 Commercial Avenue, Suite 300<br/>
        contact@creativestudio.com<br/>
        Tax ID: CM-9023481-B
      </p>
    </td>
    <td style="width: 50%; vertical-align: top;">
      <h3 style="margin-top: 0;">Billed To:</h3>
      <p style="font-size: 12px; line-height: 1.5;">
        <strong>Sunrise Retail Group</strong><br/>
        Attention: Accounts Payable<br/>
        billing@sunrisegroup.com<br/>
        Douala, Cameroon
      </p>
    </td>
  </tr>
</table>

<h2>Itemized Services Rendered</h2>
<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Description</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">Hours</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Rate</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">E-Commerce Web Portal UI Redesign</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">35 hrs</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$45.00</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$1,575.00</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Mobile Checkout Integration & Testing</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">20 hrs</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$50.00</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$1,000.00</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">Cloud Server Setup & CDN Security Hardening</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">10 hrs</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$55.00</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$550.00</td>
    </tr>
    <tr style="background-color: #f8fafc; font-weight: bold;">
      <td colspan="3" style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Subtotal:</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$3,125.00</td>
    </tr>
    <tr style="background-color: #f8fafc; font-weight: bold;">
      <td colspan="3" style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Sales Tax (5%):</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$156.25</td>
    </tr>
    <tr style="background-color: #eff6ff; font-weight: bold; font-size: 13px; color: #1e3a8a;">
      <td colspan="3" style="border: 1px solid #cbd5e1; padding: 10px; text-align: right;">Total Balance Due:</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px; text-align: right;">$3,281.25</td>
    </tr>
  </tbody>
</table>

<h2>Payment Methods</h2>
<ul>
  <li><strong>Bank Transfer:</strong> Ecobank Cameroon | Account: 0102-4938-1920-44</li>
  <li><strong>Mobile Money:</strong> MTN MoMo (+237 670-000-000) or Orange Money (+237 690-000-000)</li>
  <li><strong>Wire Transfer:</strong> Swift Code: ECOBCMXXX</li>
</ul>`,
  },

  {
    id: 'formal-cover-letter',
    title: 'Formal Letter & Job Application',
    category: 'personal',
    badge: 'Career',
    description: 'Clean, formatted business letter with sender/recipient addresses, subject line, and signature.',
    defaultSettings: {
      fontFamily: 'serif',
      fontSize: 11.5,
      lineHeight: 1.5,
      accentColor: '#0f172a',
      headerText: 'Application for Senior Software Developer Position',
      footerText: 'Confidential Application',
      showPageNumbers: false,
      paperSize: 'a4',
      margin: 'normal',
    },
    content: `<p style="font-size: 12px; line-height: 1.4;">
  <strong>Jordan Ngu</strong><br/>
  Quartier Bastos, Yaoundé<br/>
  jordan.ngu@email.com • (+237) 670-111-222<br/>
  September 11, 2026
</p>

<p style="font-size: 12px; line-height: 1.4; margin-top: 20px;">
  <strong>Hiring Committee</strong><br/>
  African Tech Ventures Hub<br/>
  Douala Innovation Center
</p>

<h2>Subject: Application for Senior Software Developer & Tech Lead</h2>

<p>Dear Hiring Committee,</p>

<p>I am writing to express my enthusiastic interest in the Senior Software Developer position at African Tech Ventures. Having followed your organization's work in empowering youth and regional businesses through digital technology, I am excited by the opportunity to bring my six years of full-stack engineering and product design experience to your growing engineering team.</p>

<p>Throughout my professional career, I have focused on building performant, accessible digital tools that solve tangible problems. Notably, at my previous role:</p>
<ul>
  <li>Led a team of four developers to build a high-performance web platform that grew to over 50,000 monthly active users.</li>
  <li>Reduced page load times and document export latency by 68% by decoupling rendering pipelines.</li>
  <li>Championed mobile-first user interfaces to ensure students and professionals on varying internet connections could work without disruption.</li>
</ul>

<p>I would welcome the opportunity to discuss how my technical expertise and passion for building transformative software products align with your organization's mission.</p>

<p>Thank you very much for your time and consideration.</p>

<p style="margin-top: 30px;">
  Sincerely,<br/><br/>
  <strong>Jordan Ngu</strong>
</p>`,
  },
];
