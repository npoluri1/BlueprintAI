"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"
import { KanbanBoard } from "@/components/workspace/KanbanBoard"
import { CalendarView } from "@/components/workspace/CalendarView"
import { MindMapView } from "@/components/workspace/MindMapView"
import { TableView } from "@/components/workspace/TableView"

interface WorkspaceData {
  id: string
  name: string
  icon: string
  color: string
  description: string
  folders: { id: string; name: string; icon: string; _count: { projects: number } }[]
  projects: ProjectData[]
}

interface Column {
  id: string
  title: string
  color: string
  position: number
  tasks: TaskData[]
}

interface TaskData {
  id: string
  title: string
  description: string
  priority: string
  status: string
  dueDate: string | null
  position: number
  columnId: string | null
  assignee: { id: string; name: string; email: string } | null
  labels: { label: { id: string; name: string; color: string } }[]
  _count: { comments: number }
  createdAt: string
}

interface ProjectData {
  id: string
  title: string
  description: string
  icon: string
  color: string
  viewType: string
  _count: { tasks: number; columns: number }
  columns: Column[]
}

export default function WorkspaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null)
  const [fetching, setFetching] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [projectData, setProjectData] = useState<any>(null)
  const [activeView, setActiveView] = useState<string>("kanban")
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [projectForm, setProjectForm] = useState({ title: "", viewType: "kanban" })
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push(`/login?redirect=/workspace/${id}`)
  }, [user, loading, router, id])

  const fetchWorkspace = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch(`/api/workspaces/${id}`)
      const data = await res.json()
      if (data.workspace) {
        setWorkspace(data.workspace)
        setActiveView(data.workspace.projects[0]?.viewType || "kanban")
      }
    } catch (err) { console.error("Fetch workspace error:", err) }
    setFetching(false)
  }, [user, id])

  useEffect(() => { fetchWorkspace() }, [fetchWorkspace])

  const fetchProject = async (projectId: string) => {
    const res = await fetch(`/api/projects-workspace/${projectId}`)
    const data = await res.json()
    if (data.project) {
      setProjectData(data.project)
      setSelectedProject(data.project)
      setActiveView(data.project.viewType)
    }
  }

  const createFolder = async () => {
    if (!folderName.trim() || !workspace) return
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: folderName, workspaceId: id }),
    })
    const data = await res.json()
    if (data.folder) {
      setWorkspace(prev => prev ? {
        ...prev,
        folders: [...prev.folders, { ...data.folder, _count: { projects: 0 } }],
      } : prev)
      setFolderName("")
      setShowCreateFolder(false)
    }
  }

  const createProject = async () => {
    if (!projectForm.title.trim() || !workspace) return
    const res = await fetch("/api/projects-workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: projectForm.title,
        viewType: projectForm.viewType,
        workspaceId: id,
      }),
    })
    const data = await res.json()
    if (data.project) {
      setWorkspace(prev => prev ? {
        ...prev,
        projects: [{ ...data.project, _count: { tasks: 0, columns: data.project.columns?.length || 3 } }, ...prev.projects],
      } : prev)
      setProjectForm({ title: "", viewType: "kanban" })
      setShowCreateProject(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm("Delete this project?")) return
    await fetch(`/api/projects-workspace/${projectId}`, { method: "DELETE" })
    setWorkspace(prev => prev ? { ...prev, projects: prev.projects.filter(p => p.id !== projectId) } : prev)
    if (selectedProject?.id === projectId) { setSelectedProject(null); setProjectData(null) }
  }

  if (loading || fetching) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-zinc-400">Loading...</div></div>
  }
  if (!workspace) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-zinc-500">Workspace not found</div></div>
  }

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden flex-shrink-0`}>
        {sidebarOpen && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">{workspace.icon}</span>
                <span className="font-semibold text-sm truncate">{workspace.name}</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Folders */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Folders</span>
                  <button onClick={() => setShowCreateFolder(true)} className="text-zinc-400 hover:text-blue-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14" /></svg>
                  </button>
                </div>
                {showCreateFolder && (
                  <div className="mb-2 flex gap-1">
                    <input value={folderName} onChange={e => setFolderName(e.target.value)} onKeyDown={e => e.key === "Enter" && createFolder()} placeholder="Folder name" className="flex-1 rounded border border-zinc-300 px-2 py-1 text-xs outline-none dark:border-zinc-700 dark:bg-zinc-900" autoFocus />
                    <button onClick={createFolder} className="rounded bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">Add</button>
                  </div>
                )}
                <div className="space-y-0.5">
                  {workspace.folders.map(f => (
                    <div key={f.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900">
                      <span>{f.icon}</span>
                      <span className="flex-1 truncate">{f.name}</span>
                      <span className="text-zinc-400">{f._count.projects}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Projects</span>
                  <button onClick={() => setShowCreateProject(true)} className="text-zinc-400 hover:text-blue-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14" /></svg>
                  </button>
                </div>
                <div className="space-y-0.5">
                  {workspace.projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => fetchProject(p.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${
                        selectedProject?.id === p.id
                          ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span className="flex-1 truncate text-left">{p.title}</span>
                      <span className="text-zinc-400">{p._count.tasks}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteProject(p.id) }} className="text-zinc-300 hover:text-red-500 dark:text-zinc-600">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
          )}
          <Link href="/workspace" className="text-xs text-zinc-400 hover:text-zinc-600">&larr; Workspaces</Link>

          {selectedProject && (
            <>
              <span className="text-zinc-300 dark:text-zinc-600">/</span>
              <span className="text-sm font-medium">{selectedProject.title}</span>

              {/* View Switcher */}
              <div className="ml-auto flex items-center gap-1 rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
                {[
                  { id: "kanban", label: "Board", icon: "📋" },
                  { id: "calendar", label: "Calendar", icon: "📅" },
                  { id: "mindmap", label: "Mind Map", icon: "🧠" },
                  { id: "table", label: "Table", icon: "📊" },
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition ${
                      activeView === view.id
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    <span className="hidden sm:inline">{view.icon}</span>
                    <span>{view.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-auto">
          {!selectedProject ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-8">
              <div className="mb-4 text-5xl">📋</div>
              <h2 className="text-xl font-bold mb-2">Select a Project</h2>
              <p className="text-sm text-zinc-500 mb-6">Choose a project from the sidebar or create a new one</p>

              {showCreateProject && (
                <div className="w-full max-w-sm rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold mb-3">Create Project</h3>
                  <div className="space-y-3">
                    <input value={projectForm.title} onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))} onKeyDown={e => e.key === "Enter" && createProject()} placeholder="Project name" className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" autoFocus />
                    <select value={projectForm.viewType} onChange={e => setProjectForm(f => ({ ...f, viewType: e.target.value }))} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900">
                      <option value="kanban">📋 Board View</option>
                      <option value="calendar">📅 Calendar View</option>
                      <option value="mindmap">🧠 Mind Map</option>
                      <option value="table">📊 Table View</option>
                    </select>
                    <button onClick={createProject} className="w-full rounded-full bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Create</button>
                  </div>
                </div>
              )}

              {!showCreateProject && (
                <button onClick={() => setShowCreateProject(true)} className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">
                  + Create Project
                </button>
              )}
            </div>
          ) : (
            <>
              {activeView === "kanban" && <KanbanBoard project={projectData} onUpdate={() => selectedProject && fetchProject(selectedProject.id)} />}
              {activeView === "calendar" && <CalendarView project={projectData} />}
              {activeView === "mindmap" && <MindMapView project={projectData} />}
              {activeView === "table" && <TableView project={projectData} onUpdate={() => selectedProject && fetchProject(selectedProject.id)} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
