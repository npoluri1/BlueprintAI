import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: payload.userId, status: "active" },
    orderBy: { createdAt: "desc" },
    include: { plan: true },
  })
  return NextResponse.json({ subscriptions })
}
