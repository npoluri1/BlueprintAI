import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { generateFallbackResponse } from "@/lib/agents/fallback"

const chatSchema = z.object({
  agentId: z.string(),
  message: z.string().min(1).max(5000),
})

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
    const parsed = chatSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

    const { agentId, message } = parsed.data

    const agent = await prisma.companyAgent.findUnique({
      where: { id: agentId },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
    })

    if (!agent || agent.companyId !== id) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    await prisma.agentMessage.create({
      data: { role: "user", content: message, agentId: agent.id },
    })

    const history = agent.messages.map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }))

    let text: string
    try {
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: agent.systemPrompt,
        messages: [...history, { role: "user" as const, content: message }],
        temperature: 0.7,
        maxOutputTokens: 2000,
      })
      text = result.text
    } catch {
      text = generateFallbackResponse(
        agent.role,
        agent.name,
        company.name,
        message,
      )
    }

    const saved = await prisma.agentMessage.create({
      data: { role: "assistant", content: text, agentId: agent.id },
    })

    return NextResponse.json({ message: saved })
  } catch (err) {
    console.error("Chat error:", err)
    return NextResponse.json({ error: "Chat failed. Check your API key." }, { status: 500 })
  }
}
