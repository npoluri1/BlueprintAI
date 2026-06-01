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
  type DragOverEvent,
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

  const priorityColors: Record<string, string> = {
    low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-zinc-300 hover:shadow dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      {task.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.labels.map(({ label }) => (
            <span key={label.id} className="rounded px-1.5 py-0.5 text-[9px] font-medium text-white" style={{ backgroundColor: label.color }}>
              {label.name}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{task.title}</p>

      {task.description && (
        <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        {task.priority && (
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium capitalize ${priorityColors[task.priority] || ""}`}>
            {task.priority}
          </span>
        )}
        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
          {task.dueDate && <span>{new Date(task.dueDate).toLocaleDateString()}</span>}
          {task.assignee && <span className="truncate max-w-[60px]">{task.assignee.name}</span>}
          {task._count.comments > 0 && <span>💬 {task._count.comments}</span>}
        </div>
      </div>
    </div>
  )
}

function ColumnHeader({ column, onAddTask }: { column: Column; onAddTask: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: column.color }} />
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{column.title}</h3>
        <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {column.tasks.length}
        </span>
      </div>
      <button onClick={onAddTask} className="text-zinc-400 hover:text-blue-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14" /></svg>
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

  const  findColumnByTaskId = useCallback((taskId: string) => {
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

    // Check if over is a task or a column
    const overTask = columns.flatMap(c => c.tasks).find(t => t.id === String(over.id))
    if (overTask) {
      targetColumn = findColumnByTaskId(String(over.id))
      newPosition = overTask.position
    } else {
      targetColumn = columns.find(c => c.id === String(over.id))
      newPosition = targetColumn ? targetColumn.tasks.length : 0
    }

    if (!targetColumn) return

    // Update via API
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
    <div className="flex h-full gap-4 overflow-x-auto p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {columns.map(column => (
          <div key={column.id} className="flex w-72 shrink-0 flex-col rounded-xl bg-zinc-50 dark:bg-zinc-900">
            <div className="px-3 pt-3">
              <ColumnHeader column={column} onAddTask={() => setAddingToColumn(column.id)} />
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {column.tasks.map(task => (
                    <SortableTask key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                  ))}
                </div>
              </SortableContext>

              {addingToColumn === column.id && (
                <div className="mt-2">
                  <input
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addTask(column.id); if (e.key === "Escape") { setAddingToColumn(null); setNewTaskTitle("") } }}
                    placeholder="Task title..."
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
                    autoFocus
                  />
                  <div className="mt-1 flex gap-1">
                    <button onClick={() => addTask(column.id)} className="rounded bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">Add</button>
                    <button onClick={() => { setAddingToColumn(null); setNewTaskTitle("") }} className="rounded px-2 py-1 text-xs text-zinc-500 hover:text-zinc-700">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <DragOverlay>
          {activeTask ? (
            <div className="rounded-lg border border-zinc-300 bg-white p-3 shadow-lg dark:border-zinc-600 dark:bg-zinc-900">
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
