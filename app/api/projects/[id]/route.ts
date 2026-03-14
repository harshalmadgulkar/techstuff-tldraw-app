import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUser";
import { canAccessProject, isProjectOwner } from "@/lib/projectAccess";
import { z } from "zod";

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; }>; }
) {
  const { id } = await params;

  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowed = await canAccessProject(userId, id);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      owner: true,
      members: {
        include: { user: true },
      },
    },
  });

  return NextResponse.json({ project });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; }>; }
) {
  const { id } = await params;

  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owner = await isProjectOwner(userId, id);

  if (!owner) {
    return NextResponse.json(
      { error: "Only owner can update project" },
      { status: 403 }
    );
  }

  let data;

  try {
    const body = await req.json();
    data = updateProjectSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const project = await prisma.project.update({
    where: { id },
    data,
  });

  return NextResponse.json({ project });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; }>; }
) {
  const { id } = await params;

  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owner = await isProjectOwner(userId, id);

  if (!owner) {
    return NextResponse.json(
      { error: "Only owner can delete project" },
      { status: 403 }
    );
  }

  await prisma.project.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}