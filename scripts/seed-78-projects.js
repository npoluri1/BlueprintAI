/**
 * Seed script: Creates 78 pre-built projects directly in the SQLite database.
 * Run: node scripts/seed-78-projects.js
 *
 * Uses better-sqlite3 directly (matching the approach in check_root_db.js).
 */

const Database = require("better-sqlite3")
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid")

const db = new Database("dev.db")

// Enable WAL mode for better concurrent access
db.pragma("journal_mode = WAL")

/* ---------- Helper: generate a basic file structure from tech stack ---------- */

function generateStructure(techStack) {
  const lower = techStack.join(" ").toLowerCase()
  const dir = techStack[0]?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "project"
  const files = []
  const base = `/home/${dir}`

  // Generic project files
  files.push(`${base}/README.md`)
  files.push(`${base}/.env.example`)

  if (/next\.?js|react|vue|svelte|angular|tailwind/.test(lower)) {
    files.push(`${base}/package.json`, `${base}/tsconfig.json`, `${base}/tailwind.config.js`)
    files.push(`${base}/src/app/layout.tsx`, `${base}/src/app/page.tsx`, `${base}/src/app/globals.css`)
    files.push(`${base}/src/components/Header.tsx`, `${base}/src/components/Sidebar.tsx`)
    files.push(`${base}/src/lib/utils.ts`, `${base}/src/lib/api.ts`)
    if (/postgres|prisma|sql/.test(lower)) files.push(`${base}/prisma/schema.prisma`)
    if (/docker/.test(lower)) files.push(`${base}/Dockerfile`, `${base}/docker-compose.yml`)
  } else if (/flutter|dart/.test(lower)) {
    files.push(`${base}/pubspec.yaml`, `${base}/lib/main.dart`, `${base}/lib/app.dart`)
    files.push(`${base}/lib/screens/home_screen.dart`, `${base}/lib/models/data_model.dart`)
    files.push(`${base}/lib/services/api_service.dart`, `${base}/lib/widgets/custom_card.dart`)
    if (/firebase/.test(lower)) files.push(`${base}/android/app/google-services.json`, `${base}/lib/services/firebase_service.dart`)
  } else if (/react native/.test(lower)) {
    files.push(`${base}/package.json`, `${base}/App.tsx`, `${base}/tsconfig.json`)
    files.push(`${base}/src/screens/HomeScreen.tsx`, `${base}/src/navigation/AppNavigator.tsx`)
    files.push(`${base}/src/services/api.ts`, `${base}/src/components/Card.tsx`)
    if (/firebase/.test(lower)) files.push(`${base}/src/services/firebase.ts`)
  } else if (/python|fastapi|flask|django|langchain/.test(lower)) {
    files.push(`${base}/requirements.txt`, `${base}/main.py`, `${base}/app/__init__.py`)
    files.push(`${base}/app/models.py`, `${base}/app/routes.py`, `${base}/app/schemas.py`)
    files.push(`${base}/app/services.py`, `${base}/app/config.py`)
    if (/docker/.test(lower)) files.push(`${base}/Dockerfile`)
  } else if (/ros|gazebo|moveit/.test(lower)) {
    files.push(`${base}/CMakeLists.txt`, `${base}/package.xml`, `${base}/src/main.cpp`)
    files.push(`${base}/src/perception_node.cpp`, `${base}/src/control_node.cpp`, `${base}/config/params.yaml`)
    files.push(`${base}/launch/system.launch.py`, `${base}/urdf/robot.urdf`)
  } else if (/qiskit|pennylane|cirq|quantum/.test(lower)) {
    files.push(`${base}/requirements.txt`, `${base}/main.py`, `${base}/quantum_circuit.py`)
    files.push(`${base}/hybrid_model.py`, `${base}/optimizer.py`, `${base}/utils.py`)
    files.push(`${base}/Dockerfile`, `${base}/config.yaml`)
  } else if (/unity|unreal|godot/.test(lower)) {
    files.push(`${base}/ProjectSettings.asset`, `${base}/Packages/manifest.json`)
    files.push(`${base}/Assets/Scripts/GameManager.cs`, `${base}/Assets/Scripts/PlayerController.cs`)
    files.push(`${base}/Assets/Scripts/EnemyAI.cs`, `${base}/Assets/Scenes/MainScene.unity`)
  } else if (/solidity|hardhat|ethereum/.test(lower)) {
    files.push(`${base}/hardhat.config.js`, `${base}/package.json`, `${base}/contracts/Token.sol`)
    files.push(`${base}/contracts/Pool.sol`, `${base}/scripts/deploy.js`, `${base}/test/Token.test.js`)
    files.push(`${base}/frontend/index.html`, `${base}/frontend/app.js`)
  } else if (/spark|kafka|airflow/.test(lower)) {
    files.push(`${base}/docker-compose.yml`, `${base}/Dockerfile`, `${base}/pipeline.py`)
    files.push(`${base}/dags/etl_dag.py`, `${base}/config.yaml`, `${base}/requirements.txt`)
    files.push(`${base}/scripts/init_db.py`, `${base}/notebooks/analysis.ipynb`)
  } else if (/edge impulse|tensorflow lite|esp32|arduino/.test(lower)) {
    files.push(`${base}/platformio.ini`, `${base}/src/main.ino`, `${base}/src/config.h`)
    files.push(`${base}/src/sensors.cpp`, `${base}/src/wifi_manager.cpp`, `${base}/src/mqtt_client.cpp`)
  } else {
    files.push(`${base}/package.json`, `${base}/index.js`, `${base}/config.js`)
    files.push(`${base}/src/app.js`, `${base}/src/utils.js`, `${base}/README.md`, `${base}/Dockerfile`)
  }

  return [...new Set(files)]
}

function generateFileContents(files, title, description, techStack) {
  const contents = {}
  const lower = techStack.join(" ").toLowerCase()

  for (const path of files) {
    const name = path.split("/").pop()
    if (name === "README.md") {
      contents[path] = `# ${title}\n\n${description}\n\n## Tech Stack\n\n${techStack.map(t => `- ${t}`).join("\n")}\n\n## Getting Started\n\n\`\`\`bash\n# Install dependencies\nnpm install\n\n# Run the project\nnpm run dev\n\`\`\`\n\n## Features\n\n- Built with ${techStack.join(", ")}\n- Production-ready architecture\n- Comprehensive documentation`
    } else if (name === "package.json") {
      contents[path] = JSON.stringify({ name: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), version: "1.0.0", private: true, scripts: { dev: "next dev", build: "next build", start: "next start" }, dependencies: { next: "^14.0.0", react: "^18.0.0", "react-dom": "^18.0.0" } }, null, 2)
    } else if (name === "tsconfig.json") {
      contents[path] = JSON.stringify({ compilerOptions: { target: "ES2017", lib: ["dom", "dom.iterable", "esnext"], allowJs: true, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true, jsx: "preserve", incremental: true, plugins: [{ name: "next" }] }, include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], exclude: ["node_modules"] }, null, 2)
    } else if (name === "tailwind.config.js") {
      contents[path] = `/** @type {import('tailwindcss').Config} */\nmodule.exports = { content: ["./src/**/*.{js,ts,jsx,tsx}"], theme: { extend: {} }, plugins: [], }`
    } else if (name.endsWith(".tsx") || name.endsWith(".jsx")) {
      const compName = name.replace(/\.(tsx|jsx)$/, "")
      contents[path] = `import React from 'react';\n\nexport default function ${compName}() {\n  return (\n    <div className="p-4">\n      <h1 className="text-2xl font-bold">${compName}</h1>\n      <p className="text-zinc-600 mt-2">${title} - ${compName} component</p>\n    </div>\n  );\n}`
    } else if (name.endsWith(".ts") || name.endsWith(".js")) {
      const baseName = name.replace(/\.(ts|js)$/, "")
      contents[path] = `// ${baseName} - ${title}\n\nexport const ${baseName}Config = {\n  appName: "${title}",\n  version: "1.0.0",\n};\n\nexport async function ${baseName}Handler() {\n  console.log("${baseName} initialized");\n  return { status: "ok" };\n}`
    } else if (name.endsWith(".py")) {
      const baseName = name.replace(".py", "")
      contents[path] = `"""${baseName} module for ${title}"""\nimport os\nfrom typing import Any\n\n\nclass ${baseName.charAt(0).toUpperCase() + baseName.slice(1)}:\n    """Main handler for ${baseName}."""\n    def __init__(self):\n        self.name = "${title}"\n    def process(self) -> dict:\n        return {"status": "running", "app": self.name}\n\n\nif __name__ == "__main__":\n    app = ${baseName.charAt(0).toUpperCase() + baseName.slice(1)}()\n    print(app.process())`
    } else if (name.endsWith(".dart")) {
      const baseName = name.replace(".dart", "")
      const widgetName = baseName.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("")
      contents[path] = `import 'package:flutter/material.dart';\n\nclass ${widgetName} extends StatelessWidget {\n  const ${widgetName}({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(title: const Text('${title}')),\n      body: const Center(child: Text('${widgetName}')),\n    );\n  }\n}`
    } else if (name.endsWith(".cs")) {
      const baseName = name.replace(".cs", "")
      contents[path] = `using UnityEngine;\n\npublic class ${baseName} : MonoBehaviour {\n    void Start() { Debug.Log("${baseName} initialized for ${title}"); }\n    void Update() { }\n}`
    } else if (name.endsWith(".sol")) {
      contents[path] = `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract ${name.replace(".sol", "")} {\n    string public name = "${title}";\n    constructor() { }\n    function getInfo() external view returns (string memory) { return name; }\n}`
    } else if (name === ".env.example") {
      contents[path] = `# ${title} Environment Configuration\nAPP_NAME=${title}\nNODE_ENV=development\nPORT=3000\nDATABASE_URL=postgresql://localhost:5432/${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}\n`
    } else if (name === "Dockerfile") {
      contents[path] = `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "run", "dev"]`
    } else if (name === "docker-compose.yml") {
      contents[path] = `version: "3.8"\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    volumes:\n      - .:/app`
    } else if (name === "requirements.txt") {
      contents[path] = `fastapi==0.104.0\nuvicorn==0.24.0\npydantic==2.5.0\npython-dotenv==1.0.0`
    } else if (name === "pubspec.yaml") {
      contents[path] = `name: ${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}\ndescription: "${title}"\npublish_to: "none"\nversion: 1.0.0\n\nenvironment:\n  sdk: ">=3.0.0 <4.0.0"\n\ndependencies:\n  flutter:\n    sdk: flutter\n  cupertino_icons: ^1.0.6`
    } else if (name === "CMakeLists.txt") {
      contents[path] = `cmake_minimum_required(VERSION 3.10)\nproject(${title.replace(/[^a-zA-Z]/g, "")})\nfind_package(catkin REQUIRED COMPONENTS roscpp std_msgs sensor_msgs)\ncatkin_package()\ninclude_directories(include \${catkin_INCLUDE_DIRS})\nadd_executable(main_node src/main.cpp)\ntarget_link_libraries(main_node \${catkin_LIBRARIES})`
    } else if (name === "hardhat.config.js") {
      contents[path] = `module.exports = { solidity: "0.8.20", networks: { localhost: { url: "http://127.0.0.1:8545" } } };`
    } else if (name === "globals.css" || name.endsWith(".css")) {
      contents[path] = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody { font-family: system-ui, sans-serif; }`
    } else {
      contents[path] = `// ${path} — ${title}\n// Auto-generated module\nconsole.log("${path} loaded");\n`
    }
  }
  return contents
}

/* ---------- Project Data (78 projects) ---------- */

const projectsData = [
  // Mobile Apps (12)
  { title: "ShopEase", description: "Full-featured e-commerce app with AI-powered recommendations, real-time inventory, and seamless checkout.\n\n- AI product recommendations using collaborative filtering\n- Real-time inventory sync with supplier systems\n- Stripe payments, Apple Pay, Google Pay", techStack: ["Flutter", "Firebase", "TensorFlow Lite", "Stripe", "Google Maps"] },
  { title: "HealthTrack Pro", description: "AI-driven health tracking app with workout plans, diet recommendations, and progress analytics.\n\n- AI workout generation based on user goals\n- Real-time health metrics sync with wearables\n- Social features with challenges and leaderboards", techStack: ["React Native", "Node.js", "OpenAI", "MongoDB", "WebSockets"] },
  { title: "RideFlow", description: "Complete ride-hailing app with AI-based demand prediction, dynamic pricing, and real-time driver matching.\n\n- AI demand forecasting for driver allocation\n- Dynamic surge pricing engine with ML\n- Real-time ETA prediction with traffic data", techStack: ["Flutter", "Firebase", "TensorFlow", "Google Maps", "Stripe"] },
  { title: "FitMind", description: "AI-powered mental wellness app with personalized meditation, mood tracking, and cognitive behavioral therapy exercises.\n\n- Personalized meditation with mood-based AI selection\n- Mood pattern recognition with journal analysis\n- CBT exercise recommendations with progress tracking", techStack: ["React Native", "OpenAI", "Node.js", "MongoDB", "Firebase"] },
  { title: "Foodie AI", description: "AI-powered food delivery app with personalized meal recommendations, dietary preference learning, and smart ordering.\n\n- Personalized meal recommendations with collaborative filtering\n- Dietary preference learning from order history\n- Smart reorder with one-tap checkout", techStack: ["Flutter", "Firebase", "TensorFlow Lite", "Stripe", "Google Maps"] },
  { title: "TravelBuddy", description: "AI travel planning app with itinerary optimization, price prediction, and personalized destination recommendations.\n\n- AI itinerary optimization with time/distance constraints\n- Flight price prediction with ML models\n- Personalized destination recommendations", techStack: ["React Native", "Python", "Node.js", "MongoDB", "Google Maps"] },
  { title: "PayMate", description: "AI-driven personal finance app with spending categorization, savings optimization, and fraud detection.\n\n- Automatic spending categorization with NLP\n- AI-powered savings goal optimization\n- Real-time fraud detection with anomaly detection", techStack: ["Flutter", "Python", "TensorFlow", "PostgreSQL", "Plaid"] },
  { title: "StudyMate AI", description: "AI tutoring app with personalized learning paths, adaptive quizzes, and progress tracking for students.\n\n- Adaptive learning paths based on knowledge gaps\n- AI-generated practice questions with difficulty scaling\n- Progress analytics with mastery tracking", techStack: ["React Native", "OpenAI", "Firebase", "Node.js", "Python"] },
  { title: "EventHub Pro", description: "All-in-one event management app with AI-powered attendee matching, schedule optimization, and networking features.\n\n- AI attendee matching based on interests and goals\n- Smart schedule optimization with conflict resolution\n- Virtual networking with icebreaker suggestions", techStack: ["Flutter", "Node.js", "OpenAI", "MongoDB", "WebSockets"] },
  { title: "PetCare AI", description: "AI-powered pet care app with health monitoring, diet tracking, and veterinary appointment management.\n\n- AI health monitoring from activity patterns\n- Personalized diet recommendations based on breed/age\n- Veterinary telemedicine with symptom analysis", techStack: ["React Native", "TensorFlow Lite", "Firebase", "Node.js", "MongoDB"] },
  { title: "FitSocial", description: "Gamified fitness social network with AI coaching, workout challenges, and community-driven motivation.\n\n- AI personal trainer with form correction via camera\n- Gamified challenges with leaderboards and rewards\n- Social feed with workout sharing and motivation", techStack: ["Flutter", "TensorFlow Lite", "Firebase", "OpenAI", "Stripe"] },
  { title: "HabitForge", description: "AI-powered habit formation app with personalized reminders, streak tracking, and behavioral psychology insights.\n\n- AI habit recommendations based on personality type\n- Streak-based gamification with reward system\n- Behavioral analytics with relapse prediction", techStack: ["React Native", "Node.js", "OpenAI", "MongoDB", "Firebase"] },

  // Web Apps (10)
  { title: "CloudDash", description: "Modern SaaS dashboard with real-time analytics, team collaboration, and AI-powered business intelligence.\n\n- Real-time data visualization with WebSocket updates\n- AI-powered anomaly detection on metrics\n- Multi-tenant architecture with role-based access", techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"] },
  { title: "DevForge", description: "AI-augmented development platform with automated code reviews, documentation generation, and CI/CD pipelines.\n\n- AI code review with style enforcement\n- Auto-generated API documentation\n- Integrated CI/CD with GitHub Actions", techStack: ["React", "Python", "FastAPI", "Redis", "Docker"] },
  { title: "AnalytixPro", description: "Enterprise analytics platform with AI-powered insights, customizable dashboards, and real-time data pipeline monitoring.\n\n- AI insight generation from data patterns\n- Custom dashboard builder with drag-and-drop\n- Real-time data pipeline monitoring with alerts", techStack: ["Next.js", "Python", "FastAPI", "PostgreSQL", "D3.js"] },
  { title: "DocuMind", description: "AI-powered document processing platform that extracts, classifies, and analyzes information from PDFs, images, and scanned documents.\n\n- Intelligent document parsing with layout understanding\n- Automated classification with custom taxonomies\n- Data extraction with confidence scoring and review", techStack: ["React", "Python", "GPT-4", "PostgreSQL", "Redis"] },
  { title: "CollabSpace", description: "Modern team collaboration platform with AI meeting summaries, smart document editing, and integrated project management.\n\n- AI meeting transcription and summary generation\n- Real-time collaborative document editing\n- Integrated project management with timeline view", techStack: ["Next.js", "WebSockets", "OpenAI", "PostgreSQL", "Redis"] },
  { title: "MarketPulse", description: "Real-time market intelligence platform with AI trend detection, competitor analysis, and automated report generation.\n\n- AI trend detection from news and social media\n- Automated competitor analysis with monitoring\n- Custom report generation with scheduled delivery", techStack: ["React", "Python", "FastAPI", "MongoDB", "D3.js"] },
  { title: "WorkflowPro", description: "Business process automation platform with AI workflow design, drag-and-drop builder, and integration with 200+ services.\n\n- AI workflow design from natural language description\n- Visual drag-and-drop process builder\n- Integration marketplace with 200+ connectors", techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Docker"] },
  { title: "LearnPath", description: "AI-powered learning management system with personalized course recommendations, auto-generated quizzes, and progress analytics.\n\n- Personalized learning paths with adaptive difficulty\n- Auto-generated quizzes from course material\n- Engagement analytics with dropout prediction", techStack: ["React", "Python", "OpenAI", "PostgreSQL", "Redis"] },
  { title: "ContentForge", description: "AI-augmented CMS with auto-generated content, intelligent SEO optimization, and multi-channel publishing.\n\n- AI content generation with brand voice consistency\n- Real-time SEO scoring with actionable suggestions\n- Multi-channel publishing with scheduling", techStack: ["Next.js", "GPT-4", "PostgreSQL", "Redis", "Tailwind"] },
  { title: "BudgetFlow", description: "AI-driven financial planning platform with cash flow forecasting, scenario modeling, and automated budget optimization.\n\n- Cash flow forecasting with ML\n- Scenario modeling with Monte Carlo simulation\n- Automated budget optimization with goal tracking", techStack: ["React", "Python", "FastAPI", "PostgreSQL", "D3.js"] },

  // AI Agents (12)
  { title: "AutoBiz Assistant", description: "Autonomous AI agent that handles customer inquiries, schedules appointments, and processes orders 24/7.\n\n- LLM-powered conversation with context retention\n- Autonomous task execution (scheduling, ordering)\n- Integration with CRM, calendar, and payment systems", techStack: ["LangChain", "OpenAI", "Pinecone", "FastAPI", "Twilio"] },
  { title: "DataPulse Analytics", description: "Intelligent data analysis agent that connects to databases and generates insights, charts, and reports on demand.\n\n- Natural language to SQL query generation\n- Automated report generation with insights\n- Multi-source data aggregation (SQL, NoSQL, APIs)", techStack: ["LangGraph", "GPT-4", "PostgreSQL", "ChromaDB", "Streamlit"] },
  { title: "MarketMind Agent", description: "Autonomous marketing agent that creates campaigns, analyzes performance, and optimizes ad spend across channels.\n\n- Automated campaign creation with A/B testing\n- Cross-channel ad spend optimization with RL\n- Performance analysis with natural language reports", techStack: ["LangChain", "OpenAI", "Facebook API", "Google Ads", "Python"] },
  { title: "SupportBot Pro", description: "Enterprise customer support agent with context-aware conversation, multi-language support, and human handoff.\n\n- Context-aware conversations with full history\n- Multi-language support with real-time translation\n- Intelligent human handoff with context transfer", techStack: ["LangChain", "GPT-4", "Pinecone", "Twilio", "Node.js"] },
  { title: "RecruitBot", description: "Autonomous recruitment agent that sources candidates, screens resumes, and schedules interviews end-to-end.\n\n- Automated candidate sourcing from job boards\n- Resume screening with skill-based ranking\n- End-to-end interview scheduling with email automation", techStack: ["LangChain", "OpenAI", "LinkedIn API", "PostgreSQL", "Python"] },
  { title: "TradeAgent", description: "Autonomous trading agent with multi-asset portfolio management, risk analysis, and market sentiment monitoring.\n\n- Multi-asset portfolio rebalancing with RL\n- Market sentiment analysis from news & social media\n- Risk management with VaR and stress testing", techStack: ["LangGraph", "OpenAI", "Python", "Redis", "Alpha Vantage"] },
  { title: "ComplianceGuard", description: "AI compliance monitoring agent that scans communications, flags violations, and generates audit reports.\n\n- Real-time communication monitoring with NLP\n- Regulatory violation flagging with rule engine\n- Automated audit trail and report generation", techStack: ["LangChain", "GPT-4", "ChromaDB", "Python", "PostgreSQL"] },
  { title: "ResearchRover", description: "Autonomous research agent that conducts literature reviews, extracts findings, and generates research summaries.\n\n- Automated literature search across 100M+ papers\n- Finding extraction with citation management\n- Research summary generation with key insights", techStack: ["LangChain", "OpenAI", "Pinecone", "Python", "FastAPI"] },
  { title: "DevOpsBot", description: "Autonomous DevOps agent that monitors infrastructure, diagnoses issues, and executes remediation actions.\n\n- Infrastructure monitoring with anomaly detection\n- Automated root cause analysis from logs\n- Self-healing remediation with rollback safety", techStack: ["LangChain", "Python", "Docker", "Kubernetes", "Prometheus"] },
  { title: "TravelAgent AI", description: "End-to-end travel planning agent that books flights, hotels, and creates personalized itineraries.\n\n- Multi-city itinerary optimization\n- Real-time price monitoring and booking\n- Personalized activity recommendations", techStack: ["LangChain", "OpenAI", "Amadeus API", "Python", "Redis"] },
  { title: "LegalLens", description: "AI legal research agent that analyzes contracts, identifies clauses, and generates legal memoranda.\n\n- Contract clause extraction and classification\n- Risk clause identification with legal ontology\n- Legal memo generation with citation support", techStack: ["LangChain", "GPT-4", "ChromaDB", "Python", "FastAPI"] },
  { title: "MedAgent", description: "AI medical assistant agent for clinical decision support, patient triage, and medical literature retrieval.\n\n- Clinical decision support with evidence-based recommendations\n- Patient triage with severity assessment\n- Medical literature retrieval with RAG pipeline", techStack: ["LangChain", "GPT-4", "Pinecone", "FHIR API", "Python"] },

  // Agentic AI (6)
  { title: "OrchestraNet", description: "Hierarchical multi-agent system where specialized sub-agents collaborate under a super-agent to solve complex business workflows autonomously.\n\n- Supervisor agent delegating to specialist sub-agents\n- Dynamic tool-use planning and recursive task decomposition\n- Self-healing agent loops with error recovery and re-planning", techStack: ["CrewAI", "LangGraph", "GPT-4o", "Weaviate", "Temporal"] },
  { title: "CodeForge Agent", description: "End-to-end software development agent that writes code, runs tests, debugs, and deploys applications from natural language requirements.\n\n- Autonomous code generation with multi-file editing\n- Self-testing and iterative bug fixing loop\n- Auto-deployment to cloud with infrastructure-as-code", techStack: ["Claude", "Code Interpreter", "Docker", "Kubernetes", "GitHub"] },
  { title: "SynthraNet", description: "Visual agent orchestration platform for designing, testing, and deploying complex multi-agent workflows with drag-and-drop.\n\n- Visual workflow builder with drag-and-drop agent nodes\n- Real-time agent collaboration monitoring\n- Built-in evaluation and performance analytics", techStack: ["AutoGen", "LangGraph", "React", "Python", "Neo4j"] },
  { title: "AgentForge Studio", description: "Full IDE for building, testing, and deploying custom AI agents with integrated debugging and version control.\n\n- Visual agent state machine designer\n- Step-through debugging with breakpoints\n- Agent registry with versioning and rollback", techStack: ["LangChain", "Next.js", "FastAPI", "Docker", "Git"] },
  { title: "CogniFlow", description: "Event-driven agent pipeline for processing complex business workflows with human-in-the-loop approval gates.\n\n- Event-driven agent chain execution\n- Human-in-the-loop approval with Slack integration\n- Audit logging with full traceability", techStack: ["Temporal", "LangGraph", "TypeScript", "PostgreSQL", "Slack API"] },
  { title: "MultiMind", description: "Ensemble of specialized AI agents collaborating via debate and consensus to solve complex reasoning tasks.\n\n- Multi-agent debate with structured argumentation\n- Consensus-building with weighted voting\n- Self-improving agents with learned collaboration", techStack: ["CrewAI", "GPT-4o", "Claude", "Weaviate", "Python"] },

  // AGI (6)
  { title: "CogniCore AGI Sandbox", description: "Experimental AGI architecture combining system-2 reasoning, self-reflection, memory consolidation, and chain-of-thought planning.\n\n- Meta-cognition layer with self-reflection and correction\n- Episodic memory with recall and consolidation pipelines\n- Multi-step reasoning with verifiable intermediate steps", techStack: ["PyTorch", "DeepSpeed", "vLLM", "Qdrant", "Neo4j"] },
  { title: "OmniReasoner", description: "Hybrid symbolic-neural reasoning system combining probabilistic inference with logical deduction for transparent decision-making.\n\n- Neuro-symbolic reasoning with differentiable logic\n- Explainable AI with traceable decision graphs\n- Continuous learning with online knowledge updates", techStack: ["TensorFlow", "Rust", "ONNX", "SPARQL", "JAX"] },
  { title: "MetaThink", description: "Self-aware reasoning system with recursive self-improvement, theory of mind modeling, and introspection capabilities.\n\n- Recursive self-improvement with automated architecture search\n- Theory of mind modeling for human interaction\n- Introspection with confidence calibration", techStack: ["PyTorch", "JAX", "DeepSpeed", "vLLM", "Redis"] },
  { title: "UniLearn", description: "Continuous learning system that accumulates knowledge across tasks without catastrophic forgetting using elastic weight consolidation.\n\n- Lifelong learning with elastic weight consolidation\n- Cross-task knowledge transfer with skill composition\n- Automatic curriculum learning with difficulty progression", techStack: ["PyTorch", "JAX", "TensorFlow", "Weaviate", "Python"] },
  { title: "ReasonNet", description: "Graph-based reasoning engine that constructs dynamic knowledge graphs from unstructured text for multi-hop inference.\n\n- Dynamic knowledge graph construction from text\n- Multi-hop reasoning with graph traversal\n- Causal inference with counterfactual reasoning", techStack: ["PyTorch", "Neo4j", "SPARQL", "Qdrant", "Python"] },
  { title: "WorldModeler", description: "World modeling system that builds internal generative models of environments for planning, simulation, and counterfactual reasoning.\n\n- Generative world model with environment simulation\n- Planning with Monte Carlo tree search\n- Counterfactual reasoning for decision analysis", techStack: ["PyTorch", "JAX", "DeepSpeed", "MuJoCo", "Python"] },

  // Quantum AI (6)
  { title: "QubitML", description: "Hybrid quantum-classical ML platform for high-dimensional optimization and feature mapping.\n\n- Variational quantum eigensolver for feature selection\n- Quantum kernel methods for SVM acceleration\n- Hybrid classical-quantum neural network training", techStack: ["Qiskit", "Pennylane", "Cirq", "CUDA-Q", "scikit-learn"] },
  { title: "QuantumOptim", description: "Quantum annealing and QAOA-based optimization solver for logistics, portfolio optimization, and supply chain routing.\n\n- QAOA for combinatorial optimization (TSP, knapsack)\n- Quantum annealing integration with D-Wave systems\n- Classical-quantum hybrid solver with fallback modes", techStack: ["D-Wave Ocean", "Qiskit", "IBM Quantum", "AWS Braket", "NumPy"] },
  { title: "QuantumML Suite", description: "Comprehensive library of quantum ML algorithms with classical fallbacks and automatic hardware selection.\n\n- 30+ QML algorithms with unified API\n- Automatic quantum hardware selection\n- Classical fallback with transparent switching", techStack: ["Pennylane", "Qiskit", "Cirq", "JAX", "scikit-learn"] },
  { title: "QBoost", description: "Quantum-enhanced gradient boosting framework using quantum annealing for optimal tree structure discovery.\n\n- Quantum annealing for optimal decision tree splits\n- Hybrid classical-quantum ensemble training\n- Speedup over classical XGBoost on large feature sets", techStack: ["D-Wave Ocean", "XGBoost", "scikit-learn", "NumPy", "Python"] },
  { title: "QuantumChem", description: "Quantum chemistry simulation platform using VQE and quantum phase estimation for molecular energy calculations.\n\n- VQE for ground state energy estimation\n- Quantum phase estimation for precision chemistry\n- Molecular Hamiltonian construction and optimization", techStack: ["Qiskit", "Pennylane", "Cirq", "Psi4", "Python"] },
  { title: "QryptoNet", description: "Quantum-safe cryptography platform with QKD simulation, post-quantum crypto algorithms, and security analysis tools.\n\n- Quantum key distribution (QKD) simulation\n- Post-quantum cryptographic algorithm suite\n- Security analysis with quantum attack simulation", techStack: ["Qiskit", "Cirq", "Python", "OpenSSL", "Rust"] },

  // AI Robotics (5)
  { title: "RoboVision AI", description: "AI-powered robotic perception system with real-time object detection, SLAM navigation, and adaptive grasping for industrial automation.\n\n- Real-time YOLO-based object detection and tracking\n- Simultaneous localization and mapping (SLAM)\n- Adaptive robotic arm control with reinforcement learning", techStack: ["ROS 2", "OpenCV", "PyTorch", "NVIDIA Jetson", "MoveIt"] },
  { title: "SwarmLogic", description: "Decentralized multi-robot swarm coordination system with AI-driven task allocation, collision avoidance, and collective decision-making.\n\n- Swarm intelligence with decentralized consensus\n- Multi-robot path planning with conflict resolution\n- AI-driven task allocation based on robot capabilities", techStack: ["ROS 2", "Gazebo", "TensorFlow", "C++", "MQTT"] },
  { title: "GraspMaster", description: "Learning-based robotic grasping system adapting to novel objects through simulation-to-real transfer with domain randomization.\n\n- Sim-to-real transfer with domain randomization\n- Adaptive grasping for novel object geometries\n- Force-sensitive grip control with tactile feedback", techStack: ["PyTorch", "Isaac Gym", "ROS 2", "MoveIt", "C++"] },
  { title: "NavCore", description: "End-to-end autonomous navigation stack with deep reinforcement learning for dynamic obstacle avoidance and path planning.\n\n- DRL-based navigation with dynamic obstacle avoidance\n- Semantic mapping with scene understanding\n- Multi-terrain adaptation with learned locomotion", techStack: ["ROS 2", "PyTorch", "Gazebo", "NVIDIA Jetson", "C++"] },
  { title: "Humanoid Pilot", description: "Whole-body control system for humanoid robots using deep reinforcement learning with imitation from human motion capture.\n\n- Whole-body control with 30+ DOF coordination\n- Imitation learning from human motion capture\n- Dynamic balance recovery with fall prevention", techStack: ["PyTorch", "MuJoCo", "ROS 2", "C++", "NVIDIA Isaac"] },

  // AI Semiconductors (5)
  { title: "ChipSense AI", description: "ML-driven semiconductor design platform optimizing transistor placement, thermal distribution, and routing using RL and GNNs.\n\n- GNN-based placement optimization for 3nm node designs\n- RL-driven routing with DRC violation reduction\n- Thermal-aware floorplanning with AI prediction models", techStack: ["GNN", "Reinforcement Learning", "PyTorch", "EDA Tools", "SkyWater PDK"] },
  { title: "NeuromorphicCore", description: "Event-driven neuromorphic processor design with spiking neural networks for ultra-low-power edge AI inference.\n\n- SNN-based accelerator with 100x power efficiency vs CMOS\n- On-chip learning with STDP plasticity rules\n- Event-driven architecture for always-on sensor processing", techStack: ["Spiking Neural Nets", "Lava", "Nengo", "Verilog", "Intel Loihi 2"] },
  { title: "PhotoFlow", description: "Silicon photonic AI accelerator design using integrated photonic circuits for ultra-fast matrix multiplication.\n\n- Integrated photonic tensor cores for matrix multiply\n- WDM-based analog compute with wavelength parallelism\n- CMOS-compatible photonic foundry process", techStack: ["Verilog", "Python", "Lumerical", "SkyWater PDK", "Spiking Neural Nets"] },
  { title: "ThermaCool AI", description: "AI-driven thermal management system for semiconductor chips predicting hotspots and dynamically adjusting voltage/frequency.\n\n- Hotspot prediction with spatiotemporal graph networks\n- Dynamic DVFS with reinforcement learning\n- Multi-core thermal balancing with workload migration", techStack: ["GNN", "Reinforcement Learning", "PyTorch", "Verilog", "SPICE"] },
  { title: "RouteOptim", description: "Learning-based chip routing engine using attention mechanisms to find optimal routing paths with DRC closure guarantees.\n\n- Attention-based global routing with congestion prediction\n- DRC-aware detailed routing with automated fixing\n- Parallel routing with hierarchical decomposition", techStack: ["PyTorch", "GNN", "EDA Tools", "C++", "Python"] },

  // AIoT (5)
  { title: "SmartFactory AI", description: "End-to-end AIoT platform for smart manufacturing with predictive maintenance, quality inspection, and production optimization.\n\n- Predictive maintenance with vibration analysis\n- AI visual quality inspection on production line\n- Production optimization with digital twin simulation", techStack: ["Edge Impulse", "TensorFlow Lite", "MQTT", "InfluxDB", "AWS IoT"] },
  { title: "AgriSense", description: "AI-powered agricultural IoT system with soil monitoring, crop health analysis, and automated irrigation control.\n\n- Soil nutrient monitoring with multi-sensor fusion\n- Crop health analysis from multispectral imagery\n- AI-optimized irrigation scheduling with weather data", techStack: ["LoRaWAN", "Edge Impulse", "TensorFlow Lite", "InfluxDB", "AWS IoT"] },
  { title: "CityPulse", description: "Smart city IoT platform integrating traffic, air quality, waste management, and energy monitoring with AI-driven optimization.\n\n- Multi-domain city sensor integration\n- Traffic flow optimization with reinforcement learning\n- Energy consumption optimization for street lighting", techStack: ["MQTT", "LoRaWAN", "TimescaleDB", "TensorFlow", "AWS IoT"] },
  { title: "EnergyWise", description: "AIoT energy management system for buildings with real-time monitoring, demand forecasting, and automated HVAC optimization.\n\n- Real-time energy monitoring with sub-metering\n- HVAC optimization with reinforcement learning\n- Demand response automation with utility integration", techStack: ["Edge Impulse", "MQTT", "InfluxDB", "TensorFlow Lite", "AWS IoT"] },
  { title: "FleetPilot AI", description: "AI-powered fleet management platform with real-time tracking, predictive maintenance, and route optimization for logistics.\n\n- Real-time GPS tracking with geofencing\n- Predictive maintenance from vehicle telemetry\n- AI route optimization with traffic prediction", techStack: ["MQTT", "InfluxDB", "TensorFlow", "AWS IoT", "TimescaleDB"] },

  // AI + Biotechnology (5)
  { title: "MolecuLearn", description: "Deep learning platform for drug discovery with molecular generation, property prediction, and virtual screening.\n\n- De novo molecular generation with reinforcement learning\n- ADMET property prediction with graph neural networks\n- Virtual screening with docking score prediction", techStack: ["RDKit", "DeepChem", "PyTorch", "AlphaFold", "Python"] },
  { title: "GenomePilot", description: "AI-powered genomic analysis platform for variant calling, interpretation, and clinical reporting with population-scale processing.\n\n- Deep learning variant calling from WGS data\n- Clinical variant interpretation with ACMG guidelines\n- Population-scale processing with distributed computing", techStack: ["GATK", "DeepVariant", "TensorFlow", "PyTorch", "Python"] },
  { title: "CRISPR Design AI", description: "AI platform for CRISPR guide RNA design with off-target prediction, knockout efficiency scoring, and multiplex editing optimization.\n\n- Guide RNA design with on-target efficiency prediction\n- Off-target prediction with deep learning\n- Multiplex editing optimization with combinatorial design", techStack: ["DeepCRISPR", "PyTorch", "Python", "TensorFlow", "RDKit"] },
  { title: "ProtFold", description: "Deep learning platform for protein structure prediction, de novo protein design, and protein-protein interaction analysis.\n\n- Protein structure prediction with ESM-2\n- De novo protein design with inverse folding\n- Protein-protein interaction prediction with GNNs", techStack: ["AlphaFold", "ESM-2", "PyTorch", "RDKit", "Python"] },
  { title: "MetaBiome", description: "AI platform for metagenomic analysis with taxonomic classification, functional profiling, and biomarker discovery from microbiome data.\n\n- Metagenomic taxonomic classification with deep learning\n- Functional profiling with pathway enrichment\n- Microbiome biomarker discovery for disease diagnosis", techStack: ["MetaPhlan", "PyTorch", "TensorFlow", "BioPython", "Python"] },

  // AI + Neural Science (6)
  { title: "BrainDecode", description: "Deep learning platform for EEG/ECoG signal decoding with real-time brain activity classification and cognitive state monitoring.\n\n- EEG signal decoding with convolutional neural networks\n- Real-time cognitive state monitoring\n- Brain-computer interface with closed-loop feedback", techStack: ["MNE-Python", "PyTorch", "TensorFlow", "EEGLAB", "Python"] },
  { title: "ConnectoViz", description: "AI-powered connectomics platform for whole-brain tractography, neural circuit reconstruction, and network analysis.\n\n- Whole-brain tractography with deep learning\n- Neural circuit reconstruction from electron microscopy\n- Brain network analysis with graph theory", techStack: ["FreeSurfer", "MRtrix", "PyTorch", "TensorFlow", "Python"] },
  { title: "OptoLoop", description: "Closed-loop optogenetics control system with real-time neural activity monitoring and adaptive light stimulation.\n\n- Real-time neural activity monitoring with calcium imaging\n- Adaptive light stimulation with closed-loop control\n- Multi-site optogenetic targeting with spatial precision", techStack: ["Open Ephys", "Python", "PyTorch", "SIMNIBS", "C++"] },
  { title: "BrainAtlas AI", description: "AI platform for brain atlas registration, segmentation, and analysis with cross-species atlas alignment capabilities.\n\n- Automated brain atlas registration with deep learning\n- Multi-region segmentation with sub-millimeter precision\n- Cross-species atlas alignment for translational research", techStack: ["FreeSurfer", "ANTs", "PyTorch", "TensorFlow", "Python"] },
  { title: "NeuroCog", description: "AI-powered cognitive assessment platform with adaptive testing, cognitive decline prediction, and personalized intervention recommendations.\n\n- Adaptive cognitive testing with item response theory\n- Cognitive decline prediction with longitudinal analysis\n- Personalized intervention recommendations with ML", techStack: ["PyTorch", "Python", "TensorFlow", "Redis", "PostgreSQL"] },
  { title: "DeepStim", description: "AI-optimized neurostimulation platform for TMS/tDCS with personalized stimulation parameters and real-time EEG feedback.\n\n- Personalized stimulation parameter optimization\n- Real-time EEG feedback for closed-loop adjustment\n- Electric field simulation with finite element modeling", techStack: ["SIMNIBS", "MNE-Python", "Python", "PyTorch", "Open Ephys"] },
]

/* ---------- Main ---------- */

function seed() {
  console.log("🌱 Seeding 78 pre-built projects...\n")

  // Generate real bcrypt hash for demo user password
  const passwordHash = bcrypt.hashSync("demo123", 10)
  const userId = uuidv4()

  // Check if demo user already exists
  const existingUser = db.prepare("SELECT id, role FROM User WHERE email = ?").get("demo@blueprintai.com")
  let effectiveUserId = userId

  if (existingUser) {
    console.log(`  ✅ Using existing demo user: demo@blueprintai.com`)
    effectiveUserId = existingUser.id
    // Ensure role is set to admin
    if (existingUser.role !== "admin") {
      db.prepare("UPDATE User SET role = 'admin' WHERE id = ?").run(existingUser.id)
      console.log(`  👑 Upgraded to admin role`)
    } else {
      console.log(`  👑 Already an admin`)
    }
  } else {
    // Create demo user as admin
    const now = new Date().toISOString()
    db.prepare("INSERT INTO User (id, name, email, password, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)").run(userId, "Demo Admin", "demo@blueprintai.com", passwordHash, "admin", now)
    console.log(`  ✅ Created admin user: demo@blueprintai.com / demo123`)
  }

  // Count existing projects
  const existingCount = db.prepare("SELECT COUNT(*) as c FROM Project WHERE userId = ?").get(effectiveUserId)
  if (existingCount.c >= 78) {
    console.log(`  ⏭️  ${existingCount.c} projects already exist — skipping.`)
    console.log("\n🌱 Seed complete!")
    db.close()
    return
  }

  // Remove old seed projects
  if (existingCount.c > 0) {
    console.log(`  🗑️  Removing ${existingCount.c} existing seed projects...`)
    db.prepare("DELETE FROM Project WHERE userId = ?").run(effectiveUserId)
  }

  // Prepare insert statement
  const insert = db.prepare(
    "INSERT INTO Project (id, title, description, prompt, techStack, files, structure, createdAt, updatedAt, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )

  // Use a transaction for speed
  const insertMany = db.transaction((projects) => {
    const now = new Date().toISOString()
    for (const p of projects) {
      const id = uuidv4()
      const techStackStr = JSON.stringify(p.techStack)
      const structure = generateStructure(p.techStack)
      const fileContents = generateFileContents(structure, p.title, p.description, p.techStack)
      const files = structure.map(path => ({ path, content: fileContents[path] || "" }))
      const prompt = `Generate ${p.title}: ${p.description.split("\n")[0]}`

      insert.run(id, p.title, p.description, prompt, techStackStr, JSON.stringify(files), JSON.stringify(structure), now, now, effectiveUserId)
    }
  })

  insertMany(projectsData)

  console.log(`  ✅ ${projectsData.length} projects seeded successfully!`)
  console.log(`\n  👤 Login: demo@blueprintai.com / demo123`)

  db.close()
}

seed()
