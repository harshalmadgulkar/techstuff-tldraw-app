import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateToken } from "@/lib/auth"
import { z } from "zod"

const schema = z.object({
  username: z.string().min(3),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { username } = schema.parse(body)

    const normalizedUsername = username.toLowerCase()

    let user = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: normalizedUsername,
        },
      })
    }

    const token = generateToken(user.id)

    const response = NextResponse.json({
      success: true,
      user,
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}