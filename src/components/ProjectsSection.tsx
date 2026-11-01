import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ProjectCategory, ProjectItem } from '../types';
import { soundEngine } from '../utils/soundEffects';
import { Calendar, ArrowUpRight, FolderGit2 } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { projects } = useData();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const categories: { key: ProjectCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'current', label: 'Current' },
    { key: 'previous', label: 'Previous' },
    { key: 'collaboration', label: 'Collaborations' },
    { key: 'appearance', label: 'Appearances' },
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const toggleExpand = (id: string) => {
    soundEngine.playClick();
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  return (
    <section id="projects" className="relative w-full py-28 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono-code text-neutral-400 uppercase tracking-widest mb-3">
              <span>Section 04</span>
              <span aria-hidden="true">·</span>
              <span>Repertoire & Ventures</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
              Projects & Activities
            </h2>
          </div>

          {/* Segmented Filter Buttons */}
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

        {/* Project List / Editorial Showcase */}
        <div className="space-y-6">
          {filteredProjects.map((project: ProjectItem) => {
            const isExpanded = expandedProjectId === project.id;

            return (
              <div
                key={project.id}
                className="p-6 md:p-8 bg-neutral-950 border border-white/10 hover:border-white/25 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left: Thumbnail Preview */}
                  <div className="lg:col-span-4 aspect-[16/10] overflow-hidden bg-neutral-900 border border-white/10">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter grayscale contrast-115 hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  {/* Right: Project Information */}
                  <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Unboxed Metadata with Typographic Separator */}
                      <div className="flex items-center gap-2 text-xs font-mono-code text-neutral-400 uppercase tracking-widest mb-2">
                        <span>{project.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.releaseDate}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-white font-medium">{project.role}</span>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                        {project.title}
                      </h3>

                      <p className="text-sm text-neutral-300 leading-relaxed font-light">
                        {project.summary}
                      </p>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && project.details && (
                      <div className="p-4 bg-neutral-900/60 border-l border-white/20 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed animate-in fade-in duration-200">
                        {project.details}
                      </div>
                    )}

                    {/* Footer Row: Tags & Actions */}
                    <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                      {/* Unboxed Tags */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        {project.tags.map((tag, tIdx) => (
                          <React.Fragment key={tag}>
                            <span>{tag}</span>
                            {tIdx < project.tags.length - 1 && <span aria-hidden="true">·</span>}
                          </React.Fragment>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleExpand(project.id)}
                          className="text-xs uppercase font-mono-code text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {isExpanded ? 'Less Info —' : 'More Details +'}
                        </button>

                        <a
                          href="#contact"
                          onClick={() => soundEngine.playClick()}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors"
                        >
                          <span>Inquire</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center border border-white/10 bg-neutral-900/30">
            <FolderGit2 className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">No projects in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};
