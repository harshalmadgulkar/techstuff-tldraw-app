import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUser";
import { canAccessProject } from "@/lib/projectAccess";
import { z } from "zod";

const updateWhiteboardSchema = z.object({
  data: z.unknown(),
});

type AccessResult =
  | {
    userId: string;
    whiteboard: {
      id: string;
      projectId: string;
    };
  }
  | {
    error: {
      message: string;
      status: number;
    };
  };

async function assertAccess(id: string): Promise<AccessResult> {
  const userId = await getUserId();

  if (!userId) {
    return { error: { message: "Unauthorized", status: 401 } };
  }

  const whiteboard = await prisma.whiteboard.findUnique({
    where: { id },
    select: {
      id: true,
      projectId: true,
    },
  });

  if (!whiteboard) {
    return { error: { message: "Whiteboard not found", status: 404 } };
  }

  const allowed = await canAccessProject(userId, whiteboard.projectId);

  if (!allowed) {
    return { error: { message: "Forbidden", status: 403 } };
  }

  return { userId, whiteboard };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; }>; }
) {
  const { id } = await params;

  const result = await assertAccess(id);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status }
    );
  }

  const whiteboard = await prisma.whiteboard.findUnique({
    where: { id },
  });

  return NextResponse.json({ whiteboard });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; }>; }
) {
  const { id } = await params;

  const result = await assertAccess(id);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status }
    );
  }

  let data;

  try {
    const body = await req.json();
    data = updateWhiteboardSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const whiteboard = await prisma.whiteboard.update({
    where: { id },
    data: {
      canvasState: data.data as Prisma.InputJsonValue,
    },
  });

  return NextResponse.json({ whiteboard });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; }>; }
) {
  const { id } = await params;

  const result = await assertAccess(id);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status }
    );
  }

  await prisma.whiteboard.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}