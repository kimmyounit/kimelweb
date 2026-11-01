import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { soundEngine } from '../utils/soundEffects';
import { X, Calendar, User, Film, ExternalLink } from 'lucide-react';

export const MediaModal: React.FC = () => {
  const { selectedMedia, setSelectedMedia, selectedNews, setSelectedNews } = useData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
        setSelectedNews(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedMedia, setSelectedNews]);

  if (!selectedMedia && !selectedNews) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Lightbox for Gallery Items */}
      {selectedMedia && (
        <div className="relative w-full max-w-5xl bg-neutral-950 border border-white/15 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
            <div className="flex items-center gap-3 text-xs font-mono-code text-neutral-400 uppercase tracking-widest">
              <span>{selectedMedia.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedMedia.year}</span>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                setSelectedMedia(null);
              }}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Media Viewport */}
          <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[65vh] overflow-hidden">
            {selectedMedia.category === 'video' && selectedMedia.videoUrl ? (
              <video
                src={selectedMedia.videoUrl}
                controls
                autoPlay
                className="w-full max-h-[65vh] object-contain"
              />
            ) : (
              <img
                src={selectedMedia.image}
                alt={selectedMedia.title}
                referrerPolicy="no-referrer"
                className="w-full max-h-[65vh] object-contain"
              />
            )}
          </div>

          {/* Bottom Details */}
          <div className="p-6 bg-neutral-950 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-bold text-white tracking-tight">
                {selectedMedia.title}
              </h3>
              {selectedMedia.description && (
                <p className="text-xs text-neutral-400 mt-1 font-light">
                  {selectedMedia.description}
                </p>
              )}
            </div>

            {selectedMedia.credits && (
              <div className="text-xs font-mono-code text-neutral-500 whitespace-nowrap">
                {selectedMedia.credits}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reader for News Items */}
      {selectedNews && (
        <div className="relative w-full max-w-3xl bg-neutral-950 border border-white/15 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
            <div className="flex items-center gap-3 text-xs font-mono-code text-neutral-400 uppercase tracking-widest">
              <span>{selectedNews.outlet}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedNews.date}</span>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                setSelectedNews(null);
              }}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Article Scroll Body */}
          <div className="overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-900 border border-white/10">
              <img
                src={selectedNews.coverImage}
                alt={selectedNews.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-mono-code uppercase tracking-widest text-neutral-400 block">
                Category: {selectedNews.category}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {selectedNews.title}
              </h2>
            </div>

            <p className="text-base font-medium text-neutral-200 italic border-l-2 border-white/40 pl-4 py-1">
              {selectedNews.excerpt}
            </p>

            <div className="text-sm text-neutral-300 leading-relaxed font-light space-y-4 pt-4 border-t border-white/10">
              <p>{selectedNews.content}</p>
              <p>
                As part of this announcement, KIM EL studio reaffirmed their commitment to pushing visual and acoustic boundaries. Further dates and accompanying visual teaser clips will be published via the official channels.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
