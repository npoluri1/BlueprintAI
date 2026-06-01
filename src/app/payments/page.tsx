"use client"

import { Suspense, useState, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Plan { id: string; name: string; slug: string; price: number; interval: string; category: string }
interface Order { id: string; amount: number; status: string; solution: string; createdAt: string; stripeSessionId?: string; plan: Plan }
interface Subscription { id: string; status: string; currentPeriodEnd: string; stripeSubscriptionId?: string; plan: Plan }

function PaymentsContent() {
  const { user, loading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"orders" | "subscriptions">("orders")

  const success = searchParams.get("success")
  const canceled = searchParams.get("canceled")

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    Promise.all([
      fetch("/api/orders").then(r => r.json()),
      fetch("/api/subscriptions").then(r => r.json()),
    ]).then(([o, s]) => {
      setOrders(o.orders || [])
      setSubscriptions(s.subscriptions || [])
      setLoading(false)
    }).catch((err) => { console.error("Payments fetch error:", err); setLoading(false) })
  }, [user, authLoading])

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" /></div>
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl">🔒</span>
        <h1 className="mt-6 text-3xl font-bold">Sign In Required</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">Sign in to view your payments and subscriptions.</p>
        <Link href="/login" className="mt-8 rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Sign In</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Your orders, subscriptions, and billing history.</p>
          </div>
          <Link href="/pricing" className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">View Plans</Link>
        </div>

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
            ✅ Payment successful! Your order has been created.
          </div>
        )}

        {canceled && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-sm font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
            Payment was canceled. You can try again anytime.
          </div>
        )}

        <div className="mt-8 flex gap-2 rounded-xl border border-zinc-200 p-1 dark:border-zinc-800">
          <button onClick={() => setTab("orders")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "orders" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"}`}>Orders ({orders.length})</button>
          <button onClick={() => setTab("subscriptions")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "subscriptions" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"}`}>Subscriptions ({subscriptions.length})</button>
        </div>

        {tab === "orders" && (
          orders.length === 0 ? (
            <div className="mt-16 text-center">
              <span className="text-4xl">📦</span>
              <p className="mt-4 text-zinc-500">No orders yet.</p>
              <Link href="/pricing" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">Browse solutions</Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    {o.stripeSessionId ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">S</span>
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs dark:bg-zinc-800">📄</span>
                    )}
                    <div>
                      <h3 className="font-semibold">{o.solution || o.plan.name}</h3>
                      <p className="text-xs text-zinc-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${o.amount.toLocaleString()}</p>
                    <span className={`text-xs font-medium ${o.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === "subscriptions" && (
          subscriptions.length === 0 ? (
            <div className="mt-16 text-center">
              <span className="text-4xl">🔄</span>
              <p className="mt-4 text-zinc-500">No active subscriptions.</p>
              <Link href="/pricing" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">Subscribe for ongoing support</Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {subscriptions.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    {s.stripeSubscriptionId ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">S</span>
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs dark:bg-zinc-800">🔄</span>
                    )}
                    <div>
                      <h3 className="font-semibold">{s.plan.name}</h3>
                      <p className="text-xs text-zinc-500">Renews {new Date(s.currentPeriodEnd).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${s.plan.price}/mo</p>
                    <span className={`text-xs font-medium ${s.status === "active" ? "text-green-600" : s.status === "cancelled" ? "text-red-500" : "text-yellow-600"}`}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        <div className="mt-16 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-bold">💳 Need a Custom Solution?</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Contact us for tailored enterprise pricing, custom AI development, or dedicated team engagement.</p>
          <Link href="/#contact" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">Get in touch</Link>
        </div>

        {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-xs text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
            ⚠️ Stripe not configured. Set <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> and <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">STRIPE_SECRET_KEY</code> in .env to enable real payments. Orders created via the API work in demo mode.
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" /></div>}>
      <PaymentsContent />
    </Suspense>
  )
}
