import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/getUser";
import { isProjectOwner } from "@/lib/projectAccess";

export async function GET() {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: { userId }
          }
        }
      ]
    },
    include: {
      owner: true
    }
  });

  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const project = await prisma.project.create({
    data: {
      name: body.name,
      description: body.description,
      ownerId: userId,
    },
  });

  return NextResponse.json({ project });
}

export async function DELETE(
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
      { error: "Only owner can delete project" },
      { status: 403 }
    );
  }

  await prisma.project.delete({
    where: { id }
  });

  return NextResponse.json({ success: true });
}

