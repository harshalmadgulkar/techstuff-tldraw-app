import { prisma } from "@/lib/prisma";

export async function canAccessProject(userId: string, projectId: string) {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            OR: [
                { ownerId: userId },
                {
                    members: {
                        some: { userId }
                    }
                }
            ]
        }
    });

    return !!project;
}

export async function isProjectOwner(userId: string, projectId: string) {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            ownerId: userId
        }
    });

    return !!project;
}