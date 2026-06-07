"use client"

import { useState, useCallback, useMemo } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TaskDetailModal } from "./TaskDetailModal"

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
  position: number
  tasks: Task[]
}

interface ProjectData {
  id: string
  title: string
  columns: Column[]
  labels: { id: string; name: string; color: string }[]
}

function SortableTask({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const priorityIndicator: Record<string, string> = {
    low: "#9CA3AF",
    medium: "#5048E5",
    high: "#F59E0B",
    urgent: "#EF4444",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="taskade-task-card group relative"
    >
      {/* Priority indicator line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-lg"
        style={{ backgroundColor: priorityIndicator[task.priority] || "#9CA3AF" }}
      />

      {task.labels.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1">
          {task.labels.map(({ label }) => (
            <span key={label.id} className="taskade-badge text-white text-[10px]" style={{ backgroundColor: label.color }}>
              {label.name}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>{task.title}</p>

      {task.description && (
        <p className="mb-2 text-xs line-clamp-2" style={{ color: 'var(--muted)' }}>{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--muted-light)' }}>
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
          {task.assignee && (
            <span className="flex items-center gap-1 max-w-[80px] truncate">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>
              {task.assignee.name}
            </span>
          )}
          {task._count.comments > 0 && (
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              {task._count.comments}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ColumnSection({ column, onAddTask }: { column: Column; onAddTask: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between px-1">
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: column.color }} />
        <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{column.title}</h3>
        <span className="taskade-column-count text-[11px]">{column.tasks.length}</span>
      </div>
      <button onClick={onAddTask} className="taskade-btn-ghost h-7 w-7 p-0 flex items-center justify-center shrink-0" title="Add task">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </button>
    </div>
  )
}

export function KanbanBoard({ project, onUpdate }: { project: ProjectData; onUpdate: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const columns = project.columns || []
  const allTaskIds = useMemo(() => columns.flatMap(c => c.tasks.map(t => t.id)), [columns])

  const findColumnByTaskId = useCallback((taskId: string) => {
    return columns.find(c => c.tasks.some(t => t.id === taskId))
  }, [columns])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeTask = columns.flatMap(c => c.tasks).find(t => t.id === active.id)
    if (!activeTask) return

    let targetColumn: Column | undefined
    let newPosition: number

    const overTask = columns.flatMap(c => c.tasks).find(t => t.id === over.id)
    if (overTask) {
      targetColumn = findColumnByTaskId(String(over.id))
      newPosition = overTask.position
    } else {
      targetColumn = columns.find(c => c.id === String(over.id))
      newPosition = targetColumn ? targetColumn.tasks.length : 0
    }

    if (!targetColumn) return

    await fetch("/api/projects-workspace/0/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: active.id, columnId: targetColumn.id, position: newPosition }),
    })

    onUpdate()
  }, [columns, findColumnByTaskId, onUpdate])

  const addTask = async (columnId: string) => {
    if (!newTaskTitle.trim()) return
    await fetch(`/api/projects-workspace/${project.id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTaskTitle, columnId }),
    })
    setNewTaskTitle("")
    setAddingToColumn(null)
    onUpdate()
  }

  const activeTask = activeId ? columns.flatMap(c => c.tasks).find(t => t.id === activeId) : null

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-5" style={{ background: 'var(--background)' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {columns.map(column => (
          <div key={column.id} className="taskade-column">
            <div>
              <ColumnSection column={column} onAddTask={() => setAddingToColumn(column.id)} />
            </div>

            <div className="flex-1 overflow-y-auto px-1 pb-2">
              <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 relative">
                  {column.tasks.map(task => (
                    <SortableTask key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                  ))}
                </div>
              </SortableContext>

              {addingToColumn === column.id && (
                <div className="mt-2 animate-slide-in-up">
                  <input
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addTask(column.id); if (e.key === "Escape") { setAddingToColumn(null); setNewTaskTitle("") } }}
                    placeholder="Task title..."
                    className="taskade-input text-sm"
                    autoFocus
                  />
                  <div className="mt-1.5 flex gap-1.5">
                    <button onClick={() => addTask(column.id)} className="taskade-btn-primary text-xs py-1 px-3">Add</button>
                    <button onClick={() => { setAddingToColumn(null); setNewTaskTitle("") }} className="taskade-btn-ghost text-xs py-1">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <DragOverlay>
          {activeTask ? (
            <div className="taskade-task-card opacity-90" style={{ width: 288, transform: 'rotate(3deg)' }}>
              <p className="text-sm font-medium">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          project={project}
          onClose={() => setSelectedTask(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  )
}
