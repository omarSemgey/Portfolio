'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Project = {
  id: string;
  rank: number;
  title: string;
  slogan: string;  
  description: string;
  liveLink: string | null;
  githubUrl: string | null;
  createdAt: Date;
};

export function DashboardTable({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('Confirm operational removal? This drops the record from dev.db permanently.')) return;

    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    
    if (res.ok) {
      setProjects(projects.filter((p) => p.id !== id));
      router.refresh(); 
    } else {
      alert('Deletion runtime error.');
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-main/40 text-muted uppercase text-xs tracking-wider">
            <th className="py-3 px-4">Project Title</th>
            <th className="py-3 px-4 hidden md:table-cell">Slogan</th>
            <th className="py-3 px-4 text-right">Operations</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-main/20 text-sm">
          {projects.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-8 text-center text-muted">
                No local storage entities found. Create an array node to begin.
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project.id} className="hover:bg-main/20 transition-colors group">
                <td className="py-4 px-4 font-medium">
                  <Link 
                    href={`/projects/${project.id}`}
                    className="text-accent hover:text-primary transition-colors hover:underline underline-offset-4"
                  >
                    {project.title}
                  </Link>
                </td>
                
                <td className="py-4 px-4 text-muted hidden md:table-cell max-w-xs truncate">
                  {project.slogan}
                </td>
                
                <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                  <Link
                    href={`/dashboard/edit/${project.id}`}
                    className="inline-flex items-center text-xs font-semibold bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-md hover:bg-primary hover:text-default transition-all"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="inline-flex items-center text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-md hover:bg-red-500 hover:text-default transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}