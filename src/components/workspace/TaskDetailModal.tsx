"use client"

import { useState, useEffect } from "react"

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

interface Label {
  id: string
  name: string
  color: string
}

interface ProjectData {
  id: string
  title: string
  columns: { id: string; title: string }[]
  labels: Label[]
}

interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
}

const priorityOptions = [
  { value: "low", label: "🟢 Low" },
  { value: "medium", label: "🟣 Medium" },
  { value: "high", label: "🟠 High" },
  { value: "urgent", label: "🔴 Urgent" },
]

export function TaskDetailModal({
  task,
  project,
  onClose,
  onUpdate,
}: {
  task: Task
  project: ProjectData
  onClose: () => void
  onUpdate: () => void
}) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [priority, setPriority] = useState(task.priority)
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : "")
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "comments">("details")

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => {
    fetch(`/api/projects-workspace/${project.id}/tasks/${task.id}/comments`)
      .then(r => r.json())
      .then(data => {
        if (data.comments) setComments(data.comments)
      })
      .catch(() => {})
  }, [project.id, task.id])

  const saveTask = async (field?: string, value?: string | null) => {
    setSaving(true)
    const body: any = { id: task.id }
    if (field && value !== undefined) body[field] = value
    else { body.title = title; body.description = description; body.priority = priority; body.dueDate = dueDate || null }
    await fetch("/api/projects-workspace/0/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    setSaving(false)
    onUpdate()
  }

  const deleteTask = async () => {
    if (!confirm("Delete this task?")) return
    await fetch(`/api/projects-workspace/0/tasks?id=${task.id}`, { method: "DELETE" })
    onClose()
    onUpdate()
  }

  const addComment = async () => {
    if (!newComment.trim()) return
    const res = await fetch(`/api/projects-workspace/${project.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: task.id, content: newComment }),
    })
    const data = await res.json()
    if (data.comment) {
      setComments(prev => [...prev, data.comment])
      setNewComment("")
    }
  }

  const getColumnTitle = () => {
    const col = project.columns?.find(c => c.id === task.columnId)
    return col?.title || "Unassigned"
  }

  return (
    <>
      {/* Overlay */}
      <div className="taskade-modal-overlay" onClick={onClose} />

      {/* Side Panel - Taskade style */}
      <div className="taskade-modal flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--card-border)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>in {getColumnTitle()}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={deleteTask} className="taskade-btn-ghost h-7 w-7 p-0 flex items-center justify-center" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
            </button>
            <button onClick={onClose} className="taskade-btn-ghost h-7 w-7 p-0 flex items-center justify-center" title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 pb-0">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === "details" ? "bg-zinc-100 dark:bg-zinc-800" : ""
            }`}
            style={{
              color: activeTab === "details" ? 'var(--foreground)' : 'var(--muted)',
              background: activeTab === "details" ? 'var(--sidebar-hover)' : 'transparent',
            }}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === "comments" ? "bg-zinc-100 dark:bg-zinc-800" : ""
            }`}
            style={{
              color: activeTab === "comments" ? 'var(--foreground)' : 'var(--muted)',
              background: activeTab === "comments" ? 'var(--sidebar-hover)' : 'transparent',
            }}
          >
            Comments {comments.length > 0 && `(${comments.length})`}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {activeTab === "details" ? (
            <>
              {/* Title */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-light)' }}>Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={() => saveTask("title", title)}
                  className="taskade-input mt-1.5 text-sm font-semibold"
                  style={{ borderColor: 'transparent', background: 'transparent', padding: '8px 0' }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-light)' }}>Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  onBlur={() => saveTask("description", description)}
                  rows={3}
                  className="taskade-input mt-1.5 text-sm resize-none"
                  placeholder="Add a description..."
                />
              </div>

              {/* Properties */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-light)' }}>Priority</label>
                  <select
                    value={priority}
                    onChange={e => { setPriority(e.target.value); saveTask("priority", e.target.value) }}
                    className="taskade-select mt-1.5 text-sm"
                  >
                    {priorityOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-light)' }}>Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => { setDueDate(e.target.value); saveTask("dueDate", e.target.value || null) }}
                    className="taskade-input mt-1.5 text-sm"
                  />
                </div>
              </div>

              {/* Labels */}
              {project.labels && project.labels.length > 0 && (
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-light)' }}>Labels</label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {project.labels.map(label => {
                      const isActive = task.labels.some(tl => tl.label.id === label.id)
                      return (
                        <span
                          key={label.id}
                          className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                            isActive ? "text-white" : "opacity-40 hover:opacity-70"
                          }`}
                          style={{ backgroundColor: isActive ? label.color : 'transparent', border: isActive ? 'none' : '1px solid var(--card-border)' }}
                        >
                          {label.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-2 border-t" style={{ borderColor: 'var(--card-border)' }}>
                <div className="space-y-2 text-xs" style={{ color: 'var(--muted)' }}>
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span>{new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  {task.assignee && (
                    <div className="flex justify-between">
                      <span>Assignee</span>
                      <span>{task.assignee.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Task ID</span>
                    <span className="text-[10px] font-mono">{task.id.slice(0, 12)}</span>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={() => saveTask()}
                disabled={saving}
                className="taskade-btn-primary w-full text-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              {/* Comments */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>No comments yet</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-light)' }}>Start the conversation</p>
                  </div>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="rounded-lg p-3 animate-slide-in-up" style={{ background: 'var(--sidebar-bg)' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium">{c.author}</span>
                        <span className="text-[10px]" style={{ color: 'var(--muted-light)' }}>
                          {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--muted)' }}>{c.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment */}
              <div className="flex gap-2">
                <input
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addComment()}
                  placeholder="Add a comment..."
                  className="taskade-input text-sm flex-1"
                />
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className="taskade-btn-primary text-sm px-4"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
