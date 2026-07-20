// app/dashboard/page.tsx
import { getCachedProjects } from '@/lib/queries';
import { DashboardTable } from './DashboardTable';
import Link from 'next/link';

export default async function Dashboard() {
  const projects = await getCachedProjects();

  return (
    <main className="min-h-screen bg-main text-default p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="border-b border-surface pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Project Control Console
            </h1>
            <p className="text-muted mt-2 text-sm md:text-base">
              System core database. Modify operational variables or explore records.
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="inline-flex items-center justify-center text-sm font-semibold bg-primary text-default px-5 py-2.5 rounded-lg shadow-md hover:bg-primary/90 hover:scale-[1.01] transition-all whitespace-nowrap border border-primary/20 align-self-start sm:align-self-auto"
          >
            + Create Project
          </Link>
        </header>

        <section className="bg-surface rounded-xl p-6 shadow-xl border border-surface/50">
          <DashboardTable initialProjects={projects} />
        </section>

      </div>
    </main>
  );
}