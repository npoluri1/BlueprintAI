"use client"

import { useState, useMemo } from "react"

interface Task {
  id: string
  title: string
  description: string
  priority: string
  dueDate: string | null
  assignee: { id: string; name: string; email: string } | null
  labels: { label: { id: string; name: string; color: string } }[]
}

interface ProjectData {
  id: string
  title: string
  columns: { id: string; title: string; tasks: Task[] }[]
  tasks?: Task[]
}

const priorityColors: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function CalendarView({ project }: { project: ProjectData }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const allTasks = useMemo(() => {
    const tasks = project.tasks || []
    const fromColumns = project.columns?.flatMap(c => c.tasks) || []
    return [...tasks, ...fromColumns].filter((t, i, arr) => arr.findIndex(x => x.id === t.id) === i)
  }, [project])

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>()
    allTasks.forEach(task => {
      if (task.dueDate) {
        const key = new Date(task.dueDate).toDateString()
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(task)
      }
    })
    return map
  }, [allTasks])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  return (
    <div className="flex h-full flex-col p-4">
      {/* Month Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold capitalize">
          {new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">&larr;</button>
          <button onClick={() => setCurrentDate(new Date())} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">Today</button>
          <button onClick={nextMonth} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">&rarr;</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px rounded-xl border border-zinc-200 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-700">
        {dayNames.map(d => (
          <div key={d} className="bg-zinc-50 px-2 py-2 text-center text-xs font-semibold text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
            {d}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] bg-white dark:bg-zinc-900" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const dateKey = date.toDateString()
          const dayTasks = tasksByDate.get(dateKey) || []

          return (
            <div
              key={day}
              onClick={() => setSelectedDay(date)}
              className={`min-h-[100px] cursor-pointer bg-white p-1.5 transition hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 ${
                selectedDay?.toDateString() === dateKey ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                isToday(day) ? "bg-blue-600 text-white font-bold" : "text-zinc-600 dark:text-zinc-400"
              }`}>
                {day}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${priorityColors[task.priority] || ""}`}>
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[9px] text-zinc-400">+{dayTasks.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Day Tasks */}
      {selectedDay && (
        <div className="mt-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-sm font-semibold mb-3">
            Tasks for {selectedDay.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h3>
          {(() => {
            const dayTasks = tasksByDate.get(selectedDay.toDateString()) || []
            return dayTasks.length === 0 ? (
              <p className="text-sm text-zinc-400">No tasks due this day</p>
            ) : (
              <div className="space-y-2">
                {dayTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <span className={`h-2 w-2 rounded-full ${
                      task.priority === "urgent" ? "bg-red-500" :
                      task.priority === "high" ? "bg-orange-500" :
                      task.priority === "medium" ? "bg-blue-500" : "bg-zinc-400"
                    }`} />
                    <span className="flex-1 text-sm font-medium">{task.title}</span>
                    {task.assignee && <span className="text-xs text-zinc-400">{task.assignee.name}</span>}
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
