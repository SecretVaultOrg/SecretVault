import React, { useState, useEffect } from 'react';
import { Shield, BookOpen, LogIn, ArrowRight, Menu, X, Terminal, Cpu } from 'lucide-react';
import { navigate } from '../../utils/router';

export const LandingNav = ({ isAuthenticated = false, user = null }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1E000A]/90 backdrop-blur-xl border-b border-[#FF2D6D]/20 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left focus:outline-none group bg-transparent border-none cursor-pointer p-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2D6D]/20 via-[#80002A]/30 to-[#FF2D6D]/10 border border-[#FF2D6D]/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,45,109,0.3)] group-hover:shadow-[0_0_25px_rgba(255,45,109,0.5)] transition-all">
              <Shield className="w-5 h-5 text-[#FF2D6D] group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 rounded-xl bg-[#FF2D6D]/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white font-mono flex items-center">
                Secret<span className="text-[#FF2D6D]">Vault</span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 rounded">v2.4</span>
              </span>
              <span className="block text-[10px] font-mono tracking-wider text-[#A26377] -mt-0.5">
                ZERO-TRUST SECRETS FABRIC
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigate('/features')}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#F4B5C8]/80 hover:text-white hover:bg-[#30000F]/60 transition-all cursor-pointer bg-transparent border-none font-sans"
            >
              Features
            </button>
            <button
              onClick={() => navigate('/integrations')}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#F4B5C8]/80 hover:text-white hover:bg-[#30000F]/60 transition-all cursor-pointer bg-transparent border-none font-sans"
            >
              Integrations
            </button>
            <button
              onClick={() => navigate('/architecture')}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#F4B5C8]/80 hover:text-white hover:bg-[#30000F]/60 transition-all cursor-pointer bg-transparent border-none font-sans"
            >
              Architecture
            </button>
            <button
              onClick={() => navigate('/security')}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#F4B5C8]/80 hover:text-white hover:bg-[#30000F]/60 transition-all cursor-pointer bg-transparent border-none font-sans"
            >
              Security
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#F4B5C8]/80 hover:text-white hover:bg-[#30000F]/60 transition-all cursor-pointer bg-transparent border-none font-sans"
            >
              About
            </button>
            <button
              onClick={() => navigate('/docs')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#FF85A2] hover:text-white hover:bg-[#FF2D6D]/15 transition-all cursor-pointer bg-transparent border border-[#FF2D6D]/30 font-sans flex items-center gap-1.5 ml-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FF2D6D]" />
              Docs
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/app')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF2D6D] to-[#E6004D] hover:from-[#FF4D85] hover:to-[#FF2D6D] transition-all shadow-[0_0_20px_rgba(255,45,109,0.4)] cursor-pointer border-none font-mono tracking-wide"
              >
                <span>Console Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#F4B5C8] hover:text-white hover:bg-[#30000F]/80 transition-all cursor-pointer border border-[#FFB4C8]/20 font-sans flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#A26377]" />
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF2D6D] to-[#E6004D] hover:from-[#FF4D85] hover:to-[#FF2D6D] transition-all shadow-[0_0_25px_rgba(255,45,109,0.45)] cursor-pointer border-none font-mono tracking-wide"
                >
                  <span>Start Free Vault</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-[#30000F] border border-[#FFB4C8]/20 text-[#F4B5C8] hover:text-white cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-5 rounded-2xl bg-[#1E000A]/98 backdrop-blur-2xl border border-[#FFB4C8]/20 shadow-2xl flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/features');
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#F4B5C8] hover:bg-[#30000F] cursor-pointer bg-transparent border-none"
            >
              Features
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/integrations');
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#F4B5C8] hover:bg-[#30000F] cursor-pointer bg-transparent border-none"
            >
              Integrations
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/architecture');
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#F4B5C8] hover:bg-[#30000F] cursor-pointer bg-transparent border-none"
            >
              Architecture
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/security');
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#F4B5C8] hover:bg-[#30000F] cursor-pointer bg-transparent border-none"
            >
              Security
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/about');
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#F4B5C8] hover:bg-[#30000F] cursor-pointer bg-transparent border-none"
            >
              About
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/docs');
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#FF85A2] hover:bg-[#FF2D6D]/15 cursor-pointer bg-transparent border border-[#FF2D6D]/30"
            >
              Documentation
            </button>
            <div className="pt-3 border-t border-[#FFB4C8]/15 flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/app');
                  }}
                  className="w-full py-3 rounded-xl text-center text-xs font-bold text-white bg-[#FF2D6D] hover:bg-[#FF4D85] cursor-pointer border-none font-mono"
                >
                  Go to Console Dashboard →
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-[#F4B5C8] hover:text-white border border-[#FFB4C8]/20 cursor-pointer bg-transparent font-sans"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/register');
                    }}
                    className="w-full py-3 rounded-xl text-center text-xs font-bold text-white bg-[#FF2D6D] hover:bg-[#FF4D85] cursor-pointer border-none font-mono"
                  >
                    Start Free Vault →
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
