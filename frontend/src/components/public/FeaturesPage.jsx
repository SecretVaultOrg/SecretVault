import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  GitBranch,
  RefreshCw,
  Lock,
  Eye,
  Server,
  Cloud,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileCode2,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { LandingNav } from '../landing/LandingNav';
import { LandingFooter } from '../landing/LandingFooter';
import { navigate, getPath } from '../../utils/router';

const FEATURES_LIST = [
  {
    id: 'secrets-management',
    category: 'Core',
    title: 'Zero-Disk Secrets Management',
    tagline: 'Eliminate plaintext .env files across development and production',
    icon: KeyRound,
    color: 'from-[#FF2D6D]/20 to-[#990033]/10 border-[#FF2D6D]/30 text-[#FF85A2]',
    description: 'Store credentials in a centralized, multi-tenant vault. Variables are injected straight into process RAM at runtime via ProcessBuilder with zero disk traces.',
    capabilities: [
      'AES-256-GCM cryptographic envelope encryption at rest',
      'Zero plaintext exposure on standard metadata GET APIs',
      'Explicit on-demand reveal endpoint with audit justification',
      'Bulk .env import parser with comment and variable expansion'
    ],
    technicalSpec: 'Implemented in com.secretvault.secret via SecretService & SecretVersionRepository with V5 Flyway migrations.',
    docsAnchor: 'overview'
  },
  {
    id: 'encryption-and-key-management',
    category: 'Cryptography',
    title: 'AES-256-GCM Envelope Encryption',
    tagline: 'Cryptographic separation of concerns with pluggable KMS providers',
    icon: Lock,
    color: 'from-[#FF2D6D]/25 to-purple-500/10 border-[#FF2D6D]/30 text-[#FF85A2]',
    description: 'Every secret version generates an ephemeral 256-bit Data Encryption Key (DEK). The DEK is encrypted under a Master Key Encryption Key (KEK) using RFC 3394 AES Key Wrap.',
    capabilities: [
      'AAD (Authenticated Additional Data) binding to secretId:environmentId:version',
      'Pluggable KmsKeyProvider SPI for LocalDev, AWS KMS, GCP, and Azure Vault',
      'Re-encryption boundaries preventing cross-environment cipher swapping',
      'Automatic key rotation with zero downtime for existing versions'
    ],
    technicalSpec: 'Implemented in com.secretvault.encryption via AesGcmEnvelopeEncryptionService & LocalDevKmsKeyProvider.',
    docsAnchor: 'envelope-encryption'
  },
  {
    id: 'versioning-and-promotion',
    category: 'DevOps',
    title: 'Git-Like Versioning & Branching',
    tagline: 'Treat configuration with the same rigor and branch safety as code',
    icon: GitBranch,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    description: 'Create isolated feature branches for configuration, compare diffs across versions, detect 3-way merge conflicts, and promote safely from dev to staging and production.',
    capabilities: [
      'Monotonically increasing immutable version ledger ($v_{N+1}$)',
      'Safe rollback mechanism creating new forward versions from verified history',
      'Automatic target environment re-encryption during promotion',
      'Step-up MFA gate protection before production promotions'
    ],
    technicalSpec: 'Verified across com.secretvault.secret and SecretVersionService with complete rollback and promotion APIs.',
    docsAnchor: 'secret-versioning'
  },
  {
    id: 'access-control',
    category: 'Governance',
    title: 'Fine-Grained RBAC & Tenant Scoping',
    tagline: 'Multi-tenant isolation with strict permission reduction rules',
    icon: Shield,
    color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400',
    description: 'Four workspace roles (OWNER, ADMIN, DEVELOPER, VIEWER) combined with project-level and environment-level access scoping to enforce the principle of least privilege.',
    capabilities: [
      'Permission reduction rule: Effective Permission = Workspace ∩ Project ∩ Environment',
      'Last OWNER protection preventing accidental workspace lockout',
      'High-entropy single-use cryptographic invitation tokens with SHA-256 storage',
      'ThreadLocal TenantContext header validation preventing IDOR across workspaces'
    ],
    technicalSpec: 'Enforced by EffectiveAccessService and WorkspaceMembershipRepository.',
    docsAnchor: 'roles-rbac'
  },
  {
    id: 'jit-access',
    category: 'Governance',
    title: 'Just-in-Time (JIT) & Break-Glass Access',
    tagline: 'Eliminate permanent standing privileges on production systems',
    icon: Eye,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    description: 'Request time-limited, audited emergency access to production environments during active incidents. Requests require dual approval and revoke automatically upon expiration.',
    capabilities: [
      'Configurable lease durations (15m, 30m, 1h, 4h) with auto-revocation',
      'Dual-approval requirement by an independent OWNER or ADMIN',
      'Mandatory incident justification and permanent audit log attribution',
      'Instant manual revocation button for security leads'
    ],
    technicalSpec: 'Implemented in com.secretvault.access.jit via JitAccessRequestService and background eviction schedulers.',
    docsAnchor: 'jit-access'
  },
  {
    id: 'provider-integrations',
    category: 'Multi-Cloud',
    title: 'Multi-Cloud Sync & Drift Detection',
    tagline: 'Centralized control plane synchronizing Vercel, Render, and Kubernetes',
    icon: Cloud,
    color: 'from-[#FF2D6D]/20 to-indigo-500/10 border-[#FF2D6D]/30 text-[#FF85A2]',
    description: 'Manage secrets in SecretVault and push updates automatically to external cloud providers. Continuous drift detection spots out-of-band changes before deployments fail.',
    capabilities: [
      'Native adapters for Vercel, Render, AWS KMS, and Kubernetes CRDs',
      'SecretVaultSync Kubernetes operator reconciling pods in real time',
      'Official Terraform Provider for declarative Infrastructure as Code',
      'Detailed sync history logs with retry backoff for network partitions'
    ],
    technicalSpec: 'Implemented in com.secretvault.sync via SyncService and provider adapter registry.',
    docsAnchor: 'integrations-overview'
  },
  {
    id: 'security-automation',
    category: 'Security',
    title: 'Audit Logs & Transactional Outbox',
    tagline: 'Tamper-evident activity logs with reliable SIEM event delivery',
    icon: Server,
    color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400',
    description: 'Every reveal, update, deletion, and rotation writes an append-only audit event. The transactional outbox pattern guarantees delivery to security webhooks and SIEM platforms.',
    capabilities: [
      'Append-only database schema with no update/delete APIs for audit records',
      'Transactional outbox ensuring at-least-once domain event publication',
      'Real-time HMAC-SHA256 signed webhooks to Slack, Discord, and SIEM endpoints',
      'Detailed actor metadata: userId, clientIp, userAgent, and correlationId'
    ],
    technicalSpec: 'Implemented in com.secretvault.audit and com.secretvault.outbox with automated polling workers.',
    docsAnchor: 'audit-logging'
  },
  {
    id: 'repository-scanning',
    category: 'Security',
    title: 'Repository Leak Detection & AI Defense',
    tagline: 'Detect and auto-remediate credentials before they reach production',
    icon: Sparkles,
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    description: 'Scans repositories for high-entropy secrets and sensitive token signatures. Leverages Google Gemini AI to analyze posture risks and generate instant remediation playbooks.',
    capabilities: [
      'High-entropy Shannon entropy analyzer and regex detection rules',
      'Pre-commit IDE scanning via the official VS Code Extension',
      'Google Gemini AI copilot for vulnerability explanation and auto-patching',
      'One-click shadow secret rotation to replace compromised credentials'
    ],
    technicalSpec: 'Implemented in com.secretvault.ai via GeminiLlmProvider with multi-model fallback resiliency.',
    docsAnchor: 'repository-scanning'
  },
  {
    id: 'developer-tools',
    category: 'DevTools',
    title: 'Developer CLI, SDKs & Spring Starter',
    tagline: 'Delightful developer experience across Java, Node, Python, and terminal',
    icon: Terminal,
    color: 'from-[#FF2D6D]/20 to-rose-500/10 border-[#FF2D6D]/30 text-[#FF85A2]',
    description: 'Comprehensive developer tooling built for friction-free onboarding. Use secretvault run locally or embed the Java SDK directly in Spring Boot microservices.',
    capabilities: [
      '@secretvault/cli available via npm, Homebrew, and direct binary download',
      'Spring Boot 3.x Starter with @SecretVaultProperty and dynamic @RefreshScope',
      'TypeScript and Python SDKs with volatile in-memory caching',
      'OIDC keyless attestation for automated GitHub Actions and GitLab CI runners'
    ],
    technicalSpec: 'Packaged in cli/ (@secretvault/cli) and sdk/ (secretvault-spring-boot-starter).',
    docsAnchor: 'cli-overview'
  }
];

export const FeaturesPage = ({ isAuthenticated = false, user = null }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Core', 'Cryptography', 'DevOps', 'Governance', 'Multi-Cloud', 'Security', 'DevTools'];

  const filteredFeatures = FEATURES_LIST.filter((feat) => {
    const matchesCategory = selectedCategory === 'All' || feat.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      feat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#26000B] text-[#F4B5C8] font-sans selection:bg-[#FF2D6D] selection:text-white">
      <LandingNav isAuthenticated={isAuthenticated} user={user} />

      {/* Top Hero Section */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF2D6D]/30 bg-[#FF2D6D]/15 text-[#FF85A2] font-mono text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FF2D6D]" />
          <span>Complete Platform Capabilities</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Security engineered for the <span className="text-[#FF2D6D]">entire secret lifecycle</span>
        </h1>
        <p className="text-base sm:text-xl text-[#F4B5C8] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          From developer terminals to Kubernetes clusters and CI/CD pipelines. Discover how SecretVault protects your credentials with zero-knowledge envelope encryption.
        </p>

        {/* Search & Filter Toolbar */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3 mb-12">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A26377]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. envelope encryption, JIT, CLI)..."
              className="w-full bg-[#0D0106] border border-[#FFB4C8]/15 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-white placeholder:text-[#A26377] focus:outline-none focus:border-[#FF2D6D]/70"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#FF2D6D] text-white border-[#FF2D6D] shadow-lg shadow-[#FF2D6D]/20'
                  : 'bg-[#1E000A] text-[#A26377] border-[#FFB4C8]/15 hover:text-white hover:bg-[#30000F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={feat.id}
                className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 flex flex-col justify-between hover:border-[#FF2D6D]/40 transition-all duration-300 shadow-xl group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2D6D]/5 rounded-full blur-2xl group-hover:bg-[#FF2D6D]/10 transition-colors pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} border flex items-center justify-center shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#1E000A] text-[#A26377] border border-[#FFB4C8]/15">
                      {feat.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-[#FF85A2] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-mono text-[#FF85A2] mb-4 font-semibold">
                    {feat.tagline}
                  </p>
                  <p className="text-xs text-[#F4B5C8] leading-relaxed mb-6">
                    {feat.description}
                  </p>

                  <div className="space-y-2 mb-6 pt-4 border-t border-[#FFB4C8]/10">
                    {feat.capabilities.map((cap, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2 text-xs text-[#F4B5C8]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] flex-shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#FFB4C8]/10 flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-mono text-[#A26377] truncate max-w-[200px]" title={feat.technicalSpec}>
                    Verified: {feat.technicalSpec.split(' ')[2] || 'Core SPI'}
                  </span>
                  <button
                    onClick={() => navigate(`/docs?section=${feat.docsAnchor}`)}
                    className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF85A2] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                  >
                    <span>Read Docs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 bg-[#1E000A] border-t border-[#FFB4C8]/15 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to secure your credentials?
          </h2>
          <p className="text-sm text-[#A26377] max-w-xl mx-auto">
            Get started for free in under five minutes. No credit card required. Free forever for developers and open-source teams.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3.5 rounded-xl text-xs font-mono font-bold text-white bg-[#FF2D6D] hover:bg-[#FF4D85] transition-all shadow-lg shadow-[#FF2D6D]/20 cursor-pointer border-none"
            >
              Start Free Vault →
            </button>
            <button
              onClick={() => navigate('/docs')}
              className="px-6 py-3.5 rounded-xl text-xs font-mono font-bold text-white border border-[#FFB4C8]/20 hover:bg-[#30000F] transition-all cursor-pointer bg-transparent"
            >
              Explore Documentation
            </button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
