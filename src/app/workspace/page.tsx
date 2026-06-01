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
      const data = await res.json()
      if (data.workspace) {
        setWorkspaces(prev => [...prev, { ...data.workspace, _count: { folders: 0, projects: 0 }, folders: [] }])
        setShowCreate(false)
        setForm({ name: "", description: "" })
      }
    } catch (err) { console.error("Create workspace error:", err) }
    setCreating(false)
  }

  const createProject = async () => {
    const res = await fetch("/api/projects-workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Project", viewType: "kanban" }),
    })
    const data = await res.json()
    if (data.project) {
      router.push(`/workspace/${data.project.id}`)
    }
  }

  const deleteWorkspace = async (id: string) => {
    if (!confirm("Delete this workspace and all its projects?")) return
    await fetch(`/api/workspaces/${id}`, { method: "DELETE" })
    setWorkspaces(prev => prev.filter(w => w.id !== id))
  }

  if (loading || fetching) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-zinc-400">Loading...</div></div>
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""} &middot; {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={createProject} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500">
            + New Project
          </button>
          <button onClick={() => setShowCreate(!showCreate)} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">
            {showCreate ? "Cancel" : "+ New Workspace"}
          </button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={createWorkspace} className="mb-8 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 text-lg font-semibold">Create Workspace</h2>
          <div className="space-y-4">
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Workspace name" className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" rows={2} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" />
            <button type="submit" disabled={creating} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
              {creating ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        </form>
      )}

      {workspaces.length === 0 && projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-20 dark:border-zinc-700">
          <p className="text-4xl mb-4">📁</p>
          <p className="text-zinc-500">No workspaces yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-sm font-medium text-blue-600 hover:underline">
            Create your first workspace
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {workspaces.map(ws => (
            <Link key={ws.id} href={`/workspace/${ws.id}`} className="group rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-700">
              <div className="mb-3 flex items-start justify-between">
                <span className="text-3xl">{ws.icon}</span>
                <button onClick={(e) => { e.preventDefault(); deleteWorkspace(ws.id) }} className="text-zinc-300 hover:text-red-500 dark:text-zinc-600" title="Delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <h3 className="font-semibold group-hover:text-blue-600">{ws.name}</h3>
              <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{ws.description}</p>
              <div className="mt-3 flex gap-3 text-xs text-zinc-400">
                <span>{ws._count.projects} projects</span>
                <span>{ws._count.folders} folders</span>
              </div>
            </Link>
          ))}

          {/* Show ungrouped projects */}
          {projects.filter(p => !p.workspace).map(p => (
            <Link key={p.id} href={`/workspace/${p.id}`} className="group rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-700">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate group-hover:text-blue-600">{p.title}</h3>
                  <p className="text-xs text-zinc-400 capitalize">{p.viewType} view &middot; {p._count.tasks} tasks</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
