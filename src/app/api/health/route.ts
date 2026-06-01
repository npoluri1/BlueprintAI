import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const startTime = Date.now()
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const uptimeSeconds = Math.floor((Date.now() - (globalThis.__BUILD_TIME__ ?? Date.now())) / 1000) || 0

  let dbStatus = "healthy"
  let dbLatency = 0
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    dbLatency = Date.now() - dbStart
  } catch {
    dbStatus = "unhealthy"
  }

  const responseTime = Date.now() - startTime

  return NextResponse.json({
    status: dbStatus === "healthy" ? "ok" : "degraded",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    uptime: uptimeSeconds,
    uptimeHuman: formatUptime(uptimeSeconds),
    timestamp: new Date().toISOString(),
    services: {
      database: { status: dbStatus, latencyMs: dbLatency },
      api: { status: "healthy", latencyMs: responseTime },
    },
    environment: process.env.NODE_ENV || "development",
    country: "Singapore",
    timezone: "Asia/Singapore (GMT+8)",
    regions: [
      "Singapore", "United States", "United Kingdom", "Germany",
      "Japan", "Australia", "India", "Brazil", "UAE", "South Africa",
    ],
    supportedLanguages: [
      "English", "Chinese", "Spanish", "Arabic", "Hindi", "Portuguese",
      "Bengali", "Russian", "Japanese", "German", "Korean", "French",
      "Turkish", "Tamil", "Telugu", "Italian", "Thai", "Dutch",
      "Polish", "Ukrainian", "Malay", "Romanian", "Greek", "Hebrew",
      "Swahili", "Filipino", "Vietnamese", "Indonesian",
    ],
    aiModels: {
      premium: ["GPT-4o", "Claude Sonnet 4", "Gemini 2.5 Pro", "Mistral Large"],
      standard: ["GPT-4o Mini", "Claude Haiku 3", "Gemini 2.0 Flash", "Mistral Small"],
      free: ["DeepSeek-R1", "DeepSeek-V3"],
      "open-source": ["Llama 4", "Mistral", "Qwen 2.5 (via Ollama)"],
    },
  })
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (mins > 0) parts.push(`${mins}m`)
  parts.push(`${secs}s`)
  return parts.join(" ")
}

// Track build time for uptime calculation
globalThis.__BUILD_TIME__ = Date.now()

declare global {
  // eslint-disable-next-line no-var
  var __BUILD_TIME__: number | undefined
}
