import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Shield,
  Lock,
  Terminal,
  Cpu
} from 'lucide-react';
import { LandingNav } from '../landing/LandingNav';
import { LandingFooter } from '../landing/LandingFooter';
import { navigate } from '../../utils/router';

const FAQS = [
  {
    q: 'What is SecretVault and how is it different from .env files?',
    a: 'SecretVault is a zero-trust enterprise secrets governance platform. Unlike plain text .env files—which are easily leaked through version control commits or shared over unencrypted chat channels—SecretVault encrypts all credentials at rest with AES-256-GCM envelope encryption and injects values directly into application process memory (RAM) at runtime with zero disk traces.'
  },
  {
    q: 'How does the AES-256-GCM envelope encryption work?',
    a: 'Every secret version generates an ephemeral 256-bit Data Encryption Key (DEK). The secret value is encrypted under this DEK with a unique 96-bit IV and Galois authentication tag. The DEK itself is encrypted under a Master Key Encryption Key (KEK) using RFC 3394 AES Key Wrap. Furthermore, Authenticated Additional Data (AAD) binds the ciphertext to the secret ID, environment, and version, preventing cipher swapping attacks.'
  },
  {
    q: 'Does SecretVault ever write plaintext credentials to local disk?',
    a: 'No. When using `secretvault run`, the CLI decodes credentials in memory and passes them straight to the child process environment block via ProcessBuilder. When the process terminates, decrypted values disappear from volatile memory without leaving temporary files.'
  },
  {
    q: 'How does Just-in-Time (JIT) access eliminate standing privileges?',
    a: 'Rather than giving engineers permanent read access to production databases or third-party API keys, developers submit time-bounded JIT requests specifying a lease duration and an active incident justification. The request requires approval from an independent workspace Owner or Admin, and access revokes automatically when the timer expires.'
  },
  {
    q: 'How do CI/CD runners authenticate without permanent static tokens?',
    a: 'SecretVault supports RFC 7519 OpenID Connect (OIDC) workload identity federation. GitHub Actions, GitLab CI, and Kubernetes workloads present ephemeral ID tokens to the SecretVault control plane, which validates repository claims and issues short-lived session tokens (600s TTL) with zero static credentials.'
  },
  {
    q: 'Which multi-cloud hosting providers and developer frameworks are supported?',
    a: 'SecretVault provides verified native adapters for Vercel, Render, Kubernetes (via native SecretVaultSync CRD), Terraform Provider, Java 21 / Spring Boot 3.x Starter, Node.js/TypeScript SDK, and Python SDK.'
  },
  {
    q: 'How is Redis used in the architecture?',
    a: 'Redis 7 serves as an L2 microsecond cache for safe workspace, project, and environment metadata, distributed rate limiting token buckets, short-lived session state, and pub/sub cache invalidation. Plaintext secret values and authorization decisions are never stored in shared Redis caches.'
  },
  {
    q: 'What are the deployment prerequisites to run SecretVault locally?',
    a: 'SecretVault runs locally with Docker Compose for PostgreSQL 16 and Redis 7, Java 21+ for the Spring Boot backend control plane, and Node.js 18+ for the React/Vite web interface and CLI.'
  }
];

export const FaqPage = ({ isAuthenticated = false, user = null }) => {
  // Enforce single-open accordion: strictly only one question open at a time
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <div className="min-h-screen bg-[#26000B] text-[#F4B5C8] font-sans selection:bg-[#FF2D6D] selection:text-white">
      <LandingNav isAuthenticated={isAuthenticated} user={user} />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF2D6D]/30 bg-[#FF2D6D]/15 text-[#FF85A2] font-mono text-xs font-semibold uppercase tracking-wider mb-6">
          <HelpCircle className="w-3.5 h-3.5 text-[#FF2D6D]" />
          <span>Technical FAQ</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Frequently Asked <span className="text-[#FF2D6D]">Questions</span>
        </h1>
        <p className="text-base sm:text-xl text-[#F4B5C8] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Answers to technical questions regarding cryptography, RAM process injection, JIT access, and cloud integrations.
        </p>
      </section>

      {/* Accordion List (Single Open Only) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#FFB4C8]/15 bg-[#30000F] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-white hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#A26377] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#FF2D6D]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#F4B5C8] leading-relaxed border-t border-[#FFB4C8]/10 bg-[#1E000A]">
                    <p className="m-0">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 bg-[#1E000A] border-t border-[#FFB4C8]/15 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-white">
            Have more questions?
          </h2>
          <p className="text-sm text-[#A26377] max-w-xl mx-auto">
            Explore the comprehensive documentation portal or join our developer community discussions.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/docs')}
              className="px-8 py-3.5 rounded-xl text-xs font-mono font-bold text-white bg-[#FF2D6D] hover:bg-[#FF4D85] transition-all shadow-lg shadow-[#FF2D6D]/20 cursor-pointer border-none"
            >
              Open Technical Documentation →
            </button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
