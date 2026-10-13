import React from 'react';
import {
  Shield,
  Lock,
  KeyRound,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Server,
  FileCheck2,
  Terminal,
  ArrowRight
} from 'lucide-react';
import { LandingNav } from '../landing/LandingNav';
import { LandingFooter } from '../landing/LandingFooter';
import { navigate } from '../../utils/router';

export const SecurityPage = ({ isAuthenticated = false, user = null }) => {
  return (
    <div className="min-h-screen bg-[#26000B] text-[#F4B5C8] font-sans selection:bg-[#FF2D6D] selection:text-white">
      <LandingNav isAuthenticated={isAuthenticated} user={user} />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF2D6D]/30 bg-[#FF2D6D]/15 text-[#FF85A2] font-mono text-xs font-semibold uppercase tracking-wider mb-6">
          <Shield className="w-3.5 h-3.5 text-[#FF2D6D]" />
          <span>Security Model &amp; Trust Center</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Zero-trust security <span className="text-[#FF2D6D]">built from first principles</span>
        </h1>
        <p className="text-base sm:text-xl text-[#F4B5C8] max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Learn how SecretVault safeguards your infrastructure credentials with envelope encryption, memory-only execution, fine-grained access control, and complete audit integrity.
        </p>
      </section>

      {/* Core Security Controls Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF2D6D]/15 border border-[#FF2D6D]/30 flex items-center justify-center text-[#FF2D6D]">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Cryptographic Envelope Encryption
            </h3>
            <p className="text-xs text-[#F4B5C8] leading-relaxed">
              Every secret version is encrypted with an ephemeral 256-bit Data Encryption Key (DEK) via AES-256-GCM. The DEK is encrypted using a Master Key Encryption Key (KEK) via RFC 3394 AES Key Wrap.
            </p>
            <ul className="space-y-2 pt-2 border-t border-[#FFB4C8]/10 text-xs text-[#F4B5C8] list-none p-0">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>96-bit cryptographically secure IV nonce per version</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>AAD context binding to secretId:environmentId:version</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Re-encryption boundaries across environments</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF2D6D]/15 border border-[#FF2D6D]/30 flex items-center justify-center text-[#FF85A2]">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Zero Plaintext Disk Footprint
            </h3>
            <p className="text-xs text-[#F4B5C8] leading-relaxed">
              The CLI injects credentials directly into child process RAM via system environment blocks. No `.env` files are generated, preventing inadvertent Git commits or container image credential leaks.
            </p>
            <ul className="space-y-2 pt-2 border-t border-[#FFB4C8]/10 text-xs text-[#F4B5C8] list-none p-0">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>In-memory RAM injection via ProcessBuilder</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Automatic stdout/stderr token redaction</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Encrypted local session store with 0600 file permissions</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Just-in-Time (JIT) &amp; Dual Approval
            </h3>
            <p className="text-xs text-[#F4B5C8] leading-relaxed">
              Eliminate permanent standing privileges. Production reveals and modifications require time-bounded JIT access requests accompanied by an active incident justification.
            </p>
            <ul className="space-y-2 pt-2 border-t border-[#FFB4C8]/10 text-xs text-[#F4B5C8] list-none p-0">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Dual approval workflow enforced server-side</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Automatic lease expiration and background revocation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Mandatory incident justification captured in audit logs</span>
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Append-Only Audit Logs &amp; Outbox
            </h3>
            <p className="text-xs text-[#F4B5C8] leading-relaxed">
              Every interaction is written to an append-only database table. The transactional outbox pattern guarantees real-time delivery to security SIEM tools and HMAC-signed webhooks.
            </p>
            <ul className="space-y-2 pt-2 border-t border-[#FFB4C8]/10 text-xs text-[#F4B5C8] list-none p-0">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>No update or delete endpoints exist for audit records</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Full actor attribution: IP, user ID, request ID</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Real-time webhook events with HMAC-SHA256 signatures</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Engineering Transparency & Known Limitations */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="rounded-3xl bg-[#1E000A] border border-amber-500/30 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-xl font-bold font-sans">
              Engineering Transparency &amp; Known Limitations
            </h3>
          </div>
          <p className="text-xs text-[#F4B5C8] leading-relaxed">
            In accordance with SecretVault engineering principles, we clearly disclose operational boundaries rather than presenting conceptual capabilities as full production guarantees:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2">
              <h4 className="text-sm font-bold text-white">Local KMS vs Cloud KMS</h4>
              <p className="text-xs text-[#A26377] leading-relaxed">
                Local development uses LocalDevKmsKeyProvider with RFC 3394 AES Key Wrap. Production cloud KMS (AWS KMS, GCP KMS) requires valid cloud credentials configured via environment variables.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2">
              <h4 className="text-sm font-bold text-white">Sync Idempotency</h4>
              <p className="text-xs text-[#A26377] leading-relaxed">
                Multi-cloud synchronization to Vercel and Render is eventual. Temporary external API rate limits or network partitions will retry automatically via the outbox worker.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2">
              <h4 className="text-sm font-bold text-white">AI Posture Analysis</h4>
              <p className="text-xs text-[#A26377] leading-relaxed">
                Google Gemini AI copilot generates remediation playbooks based on telemetry patterns. It never receives secret plaintext values—only sanitized metadata and risk codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
