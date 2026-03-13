import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUser";
import { canAccessProject } from "@/lib/projectAccess";
import { z } from "zod";

const updateWhiteboardSchema = z.object({
  data: z.unknown(),
});

async function assertAccess(id: string) {
  const userId = await getUserId();

  if (!userId) {
    return { error: { error: "Unauthorized", status: 401 as const } };
  }

  const whiteboard = await prisma.whiteboard.findUnique({
    where: { id },
  });

  if (!whiteboard) {
    return { error: { error: "Whiteboard not found", status: 404 as const } };
  }

  const allowed = await canAccessProject(userId, whiteboard.projectId);

  if (!allowed) {
    return { error: { error: "Forbidden", status: 403 as const } };
  }

  return { userId, whiteboard };
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await assertAccess(id);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error.error },
      { status: result.error.status }
    );
  }

  const { whiteboard } = result;

  return NextResponse.json({ whiteboard });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await assertAccess(id);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error.error },
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
      canvasState: data.data,
    },
  });

  return NextResponse.json({ whiteboard });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await assertAccess(id);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error.error },
      { status: result.error.status }
    );
  }

  await prisma.whiteboard.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}