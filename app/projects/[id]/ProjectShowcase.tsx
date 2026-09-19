'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

type MediaItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
};

type ProjectWithMedia = {
  id: string;
  title: string;
  slogan: string;
  description: string;
  liveLink: string | null;
  githubUrl: string | null;
  thumbnailUrl: string | null;
  isPersonal: boolean;
  skills: { name: string }[];
  pictures: { id: string; url: string }[];
  videos: { id: string; url: string }[];
};

function toAbsoluteUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function ProjectShowcase({ project }: { project: ProjectWithMedia }) {
  const mediaPlaylist: MediaItem[] = [];

  if (project.thumbnailUrl) {
    mediaPlaylist.push({ id: 'hero-thumb', type: 'image', url: project.thumbnailUrl });
  }

  project.videos.forEach((vid) => {
    mediaPlaylist.push({ id: vid.id, type: 'video', url: vid.url });
  });

  project.pictures.forEach((img) => {
    mediaPlaylist.push({ id: img.id, type: 'image', url: img.url });
  });

  const hasMedia = mediaPlaylist.length > 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = mediaPlaylist[activeIndex];

  return (
    <main className="min-h-screen bg-main text-default p-4 md:p-12 font-sans selection:bg-primary/30">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-center justify-between text-xs font-mono text-muted uppercase tracking-wider">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            ← Home
          </Link>
        </div>

        <header className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-primary md:text-5xl uppercase">
            {project.title}
          </h1>
          <p className="text-accent font-medium text-md md:text-lg tracking-wide italic">
            {project.slogan || "No operational subtitle specified."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-surface/40 p-4 rounded-xl border border-surface/60 shadow-2xl backdrop-blur-md items-start">

          <div className="lg:col-span-7 space-y-3 flex flex-col justify-start">

            <div className="relative w-full aspect-video bg-black/80 rounded-lg overflow-hidden border border-surface group shadow-inner">
              {hasMedia ? (
                activeMedia.type === 'video' ? (
                  <video
                    key={activeMedia.url}
                    src={activeMedia.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={activeMedia.url}
                    alt={`${project.title} asset view`}
                    fill
                    sizes="(max-w-1200px) 100vw, 60vw"
                    priority
                    className="object-contain select-none transition-all duration-300"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted text-sm font-mono">
                  [ NO DISPLAY ASSETS INITIALIZED ]
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-surface scrollbar-track-transparent">
              {mediaPlaylist.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative flex-shrink-0 w-24 aspect-video rounded md:rounded-md overflow-hidden bg-black/40 border-2 transition-all cursor-pointer ${
                      isActive ? 'border-primary scale-[0.96] shadow-md' : 'border-surface hover:border-muted'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100" muted />
                    ) : (
                      <Image
                        src={item.url}
                        alt="Thumbnail index selector"
                        fill
                        sizes="96px"
                        className="object-cover opacity-70 group-hover:opacity-100"
                      />
                    )}
                    {!isActive && <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-main/40 p-5 rounded-lg border border-surface/50 min-h-full self-stretch">

            <div className="space-y-4">
              <div className="space-y-3">
                <span className="text-[16px] font-mono tracking-wider text-muted uppercase block">Project Specification</span>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center text-xs font-mono font-bold tracking-wide bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 rounded">
                    {project.isPersonal ? 'Personal Project' : 'Freelance Project'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono tracking-widest text-muted/80 uppercase block">Engine Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="text-xs font-mono bg-surface text-default/90 border border-surface/80 px-2 py-0.5 rounded">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-surface my-3 pt-3" />

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono tracking-widest text-muted/80 uppercase block">Project Description</span>
                  <p className="text-sm text-default/90 leading-relaxed font-normal font-sans whitespace-pre-wrap break-words">
                    {project.description}
                  </p>
                </div>

              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-surface mt-auto">
              {project.liveLink && (
                <a
                  href={toAbsoluteUrl(project.liveLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-default font-bold text-sm py-3 px-4 rounded-lg shadow-lg hover:bg-primary/90 hover:scale-[1.01] transition-all"
                >
                  🌐 Visit Live
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={toAbsoluteUrl(project.githubUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-surface hover:bg-surface/80 border border-muted/20 text-default font-semibold text-sm py-2.5 px-4 rounded-lg transition-all hover:scale-[1.01] transition-all"
                >
                  <code className="text-accent font-bold">&lt;/&gt;</code> Visit Github Repo
                </a>
              )}
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}