import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { rank: 'asc' }, 
      include: {
        pictures: true,
        videos: true,
        skills: true, 
      },
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch project collection data:", error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      title, 
      slogan, 
      description, 
      liveLink, 
      githubUrl, 
      rank,
      thumbnailUrl, 
      isPersonal, 
      skills,     
      pictures,     
      videos
    } = body;

    const targetRank = Number(rank);

    const newProject = await db.$transaction(async (tx) => {
      
      const existingProjectWithRank = await tx.project.findFirst({
        where: { rank: targetRank },
      });

      if (existingProjectWithRank) {
        await tx.project.updateMany({
          where: {
            rank: { gte: targetRank }, 
          },
          data: {
            rank: { increment: 1 }, // 
          },
        });
      }

      return await tx.project.create({
        data: { 
          title, 
          slogan, 
          description, 
          liveLink, 
          githubUrl, 
          rank: targetRank,
          thumbnailUrl: thumbnailUrl || null, 
          isPersonal: isPersonal !== undefined ? Boolean(isPersonal) : true, 

          skills: {
            create: (skills || []).map((name: string) => ({ name }))
          },
          pictures: {
            create: (pictures || []).map((url: string) => ({ url }))
          },
          videos: {
            create: (videos || []).map((url: string) => ({ url }))
          }
        },
        include: {
          skills: true,
          pictures: true,
          videos: true
        }
      });
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Database insertion or displacement runtime failure:", error);
    return NextResponse.json({ error: 'Database insertion and ranking displacement failure' }, { status: 500 });
  }
}