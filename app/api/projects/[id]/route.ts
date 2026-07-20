import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
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
      return NextResponse.json({ error: 'Project resource not found' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("Single project fetch runtime failure:", error);
    return NextResponse.json({ error: 'Internal system data retrieval failure' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params; 
    const body = await request.json();

    const { pictures, videos, skills, rank, ...flatFields } = body;

    const updatedProject = await db.$transaction(async (tx) => {
      
      const newTargetRank = rank !== undefined ? Number(rank) : undefined;
      const finalRank = newTargetRank;

      if (newTargetRank !== undefined) {
        const projectToUpdate = await tx.project.findUnique({
          where: { id },
        });

        if (!projectToUpdate) {
          throw new Error('Project not found for update sequence.');
        }

        const oldRank = projectToUpdate.rank;

        if (oldRank !== newTargetRank) {
          
          if (newTargetRank < oldRank) {
            await tx.project.updateMany({
              where: {
                rank: {
                  gte: newTargetRank,
                  lt: oldRank,
                },
              },
              data: {
                rank: { increment: 1 }, 
              },
            });
          } else {
            await tx.project.updateMany({
              where: {
                rank: {
                  gt: oldRank,
                  lte: newTargetRank,
                },
              },
              data: {
                rank: { decrement: 1 }, 
              },
            });
          }
        }
      }

      const updateData: any = {
        ...flatFields, 
      };

      if (finalRank !== undefined) {
        updateData.rank = finalRank;
      }

      if (skills && Array.isArray(skills)) {
        updateData.skills = {
          deleteMany: {}, 
          create: skills.map((name: string) => ({ name })), 
        };
      }

      if (pictures && Array.isArray(pictures)) {
        updateData.pictures = {
          deleteMany: {}, 
          create: pictures.map((url: string) => ({ url })), 
        };
      }

      if (videos && Array.isArray(videos)) {
        updateData.videos = {
          deleteMany: {}, 
          create: videos.map((url: string) => ({ url })), 
        };
      }

      return await tx.project.update({
        where: { id },
        data: updateData,
        include: {
          pictures: true,
          videos: true,
          skills: true, 
        },
      });
    }); 

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("Update sequence runtime error or transactional failure:", error);
    return NextResponse.json({ error: 'Update sequence or data constraints failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project removed successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Deletion sequence failed' }, { status: 500 });
  }
}