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

function OrgNode({ data }: { data: { label: string; role: string; color: string; count?: string } }) {
  return (
    <div
      className="rounded-xl border-2 px-4 py-3 shadow-sm min-w-[140px] text-center"
      style={{
        borderColor: data.color,
        background: 'var(--card-bg)',
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-400" style={{ width: 8, height: 8 }} />
      <p className="text-xs font-semibold" style={{ color: data.color }}>{data.role}</p>
      <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--foreground)' }}>{data.label}</p>
      {data.count && (
        <p className="text-[10px] mt-1" style={{ color: 'var(--muted-light)' }}>{data.count}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-400" style={{ width: 8, height: 8 }} />
    </div>
  )
}

const nodeTypes = { orgNode: OrgNode }

export function OrgChartView({ project }: { project: ProjectData }) {
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    if (!project.columns || project.columns.length === 0) {
      nodes.push({
        id: "root",
        type: "orgNode",
        position: { x: 200, y: 50 },
        data: { label: project.title, role: "Project", color: "#5048E5" as string, count: "No columns" },
      })
      return { initialNodes: nodes, initialEdges: edges }
    }

    // Root = Project
    nodes.push({
      id: "root",
      type: "orgNode",
      position: { x: (project.columns.length - 1) * 140, y: 0 },
      data: { label: project.title, role: "PROJECT", color: "#5048E5" as string },
    })

    // Level 1: Columns
    project.columns.forEach((col, ci) => {
      const colId = `col-${col.id}`
      const totalColTasks = col.tasks.length
      const colX = ci * 280
      const colY = 140

      nodes.push({
        id: colId,
        type: "orgNode",
        position: { x: colX, y: colY },
        data: { label: col.title, role: "COLUMN", color: col.color, count: `${totalColTasks} tasks` },
      })

      edges.push({
        id: `e-root-${colId}`,
        source: "root",
        target: colId,
        markerEnd: { type: MarkerType.ArrowClosed, color: col.color },
        style: { stroke: col.color, strokeWidth: 2 },
      })

      // Level 2: Tasks in columns
      col.tasks.slice(0, 4).forEach((task, ti) => {
        const taskId = `task-${task.id}`
        const taskX = colX + (ti % 2 === 0 ? 0 : 140)
        const taskY = colY + 110 + Math.floor(ti / 2) * 100

        nodes.push({
          id: taskId,
          type: "orgNode",
          position: { x: taskX, y: taskY },
          data: {
            label: task.title.length > 20 ? task.title.slice(0, 20) + "..." : task.title,
            role: task.assignee?.name || "Unassigned",
            color: task.priority === "urgent" ? "#EF4444" : task.priority === "high" ? "#F59E0B" : "#5048E5",
          },
        })

        edges.push({
          id: `e-${colId}-${taskId}`,
          source: colId,
          target: taskId,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "#9CA3AF", strokeWidth: 1.5 },
        })
      })

      // More indicator
      if (totalColTasks > 4) {
        const moreId = `more-${col.id}`
        nodes.push({
          id: moreId,
          type: "orgNode",
          position: { x: colX + 70, y: colY + 110 + Math.ceil(4 / 2) * 100 },
          data: { label: `+${totalColTasks - 4} more`, role: "TASKS", color: "#9CA3AF" },
        })
        edges.push({
          id: `e-${colId}-${moreId}`,
          source: colId,
          target: moreId,
          style: { stroke: "#9CA3AF", strokeDasharray: "5 5", strokeWidth: 1.5 },
        })
      }
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
        minZoom={0.3}
        maxZoom={2}
      >
        <Background color="#e4e4e7" gap={24} size={1} />
        <Controls
          className="rounded-lg border shadow-sm"
          style={{ borderColor: 'var(--card-border)' }}
        />
        <MiniMap
          nodeStrokeColor="#6b7280"
          nodeColor="#ffffff"
          nodeBorderRadius={4}
          style={{ borderRadius: 8, border: '1px solid var(--card-border)' }}
          className="shadow-sm"
        />
      </ReactFlow>
    </div>
  )
}
