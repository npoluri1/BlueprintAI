import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const { id } = await params
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        agents: {
          include: { _count: { select: { messages: true } } },
          orderBy: { role: "asc" },
        },
      },
    })

    if (!company || company.userId !== payload.userId) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json({ company })
  } catch (err) {
    console.error("Company get error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const { id } = await params
    const company = await prisma.company.findUnique({ where: { id } })

    if (!company || company.userId !== payload.userId) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    const body = await req.json()
    const { name, description, industry } = body

    if (!name && !description && !industry) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    const updated = await prisma.company.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(industry !== undefined && { industry }),
      },
      include: { _count: { select: { agents: true } } },
    })

    return NextResponse.json({ company: updated })
  } catch (err) {
    console.error("Company update error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const { id } = await params
    const company = await prisma.company.findUnique({ where: { id } })
    if (!company || company.userId !== payload.userId) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    await prisma.company.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Company delete error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
