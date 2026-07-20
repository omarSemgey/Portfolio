'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  slogan: string | null;
  description: string;
  rank: number;
  thumbnailUrl: string | null;
  isPersonal: boolean;
  skills: { name: string }[] | string[];
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchShowcase() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to download project directory context.');
        
        const data: Project[] = await res.json();
        const sorted = data.sort((a, b) => a.rank - b.rank);
        setProjects(sorted);
      } catch (err) {
        console.error('Error compiling project arrays:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShowcase();
  }, []);

  if (isLoading) {
    return (
      <section id="projects" className="bg-main py-20 px-4 flex items-center justify-center">
        <span className="text-xs font-mono uppercase tracking-widest text-muted animate-pulse">
          Streaming portfolio asset tree...
        </span>
      </section>
    );
  }

  return (
    <section id="projects" className="relative bg-main py-24 px-4 border-t border-surface/30 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
            Selected Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-default tracking-tight">
            Systems & Solutions
          </h2>
          <div className="w-12 h-[2px] bg-primary mx-auto rounded mt-4" />
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs font-mono text-muted uppercase tracking-wider">No active project payloads registered.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)] max-w-sm flex flex-col bg-surface border border-surface/50 rounded-xl overflow-hidden shadow-xl hover:border-primary/30 transition-all duration-300 group"
              >
                {/* Image Showcase Frame */}
                <div className="relative aspect-video w-full bg-main overflow-hidden border-b border-main/40">
                  {project.thumbnailUrl ? (
                    <Image 
                      src={project.thumbnailUrl} 
                      alt={project.title}
                      fill
                      sizes="(max-w-7xl) 33vw, (max-w-md) 50vw, 100vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono text-muted/40 uppercase tracking-widest">
                      Missing Asset Map
                    </div>
                  )}
                </div>

                {/* Meta Core Content */}
                <div className="p-5 md:p-6 flex flex-col flex-1 space-y-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-bold text-default tracking-tight group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    {project.slogan && (
                      <p className="text-xs font-mono font-medium text-accent uppercase tracking-wide truncate">
                        {project.slogan}
                      </p>
                    )}

                    <div className="pt-1">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border bg-accent/10 text-accent border-accent/20`}>
                        {project.isPersonal ? 'Personal Project' : 'Freelance Project'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Link 
                      href={`/projects/${project.id}`}
                      className="w-full text-center block bg-main hover:bg-primary/10 text-default hover:text-primary border border-main/80 hover:border-primary/20 text-xs font-semibold py-2.5 rounded-lg transition-all tracking-wide"
                    >
                      View Project Details →
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}