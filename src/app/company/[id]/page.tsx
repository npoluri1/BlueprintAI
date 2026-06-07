"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"
import { DEFAULT_AGENT_ROLES } from "@/lib/agents/roles"

interface Agent {
  id: string
  role: string
  name: string
  emoji: string
  systemPrompt: string
  _count?: { messages: number }
}

interface Message {
  id: string
  role: string
  content: string
  createdAt: string
}

interface Company {
  id: string
  name: string
  description: string
  industry: string
  agents: Agent[]
}

const ORG_LAYERS = [
  { label: "Executive", roles: ["CEO", "CFO", "COO"] },
  { label: "Technology & Data", roles: ["CTO", "CIO", "Data Scientist", "ML Engineer"] },
  { label: "Engineering", roles: ["VP Engineering", "Software Engineer", "DevOps Engineer", "Security Engineer"] },
  { label: "Product & Design", roles: ["CPO", "Product Manager", "UX Designer"] },
  { label: "Growth", roles: ["CMO"] },
  { label: "People", roles: ["CHRO"] },
]

interface WorkspaceOption {
  id: string
  name: string
}

interface CompanyOption {
  id: string
  name: string
  industry: string
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [fetching, setFetching] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", description: "", industry: "" })
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [addAgentForm, setAddAgentForm] = useState({ role: "", name: "" })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [allCompanies, setAllCompanies] = useState<CompanyOption[]>([])
  const [showWsForm, setShowWsForm] = useState(false)
  const [wsForm, setWsForm] = useState({ name: "", description: "", selectedCompanyId: id })
  const [wsCreating, setWsCreating] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push(`/login?redirect=/company/${id}`)
  }, [user, loading, router, id])

  useEffect(() => {
    if (!user) return
    fetch(`/api/company/${id}`)
      .then(r => r.json())
      .then(data => { if (data.company) setCompany(data.company) })
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [user, id])

  useEffect(() => {
    if (!user) return
    fetch("/api/company")
      .then(r => r.json())
      .then(data => { if (data.companies) setAllCompanies(data.companies.map((c: any) => ({ id: c.id, name: c.name, industry: c.industry }))) })
      .catch(console.error)
  }, [user])

  useEffect(() => {
    if (!selectedAgent) return
    fetch(`/api/company/${id}/agent?agentId=${selectedAgent.id}`)
      .then(r => r.json())
      .then(data => { if (data.messages) setMessages(data.messages) })
      .catch(console.error)
  }, [selectedAgent, id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const startEdit = () => {
    if (!company) return
    setEditForm({ name: company.name, description: company.description, industry: company.industry })
    setEditing(true)
  }

  const saveEdit = async () => {
    if (!company) return
    const res = await fetch(`/api/company/${company.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
    if (res.ok) {
      const data = await res.json()
      setCompany(prev => prev ? { ...prev, ...data.company } : prev)
      setEditing(false)
    }
  }

  const handleDeleteCompany = async () => {
    if (!company || !confirm("Delete this entire company and all its agents?")) return
    const res = await fetch(`/api/company/${company.id}`, { method: "DELETE" })
    if (res.ok) router.push("/company")
  }

  const addAgent = async () => {
    if (!company || !addAgentForm.role || !addAgentForm.name) return
    const res = await fetch(`/api/company/${company.id}/agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addAgentForm),
    })
    if (res.ok) {
      const data = await res.json()
      setCompany(prev => prev ? { ...prev, agents: [...prev.agents, { ...data.agent, _count: { messages: 0 } }] } : prev)
      setShowAddAgent(false)
      setAddAgentForm({ role: "", name: "" })
    }
  }

  const removeAgent = async (agentId: string) => {
    if (!confirm("Remove this employee from the company?")) return
    const res = await fetch(`/api/company/${company!.id}/agent?agentId=${agentId}`, { method: "DELETE" })
    if (res.ok) {
      setCompany(prev => prev ? { ...prev, agents: prev.agents.filter(a => a.id !== agentId) } : prev)
      if (selectedAgent?.id === agentId) { setSelectedAgent(null); setMessages([]) }
    }
  }

  const createWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wsForm.name.trim()) return
    setWsCreating(true)
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: wsForm.name, description: wsForm.description }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.workspace) {
          router.push(`/workspace/${data.workspace.id}`)
        }
      }
    } catch (err) { console.error("Create workspace error:", err) }
    setWsCreating(false)
  }

  const availableRoles = () => {
    if (!company) return []
    const used = new Set(company.agents.map(a => a.role))
    return DEFAULT_AGENT_ROLES.filter(r => !used.has(r.role))
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !selectedAgent || sending) return

    const userMsg: Message = { id: "tmp", role: "user", content: input.trim(), createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setSending(true)

    try {
      const res = await fetch(`/api/company/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: selectedAgent.id, message: userMsg.content }),
      })
      const data = await res.json()
      if (data.message) setMessages(prev => [...prev, data.message])
    } catch (err) {
      console.error("Company chat error:", err)
      setMessages(prev => [...prev, { id: "err", role: "assistant", content: "Failed to get response.", createdAt: new Date().toISOString() }])
    } finally {
      setSending(false)
    }
  }

  if (loading || fetching) return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-zinc-400">Loading...</div></div>
  if (!company) return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-zinc-500">Company not found</div></div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <Link href="/company" className="mb-1 inline-block text-xs text-zinc-400 hover:text-zinc-600">&larr; All Companies</Link>
          {editing ? (
            <div className="mt-2 space-y-2">
              <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" />
              <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" rows={2} />
              <div className="flex gap-2">
                <button onClick={saveEdit} className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Save</button>
                <button onClick={() => setEditing(false)} className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{company.name}</h1>
              <p className="text-sm text-zinc-500">{company.description}</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-400 dark:bg-zinc-800">{company.industry}</span>
          {!editing && (
            <>
              <button onClick={startEdit} className="text-zinc-300 hover:text-blue-500 dark:text-zinc-600" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button onClick={handleDeleteCompany} className="text-zinc-300 hover:text-red-500 dark:text-zinc-600" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider mr-2">Quick Actions:</span>
        <Link href="/builder" className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition">
          + New Project
        </Link>
        <button onClick={() => setShowWsForm(!showWsForm)} className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition">
          {showWsForm ? "Cancel" : "+ New Workspace"}
        </button>
        <Link href="/company" className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800 transition">
          + New Company
        </Link>
      </div>

      {showWsForm && (
        <form onSubmit={createWorkspace} className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold mb-3">Create Workspace</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Associated Company</label>
              <select
                value={wsForm.selectedCompanyId}
                onChange={e => setWsForm(f => ({ ...f, selectedCompanyId: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
              >
                {allCompanies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>
                ))}
              </select>
            </div>
            <input
              required
              value={wsForm.name}
              onChange={e => setWsForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Workspace name"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <textarea
              value={wsForm.description}
              onChange={e => setWsForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Description (optional)"
              rows={2}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 resize-none"
            />
            <button type="submit" disabled={wsCreating} className="rounded-full bg-zinc-900 px-5 py-2 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
              {wsCreating ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Org Chart */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Organization</h2>
            <button onClick={() => setShowAddAgent(true)} className="text-xs font-medium text-blue-600 hover:underline">+ Add Employee</button>
          </div>

          {showAddAgent && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="mb-3 space-y-2">                  <select value={addAgentForm.role} onChange={e => setAddAgentForm(f => ({ ...f, role: e.target.value }))} className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900">
                  <option value="">Select role...</option>
                  {availableRoles().length > 0
                    ? availableRoles().map(r => <option key={r.role} value={r.role}>{r.emoji} {r.role}</option>)
                    : DEFAULT_AGENT_ROLES.map(r => <option key={r.role} value={r.role}>{r.emoji} {r.role}</option>)
                  }
                </select>
                <input value={addAgentForm.name} onChange={e => setAddAgentForm(f => ({ ...f, name: e.target.value }))} placeholder="Employee name" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" />
              </div>
              <div className="flex gap-2">
                <button onClick={addAgent} disabled={!addAgentForm.role || !addAgentForm.name} className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">Add</button>
                <button onClick={() => { setShowAddAgent(false); setAddAgentForm({ role: "", name: "" }) }} className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400">Cancel</button>
              </div>
            </div>
          )}

          {ORG_LAYERS.map(layer => (
            <div key={layer.label}>
              <p className="mb-2 text-xs font-medium text-zinc-400">{layer.label}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {company.agents
                  .filter(a => layer.roles.includes(a.role))
                  .map(agent => (
                    <div
                      key={agent.id}
                      onClick={() => { setSelectedAgent(agent); setMessages([]) }}
                      className={`group relative cursor-pointer rounded-xl border p-4 text-left transition-all ${
                        selectedAgent?.id === agent.id
                          ? "border-zinc-900 bg-zinc-50 shadow-sm dark:border-zinc-100 dark:bg-zinc-900"
                          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                      }`}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); removeAgent(agent.id) }}
                        className="absolute right-2 top-2 hidden text-zinc-300 hover:text-red-500 group-hover:block dark:text-zinc-600"
                        title="Remove employee"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="mb-2 text-2xl">{agent.emoji}</div>
                      <div className="text-sm font-semibold">{agent.role}</div>
                      <div className="text-xs text-zinc-500">{agent.name}</div>
                      {agent._count && (
                        <div className="mt-1 text-[10px] text-zinc-400">{agent._count.messages} messages</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Panel */}
        <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800">
          {selectedAgent ? (
            <>
              <div className="flex items-center gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
                <span className="text-xl">{selectedAgent.emoji}</span>
                <div>
                  <div className="text-sm font-semibold">{selectedAgent.role}</div>
                  <div className="text-xs text-zinc-500">{selectedAgent.name}</div>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: "500px" }}>
                {messages.length === 0 && (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-xs text-zinc-400">Start a conversation with your {selectedAgent.role}</p>
                  </div>
                )}
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user" ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="flex gap-2 border-t border-zinc-200 p-4 dark:border-zinc-800">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={`Message ${selectedAgent.role}...`}
                  disabled={sending}
                  className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
                />
                <button type="submit" disabled={sending || !input.trim()} className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex h-[400px] items-center justify-center p-8">
              <div className="text-center">
                <div className="mb-3 text-4xl">🏢</div>
                <p className="text-sm text-zinc-500">Select an AI employee to start chatting</p>
                <p className="mt-1 text-xs text-zinc-400">Each role has unique expertise and perspective</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
