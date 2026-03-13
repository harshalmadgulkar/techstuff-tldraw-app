import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUser";
import { z } from "zod";

const shareSchema = z.object({
  username: z.string().min(1),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: z.infer<typeof shareSchema>;
  try {
    const body = await req.json();
    data = shareSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project || project.ownerId !== userId) {
    return NextResponse.json(
      { error: "Only owner can share project" },
      { status: 403 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { username: data.username.toLowerCase() },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // Check for existing membership to return a clear response without relying on DB errors
  const existingMember = await prisma.projectMember.findFirst({
    where: {
      projectId: project.id,
      userId: user.id,
    },
  });

  if (existingMember) {
    return NextResponse.json(
      { error: "User already has access to this project" },
      { status: 409 }
    );
  }

  try {
    const member = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: project.id,
      },
    });

    return NextResponse.json({ member });
  } catch {
    return NextResponse.json(
      { error: "Failed to share project" },
      { status: 500 }
    );
  }
}

