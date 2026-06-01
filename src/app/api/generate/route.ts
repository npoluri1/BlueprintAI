import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { generateFallbackProject } from "@/lib/generate-fallback"

const schema = z.object({
  prompt: z.string().min(3).max(5000),
  category: z.string().optional(),
  techStack: z.string().optional(),
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

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Please describe what you want to build" }, { status: 400 })
    }

    const { prompt, category, techStack } = parsed.data

    const categoryGuide = category && CATEGORY_PROMPTS[category]
      ? `\n\nCATEGORY GUIDELINES:\n${CATEGORY_PROMPTS[category]}`
      : ""

    const stackGuide = techStack && techStack !== "auto"
      ? `\n\nTECH STACK REQUIREMENT:\nUse EXACTLY this tech stack: ${techStack}. Every file must align with these technologies. Include all config files needed (package.json, requirements.txt, etc.).`
      : "\n\nTECH STACK:\nChoose the best modern tech stack for the user's requirements. Include all config files needed."

    const systemPrompt = `You are an expert software architect and full-stack developer. Your #1 priority: generate projects that are IMMEDIATELY RUNNABLE after installing dependencies.

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

Make the code production-ready, complete, and functional. Include all necessary config files (package.json, requirements.txt, etc.). CRITICAL: The project MUST be runnable immediately after installing dependencies.`

    let projectData
    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.7,
        maxOutputTokens: 8000,
      })
      const cleaned = text.replace(/```json/i, "").replace(/```/g, "").trim()
      projectData = JSON.parse(cleaned)
    } catch {
      projectData = generateFallbackProject(prompt, category, techStack)
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
    })
  } catch (err) {
    console.error("Generate error:", err)
    return NextResponse.json({ error: "Generation failed. Check your API key or try again." }, { status: 500 })
  }
}
