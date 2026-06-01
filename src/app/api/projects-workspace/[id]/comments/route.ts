import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function POST(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  const { taskId, content } = body
  if (!taskId || !content) return NextResponse.json({ error: "taskId and content required" }, { status: 400 })

  const comment = await prisma.comment.create({
    data: { content, taskId, author: payload.email || "User" },
  })

  return NextResponse.json({ comment })
}
