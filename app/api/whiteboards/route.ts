import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUser";

export async function GET(req: Request) {
    const userId = await getUserId();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
        return NextResponse.json({ error: "projectId required" }, { status: 400 });
    }

    const whiteboards = await prisma.whiteboard.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ whiteboards });
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