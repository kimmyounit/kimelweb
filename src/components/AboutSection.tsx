import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { soundEngine } from '../utils/soundEffects';
import { Quote, Sparkles, MoveRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { profile } = useData();
  const [activeTab, setActiveTab] = useState<'bio' | 'vision' | 'journey' | 'background'>('bio');

  return (
    <section id="about" className="relative w-full py-28 bg-neutral-950 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono-code text-neutral-400 uppercase tracking-widest mb-3">
              <span>Section 01</span>
              <span aria-hidden="true">·</span>
              <span>Genesis & Narrative</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
              About Kim El
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-400 font-light leading-relaxed">
            An uncompromising creative journey bridging international contemporary entertainment, avant-garde styling, and multi-layered sonic architecture.
          </p>
        </div>

        {/* 2-Column Split: Visual Column & Editorial Prose */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Official Portrait Framing */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 border border-white/15">
              <img
                src={profile.portraitImage || './assets/images/editorial_photoshoot_fashion_1793504968607.jpg'}
                alt={`${profile.name} Official Portrait`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] uppercase font-mono-code text-neutral-400 tracking-widest block mb-1">
                    Official Portraiture
                  </span>
                  <span className="font-display text-lg font-bold tracking-tight">
                    {profile.name}
                  </span>
                </div>
                <span className="text-xs font-mono-code text-neutral-400">
                  {profile.specs.find(s => s.label === 'Active Era')?.value || '2026'}
                </span>
              </div>
            </div>

            {/* Quiet caption underneath */}
            <div className="mt-4 flex items-center justify-between text-[11px] font-mono-code text-neutral-500">
              <span>CHRONO ARCHIVE // VOL. 1</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
          </div>

          {/* Right Column: Narrative & Interactive Segmented Sections */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            {/* Segmented Section Switcher (Interactive tab buttons) */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-neutral-900 border border-white/10 rounded-lg">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('bio');
                }}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  activeTab === 'bio'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Full Biography
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('vision');
                }}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  activeTab === 'vision'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Creative Vision
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('journey');
                }}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  activeTab === 'journey'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Career Journey
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('background');
                }}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  activeTab === 'background'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Personal Roots
              </button>
            </div>

            {/* Dynamic Content Panel */}
            <div className="min-h-[320px] transition-all duration-300">
              {activeTab === 'bio' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <p className="font-display text-xl sm:text-2xl font-semibold text-neutral-100 leading-snug">
                    {profile.bioSummary}
                  </p>
                  <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                    {profile.fullBio.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'vision' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-8 bg-neutral-900/60 border border-white/10 relative">
                    <Quote className="w-8 h-8 text-neutral-600 mb-4" />
                    <blockquote className="font-display text-xl sm:text-2xl text-white font-medium italic leading-relaxed">
                      "{profile.creativeVision}"
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-[1px] w-12 bg-white/40" />
                      <span className="text-xs uppercase font-mono-code tracking-widest text-neutral-400">
                        KIM EL // Artistic Manifesto
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed font-light">
                    Every release is envisioned as a unified artistic ecosystem where live performance, cinematography, and couture tailoring converge to articulate the human condition in an accelerating digital era.
                  </p>
                </div>
              )}

              {activeTab === 'journey' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="relative border-l border-white/20 pl-6 space-y-8">
                    {profile.careerJourney.map((step, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-neutral-800 border-2 border-white rounded-full group-hover:scale-125 transition-transform" />
                        <span className="font-mono-code text-xs text-neutral-400 tracking-widest block mb-1">
                          {step.year}
                        </span>
                        <h4 className="font-display text-lg font-bold text-white mb-1.5">
                          {step.milestone}
                        </h4>
                        <p className="text-sm text-neutral-300 leading-relaxed font-light">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'background' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-6 bg-neutral-900 border border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono-code text-neutral-400 uppercase tracking-wider mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Foundational Context</span>
                    </div>
                    <p className="text-base text-neutral-200 leading-relaxed font-light">
                      {profile.personalBackground}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 border border-white/10 bg-neutral-900/40">
                      <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                        Disciplines Mastered
                      </span>
                      <span className="font-display text-xl font-bold text-white">
                        Vocal & Visual
                      </span>
                    </div>
                    <div className="p-5 border border-white/10 bg-neutral-900/40">
                      <span className="text-[11px] font-mono-code text-neutral-400 block mb-1">
                        Global Outlook
                      </span>
                      <span className="font-display text-xl font-bold text-white">
                        Cross-Continental
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Adjacency Link to Profile Dossier */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>View verified artist specifications</span>
              </div>
              <a
                href="#profile"
                onClick={() => soundEngine.playClick()}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-neutral-300 group"
              >
                <span>Artist Dossier</span>
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
