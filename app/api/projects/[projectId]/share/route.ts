import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/getUser"

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const userId = await getUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { username } = await req.json()

  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
  })

  if (!project || project.ownerId !== userId) {
    return NextResponse.json(
      { error: "Only owner can share project" },
      { status: 403 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  })

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  const member = await prisma.projectMember.create({
    data: {
      userId: user.id,
      projectId: project.id,
    },
  })

  return NextResponse.json({ member })
}