import { db } from '@/lib/db';
import { cacheLife } from 'next/cache';

export async function getCachedProjects() {
  'use cache'; 
  cacheLife('hours'); 

  return await db.project.findMany({
    orderBy: { createdAt: 'desc' },
  });
}