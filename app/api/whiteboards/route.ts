import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUser";
import { canAccessProject } from "@/lib/projectAccess";
import { z } from "zod";

const createWhiteboardSchema = z.object({
  name: z.string().min(1),
  projectId: z.string().min(1),
});

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
    where: { projectId },
  });

  return NextResponse.json({ whiteboards: boards });
}

export async function POST(req: Request) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data;
  try {
    const body = await req.json();
    data = createWhiteboardSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const allowed = await canAccessProject(userId, data.projectId);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const whiteboard = await prisma.whiteboard.create({
    data: {
      name: data.name,
      projectId: data.projectId,
    },
  });

  return NextResponse.json({ whiteboard });
}