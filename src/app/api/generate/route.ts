import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { z } from "zod"
import { generateFallbackProject } from "@/lib/generate-fallback"
import {
  generateProjectText,
  streamProjectText,
  detectLanguage,
  enhancePromptWithRAG,
  selectModelsForTier,
  MODELS,
} from "@/lib/ai-service"
import { checkRateLimit, getUserTier, getRateLimitHeaders } from "@/lib/rate-limit"
import { vectorStore } from "@/lib/vector-store"

const schema = z.object({
  prompt: z.string().min(3).max(5000),
  category: z.string().optional(),
  techStack: z.string().optional(),
  modelTier: z.string().optional(),
  stream: z.boolean().optional(),
})

const CATEGORY_PROMPTS: Record<string, string> = {
  "Mobile Apps": "Focus on Flutter (Dart) or React Native (TypeScript) with a complete, RUNNABLE mobile app project. CRITICAL: Include ALL of these: (1) pubspec.yaml or package.json with EVERY dependency listed and exact versions, (2) Complete App entry point that renders a working UI, (3) Navigation/routing setup, (4) State management, (5) API service layer with mock data so the app works offline, (6) Multiple full UI screens with proper styling, (7) A DETAILED README.md with step-by-step setup: 'flutter pub get' or 'npm install', how to run on emulator/device, environment variables needed. The app MUST compile and display a working UI immediately after installing dependencies.",
  "Web Apps": "Focus on a modern web application with Next.js, React, Python/FastAPI, or similar. CRITICAL: Make this a COMPLETE, RUNNABLE project. Include ALL of these: (1) package.json or requirements.txt with EVERY dependency listed with exact versions, (2) tsconfig.json / next.config.js or equivalent config, (3) Working routing setup, (4) API layer with mock data so it runs offline, (5) Database schema if applicable, (6) Styled UI components using Tailwind CSS with at least 3 working pages, (7) A DETAILED README.md with: 'npm install' / 'pip install', 'npm run dev' / 'uvicorn main:app', environment variables, project structure explanation. The app MUST start and display a working UI immediately after installing dependencies.",
  "Realtime AI Applications": "Focus on a real-time AI application with streaming, WebSockets, or live inference. CRITICAL: Make this a COMPLETE, RUNNABLE project. Include ALL of these: (1) package.json or requirements.txt with EVERY dependency listed with exact versions, (2) Working WebSocket/SSE setup for real-time communication, (3) AI/ML model integration with proper inference pipeline, (4) Frontend UI that displays real-time data with proper loading states, (5) Mock/fallback data mode so it works without an API key, (6) Docker compose or config for easy setup, (7) A DETAILED README.md with step-by-step setup instructions, how to run in development, environment variables including API keys. The app MUST work immediately after setup with mock/fallback data.",
  "AI Agents": "Focus on an AI agent system using LangChain, CrewAI, AutoGen, or LangGraph. Include agent definitions, tool functions, memory/vector store setup, prompt templates, and a run loop. Include a Python project with requirements.txt and a README.md with setup instructions.",
  "Agentic AI": "Focus on a multi-agent orchestration system with supervisor/sub-agent patterns using CrewAI, LangGraph, or AutoGen. Include agent definitions, task delegation logic, tool-use planning, and error recovery loops. Python project with requirements.txt and README.md.",
  AGI: "Focus on an advanced AI reasoning system with meta-cognition, self-reflection, or neuro-symbolic components using PyTorch or JAX. Include model architecture, training loop, reasoning pipeline, and evaluation metrics.",
  "Quantum AI": "Focus on a hybrid quantum-classical ML project using Qiskit, Pennylane, or Cirq. Include quantum circuit definitions, classical ML integration, optimizer setup, and result visualization.",
  "AI Robotics": "Focus on a robotics project using ROS 2, OpenCV, or PyTorch. Include perception stack, control logic, sensor integration, and deployment config for edge devices like NVIDIA Jetson.",
  "AI Semiconductors": "Focus on an ML-driven chip design or EDA tool using GNNs, reinforcement learning, or neuromorphic computing. Include model architecture, training pipeline, and integration with EDA tooling.",
  AIoT: "Focus on an AI + IoT system with edge ML inference, MQTT/LoRaWAN protocols, sensor fusion, and cloud dashboard. Include embedded firmware, edge processing, and cloud backend.",
  "AI + Biotechnology": "Focus on a bioinformatics or drug discovery project using RDKit, DeepChem, PyTorch, or similar. Include molecular processing, model training, prediction pipeline, and result analysis.",
  "AI + Neural Science": "Focus on a neuroscience AI project using MNE-Python, PyTorch, FreeSurfer, or similar. Include signal processing, model architecture for neural data, and analysis visualization.",
}

function buildSystemPrompt(category?: string, techStack?: string): string {
  const categoryGuide =
    category && CATEGORY_PROMPTS[category]
      ? `\n\nCATEGORY GUIDELINES:\n${CATEGORY_PROMPTS[category]}`
      : ""

  const stackGuide =
    techStack && techStack !== "auto"
      ? `\n\nTECH STACK REQUIREMENT:\nUse EXACTLY this tech stack: ${techStack}. Every file must align with these technologies. Include all config files needed (package.json, requirements.txt, etc.).`
      : "\n\nTECH STACK:\nChoose the best modern tech stack for the user's requirements. Include all config files needed."

  return `You are an enterprise-grade AI software architect. Generate projects that are IMMEDIATELY RUNNABLE after installing dependencies.

Based on the user's description, generate a complete project plan including:
1. Project title and description
2. Tech stack (languages, frameworks, databases, APIs)
3. Folder/file structure as a JSON array of paths
4. For each file, provide the complete source code${categoryGuide}${stackGuide}

RUNNABILITY RULES (MUST FOLLOW):
- Every config file (package.json, requirements.txt, tsconfig, etc.) must have ALL dependencies listed with exact versions
- Every project MUST include a DETAILED README.md with: setup steps, install commands, run commands, environment variables, project structure explanation
- Code must compile/parse correctly — no syntax errors, no placeholder "// TODO" functions, no missing imports
- Include mock/sample data so the app shows a working UI without external services
- Frontend apps must render a styled, working UI immediately on startup
- Include Dockerfile or docker-compose.yml where applicable for easy setup

Output ONLY valid JSON with this exact structure:
{
  "title": "Project Title",
  "description": "Short project description",
  "techStack": ["Tech1", "Tech2", ...],
  "structure": ["/project-root/file1.ts", "/project-root/file2.tsx", ...],
  "files": [
    { "path": "/project-root/file1.ts", "content": "// complete source code" },
    { "path": "/project-root/file2.tsx", "content": "// complete source code" }
  ]
}

Make the code production-ready, complete, and functional. Include all necessary config files. CRITICAL: The project MUST be runnable immediately after installing dependencies.`
}

/* ---------- Streaming SSE Endpoint ---------- */

export async function POST(req: Request) {
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

    // Fetch user role for rate limiting
    const userRecord = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true },
    })

    // Rate limiting
    const rateKey = `generate:${payload.userId}`
    const rateLimit = checkRateLimit(rateKey, getUserTier(userRecord?.role))
    const rateHeaders = getRateLimitHeaders(rateLimit)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before generating another project.", retryAfter: rateLimit.resetMs / 1000 },
        { status: 429, headers: rateHeaders }
      )
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Please describe what you want to build" }, { status: 400 })
    }

    const { prompt, category, techStack, modelTier, stream } = parsed.data

    // Multi-language detection - detect input language
    const lang = detectLanguage(prompt)
    const langInstruction =
      lang.code !== "en"
        ? `\n\nThe user's request was written in ${lang.name}. Understand and respond in English, but acknowledge their language in the project description.`
        : ""

    // RAG enhancement - enrich prompt with relevant project templates
    const enhancedPrompt = enhancePromptWithRAG(prompt, category)

    // Model selection based on tier
    const tier = modelTier || "standard"
    const models = selectModelsForTier(tier)
    const primaryModel = models[0] || "gpt-4o-mini"
    const systemPrompt = buildSystemPrompt(category, techStack) + langInstruction

    // --- Streaming Mode (SSE) ---
    if (stream) {
      const encoder = new TextEncoder()
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            // Send model info
            const modelInfo = MODELS[primaryModel]
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "model", model: modelInfo?.label || primaryModel, tier })}\n\n`
              )
            )

            // Try primary model first, fall back through models
            let result = ""
            let usedModel = primaryModel

            try {
              for await (const chunk of streamProjectText(systemPrompt, enhancedPrompt, primaryModel)) {
                result += chunk
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`))
              }
            } catch {
              // Fallback to next available model
              for (const fallbackModel of models.slice(1)) {
                try {
                  for await (const chunk of streamProjectText(systemPrompt, enhancedPrompt, fallbackModel)) {
                    result += chunk
                    usedModel = fallbackModel
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`))
                  }
                  break
                } catch {
                  continue
                }
              }
            }

            if (!result) throw new Error("All models failed")

            // Parse the result
            let projectData
            try {
              const cleaned = result.replace(/```json/i, "").replace(/```/g, "").trim()
              projectData = JSON.parse(cleaned)
            } catch {
              projectData = generateFallbackProject(prompt, category, techStack)
            }

            // Save to database
            const project = await prisma.project.create({
              data: {
                title: projectData.title || "Untitled Project",
                description: projectData.description || "",
                prompt: prompt,
                techStack: JSON.stringify(projectData.techStack || []),
                files: JSON.stringify(projectData.files || []),
                structure: JSON.stringify(projectData.structure || []),
                userId: payload.userId,
              },
            })

            // Add to vector store for RAG
            vectorStore.addProjectDocuments(
              projectData.title || "Untitled",
              projectData.description || "",
              projectData.techStack || [],
              projectData.files || [],
            ).catch((err) => console.warn("[VectorStore] Failed to index project:", err))

            // Send complete event
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "complete",
                  project: {
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    techStack: projectData.techStack || [],
                    structure: projectData.structure || [],
                    files: projectData.files || [],
                    createdAt: project.createdAt,
                  },
                  model: usedModel,
                })}\n\n`
              )
            )
          } catch (err) {
            const fallback = generateFallbackProject(prompt, category, techStack)
            // Save fallback
            const project = await prisma.project.create({
              data: {
                title: fallback.title || "Untitled",
                description: fallback.description || "",
                prompt: prompt,
                techStack: JSON.stringify(fallback.techStack || []),
                files: JSON.stringify(fallback.files || []),
                structure: JSON.stringify(fallback.structure || []),
                userId: payload.userId,
              },
            })
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "complete",
                  project: { id: project.id, ...fallback, createdAt: project.createdAt },
                  model: "fallback",
                })}\n\n`
              )
            )
          } finally {
            controller.close()
          }
        },
      })

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      })
    }

    // --- Non-Streaming Mode ---
    let projectData
    try {
      const text = await generateProjectText(systemPrompt, enhancedPrompt, primaryModel)
      const cleaned = text.replace(/```json/i, "").replace(/```/g, "").trim()
      projectData = JSON.parse(cleaned)
    } catch {
      // Fallback through models
      let text = ""
      for (const fallbackModel of models.slice(0, 3)) {
        try {
          text = await generateProjectText(systemPrompt, enhancedPrompt, fallbackModel)
          break
        } catch {
          continue
        }
      }
      if (text) {
        const cleaned = text.replace(/```json/i, "").replace(/```/g, "").trim()
        projectData = JSON.parse(cleaned)
      } else {
        projectData = generateFallbackProject(prompt, category, techStack)
      }
    }

    const project = await prisma.project.create({
      data: {
        title: projectData.title || "Untitled Project",
        description: projectData.description || "",
        prompt: prompt,
        techStack: JSON.stringify(projectData.techStack || []),
        files: JSON.stringify(projectData.files || []),
        structure: JSON.stringify(projectData.structure || []),
        userId: payload.userId,
      },
    })

    return NextResponse.json({
      id: project.id,
      title: project.title,
      description: project.description,
      techStack: projectData.techStack || [],
      structure: projectData.structure || [],
      files: projectData.files || [],
      createdAt: project.createdAt,
      model: primaryModel,
    })
  } catch (err) {
    console.error("Generate error:", err)
    return NextResponse.json(
      { error: "Generation failed. Please try again or contact support." },
      { status: 500 }
    )
  }
}
