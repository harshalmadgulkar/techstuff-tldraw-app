import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUser";
import { canAccessProject } from "@/lib/projectAccess";

export async function GET(req: Request) {
    const userId = await getUserId();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
        return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const allowed = await canAccessProject(userId, projectId);

    if (!allowed) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const boards = await prisma.whiteboard.findMany({
        where: { projectId }
    });

    return NextResponse.json({ whiteboards: boards });
}

export async function POST(req: Request) {
    const userId = await getUserId();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const whiteboard = await prisma.whiteboard.create({
        data: {
            name: body.name,
            projectId: body.projectId,
        },
    });

    return NextResponse.json({ whiteboard });
}