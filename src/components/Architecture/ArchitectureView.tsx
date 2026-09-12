import React, { useState } from 'react';
import {
  Server,
  Database,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  DollarSign,
  Copy,
  Check,
  Cloud,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'stack' | 'database' | 'engine' | 'economics'>('stack');

  const copySqlSchema = () => {
    navigator.clipboard.writeText(PRODUCTION_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 space-y-8">
      {/* Hero Title */}
      <div className="max-w-5xl mx-auto space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-2.5 py-0.5 rounded-full">
            Expert SaaS Architecture & Scalability Blueprint
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
            Production Ready
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
          Tex2PDF Technical Architecture & Scalable Database Solution
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Based on the product roadmap from the README, here is the comprehensive technical strategy designed for high throughput, sub-second document compilation, low cloud unit costs, and horizontal multi-tenant scale.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-5xl mx-auto border-b border-slate-200 flex space-x-4 text-xs font-semibold">
        {[
          { id: 'stack', label: '1. Recommended Tech Stack', icon: Server },
          { id: 'database', label: '2. Scalable Database & Schema', icon: Database },
          { id: 'engine', label: '3. Document Engine & Export', icon: Cpu },
          { id: 'economics', label: '4. Pricing & Unit Economics', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 flex items-center space-x-1.5 border-b-2 transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TECH STACK MATRIX */}
      {activeTab === 'stack' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Frontend */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <span>Frontend Layer</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p><strong>Framework:</strong> Next.js (App Router) + React 19 + TypeScript</p>
                <p><strong>Styling:</strong> Tailwind CSS v4</p>
                <p><strong>State & Editing:</strong> Tiptap / Prosemirror Document AST</p>
                <p><strong>Motion:</strong> Motion library for responsive interactions</p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <strong>Why:</strong> Next.js offers instantaneous SSR for public landing pages and SEO templates, while client-side canvas handles typing at 60 FPS without server round-trips.
              </div>
            </div>

            {/* Backend */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm">
                <Server className="w-4 h-4" />
                <span>Backend & Services</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p><strong>Primary API:</strong> Node.js (TypeScript) / Express / NestJS</p>
                <p><strong>AI & Analytics Engine:</strong> Python (FastAPI)</p>
                <p><strong>Job Queue:</strong> BullMQ + Redis for asynchronous PDF render jobs</p>
                <p><strong>Runtime:</strong> Containerized Docker on Google Cloud Run</p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <strong>Why:</strong> Decouples fast user-facing CRUD APIs from heavy PDF generation and AI pipelines that scale independently to zero.
              </div>
            </div>

            {/* Database & Storage */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>Persistence & Storage</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p><strong>Relational DB:</strong> PostgreSQL on Cloud SQL / Supabase</p>
                <p><strong>Semantic Search:</strong> pgvector extension for AI search</p>
                <p><strong>Object Storage:</strong> Google Cloud Storage / AWS S3 with CDN</p>
                <p><strong>Caching & Sessions:</strong> Redis (MemoryStore / Upstash)</p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <strong>Why:</strong> PostgreSQL with JSONB stores flexible document schemas while enforcing relational integrity for billing, permissions, and audit logs.
              </div>
            </div>

            {/* AI Layer */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI Document Intelligence</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p><strong>Primary Foundation Model:</strong> Gemini 3.8 Flash</p>
                <p><strong>SDK:</strong> @google/genai TypeScript SDK</p>
                <p><strong>Embedding:</strong> gemini-embedding-2-preview</p>
                <p><strong>Features:</strong> Prompt-to-doc, rewriting, translation, Q&A</p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <strong>Why:</strong> Gemini 3.8 Flash delivers industry-leading latency, 1M token context window, and fraction-of-a-cent pricing ideal for under-$5/mo SaaS plans.
              </div>
            </div>

            {/* Payments & Global Accessibility */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Global & African Payments</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p><strong>International:</strong> Stripe Billing / LemonSqueezy</p>
                <p><strong>African / Regional:</strong> Flutterwave / Paystack / CinetPay</p>
                <p><strong>Payment Methods:</strong> Mobile Money (MTN MoMo, Orange Money), Cards</p>
                <p><strong>Billing Models:</strong> Monthly subscription, team seat licenses</p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <strong>Why:</strong> Fulfills the README mandate for African accessibility and multi-currency billing across global users.
              </div>
            </div>

            {/* Security & Multi-tenancy */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Security & RBAC</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p><strong>Auth:</strong> JWT + Session Tokens / Supabase Auth</p>
                <p><strong>Access Control:</strong> Row-Level Security (RLS) + RBAC</p>
                <p><strong>Encryption:</strong> AES-256 for documents at rest, TLS 1.3 in transit</p>
                <p><strong>Signatures:</strong> Cryptographic SHA-256 document hashes</p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <strong>Why:</strong> Ensures strict tenant isolation so enterprise customers and freelancers have watertight data boundaries.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE DESIGN & SQL SCHEMA */}
      {activeTab === 'database' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Recommended PostgreSQL Database Architecture</h3>
                <p className="text-xs text-slate-500">
                  Normalized multi-tenant schema with JSONB document models, partitionable versions, and pgvector embeddings.
                </p>
              </div>
              <button
                id="btn-copy-sql"
                onClick={copySqlSchema}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            {/* SQL Code Block */}
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-950 text-slate-200 p-4 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto">
              <pre>{PRODUCTION_SQL_SCHEMA}</pre>
            </div>

            {/* Key Scalability Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">1. Partitioned Version History</span>
                The <code>document_versions</code> table is partitioned by <code>created_at</code> (monthly). This ensures the active <code>documents</code> table remains blistering fast while version history never degrades query performance.
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">2. Semantic Search with pgvector</span>
                The <code>embedding vector(768)</code> column allows users to perform AI searches like <em>"Find the proposal where I requested 10M FCFA for poultry"</em> using cosine distance indexing.
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">3. Immutable Storage Links</span>
                Generated PDFs and binary assets are stored in S3 / GCS, with only the signed URL / metadata recorded in PostgreSQL, preventing database bloat.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: THE DOCUMENT ENGINE */}
      {activeTab === 'engine' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">The "Document Engine" Principle</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              As emphasized in Section 12 of your product vision: <em>"Tex2PDF should not be fundamentally built around PDF. It should be built around a standardized internal document representation (AST)."</em>
            </p>

            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg text-xs space-y-2 text-blue-950 font-mono">
              <p className="font-bold">Standardized Workflow:</p>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="bg-white px-2 py-1 rounded border border-blue-200">User Content / AI Prompt</span>
                <span>➔</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded">Document Semantic AST (JSON)</span>
                <span>➔</span>
                <span className="bg-white px-2 py-1 rounded border border-blue-200">Pluggable Renderers</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 text-sm">PDF Renderer</span>
                <p className="text-slate-600">
                  Direct vector generation (client-side via jsPDF for zero-wait downloads, plus serverless Chromium / Typst workers for batch or high-page documents).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 text-sm">DOCX & Office Renderer</span>
                <p className="text-slate-600">
                  Converts the AST to OpenXML format (.docx), allowing enterprise clients to open and edit seamlessly inside Microsoft Word.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 text-sm">Markdown & Web Renderer</span>
                <p className="text-slate-600">
                  Outputs clean Markdown (.md) or self-contained HTML with embedded CSS for web publishing, email newsletters, or Notion export.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SAAS PRICING & UNIT ECONOMICS */}
      {activeTab === 'economics' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
            <div>
              <h3 className="font-bold text-base text-slate-900">SaaS Unit Economics & Pricing Feasibility</h3>
              <p className="text-xs text-slate-500">
                Validation of your strategic pricing targets: <strong>Under $5/month</strong> (Personal/Students) and <strong>Under $10/month</strong> (Pro).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Free Tier</span>
                  <span className="text-lg font-extrabold text-slate-900">$0</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li>• 5 documents / month</li>
                  <li>• Basic formatting & PDF download</li>
                  <li>• 5 AI Polish operations / month</li>
                  <li>• Standard templates</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border-2 border-blue-600 bg-blue-50/30 space-y-3 relative">
                <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Target Market
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">Personal & Students</span>
                  <span className="text-lg font-extrabold text-blue-950">$4.99 <span className="text-xs font-normal">/mo</span></span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li>• Unlimited documents & PDFs</li>
                  <li>• 150 AI generations / month</li>
                  <li>• Version history (30 days)</li>
                  <li>• Mobile Money + Card support</li>
                </ul>
                <div className="pt-2 border-t border-blue-200 text-[11px] text-emerald-700 font-semibold">
                  Est. Gross Margin: 86.4%
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Pro & Freelancers</span>
                  <span className="text-lg font-extrabold text-slate-900">$9.99 <span className="text-xs font-normal">/mo</span></span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li>• Unlimited documents & PDF vector export</li>
                  <li>• 500 AI generations + translations</li>
                  <li>• Custom branding & running headers</li>
                  <li>• Permanent version history & cloud storage</li>
                </ul>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold">
                  Est. Gross Margin: 82.1%
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-950 space-y-1">
              <span className="font-bold">Cost Breakdown per Active User ($4.99 plan):</span>
              <p>• Gemini 3.8 Flash API (~100 calls x $0.0004): <strong>~$0.04</strong></p>
              <p>• PostgreSQL + Storage compute per user: <strong>~$0.18</strong></p>
              <p>• Payment Gateway fees (Stripe 2.9% + 30¢ / MoMo 1.5%): <strong>~$0.44</strong></p>
              <p className="font-bold text-emerald-900 pt-1">➔ Total Variable Cost: ~$0.66/user | Net Profit: ~$4.33/user</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PRODUCTION_SQL_SCHEMA = `-- ====================================================================
-- TEX2PDF PRODUCTION POSTGRESQL MULTI-TENANT SCHEMA
-- Designed for Cloud SQL / Supabase with Row Level Security (RLS)
-- ====================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- for semantic AI document search

-- 2. Organizations / Tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'free' CHECK (plan_tier IN ('free', 'personal', 'pro', 'business')),
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workspaces (Supports team & personal workspaces)
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_personal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Document Folders
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    color VARCHAR(20) DEFAULT '#3b82f6',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Primary Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    created_by UUID NOT NULL, -- references auth.users
    title VARCHAR(300) NOT NULL DEFAULT 'Untitled Document',
    category VARCHAR(50) DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Content stored in AST / Markdown representation
    content TEXT NOT NULL DEFAULT '',
    
    -- Document layout & page formatting configuration (JSONB)
    page_setup JSONB NOT NULL DEFAULT '{
        "paperSize": "a4",
        "orientation": "portrait",
        "margin": "normal",
        "fontFamily": "sans",
        "fontSize": 11,
        "lineHeight": 1.5,
        "headerText": "",
        "footerText": "",
        "showPageNumbers": true,
        "accentColor": "#1e3a8a"
    }'::jsonb,
    
    -- Semantic vector embedding for AI search (768 dimensions)
    embedding vector(768),
    
    word_count INT DEFAULT 0,
    character_count INT DEFAULT 0,
    current_version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Partitioned Document Versions Table (Range Partitioning by Month)
CREATE TABLE document_versions (
    id UUID DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    label VARCHAR(200) NOT NULL DEFAULT 'Auto-save snapshot',
    content_snapshot TEXT NOT NULL,
    page_setup_snapshot JSONB NOT NULL,
    word_count INT NOT NULL,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- 7. High-Performance Indexes
CREATE INDEX idx_docs_workspace ON documents (workspace_id, updated_at DESC);
CREATE INDEX idx_docs_folder ON documents (folder_id) WHERE folder_id IS NOT NULL;
CREATE INDEX idx_docs_favorite ON documents (workspace_id) WHERE is_favorite = TRUE;
CREATE INDEX idx_docs_embedding ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 8. Row Level Security (RLS) Policy Example
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access documents in their workspaces"
ON documents
FOR ALL
USING (
    workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
);`;
