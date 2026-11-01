import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { GalleryCategory, GalleryItem } from '../types';
import { soundEngine } from '../utils/soundEffects';
import { Play, Maximize2, Camera } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery, setSelectedMedia } = useData();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all');

  const categories: { key: GalleryCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Archives' },
    { key: 'photoshoot', label: 'Official Photoshoot' },
    { key: 'editorial', label: 'Editorial' },
    { key: 'bts', label: 'Behind The Scenes' },
    { key: 'event', label: 'Event Documentation' },
    { key: 'video', label: 'Video Gallery' },
  ];

  const filteredItems = activeCategory === 'all'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  const handleOpenMedia = (item: GalleryItem) => {
    soundEngine.playClick();
    setSelectedMedia(item);
  };

  return (
    <section id="gallery" className="relative w-full py-28 bg-neutral-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono-code text-neutral-400 uppercase tracking-widest mb-3">
              <span>Section 03</span>
              <span aria-hidden="true">·</span>
              <span>Visual Monograph</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
              Visual Gallery
            </h2>
          </div>

          {/* Interactive Filter Control Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-neutral-900 border border-white/10 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCategory(cat.key);
                }}
                className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.key
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric International Fashion Magazine Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[280px]">
          {filteredItems.map((item, index) => {
            // Asymmetric rhythm layout
            const isWide = index % 5 === 1 || index % 5 === 4 || item.aspectRatio === 'landscape';
            const isTall = index % 5 === 0 || item.aspectRatio === 'portrait';
            const colSpan = isWide ? 'lg:col-span-8' : isTall ? 'lg:col-span-4' : 'lg:col-span-6';
            const rowSpan = isTall ? 'sm:row-span-2' : 'sm:row-span-1';

            return (
              <div
                key={item.id}
                onClick={() => handleOpenMedia(item)}
                className={`relative group overflow-hidden bg-neutral-900 border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer ${colSpan} ${rowSpan}`}
              >
                {/* Media Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Media Type Icon (Video play or expand) */}
                <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all">
                  {item.category === 'video' ? (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Content Overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 text-[11px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1.5">
                    <span>{item.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.year}</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight line-clamp-1 group-hover:text-neutral-200">
                    {item.title}
                  </h3>
                  {item.credits && (
                    <p className="text-xs text-neutral-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-light truncate">
                      {item.credits}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center border border-white/10 bg-neutral-900/30">
            <Camera className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">No archives in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};
