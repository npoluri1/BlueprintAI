import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  const { title, description, priority, columnId, dueDate, assigneeId, labelIds } = body
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })

  const { id: projectId } = await params
  let targetColumnId = columnId
  if (!targetColumnId) {
    const firstColumn = await prisma.column.findFirst({
      where: { projectId },
      orderBy: { position: "asc" },
    })
    if (!firstColumn) return NextResponse.json({ error: "No columns" }, { status: 400 })
    targetColumnId = firstColumn.id
  }

  const maxPos = await prisma.task.findFirst({
    where: { columnId: targetColumnId },
    orderBy: { position: "desc" },
  })

  const task = await prisma.task.create({
    data: {
      title,
      description: description || "",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      position: (maxPos?.position ?? -1) + 1,
      columnId: targetColumnId,
      projectId,
      assigneeId: assigneeId || null,
    },
  })

  if (labelIds && labelIds.length > 0) {
    await prisma.taskLabel.createMany({
      data: labelIds.map((labelId: string) => ({ taskId: task.id, labelId })),
    })
  }

  const fullTask = await prisma.task.findUnique({
    where: { id: task.id },
    include: {
      labels: { include: { label: true } },
      assignee: { select: { id: true, name: true, email: true } },
      _count: { select: { comments: true } },
    },
  })

  return NextResponse.json({ task: fullTask })
}

export async function PATCH(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  const { id, columnId, position, ...data } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const updateData: any = { ...data }
  if (columnId) updateData.columnId = columnId
  if (position !== undefined) updateData.position = position
  if (data.dueDate) updateData.dueDate = new Date(data.dueDate)
  if (data.dueDate === null) updateData.dueDate = null

  await prisma.task.update({ where: { id }, data: updateData })

  const updated = await prisma.task.findUnique({
    where: { id },
    include: {
      labels: { include: { label: true } },
      assignee: { select: { id: true, name: true, email: true } },
      _count: { select: { comments: true } },
    },
  })

  return NextResponse.json({ task: updated })
}

export async function DELETE(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await prisma.task.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
