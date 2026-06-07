"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"

interface WorkspaceSummary {
  id: string
  name: string
  icon: string
  color: string
  description: string
  _count: { folders: number; projects: number }
  folders: { id: string; name: string; icon: string; _count: { projects: number } }[]
}

interface ProjectSummary {
  id: string
  title: string
  icon: string
  color: string
  viewType: string
  generatedProjectId: string | null
  _count: { tasks: number }
  workspace: { name: string; icon: string } | null
}

export default function WorkspacePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([])
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [fetching, setFetching] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: "", description: "" })
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  useEffect(() => {
    if (!loading && !user) router.push("/login?redirect=/workspace")
  }, [user, loading, router])

  const fetchData = async () => {
    setFetching(true)
    try {
      const [wsRes, projRes] = await Promise.all([
        fetch("/api/workspaces"),
        fetch("/api/projects-workspace"),
      ])
      if (wsRes.ok) {
        const data = await wsRes.json()
        setWorkspaces(data.workspaces || [])
      }
      if (projRes.ok) {
        const data = await projRes.json()
        setProjects(data.projects || [])
      }
    } catch (err) { console.error("Workspace fetch error:", err) }
    setFetching(false)
  }

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user])

  const createWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, description: form.description }),
      })
      if (res.ok) {
        const text = await res.text()
        if (!text) throw new Error("Empty response")
        const data = JSON.parse(text)
        if (data.workspace) {
          setWorkspaces(prev => [...prev, { ...data.workspace, _count: { folders: 0, projects: 0 }, folders: [] }])
          setShowCreate(false)
          setForm({ name: "", description: "" })
        }
      } else {
        const text = await res.text()
        console.error("Create workspace failed:", res.status, text)
      }
    } catch (err) { console.error("Create workspace error:", err) }
    setCreating(false)
  }

  const createProject = () => {
    router.push("/builder")
  }

  const deleteWorkspace = async (id: string) => {
    if (!confirm("Delete this workspace and all its projects?")) return
    await fetch(`/api/workspaces/${id}`, { method: "DELETE" })
    setWorkspaces(prev => prev.filter(w => w.id !== id))
  }

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return
    await fetch(`/api/projects-workspace/${id}`, { method: "DELETE" })
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const updateProjectTitle = async (id: string) => {
    if (!editTitle.trim()) return
    await fetch(`/api/projects-workspace/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    })
    setProjects(prev => prev.map(p => p.id === id ? { ...p, title: editTitle } : p))
    setEditingId(null)
    setEditTitle("")
  }

  if (loading || fetching) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-zinc-400">Loading...</div></div>
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10" style={{ background: 'var(--background)' }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Workspaces</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""} &middot; {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={createProject}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>New Project</span>
          </button>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.97]"
            style={{
              background: 'var(--primary)',
              color: '#ffffff',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {showCreate ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                <span>Cancel</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                  <path d="M3 3h18v18H3z" />
                </svg>
                <span>New Workspace</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={createWorkspace} className="mb-8 rounded-xl p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Create Workspace</h2>
          <div className="space-y-4">
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Workspace name" className="taskade-input" />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" rows={2} className="taskade-input resize-none" />
            <button type="submit" disabled={creating} className="taskade-btn-primary text-sm">
              {creating ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        </form>
      )}

      {workspaces.length === 0 && projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl py-16" style={{ border: '2px dashed var(--card-border)' }}>
          <p className="text-4xl mb-4">📁</p>
          <p style={{ color: 'var(--muted)' }}>No workspaces or projects yet</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--muted-light)' }}>Use the buttons above to create your first one</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {workspaces.map(ws => (
            <Link key={ws.id} href={`/workspace/${ws.id}`} className="taskade-card group p-5 block">
              <div className="mb-3 flex items-start justify-between">
                <span className="text-3xl">{ws.icon}</span>
                <button onClick={(e) => { e.preventDefault(); deleteWorkspace(ws.id) }} className="hover:text-red-500" style={{ color: 'var(--muted-light)' }} title="Delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <h3 className="font-semibold group-hover:text-primary" style={{ transition: 'color 0.2s' }}>{ws.name}</h3>
              <p className="mt-1 text-xs line-clamp-2" style={{ color: 'var(--muted)' }}>{ws.description}</p>
              <div className="mt-3 flex gap-3 text-xs" style={{ color: 'var(--muted-light)' }}>
                <span>{ws._count.projects} projects</span>
                <span>{ws._count.folders} folders</span>
              </div>
            </Link>
          ))}

          {/* Show ungrouped projects */}
          {projects.filter(p => !p.workspace).map(p => (
            <div key={p.id} className="taskade-card group p-5 relative">
              <div className="block">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    {editingId === p.id ? (
                      <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") updateProjectTitle(p.id)
                          if (e.key === "Escape") { setEditingId(null); setEditTitle("") }
                        }}
                        onBlur={() => { setEditingId(null); setEditTitle("") }}
                        className="taskade-input text-sm py-0.5"
                        autoFocus
                      />
                    ) : (
                      <>
                        <h3 className="font-semibold truncate group-hover:text-primary" style={{ transition: 'color 0.2s' }}>{p.title}</h3>
                        <p className="text-xs capitalize" style={{ color: 'var(--muted-light)' }}>
                          {p.generatedProjectId ? "AI Generated" : `${p.viewType} view`} &middot; {p._count.tasks} tasks
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {p.generatedProjectId ? (
                  <Link
                    href={`/builder?project=${p.generatedProjectId}`}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-[10px] font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                  >
                    Open in Builder
                  </Link>
                ) : (
                  <Link
                    href={`/workspace/${p.id}`}
                    className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  >
                    Open Project
                  </Link>
                )}
              </div>
              {editingId !== p.id && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingId(p.id); setEditTitle(p.title) }}
                    className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    style={{ color: 'var(--muted-light)' }}
                    title="Edit"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="p-1 rounded hover:text-red-500"
                    style={{ color: 'var(--muted-light)' }}
                    title="Delete"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
