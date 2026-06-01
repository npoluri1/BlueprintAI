"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"

interface CompanySummary {
  id: string
  name: string
  description: string
  industry: string
  createdAt: string
  _count: { agents: number }
}

const INDUSTRIES = [
  { value: "Technology", label: "🤖 AI / ML & Agents" },
  { value: "Mobile", label: "📱 Mobile Development" },
  { value: "Web", label: "🌐 Web Development" },
  { value: "Enterprise Software", label: "🏢 Enterprise Software" },
  { value: "FinTech", label: "💰 FinTech" },
  { value: "HealthTech / Biotech", label: "🧬 HealthTech / Biotech" },
  { value: "Robotics / Hardware", label: "🦾 Robotics / Hardware" },
  { value: "Quantum Computing", label: "⚛️ Quantum Computing" },
  { value: "Semiconductor / Chip Design", label: "💠 Semiconductor / Chip Design" },
  { value: "IoT / Embedded Systems", label: "🔗 IoT / Embedded Systems" },
  { value: "Blockchain / Web3", label: "🔗 Blockchain / Web3" },
  { value: "Game Development", label: "🎮 Game Development" },
  { value: "AR / VR", label: "🥽 AR / VR" },
  { value: "Data Engineering / Analytics", label: "📊 Data Engineering / Analytics" },
  { value: "DevOps / Cloud Infrastructure", label: "☁️ DevOps / Cloud Infrastructure" },
]

const ADOPTION_BY_INDUSTRY: Record<string, string> = {
  Technology: "Very High (62-92%)",
  Mobile: "Very High (62-92%)",
  Web: "Very High (62-92%)",
  "Enterprise Software": "Very High (62-92%)",
  FinTech: "Very High (52-84%)",
  "HealthTech / Biotech": "High (67-85%)",
  "Robotics / Hardware": "Medium (19-52%)",
  "Quantum Computing": "Medium (19-52%)",
  "Semiconductor / Chip Design": "Medium (19-52%)",
  "IoT / Embedded Systems": "Medium (19-52%)",
  "Blockchain / Web3": "Very High (62-92%)",
  "Game Development": "Medium (19-52%)",
  "AR / VR": "Medium (19-52%)",
  "Data Engineering / Analytics": "Very High (62-92%)",
  "DevOps / Cloud Infrastructure": "Very High (62-92%)",
}

export default function CompaniesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [companies, setCompanies] = useState<CompanySummary[]>([])
  const [fetching, setFetching] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: "", description: "", industry: "Technology" })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: "", description: "", industry: "Technology" })

  useEffect(() => {
    if (!loading && !user) router.push("/login?redirect=/company")
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    fetch("/api/company")
      .then(r => r.json())
      .then(data => { if (data.companies) setCompanies(data.companies) })
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [user])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCreating(true)
    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setCompanies(prev => [data.company, ...prev])
      setShowCreate(false)
      setForm({ name: "", description: "", industry: "Technology" })
    } catch (err) { console.error("Create company error:", err); setError("Failed to create") }
    finally { setCreating(false) }
  }

  const startEdit = (c: CompanySummary) => {
    setEditingId(c.id)
    setEditForm({ name: c.name, description: c.description, industry: c.industry })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: "", description: "", industry: "Technology" })
  }

  const saveEdit = async (id: string) => {
    const res = await fetch(`/api/company/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
    if (res.ok) {
      const data = await res.json()
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...data.company } : c))
      cancelEdit()
    }
  }

  if (loading || fetching) return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-zinc-400">Loading...</div></div>

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Companies</h1>
          <p className="mt-1 text-sm text-zinc-500">Create your own AI-powered company with autonomous agent employees</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">
          {showCreate ? "Cancel" : "+ New Company"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-8 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 text-lg font-semibold">Create AI Company</h2>
          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. NexGen AI Solutions" className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea required value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What does your AI company do?" rows={3} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
            <div>
              <label className="text-sm font-medium">Industry</label>
              <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} className="mt-1 w-full appearance-none rounded-lg border border-zinc-300 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900">
                {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
              </select>
              <p className="mt-1 text-[10px] text-zinc-400">AI Adoption: {ADOPTION_BY_INDUSTRY[form.industry] || "Auto-detect"}</p>
            </div>
            <button type="submit" disabled={creating} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
              {creating ? "Creating..." : `Create with 16 AI Employees`}
            </button>
          </div>
        </form>
      )}

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-20 dark:border-zinc-700">
          <p className="text-zinc-500">No AI companies yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-sm font-medium text-blue-600 hover:underline">Create your first AI company</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {companies.map(c => (
            <div key={c.id} className="group relative rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-700">
              {editingId === c.id ? (
                <div className="space-y-3">
                  <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" placeholder="Name" />
                  <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" rows={2} placeholder="Description" />
                  <select value={editForm.industry} onChange={e => setEditForm(f => ({ ...f, industry: e.target.value }))} className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900">
                    {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(c.id)} className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Save</button>
                    <button onClick={cancelEdit} className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex items-start justify-between">
                    <Link href={`/company/${c.id}`} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-lg dark:bg-zinc-800">🏢</div>
                      <div>
                        <h3 className="font-semibold group-hover:text-blue-600">{c.name}</h3>
                        <span className="text-xs text-zinc-400">{c.industry}</span>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(c) }}
                      className="text-zinc-300 hover:text-blue-500 dark:text-zinc-600"
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                  <p className="mb-3 line-clamp-2 text-xs text-zinc-500">{c.description}</p>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span>{c._count.agents} AI employees</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
