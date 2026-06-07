import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const projects = await prisma.project_Workspace.findMany({
    where: { userId: payload.userId },
    include: {
      _count: { select: { tasks: true } },
      workspace: { select: { name: true, icon: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json({ projects })
}

export async function POST(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  const { title, description, icon, color, viewType, workspaceId, folderId, generatedProjectId } = body
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })

  // Create project with default columns
  const project = await prisma.project_Workspace.create({
    data: {
      title,
      description: description || "",
      icon: icon || "📄",
      color: color || "#3b82f6",
      viewType: viewType || "kanban",
      generatedProjectId: generatedProjectId || null,
      userId: payload.userId,
      workspaceId: workspaceId || null,
      folderId: folderId || null,
      columns: {
        create: [
          { title: "To Do", color: "#6b7280", position: 0 },
          { title: "In Progress", color: "#3b82f6", position: 1 },
          { title: "Done", color: "#22c55e", position: 2 },
        ],
      },
    },
    include: { columns: { orderBy: { position: "asc" } }, _count: { select: { tasks: true } } },
  })

  return NextResponse.json({ project })
}
