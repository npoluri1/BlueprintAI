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
  "Mobile Apps": "Focus on Flutter (Dart) or React Native (TypeScript) with a complete mobile app project. Include app.json or pubspec.yaml, navigation setup, state management, API service layer, and platform-specific configs. Generate full UI screens with proper styling.",
  "Web Apps": "Focus on a modern web application with Next.js, React, Python/FastAPI, or similar. Include package.json, tsconfig, proper routing, API layer, database schema, and styled UI components using Tailwind CSS.",
  "AI Agents": "Focus on an AI agent system using LangChain, CrewAI, AutoGen, or LangGraph. Include agent definitions, tool functions, memory/vector store setup, prompt templates, and a run loop. Include a Python project with requirements.txt.",
  "Agentic AI": "Focus on a multi-agent orchestration system with supervisor/sub-agent patterns using CrewAI, LangGraph, or AutoGen. Include agent definitions, task delegation logic, tool-use planning, and error recovery loops. Python project with requirements.txt.",
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

    const systemPrompt = `You are an expert software architect and full-stack developer. 
Based on the user's description, generate a complete project plan including:
1. Project title and description
2. Tech stack (languages, frameworks, databases, APIs)
3. Folder/file structure as a JSON array of paths
4. For each file, provide the complete source code${categoryGuide}${stackGuide}

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

Make the code production-ready, complete, and functional. Include all necessary config files (package.json, requirements.txt, etc.).`

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
