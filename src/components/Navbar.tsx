import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { soundEngine } from '../utils/soundEffects';
import { Volume2, VolumeX, Menu, X, SlidersHorizontal } from 'lucide-react';
import logoImg from '../assets/aistudio/Tak_berjudul3_20261101103042_8f9c5619.png';

export const Navbar: React.FC = () => {
  const { setIsAdminOpen } = useData();
  const { isAuthenticated, openLoginModal } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const active = soundEngine.toggleAmbient();
    setSoundActive(active);
  };

  // Secret trigger: Triple click logo opens login modal
  const handleLogoClick = () => {
    soundEngine.playClick();
    const nextCount = logoClickCount + 1;
    setLogoClickCount(nextCount);

    if (nextCount >= 3) {
      setLogoClickCount(0);
      if (isAuthenticated) {
        setIsAdminOpen(true);
      } else {
        openLoginModal();
      }
    } else {
      setTimeout(() => setLogoClickCount(0), 1000);
    }
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Profile', href: '#profile' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Projects', href: '#projects' },
    { label: 'News', href: '#news' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-white/10 py-3'
            : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Wordmark logo */}
          <div
            className="flex items-center gap-3 group shrink-0 cursor-pointer select-none"
            onClick={handleLogoClick}
            title="KIM EL"
          >
            <img
              src={logoImg}
              alt="KIM EL Logo"
              className="h-8 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.src = './assets/aistudio/Tak_berjudul3_20261101103042_8f9c5619.png';
              }}
            />
            <span className="font-display text-lg font-bold tracking-widest text-white whitespace-nowrap">
              KIM EL
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-medium text-neutral-400">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => soundEngine.playClick()}
                className="hover:text-white transition-colors duration-200 whitespace-nowrap shrink-0 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Audio Atmosphere button */}
            <button
              onClick={handleAudioToggle}
              title={soundActive ? 'Mute Sound Atmosphere' : 'Play Sound Atmosphere'}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] uppercase tracking-wider text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {soundActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Sound</span>
                </>
              )}
            </button>

            {/* Admin Dashboard Access (ONLY visible when admin is logged in) */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsAdminOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 rounded transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.25)]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Dashboard (Admin)</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 lg:hidden animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-6">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono-code">
              Navigation / KIM EL
            </span>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  soundEngine.playClick();
                  setMobileMenuOpen(false);
                }}
                className="font-display text-3xl font-bold tracking-tight text-neutral-200 hover:text-white hover:translate-x-2 transition-transform"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-wider text-neutral-400">Atmosphere Sound</span>
              <button
                onClick={handleAudioToggle}
                className="flex items-center gap-2 px-3 py-1 text-xs border border-white/20 rounded text-neutral-200"
              >
                {soundActive ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundActive ? 'Active' : 'Muted'}</span>
              </button>
            </div>

            {/* Admin button in mobile menu only if authenticated */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full py-3 text-center text-xs font-bold uppercase tracking-widest text-black bg-white rounded flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Buka CMS Dashboard</span>
              </button>
            )}

            <p className="text-[11px] text-neutral-500 text-center font-mono-code">
              KIM EL — OFFICIAL ARTIST © 2026
            </p>
          </div>
        </div>
      )}
    </>
  );
};
