import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature") || ""

    let event
    try {
      event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const { planId, userId, planName } = session.metadata || {}
        if (!planId || !userId) return NextResponse.json({ error: "Missing metadata" }, { status: 400 })

        const plan = await prisma.plan.findUnique({ where: { id: planId } })
        if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 })

        const existingOrder = await prisma.order.findFirst({
          where: { stripeSessionId: session.id },
        })
        if (existingOrder) return NextResponse.json({ received: true })

        const amount = session.amount_total ? session.amount_total / 100 : plan.price
        await prisma.order.create({
          data: {
            amount,
            planId: plan.id,
            userId,
            status: "completed",
            solution: planName || plan.name,
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent || "",
          },
        })

        if (plan.interval === "month" && session.subscription) {
          const periodEnd = new Date()
          periodEnd.setMonth(periodEnd.getMonth() + 1)
          await prisma.subscription.create({
            data: {
              planId: plan.id,
              userId,
              status: "active",
              stripeSubscriptionId: session.subscription,
              currentPeriodEnd: periodEnd,
            },
          })
        }
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as any
        const subscriptionId = invoice.subscription
        if (subscriptionId) {
          const sub = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
          })
          if (sub) {
            const periodEnd = new Date()
            periodEnd.setMonth(periodEnd.getMonth() + 1)
            await prisma.subscription.update({
              where: { id: sub.id },
              data: { status: "active", currentPeriodEnd: periodEnd },
            })
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object as any
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: deletedSub.id },
          data: { status: "cancelled" },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
