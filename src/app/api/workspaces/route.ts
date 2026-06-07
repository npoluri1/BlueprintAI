import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const workspaces = await prisma.workspace.findMany({
    where: { userId: payload.userId },
    include: {
      _count: { select: { folders: true, projects: true } },
      folders: { include: { _count: { select: { projects: true } } } },
    },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ workspaces })
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    const { name, icon, color, description } = body
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 })

    const workspace = await prisma.workspace.create({
      data: {
        name,
        icon: icon || "📁",
        color: color || "#6366f1",
        description: description || "",
        userId: payload.userId,
      },
    })

    return NextResponse.json({ workspace })
  } catch (err) {
    console.error("Workspace POST error:", err)
    return NextResponse.json({ error: "Internal server error: " + (err instanceof Error ? err.message : String(err)) }, { status: 500 })
  }
}
