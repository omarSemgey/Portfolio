'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [slogan, setSlogan] = useState('');
  const [description, setDescription] = useState('');
  const [rank, setRank] = useState('1');
  const [liveLink, setLiveLink] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const [isPersonal, setIsPersonal] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const [pictures, setPictures] = useState<string[]>([]);
  const [currentPicture, setCurrentPicture] = useState('');

  const [videos, setVideos] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState('');

  useEffect(() => {
    async function fetchProjectData() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        console.log(res);
        if (!res.ok) throw new Error('Failed to resolve project entity data.');
        
        const data = await res.json();
        
        setTitle(data.title || '');
        setSlogan(data.slogan || '');
        setDescription(data.description || '');
        setRank(String(data.rank ?? '1'));
        setLiveLink(data.liveLink || '');
        setGithubUrl(data.githubUrl || '');
        setThumbnailUrl(data.thumbnailUrl || '');
        setIsPersonal(data.isPersonal !== undefined ? data.isPersonal : true);

        const formattedSkills = data.skills?.map((s: any) => typeof s === 'object' ? s.name : s) || [];
        const formattedPictures = data.pictures?.map((p: any) => typeof p === 'object' ? p.url : p) || [];
        const formattedVideos = data.videos?.map((v: any) => typeof v === 'object' ? v.url : v) || [];

        setSkills(formattedSkills);
        setPictures(formattedPictures);
        setVideos(formattedVideos);
      } catch (err) {
        console.error(err);
        alert('Error loading target project manifest context.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectData();
  }, [id]);

  const addSkill = () => {
    if (!currentSkill.trim()) return;
    if (!skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
    }
    setCurrentSkill('');
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addPicture = () => {
    if (!currentPicture.trim()) return;
    setPictures([...pictures, currentPicture.trim()]);
    setCurrentPicture('');
  };

  const removePicture = (index: number) => {
    setPictures(pictures.filter((_, i) => i !== index));
  };

  const addVideo = () => {
    if (!currentVideo.trim()) return;
    setVideos([...videos, currentVideo.trim()]);
    setCurrentVideo('');
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !rank) {
      alert('Please fill out all required core parameters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title,
        slogan,
        description,
        rank: Number(rank),
        liveLink: liveLink.trim() || null,
        githubUrl: githubUrl.trim() || null,
        thumbnailUrl: thumbnailUrl.trim() || null,
        isPersonal,
        skills,
        pictures,
        videos,
      };

      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const errData = await res.json();
        alert(`Mutation error: ${errData.error || 'Server rejected request update matrix.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error compiling update transaction sequence.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-main text-default p-6 md:p-12 flex items-center justify-center">
        <span className="text-xs font-mono uppercase tracking-widest text-muted animate-pulse">
          Loading Project Data...
        </span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-main text-default p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-muted">Update Project</span>
          <Link href="/dashboard" className="text-xs text-primary hover:text-accent transition-colors">
            ← Return To Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold text-primary border-b border-surface pb-4">
          Update Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-6 md:p-8 rounded-xl border border-surface/50 shadow-xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Project Title</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Display Rank Placement</label>
              <input 
                type="number" required value={rank} onChange={(e) => setRank(e.target.value)}
                className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default" 
              />
            </div>
          </div>

          {/* Project Classification Block */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider block">Project Classification</label>
            <div className="inline-flex rounded-lg bg-main p-1 border border-main/40">
              <button
                type="button"
                onClick={() => setIsPersonal(true)}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${
                  isPersonal 
                    ? 'bg-primary text-default shadow-md' 
                    : 'text-muted hover:text-default'
                }`}
              >
                Personal Project
              </button>
              <button
                type="button"
                onClick={() => setIsPersonal(false)}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-md transition-all ${
                  !isPersonal 
                    ? 'bg-accent text-default shadow-md' 
                    : 'text-muted hover:text-default'
                }`}
              >
                Freelance Project
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Slogan</label>
            <input 
              type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)}
              className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider block">Engine / Tech Stack Tags</label>
            <div className="flex gap-2">
              <input 
                type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Next.js, Laravel, TailwindCSS, etc."
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                className="flex-1 bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default" 
              />
              <button 
                type="button" onClick={addSkill}
                className="bg-primary/20 text-primary border border-primary/30 px-4 rounded-lg text-sm font-semibold hover:bg-primary hover:text-default transition-all"
              >
                Add Tag
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-main/40 rounded-lg border border-main/10 mt-1">
                {skills.map((skill, i) => (
                  <span key={i} className="inline-flex items-center text-xs bg-main text-default border border-main/60 px-2.5 py-1 rounded font-mono">
                    <span>{skill}</span>
                    <button type="button" onClick={() => removeSkill(i)} className="ml-2 text-red-400 hover:text-red-500 font-bold">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Description</label>
            <textarea 
              rows={4} required value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Live Link URL</label>
              <input 
                type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)}
                className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">GitHub Repository Link</label>
              <input 
                type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default" 
              />
            </div>
          </div>

          <hr className="border-main/20" />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Hero Thumbnail Image URL</label>
            <input 
              type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://domain.com/thumbnail.png"
              className="w-full bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider block">Project Showcase Pictures Gallery</label>
            <div className="flex gap-2">
              <input 
                type="url" value={currentPicture} onChange={(e) => setCurrentPicture(e.target.value)}
                placeholder="https://domain.com/image.png"
                className="flex-1 bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default" 
              />
              <button 
                type="button" onClick={addPicture}
                className="bg-primary/20 text-primary border border-primary/30 px-4 rounded-lg text-sm font-semibold hover:bg-primary hover:text-default transition-all"
              >
                Add Link
              </button>
            </div>
            {pictures.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-main/40 rounded-lg border border-main/10 mt-1">
                {pictures.map((url, i) => (
                  <span key={i} className="inline-flex items-center text-xs bg-main text-accent border border-main/60 px-2.5 py-1 rounded">
                    <span className="truncate max-w-[200px]">{url}</span>
                    <button type="button" onClick={() => removePicture(i)} className="ml-2 text-red-400 hover:text-red-500 font-bold">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider block">Project Showcase Videos Gallery</label>
            <div className="flex gap-2">
              <input 
                type="url" value={currentVideo} onChange={(e) => setCurrentVideo(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 bg-main border border-main/40 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-default" 
              />
              <button 
                type="button" onClick={addVideo}
                className="bg-primary/20 text-primary border border-primary/30 px-4 rounded-lg text-sm font-semibold hover:bg-primary hover:text-default transition-all"
              >
                Add Link
              </button>
            </div>
            {videos.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-main/40 rounded-lg border border-main/10 mt-1">
                {videos.map((url, i) => (
                  <span key={i} className="inline-flex items-center text-xs bg-main text-accent border border-main/60 px-2.5 py-1 rounded">
                    <span className="truncate max-w-[200px]">{url}</span>
                    <button type="button" onClick={() => removeVideo(i)} className="ml-2 text-red-400 hover:text-red-500 font-bold">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-primary text-default font-bold p-3 rounded-lg shadow-md hover:bg-primary/90 hover:scale-[1.01] transition-all whitespace-nowrap border border-primary/20 align-self-start sm:align-self-auto"
          >
            {isSubmitting ? 'Updating Project...' : 'Update Project'}
          </button>

        </form>
      </div>
    </main>
  );
}