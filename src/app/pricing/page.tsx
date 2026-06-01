"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"

interface Plan {
  id: string; name: string; slug: string; description: string
  price: number; interval: string; features: string; category: string; popular: boolean
}

export default function PricingPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"solution" | "subscription">("solution")
  const [buying, setBuying] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/plans").then(r => r.json()).then(d => { setPlans(d.plans); setLoading(false) }).catch((err) => { console.error("Plans fetch error:", err); setLoading(false) })
  }, [])

  const handleChoosePlan = async (plan: Plan) => {
    if (!user) { window.location.href = "/login"; return }
    if (plan.price === 0) {
      setBuying(plan.id)
      try {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: plan.id }),
        })
        const data = await res.json()
        if (data.url) window.location.href = data.url
      } catch (err) { console.error("Free plan checkout error:", err); setError("Error processing request") }
      setBuying(null)
      return
    }
    setBuying(plan.id)
    setError("")
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Failed to create checkout session")
        setBuying(null)
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError("Network error. Please try again.")
      setBuying(null)
    }
  }

  const filtered = (plans || []).filter(p => p.category === tab)

  return (
    <div className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Choose Your Plan</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
            From free starter projects to enterprise-grade AI development. Powered by Stripe for secure payments.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-500">
            <span>💳 Credit/Debit</span><span>•</span><span>🅿️ PayPal</span><span>•</span><span>🔒 Stripe Checkout</span>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-zinc-300 p-1 dark:border-zinc-700">
            <button onClick={() => setTab("solution")} className={`rounded-full px-6 py-2 text-sm font-medium transition ${tab === "solution" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"}`}>One-Time Builds</button>
            <button onClick={() => setTab("subscription")} className={`rounded-full px-6 py-2 text-sm font-medium transition ${tab === "subscription" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"}`}>Monthly Subscriptions</button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-20 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" /></div>
        ) : !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
          <div className="mt-20 text-center">
            <span className="text-4xl">🔒</span>
            <h2 className="mt-4 text-xl font-bold">Stripe Not Configured</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Add your Stripe publishable key to <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">.env</code> to enable payments.
            </p>
            <div className="mt-6 flex flex-col items-center gap-2 text-xs text-zinc-400">
              <p>1. Create a Stripe account at <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">dashboard.stripe.com</a></p>
              <p>2. Get your publishable & secret keys from <span className="font-mono">Developers → API Keys</span></p>
              <p>3. Add them to your <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">.env</code> file</p>
              <p>4. Restart the dev server</p>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((plan) => (
              <div key={plan.id} className={`relative flex flex-col rounded-2xl border p-6 transition hover:shadow-lg dark:border-zinc-800 ${plan.popular ? "border-zinc-900 ring-2 ring-zinc-900 dark:border-zinc-100 dark:ring-zinc-100 scale-105" : "border-zinc-200"} ${plan.price === 0 ? "bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950" : ""}`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-4 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">Most Popular</span>}
                {plan.price === 0 && <span className="absolute -top-3 right-4 rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">Free</span>}
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="mt-2 min-h-[40px] text-sm text-zinc-500">{plan.description}</p>
                <p className="mt-6 flex items-baseline">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-green-600">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${plan.price.toLocaleString()}</span>
                      <span className="ml-1 text-sm text-zinc-500">{plan.interval === "month" ? "/mo" : ""}</span>
                    </>
                  )}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {JSON.parse(plan.features).map((f: string) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleChoosePlan(plan)}
                  disabled={buying === plan.id}
                  className={`mt-8 w-full rounded-full py-2.5 text-sm font-medium transition ${
                    plan.popular
                      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
                      : plan.price === 0
                      ? "border-2 border-green-500 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                      : "border border-zinc-300 hover:border-zinc-400 dark:border-zinc-700"
                  } ${buying === plan.id ? "opacity-50" : ""}`}
                >
                  {buying === plan.id ? "Redirecting to Stripe..." : plan.price === 0 ? "Get Started Free" : user ? "Choose Plan" : "Sign In to Buy"}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
          <div className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="text-sm font-semibold">Payments powered by Stripe</p>
                  <p className="text-xs text-zinc-500">Your payment info is handled securely by Stripe. We never store your card details.</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-indigo-600">stripe</span>
            </div>
          </div>
        )}

        <p className="mt-16 text-center text-sm text-zinc-500">
          All prices in SGD. Need a custom enterprise solution? <Link href="/#contact" className="text-blue-600 hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  )
}
