/**
 * Enterprise AI Service Layer
 *
 * Supports multiple LLM providers: OpenAI, Anthropic, Google, Mistral, DeepSeek, Ollama
 * Includes free/open-source model support via Ollama and DeepSeek
 * Provides RAG context enhancement, MCP tool integration, and streaming
 */

import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { mistral } from "@ai-sdk/mistral"
import { createDeepSeek } from "@ai-sdk/deepseek"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

/* ---------- Provider Configuration ---------- */

export type AIProvider = "openai" | "anthropic" | "google" | "mistral" | "deepseek" | "ollama" | "auto"

export interface ModelConfig {
  provider: AIProvider
  modelId: string
  label: string
  tier: "premium" | "standard" | "free" | "open-source"
  maxTokens: number
  supportsStreaming: boolean
}

export const MODELS: Record<string, ModelConfig> = {
  // Premium models
  "gpt-4o": { provider: "openai", modelId: "gpt-4o", label: "GPT-4o", tier: "premium", maxTokens: 16000, supportsStreaming: true },
  "gpt-4o-mini": { provider: "openai", modelId: "gpt-4o-mini", label: "GPT-4o Mini", tier: "standard", maxTokens: 16000, supportsStreaming: true },
  "claude-opus-4": { provider: "anthropic", modelId: "claude-opus-4-20250514", label: "Claude Opus 4", tier: "premium", maxTokens: 16000, supportsStreaming: true },
  "claude-sonnet-4": { provider: "anthropic", modelId: "claude-sonnet-4-20250514", label: "Claude Sonnet 4", tier: "premium", maxTokens: 16000, supportsStreaming: true },
  "claude-haiku-3": { provider: "anthropic", modelId: "claude-3-haiku-20240307", label: "Claude Haiku 3", tier: "standard", maxTokens: 8000, supportsStreaming: true },
  "gemini-2.5-pro": { provider: "google", modelId: "gemini-2.5-pro-preview-03-25", label: "Gemini 2.5 Pro", tier: "premium", maxTokens: 16000, supportsStreaming: true },
  "gemini-2.0-flash": { provider: "google", modelId: "gemini-2.0-flash", label: "Gemini 2.0 Flash", tier: "standard", maxTokens: 16000, supportsStreaming: true },
  "mistral-large": { provider: "mistral", modelId: "mistral-large-latest", label: "Mistral Large", tier: "premium", maxTokens: 16000, supportsStreaming: true },
  "mistral-small": { provider: "mistral", modelId: "mistral-small-latest", label: "Mistral Small", tier: "standard", maxTokens: 8000, supportsStreaming: true },

  // Free / Open-Source models
  "deepseek-r1": { provider: "deepseek", modelId: "deepseek-reasoner", label: "DeepSeek-R1", tier: "free", maxTokens: 16000, supportsStreaming: true },
  "deepseek-v3": { provider: "deepseek", modelId: "deepseek-chat", label: "DeepSeek-V3", tier: "free", maxTokens: 16000, supportsStreaming: true },
  "llama-4": { provider: "ollama", modelId: "llama4", label: "Llama 4 (Ollama)", tier: "open-source", maxTokens: 8000, supportsStreaming: true },
  "mistral-open-source": { provider: "ollama", modelId: "mistral", label: "Mistral (Ollama)", tier: "open-source", maxTokens: 8000, supportsStreaming: true },
  "qwen-2.5": { provider: "ollama", modelId: "qwen2.5", label: "Qwen 2.5 (Ollama)", tier: "open-source", maxTokens: 8000, supportsStreaming: true },
}

/* ---------- Provider Model Mapping ---------- */

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY || "",
})

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
  apiKey: "ollama",
})

function getModelInstance(modelKey: string) {
  const config = MODELS[modelKey]
  if (!config) return openai("gpt-4o-mini")

  switch (config.provider) {
    case "openai":
      return openai(config.modelId)
    case "anthropic":
      return anthropic(config.modelId)
    case "google":
      return google(config.modelId)
    case "mistral":
      return mistral(config.modelId)
    case "deepseek":
      return deepseek(config.modelId)
    case "ollama":
      return ollama(config.modelId)
    default:
      return openai("gpt-4o-mini")
  }
}

/* ---------- Language Detection ---------- */

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", zh: "Chinese", es: "Spanish", ar: "Arabic", hi: "Hindi",
  pt: "Portuguese", bn: "Bengali", ru: "Russian", ja: "Japanese", pa: "Punjabi",
  de: "German", jv: "Javanese", ko: "Korean", vi: "Vietnamese", fr: "French",
  tr: "Turkish", ta: "Tamil", te: "Telugu", mr: "Marathi", ur: "Urdu",
  it: "Italian", th: "Thai", nl: "Dutch", pl: "Polish", uk: "Ukrainian",
  ms: "Malay", ro: "Romanian", hu: "Hungarian", el: "Greek", cs: "Czech",
  sv: "Swedish", da: "Danish", fi: "Finnish", sk: "Slovak", hr: "Croatian",
  id: "Indonesian", fil: "Filipino", he: "Hebrew", fa: "Persian", sw: "Swahili",
}

export function detectLanguage(text: string): { code: string; name: string } {
  // Use Unicode block detection for common scripts
  const scripts: Record<string, RegExp> = {
    zh: /[\u4e00-\u9fff\u3400-\u4dbf]/,
    ja: /[\u3040-\u309f\u30a0-\u30ff]/,
    ko: /[\uac00-\ud7af\u1100-\u11ff]/,
    ar: /[\u0600-\u06ff]/,
    he: /[\u0590-\u05ff]/,
    hi: /[\u0900-\u097f]/,
    bn: /[\u0980-\u09ff]/,
    pa: /[\u0a00-\u0a7f]/,
    ta: /[\u0b80-\u0bff]/,
    te: /[\u0c00-\u0c7f]/,
    mr: /[\u0900-\u097f]/,
    th: /[\u0e00-\u0e7f]/,
    ru: /[\u0400-\u04ff]/,
    el: /[\u0370-\u03ff]/,
  }

  for (const [code, regex] of Object.entries(scripts)) {
    const matches = text.match(regex)
    if (matches && matches.length > text.length * 0.1) {
      return { code, name: LANGUAGE_NAMES[code] || code }
    }
  }

  return { code: "en", name: "English" }
}

/* ---------- RAG Context Enhancement ---------- */

const PROJECT_TEMPLATES = [
  { category: "Mobile Apps", template: "Flutter/Dart or React Native/TypeScript project with pubspec.yaml/package.json, navigation, state management, API service layer, multiple UI screens, dark/light mode support, Firebase or Supabase backend, push notifications, offline support" },
  { category: "Web Apps", template: "Next.js/React/TypeScript project with app router, Tailwind CSS, server components, API routes, Prisma ORM, PostgreSQL database, authentication, responsive design, dark mode, Docker configuration" },
  { category: "AI Agents", template: "Python project with LangChain/LangGraph framework, OpenAI/Anthropic integration, Pinecone/ChromaDB vector store, FastAPI server, tool functions with MCP protocol, agent memory, streaming responses, Docker deployment" },
  { category: "Agentic AI", template: "Python project with CrewAI/AutoGen multi-agent orchestration, supervisor/sub-agent pattern, LangGraph state graphs, MCP tool integration, Weaviate/Qdrant vector DB, Temporal workflow engine, error recovery, audit logging" },
  { category: "RAG Pipelines", template: "Python project with LangChain/LlamaIndex, hybrid search (semantic + keyword), ChromaDB/Pinecone/Milvus vector store, Cohere/OpenAI embeddings, reranking, document chunking, streaming responses, FastAPI/Streamlit UI" },
  { category: "Quantum AI", template: "Python project with Qiskit/Pennylane/Cirq, variational quantum circuits, hybrid classical-quantum ML, VQE/QAOA algorithms, quantum kernel methods, AWS Braket/IBM Quantum integration, visualization with matplotlib" },
  { category: "AI Robotics", template: "Python/C++ project with ROS 2, OpenCV, PyTorch, YOLO object detection, SLAM navigation, MoveIt manipulation, Gazebo simulation, NVIDIA Jetson deployment, MQTT communication, real-time control" },
  { category: "AIoT", template: "C++/Python project with ESP32/Arduino firmware, Edge Impulse/TensorFlow Lite ML, MQTT/LoRaWAN protocols, sensor fusion, InfluxDB/TimescaleDB time-series data, AWS IoT/Greengrass cloud, Grafana dashboard" },
  { category: "AI + Biotechnology", template: "Python project with RDKit, DeepChem, PyTorch, molecular generation (GAN/VAE), ADMET prediction, virtual screening, AlphaFold/ESM-2 integration, protein-ligand docking, Streamlit visualization" },
  { category: "AI + Neural Science", template: "Python project with MNE-Python, PyTorch, FreeSurfer, EEG/ECoG signal processing, CNN/LSTM neural decoders, brain-computer interface, connectomics, optogenetics control, real-time visualization" },
  { category: "Data Engineering", template: "Python project with Apache Spark, Kafka/Flink streaming, Airflow/dbt orchestration, PostgreSQL/BigQuery/Snowflake data warehouse, Delta Lake, dbt transformations, MLflow experiment tracking, Docker/Kubernetes" },
  { category: "Blockchain / Web3", template: "Solidity/Rust smart contracts, Hardhat/Foundry framework, Ethers.js/Wagmi frontend, React/Next.js dApp, MetaMask/WalletConnect, The Graph indexing, IPFS storage, Chainlink oracles, OpenZeppelin security" },
  { category: "Game Development", template: "Unity C#/Unreal C++ project, Blender 3D assets, procedural generation, AI NPC behavior, multiplayer networking (Photon/Steam), WebGL build, mobile touch input, analytics, monetization (IAP/ads)" },
]

export function enhancePromptWithRAG(prompt: string, category?: string): string {
  const lower = prompt.toLowerCase()

  // Find matching templates
  const matches = PROJECT_TEMPLATES.filter(t => {
    if (category && t.category === category) return true
    return t.template.split(", ").some(kw => lower.includes(kw.toLowerCase().slice(0, 8)))
  })

  if (matches.length === 0) return prompt

  const ragContext = matches.map(m => `[${m.category} Template]: ${m.template}`).join("\n")
  return `${prompt}\n\n--- RELEVANT ARCHITECTURE TEMPLATES ---\n${ragContext}\n---`
}

/* ---------- MCP Tool Integration ---------- */

export interface MCPTool {
  name: string
  description: string
  parameters: Record<string, unknown>
  execute?: (args: Record<string, unknown>) => Promise<string>
}

export const MCP_TOOLS: Record<string, MCPTool> = {
  search_projects: {
    name: "search_projects",
    description: "Search existing project templates for reference",
    parameters: { query: { type: "string" } },
  },
  generate_structure: {
    name: "generate_structure",
    description: "Generate project file structure",
    parameters: { techStack: { type: "string" }, description: { type: "string" } },
  },
  validate_code: {
    name: "validate_code",
    description: "Validate generated code for syntax errors",
    parameters: { code: { type: "string" }, language: { type: "string" } },
  },
}

/* ---------- Tier-Based Model Selection ---------- */

export function selectModelsForTier(tier: string): string[] {
  switch (tier) {
    case "premium":
      return ["gpt-4o", "claude-sonnet-4", "gemini-2.5-pro", "mistral-large"]
    case "standard":
      return ["gpt-4o-mini", "claude-haiku-3", "gemini-2.0-flash", "mistral-small"]
    case "open-source":
      return ["llama-4", "mistral-open-source", "qwen-2.5"]
    case "free":
      return ["deepseek-r1", "deepseek-v3", "llama-4", "mistral-open-source"]
    case "mixed":
      return ["gpt-4o-mini", "deepseek-v3", "claude-haiku-3"]
    default:
      return ["gpt-4o-mini"]
  }
}

/* ---------- Core Generation Functions ---------- */

export async function generateProjectText(
  systemPrompt: string,
  userPrompt: string,
  modelKey: string = "gpt-4o-mini",
  options?: { temperature?: number; maxTokens?: number }
) {
  const model = getModelInstance(modelKey)
  const config = MODELS[modelKey]

  const { text } = await generateText({
    model,
    system: systemPrompt,
    prompt: userPrompt,
    temperature: options?.temperature ?? 0.7,
    maxOutputTokens: options?.maxTokens ?? config?.maxTokens ?? 8000,
  })

  return text
}

export async function* streamProjectText(
  systemPrompt: string,
  userPrompt: string,
  modelKey: string = "gpt-4o-mini",
  options?: { temperature?: number; maxTokens?: number }
): AsyncGenerator<string> {
  const model = getModelInstance(modelKey)
  const config = MODELS[modelKey]

  const { textStream } = await streamText({
    model,
    system: systemPrompt,
    prompt: userPrompt,
    temperature: options?.temperature ?? 0.7,
    maxOutputTokens: options?.maxTokens ?? config?.maxTokens ?? 8000,
  })

  for await (const chunk of textStream) {
    yield chunk
  }
}
