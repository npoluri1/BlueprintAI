import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { z } from "zod"
import { getRolesForIndustry } from "@/lib/agents/roles"

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  industry: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const companies = await prisma.company.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { agents: true } } },
    })

    return NextResponse.json({ companies })
  } catch (err) {
    console.error("Companies error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

    const { name, description, industry } = parsed.data
    const industryKey = industry || "Technology"
    const industryRoles = getRolesForIndustry(industryKey)

    const company = await prisma.company.create({
      data: {
        name,
        description,
        industry: industryKey,
        userId: payload.userId,
        agents: {
          create: industryRoles.map((role) => ({
            role: role.role,
            name: role.name,
            emoji: role.emoji,
            systemPrompt: `${role.systemPrompt}\n\nYou work at **${name}**, a company described as: ${description}\nAlways represent your role and contribute to discussions from your unique perspective.`,
          })),
        },
      },
      include: { agents: true, _count: { select: { agents: true } } },
    })

    return NextResponse.json({ company })
  } catch (err) {
    console.error("Create company error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
