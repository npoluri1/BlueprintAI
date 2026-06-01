import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

function getUserId(req: Request): string | null {
  const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.userId || null
}

export async function POST(req: Request) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  try {
    const { planId } = await req.json()
    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 })

    if (plan.price === 0) {
      const order = await prisma.order.create({
        data: { amount: 0, planId: plan.id, userId, status: "completed", solution: plan.name },
        include: { plan: true },
      })
      return NextResponse.json({ url: "/builder", order })
    }

    const isSubscription = plan.interval === "month"
    const user = await prisma.user.findUnique({ where: { id: userId } })

    const lineItem = plan.stripePriceId
      ? { price: plan.stripePriceId, quantity: 1 }
      : {
          price_data: {
            currency: "sgd",
            product_data: { name: plan.name, description: plan.description },
            unit_amount: Math.round(plan.price * 100),
            ...(isSubscription ? { recurring: { interval: "month" as const } } : {}),
          },
          quantity: 1,
        }

    const session = await getStripe().checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [lineItem],
      success_url: `${req.headers.get("origin") || "https://blueprintai.local:3001"}/payments?success=true`,
      cancel_url: `${req.headers.get("origin") || "https://blueprintai.local:3001"}/pricing?canceled=true`,
      customer_email: user?.email,
      client_reference_id: userId,
      metadata: {
        planId: plan.id,
        userId,
        planName: plan.name,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout session error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
