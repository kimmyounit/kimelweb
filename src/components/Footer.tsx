import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { soundEngine } from '../utils/soundEffects';
import { SlidersHorizontal, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { profile, setIsAdminOpen } = useData();
  const { isAuthenticated, openLoginModal } = useAuth();

  const scrollToTop = () => {
    soundEngine.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSecretAdminTrigger = () => {
    soundEngine.playClick();
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      openLoginModal();
    }
  };

  return (
    <footer className="relative w-full bg-black border-t border-white/10 pt-20 pb-12 text-neutral-400">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Col 1: Big Wordmark & Brand Mission */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Tak_berjudul3_20261101103042_8f9c5619.png"
                alt="KIM EL Logo"
                className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
              />
              <span className="font-display text-2xl font-bold tracking-widest text-white">
                KIM EL
              </span>
            </div>

            <p className="max-w-md text-xs text-neutral-400 font-light leading-relaxed">
              Official international artist portal and multimedia archive. Dedicated to pushing sonic minimalism, high-fashion editorial direction, and global arena visual spectacles.
            </p>

            <div className="text-[11px] font-mono-code text-neutral-500">
              REPRESENTATION: {profile.management.agency.toUpperCase()}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-xs uppercase font-mono-code tracking-widest text-white block">
              Sitemap Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" onClick={() => soundEngine.playClick()} className="hover:text-white transition-colors">
                  01. About Kim El
                </a>
              </li>
              <li>
                <a href="#profile" onClick={() => soundEngine.playClick()} className="hover:text-white transition-colors">
                  02. Artist Profile & Dossier
                </a>
              </li>
              <li>
                <a href="#gallery" onClick={() => soundEngine.playClick()} className="hover:text-white transition-colors">
                  03. Visual Gallery & Archives
                </a>
              </li>
              <li>
                <a href="#projects" onClick={() => soundEngine.playClick()} className="hover:text-white transition-colors">
                  04. Projects & Ventures
                </a>
              </li>
              <li>
                <a href="#news" onClick={() => soundEngine.playClick()} className="hover:text-white transition-colors">
                  05. News & Press Dispatches
                </a>
              </li>
              <li>
                <a href="#contact" onClick={() => soundEngine.playClick()} className="hover:text-white transition-colors">
                  06. Official Contact & Booking
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Management Office & Direct Actions */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-xs uppercase font-mono-code tracking-widest text-white block">
              Executive Liaison
            </span>
            <p className="text-xs text-neutral-400 font-mono-code leading-relaxed">
              {profile.management.headquarters}
            </p>
            <p className="text-xs text-neutral-500 font-mono-code">
              {profile.management.email}
            </p>

            {/* Admin CMS Access Button (Only shown when admin is logged in) */}
            {isAuthenticated && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsAdminOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer rounded"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Buka CMS Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-code text-neutral-500">
          {/* Discrete trigger: Clicking copyright text opens Admin Login */}
          <div
            onClick={handleSecretAdminTrigger}
            className="cursor-pointer select-none hover:text-neutral-300 transition-colors"
            title="KIM EL Portal"
          >
            KIM EL © {new Date().getFullYear()} — OFFICIAL ARTIST. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
