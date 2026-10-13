import React from 'react';
import { Shield, Github, BookOpen, Terminal, Cpu, Lock, ArrowUpRight } from 'lucide-react';
import { navigate } from '../../utils/router';

export const LandingFooter = () => {
  return (
    <footer className="border-t border-[#FFB4C8]/15 bg-[#140006] pt-20 pb-12 relative overflow-hidden">
      {/* Background cyber grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,45,109,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,109,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-left bg-transparent border-none cursor-pointer p-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF2D6D]/20 to-[#80002A]/20 border border-[#FF2D6D]/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#FF2D6D]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-mono">
                Secret<span className="text-[#FF2D6D]">Vault</span>
              </span>
            </button>
            <p className="text-xs sm:text-sm text-[#A26377] max-w-sm leading-relaxed">
              Enterprise Zero-Trust Secrets Management &amp; Environment Platform. Eliminates plaintext .env sprawl with
              AES-256-GCM envelope encryption, RAM process injection, automated shadow rotation, and Google Gemini AI security governance.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/SecretVaultOrg/SecretVault"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#30000F] border border-[#FFB4C8]/15 hover:border-[#FF2D6D]/50 flex items-center justify-center text-[#F4B5C8] hover:text-white transition-all"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <button
                onClick={() => navigate('/docs')}
                className="w-9 h-9 rounded-lg bg-[#30000F] border border-[#FFB4C8]/15 hover:border-[#FF2D6D]/50 flex items-center justify-center text-[#F4B5C8] hover:text-white transition-all cursor-pointer"
                title="Documentation"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF2D6D]/10 border border-[#FF2D6D]/20 text-[11px] font-mono text-[#FF85A2]">
                <span className="w-2 h-2 rounded-full bg-[#FF2D6D] animate-pulse" />
                <span>Zero Plaintext on Disk</span>
              </div>
            </div>
          </div>

          {/* Product & Platform */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF2D6D] mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs font-medium list-none p-0">
              <li>
                <button
                  onClick={() => navigate('/features')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Feature Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/architecture')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  System Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/security')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Security Model
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/changelog')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Release Changelog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Technical FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF85A2] mb-4">Integrations</h4>
            <ul className="space-y-2.5 text-xs font-medium list-none p-0">
              <li>
                <button
                  onClick={() => navigate('/integrations')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Integration Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/docs?section=vercel-integration')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Vercel Sync Adapter
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/docs?section=render-integration')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Render Sync Adapter
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/docs?section=k8s-operator')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Kubernetes CRD Operator
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/docs?section=terraform-provider')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Terraform Provider
                </button>
              </li>
            </ul>
          </div>

          {/* Developer Tools */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#34D399] mb-4">Developer Tools</h4>
            <ul className="space-y-2.5 text-xs font-medium list-none p-0">
              <li>
                <button
                  onClick={() => navigate('/docs?section=cli-overview')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  @secretvault/cli
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/docs?section=sdk-java')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Java 21 Spring Boot Starter
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/docs?section=vscode-overview')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  VS Code Extension
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/docs?section=github-actions')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  GitHub Actions OIDC
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-[#A26377] hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  About the Project
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 border-t border-[#FFB4C8]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A26377] font-mono">
          <div>
            © {new Date().getFullYear()} SecretVault Platform. Open-source enterprise secrets management.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/docs')}
              className="hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer"
            >
              Documentation
            </button>
            <button
              onClick={() => navigate('/login')}
              className="hover:text-[#FF85A2] transition-colors bg-transparent border-none cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="hover:text-[#FF2D6D] transition-colors bg-transparent border-none cursor-pointer"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
