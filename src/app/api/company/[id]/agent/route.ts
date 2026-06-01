import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { getAgentSystemPrompt, DEFAULT_AGENT_ROLES } from "@/lib/agents/roles"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const { id } = await params
    const agentId = new URL(req.url).searchParams.get("agentId")
    if (!agentId) return NextResponse.json({ error: "agentId required" }, { status: 400 })

    const agent = await prisma.companyAgent.findUnique({
      where: { id: agentId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    })

    if (!agent || agent.companyId !== id) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    const company = await prisma.company.findUnique({ where: { id } })
    if (!company || company.userId !== payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ messages: agent.messages, agent: { id: agent.id, role: agent.role, name: agent.name, emoji: agent.emoji } })
  } catch (err) {
    console.error("Agent messages error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const { role, name } = body

    if (!role || !name) {
      return NextResponse.json({ error: "role and name required" }, { status: 400 })
    }

    const roleDef = DEFAULT_AGENT_ROLES.find(r => r.role === role)
    if (!roleDef) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const agent = await prisma.companyAgent.create({
      data: {
        role: roleDef.role,
        name,
        emoji: roleDef.emoji,
        systemPrompt: getAgentSystemPrompt(role, company.name, company.description),
        companyId: id,
      },
    })

    return NextResponse.json({ agent })
  } catch (err) {
    console.error("Add agent error:", err)
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
    const agentId = new URL(req.url).searchParams.get("agentId")
    if (!agentId) return NextResponse.json({ error: "agentId required" }, { status: 400 })

    const agent = await prisma.companyAgent.findUnique({ where: { id: agentId } })
    if (!agent || agent.companyId !== id) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    const company = await prisma.company.findUnique({ where: { id } })
    if (!company || company.userId !== payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.companyAgent.delete({ where: { id: agentId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Delete agent error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
