"use client"

import { useState, useMemo } from "react"

interface Task {
  id: string
  title: string
  description: string
  priority: string
  dueDate: string | null
  position: number
  columnId: string | null
  assignee: { id: string; name: string; email: string } | null
  labels: { label: { id: string; name: string; color: string } }[]
  _count: { comments: number }
  createdAt: string
}

interface Column {
  id: string
  title: string
  color: string
  tasks: Task[]
}

interface ProjectData {
  id: string
  title: string
  description: string
  columns: Column[]
  tasks?: Task[]
}

const priorityOptions = ["low", "medium", "high", "urgent"]

export function TableView({ project, onUpdate }: { project: ProjectData; onUpdate: () => void }) {
  const allTasks = useMemo(() => project.columns?.flatMap(c => c.tasks) || [], [project])
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [sortBy, setSortBy] = useState<string>("position")

  const sorted = useMemo(() => {
    return [...allTasks].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "priority") {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 }
        return (order[a.priority as keyof typeof order] ?? 99) - (order[b.priority as keyof typeof order] ?? 99)
      }
      return a.position - b.position
    })
  }, [allTasks, sortBy])

  const startEdit = (taskId: string, field: string, value: string) => {
    setEditingCell({ taskId, field })
    setEditValue(value)
  }

  const saveEdit = async () => {
    if (!editingCell) return
    await fetch("/api/projects-workspace/0/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingCell.taskId, [editingCell.field]: editValue }),
    })
    setEditingCell(null)
    onUpdate()
  }

  const toggleSort = (field: string) => {
    setSortBy(prev => prev === field ? `-${field}` : field)
  }

  const priorityColors: Record<string, string> = {
    low: "text-zinc-500",
    medium: "text-blue-600",
    high: "text-orange-600",
    urgent: "text-red-600",
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--card-border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'var(--sidebar-bg)' }}>
              <th className="w-8 px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>#</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider cursor-pointer" style={{ color: 'var(--muted)' }} onClick={() => toggleSort("title")}>
                Title {sortBy === "title" ? "↑" : sortBy === "-title" ? "↓" : ""}
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider cursor-pointer" style={{ color: 'var(--muted)' }} onClick={() => toggleSort("priority")}>
                Priority {sortBy === "priority" ? "↑" : sortBy === "-priority" ? "↓" : ""}
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Assignee</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Labels</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Due Date</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((task, idx) => (
              <tr key={task.id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--muted-light)' }}>{idx + 1}</td>
                <td className="px-3 py-2.5">
                  {editingCell?.taskId === task.id && editingCell?.field === "title" ? (
                    <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={saveEdit} onKeyDown={e => e.key === "Enter" && saveEdit()} className="w-full rounded border px-2 py-1 text-xs outline-none dark:bg-zinc-800" style={{ borderColor: 'var(--primary)' }} autoFocus />
                  ) : (
                    <button onClick={() => startEdit(task.id, "title", task.title)} className="text-xs font-medium text-left hover:text-primary" style={{ color: 'var(--foreground)' }}>
                      {task.title}
                    </button>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className={`text-xs font-medium capitalize ${priorityColors[task.priority] || ""}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--muted)' }}>{task.assignee?.name || "—"}</td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {task.labels.map(({ label }) => (
                      <span key={label.id} className="taskade-badge text-white text-[9px]" style={{ backgroundColor: label.color }}>
                        {label.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--muted)' }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--muted-light)' }}>{task._count.comments > 0 ? `💬 ${task._count.comments}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs" style={{ color: 'var(--muted-light)' }}>{allTasks.length} tasks in {project.columns?.length || 0} columns</p>
    </div>
  )
}
