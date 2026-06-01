import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true },
    })
    const isAdmin = user?.role === "admin"

    // Admins can see ALL projects; regular users only see their own
    const whereFilter = isAdmin ? {} : { userId: payload.userId }

    const projects = await prisma.project.findMany({
      where: whereFilter,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        prompt: true,
        techStack: true,
        createdAt: true,
      },
    })

    const parsed = projects.map((p: { id: string; title: string; description: string; prompt: string; techStack: string; createdAt: Date }) => ({
      ...p,
      techStack: JSON.parse(p.techStack),
    }))

    return NextResponse.json({ projects: parsed, isAdmin })
  } catch (err) {
    console.error("Projects error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
