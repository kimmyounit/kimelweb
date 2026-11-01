import React from 'react';
import { useData } from '../context/DataContext';
import { soundEngine } from '../utils/soundEffects';
import { ShieldCheck, ArrowUpRight, Award, Mic, Eye, Sparkles } from 'lucide-react';

export const ProfileSection: React.FC = () => {
  const { profile } = useData();

  return (
    <section id="profile" className="relative w-full py-28 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono-code text-neutral-400 uppercase tracking-widest mb-3">
              <span>Section 02</span>
              <span aria-hidden="true">·</span>
              <span>Professional Dossier</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
              Artist Profile
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Official Representation Archive</span>
          </div>
        </div>

        {/* Dossier Grid: 3-column architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1: Official Photo & Stage Identity */}
          <div className="lg:col-span-4 p-8 bg-neutral-950 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-900 border border-white/10 mb-6">
                <img
                  src={profile.heroImage || './assets/aistudio/WhatsApp_Image_2026-11-01_at_10.46.55_1c5c2e00.jpeg'}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter contrast-125"
                />
              </div>
              <span className="text-[11px] font-mono-code uppercase tracking-widest text-neutral-500 block mb-1">
                Artist Legal & Stage Identity
              </span>
              <h3 className="font-display text-3xl font-extrabold text-white uppercase tracking-tight mb-2">
                {profile.name}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                {profile.tagline}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono-code text-neutral-400">
              <span>STATUS: ACTIVE GLOBAL</span>
              <span className="text-white">VERIFIED 2026</span>
            </div>
          </div>

          {/* Card 2: Disciplines & Artistic Capabilities */}
          <div className="lg:col-span-4 p-8 bg-neutral-950 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-code text-neutral-400 uppercase tracking-widest mb-6 pb-3 border-b border-white/10">
                <Award className="w-4 h-4 text-white" />
                <span>Disciplines & Mastery</span>
              </div>

              <div className="space-y-4">
                {profile.disciplines.map((discipline, index) => (
                  <div
                    key={index}
                    className="p-3.5 bg-neutral-900/60 border border-white/5 hover:border-white/20 transition-colors flex items-start gap-3"
                  >
                    <span className="font-mono-code text-xs text-neutral-500 pt-0.5">
                      0{index + 1}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {discipline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <span className="text-[11px] font-mono-code text-neutral-500 block mb-2">
                PERFORMANCE CAPABILITIES
              </span>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Mic className="w-3.5 h-3.5 text-neutral-400" />
                <span>Stadium Touring</span>
                <span aria-hidden="true">·</span>
                <Eye className="w-3.5 h-3.5 text-neutral-400" />
                <span>Editorial Direction</span>
              </div>
            </div>
          </div>

          {/* Card 3: Specifications & Executive Management */}
          <div className="lg:col-span-4 p-8 bg-neutral-950 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-code text-neutral-400 uppercase tracking-widest mb-6 pb-3 border-b border-white/10">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Management & Specifications</span>
              </div>

              {/* Specs Table */}
              <div className="space-y-3 mb-8">
                {profile.specs.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-white/5 text-xs"
                  >
                    <span className="text-neutral-500 font-mono-code">{item.label}</span>
                    <span className="text-neutral-200 font-medium text-right">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Representation Block */}
              <div className="p-4 bg-neutral-900 border border-white/10">
                <span className="text-[10px] uppercase font-mono-code tracking-widest text-neutral-400 block mb-1">
                  Global Representation
                </span>
                <h4 className="font-display text-sm font-bold text-white mb-1">
                  {profile.management.agency}
                </h4>
                <p className="text-xs text-neutral-400 font-mono-code mb-3">
                  {profile.management.headquarters}
                </p>
                <div className="text-xs text-neutral-300 space-y-1">
                  <div>
                    <span className="text-neutral-500">Official: </span>
                    <a href={`mailto:${profile.management.email}`} className="hover:text-white underline">
                      {profile.management.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
              <a
                href="#contact"
                onClick={() => soundEngine.playClick()}
                className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>Initiate Business Contact</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
