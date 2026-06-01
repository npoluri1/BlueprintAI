import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

function getUserId(req: Request): string | null {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.userId || null
}

export async function GET(req: Request) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const orders = await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { plan: true } })
  return NextResponse.json({ orders })
}

export async function POST(req: Request) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { planId, solution, description: orderDesc } = await req.json()
    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    const order = await prisma.order.create({
      data: { amount: plan.price, planId: plan.id, userId, solution: solution || "", description: orderDesc || plan.description, status: "completed" },
      include: { plan: true },
    })
    if (plan.interval !== "one-time") {
      const periodEnd = new Date()
      periodEnd.setMonth(periodEnd.getMonth() + 1)
      await prisma.subscription.create({
        data: { planId: plan.id, userId, currentPeriodEnd: periodEnd, status: "active" }
      })
    }
    return NextResponse.json({ order })
  } catch (error) {
    console.error("Orders error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
