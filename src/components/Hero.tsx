import React from 'react';
import { useData } from '../context/DataContext';
import { soundEngine } from '../utils/soundEffects';
import { ArrowDownRight, Compass, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { profile } = useData();

  const handleScrollTo = (id: string) => {
    soundEngine.playClick();
    const elem = document.querySelector(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-end justify-center overflow-hidden bg-black pt-20 pb-16 md:pb-24">
      {/* Background Artist Image - Dominating the viewport */}
      <div className="absolute inset-0 z-0">
        <img
          src={profile.heroImage || './assets/aistudio/WhatsApp_Image_2026-11-01_at_10.46.55_1c5c2e00.jpeg'}
          alt={profile.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter contrast-125 brightness-90 md:scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Noir Vignette & Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-grain opacity-40 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Floating subtle metadata label */}
      <div className="absolute top-28 left-6 md:left-12 z-10 flex items-center gap-3 text-[11px] font-mono-code uppercase tracking-widest text-neutral-400">
        <span>Official Artist Representation</span>
        <span aria-hidden="true">/</span>
        <span>Global Sound & Vision</span>
      </div>

      <div className="absolute top-28 right-6 md:right-12 z-10 hidden sm:flex items-center gap-2 text-[11px] font-mono-code uppercase tracking-widest text-neutral-400">
        <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
        <span>Edition 2026</span>
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col justify-end">
        {/* Oversized Brand Typography */}
        <div className="mb-4">
          <div className="overflow-hidden">
            <h1 className="font-display text-[16vw] sm:text-[14vw] lg:text-[11vw] font-black leading-[0.85] tracking-tighter text-white uppercase select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              {profile.name}
            </h1>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-white/40 via-white/10 to-transparent mt-4 mb-6" />
        </div>

        {/* Lower Row: Taglines & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <p className="font-display text-sm sm:text-lg md:text-xl font-bold tracking-widest uppercase text-neutral-200">
              {profile.tagline}
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 tracking-wide">
              {profile.subTagline}
            </p>
          </div>

          {/* Action Buttons: Explore & Discover */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleScrollTo('#about')}
              className="group flex items-center gap-2.5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
            >
              <span>Explore</span>
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => handleScrollTo('#gallery')}
              className="group flex items-center gap-2.5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-white/5 hover:bg-white/15 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              <Compass className="w-4 h-4 text-neutral-300 group-hover:rotate-45 transition-transform" />
              <span>Discover</span>
            </button>
          </div>
        </div>

        {/* Bottom subtle bar */}
        <div className="flex items-center justify-between text-[11px] font-mono-code text-neutral-500 pt-8 mt-8 border-t border-white/10">
          <span>ARCHIVE NO. 01 // CHRONO ERA</span>
          <span className="hidden sm:inline">WORLDWIDE REPRESENTATION</span>
          <a
            href="#about"
            onClick={() => handleScrollTo('#about')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            SCROLL TO ENTER ↓
          </a>
        </div>
      </div>
    </section>
  );
};
