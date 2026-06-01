"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"

interface ProjectSummary {
  id: string
  title: string
  description: string
  prompt: string
  techStack: string[]
  createdAt: string
}

export default function ProjectsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [fetching, setFetching] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: "", description: "", techStack: "" })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/projects")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    fetch("/api/projects")
      .then(r => r.json())
      .then(data => {
        if (data.projects) setProjects(data.projects)
      })
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [user])

  const startEdit = (p: ProjectSummary) => {
    setEditingId(p.id)
    setEditForm({ title: p.title, description: p.description, techStack: (p.techStack || []).join(", ") })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ title: "", description: "", techStack: "" })
  }

  const saveEdit = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editForm.title,
        description: editForm.description,
        techStack: editForm.techStack.split(",").map(s => s.trim()).filter(Boolean),
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data.project, techStack: JSON.parse(data.project.techStack || "[]") } : p))
      cancelEdit()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProjects(prev => prev.filter(p => p.id !== id))
    }
  }

  if (loading || fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {projects.length} project{projects.length !== 1 ? "s" : ""} generated
          </p>
        </div>
        <Link
          href="/builder"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-20 dark:border-zinc-700">
          <p className="text-zinc-500">No projects yet</p>
          <Link href="/builder" className="mt-3 text-sm font-medium text-blue-600 hover:underline">
            Describe your first app idea
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => (
            <div
              key={p.id}
              className="group relative rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              {editingId === p.id ? (
                <div className="space-y-3">
                  <input
                    value={editForm.title}
                    onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder="Title"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
                    rows={2}
                    placeholder="Description"
                  />
                  <input
                    value={editForm.techStack}
                    onChange={e => setEditForm(f => ({ ...f, techStack: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder="Tech stack (comma separated)"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(p.id)} className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Save</button>
                    <button onClick={cancelEdit} className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-zinc-400 hover:text-blue-600 dark:text-zinc-500"
                        title="Edit"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-zinc-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {p.techStack && p.techStack.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {p.techStack.slice(0, 4).map((t, i) => (
                        <span key={i} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {t}
                        </span>
                      ))}
                      {p.techStack.length > 4 && (
                        <span className="text-[10px] text-zinc-400">+{p.techStack.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    <Link
                      href={`/builder?project=${p.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Open
                    </Link>
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
