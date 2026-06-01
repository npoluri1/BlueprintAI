import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

const DEFAULT_PLANS = [
  { name: "Free", slug: "free", description: "Get started with basic AI project generation and explore the platform.", price: 0, interval: "forever", category: "solution", features: JSON.stringify(["1 project generation", "Basic AI templates", "Community access", "Email support", "View public projects"]), popular: false, stripePriceId: "" },
  { name: "Starter", slug: "starter", description: "Kickstart your AI development with essential tools and support.", price: 499, interval: "one-time", category: "solution", features: JSON.stringify(["3 project generations", "AI agent chat (basic)", "GitHub integration", "Email support (48hr)", "Download source code"]), popular: false, stripePriceId: "price_1TdWzPCdPqX3RcPPwuivTMuw" },
  { name: "Pro", slug: "pro", description: "For serious builders who need advanced AI capabilities and priority support.", price: 1499, interval: "one-time", category: "solution", features: JSON.stringify(["Unlimited projects", "AI company (8 agents)", "Multi-agent orchestration", "Custom tech stack selection", "Priority support (24hr)", "API access", "Export to GitHub"]), popular: true, stripePriceId: "price_1TdWzQCdPqX3RcPPrUTjg9YE" },
  { name: "Pro Max", slug: "pro-max", description: "The ultimate package — full AI company with all 16 agents, premium support, and enterprise deployment.", price: 4999, interval: "one-time", category: "solution", features: JSON.stringify(["Everything in Pro", "AI company (16 agents)", "Custom AI model fine-tuning", "Enterprise deployment", "Dedicated account manager", "White-label branding", "SLA guarantee", "24/7 phone support"]), popular: false, stripePriceId: "price_1TdWzRCdPqX3RcPPQ223a4wE" },
  { name: "Free Monthly", slug: "free-monthly", description: "Basic ongoing support for hobby projects and experimentation.", price: 0, interval: "month", category: "subscription", features: JSON.stringify(["1 active project", "Basic monitoring", "Community forum access", "Monthly newsletter", "Public templates"]), popular: false, stripePriceId: "" },
  { name: "Pro Monthly", slug: "pro-monthly", description: "Continuous AI development, maintenance, and priority support for growing applications.", price: 1499, interval: "month", category: "subscription", features: JSON.stringify(["5 active projects", "AI feature enhancements", "Priority support (4hr)", "Weekly performance reports", "Automated backups", "API rate limit: 1000/hr"]), popular: true, stripePriceId: "price_1TdWzSCdPqX3RcPPZoc5pomx" },
  { name: "Pro Max Monthly", slug: "pro-max-monthly", description: "Dedicated AI engineering team, unlimited projects, 24/7 support, and enterprise SLA.", price: 4999, interval: "month", category: "subscription", features: JSON.stringify(["Unlimited projects", "Dedicated AI team", "Custom model training", "24/7 phone & chat", "Enterprise SLA", "API rate limit: unlimited", "On-premise deployment", "Quarterly strategy review"]), popular: false, stripePriceId: "price_1TdWzTCdPqX3RcPPo2nd19QM" },
]

export async function GET() {
  try {
    const count = await prisma.plan.count()
    if (count === 0) {
      await prisma.plan.createMany({ data: DEFAULT_PLANS })
    }
    const plans = await prisma.plan.findMany({ orderBy: { price: "asc" } })
    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Plans error:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}
