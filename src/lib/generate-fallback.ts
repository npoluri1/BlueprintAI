interface ProjectTemplate {
  title: string
  description: string
  techStack: string[]
  keywords: string[]
  industry: string
  category: string
}

const PROJECTS: ProjectTemplate[] = [
  {
    title: "AI Customer Support Chatbot",
    description: "A LangChain-powered customer support agent with RAG pipeline, vector store integration, and context-aware conversation handling.",
    techStack: ["FastAPI", "Python", "LangChain", "OpenAI", "ChromaDB"],
    keywords: ["chatbot", "support", "customer", "langchain", "agent", "rag", "qa"],
    industry: "ai-ml", category: "AI Agents",
  },
  {
    title: "E-Commerce Analytics Dashboard",
    description: "A React-based e-commerce dashboard with real-time sales data, inventory tracking, and AI-powered sales forecasting.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
    keywords: ["ecommerce", "dashboard", "analytics", "sales", "shop", "store", "nextjs"],
    industry: "web", category: "Web Apps",
  },
  {
    title: "Flutter Social Media App",
    description: "A cross-platform social media app with real-time messaging, post feeds, stories, and AI-powered content recommendations.",
    techStack: ["Flutter", "Firebase", "TensorFlow Lite", "Node.js", "MongoDB"],
    keywords: ["social", "flutter", "mobile", "chat", "messaging", "feed", "stories"],
    industry: "mobile", category: "Mobile Apps",
  },
  {
    title: "Multi-Agent Orchestrator",
    description: "A CrewAI-based multi-agent system with supervisor agent delegating to specialist sub-agents for complex business workflows.",
    techStack: ["CrewAI", "LangGraph", "GPT-4o", "Python", "FastAPI"],
    keywords: ["multi-agent", "orchestrator", "crewai", "supervisor", "workflow", "agentic"],
    industry: "ai-ml", category: "Agentic AI",
  },
  {
    title: "Hybrid Quantum ML Platform",
    description: "A Qiskit-based hybrid quantum-classical machine learning platform for solving optimization problems with quantum annealing.",
    techStack: ["Python", "Qiskit", "Pennylane", "scikit-learn", "FastAPI"],
    keywords: ["quantum", "qiskit", "optimization", "hybrid", "vqe", "qaoa"],
    industry: "quantum", category: "Quantum AI",
  },
  {
    title: "ROS 2 Robot Perception Stack",
    description: "A complete ROS 2 perception stack with YOLO object detection, SLAM navigation, and adaptive grasping control.",
    techStack: ["ROS 2", "OpenCV", "PyTorch", "C++", "NVIDIA Jetson"],
    keywords: ["ros", "robot", "perception", "slam", "computer vision", "yolo", "navigation"],
    industry: "robotics", category: "AI Robotics",
  },
  {
    title: "React Native Fitness Tracker",
    description: "A cross-platform fitness tracking app with workout plans, progress tracking, and AI-powered personalized training recommendations.",
    techStack: ["React Native", "TypeScript", "Node.js", "MongoDB", "Firebase"],
    keywords: ["fitness", "workout", "health", "tracking", "exercise", "training"],
    industry: "mobile", category: "Mobile Apps",
  },
  {
    title: "Kubernetes Microservice Platform",
    description: "A cloud-native microservices platform with Kubernetes orchestration, service mesh, observability, and CI/CD pipeline.",
    techStack: ["Kubernetes", "Docker", "Go", "PostgreSQL", "Prometheus"],
    keywords: ["kubernetes", "docker", "microservice", "devops", "cloud", "deployment", "ci/cd"],
    industry: "devops", category: "Data Engineering",
  },
  {
    title: "Solidity DeFi Protocol",
    description: "A decentralized finance protocol with ERC-20 token, liquidity pool, yield farming, and governance mechanisms.",
    techStack: ["Solidity", "Hardhat", "Ethers.js", "Next.js", "TypeScript"],
    keywords: ["blockchain", "defi", "solidity", "ethereum", "smart contract", "token", "web3"],
    industry: "blockchain", category: "Blockchain / Web3",
  },
  {
    title: "Unity 3D Platformer Game",
    description: "A complete 3D platformer game with physics-based movement, enemy AI, collectible items, and level progression system.",
    techStack: ["Unity", "C#", "Blender", "Shader Graph", "Post Processing"],
    keywords: ["game", "unity", "3d", "platformer", "gaming"],
    industry: "gaming", category: "Game Development",
  },
  {
    title: "Apache Spark ETL Pipeline",
    description: "A scalable ETL pipeline using Apache Spark for data ingestion, transformation, and loading into a data warehouse.",
    techStack: ["Apache Spark", "Python", "PostgreSQL", "Airflow", "dbt"],
    keywords: ["data", "etl", "spark", "pipeline", "analytics", "warehouse", "big data"],
    industry: "data", category: "Data Engineering",
  },
  {
    title: "Next.js SaaS Admin Panel",
    description: "A full-featured SaaS admin panel with user management, role-based access, billing, and real-time analytics.",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    keywords: ["saas", "admin", "dashboard", "management", "enterprise", "panel"],
    industry: "web", category: "Web Apps",
  },
  {
    title: "Unity AR Furniture App",
    description: "An augmented reality furniture placement app using Unity AR Foundation with real-time plane detection and object scaling.",
    techStack: ["Unity", "AR Foundation", "C#", "ARKit", "ARCore"],
    keywords: ["ar", "augmented reality", "unity", "furniture", "placement", "3d"],
    industry: "arvr", category: "AR / VR",
  },
  {
    title: "ESP32 IoT Sensor Network",
    description: "An ESP32-based IoT sensor network with MQTT communication, data logging to InfluxDB, and Node-RED dashboard.",
    techStack: ["ESP32", "C++", "MQTT", "InfluxDB", "Node-RED"],
    keywords: ["esp32", "sensor", "mqtt", "embedded", "firmware", "microcontroller"],
    industry: "iot", category: "AIoT",
  },
  {
    title: "Real-Time AI Chat Application",
    description: "A real-time AI chat application with WebSocket streaming, live inference, and responsive Web UI for instant AI responses.",
    techStack: ["Node.js", "Socket.IO", "Next.js", "Python", "FastAPI"],
    keywords: ["realtime", "websocket", "streaming", "ai", "chat", "live inference"],
    industry: "web", category: "Realtime AI Applications",
  },
  {
    title: "Drug Discovery ML Pipeline",
    description: "A deep learning pipeline for drug discovery with molecular generation, ADMET property prediction, and virtual screening.",
    techStack: ["RDKit", "DeepChem", "PyTorch", "AlphaFold", "Python"],
    keywords: ["drug", "molecule", "chemistry", "discovery", "pharma", "screening", "protein"],
    industry: "healthtech", category: "AI + Biotechnology",
  },
  {
    title: "CRISPR Guide RNA Designer",
    description: "An AI-powered CRISPR guide RNA design tool with off-target prediction, knockout efficiency scoring, and multiplex editing optimization.",
    techStack: ["DeepCRISPR", "PyTorch", "RDKit", "FastAPI", "Python"],
    keywords: ["crispr", "gene", "genome", "biology", "rna", "biotech", "dna"],
    industry: "healthtech", category: "AI + Biotechnology",
  },
  {
    title: "EEG Brain-Computer Interface",
    description: "A deep learning platform for EEG/ECoG signal decoding with real-time brain activity classification and cognitive state monitoring.",
    techStack: ["MNE-Python", "PyTorch", "TensorFlow", "FastAPI", "Python"],
    keywords: ["eeg", "brain", "neural", "bci", "signal", "neuroscience", "cognitive"],
    industry: "healthtech", category: "AI + Neural Science",
  },
  {
    title: "AIoT Smart Factory Platform",
    description: "An end-to-end AIoT platform for smart manufacturing with predictive maintenance, quality inspection, and production optimization.",
    techStack: ["Edge Impulse", "TensorFlow Lite", "MQTT", "InfluxDB", "AWS IoT"],
    keywords: ["iot", "factory", "manufacturing", "edge", "sensor", "predictive", "maintenance"],
    industry: "iot", category: "AIoT",
  },
  {
    title: "GNN Chip Placement Optimizer",
    description: "An ML-driven semiconductor design tool using graph neural networks for optimal transistor placement and routing.",
    techStack: ["PyTorch", "GNN", "Reinforcement Learning", "EDA Tools", "Python"],
    keywords: ["chip", "semiconductor", "placement", "eda", "vlsi", "routing", "gnn"],
    industry: "semiconductor", category: "AI Semiconductors",
  },
  {
    title: "AGI Meta-Cognition Engine",
    description: "An advanced reasoning system with meta-cognition, self-reflection, episodic memory, and chain-of-thought planning capabilities.",
    techStack: ["PyTorch", "DeepSpeed", "vLLM", "Neo4j", "Python"],
    keywords: ["agi", "reasoning", "meta-cognition", "memory", "self-reflection", "consciousness"],
    industry: "ai-ml", category: "AGI",
  },
  {
    title: "Real-Time Stock Trading Dashboard",
    description: "A real-time stock trading dashboard with live price updates, portfolio tracking, and AI-powered market insights.",
    techStack: ["Next.js", "TypeScript", "Node.js", "Socket.IO", "PostgreSQL"],
    keywords: ["trading", "stocks", "finance", "realtime", "dashboard", "market"],
    industry: "fintech", category: "Web Apps",
  },
  {
    title: "Flutter Health Tracker",
    description: "A Flutter-based health tracking app with wearable device integration, workout plans, and AI health insights.",
    techStack: ["Flutter", "Dart", "Firebase", "Supabase", "Dart"],
    keywords: ["health", "tracker", "fitness", "wearable", "flutter", "mobile"],
    industry: "mobile", category: "Mobile Apps",
  },
  {
    title: "FastAPI Microservice Gateway",
    description: "A FastAPI-based microservice gateway with rate limiting, authentication, API versioning, and observability.",
    techStack: ["FastAPI", "Python", "PostgreSQL", "Docker", "Redis"],
    keywords: ["api", "microservice", "gateway", "fastapi", "python", "backend"],
    industry: "web", category: "Web Apps",
  },
]

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "ai-ml": ["ai", "ml", "agent", "langchain", "crewai", "autogen", "pytorch", "tensorflow", "gpt", "llm", "rag", "chatbot", "intelligence", "learning"],
  mobile: ["flutter", "react native", "mobile", "android", "ios", "swiftui", "kotlin", "app"],
  web: ["nextjs", "react", "vue", "svelte", "angular", "web", "website", "dashboard", "saas", "frontend"],
  enterprise: ["saas", "enterprise", "admin", "management", "erp", "crm", "dashboard", "rbac", "billing"],
  fintech: ["bank", "finance", "payment", "transaction", "wallet", "crypto", "trading", "investment"],
  healthtech: ["health", "medical", "drug", "biotech", "genome", "protein", "clinical", "patient", "dna"],
  robotics: ["robot", "ros", "ros2", "slam", "perception", "manipulation", "autonomous", "control"],
  quantum: ["quantum", "qiskit", "qubit", "vqe", "qaoa", "quantum computing"],
  semiconductor: ["chip", "semiconductor", "vlsi", "eda", "verilog", "placement", "routing"],
  iot: ["iot", "sensor", "embedded", "firmware", "mqtt", "esp32", "edge"],
  blockchain: ["blockchain", "solidity", "ethereum", "defi", "token", "smart contract", "web3", "nft"],
  gaming: ["game", "unity", "unreal", "godot", "3d", "platformer", "fps", "rpg"],
  arvr: ["ar", "vr", "augmented reality", "virtual reality", "xr", "webxr", "arkit", "arcore"],
  data: ["data", "etl", "spark", "pipeline", "analytics", "warehouse", "big data", "dbt", "airflow"],
  devops: ["devops", "kubernetes", "docker", "terraform", "ci/cd", "monitoring", "infrastructure"],
}

function isWebProject(project: ProjectTemplate, techStack: string[]): boolean {
  const webKeywords = ["next.js", "react", "vue", "svelte", "angular", "html", "css", "javascript", "typescript", "tailwind", "node.js", "npm", "web"]
  return [...project.techStack, ...techStack].some(t => webKeywords.some(k => t.toLowerCase().includes(k)))
}

function isPythonProject(project: ProjectTemplate, techStack: string[]): boolean {
  const pyKeywords = ["python", "fastapi", "flask", "django", "pytorch", "tensorflow", "langchain", "crewai", "pandas", "numpy", "jupyter"]
  return [...project.techStack, ...techStack].some(t => pyKeywords.some(k => t.toLowerCase().includes(k)))
}

function isMobileProject(project: ProjectTemplate, techStack: string[]): boolean {
  const mobileKeywords = ["flutter", "react native", "swiftui", "kotlin", "dart", "xamarin"]
  return [...project.techStack, ...techStack].some(t => mobileKeywords.some(k => t.toLowerCase().includes(k)))
}

/* ---------- Runnability simulation descriptors ---------- */
export function getProjectPreviewType(techStack: string[]): { type: "web" | "python" | "mobile" | "embedded" | "game" | "blockchain" | "other"; reason: string } {
  const joined = techStack.join(" ").toLowerCase()
  if (/next\.?js|react|vue|svelte|angular|html|css|tailwind/.test(joined)) return { type: "web", reason: "Web application — live preview available in browser" }
  if (/python|fastapi|flask|django/.test(joined)) return { type: "python", reason: "Python backend — simulated terminal output shown below" }
  if (/flutter|dart|react native|swiftui/.test(joined)) return { type: "mobile", reason: "Mobile app — run instructions and file preview available" }
  if (/esp32|arduino|firmware|embedded/.test(joined)) return { type: "embedded", reason: "Embedded / IoT firmware — deployment instructions and file preview below" }
  if (/unity|unreal|godot|blender/.test(joined)) return { type: "game", reason: "Game project — project files and build instructions below" }
  if (/solidity|hardhat|ethereum/.test(joined)) return { type: "blockchain", reason: "Blockchain / smart contract project — deployment instructions and file preview below" }
  return { type: "other", reason: "Project files and run instructions available below" }
}

/* ---------- Generate actual runnable file contents ---------- */
function generateFileContent(
  path: string,
  project: ProjectTemplate,
  rootDir: string,
  stackOverride: string[],
): string {
  const fileName = path.split("/").pop() || ""
  const ext = fileName.split(".").pop() || ""

  // --- README.md (always generated) ---
  if (ext === "md" && fileName === "README.md") {
    return generateReadme(project, rootDir, stackOverride)
  }

  // --- package.json ---
  if (fileName === "package.json") {
    return generatePackageJson(project)
  }

  // --- tsconfig.json ---
  if (fileName === "tsconfig.json") {
    return `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
  }

  // --- next.config.js / next.config.ts ---
  if (fileName.startsWith("next.config")) {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: true },
}
module.exports = nextConfig`
  }

  // --- postcss.config.js ---
  if (fileName === "postcss.config.js" || fileName === "postcss.config.mjs") {
    return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
  }

  // --- tailwind.config.js ---
  if (fileName === "tailwind.config.js" || fileName === "tailwind.config.ts") {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
}`
  }

  // --- .env.example ---
  if (fileName === ".env.example") {
    return `# ${project.title} - Environment Variables
# Copy this file to .env and fill in your values

# Required
DATABASE_URL="postgresql://user:password@localhost:5432/${project.title.toLowerCase().replace(/\\s+/g, "_")}"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Auth (optional for local dev)
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (leave blank for mock data mode)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Optional
LOG_LEVEL=debug
`
  }

  // --- Dockerfile ---
  if (fileName === "Dockerfile") {
    return `FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
`
  }

  // --- docker-compose.yml ---
  if (fileName === "docker-compose.yml") {
    return `version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/${project.title.toLowerCase().replace(/\\s+/g, "_")}
      - NODE_ENV=production
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=${project.title.toLowerCase().replace(/\\s+/g, "_")}
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
`
  }

  // --- prisma/schema.prisma ---
  if (fileName === "schema.prisma") {
    return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  projects  Project[]
}

model Project {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      String   @default("active")
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
`
  }

  // --- lib/mockData.ts or services/mock_data.dart ---
  if (fileName.includes("mockData") || fileName.includes("mock_data") || fileName.includes("mock")) {
    return generateMockData(project, ext)
  }

  // --- lib/data.ts or lib/api.ts ---
  if (fileName === "data.ts" || fileName === "data.js") {
    return generateMockData(project, ext)
  }

  // --- Next.js / React pages ---
  if (ext === "tsx" || ext === "jsx") {
    if (path.includes("layout")) {
      return generateLayout(project)
    }
    if (path.includes("page") || path.includes("Page")) {
      return generatePage(project)
    }
    if (path.includes("Component") || path.includes("component")) {
      return generateComponent(project, fileName)
    }
    if (path.includes("Sidebar") || path.includes("sidebar")) {
      return generateSidebar(project)
    }
    if (path.includes("Chart") || path.includes("chart")) {
      return generateChart(project)
    }
    if (path.includes("Header") || path.includes("header")) {
      return generateHeader(project)
    }
    if (path.includes("AppNavigator")) {
      return generateAppNavigator(project)
    }
    if (path.includes("Card") || path.includes("card")) {
      return generateCard(project)
    }
    return generateComponent(project, fileName)
  }

  // --- API routes ---
  if (path.includes("api/") && (ext === "ts" || ext === "js")) {
    return generateApiRoute(project, path)
  }

  // --- TypeScript utility files ---
  if (ext === "ts" && !path.includes("api/")) {
    if (path.includes("navigation") || path.includes("nav")) return generateNavigation(project)
    return generateTypeScriptUtil(project, fileName)
  }

  // --- CSS files ---
  if (ext === "css" || ext === "scss" || ext === "sass") {
    return `/* ${fileName} - ${project.title} */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --background: #ffffff;
  --foreground: #0a0a0a;
  --muted: #f5f5f5;
  --border: #e5e5e5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #fafafa;
    --muted: #1a1a1a;
    --border: #2a2a2a;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: system-ui, -apple-system, sans-serif;
}
`
  }

  // --- HTML files ---
  if (ext === "html") {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-50 min-h-screen">
  <div id="root">
    <header class="bg-white shadow-sm border-b border-zinc-200">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-zinc-800">${project.title}</h1>
        <nav class="flex gap-4 text-sm text-zinc-600">
          <a href="#" class="hover:text-zinc-900">Dashboard</a>
          <a href="#" class="hover:text-zinc-900">Analytics</a>
          <a href="#" class="hover:text-zinc-900">Settings</a>
        </nav>
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-zinc-800 mb-2">${project.title}</h2>
        <p class="text-zinc-600">${project.description}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
          <div class="text-3xl font-bold text-blue-600">$12,450</div>
          <div class="text-sm text-zinc-500 mt-1">Total Revenue</div>
          <div class="text-xs text-green-600 mt-2">↑ 12.5% from last month</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
          <div class="text-3xl font-bold text-emerald-600">1,248</div>
          <div class="text-sm text-zinc-500 mt-1">Active Users</div>
          <div class="text-xs text-green-600 mt-2">↑ 8.3% from last month</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
          <div class="text-3xl font-bold text-amber-600">98.5%</div>
          <div class="text-sm text-zinc-500 mt-1">Uptime</div>
          <div class="text-xs text-green-600 mt-2">↑ 0.5% from last month</div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 class="font-semibold text-zinc-800 mb-4">Recent Activity</h3>
        ${generateMockActivityHTML()}
      </div>
    </main>
  </div>
</body>
</html>`
  }

  // --- Python files (FastAPI, Flask, etc.) ---
  if (ext === "py") {
    return generatePythonFile(path, fileName, project, rootDir, stackOverride)
  }

  // --- requirements.txt ---
  if (fileName === "requirements.txt") {
    return generateRequirementsTxt(project, stackOverride)
  }

  // --- Flutter pubspec.yaml ---
  if (fileName === "pubspec.yaml") {
    return generatePubspecYaml(project)
  }

  // --- Flutter analysis_options.yaml ---
  if (fileName === "analysis_options.yaml") {
    return `include: package:flutter_lints/flutter.yaml

linter:
  rules:
    prefer_const_constructors: true
    prefer_const_declarations: true
    avoid_print: false
`
  }

  // --- Flutter main.dart ---
  if (fileName === "main.dart") {
    return generateFlutterMain(project)
  }

  // --- Flutter/Dart files ---
  if (ext === "dart" && fileName !== "main.dart") {
    return generateDartFile(path, fileName, project)
  }

  // --- Go files ---
  if (ext === "go") {
    return generateGoFile(path, fileName, project)
  }

  // --- Rust files ---
  if (ext === "rs") {
    return generateRustFile(path, fileName, project)
  }

  // --- Solidity ---
  if (ext === "sol") {
    return generateSolidityFile(path, fileName, project)
  }

  // --- C++ / Header files ---
  if (ext === "cpp" || ext === "hpp" || ext === "h" || ext === "ino") {
    return generateCppFile(path, fileName, project, ext)
  }

  // --- C# (Unity) ---
  if (ext === "cs") {
    return generateCSharpFile(path, fileName, project)
  }

  // --- YAML config files ---
  if (ext === "yml" || ext === "yaml") {
    if (path.includes("docker-compose")) return `version: "3.8"\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n`
    if (path.includes("deployment")) return `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${project.title.toLowerCase().replace(/\\s+/g, "-")}\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: ${project.title.toLowerCase().replace(/\\s+/g, "-")}\n  template:\n    metadata:\n      labels:\n        app: ${project.title.toLowerCase().replace(/\\s+/g, "-")}\n    spec:\n      containers:\n        - name: app\n          image: ${project.title.toLowerCase().replace(/\\s+/g, "-")}:latest\n          ports:\n            - containerPort: 3000\n`
    return `# ${fileName}\n# ${project.title}\n`
  }

  // --- JSON configs ---
  if (ext === "json") {
    if (path.includes("manifest.json")) return JSON.stringify({ name: project.title.toLowerCase().replace(/\\s+/g, "-"), version: "1.0.0", private: true }, null, 2)
    return `{\n  "name": "${project.title.toLowerCase().replace(/\\s+/g, "-")}",\n  "version": "1.0.0"\n}`
  }

  // --- Prisma ---
  if (ext === "prisma") {
    return `generator client {\n  provider = "prisma-client-js"\n}\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\nmodel User {\n  id        String   @id @default(cuid())\n  email     String   @unique\n  name      String?\n  createdAt DateTime @default(now())\n}\n`
  }

  // Fallback
  return `// ${path}\n// ${project.title}\n// ${project.description}\n`
}

/* ---------- Generate Readme ---------- */
function generateReadme(project: ProjectTemplate, rootDir: string, stackOverride: string[]): string {
  const isWeb = isWebProject(project, stackOverride)
  const isPy = isPythonProject(project, stackOverride)
  const isMobile = isMobileProject(project, stackOverride)

  return `# ${project.title}

${project.description}

## 🚀 Quick Start

### Prerequisites
${isPy ? "- Python 3.10+" : ""}
${isWeb ? "- Node.js 18+" : ""}
${isMobile ? "- Flutter SDK 3.16+" : ""}
${isMobile && project.techStack.some(t => t.includes("React Native")) ? "- Node.js 18+\n- React Native CLI or Expo CLI" : ""}
- Git

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${rootDir.slice(1)}
${isWeb ? `
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev
` : isPy ? `
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python main.py
` : isMobile ? `
# Install dependencies
flutter pub get

# Run the app
flutter run
` : `
# Follow the project-specific setup instructions below
`}
\`\`\`

### 🐳 Docker (optional)

\`\`\`bash
docker-compose up --build
\`\`\`

## 📁 Project Structure

\`\`\`
${rootDir.slice(1)}/
${[".env.example", ...(isWeb ? ["package.json", "tsconfig.json"] : []), ...(isPy ? ["requirements.txt"] : []), ...(isMobile ? ["pubspec.yaml"] : []), "README.md"].map(f => `├── ${f}`).join("\n")}
\`\`\`

## 🛠️ Tech Stack

${stackOverride.map(t => `- ${t}`).join("\n")}

## 🔑 Environment Variables

See \`.env.example\` for all required environment variables. Most features work with mock data out of the box.

## 📄 License

MIT
`
}

/* ---------- package.json ---------- */
function generatePackageJson(project: ProjectTemplate): string {
  return JSON.stringify({
    name: project.title.toLowerCase().replace(/\\s+/g, "-"),
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
      typecheck: "tsc --noEmit",
    },
    dependencies: {
      "next": "^14.2.0",
      "react": "^18.3.0",
      "react-dom": "^18.3.0",
      "@types/node": "^20.0.0",
      "@types/react": "^18.3.0",
      "@types/react-dom": "^18.3.0",
      "typescript": "^5.4.0",
      "tailwindcss": "^3.4.0",
      "autoprefixer": "^10.4.0",
      "postcss": "^8.4.0",
      "lucide-react": "^0.370.0",
      "clsx": "^2.1.0",
    },
    devDependencies: {},
  }, null, 2)
}

/* ---------- requirements.txt ---------- */
function generateRequirementsTxt(project: ProjectTemplate, stackOverride: string[]): string {
  const lines = [
    "# Core",
    "fastapi>=0.110.0",
    "uvicorn[standard]>=0.27.0",
    "python-dotenv>=1.0.0",
    "pydantic>=2.5.0",
    "",
    "# Database",
    "sqlalchemy>=2.0.0",
    "psycopg2-binary>=2.9.0",
    "aiosqlite>=0.19.0",
    "",
    "# ML/AI",
    "openai>=1.12.0",
    "langchain>=0.1.0",
    "langchain-community>=0.0.10",
    "chromadb>=0.4.0",
    "tiktoken>=0.5.0",
    "",
    "# Data",
    "pandas>=2.2.0",
    "numpy>=1.26.0",
    "httpx>=0.27.0",
    "",
    "# Utils",
    "python-multipart>=0.0.6",
    "websockets>=12.0",
  ]
  return lines.join("\n") + "\n"
}

/* ---------- pubspec.yaml ---------- */
function generatePubspecYaml(project: ProjectTemplate): string {
  return `name: ${project.title.toLowerCase().replace(/\\s+/g, "_")}
description: ${project.description}
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  http: ^1.1.0
  provider: ^6.1.1
  shared_preferences: ^2.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  mockito: ^5.4.4

flutter:
  uses-material-design: true
`
}

/* ---------- Mock data ---------- */
function generateMockData(project: ProjectTemplate, ext: string): string {
  if (ext === "dart") {
    return `/// Mock data for ${project.title}
class MockData {
  static final List<Map<String, dynamic>> users = [
    {"id": "1", "name": "Alice Johnson", "email": "alice@example.com", "avatar": "AJ"},
    {"id": "2", "name": "Bob Smith", "email": "bob@example.com", "avatar": "BS"},
    {"id": "3", "name": "Carol Davis", "email": "carol@example.com", "avatar": "CD"},
  ];

  static final List<Map<String, dynamic>> activities = [
    {"id": "1", "action": "Created project", "user": "Alice Johnson", "time": "2 hours ago"},
    {"id": "2", "action": "Updated settings", "user": "Bob Smith", "time": "4 hours ago"},
    {"id": "3", "action": "Generated report", "user": "Carol Davis", "time": "6 hours ago"},
    {"id": "4", "action": "Deployed to production", "user": "Alice Johnson", "time": "1 day ago"},
  ];
}
`
  }

  // TypeScript/JavaScript mock data
  return `// Mock data for ${project.title}
// All data is static — works offline without any backend

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "viewer"
  avatar: string
  joinedAt: string
}

export interface Activity {
  id: string
  action: string
  user: string
  time: string
  type: "create" | "update" | "delete" | "deploy"
}

export interface Metric {
  label: string
  value: string
  change: string
  trend: "up" | "down"
}

export const mockUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "admin", avatar: "AJ", joinedAt: "2024-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "user", avatar: "BS", joinedAt: "2024-03-20" },
  { id: "3", name: "Carol Davis", email: "carol@example.com", role: "user", avatar: "CD", joinedAt: "2024-06-10" },
  { id: "4", name: "David Wilson", email: "david@example.com", role: "viewer", avatar: "DW", joinedAt: "2024-08-05" },
]

export const mockActivities: Activity[] = [
  { id: "1", action: "Created new project", user: "Alice Johnson", time: "2 hours ago", type: "create" },
  { id: "2", action: "Updated system configuration", user: "Bob Smith", time: "4 hours ago", type: "update" },
  { id: "3", action: "Generated monthly report", user: "Carol Davis", time: "6 hours ago", type: "create" },
  { id: "4", action: "Deployed to production", user: "Alice Johnson", time: "1 day ago", type: "deploy" },
  { id: "5", action: "Deleted stale branch", user: "David Wilson", time: "2 days ago", type: "delete" },
]

export const mockMetrics: Metric[] = [
  { label: "Total Revenue", value: "$12,450", change: "+12.5%", trend: "up" },
  { label: "Active Users", value: "1,248", change: "+8.3%", trend: "up" },
  { label: "Uptime", value: "98.5%", change: "+0.5%", trend: "up" },
  { label: "Response Time", value: "245ms", change: "-12ms", trend: "down" },
]
`
}

/* ---------- Layout (TSX) ---------- */
function generateLayout(project: ProjectTemplate): string {
  return `import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "${project.title}",
  description: "${project.description}",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  )
}
`
}

/* ---------- Page (TSX) ---------- */
function generatePage(project: ProjectTemplate): string {
  const isSaas = project.title.toLowerCase().includes("saas") || project.title.toLowerCase().includes("admin")
  const isEcom = project.title.toLowerCase().includes("e-com") || project.title.toLowerCase().includes("dashboard")

  if (isSaas || isEcom) {
    return `"use client"

import { useState } from "react"
import { mockMetrics, mockActivities, mockUsers } from "@/lib/mockData"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={\`flex-1 \${sidebarOpen ? "ml-64" : "ml-16"} transition-all\`}>
        <Header title="${project.title}" />
        <main className="p-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {mockMetrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-zinc-500">{metric.label}</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">{metric.value}</p>
                <p className={\`mt-1 text-xs \${metric.trend === "up" ? "text-green-600" : "text-red-600"}\`}>
                  {metric.change} vs last month
                </p>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-6 py-4">
              <h3 className="font-semibold text-zinc-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-zinc-100">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 px-6 py-3">
                  <div className={\`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium \${
                    activity.type === "create" ? "bg-green-100 text-green-700" :
                    activity.type === "deploy" ? "bg-blue-100 text-blue-700" :
                    activity.type === "update" ? "bg-amber-100 text-amber-700" :
                    "bg-zinc-100 text-zinc-700"
                  }\`}>
                    {activity.type === "create" ? "⊕" : activity.type === "deploy" ? "→" : activity.type === "update" ? "✎" : "✕"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-900">{activity.action}</p>
                    <p className="text-xs text-zinc-500">{activity.user}</p>
                  </div>
                  <span className="text-xs text-zinc-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-6 py-4">
              <h3 className="font-semibold text-zinc-900">Team Members</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 text-left text-xs text-zinc-500 uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                            {user.avatar}
                          </div>
                          <span className="font-medium text-zinc-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={\`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium \${
                          user.role === "admin" ? "bg-purple-100 text-purple-700" :
                          user.role === "user" ? "bg-blue-100 text-blue-700" :
                          "bg-zinc-100 text-zinc-700"
                        }\`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{user.joinedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
`
  }

  // Generic page
  return `"use client"

import { useState } from "react"

export default function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            ${project.title}
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            ${project.description}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-3xl">🚀</div>
            <h3 className="mt-3 font-semibold text-zinc-900">Ready to Use</h3>
            <p className="mt-1 text-sm text-zinc-500">Project is set up with all dependencies</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-3xl">📦</div>
            <h3 className="mt-3 font-semibold text-zinc-900">Mock Data Included</h3>
            <p className="mt-1 text-sm text-zinc-500">Works offline with built-in sample data</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-3xl">🔧</div>
            <h3 className="mt-3 font-semibold text-zinc-900">Fully Extensible</h3>
            <p className="mt-1 text-sm text-zinc-500">Add your own logic and integrations</p>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={() => setCount(c => c + 1)}
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition"
          >
            Click me ({count})
          </button>
          <button className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium hover:bg-zinc-50 transition">
            Learn More
          </button>
        </div>

        <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-zinc-900 mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            ${project.techStack.map(t => `<span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">${t}</span>`).join("\n            ")}
          </div>
        </div>
      </div>
    </div>
  )
}
`
}

/* ---------- Component ---------- */
function generateComponent(project: ProjectTemplate, fileName: string): string {
  const name = fileName.replace(/\.(tsx|ts|jsx|js)$/, "")
  return `"use client"

interface ${name}Props {
  className?: string
  children?: React.ReactNode
}

export default function ${name}({ className, children }: ${name}Props) {
  return (
    <div className={\`rounded-xl border border-zinc-200 bg-white shadow-sm \${className || ""}\`}>
      {children || <div className="p-6 text-sm text-zinc-500">${name} component</div>}
    </div>
  )
}
`
}

/* ---------- Sidebar ---------- */
function generateSidebar(project: ProjectTemplate): string {
  return `"use client"

import { useState } from "react"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: "◇", label: "Dashboard", href: "#" },
  { icon: "□", label: "Projects", href: "#" },
  { icon: "○", label: "Analytics", href: "#" },
  { icon: "△", label: "Users", href: "#" },
  { icon: "☆", label: "Settings", href: "#" },
]

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const [active, setActive] = useState("Dashboard")

  return (
    <aside className={\`fixed left-0 top-0 h-full bg-zinc-900 text-white transition-all z-40 \${open ? "w-64" : "w-16"}\`}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800">
        {open && <span className="font-semibold text-sm">${project.title}</span>}
        <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400">
          {open ? "◀" : "▶"}
        </button>
      </div>
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setActive(item.label)}
            className={\`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition \${
              active === item.label ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }\`}
          >
            <span className="text-lg">{item.icon}</span>
            {open && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  )
}
`
}

/* ---------- Chart ---------- */
function generateChart(project: ProjectTemplate): string {
  return `"use client"

interface ChartProps {
  title?: string
  data?: number[]
  labels?: string[]
}

export default function Chart({ title = "Overview", data = [30, 45, 25, 60, 40, 55, 70], labels }: ChartProps) {
  const max = Math.max(...data, 1)
  const defaultLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const usedLabels = labels || defaultLabels

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900 mb-4">{title}</h3>
      <div className="flex items-end gap-2 h-40">
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-blue-500 hover:bg-blue-600 transition-all cursor-pointer"
              style={{ height: \`\${(value / max) * 100}%\`, minHeight: "4px" }}
            />
            <span className="text-[10px] text-zinc-500">{usedLabels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
`
}

/* ---------- Header ---------- */
function generateHeader(project: ProjectTemplate): string {
  return `"use client"

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 backdrop-blur-sm px-6">
      <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-200 transition">
          + New
        </button>
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
          U
        </div>
      </div>
    </header>
  )
}
`
}

/* ---------- App Navigator ---------- */
function generateAppNavigator(project: ProjectTemplate): string {
  return `import { createNativeStackNavigator } from "@react-navigation/native-stack"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

export type RootStackParamList = {
  Home: undefined
  Details: { id: string }
  Settings: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="Home" component={require("../screens/HomeScreen").default} options={{ title: "${project.title}" }} />
      <Stack.Screen name="Details" component={require("../screens/DetailsScreen").default} options={{ title: "Details" }} />
      <Stack.Screen name="Settings" component={require("../screens/SettingsScreen").default} options={{ title: "Settings" }} />
    </Stack.Navigator>
  )
}

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>
`
}

/* ---------- Card Component ---------- */
function generateCard(project: ProjectTemplate): string {
  return `"use client"

interface CardProps {
  title: string
  value: string
  trend?: string
  icon?: string
}

export default function Card({ title, value, trend, icon }: CardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{title}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold text-zinc-900">{value}</p>
      {trend && (
        <p className="mt-1 text-xs text-green-600">{trend}</p>
      )}
    </div>
  )
}
`
}

/* ---------- Navigation/TS util ---------- */
function generateNavigation(project: ProjectTemplate): string {
  return `export interface NavItem {
  label: string
  href: string
  icon: string
}

export const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "◇" },
  { label: "Projects", href: "/projects", icon: "□" },
  { label: "Analytics", href: "/analytics", icon: "○" },
  { label: "Settings", href: "/settings", icon: "☆" },
]
`
}

function generateTypeScriptUtil(project: ProjectTemplate, fileName: string): string {
  const name = fileName.replace(/\.(ts|js)$/, "")
  return `// ${name} - ${project.title}

export interface ApiResponse<T> {
  data: T
  error?: string
  status: number
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  // Mock implementation — replace with real API call
  console.log(\`API GET: \${endpoint}\`)
  return { data: [] as unknown as T, status: 200 }
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
  console.log(\`API POST: \${endpoint}\`, body)
  return { data: [] as unknown as T, status: 201 }
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}
`
}

/* ---------- API Routes ---------- */
function generateApiRoute(project: ProjectTemplate, path: string): string {
  return `import { NextResponse } from "next/server"

// Mock data for ${project.title}
const data = [
  { id: "1", name: "Item 1", status: "active", createdAt: new Date().toISOString() },
  { id: "2", name: "Item 2", status: "active", createdAt: new Date().toISOString() },
  { id: "3", name: "Item 3", status: "inactive", createdAt: new Date().toISOString() },
]

export async function GET() {
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newItem = { id: String(Date.now()), ...body, createdAt: new Date().toISOString() }
    return NextResponse.json({ data: newItem }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    return NextResponse.json({ data: { ...body, updatedAt: new Date().toISOString() } })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  return NextResponse.json({ success: true, deletedId: id })
}
`
}

/* ---------- Python file ---------- */
function generatePythonFile(path: string, fileName: string, project: ProjectTemplate, rootDir: string, stackOverride: string[]): string {
  if (fileName === "main.py") {
    const isFastAPI = stackOverride.some(t => t.toLowerCase().includes("fastapi"))
    if (isFastAPI) {
      return `"""${project.title}
${project.description}

Run with: uvicorn main:app --reload
"""

import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="${project.title}",
    description="${project.description}",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mock Data ---
MOCK_DATA = [
    {"id": 1, "name": "Sample Item A", "status": "active", "value": 100},
    {"id": 2, "name": "Sample Item B", "status": "active", "value": 200},
    {"id": 3, "name": "Sample Item C", "status": "inactive", "value": 150},
]

# --- Schemas ---
class Item(BaseModel):
    name: str
    status: str = "active"
    value: float = 0

class ItemResponse(Item):
    id: int

# --- Routes ---
@app.get("/")
def root():
    return {"message": "${project.title} API", "status": "running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": __import__("datetime").datetime.now().isoformat()}

@app.get("/api/items", response_model=List[ItemResponse])
def list_items(status: Optional[str] = Query(None)):
    if status:
        return [item for item in MOCK_DATA if item["status"] == status]
    return MOCK_DATA

@app.get("/api/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int):
    for item in MOCK_DATA:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.post("/api/items", response_model=ItemResponse, status_code=201)
def create_item(item: Item):
    new_id = max(i["id"] for i in MOCK_DATA) + 1
    new_item = {"id": new_id, **item.model_dump()}
    MOCK_DATA.append(new_item)
    return new_item

@app.get("/api/stats")
def get_stats():
    return {
        "total_items": len(MOCK_DATA),
        "active_items": sum(1 for i in MOCK_DATA if i["status"] == "active"),
        "average_value": sum(i["value"] for i in MOCK_DATA) / len(MOCK_DATA) if MOCK_DATA else 0,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`
    }
    // Generic Python
    return `"""${project.title}
${project.description}

Usage: python main.py
"""

import os
import sys
import json
from datetime import datetime
from typing import Optional, List, Dict, Any


def main():
    """Main entry point."""
    print(f"🚀 ${project.title}")
    print(f"   ${project.description}")
    print()
    print("📋 Tech Stack: ${stackOverride.join(", ")}")
    print()
    print("✅ Application started successfully")
    print(f"   Time: {datetime.now().isoformat()}")
    print()
    print("📡 Available endpoints:")
    print("   GET  /        - Root endpoint")
    print("   GET  /health  - Health check")
    print("   POST /api     - API endpoint")
    print()
    print("Press Ctrl+C to stop")


if __name__ == "__main__":
    main()
`
  }

  // Python module files
  if (fileName.includes("agent") || fileName.includes("Agent")) {
    return `"""Agent module for ${project.title}"""
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, field


@dataclass
class Agent:
    """Base agent class."""
    name: str
    role: str
    system_prompt: str = ""
    tools: List[str] = field(default_factory=list)

    def run(self, task: str) -> str:
        """Execute a task and return the result."""
        return f"[{self.name}] Processing: {task}"


class SupervisorAgent(Agent):
    """Supervisor agent that coordinates sub-agents."""
    
    def __init__(self, name: str = "Supervisor"):
        super().__init__(name=name, role="supervisor")
        self.sub_agents: List[Agent] = []

    def add_agent(self, agent: Agent):
        self.sub_agents.append(agent)

    def delegate(self, task: str) -> List[str]:
        return [agent.run(task) for agent in self.sub_agents]
`
  }

  if (fileName.includes("model") || fileName.includes("train")) {
    return `"""Model training module for ${project.title}"""
import numpy as np
from typing import Tuple, Optional


def create_mock_data(n_samples: int = 100, n_features: int = 10) -> Tuple[np.ndarray, np.ndarray]:
    """Create synthetic dataset for testing."""
    np.random.seed(42)
    X = np.random.randn(n_samples, n_features)
    y = (X[:, 0] + X[:, 1] > 0).astype(int)
    return X, y


class SimpleModel:
    """Simple machine learning model for demonstration."""
    
    def __init__(self, learning_rate: float = 0.01):
        self.weights: Optional[np.ndarray] = None
        self.bias: float = 0.0
        self.lr = learning_rate

    def train(self, X: np.ndarray, y: np.ndarray, epochs: int = 10):
        n_samples, n_features = X.shape
        self.weights = np.random.randn(n_features) * 0.01
        
        for epoch in range(epochs):
            predictions = self._forward(X)
            loss = self._compute_loss(predictions, y)
            
            # Gradient descent
            dw = (1 / n_samples) * np.dot(X.T, (predictions - y))
            db = (1 / n_samples) * np.sum(predictions - y)
            self.weights -= self.lr * dw
            self.bias -= self.lr * db
            
            if epoch % 2 == 0:
                print(f"Epoch {epoch}: loss = {loss:.4f}")

    def predict(self, X: np.ndarray) -> np.ndarray:
        if self.weights is None:
            raise ValueError("Model not trained yet")
        return self._forward(X)

    def _forward(self, X: np.ndarray) -> np.ndarray:
        return 1 / (1 + np.exp(-(np.dot(X, self.weights) + self.bias)))

    def _compute_loss(self, y_pred: np.ndarray, y_true: np.ndarray) -> float:
        epsilon = 1e-15
        y_pred = np.clip(y_pred, epsilon, 1 - epsilon)
        return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))


if __name__ == "__main__":
    X, y = create_mock_data()
    model = SimpleModel()
    model.train(X, y)
    acc = (model.predict(X) > 0.5).astype(int)
    print(f"Accuracy: {(acc == y.reshape(-1, 1)).mean():.2%}")
`
  }

  if (fileName.includes("api") || fileName.includes("route")) {
    return `"""API routes for ${project.title}"""
from typing import Optional, List, Dict, Any


class API:
    """Simple API class for ${project.title}."""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self._mock_data = {
            "users": [
                {"id": 1, "name": "Alice", "email": "alice@example.com"},
                {"id": 2, "name": "Bob", "email": "bob@example.com"},
            ],
            "items": [
                {"id": 1, "name": "Item 1", "price": 29.99},
                {"id": 2, "name": "Item 2", "price": 49.99},
            ],
        }

    def get(self, endpoint: str) -> Dict[str, Any]:
        """Mock GET request."""
        key = endpoint.strip("/").split("/")[-1]
        return {"data": self._mock_data.get(key, []), "status": 200}

    def post(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Mock POST request."""
        return {"data": data, "status": 201, "message": "Created successfully"}

    def delete(self, endpoint: str) -> Dict[str, Any]:
        """Mock DELETE request."""
        return {"status": 204, "message": "Deleted successfully"}
`
  }

  // Default Python module
  return `"""${fileName} - ${project.title}"""
import os
from typing import Optional, List, Dict, Any


def main():
    """Main function for ${fileName}."""
    pass


if __name__ == "__main__":
    main()
`
}

/* ---------- Flutter main.dart ---------- */
function generateFlutterMain(project: ProjectTemplate): string {
  return `import 'package:flutter/material.dart';
import 'screens/home.dart';
import 'screens/feed.dart';
import 'screens/chat.dart';
import 'services/mock_data.dart';

void main() {
  runApp(const ${project.title.replace(/\\s+/g, "")}App());
}

class ${project.title.replace(/\\s+/g, "")}App extends StatelessWidget {
  const ${project.title.replace(/\\s+/g, "")}App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${project.title}',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: Colors.blue,
        useMaterial3: true,
        brightness: Brightness.light,
      ),
      darkTheme: ThemeData(
        colorSchemeSeed: Colors.blue,
        useMaterial3: true,
        brightness: Brightness.dark,
      ),
      home: const HomeScreen(),
    );
  }
}
`
}

/* ---------- Dart file ---------- */
function generateDartFile(path: string, fileName: string, project: ProjectTemplate): string {
  if (path.includes("screens") || path.includes("Screen")) {
    const screenName = fileName.replace(".dart", "")
    const capitalized = screenName.replace(/_/g, " ").split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join("")
    return `import 'package:flutter/material.dart';

class ${capitalized} extends StatelessWidget {
  const ${capitalized}({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${capitalized.replaceAll(/([A-Z])/g, " $1").trim()}'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.rocket_launch, size: 64, color: Colors.blue),
            const SizedBox(height: 16),
            Text(
              '${project.title}',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                '${project.description}',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
  }

  if (path.includes("services") || path.includes("service")) {
    return `/// API service for ${project.title}
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:8000/api';

  Future<List<dynamic>> getItems() async {
    // Mock response for development
    return [
      {'id': 1, 'name': 'Item 1', 'status': 'active'},
      {'id': 2, 'name': 'Item 2', 'status': 'active'},
      {'id': 3, 'name': 'Item 3', 'status': 'inactive'},
    ];
  }

  Future<Map<String, dynamic>> createItem(Map<String, dynamic> item) async {
    return {'id': DateTime.now().millisecondsSinceEpoch, ...item};
  }
}
`
  }

  if (path.includes("widgets") || path.includes("Widget") || path.includes("widget")) {
    const widgetName = fileName.replace(".dart", "").split("_").map(w => w[0].toUpperCase() + w.slice(1)).join("")
    return `import 'package:flutter/material.dart';

class ${widgetName} extends StatelessWidget {
  final String title;
  final String? subtitle;
  final IconData? icon;

  const ${widgetName}({
    super.key,
    required this.title,
    this.subtitle,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: icon != null
            ? Icon(icon, color: Theme.of(context).colorScheme.primary)
            : null,
        title: Text(title),
        subtitle: subtitle != null ? Text(subtitle!) : null,
        trailing: const Icon(Icons.chevron_right),
      ),
    );
  }
}
`
  }

  return `/// ${fileName} - ${project.title}
class ${project.title.replace(/\\s+/g, "")} {
  final String id;
  final String name;

  const ${project.title.replace(/\\s+/g, "")}({
    required this.id,
    required this.name,
  });
}
`
}

/* ---------- Go ---------- */
function generateGoFile(path: string, fileName: string, project: ProjectTemplate): string {
  return `package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// Item represents a data item
type Item struct {
	ID        int       \`json:"id"\`
	Name      string    \`json:"name"\`
	Status    string    \`json:"status"\`
	CreatedAt time.Time \`json:"created_at"\`
}

var items = []Item{
	{ID: 1, Name: "Sample 1", Status: "active", CreatedAt: time.Now()},
	{ID: 2, Name: "Sample 2", Status: "active", CreatedAt: time.Now()},
	{ID: 3, Name: "Sample 3", Status: "inactive", CreatedAt: time.Now()},
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", rootHandler)
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/items", itemsHandler)

	addr := ":8080"
	fmt.Printf("🚀 ${project.title} running on http://localhost%s\\n", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{
		"message": "${project.title}",
		"status":  "running",
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func itemsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	switch r.Method {
	case "GET":
		json.NewEncoder(w).Encode(map[string]interface{}{"data": items, "count": len(items)})
	case "POST":
		var newItem Item
		if err := json.NewDecoder(r.Body).Decode(&newItem); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
		newItem.ID = len(items) + 1
		newItem.CreatedAt = time.Now()
		items = append(items, newItem)
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(newItem)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
`
}

/* ---------- Rust ---------- */
function generateRustFile(path: string, fileName: string, project: ProjectTemplate): string {
  return `// ${fileName} - ${project.title}

fn main() {
    println!("🚀 ${project.title}");
    println!("   ${project.description}");
    println!();
    println!("Tech Stack: ${project.techStack.join(", ")}");
    println!();
    
    let result = calculate(42);
    println!("Result: {}", result);
}

fn calculate(x: i32) -> i32 {
    x * 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate() {
        assert_eq!(calculate(21), 42);
    }

    #[test]
    fn test_initialization() {
        assert!(true);
    }
}
`
}

/* ---------- Solidity ---------- */
function generateSolidityFile(path: string, fileName: string, project: ProjectTemplate): string {
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ${fileName.replace(".sol", "")}
 * @notice ${project.title}
 */
contract ${fileName.replace(".sol", "")} {
    address public owner;
    uint256 public totalSupply;
    mapping(address => uint256) public balances;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        totalSupply = _initialSupply;
        balances[owner] = _initialSupply;
        emit Transfer(address(0), owner, _initialSupply);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(to != address(0), "Invalid address");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
`
}

/* ---------- C++ ---------- */
function generateCppFile(path: string, fileName: string, project: ProjectTemplate, ext: string): string {
  if (ext === "ino") {
    return `// ${fileName} - ${project.title}
#include <Arduino.h>

// Pin definitions
const int LED_PIN = 2;
const int SENSOR_PIN = A0;

// Configuration
const unsigned long INTERVAL_MS = 1000;
unsigned long lastRead = 0;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(SENSOR_PIN, INPUT);
  Serial.println("${project.title} initialized");
}

void loop() {
  unsigned long now = millis();
  if (now - lastRead >= INTERVAL_MS) {
    lastRead = now;
    int sensorValue = analogRead(SENSOR_PIN);
    Serial.print("Sensor: ");
    Serial.println(sensorValue);
    digitalWrite(LED_PIN, sensorValue > 512 ? HIGH : LOW);
  }
}
`
  }

  return `// ${fileName} - ${project.title}
#include <iostream>
#include <string>
#include <vector>
#include <memory>

using namespace std;

class ${fileName.replace(/\\.\\w+$/, "").replace(/[^a-zA-Z0-9]/g, "_")} {
public:
    ${fileName.replace(/\\.\\w+$/, "").replace(/[^a-zA-Z0-9]/g, "_")}(const string& name) : name_(name) {
        cout << "${project.title}: " << name_ << " initialized" << endl;
    }

    void process() {
        cout << "Processing..." << endl;
    }

private:
    string name_;
};

int main() {
    auto app = make_shared<${fileName.replace(/\\.\\w+$/, "").replace(/[^a-zA-Z0-9]/g, "_")}>("${project.title}");
    app->process();
    return 0;
}
`
}

/* ---------- C# (Unity) ---------- */
function generateCSharpFile(path: string, fileName: string, project: ProjectTemplate): string {
  return `using UnityEngine;
using System.Collections;

public class ${fileName.replace(".cs", "").replace(/[^a-zA-Z0-9]/g, "_")} : MonoBehaviour
{
    [Header("${project.title}")]
    [SerializeField] private float speed = 5f;
    [SerializeField] private GameObject target;

    private Vector3 startPosition;
    private float timer = 0f;

    void Start()
    {
        startPosition = transform.position;
        Debug.Log("${project.title} initialized");
        StartCoroutine(UpdateRoutine());
    }

    IEnumerator UpdateRoutine()
    {
        while (true)
        {
            timer += Time.deltaTime;

            // Simple movement pattern
            float x = Mathf.Sin(timer * speed) * 3f;
            float z = Mathf.Cos(timer * speed * 0.7f) * 3f;
            transform.position = startPosition + new Vector3(x, 0, z);

            yield return null;
        }
    }

    void OnCollisionEnter(Collision collision)
    {
        Debug.Log($"Collided with: {collision.gameObject.name}");
    }
}
`
}

/* ---------- Mock activity HTML ---------- */
function generateMockActivityHTML(): string {
  return `
      <div class="space-y-3">
        <div class="flex items-center gap-3 border-b border-zinc-100 pb-3">
          <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-sm">⊕</div>
          <div><p class="text-sm text-zinc-800">Created new project</p><p class="text-xs text-zinc-500">Alice Johnson</p></div>
          <span class="ml-auto text-xs text-zinc-400">2h ago</span>
        </div>
        <div class="flex items-center gap-3 border-b border-zinc-100 pb-3">
          <div class="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-sm">✎</div>
          <div><p class="text-sm text-zinc-800">Updated system configuration</p><p class="text-xs text-zinc-500">Bob Smith</p></div>
          <span class="ml-auto text-xs text-zinc-400">4h ago</span>
        </div>
        <div class="flex items-center gap-3 border-b border-zinc-100 pb-3">
          <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-sm">⊕</div>
          <div><p class="text-sm text-zinc-800">Generated monthly report</p><p class="text-xs text-zinc-500">Carol Davis</p></div>
          <span class="ml-auto text-xs text-zinc-400">6h ago</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">→</div>
          <div><p class="text-sm text-zinc-800">Deployed to production</p><p class="text-xs text-zinc-500">Alice Johnson</p></div>
          <span class="ml-auto text-xs text-zinc-400">1d ago</span>
        </div>
      </div>`
}

export function generateFallbackProject(prompt: string, category?: string, techStack?: string) {
  const lower = prompt.toLowerCase()

  let matched: ProjectTemplate[] = []
  let industry = ""

  for (const [ind, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      industry = ind
      break
    }
  }

  for (const project of PROJECTS) {
    const kwMatch = project.keywords.some(kw => lower.includes(kw))
    const catMatch = category && category !== "All" && category !== ""
      ? project.category === category || lower.includes(project.category.toLowerCase().slice(0, 6))
      : true
    if (kwMatch || catMatch) {
      matched.push(project)
    }
  }

  if (matched.length === 0) {
    const categoryMap: Record<string, number[]> = {
      "Mobile Apps": [6, 22], "Web Apps": [1, 11, 21], "AI Agents": [0], "Agentic AI": [3], "AGI": [20],
      "Quantum AI": [4], "AI Robotics": [5], "AI Semiconductors": [19], "AIoT": [18],
      "AI + Biotechnology": [15, 16], "AI + Neural Science": [17], "Blockchain / Web3": [8],
      "Game Development": [9], "AR / VR": [12], "Data Engineering": [10], "DevOps / Cloud Infrastructure": [7],
      "Realtime AI Applications": [14],
    }
    const indices = category ? categoryMap[category] : undefined
    if (indices) matched = indices.map(i => PROJECTS[i]).filter(Boolean)
    if (matched.length === 0) matched = [PROJECTS[lower.length % PROJECTS.length]]
  }

  const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0 }; return Math.abs(h) }
  const base = matched[hash(prompt + (techStack || "")) % matched.length]

  const stackOverride = techStack && techStack !== "auto" && techStack !== "__custom__"
    ? techStack.split(" + ").map((s: string) => s.trim())
    : base.techStack

  const rootDir = `/${base.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")}`

  // Determine what files to generate based on tech stack
  const structure = determineStructure(base, stackOverride, rootDir)
  const demoFiles = structure.map((path: string) => {
    const content = generateFileContent(path, base, rootDir, stackOverride)
    return { path, content }
  })

  return {
    title: base.title,
    description: base.description,
    techStack: stackOverride,
    structure: structure,
    files: demoFiles,
  }
}

function determineStructure(project: ProjectTemplate, stack: string[], rootDir: string): string[] {
  const joined = stack.join(" ").toLowerCase()
  const isWeb = /next\.?js|react|vue|svelte|angular/.test(joined)
  const isPython = /python|fastapi|flask/.test(joined)
  const isFlutter = /flutter|dart/.test(joined)
  const isRN = /react native/.test(joined)
  const isSolidity = /solidity|hardhat/.test(joined)
  const isUnity = /unity|c#/.test(joined)
  const isGo = /^go\b/.test(joined)
  const isRust = /rust|cargo/.test(joined)
  const isIot = /esp32|arduino|embedded/.test(joined)
  const isK8s = /kubernetes|k8s/.test(joined)

  if (isWeb) {
    return [
      `${rootDir}/package.json`,
      `${rootDir}/tsconfig.json`,
      `${rootDir}/next.config.js`,
      `${rootDir}/postcss.config.js`,
      `${rootDir}/tailwind.config.ts`,
      `${rootDir}/src/app/layout.tsx`,
      `${rootDir}/src/app/page.tsx`,
      `${rootDir}/src/app/api/route.ts`,
      `${rootDir}/src/app/globals.css`,
      `${rootDir}/src/lib/mockData.ts`,
      `${rootDir}/src/components/Header.tsx`,
      `${rootDir}/src/components/Sidebar.tsx`,
      `${rootDir}/src/components/Chart.tsx`,
      `${rootDir}/prisma/schema.prisma`,
      `${rootDir}/.env.example`,
      `${rootDir}/Dockerfile`,
      `${rootDir}/docker-compose.yml`,
      `${rootDir}/README.md`,
    ]
  }

  if (isPython) {
    return [
      `${rootDir}/main.py`,
      `${rootDir}/requirements.txt`,
      `${rootDir}/.env.example`,
      `${rootDir}/Dockerfile`,
      `${rootDir}/README.md`,
    ]
  }

  if (isFlutter) {
    return [
      `${rootDir}/pubspec.yaml`,
      `${rootDir}/analysis_options.yaml`,
      `${rootDir}/lib/main.dart`,
      `${rootDir}/lib/screens/home.dart`,
      `${rootDir}/lib/services/api_service.dart`,
      `${rootDir}/lib/services/mock_data.dart`,
      `${rootDir}/lib/widgets/custom_card.dart`,
      `${rootDir}/.env.example`,
      `${rootDir}/README.md`,
    ]
  }

  if (isRN) {
    return [
      `${rootDir}/package.json`,
      `${rootDir}/tsconfig.json`,
      `${rootDir}/babel.config.js`,
      `${rootDir}/index.js`,
      `${rootDir}/metro.config.js`,
      `${rootDir}/App.tsx`,
      `${rootDir}/src/screens/HomeScreen.tsx`,
      `${rootDir}/src/services/api.ts`,
      `${rootDir}/src/services/mockData.ts`,
      `${rootDir}/src/components/WorkoutCard.tsx`,
      `${rootDir}/src/navigation/AppNavigator.tsx`,
      `${rootDir}/.env.example`,
      `${rootDir}/README.md`,
    ]
  }

  if (isSolidity) {
    return [
      `${rootDir}/contracts/Token.sol`,
      `${rootDir}/contracts/Pool.sol`,
      `${rootDir}/test/Token.test.ts`,
      `${rootDir}/hardhat.config.ts`,
      `${rootDir}/package.json`,
      `${rootDir}/README.md`,
    ]
  }

  if (isUnity) {
    return [
      `${rootDir}/Assets/Scripts/PlayerController.cs`,
      `${rootDir}/Assets/Scripts/GameManager.cs`,
      `${rootDir}/Assets/Scripts/UIManager.cs`,
      `${rootDir}/Packages/manifest.json`,
      `${rootDir}/ProjectSettings/ProjectSettings.asset`,
      `${rootDir}/README.md`,
    ]
  }

  if (isGo) {
    return [
      `${rootDir}/main.go`,
      `${rootDir}/go.mod`,
      `${rootDir}/Dockerfile`,
      `${rootDir}/README.md`,
    ]
  }

  if (isRust) {
    return [
      `${rootDir}/src/main.rs`,
      `${rootDir}/Cargo.toml`,
      `${rootDir}/README.md`,
    ]
  }

  if (isIot) {
    return [
      `${rootDir}/firmware/main.ino`,
      `${rootDir}/firmware/config.h`,
      `${rootDir}/backend/main.py`,
      `${rootDir}/dashboard/index.html`,
      `${rootDir}/docker-compose.yml`,
      `${rootDir}/README.md`,
    ]
  }

  if (isK8s) {
    return [
      `${rootDir}/k8s/deployment.yaml`,
      `${rootDir}/k8s/service.yaml`,
      `${rootDir}/src/main.go`,
      `${rootDir}/Dockerfile`,
      `${rootDir}/README.md`,
    ]
  }

  // Default: use the 6 most common files from the template
  return project.keywords.length > 0
    ? [
        `${rootDir}/README.md`,
        `${rootDir}/package.json`,
        `${rootDir}/src/index.ts`,
        `${rootDir}/.env.example`,
      ]
    : [
        `${rootDir}/README.md`,
        `${rootDir}/src/index.ts`,
      ]
}
