import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { navigate } from '../../utils/router';

const SCENARIOS = [
  {
    id: 'run',
    name: 'Process-Memory Run',
    command: 'secretvault run --env production -- npm start',
    tag: 'RAM-Only Injection',
    env: 'production',
    logs: [
      { text: '[info] Connecting to SecretVault Global KMS Cluster...', color: 'text-[#A26377]' },
      { text: '✓ Authenticated machine identity (SHA256: 4e91...8c20)', color: 'text-[#FF85A2]' },
      { text: '✓ 18 secrets retrieved in 28ms (Redis L2 cache hit: 100%)', color: 'text-[#34D399]' },
      { text: '✓ AES-256-GCM envelope DEK verified with HSM Root Key', color: 'text-[#34D399]' },
      { text: '✓ Direct memory injection: Injected into /proc/$$/environ (RAM)', color: 'text-[#FFB4C8] font-semibold' },
      { text: '✓ 0 plaintext files written to disk (.env eliminated)', color: 'text-[#34D399] font-bold' },
      { text: '⚑ Audit log logged: Principal [svc-payment-worker] on [prod-us-east-1]', color: 'text-[#FBBF24]' },
      { text: '→ Application listening on http://localhost:8080', color: 'text-[#F4B5C8]' }
    ],
    stats: { secrets: 18, latency: '28ms', leaks: 0, diskBytes: '0 KB' }
  },
  {
    id: 'rotate',
    name: 'Shadow Rotation',
    command: 'secretvault rotate --secret STRIPE_SECRET_KEY --grace-period 24h',
    tag: 'Zero Downtime',
    env: 'production',
    logs: [
      { text: '[info] Initiating dual-phase shadow rotation for STRIPE_SECRET_KEY...', color: 'text-[#A26377]' },
      { text: '✓ Generated cryptographic key version v4 (AES-256-GCM)', color: 'text-[#34D399]' },
      { text: '✓ Secret provisioned to active shadow slot', color: 'text-[#FF85A2]' },
      { text: '✓ 48 live microservice pods notified via WebSocket SSE', color: 'text-[#34D399]' },
      { text: '✓ Grace-period active: Version v3 & v4 concurrently accepted (24h)', color: 'text-[#FBBF24] font-semibold' },
      { text: '✓ Zero dropped requests · Zero service restart required', color: 'text-[#34D399] font-bold' },
      { text: '→ Automatic retirement scheduled for: 2026-10-14T21:00:00Z', color: 'text-[#F4B5C8]' }
    ],
    stats: { secrets: 1, latency: '44ms', leaks: 0, diskBytes: '0 KB' }
  },
  {
    id: 'jit',
    name: 'JIT Break-Glass Access',
    command: 'secretvault jit request --env production --duration 30m --reason "P0 Incident #412"',
    tag: 'Dual-Approval',
    env: 'production',
    logs: [
      { text: '[info] Submitting Just-In-Time access request for [production-db]...', color: 'text-[#A26377]' },
      { text: '✓ Request submitted by [arjun.dev@gmail.com]', color: 'text-[#F4B5C8]' },
      { text: '✓ Real-time Slack approval alert broadcasted to #security-leads', color: 'text-[#FF85A2]' },
      { text: '✓ Approved with WebAuthn biometric passkey by [admin@acme.corp]', color: 'text-[#34D399]' },
      { text: '✓ Ephemeral cryptographic lease minted: [lease_9f2a_30m]', color: 'text-[#34D399] font-semibold' },
      { text: '✓ Auto-revocation scheduled: Active for 29m 59s remaining', color: 'text-[#FBBF24]' },
      { text: '⚑ SIEM audit trail captured and immutably signed', color: 'text-[#FFB4C8]' }
    ],
    stats: { secrets: 4, latency: '35ms', leaks: 0, diskBytes: '0 KB' }
  },
  {
    id: 'k8s',
    name: 'Kubernetes Sync',
    command: 'kubectl apply -f secretvault-sync.yaml',
    tag: 'Operator CRD',
    env: 'production',
    logs: [
      { text: '[info] SecretVault K8s Operator reconciling SecretVaultSync/prod-sync...', color: 'text-[#A26377]' },
      { text: '✓ OIDC ServiceAccount attestation verified (cluster: us-east-2)', color: 'text-[#FF85A2]' },
      { text: '✓ Synchronized 24 credentials to secret/payment-secrets (Opaque)', color: 'text-[#34D399]' },
      { text: '✓ Rolling restart of deployment/payment-api triggered without outage', color: 'text-[#34D399]' },
      { text: '✓ Drift detector active: continuous poll every 60s', color: 'text-[#FFB4C8] font-semibold' },
      { text: '→ Status: Healthy · 0 drift detected · All pods synced', color: 'text-[#34D399] font-bold' }
    ],
    stats: { secrets: 24, latency: '52ms', leaks: 0, diskBytes: '0 KB' }
  }
];

export const TerminalSimulator = () => {
  const [activeScenarioId, setActiveScenarioId] = useState('run');
  const [copied, setCopied] = useState(false);
  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeScenario.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-[#FFB4C8]/15 bg-[#1E000A]/95 backdrop-blur-2xl p-6 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF2D6D]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#760031]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF2D6D] animate-ping" />
            Interactive CLI & Cloud Simulator
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight font-sans">
            Experience Zero-Disk Secret Injection in Real Time
          </h3>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScenarioId(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none font-mono ${
                activeScenarioId === s.id
                  ? 'bg-[#FF2D6D] text-white font-bold shadow-[0_0_15px_rgba(255,45,109,0.4)]'
                  : 'text-[#A26377] hover:text-[#F4B5C8] bg-transparent'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Window Box */}
      <div className="relative z-10 rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#180007] border-b border-[#FFB4C8]/15">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs font-mono text-[#A26377] hidden sm:inline">
              secretvault-cli — {activeScenario.tag}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 rounded">
              HSM ONLINE
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-mono text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              title="Copy Command"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Command Line Input Bar */}
        <div className="px-6 py-4 bg-[#140006] border-b border-[#FFB4C8]/10 flex items-center justify-between gap-4 font-mono text-sm">
          <div className="flex items-center gap-3 flex-1 overflow-x-auto py-1">
            <span className="text-[#FF2D6D] font-bold">$</span>
            <span className="text-white font-semibold whitespace-nowrap">{activeScenario.command}</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A26377] hidden md:inline">
            RAM INJECTION
          </span>
        </div>

        {/* Terminal Logs Output */}
        <div className="p-6 font-mono text-xs md:text-sm space-y-2.5 min-h-[220px] bg-[#0D0106]">
          {activeScenario.logs.map((log, idx) => (
            <div key={idx} className={`flex items-start gap-2.5 leading-relaxed ${log.color}`}>
              <span className="text-[#5E3240] select-none">[{idx + 1}]</span>
              <span>{log.text}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-[#FF2D6D]">$</span>
            <span className="inline-block w-2 h-4 bg-[#FF2D6D] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Telemetry Footer Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full sm:w-auto">
          <div className="bg-[#30000F] border border-[#FFB4C8]/15 rounded-xl px-4 py-2">
            <div className="text-[10px] font-mono text-[#A26377] uppercase">Secrets Injected</div>
            <div className="text-base font-extrabold text-white font-mono">{activeScenario.stats.secrets} Keys</div>
          </div>
          <div className="bg-[#30000F] border border-[#FFB4C8]/15 rounded-xl px-4 py-2">
            <div className="text-[10px] font-mono text-[#A26377] uppercase">Resolution Latency</div>
            <div className="text-base font-extrabold text-[#FF85A2] font-mono">{activeScenario.stats.latency}</div>
          </div>
          <div className="bg-[#30000F] border border-[#FFB4C8]/15 rounded-xl px-4 py-2">
            <div className="text-[10px] font-mono text-[#A26377] uppercase">Disk Footprint</div>
            <div className="text-base font-extrabold text-[#34D399] font-mono">{activeScenario.stats.diskBytes}</div>
          </div>
          <div className="bg-[#30000F] border border-[#FFB4C8]/15 rounded-xl px-4 py-2">
            <div className="text-[10px] font-mono text-[#A26377] uppercase">Plaintext Leaks</div>
            <div className="text-base font-extrabold text-[#34D399] font-mono">0 Leaks</div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => navigate('/docs')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F4B5C8] hover:text-white border border-[#FFB4C8]/15 hover:border-[#FFB4C8]/30 hover:bg-[#30000F] transition-all cursor-pointer bg-transparent font-sans"
          >
            View CLI Guide
          </button>
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF2D6D] hover:bg-[#FF4D85] transition-all cursor-pointer border-none font-mono tracking-wide shadow-[0_0_20px_rgba(255,45,109,0.35)]"
          >
            <span>Try in Workspace</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
