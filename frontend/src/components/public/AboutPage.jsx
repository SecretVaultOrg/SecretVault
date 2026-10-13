import React from 'react';
import {
  Shield,
  CheckCircle2,
  Cpu,
  Layers,
  Server,
  Lock,
  ArrowRight,
  CodeXml,
  Database,
  Terminal
} from 'lucide-react';
import { LandingNav } from '../landing/LandingNav';
import { LandingFooter } from '../landing/LandingFooter';
import { navigate } from '../../utils/router';

export const AboutPage = ({ isAuthenticated = false, user = null }) => {
  return (
    <div className="min-h-screen bg-[#26000B] text-[#F4B5C8] font-sans selection:bg-[#FF2D6D] selection:text-white">
      <LandingNav isAuthenticated={isAuthenticated} user={user} />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF2D6D]/30 bg-[#FF2D6D]/15 text-[#FF85A2] font-mono text-xs font-semibold uppercase tracking-wider mb-6">
          <Shield className="w-3.5 h-3.5 text-[#FF2D6D]" />
          <span>About SecretVault</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Mission &amp; Engineering <span className="text-[#FF2D6D]">Principles</span>
        </h1>
        <p className="text-base sm:text-xl text-[#F4B5C8] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          SecretVault was created to replace insecure, unversioned .env files with an enterprise-grade zero-trust secrets fabric that developers genuinely love using.
        </p>
      </section>

      {/* The Problem We Solve */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 sm:p-12 space-y-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-white font-sans">
            The Problem: Secrets Sprawl &amp; Insecure .env Workflows
          </h2>
          <p className="text-xs sm:text-sm text-[#F4B5C8] leading-relaxed">
            Modern development stacks run on dozens of API keys, database credentials, and service tokens. Historically, teams manage these by sharing unencrypted `.env` files over Slack, committing them to private repositories, or baking credentials into container images.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#1E000A] border border-[#FFB4C8]/15 space-y-2">
              <h4 className="text-sm font-bold text-rose-400 font-sans">1. Credential Leaks</h4>
              <p className="text-xs text-[#A26377] leading-relaxed">
                49% of security breaches stem from leaked secrets found in developer Git commits or build artifacts.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#1E000A] border border-[#FFB4C8]/15 space-y-2">
              <h4 className="text-sm font-bold text-amber-400 font-sans">2. Permanent Standing Privileges</h4>
              <p className="text-xs text-[#A26377] leading-relaxed">
                Developers often retain 24/7 unmonitored access to production secrets, violating compliance frameworks.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#1E000A] border border-[#FFB4C8]/15 space-y-2">
              <h4 className="text-sm font-bold text-[#FF85A2] font-sans">3. Unversioned Drift</h4>
              <p className="text-xs text-[#A26377] leading-relaxed">
                When a secret changes, teams have no audit history of who updated it, why, or how to safely roll it back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Principles */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">Our Core Principles</h2>
          <p className="text-xs sm:text-sm text-[#A26377]">The design commitments that guide every feature we build.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF2D6D]/15 border border-[#FF2D6D]/30 flex items-center justify-center text-[#FF2D6D]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Zero Plaintext on Disk</h3>
            <p className="text-xs text-[#F4B5C8] leading-relaxed">
              Secrets are piped directly into volatile child process memory at runtime via the CLI. Quitting the terminal clears all decrypted values.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF2D6D]/15 border border-[#FF2D6D]/30 flex items-center justify-center text-[#FF85A2]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Cryptographic Envelope Isolation</h3>
            <p className="text-xs text-[#F4B5C8] leading-relaxed">
              Every version uses an ephemeral 256-bit DEK wrapped by a Master KEK. Context is cryptographically bound to secret ID, environment, and version.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Git-Like Versioning &amp; Branching</h3>
            <p className="text-xs text-[#F4B5C8] leading-relaxed">
              Manage configuration with feature branches, 3-way merge conflict detection, monotonic version history, and instant safe rollbacks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">4. Developer Ergonomics First</h3>
            <p className="text-xs text-[#F4B5C8] leading-relaxed">
              Security that is frustrating will be bypassed. SecretVault provides instant CLI commands, IDE autocomplete, and Spring Boot starters.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 sm:p-12 space-y-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-white font-sans">
            Technology Stack &amp; Implementation Details
          </h2>
          <p className="text-xs sm:text-sm text-[#F4B5C8] leading-relaxed">
            SecretVault is built with high-performance, proven enterprise technologies designed for sub-millisecond retrieval and cryptographic resilience:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#1E000A] border border-[#FFB4C8]/15 text-center">
              <div className="text-sm font-bold text-white mb-1">Java 21 / Spring 3</div>
              <div className="text-[11px] font-mono text-[#FF85A2]">Backend Core</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1E000A] border border-[#FFB4C8]/15 text-center">
              <div className="text-sm font-bold text-white mb-1">React 18 / Vite</div>
              <div className="text-[11px] font-mono text-[#FF85A2]">Control Plane</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1E000A] border border-[#FFB4C8]/15 text-center">
              <div className="text-sm font-bold text-white mb-1">PostgreSQL 16</div>
              <div className="text-[11px] font-mono text-[#FF85A2]">Encrypted Store</div>
            </div>
            <div className="p-4 rounded-xl bg-[#1E000A] border border-[#FFB4C8]/15 text-center">
              <div className="text-sm font-bold text-white mb-1">Redis 7 L2</div>
              <div className="text-[11px] font-mono text-[#FF85A2]">Metadata Cache</div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
