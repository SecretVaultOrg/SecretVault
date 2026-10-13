import React from 'react';
import {
  Shield,
  Layers,
  Cpu,
  Lock,
  Server,
  Cloud,
  Terminal,
  ArrowRight,
  Database,
  RefreshCw,
  GitBranch,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { LandingNav } from '../landing/LandingNav';
import { LandingFooter } from '../landing/LandingFooter';
import { navigate } from '../../utils/router';

export const ArchitecturePage = ({ isAuthenticated = false, user = null }) => {
  return (
    <div className="min-h-screen bg-[#26000B] text-[#F4B5C8] font-sans selection:bg-[#FF2D6D] selection:text-white">
      <LandingNav isAuthenticated={isAuthenticated} user={user} />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF2D6D]/30 bg-[#FF2D6D]/15 text-[#FF85A2] font-mono text-xs font-semibold uppercase tracking-wider mb-6">
          <Layers className="w-3.5 h-3.5 text-[#FF2D6D]" />
          <span>System Architecture &amp; Data Flows</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Verified <span className="text-[#FF2D6D]">cryptographic architecture</span>
        </h1>
        <p className="text-base sm:text-xl text-[#F4B5C8] max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Inspect how SecretVault separates concerns between volatile process memory, envelope KMS key wrapping, Redis L2 metadata caching, and transactional outbox event streams.
        </p>
      </section>

      {/* Main Architecture Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-16">
        {/* Diagram 1: Overall System Architecture */}
        <div className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5 font-sans">
              <Server className="w-6 h-6 text-[#FF2D6D]" />
              <span>1. High-Level System Architecture</span>
            </h2>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FF2D6D]/15 text-[#FF85A2] border border-[#FF2D6D]/30">
              Verified Production Pipeline
            </span>
          </div>
          <p className="text-xs text-[#F4B5C8] leading-relaxed mb-6">
            The platform architecture separates client execution layers from backend encryption services. No plaintext secrets ever traverse unencrypted channels or reach persistent storage unencrypted.
          </p>

          <div className="rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 p-6 font-mono text-xs text-[#FF85A2] overflow-x-auto leading-normal shadow-inner">
            <pre className="m-0">
{`+----------------------------------------------------------------------------------------------------+
|                                      CONSUMPTION / CLIENT TIER                                     |
|   +-----------------------+   +------------------------+   +-----------------------------------+   |
|   |  CLI (@secretvault)   |   |   K8s CRD Operator     |   |   SDKs (Spring Boot, Node, Py)    |   |
|   |  - Process Injection  |   |   - SecretVaultSync    |   |   - Volatile In-Memory Cache      |   |
|   |  - Zero Disk Traces   |   |   - Native K8s Secrets |   |   - SSE Rotation Subscriptions    |   |
|   +-----------+-----------+   +-----------+------------+   +-----------------+-----------------+   |
+---------------|---------------------------|----------------------------------|---------------------+
                |                           |                                  |
                +---------------------------+----------------------------------+
                                            |  mTLS / Bearer JWT (TenantContext)
                                            v
+----------------------------------------------------------------------------------------------------+
|                             CONTROL PLANE GATEWAY & AUTHORIZATION ENGINE                           |
|   - JwtAuthenticationFilter & UserPrincipal Evaluation      - Distributed Redis Rate Limiter       |
|   - EffectiveAccessService (Workspace ∩ Project ∩ Env)      - Step-Up MFA Challenge Enforcer      |
+-------------------------------------------+--------------------------------------------------------+
                                            |
                                            v
+----------------------------------------------------------------------------------------------------+
|                             CRYPTOGRAPHIC ENVELOPE ENCRYPTION SERVICE                              |
|   +---------------------------------------------+   +------------------------------------------+   |
|   |   AesGcmEnvelopeEncryptionService           |   |   KmsKeyProvider SPI                     |   |
|   |   - Ephemeral 256-bit DEK generation        |   |   - LocalDevKmsKeyProvider (RFC 3394)    |   |
|   |   - 96-bit secure IV nonce per version      |   |   - AWS KMS / GCP KMS / Azure Key Vault  |   |
|   |   - AAD context binding (secret:env:ver)    |   |   - Master KEK (Key Encryption Key)      |   |
|   +---------------------------------------------+   +------------------------------------------+   |
+-------------------------------------------+--------------------------------------------------------+
                                            |
                         +------------------+------------------+
                         |                                     |
                         v                                     v
+-------------------------------------------------+ +------------------------------------------------+
|       REDIS L2 DISTRIBUTED CACHE CLUSTER        | |          POSTGRESQL 16 ENTERPRISE STORE        |
|   - Workspace / Project Metadata (<12ms)        | |   - secrets (soft-deleted status)              |
|   - Rate Limiter Token Buckets                  | |   - secret_versions (AES-256-GCM ciphertext)   |
|   - Active JIT Leases & Session Tokens          | |   - audit_logs (append-only ledger)            |
|   - Pub/Sub Invalidation on Secret Mutations    | |   - domain_outbox (transactional events)       |
+-------------------------------------------------+ +------------------------------------------------+`}
            </pre>
          </div>
        </div>

        {/* Diagram 2: Envelope Encryption Flow */}
        <div className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5 font-sans">
              <Lock className="w-6 h-6 text-[#FF85A2]" />
              <span>2. Envelope Encryption &amp; AAD Context Binding</span>
            </h2>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FF2D6D]/15 text-[#FF85A2] border border-[#FF2D6D]/30">
              AES-256-GCM
            </span>
          </div>
          <p className="text-xs text-[#F4B5C8] leading-relaxed mb-6">
            Secrets are encrypted using ephemeral Data Encryption Keys (DEKs) wrapped by a Key Encryption Key (KEK). Authenticated Additional Data (AAD) cryptographically binds the ciphertext to the exact secret ID, environment, and version number.
          </p>

          <div className="rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 p-6 font-mono text-xs text-[#34D399] overflow-x-auto leading-normal shadow-inner">
            <pre className="m-0">
{`+----------------------------------------------------------------------------------------------------+
|                                    SECRET CREATION & ENCRYPTION FLOW                               |
|                                                                                                    |
|  Plaintext Secret  ───>  [Generate Ephemeral DEK (256-bit CSPRNG)] ───> [AES-256-GCM Cipher]      |
|                                       │                                        │                   |
|                                       ▼                                        ▼                   |
|                              [KmsKeyProvider SPI]                    [AAD Verification Tag]        |
|                              (Wraps DEK via KEK)                   secretId:environmentId:version  |
|                                       │                                        │                   |
|                                       ▼                                        ▼                   |
|                              wrapped DEK (Base64)                   Ciphertext + IV + AuthTag      |
|                                       │                                        │                   |
|                                       +───────────────────+────────────────────+                   |
|                                                           │                                        |
|                                                           ▼                                        |
|                                              Stored in secret_versions                             |
|                                              (Zero Plaintext Persisted)                            |
+----------------------------------------------------------------------------------------------------+`}
            </pre>
          </div>
        </div>

        {/* Diagram 3: Multi-Cloud Sync & Drift Engine */}
        <div className="rounded-3xl bg-[#30000F] border border-[#FFB4C8]/15 p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5 font-sans">
              <Cloud className="w-6 h-6 text-[#FF2D6D]" />
              <span>3. Multi-Cloud Synchronization &amp; Transactional Outbox</span>
            </h2>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FF2D6D]/15 text-[#FF85A2] border border-[#FF2D6D]/30">
              Guaranteed Delivery
            </span>
          </div>
          <p className="text-xs text-[#F4B5C8] leading-relaxed mb-6">
            When secrets are updated or rotated, domain events write atomically to the PostgreSQL outbox table within the same database transaction. Background workers poll and dispatch updates to external providers with exponential backoff retries.
          </p>

          <div className="rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 p-6 font-mono text-xs text-amber-300 overflow-x-auto leading-normal shadow-inner">
            <pre className="m-0">
{`+----------------------------------------------------------------------------------------------------+
|                             SYNCHRONIZATION & OUTBOX DISPATCH PIPELINE                             |
|                                                                                                    |
|   1. Mutation Event   ───> [Atomic DB Transaction]                                                 |
|                            ├── INSERT secret_versions (v_N+1)                                      |
|                            ├── INSERT audit_logs                                                   |
|                            └── INSERT domain_outbox (Event: SECRET_VALUE_UPDATED)                  |
|                                                                                                    |
|   2. Outbox Worker    ───> [Poll Unprocessed Outbox Events]                                        |
|                                      │                                                             |
|                                      ├───> Vercel Sync Adapter (Maps environments, updates envs)   |
|                                      ├───> Render Sync Adapter (Updates environment groups)        |
|                                      ├───> Kubernetes Operator (Reconciles SecretVaultSync CRD)    |
|                                      └───> Webhook Dispatcher (HMAC-SHA256 signed event delivery)  |
|                                                                                                    |
|   3. Drift Engine     ───> [Periodic Remote Checksum Verification]                                 |
|                            └── Identifies out-of-band mutations and flags drift in Risk Center     |
+----------------------------------------------------------------------------------------------------+`}
            </pre>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 bg-[#1E000A] border-t border-[#FFB4C8]/15 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-white">
            Explore the developer documentation
          </h2>
          <p className="text-sm text-[#A26377] max-w-xl mx-auto">
            Review detailed API specifications, Java SDK guides, and the full CLI reference manual.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/docs')}
              className="px-8 py-3.5 rounded-xl text-xs font-mono font-bold text-white bg-[#FF2D6D] hover:bg-[#FF4D85] transition-all shadow-lg shadow-[#FF2D6D]/20 cursor-pointer border-none"
            >
              Browse Complete Documentation →
            </button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
