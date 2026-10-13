import React, { useState } from 'react';
import { LandingNav } from './LandingNav';
import { TerminalSimulator } from './TerminalSimulator';
import { LandingFooter } from './LandingFooter';
import {
  Shield,
  Lock,
  Zap,
  Terminal,
  Cpu,
  RefreshCw,
  EyeOff,
  GitBranch,
  KeyRound,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  Database,
  Cloud,
  Check,
  X as XIcon,
  Flame,
  FileCode2,
  Copy
} from 'lucide-react';
import { navigate } from '../../utils/router';

const CODE_EXAMPLES = {
  cli: {
    lang: 'bash',
    filename: 'terminal.sh',
    code: `# 1. Install CLI
npm install -g @secretvault/cli

# 2. Login to your secure workspace
secretvault login

# 3. Inject secrets directly into process RAM (Zero disk footprint)
secretvault run --env production -- npm start`
  },
  typescript: {
    lang: 'typescript',
    filename: 'server.ts',
    code: `import { SecretVaultClient } from '@secretvault/sdk';

const vault = new SecretVaultClient({
  projectId: 'checkout-api',
  environment: 'production',
  autoReload: true // Real-time shadow rotation listener
});

// Decrypts via envelope encryption directly into memory
const stripeKey = await vault.getSecret('STRIPE_SECRET_KEY');
const dbUrl = await vault.getSecret('DATABASE_URL');`
  },
  python: {
    lang: 'python',
    filename: 'app.py',
    code: `from secretvault import SecretVault

vault = SecretVault(project="ml-inference", environment="production")

# Injects directly into os.environ without writing .env files
vault.inject_into_environ()

# Access standard environment variables safely
import os
database_url = os.environ.get("DATABASE_URL")`
  },
  java: {
    lang: 'java',
    filename: 'VaultConfig.java',
    code: `@Configuration
@EnableSecretVault
public class VaultConfig {

    @SecretVaultProperty(name = "STRIPE_API_KEY", refreshable = true)
    private String stripeApiKey;

    @Value("\${vault.secret.database-url}")
    private String databaseUrl;
}`
  },
  k8s: {
    lang: 'yaml',
    filename: 'secret-sync.yaml',
    code: `apiVersion: secretvault.io/v1alpha1
kind: SecretVaultSync
metadata:
  name: payment-sync
  namespace: production
spec:
  project: "payment-api"
  environment: "production"
  destinationSecret:
    name: payment-secrets
    type: Opaque
  restartDeployments:
    - payment-api-deployment`
  },
  terraform: {
    lang: 'hcl',
    filename: 'main.tf',
    code: `provider "secretvault" {
  api_url = "https://vault.company.com/api/v1"
  token   = var.secretvault_token
}

resource "secretvault_secret" "jwt_secret" {
  project_id   = secretvault_project.api.id
  environment  = "production"
  key          = "JWT_SIGNING_SECRET"
  value        = var.jwt_secret
  is_sensitive = true
}`
  }
};

const COMPARISONS = [
  { feature: 'Process-Memory RAM Injection (Zero Disk)', secretvault: true, dotenv: false, vault: false, doppler: true },
  { feature: 'Post-Quantum Envelope Encryption (AES-256 + Kyber)', secretvault: true, dotenv: false, vault: false, doppler: false },
  { feature: 'Sub-12ms Latency via Redis L2 Cache', secretvault: true, dotenv: false, vault: false, doppler: true },
  { feature: 'Automated Dual-Phase Shadow Rotation', secretvault: true, dotenv: false, vault: false, doppler: false },
  { feature: 'JIT Break-Glass Access with Dual-Approval', secretvault: true, dotenv: false, vault: true, doppler: false },
  { feature: 'Google Gemini AI Copilot Posture Auditor', secretvault: true, dotenv: false, vault: false, doppler: false },
  { feature: 'Native Kubernetes Operator & Custom CRDs', secretvault: true, dotenv: false, vault: true, doppler: true },
  { feature: 'Free Forever Tier (Unlimited Projects & Secrets)', secretvault: true, dotenv: true, vault: false, doppler: false }
];

const FAQS = [
  {
    q: 'What is SecretVault and why should we replace .env files?',
    a: 'SecretVault is a zero-knowledge, enterprise-grade secrets governance platform. Plaintext .env files are the #1 cause of credential leaks (accidental git commits, Docker layer leaks, unencrypted logs). SecretVault replaces files on disk with direct process-memory RAM injection, so credentials only exist in ephemeral memory while your application runs.'
  },
  {
    q: 'How does RAM-only secret injection work?',
    a: 'When you execute `secretvault run --env production -- npm start`, the CLI contacts the SecretVault cryptographic gateway, verifies your machine identity, decrypts secrets using envelope DEKs, and spawns your application with secrets injected directly into child process memory (`/proc/$$/environ`). No `.env` file is ever written to your hard drive.'
  },
  {
    q: 'What is Dual-Phase Shadow Rotation?',
    a: 'Traditional secret rotations cause service downtime because old pods still make requests using the expired key. SecretVault shadow rotation creates a new key version and runs both keys in parallel during a configurable grace window (e.g. 24 hours), guaranteeing zero dropped transactions while pods reload.'
  },
  {
    q: 'How fast is secret retrieval with Redis L2 caching?',
    a: 'SecretVault leverages a distributed Redis L2 cache layer that stores encrypted metadata, token leases, and rate-limiting buckets. Secret resolution occurs in under 12 milliseconds, with automated cryptographic cache invalidation whenever a secret is mutated.'
  },
  {
    q: 'Is SecretVault free to use for startups and individual developers?',
    a: 'Yes! SecretVault offers a generous Free Forever tier that includes unlimited projects, environments, secrets, CLI usage, and local developer workflows. Enterprise teams can upgrade for advanced SSO, multi-region HSM replication, and compliance audit exports.'
  }
];

export const LandingPage = ({ isAuthenticated = false, user = null }) => {
  const [activeCodeTab, setActiveCodeTab] = useState('cli');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#26000B] text-white font-sans selection:bg-[#FF2D6D] selection:text-white overflow-x-hidden">
      {/* Top Sticky Navigation */}
      <LandingNav isAuthenticated={isAuthenticated} user={user} />

      {/* =========================================================================
          HERO SECTION
         ========================================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 pb-24 overflow-hidden">
        {/* Cyber Background Grid */}
        <div
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,45,109,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,109,0.18) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent)'
          }}
        />

        {/* Ambient Radial Gradient Glows */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[1000px] h-[650px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,45,109,0.20) 0%, rgba(118,0,49,0.25) 35%, rgba(38,0,11,0.10) 60%, transparent 75%)'
          }}
        />

        {/* Top Floating Cyber Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF2D6D]/30 bg-[#30000F]/80 backdrop-blur-xl text-xs font-mono font-semibold text-[#FF85A2] mb-8 shadow-[0_0_20px_rgba(255,45,109,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#FF2D6D] animate-ping" />
          <span>ZERO-TRUST SECRETS MANAGEMENT &amp; ENVIRONMENT PLATFORM</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="relative z-10 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] max-w-5xl mb-6 font-sans">
          <span className="text-white">Ditch your .env files forever.</span>
          <br />
          <span className="bg-gradient-to-r from-[#FF2D6D] via-[#FF85A2] to-white bg-clip-text text-transparent">
            Sync, protect, and inject secrets in real time.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="relative z-10 text-base sm:text-lg md:text-xl text-[#F4B5C8]/90 max-w-3xl mb-10 leading-relaxed font-normal">
          Stop leaking credentials into git commits. SecretVault is the zero-knowledge secrets management platform for
          DevOps teams. Direct process-memory RAM injection, automated shadow rotation, JIT break-glass access,
          and Google Gemini AI posture defense.
        </p>

        {/* Hero Action CTA Buttons */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 mb-10">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/app')}
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#FF2D6D] to-[#E6004D] hover:from-[#FF4D85] hover:to-[#FF2D6D] transition-all shadow-[0_0_35px_rgba(255,45,109,0.5)] cursor-pointer border-none font-mono tracking-wide"
            >
              <span>Go to Workspace Console</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#FF2D6D] to-[#E6004D] hover:from-[#FF4D85] hover:to-[#FF2D6D] transition-all shadow-[0_0_35px_rgba(255,45,109,0.5)] cursor-pointer border-none font-mono tracking-wide"
              >
                <span>Start for Free (No Credit Card)</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold text-white border border-[#FFB4C8]/25 hover:border-[#FF2D6D]/50 hover:bg-[#30000F] transition-all cursor-pointer bg-[#1E000A]/70 backdrop-blur font-mono"
              >
                <span>Sign In to Vault →</span>
              </button>
            </>
          )}

          <button
            onClick={() => navigate('/docs')}
            className="flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-bold text-[#FF85A2] border border-[#FF2D6D]/30 hover:bg-[#FF2D6D]/15 transition-all cursor-pointer bg-transparent font-mono"
          >
            <span>Explore Live Docs</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#A26377] font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span className="text-[#F4B5C8]/80">Open-source core</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#FF85A2]" />
            <span className="text-[#F4B5C8]/80">Zero disk footprint (RAM injection)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span className="text-[#F4B5C8]/80">Append-only audit logging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#FF85A2]" />
            <span className="text-[#F4B5C8]/80">Redis L2 metadata caching</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span className="text-[#F4B5C8]/80">AES-256-GCM envelope encryption</span>
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE TERMINAL SIMULATOR EMBED
           ========================================================================= */}
        <div id="cli-simulator" className="w-full max-w-5xl mx-auto mt-16 relative z-10">
          <TerminalSimulator />
        </div>
      </section>

      {/* =========================================================================
          KEY STATS & HARDWARE-GRADE METRICS
         ========================================================================= */}
      <section className="relative z-10 border-t border-b border-[#FFB4C8]/15 bg-[#1E000A]/90 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#FF85A2]">
              TRUSTED FOR CRITICAL PRODUCTION SECRETS ACROSS ENTERPRISE CLUSTERS
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-[#FFB4C8]/15">
            <div className="text-center px-4">
              <div className="text-2xl md:text-3xl font-black text-white mb-1.5 font-mono">AES-256-GCM</div>
              <div className="text-xs text-[#A26377]">Zero-Knowledge Envelope KEK</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl md:text-3xl font-black text-[#FF85A2] mb-1.5 font-mono">&lt; 12ms</div>
              <div className="text-xs text-[#A26377]">Redis L2 Cache Retrieval</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl md:text-3xl font-black text-[#34D399] mb-1.5 font-mono">ACID</div>
              <div className="text-xs text-[#A26377]">Transactional Outbox Sync</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl md:text-3xl font-black text-[#FF2D6D] mb-1.5 font-mono">0 Leaks</div>
              <div className="text-xs text-[#A26377]">Zero Disk Plaintext Writes</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURES BENTO GRID
         ========================================================================= */}
      <section id="features" className="py-28 px-4 sm:px-6 bg-[#180007] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2D6D]/10 border border-[#FF2D6D]/20 text-xs font-mono font-bold uppercase tracking-widest text-[#FF85A2] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF2D6D]" />
              Complete Zero-Trust Arsenal
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight font-sans">
              Everything modern engineering teams need.
            </h2>
            <p className="text-[#A26377] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Designed for high-velocity teams where developers, CI/CD pipelines, Kubernetes clusters, and AI agents all
              require secure secrets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: RAM Memory Injection */}
            <div className="p-8 rounded-3xl border border-[#FFB4C8]/15 bg-[#30000F]/80 hover:border-[#FF2D6D]/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#3F0016] border border-[#FF2D6D]/30 flex items-center justify-center text-[#FF2D6D] mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-sans">
                Zero-Disk RAM Injection
              </h3>
              <p className="text-sm text-[#A26377] leading-relaxed mb-4">
                Execute applications with <code className="text-[#FF85A2] font-mono">secretvault run</code>. Secrets are
                injected directly into memory blocks. No unencrypted files on disk, no accidentally committed `.env`.
              </p>
              <div className="text-xs font-mono text-[#FF85A2] flex items-center gap-1.5 pt-2">
                <span>Injected via /proc/$$/environ</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 2: Dual-Phase Shadow Rotation */}
            <div className="p-8 rounded-3xl border border-[#FFB4C8]/15 bg-[#30000F]/80 hover:border-[#FF2D6D]/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#3F0016] border border-[#FF2D6D]/30 flex items-center justify-center text-[#FF2D6D] mb-6 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-sans">
                Dual-Phase Shadow Rotation
              </h3>
              <p className="text-sm text-[#A26377] leading-relaxed mb-4">
                Swap API tokens, TLS certs, and database passwords with zero downtime. SecretVault maintains both active
                and shadow credentials in parallel until all pods complete their reload cycle.
              </p>
              <div className="text-xs font-mono text-[#FF2D6D] flex items-center gap-1.5 pt-2">
                <span>Zero dropped HTTP requests</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 3: JIT Break-Glass Access */}
            <div className="p-8 rounded-3xl border border-[#FFB4C8]/15 bg-[#30000F]/80 hover:border-[#FF2D6D]/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#3F0016] border border-[#FF2D6D]/30 flex items-center justify-center text-[#34D399] mb-6 group-hover:scale-110 transition-transform">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-sans">
                JIT Break-Glass Governance
              </h3>
              <p className="text-sm text-[#A26377] leading-relaxed mb-4">
                Grant temporary, self-expiring production access for incident triage. Requires dual-approval with MFA
                passkeys. Ephemeral leases auto-revoke after TTL expires.
              </p>
              <div className="text-xs font-mono text-[#34D399] flex items-center gap-1.5 pt-2">
                <span>Dual-custody approval flow</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 4: AI Copilot Posture Defense */}
            <div className="p-8 rounded-3xl border border-[#FFB4C8]/15 bg-[#30000F]/80 hover:border-[#FF2D6D]/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#3F0016] border border-[#FF2D6D]/30 flex items-center justify-center text-[#818CF8] mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-sans">
                Google Gemini AI Copilot
              </h3>
              <p className="text-sm text-[#A26377] leading-relaxed mb-4">
                Autonomous AI security agent monitors entropy, checks secret expiration, and alerts on over-permissioned
                machine tokens with multi-model fallback resiliency.
              </p>
              <div className="text-xs font-mono text-[#818CF8] flex items-center gap-1.5 pt-2">
                <span>Automated remediation plans</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 5: Kubernetes Operator */}
            <div className="p-8 rounded-3xl border border-[#FFB4C8]/15 bg-[#30000F]/80 hover:border-[#FF2D6D]/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#3F0016] border border-[#FF2D6D]/30 flex items-center justify-center text-[#34D399] mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-sans">
                Kubernetes Operator &amp; CRDs
              </h3>
              <p className="text-sm text-[#A26377] leading-relaxed mb-4">
                Synchronize external SecretVault environments into native Kubernetes <code className="text-[#34D399] font-mono">v1/Secret</code>.
                Detects drift and triggers rolling deployments with zero manual YAML juggling.
              </p>
              <div className="text-xs font-mono text-[#34D399] flex items-center gap-1.5 pt-2">
                <span>CRD: SecretVaultSync</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 6: Terraform Provider & Multi-Cloud KMS */}
            <div className="p-8 rounded-3xl border border-[#FFB4C8]/15 bg-[#30000F]/80 hover:border-[#FF2D6D]/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#3F0016] border border-[#FF2D6D]/30 flex items-center justify-center text-[#FBBF24] mb-6 group-hover:scale-110 transition-transform">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-sans">
                Terraform Provider &amp; Cloud KMS
              </h3>
              <p className="text-sm text-[#A26377] leading-relaxed mb-4">
                Manage workspaces, access grants, and secret environments declaratively via Terraform. Sync seamlessly
                with AWS KMS, Google Cloud KMS, and Azure Key Vault.
              </p>
              <div className="text-xs font-mono text-[#FBBF24] flex items-center gap-1.5 pt-2">
                <span>Infrastructure as Code</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SDK & CLOUD INTEGRATION CODE SHOWCASE TABS
         ========================================================================= */}
      <section id="sdk-integrations" className="py-28 px-4 sm:px-6 bg-[#26000B] relative border-t border-[#FFB4C8]/15">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2D6D]/10 border border-[#FF2D6D]/20 text-xs font-mono font-bold uppercase tracking-widest text-[#FF85A2] mb-4">
              <FileCode2 className="w-3.5 h-3.5 text-[#FF2D6D]" />
              Developer First Integrations
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight font-sans">
              One unified SDK for every runtime and cloud.
            </h2>
            <p className="text-[#A26377] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Inject secrets into your microservices in three lines of code with native language support.
            </p>
          </div>

          {/* Interactive Code Container */}
          <div className="rounded-3xl border border-[#FFB4C8]/15 bg-[#1E000A] overflow-hidden shadow-2xl">
            {/* Tab Selectors */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#140006] border-b border-[#FFB4C8]/15 overflow-x-auto">
              <div className="flex items-center gap-2">
                {Object.keys(CODE_EXAMPLES).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveCodeTab(key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all cursor-pointer border-none ${
                      activeCodeTab === key
                        ? 'bg-[#FF2D6D] text-white shadow-[0_0_15px_rgba(255,45,109,0.4)]'
                        : 'text-[#A26377] hover:text-[#F4B5C8] bg-transparent'
                    }`}
                  >
                    {key === 'cli'
                      ? 'CLI (Bash)'
                      : key === 'typescript'
                      ? 'TypeScript'
                      : key === 'python'
                      ? 'Python'
                      : key === 'java'
                      ? 'Java / Spring'
                      : key === 'k8s'
                      ? 'Kubernetes CRD'
                      : 'Terraform'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleCopyCode(CODE_EXAMPLES[activeCodeTab].code)}
                className="flex items-center gap-1.5 text-xs font-mono text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedCode ? 'Copied Snippet' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-6 md:p-8 font-mono text-xs sm:text-sm bg-[#0D0106] overflow-x-auto leading-relaxed text-[#FFB4C8]">
              <pre className="m-0">
                <code>{CODE_EXAMPLES[activeCodeTab].code}</code>
              </pre>
            </div>

            {/* Bottom Documentation Link */}
            <div className="px-6 py-4 bg-[#140006] border-t border-[#FFB4C8]/10 flex items-center justify-between text-xs font-mono">
              <span className="text-[#A26377]">
                File:{' '}
                <span className="text-[#FF85A2] font-semibold">{CODE_EXAMPLES[activeCodeTab].filename}</span>
              </span>
              <button
                onClick={() => navigate('/docs')}
                className="text-[#FF85A2] hover:text-[#FF2D6D] font-bold flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
              >
                <span>Read Full Documentation</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          COMPARISON MATRIX
         ========================================================================= */}
      <section id="comparison" className="py-28 px-4 sm:px-6 bg-[#180007] relative border-t border-[#FFB4C8]/15">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2D6D]/10 border border-[#FF2D6D]/20 text-xs font-mono font-bold uppercase tracking-widest text-[#FF85A2] mb-4">
              Feature Comparison
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight font-sans">
              Why leading teams choose SecretVault
            </h2>
            <p className="text-[#A26377] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Compare SecretVault against traditional .env files and heavyweight enterprise alternatives.
            </p>
          </div>

          <div className="rounded-3xl border border-[#FFB4C8]/15 bg-[#1E000A] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#FFB4C8]/15 bg-[#140006] text-xs font-mono uppercase tracking-wider text-[#A26377]">
                    <th className="py-4 px-6">Capability</th>
                    <th className="py-4 px-6 text-center text-[#FF85A2] font-bold bg-[#FF2D6D]/10">SecretVault</th>
                    <th className="py-4 px-6 text-center">.env Files</th>
                    <th className="py-4 px-6 text-center">HashiCorp Vault</th>
                    <th className="py-4 px-6 text-center">Doppler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFB4C8]/10 font-sans">
                  {COMPARISONS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#30000F]/40 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#F4B5C8]">{row.feature}</td>
                      <td className="py-4 px-6 text-center bg-[#FF2D6D]/[0.05]">
                        <Check className="w-5 h-5 text-[#34D399] mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.dotenv ? (
                          <Check className="w-4 h-4 text-[#A26377] mx-auto" />
                        ) : (
                          <XIcon className="w-4 h-4 text-rose-500/70 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.vault ? (
                          <Check className="w-4 h-4 text-[#34D399]/80 mx-auto" />
                        ) : (
                          <XIcon className="w-4 h-4 text-rose-500/70 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.doppler ? (
                          <Check className="w-4 h-4 text-[#34D399]/80 mx-auto" />
                        ) : (
                          <XIcon className="w-4 h-4 text-rose-500/70 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION
         ========================================================================= */}
      <section className="py-28 px-4 sm:px-6 bg-[#26000B] relative border-t border-[#FFB4C8]/15">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2D6D]/10 border border-[#FF2D6D]/20 text-xs font-mono font-bold uppercase tracking-widest text-[#FF85A2] mb-4">
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight font-sans">
              Got questions? We have answers.
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#FFB4C8]/15 bg-[#30000F]/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left text-base font-bold text-white hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#A26377] transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#FF2D6D]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-[#A26377] leading-relaxed border-t border-[#FFB4C8]/10 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CALL TO ACTION BANNER
         ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-[#180007] to-[#0D0106] relative overflow-hidden border-t border-[#FFB4C8]/15">
        <div className="max-w-5xl mx-auto rounded-3xl border border-[#FF2D6D]/30 bg-gradient-to-br from-[#30000F] via-[#26000B] to-[#1E000A] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_20px_80px_rgba(255,45,109,0.25)]">
          {/* Ambient Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF2D6D]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight font-sans">
              Ready to eliminate .env leaks across your team?
            </h2>
            <p className="text-[#F4B5C8]/90 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Set up your first project, invite your engineers, and run your apps with hardware-grade envelope
              encryption in under 3 minutes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#FF2D6D] to-[#E6004D] hover:from-[#FF4D85] hover:to-[#FF2D6D] transition-all shadow-[0_0_30px_rgba(255,45,109,0.5)] cursor-pointer border-none font-mono tracking-wide"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => navigate('/docs')}
                className="px-8 py-4 rounded-xl text-sm font-bold text-white border border-[#FFB4C8]/25 hover:border-[#FF2D6D]/50 hover:bg-[#30000F]/80 transition-all cursor-pointer bg-[#1E000A]/80 font-mono"
              >
                View Full Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Page Footer */}
      <LandingFooter />
    </div>
  );
};
