import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  const { title, color } = body
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })

  const { id } = await params
  const maxPos = await prisma.column.findFirst({
    where: { projectId: id },
    orderBy: { position: "desc" },
  })

  const column = await prisma.column.create({
    data: {
      title,
      color: color || "#6b7280",
      position: (maxPos?.position ?? -1) + 1,
      projectId: id,
    },
  })

  return NextResponse.json({ column })
}

export async function PATCH(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await prisma.column.update({ where: { id }, data })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const tasksCount = await prisma.task.count({ where: { columnId: id } })
  if (tasksCount > 0) return NextResponse.json({ error: "Column has tasks, move them first" }, { status: 400 })

  await prisma.column.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
