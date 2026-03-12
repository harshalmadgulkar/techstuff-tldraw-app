import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string; }>; }
) {
    const { id } = await context.params;

    const whiteboard = await prisma.whiteboard.findUnique({
        where: { id },
    });

    return NextResponse.json({ whiteboard });
}

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string; }>; }
) {
    const { id } = await context.params;
    const body = await req.json();

    const whiteboard = await prisma.whiteboard.update({
        where: { id },
        data: {
            canvasState: body.data,
        },
    });

    return NextResponse.json({ whiteboard });
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string; }>; }
) {
    const { id } = await context.params;

    await prisma.whiteboard.delete({
        where: { id },
    });

    return NextResponse.json({ success: true });
}