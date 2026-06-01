import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const { id } = await params
  const workspace = await prisma.workspace.findFirst({
    where: { id, userId: payload.userId },
    include: {
      folders: { include: { _count: { select: { projects: true } } } },
      projects: {
        include: {
          _count: { select: { tasks: true, columns: true } },
          columns: { orderBy: { position: "asc" } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  })
  if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ workspace })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  const { id } = await params
  const workspace = await prisma.workspace.updateMany({
    where: { id, userId: payload.userId },
    data: body,
  })
  if (workspace.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updated = await prisma.workspace.findUnique({ where: { id } })
  return NextResponse.json({ workspace: updated })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const { id } = await params
  await prisma.workspace.deleteMany({ where: { id, userId: payload.userId } })
  return NextResponse.json({ success: true })
}
