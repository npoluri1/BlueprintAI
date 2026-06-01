import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const project = await prisma.project.findUnique({ where: { id } })

    if (!project || project.userId !== payload.userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: project.id,
      title: project.title,
      description: project.description,
      prompt: project.prompt,
      techStack: JSON.parse(project.techStack),
      structure: JSON.parse(project.structure),
      files: JSON.parse(project.files),
      createdAt: project.createdAt,
    })
  } catch (err) {
    console.error("Project get error:", err)
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
    const project = await prisma.project.findUnique({ where: { id } })

    if (!project || project.userId !== payload.userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const body = await req.json()
    const { title, description, techStack } = body

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(techStack !== undefined && { techStack: JSON.stringify(techStack) }),
      },
    })

    return NextResponse.json({ project: updated })
  } catch (err) {
    console.error("Project update error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const project = await prisma.project.findUnique({ where: { id } })

    if (!project || project.userId !== payload.userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Project delete error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
