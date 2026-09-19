import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ProjectShowcase } from './ProjectShowcase';

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: {
      pictures: true,
      videos: true,
      skills: true,
    },
  });

  if (!project) {
    notFound();
  }

  return <ProjectShowcase project={project} />;
}

function ProjectDetailSkeleton() {
  return (
    <main className="min-h-screen bg-main text-default p-6 md:p-12 flex items-center justify-center animate-pulse">
      <span className="text-xs font-mono uppercase tracking-widest text-muted">
        Loading project...
      </span>
    </main>
  );
}