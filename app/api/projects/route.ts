import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/getUser"

export async function GET() {
  const userId = await getUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
  })

  return NextResponse.json({ projects })
}

export async function POST(req: Request) {
  const userId = await getUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const project = await prisma.project.create({
    data: {
      name: body.name,
      description: body.description,
      ownerId: userId,
    },
  })

  return NextResponse.json({ project })
}