"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"
import { KanbanBoard } from "@/components/workspace/KanbanBoard"
import { CalendarView } from "@/components/workspace/CalendarView"
import { MindMapView } from "@/components/workspace/MindMapView"
import { TableView } from "@/components/workspace/TableView"
import { ListView } from "@/components/workspace/ListView"
import { OrgChartView } from "@/components/workspace/OrgChartView"

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
  generatedProjectId: string | null
  _count: { tasks: number; columns: number }
  columns: Column[]
  labels: { id: string; name: string; color: string }[]
}

const VIEW_OPTIONS = [
  { id: "list", label: "List", icon: "☰" },
  { id: "kanban", label: "Board", icon: "📋" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "mindmap", label: "Mind Map", icon: "🧠" },
  { id: "orgchart", label: "Org Chart", icon: "🏛️" },
  { id: "table", label: "Table", icon: "📊" },
]

export default function WorkspaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null)
  const [fetching, setFetching] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [projectData, setProjectData] = useState<any>(null)
  const [activeView, setActiveView] = useState<string>("kanban")
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

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

  const createProject = () => {
    router.push("/builder")
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm("Delete this project?")) return
    await fetch(`/api/projects-workspace/${projectId}`, { method: "DELETE" })
    setWorkspace(prev => prev ? { ...prev, projects: prev.projects.filter(p => p.id !== projectId) } : prev)
    if (selectedProject?.id === projectId) { setSelectedProject(null); setProjectData(null) }
  }

  if (loading || fetching) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-muted">Loading...</div></div>
  }
  if (!workspace) {
    return <div className="flex min-h-[60vh] items-center justify-center" style={{ color: 'var(--muted)' }}>Workspace not found</div>
  }

  const filteredProjects = workspace.projects.filter(p =>
    !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-57px)]" style={{ background: 'var(--background)' }}>
      {/* Sidebar - Taskade style */}
      <div
        className={`${sidebarOpen ? "w-60" : "w-0"} transition-all duration-200 overflow-hidden flex-shrink-0`}
        style={{ borderRight: '1px solid var(--card-border)', background: 'var(--sidebar-bg)' }}
      >
        {sidebarOpen && (
          <div className="flex h-full flex-col">
            {/* Workspace header */}
            <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '1px solid var(--card-border)' }}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">{workspace.icon}</span>
                <span className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{workspace.name}</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="taskade-btn-ghost h-7 w-7 p-0 flex items-center justify-center shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
            </div>

            {/* Search */}
            <div className="px-3 pt-3 pb-2">
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--muted-light)' }}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full rounded-md border bg-white pl-7 pr-2.5 py-1.5 text-xs outline-none dark:bg-zinc-900"
                  style={{ borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-4">
              {/* Folders section */}
              <div className="pt-2">
                <div className="flex items-center justify-between px-1.5 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-light)' }}>Folders</span>
                  <button onClick={() => setShowCreateFolder(true)} className="taskade-btn-ghost h-6 w-6 p-0 flex items-center justify-center" title="New folder">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>

                {showCreateFolder && (
                  <div className="mb-2 px-1 flex gap-1">
                    <input
                      value={folderName}
                      onChange={e => setFolderName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && createFolder()}
                      placeholder="Folder name"
                      className="flex-1 rounded-md border bg-white px-2 py-1 text-xs outline-none dark:bg-zinc-900"
                      style={{ borderColor: 'var(--card-border)' }}
                      autoFocus
                    />
                    <button onClick={createFolder} className="taskade-btn-primary text-xs py-1 px-2">Add</button>
                  </div>
                )}

                <div className="space-y-0.5">
                  {workspace.folders.map(f => (
                    <div key={f.id} className="taskade-sidebar-item text-xs">
                      <span className="shrink-0">{f.icon || "📂"}</span>
                      <span className="flex-1 truncate">{f.name}</span>
                      <span className="shrink-0 text-[10px]" style={{ color: 'var(--muted-light)' }}>{f._count.projects}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects section */}
              <div>
                <div className="flex items-center justify-between px-1.5 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-light)' }}>Projects</span>
                  <Link href="/builder" className="taskade-btn-ghost h-6 w-6 p-0 flex items-center justify-center" title="New project">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </Link>
                </div>

                <div className="space-y-0.5">
                  {filteredProjects.map(p => (
                    <div
                      key={p.id}
                      onClick={() => fetchProject(p.id)}
                      className={`group flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                        selectedProject?.id === p.id ? "taskade-sidebar-item-active" : "taskade-sidebar-item"
                      }`}
                    >
                      <span className="shrink-0">{p.icon || "📄"}</span>
                      <span className="flex-1 truncate text-left">{p.title}</span>
                      {p.generatedProjectId && (
                        <Link
                          href={`/builder?project=${p.generatedProjectId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                        >
                          Builder
                        </Link>
                      )}
                      <span className="shrink-0 text-[10px]" style={{ color: 'var(--muted-light)' }}>{p._count.tasks}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProject(p.id) }}
                        className="shrink-0 opacity-0 group-hover:opacity-100 hover:text-red-500"
                        style={{ color: 'var(--muted-light)' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom - Create project button */}
            <div className="px-2 pb-3" style={{ borderTop: '1px solid var(--card-border)' }}>
              <Link
                href="/builder"
                className="taskade-btn-ghost w-full mt-2 text-xs flex items-center justify-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                New Project
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--background)' }}>
        {/* Top Bar - Taskade style */}
        <div className="taskade-topbar" style={{ borderBottom: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="taskade-btn-ghost h-7 w-7 p-0 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
          )}
          <Link href="/workspace" className="text-xs" style={{ color: 'var(--muted)' }}>
            <span className="hover:text-primary" style={{ color: 'inherit' }}>&larr;</span>
          </Link>

          {selectedProject && (
            <>
              <span className="text-xs" style={{ color: 'var(--muted-light)' }}>/</span>
              <span className="text-sm font-medium">{selectedProject.title}</span>

              {/* View Switcher - Taskade style pill tabs */}
              <div className="ml-auto flex items-center gap-0.5 rounded-lg p-0.5" style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--card-border)' }}>
                {VIEW_OPTIONS.map(view => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      activeView === view.id
                        ? "text-white"
                        : ""
                    }`}
                    style={{
                      background: activeView === view.id ? 'var(--primary)' : 'transparent',
                      color: activeView === view.id ? '#ffffff' : 'var(--muted)',
                    }}
                    onMouseEnter={e => {
                      if (activeView !== view.id) {
                        (e.target as HTMLElement).style.background = 'var(--sidebar-hover)';
                        (e.target as HTMLElement).style.color = 'var(--foreground)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeView !== view.id) {
                        (e.target as HTMLElement).style.background = 'transparent';
                        (e.target as HTMLElement).style.color = 'var(--muted)';
                      }
                    }}
                  >
                    <span>{view.icon}</span>
                    <span className="hidden sm:inline">{view.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-auto" style={{ background: 'var(--background)' }}>
          {!selectedProject ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-8">
              <div className="mb-4 text-5xl opacity-30">📋</div>
              <h2 className="text-lg font-semibold mb-1">Select a Project</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Choose a project from the sidebar or create a new one</p>

              <Link href="/builder" className="taskade-btn-primary inline-flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                + New Project
              </Link>
            </div>
          ) : (
            <>
              {activeView === "kanban" && (
                <KanbanBoard project={projectData} onUpdate={() => selectedProject && fetchProject(selectedProject.id)} />
              )}
              {activeView === "list" && (
                <ListView project={projectData} onUpdate={() => selectedProject && fetchProject(selectedProject.id)} />
              )}
              {activeView === "calendar" && <CalendarView project={projectData} />}
              {activeView === "mindmap" && <MindMapView project={projectData} />}
              {activeView === "orgchart" && <OrgChartView project={projectData} />}
              {activeView === "table" && (
                <TableView project={projectData} onUpdate={() => selectedProject && fetchProject(selectedProject.id)} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
