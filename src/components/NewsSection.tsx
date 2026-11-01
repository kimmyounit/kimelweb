import React from 'react';
import { useData } from '../context/DataContext';
import { NewsItem } from '../types';
import { soundEngine } from '../utils/soundEffects';
import { Newspaper, ArrowRight } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { news, setSelectedNews } = useData();

  const handleReadArticle = (article: NewsItem) => {
    soundEngine.playClick();
    setSelectedNews(article);
  };

  return (
    <section id="news" className="relative w-full py-28 bg-neutral-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono-code text-neutral-400 uppercase tracking-widest mb-3">
              <span>Section 05</span>
              <span aria-hidden="true">·</span>
              <span>Press & Bulletins</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
              News & Updates
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-400 font-light leading-relaxed">
            Official announcements, media features, world tour updates, and dispatch reports from the KIM EL creative studio.
          </p>
        </div>

        {/* News Grid (3-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article
              key={item.id}
              onClick={() => handleReadArticle(item)}
              className="group flex flex-col justify-between bg-black border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-neutral-900 border-b border-white/10 relative">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 text-[10px] font-mono-code uppercase tracking-wider text-neutral-300">
                    {item.category}
                  </div>
                </div>

                <div className="p-6">
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-[11px] font-mono-code text-neutral-500 uppercase tracking-widest mb-3">
                    <span>{item.outlet}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white group-hover:text-neutral-200 transition-colors leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed font-light line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:text-white">
                <span>Read Dispatch</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>

        {news.length === 0 && (
          <div className="py-20 text-center border border-white/10 bg-neutral-900/30">
            <Newspaper className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">No dispatches published yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};
