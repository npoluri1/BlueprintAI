import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function POST(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  const { name, workspaceId, icon, color } = body
  if (!name || !workspaceId) return NextResponse.json({ error: "Name and workspaceId required" }, { status: 400 })

  const folder = await prisma.folder.create({
    data: { name, workspaceId, icon: icon || "📂", color: color || "#8b5cf6" },
  })

  return NextResponse.json({ folder })
}

export async function PATCH(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await prisma.folder.update({ where: { id }, data })
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

  await prisma.folder.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
