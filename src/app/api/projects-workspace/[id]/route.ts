import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const { id } = await params
  const project = await prisma.project_Workspace.findFirst({
    where: { id, userId: payload.userId },
    include: {
      columns: {
        orderBy: { position: "asc" },
        include: {
          tasks: {
            orderBy: { position: "asc" },
            include: {
              labels: { include: { label: true } },
              assignee: { select: { id: true, name: true, email: true } },
              _count: { select: { comments: true } },
            },
          },
        },
      },
      tasks: {
        orderBy: { position: "asc" },
        include: {
          labels: { include: { label: true } },
          assignee: { select: { id: true, name: true, email: true } },
          _count: { select: { comments: true } },
        },
      },
      labels: { orderBy: { name: "asc" } },
      workspace: { select: { id: true, name: true, icon: true } },
    },
  })
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ project })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  const { id } = await params
  const project = await prisma.project_Workspace.updateMany({
    where: { id, userId: payload.userId },
    data: body,
  })
  if (project.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updated = await prisma.project_Workspace.findUnique({
    where: { id },
    include: { columns: { orderBy: { position: "asc" } } },
  })
  return NextResponse.json({ project: updated })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const { id } = await params
  await prisma.project_Workspace.deleteMany({ where: { id, userId: payload.userId } })
  return NextResponse.json({ success: true })
}
