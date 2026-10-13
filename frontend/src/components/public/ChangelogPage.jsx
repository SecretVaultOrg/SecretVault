import React from 'react';
import {
  GitCommit,
  Calendar,
  Sparkles,
  Shield,
  KeyRound,
  Lock,
  ArrowRight
} from 'lucide-react';
import { LandingNav } from '../landing/LandingNav';
import { LandingFooter } from '../landing/LandingFooter';
import { navigate } from '../../utils/router';

const RELEASES = [
  {
    version: 'v2.4.0',
    date: 'Current Release',
    title: 'Developer CLI, Machine OIDC & Runtime Injection Engine',
    badge: 'Latest',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Released official @secretvault/cli on npm with in-memory RAM injection, zero disk traces, and keyless RFC 7519 OIDC attestation for GitHub Actions and GitLab CI.',
    changes: [
      '@secretvault/cli: secretvault run, secretvault auth login, secretvault secret list',
      'Keyless machine workload authentication via OIDC identity tokens and short-lived sessions',
      'Step-up MFA verification triggers for high-risk operations and secret reveals',
      'Google Gemini AI posture copilot with multi-model fallback resiliency'
    ]
  },
  {
    version: 'v2.2.0',
    date: 'Phase 3 Milestone',
    title: 'AES-256-GCM Envelope Encryption Engine & Tamper-Evident Audit Logs',
    badge: 'Security',
    badgeColor: 'text-[#FF85A2] bg-[#FF2D6D]/15 border-[#FF2D6D]/30',
    description: 'Introduced cryptographic envelope encryption service, pluggable KmsKeyProvider SPI, and append-only tamper-evident audit logging with transactional outbox publishing.',
    changes: [
      'EncryptedPayload record storing ciphertext, wrapped DEK, IV, and Galois auth tag',
      'LocalDevKmsKeyProvider utilizing RFC 3394 AES Key Wrap with 256-bit Master KEK',
      'AAD context binding to secretId:environmentId:versionNumber preventing cross-record swapping',
      'Flyway V5 migrations for secrets, secret_versions, and audit_logs tables'
    ]
  },
  {
    version: 'v2.0.0',
    date: 'Phase 2 Milestone',
    title: 'Projects, Environment Tiers & Fine-Grained Access Scoping',
    badge: 'Governance',
    badgeColor: 'text-[#FF85A2] bg-[#FF2D6D]/15 border-[#FF2D6D]/30',
    description: 'Automated provisioning of development, staging, and production tiers with protected flags and hierarchical access scoping.',
    changes: [
      'Hierarchical authorization: User -> Workspace Membership -> Project -> Environment',
      'Single-use high-entropy cryptographic invitation tokens with SHA-256 storage',
      'ProjectAccess and EnvironmentAccess permission narrowing rules',
      'Strict last OWNER protection preventing accidental workspace lockout'
    ]
  },
  {
    version: 'v1.0.0',
    date: 'Phase 1 Milestone',
    title: 'Multi-Tenant Workspaces, JJWT Authentication & UI Control Plane',
    badge: 'Foundation',
    badgeColor: 'text-[#A26377] bg-white/5 border-[#FFB4C8]/15',
    description: 'Initial foundation of SecretVault featuring multi-tenant workspace isolation, BCrypt password hashing, and high-contrast dark control plane UI.',
    changes: [
      'JJWT 0.12.6 stateless Bearer authentication with ThreadLocal TenantContext',
      'Automatic provisioning of personal Organization and default Workspace upon registration',
      'Flyway V2 migrations for auth and workspace domain entities',
      'React 18 / Vite 6 frontend control plane with Stitch dark design system'
    ]
  }
];

export const ChangelogPage = ({ isAuthenticated = false, user = null }) => {
  return (
    <div className="min-h-screen bg-[#26000B] text-[#F4B5C8] font-sans selection:bg-[#FF2D6D] selection:text-white">
      <LandingNav isAuthenticated={isAuthenticated} user={user} />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF2D6D]/30 bg-[#FF2D6D]/15 text-[#FF85A2] font-mono text-xs font-semibold uppercase tracking-wider mb-6">
          <GitCommit className="w-3.5 h-3.5 text-[#FF2D6D]" />
          <span>Release History</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          SecretVault <span className="text-[#FF2D6D]">Changelog</span>
        </h1>
        <p className="text-base sm:text-xl text-[#F4B5C8] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Follow the progress and milestone releases of the SecretVault developer security and secrets governance platform.
        </p>
      </section>

      {/* Timeline Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="relative border-l border-[#FFB4C8]/15 pl-6 sm:pl-10 space-y-12">
          {RELEASES.map((rel, idx) => (
            <div key={idx} className="relative group">
              {/* Dot on Timeline */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#26000B] border-2 border-[#FF2D6D] group-hover:bg-[#FF2D6D] transition-colors shadow-[0_0_10px_rgba(255,45,109,0.5)]" />

              <div className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 space-y-4 hover:border-[#FF2D6D]/40 transition-all shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-mono font-bold text-white">
                      {rel.version}
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${rel.badgeColor}`}>
                      {rel.badge}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#A26377]">
                    {rel.date}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-sans">
                  {rel.title}
                </h3>
                <p className="text-xs text-[#F4B5C8] leading-relaxed">
                  {rel.description}
                </p>

                <div className="pt-3 border-t border-[#FFB4C8]/10 space-y-2">
                  <div className="text-[11px] font-mono text-[#A26377] uppercase tracking-wider mb-2">
                    Key Highlights:
                  </div>
                  {rel.changes.map((item, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2 text-xs text-[#F4B5C8]">
                      <span className="text-[#FF2D6D] font-mono mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
