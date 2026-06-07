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
  columns: Column[]
  labels: { id: string; name: string; color: string }[]
}

const priorityIcons: Record<string, string> = {
  low: "🟢",
  medium: "🟣",
  high: "🟠",
  urgent: "🔴",
}

export function ListView({ project, onUpdate }: { project: ProjectData; onUpdate: () => void }) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<string>("all")

  const allTasks = useMemo(() => {
    const tasks: (Task & { columnTitle: string; columnColor: string })[] = []
    project.columns?.forEach(col => {
      col.tasks.forEach(task => {
        tasks.push({ ...task, columnTitle: col.title, columnColor: col.color })
      })
    })
    return tasks
  }, [project])

  const filteredTasks = useMemo(() => {
    if (filter === "all") return allTasks
    return allTasks.filter(t => t.columnId === filter)
  }, [allTasks, filter])

  const toggleExpand = (id: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const formatDate = (date: string | null) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="h-full overflow-auto p-5">
      {/* Filter bar */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Filter:</span>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="taskade-select text-xs py-1.5 w-auto"
        >
          <option value="all">All Columns</option>
          {project.columns?.map(col => (
            <option key={col.id} value={col.id}>{col.title}</option>
          ))}
        </select>
        <span className="text-xs" style={{ color: 'var(--muted-light)' }}>{filteredTasks.length} tasks</span>
      </div>

      {/* List */}
      <div className="rounded-xl border" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: 'var(--card-border)', color: 'var(--muted)' }}>
          <span className="w-6 shrink-0"></span>
          <span className="flex-1">Task</span>
          <span className="w-20 shrink-0 text-center hidden sm:block">Priority</span>
          <span className="w-24 shrink-0 text-center hidden sm:block">Column</span>
          <span className="w-20 shrink-0 text-center hidden md:block">Due Date</span>
          <span className="w-16 shrink-0 text-center hidden md:block">Comments</span>
        </div>

        {/* Tasks */}
        {filteredTasks.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task, idx) => (
            <div
              key={task.id}
              className="group border-b last:border-b-0 transition-colors"
              style={{ borderColor: 'var(--border-light)' }}
            >
              {/* Task row */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                onClick={() => toggleExpand(task.id)}
              >
                <span className="w-6 shrink-0 text-[10px]" style={{ color: 'var(--muted-light)' }}>{idx + 1}</span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  {task.description && expandedTasks.has(task.id) && (
                    <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>{task.description}</p>
                  )}
                </div>

                <span className="w-20 shrink-0 text-center text-xs hidden sm:block">{priorityIcons[task.priority] || "🟣"}</span>

                <div className="w-24 shrink-0 text-center hidden sm:block">
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
                    <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: task.columnColor }} />
                    {task.columnTitle}
                  </span>
                </div>

                <span className="w-20 shrink-0 text-center text-xs hidden md:block" style={{ color: task.dueDate ? 'var(--foreground)' : 'var(--muted-light)' }}>
                  {formatDate(task.dueDate) || "—"}
                </span>

                <span className="w-16 shrink-0 text-center text-xs hidden md:block" style={{ color: 'var(--muted-light)' }}>
                  {task._count.comments > 0 ? `💬 ${task._count.comments}` : "—"}
                </span>

                <button
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--muted-light)' }}
                  onClick={e => { e.stopPropagation(); }}
                  title="More options"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                </button>
              </div>

              {/* Expanded details */}
              {expandedTasks.has(task.id) && (
                <div className="px-4 pb-3 pl-14 animate-slide-in-up">
                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--muted)' }}>
                    {task.assignee && (
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>
                        {task.assignee.name}
                      </span>
                    )}
                    {task.labels.length > 0 && (
                      <span className="flex items-center gap-1">
                        {task.labels.map(({ label }) => (
                          <span key={label.id} className="taskade-badge text-white text-[10px]" style={{ backgroundColor: label.color }}>
                            {label.name}
                          </span>
                        ))}
                      </span>
                    )}
                    <span>ID: {task.id.slice(0, 8)}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <p className="mt-3 text-xs" style={{ color: 'var(--muted-light)' }}>
        {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} in {project.columns?.length || 0} columns
      </p>
    </div>
  )
}
