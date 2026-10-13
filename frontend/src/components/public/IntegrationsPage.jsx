import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  ExternalLink,
  Layers,
  Server,
  ArrowRight,
  Terminal,
  Cpu,
  Search,
  Check
} from 'lucide-react';
import { LandingNav } from '../landing/LandingNav';
import { LandingFooter } from '../landing/LandingFooter';
import { navigate } from '../../utils/router';

const INTEGRATIONS_LIST = [
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Hosting & Deployment',
    status: 'Available',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Synchronize SecretVault environments into Vercel projects and preview deployment targets.',
    capabilities: [
      'Two-way environment variable synchronization',
      'Scoped mapping to Production, Preview, and Development targets',
      'Real-time drift detection and reconciliation',
      'Triggered rebuilds upon secret rotation'
    ],
    docSection: 'vercel-integration'
  },
  {
    id: 'render',
    name: 'Render',
    category: 'Hosting & Deployment',
    status: 'Available',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Sync environment groups and service secrets into Render web services, cron jobs, and background workers.',
    capabilities: [
      'Automatic Render environment group synchronization',
      'Zero-downtime rolling deploys upon rotation',
      'Continuous checksum drift analysis',
      'Audit log attribution for sync events'
    ],
    docSection: 'render-integration'
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes Operator',
    category: 'Cloud & Infrastructure',
    status: 'Available',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Reconcile secrets directly into native Kubernetes Secrets via the SecretVaultSync CRD.',
    capabilities: [
      'Native CRD (SecretVaultSync) architecture',
      'Automated rolling deployment restarts on secret updates',
      'Configurable poll intervals and error backoffs',
      'Service account token authentication'
    ],
    docSection: 'k8s-operator'
  },
  {
    id: 'terraform',
    name: 'Terraform Provider',
    category: 'Infrastructure as Code',
    status: 'Available',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Declaratively provision workspaces, projects, environments, and policies using Terraform HCL.',
    capabilities: [
      'Full CRUD for workspaces, projects, and environments',
      'Role and permission assignment resources',
      'State drift detection with terraform plan',
      'Sensitive value masking in state files'
    ],
    docSection: 'terraform-provider'
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'CI/CD & Automation',
    status: 'Available',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Inject secrets dynamically into GitHub Actions pipelines using keyless OIDC authentication.',
    capabilities: [
      'Keyless RFC 7519 OIDC token exchange',
      'Zero permanent credentials in repository secrets',
      'Automatic log masking across all workflow steps',
      'Short-lived 600s session token lifespan'
    ],
    docSection: 'github-actions'
  },
  {
    id: 'aws-kms',
    name: 'AWS KMS Key Provider',
    category: 'Security & KMS',
    status: 'Beta',
    statusColor: 'text-[#FF85A2] bg-[#FF2D6D]/15 border-[#FF2D6D]/30',
    description: 'Use AWS Key Management Service (KMS) Customer Managed Keys (CMKs) to wrap Data Encryption Keys.',
    capabilities: [
      'Hardware Security Module (HSM) FIPS 140-2 Level 3 backing',
      'IAM role-based key access policies',
      'Automatic annual AWS key rotation support',
      'Multi-region key replication'
    ],
    docSection: 'envelope-encryption'
  }
];

export const IntegrationsPage = ({ isAuthenticated = false, user = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Hosting & Deployment', 'Cloud & Infrastructure', 'Infrastructure as Code', 'CI/CD & Automation', 'Security & KMS'];

  const filteredIntegrations = INTEGRATIONS_LIST.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#26000B] text-[#F4B5C8] font-sans selection:bg-[#FF2D6D] selection:text-white">
      <LandingNav isAuthenticated={isAuthenticated} user={user} />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF2D6D]/30 bg-[#FF2D6D]/15 text-[#FF85A2] font-mono text-xs font-semibold uppercase tracking-wider mb-6">
          <Cloud className="w-3.5 h-3.5 text-[#FF2D6D]" />
          <span>Multi-Cloud Ecosystem</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Connect your stack with <span className="text-[#FF2D6D]">verified adapters</span>
        </h1>
        <p className="text-base sm:text-xl text-[#F4B5C8] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Synchronize secrets effortlessly to cloud hosting providers, Kubernetes clusters, and CI/CD pipelines with real-time drift detection.
        </p>

        {/* Search & Filter Toolbar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A26377]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search integrations (e.g. Vercel, Kubernetes, AWS KMS)..."
              className="w-full bg-[#0D0106] border border-[#FFB4C8]/15 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-white placeholder:text-[#A26377] focus:outline-none focus:border-[#FF2D6D]/70"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#FF2D6D] text-white border-[#FF2D6D] shadow-lg shadow-[#FF2D6D]/20'
                  : 'bg-[#1E000A] text-[#A26377] border-[#FFB4C8]/15 hover:text-white hover:bg-[#30000F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 flex flex-col justify-between hover:border-[#FF2D6D]/40 transition-all duration-300 shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FF85A2] transition-colors">
                    {item.name}
                  </h3>
                  <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#A26377] uppercase tracking-wider mb-3">
                  {item.category}
                </div>
                <p className="text-xs text-[#F4B5C8] leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="space-y-2 mb-6 pt-4 border-t border-[#FFB4C8]/10">
                  {item.capabilities.map((cap, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2 text-xs text-[#F4B5C8]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] flex-shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#FFB4C8]/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#A26377]">
                  Native SPI Adapter
                </span>
                <button
                  onClick={() => navigate(`/docs?section=${item.docSection}`)}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF85A2] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  <span>Integration Docs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
