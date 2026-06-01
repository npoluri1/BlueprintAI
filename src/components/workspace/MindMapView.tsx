"use client"

import { useMemo, useState } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node,
  type Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

interface Task {
  id: string
  title: string
  description: string
  priority: string
  assignee: { id: string; name: string; email: string } | null
  labels: { label: { id: string; name: string; color: string } }[]
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
}

const priorityColors: Record<string, string> = {
  low: "#a1a1aa",
  medium: "#3b82f6",
  high: "#f97316",
  urgent: "#ef4444",
}

function TaskNode({ data }: { data: { label: string; priority: string; assignee: string | null } }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <Handle type="target" position={Position.Top} className="!bg-zinc-400" />
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: priorityColors[data.priority] || "#a1a1aa" }} />
        <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{data.label}</span>
      </div>
      {data.assignee && (
        <p className="mt-1 text-[9px] text-zinc-400">{data.assignee}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-400" />
    </div>
  )
}

const nodeTypes = { taskNode: TaskNode }

export function MindMapView({ project }: { project: ProjectData }) {
  const [expandedColumn, setExpandedColumn] = useState<string | null>(null)

  const allTasks = useMemo(() => {
    return project.columns?.flatMap(c => c.tasks) || []
  }, [project])

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Root node = project title
    nodes.push({
      id: "root",
      type: "taskNode",
      position: { x: 300, y: 0 },
      data: { label: project.title, priority: "medium", assignee: null },
      style: { background: "#f0f0f0", border: "2px solid #3b82f6", borderRadius: 8, padding: 8 },
    })

    // Column nodes
    project.columns.forEach((col, ci) => {
      const colId = `col-${col.id}`
      const colX = 150 + ci * 300
      const colY = 120

      nodes.push({
        id: colId,
        type: "taskNode",
        position: { x: colX, y: colY },
        data: { label: `${col.title} (${col.tasks.length})`, priority: "medium", assignee: null },
        style: { background: col.color + "15", border: `2px solid ${col.color}` },
      })

      edges.push({
        id: `edge-root-${colId}`,
        source: "root",
        target: colId,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: col.color },
      })

      // Task nodes within columns
      col.tasks.slice(0, 5).forEach((task, ti) => {
        const taskId = `task-${task.id}`
        nodes.push({
          id: taskId,
          type: "taskNode",
          position: { x: colX + (ti % 2 === 0 ? -100 : 100), y: colY + 100 + Math.floor(ti / 2) * 80 },
          data: { label: task.title, priority: task.priority, assignee: task.assignee?.name || null },
        })
        edges.push({
          id: `edge-${colId}-${taskId}`,
          source: colId,
          target: taskId,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "#a1a1aa" },
        })
      })
    })

    return { initialNodes: nodes, initialEdges: edges }
  }, [project])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-zinc-50 dark:bg-zinc-950"
      >
        <Background color="#e4e4e7" gap={20} />
        <Controls />
        <MiniMap
          nodeStrokeColor="#6b7280"
          nodeColor="#ffffff"
          nodeBorderRadius={4}
          className="rounded-lg border border-zinc-200 dark:border-zinc-700"
        />
      </ReactFlow>
    </div>
  )
}
