/**
 * MCP (Model Context Protocol) Server Endpoint
 *
 * Implements the Model Context Protocol for AI agent tool integration.
 * Supports:
 * - Tool discovery (list all available tools)
 * - Tool execution with structured I/O
 * - Context management for agent sessions
 * - Enterprise-grade error handling and logging
 *
 * The MCP server allows AI agents (Claude, GPT, etc.) to interact with
 * the BlueprintAI platform through well-defined tools.
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { vectorStore } from "@/lib/vector-store"
import { generateFallbackProject } from "@/lib/generate-fallback"

/* ---------- Tool Definitions ---------- */

interface MCPToolDefinition {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  handler: (args: Record<string, unknown>, userId: string) => Promise<Record<string, unknown>>
}

const TOOLS: MCPToolDefinition[] = [
  {
    name: "generate_project",
    description: "Generate a complete software project with files, structure, and tech stack based on a description",
    inputSchema: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "Description of the project to generate" },
        category: { type: "string", description: "Project category (e.g. Mobile Apps, Web Apps, AI Agents)", default: "" },
        techStack: { type: "string", description: "Preferred tech stack", default: "" },
      },
      required: ["prompt"],
    },
    handler: async (args, userId) => {
      const prompt = String(args.prompt || "")
      const category = String(args.category || "")
      const techStack = String(args.techStack || "")

      const result = generateFallbackProject(prompt, category, techStack)

      // Save to database
      const project = await prisma.project.create({
        data: {
          title: result.title,
          description: result.description,
          prompt,
          techStack: JSON.stringify(result.techStack),
          files: JSON.stringify(result.files),
          structure: JSON.stringify(result.structure),
          userId,
        },
      })

      // Add to vector store for future RAG
      await vectorStore.addProjectDocuments(result.title, result.description, result.techStack, result.files)

      return {
        projectId: project.id,
        title: result.title,
        description: result.description,
        techStack: result.techStack,
        fileCount: result.files.length,
        structure: result.structure,
      }
    },
  },
  {
    name: "search_projects",
    description: "Search through existing projects using semantic vector search",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        limit: { type: "number", description: "Maximum results", default: 5 },
      },
      required: ["query"],
    },
    handler: async (args) => {
      const query = String(args.query || "")
      const limit = Number(args.limit) || 5

      const results = await vectorStore.search(query, limit)
      return {
        results: results.map(r => ({
          text: r.text.slice(0, 200),
          score: r.score,
          metadata: r.metadata,
        })),
        totalResults: results.length,
      }
    },
  },
  {
    name: "get_project",
    description: "Retrieve a project by ID with all its files and metadata",
    inputSchema: {
      type: "object",
      properties: {
        projectId: { type: "string", description: "The project UUID" },
      },
      required: ["projectId"],
    },
    handler: async (args, userId) => {
      const projectId = String(args.projectId || "")
      const project = await prisma.project.findUnique({ where: { id: projectId } })

      if (!project || project.userId !== userId) {
        return { error: "Project not found or access denied" }
      }

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        techStack: JSON.parse(project.techStack),
        structure: JSON.parse(project.structure),
        files: JSON.parse(project.files).slice(0, 50), // Limit output size
        createdAt: project.createdAt,
      }
    },
  },
  {
    name: "analyze_tech_stack",
    description: "Analyze a tech stack and provide recommendations",
    inputSchema: {
      type: "object",
      properties: {
        techStack: { type: "string", description: "Comma-separated tech stack" },
        category: { type: "string", description: "Project category" },
      },
      required: ["techStack"],
    },
    handler: async (args) => {
      const techStack = String(args.techStack || "").split(",").map(t => t.trim()).filter(Boolean)
      const category = String(args.category || "")

      // Search vector store for similar projects
      const similarQuery = techStack.join(" ")
      const similar = await vectorStore.searchByTechStack(similarQuery, 3)

      return {
        analyzed: techStack,
        category: category || "General",
        technologies: techStack.map(t => ({
          name: t,
          type: inferTechType(t),
        })),
        similarProjects: similar.map(s => ({
          title: s.metadata.title,
          score: s.score,
        })),
        recommendations: generateRecommendations(techStack, category),
      }
    },
  },
  {
    name: "validate_project_structure",
    description: "Validate that a project has all required files and correct structure",
    inputSchema: {
      type: "object",
      properties: {
        projectId: { type: "string", description: "The project UUID" },
      },
      required: ["projectId"],
    },
    handler: async (args, userId) => {
      const projectId = String(args.projectId || "")
      const project = await prisma.project.findUnique({ where: { id: projectId } })

      if (!project || project.userId !== userId) {
        return { error: "Project not found or access denied" }
      }

      const files: { path: string; content: string }[] = JSON.parse(project.files)
      const techStack: string[] = JSON.parse(project.techStack)
      const issues: string[] = []

      // Check for required files per tech stack
      const hasPackageJson = files.some(f => f.path.endsWith("package.json"))
      const hasRequirements = files.some(f => f.path.endsWith("requirements.txt"))
      const hasReadme = files.some(f => f.path.endsWith("README.md"))
      const hasDockerfile = files.some(f => f.path.includes("Dockerfile"))
      const hasEnvExample = files.some(f => f.path.endsWith(".env.example"))

      if (!hasReadme) issues.push("Missing README.md")
      if (techStack.some(t => /node|next|react/.test(t)) && !hasPackageJson) issues.push("Missing package.json")
      if (techStack.some(t => /python|fastapi/.test(t)) && !hasRequirements) issues.push("Missing requirements.txt")
      if (!hasEnvExample) issues.push("Missing .env.example")
      if (files.length < 3) issues.push("Very few files generated (under 3)")

      return {
        valid: issues.length === 0,
        totalFiles: files.length,
        techStack,
        issues,
        score: Math.max(0, 100 - issues.length * 20),
      }
    },
  },
]

/* ---------- Helper Functions ---------- */

function inferTechType(tech: string): string {
  const lower = tech.toLowerCase()
  if (/react|vue|angular|svelte|next|nuxt|tailwind|css|html/.test(lower)) return "Frontend"
  if (/node|express|fastapi|flask|django|spring|go|rust/.test(lower)) return "Backend"
  if (/python|pytorch|tensorflow|langchain|openai/.test(lower)) return "AI/ML"
  if (/postgres|mysql|mongo|redis|sqlite/.test(lower)) return "Database"
  if (/docker|kubernetes|k8s|terraform|aws|azure|gcp/.test(lower)) return "Infrastructure"
  if (/flutter|react native|swift|kotlin/.test(lower)) return "Mobile"
  if (/solidity|hardhat|ethereum|solana/.test(lower)) return "Blockchain"
  return "Library/Tool"
}

function generateRecommendations(techStack: string[], category: string): string[] {
  const recs: string[] = []
  const joined = techStack.join(" ").toLowerCase()

  if (joined.includes("python") && !joined.includes("fastapi") && !joined.includes("flask"))
    recs.push("Consider adding FastAPI for a modern async web framework")
  if (joined.includes("react") && !joined.includes("typescript"))
    recs.push("Add TypeScript for type safety and better developer experience")
  if (joined.includes("node") && !joined.includes("docker"))
    recs.push("Add Docker for consistent deployment across environments")
  if (joined.includes("ai") || joined.includes("ml") || joined.includes("langchain")) {
    if (!joined.includes("chromadb") && !joined.includes("pinecone"))
      recs.push("Add a vector database (ChromaDB, Pinecone) for RAG capabilities")
    if (!joined.includes("redis"))
      recs.push("Add Redis for caching and rate limiting in production")
  }
  if ((joined.includes("next") || joined.includes("react")) && !joined.includes("tailwind"))
    recs.push("Add Tailwind CSS for rapid UI development")

  if (recs.length === 0) recs.push("Your tech stack looks well-balanced for this category")

  return recs.slice(0, 4)
}

/* ---------- MCP Request Schema ---------- */

const mcpRequestSchema = z.object({
  method: z.enum(["tools/list", "tools/call", "resources/list", "resources/read"]),
  params: z.record(z.string(), z.unknown()).optional(),
  id: z.string().optional(),
})

/* ---------- POST Handler (MCP Protocol) ---------- */

export async function POST(req: Request) {
  const startTime = Date.now()

  try {
    // Auth check
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Parse request
    const body = await req.json()
    const parsed = mcpRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        error: "Invalid MCP request",
        details: parsed.error.flatten(),
      }, { status: 400 })
    }

    const { method, params, id: requestId } = parsed.data

    switch (method) {
      /* ---- List available tools ---- */
      case "tools/list": {
        return NextResponse.json({
          tools: TOOLS.map(t => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
          })),
          id: requestId,
          _meta: { server: "BlueprintAI MCP", version: "1.0.0" },
        })
      }

      /* ---- Call a tool ---- */
      case "tools/call": {
        const toolName = params?.name as string || ""
        const toolArgs = (params?.arguments as Record<string, unknown>) || {}
        const tool = TOOLS.find(t => t.name === toolName)

        if (!tool) {
          return NextResponse.json({
            error: `Unknown tool: ${toolName}`,
            availableTools: TOOLS.map(t => t.name),
          }, { status: 400 })
        }

        const result = await tool.handler(toolArgs, payload.userId)

        return NextResponse.json({
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2),
          }],
          isError: result && "error" in result,
          id: requestId,
          _meta: { latencyMs: Date.now() - startTime },
        })
      }

      /* ---- List available resources ---- */
      case "resources/list": {
        return NextResponse.json({
          resources: [
            {
              uri: "mcp://blueprintai/projects",
              name: "User Projects",
              description: "List of user's generated projects",
              mimeType: "application/json",
            },
            {
              uri: "mcp://blueprintai/health",
              name: "System Health",
              description: "Current system health and status",
              mimeType: "application/json",
            },
          ],
          id: requestId,
        })
      }

      /* ---- Read a resource ---- */
      case "resources/read": {
        const uri = (params?.uri as string) || ""
        if (uri === "mcp://blueprintai/projects") {
          const projects = await prisma.project.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: "desc" },
            take: 20,
            select: { id: true, title: true, description: true, createdAt: true },
          })
          return NextResponse.json({
            contents: [{
              uri,
              mimeType: "application/json",
              text: JSON.stringify(projects),
            }],
            id: requestId,
          })
        }
        if (uri === "mcp://blueprintai/health") {
          return NextResponse.json({
            contents: [{
              uri,
              mimeType: "application/json",
              text: JSON.stringify({
                status: "healthy",
                uptime: process.uptime(),
                projectsGenerated: await prisma.project.count(),
                version: "1.0.0",
              }),
            }],
            id: requestId,
          })
        }
        return NextResponse.json({ error: `Resource not found: ${uri}` }, { status: 404 })
      }

      default:
        return NextResponse.json({
          error: `Unsupported method: ${method}`,
          supportedMethods: ["tools/list", "tools/call", "resources/list", "resources/read"],
        }, { status: 400 })
    }
  } catch (err) {
    console.error("[MCP] Error:", err)
    return NextResponse.json({
      error: "Internal server error",
      _meta: { latencyMs: Date.now() - startTime },
    }, { status: 500 })
  }
}

/* ---- GET: Tool discovery ---- */

export async function GET() {
  return NextResponse.json({
    name: "BlueprintAI MCP Server",
    version: "1.0.0",
    description: "MCP-compliant server for generating software projects with AI",
    protocols: ["2024-11-05"], // MCP protocol version
    tools: TOOLS.map(t => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
    resources: [
      { uri: "mcp://blueprintai/projects", name: "User Projects" },
      { uri: "mcp://blueprintai/health", name: "System Health" },
    ],
  })
}
