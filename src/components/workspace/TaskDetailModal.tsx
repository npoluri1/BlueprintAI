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

const priorityColors: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

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

  const saveTask = async () => {
    setSaving(true)
    await fetch("/api/projects-workspace/0/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: task.id,
        title,
        description,
        priority,
        dueDate: dueDate || null,
      }),
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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-12" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">in {getColumnTitle()}</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${priorityColors[priority] || ""}`}>{priority}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={saveTask} disabled={saving} className="rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={deleteTask} className="text-zinc-400 hover:text-red-500" title="Delete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </button>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto p-5 space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-zinc-500">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} onBlur={saveTask} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-zinc-500">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} onBlur={saveTask} rows={3} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" />
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-500">Priority</label>
              <select value={priority} onChange={e => { setPriority(e.target.value); setTimeout(saveTask, 100) }} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500">Due Date</label>
              <input type="date" value={dueDate} onChange={e => { setDueDate(e.target.value); setTimeout(saveTask, 100) }} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900" />
            </div>
          </div>

          {/* Labels */}
          {project.labels && project.labels.length > 0 && (
            <div>
              <label className="text-xs font-medium text-zinc-500">Labels</label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {project.labels.map(label => {
                  const isActive = task.labels.some(tl => tl.label.id === label.id)
                  return (
                    <span
                      key={label.id}
                      className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-medium transition ${
                        isActive ? "text-white ring-2 ring-offset-1" : "text-zinc-500 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-600"
                      }`}
                      style={{ backgroundColor: isActive ? label.color : "transparent" }}
                    >
                      {label.name}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <label className="text-xs font-medium text-zinc-500">Comments ({comments.length})</label>
            <div className="mt-2 space-y-3 max-h-40 overflow-y-auto">
              {comments.map(c => (
                <div key={c.id} className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{c.author}</span>
                    <span className="text-[10px] text-zinc-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{c.content}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-xs text-zinc-400">No comments yet</p>}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} placeholder="Add a comment..." className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" />
              <button onClick={addComment} disabled={!newComment.trim()} className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
