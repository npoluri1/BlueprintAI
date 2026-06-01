interface ProjectTemplate {
  title: string
  description: string
  techStack: string[]
  structure: string[]
  keywords: string[]
}

const PROJECTS: ProjectTemplate[] = [
  { title: "AI Customer Support Chatbot", description: "A LangChain-powered customer support agent with RAG pipeline, vector store integration, and context-aware conversation handling.", techStack: ["LangChain", "OpenAI", "Pinecone", "FastAPI", "Python"], keywords: ["chatbot", "support", "customer", "langchain", "agent", "rag", "qa"], structure: ["/ai-support-bot/main.py", "/ai-support-bot/agent.py", "/ai-support-bot/tools.py", "/ai-support-bot/memory.py", "/ai-support-bot/requirements.txt", "/ai-support-bot/README.md"] },
  { title: "E-Commerce Analytics Dashboard", description: "A React-based e-commerce dashboard with real-time sales data, inventory tracking, and AI-powered sales forecasting.", techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"], keywords: ["ecommerce", "dashboard", "analytics", "sales", "shop", "store", "nextjs"], structure: ["/ecommerce-dash/package.json", "/ecommerce-dash/src/app/page.tsx", "/ecommerce-dash/src/app/api/analytics/route.ts", "/ecommerce-dash/src/components/Chart.tsx", "/ecommerce-dash/prisma/schema.prisma", "/ecommerce-dash/README.md"] },
  { title: "Flutter Social Media App", description: "A cross-platform social media app with real-time messaging, post feeds, stories, and AI-powered content recommendations.", techStack: ["Flutter", "Firebase", "TensorFlow Lite", "Node.js", "MongoDB"], keywords: ["social", "flutter", "mobile", "chat", "messaging", "feed", "stories"], structure: ["/social-app/pubspec.yaml", "/social-app/lib/main.dart", "/social-app/lib/screens/feed.dart", "/social-app/lib/screens/chat.dart", "/social-app/lib/services/api.dart", "/social-app/README.md"] },
  { title: "Multi-Agent Orchestrator", description: "A CrewAI-based multi-agent system with supervisor agent delegating to specialist sub-agents for complex business workflows.", techStack: ["CrewAI", "LangGraph", "GPT-4o", "Weaviate", "Python"], keywords: ["multi-agent", "orchestrator", "crewai", "supervisor", "workflow", "agentic"], structure: ["/multi-agent/main.py", "/multi-agent/supervisor.py", "/multi-agent/agents/researcher.py", "/multi-agent/agents/analyst.py", "/multi-agent/agents/writer.py", "/multi-agent/requirements.txt"] },
  { title: "Hybrid Quantum ML Platform", description: "A Qiskit-based hybrid quantum-classical machine learning platform for solving optimization problems with quantum annealing.", techStack: ["Qiskit", "Pennylane", "scikit-learn", "FastAPI", "Python"], keywords: ["quantum", "qiskit", "optimization", "hybrid", "vqe", "qaoa"], structure: ["/quantum-ml/main.py", "/quantum-ml/quantum_circuits.py", "/quantum-ml/classical_models.py", "/quantum-ml/api.py", "/quantum-ml/requirements.txt", "/quantum-ml/README.md"] },
  { title: "ROS 2 Robot Perception Stack", description: "A complete ROS 2 perception stack with YOLO object detection, SLAM navigation, and adaptive grasping control.", techStack: ["ROS 2", "OpenCV", "PyTorch", "NVIDIA Jetson", "C++"], keywords: ["ros", "robot", "perception", "slam", "computer vision", "yolo", "navigation"], structure: ["/robot-perception/src/detection_node.cpp", "/robot-perception/src/slam_node.cpp", "/robot-perception/src/grasp_controller.cpp", "/robot-perception/launch/perception.launch", "/robot-perception/CMakeLists.txt", "/robot-perception/README.md"] },
  { title: "CRISPR Guide RNA Designer", description: "An AI-powered CRISPR guide RNA design tool with off-target prediction, knockout efficiency scoring, and multiplex editing optimization.", techStack: ["DeepCRISPR", "PyTorch", "RDKit", "FastAPI", "Python"], keywords: ["crispr", "gene", "genome", "biology", "rna", "biotech", "dna"], structure: ["/crispr-designer/main.py", "/crispr-designer/model.py", "/crispr-designer/grna_design.py", "/crispr-designer/off_target.py", "/crispr-designer/api.py", "/crispr-designer/requirements.txt"] },
  { title: "EEG Brain-Computer Interface", description: "A deep learning platform for EEG/ECoG signal decoding with real-time brain activity classification and cognitive state monitoring.", techStack: ["MNE-Python", "PyTorch", "TensorFlow", "FastAPI", "Python"], keywords: ["eeg", "brain", "neural", "bci", "signal", "neuroscience", "cognitive"], structure: ["/bci-platform/main.py", "/bci-platform/signal_processor.py", "/bci-platform/decoder.py", "/bci-platform/visualizer.py", "/bci-platform/api.py", "/bci-platform/requirements.txt"] },
  { title: "AIoT Smart Factory Platform", description: "An end-to-end AIoT platform for smart manufacturing with predictive maintenance, quality inspection, and production optimization.", techStack: ["Edge Impulse", "TensorFlow Lite", "MQTT", "InfluxDB", "AWS IoT"], keywords: ["iot", "factory", "manufacturing", "edge", "sensor", "predictive", "maintenance"], structure: ["/smart-factory/firmware/sensor.ino", "/smart-factory/edge/inference.py", "/smart-factory/cloud/main.py", "/smart-factory/dashboard/app.py", "/smart-factory/docker-compose.yml", "/smart-factory/README.md"] },
  { title: "Drug Discovery ML Pipeline", description: "A deep learning pipeline for drug discovery with molecular generation, ADMET property prediction, and virtual screening.", techStack: ["RDKit", "DeepChem", "PyTorch", "AlphaFold", "Python"], keywords: ["drug", "molecule", "chemistry", "discovery", "pharma", "screening", "protein"], structure: ["/drug-discovery/main.py", "/drug-discovery/molecule_gen.py", "/drug-discovery/property_pred.py", "/drug-discovery/virtual_screen.py", "/drug-discovery/requirements.txt", "/drug-discovery/README.md"] },
  { title: "GNN Chip Placement Optimizer", description: "An ML-driven semiconductor design tool using graph neural networks for optimal transistor placement and routing.", techStack: ["GNN", "PyTorch", "Reinforcement Learning", "EDA Tools", "Python"], keywords: ["chip", "semiconductor", "placement", "eda", "vlsi", "routing", "gnn"], structure: ["/chip-optimizer/main.py", "/chip-optimizer/gnn_model.py", "/chip-optimizer/placement_engine.py", "/chip-optimizer/rl_router.py", "/chip-optimizer/requirements.txt", "/chip-optimizer/README.md"] },
  { title: "AGI Meta-Cognition Engine", description: "An advanced reasoning system with meta-cognition, self-reflection, episodic memory, and chain-of-thought planning capabilities.", techStack: ["PyTorch", "DeepSpeed", "vLLM", "Neo4j", "Python"], keywords: ["agi", "reasoning", "meta-cognition", "memory", "self-reflection", "consciousness"], structure: ["/agi-engine/main.py", "/agi-engine/reasoner.py", "/agi-engine/memory.py", "/agi-engine/self_reflect.py", "/agi-engine/requirements.txt", "/agi-engine/README.md"] },
  { title: "React Native Fitness Tracker", description: "A cross-platform fitness tracking app with workout plans, progress tracking, and AI-powered personalized training recommendations.", techStack: ["React Native", "Node.js", "OpenAI", "MongoDB", "Firebase"], keywords: ["fitness", "workout", "health", "tracking", "exercise", "training"], structure: ["/fitness-app/package.json", "/fitness-app/src/screens/Home.tsx", "/fitness-app/src/screens/Workout.tsx", "/fitness-app/src/services/api.ts", "/fitness-app/App.tsx", "/fitness-app/README.md"] },
  { title: "Kubernetes Microservice Platform", description: "A cloud-native microservices platform with Kubernetes orchestration, service mesh, observability, and CI/CD pipeline.", techStack: ["Kubernetes", "Docker", "Go", "PostgreSQL", "Prometheus"], keywords: ["kubernetes", "docker", "microservice", "devops", "cloud", "deployment", "ci/cd"], structure: ["/k8s-platform/k8s/deployment.yaml", "/k8s-platform/k8s/service.yaml", "/k8s-platform/src/main.go", "/k8s-platform/src/handler.go", "/k8s-platform/Dockerfile", "/k8s-platform/README.md"] },
  { title: "Solidity DeFi Protocol", description: "A decentralized finance protocol with ERC-20 token, liquidity pool, yield farming, and governance mechanisms.", techStack: ["Solidity", "Hardhat", "Ethers.js", "Next.js", "TypeScript"], keywords: ["blockchain", "defi", "solidity", "ethereum", "smart contract", "token", "web3"], structure: ["/defi-protocol/contracts/Token.sol", "/defi-protocol/contracts/Pool.sol", "/defi-protocol/test/Token.test.ts", "/defi-protocol/frontend/src/app/page.tsx", "/defi-protocol/hardhat.config.ts", "/defi-protocol/README.md"] },
  { title: "Unity 3D Platformer Game", description: "A complete 3D platformer game with physics-based movement, enemy AI, collectible items, and level progression system.", techStack: ["Unity", "C#", "Blender", "Shader Graph", "Post Processing"], keywords: ["game", "unity", "3d", "platformer", "gaming"], structure: ["/platformer-game/Assets/Scripts/PlayerController.cs", "/platformer-game/Assets/Scripts/EnemyAI.cs", "/platformer-game/Assets/Scripts/LevelManager.cs", "/platformer-game/Packages/manifest.json", "/platformer-game/ProjectSettings/ProjectSettings.asset", "/platformer-game/README.md"] },
  { title: "Apache Spark ETL Pipeline", description: "A scalable ETL pipeline using Apache Spark for data ingestion, transformation, and loading into a data warehouse.", techStack: ["Apache Spark", "Python", "PostgreSQL", "Airflow", "dbt"], keywords: ["data", "etl", "spark", "pipeline", "analytics", "warehouse", "big data"], structure: ["/data-pipeline/src/etl_job.py", "/data-pipeline/src/transformations.py", "/data-pipeline/dags/etl_dag.py", "/data-pipeline/dbt/models/schema.yml", "/data-pipeline/docker-compose.yml", "/data-pipeline/README.md"] },
  { title: "Next.js SaaS Admin Panel", description: "A full-featured SaaS admin panel with user management, role-based access, billing, and real-time analytics.", techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"], keywords: ["saas", "admin", "dashboard", "management", "enterprise", "panel"], structure: ["/saas-admin/package.json", "/saas-admin/src/app/dashboard/page.tsx", "/saas-admin/src/app/api/users/route.ts", "/saas-admin/src/components/Sidebar.tsx", "/saas-admin/prisma/schema.prisma", "/saas-admin/README.md"] },
  { title: "Unity AR Furniture App", description: "An augmented reality furniture placement app using Unity AR Foundation with real-time plane detection and object scaling.", techStack: ["Unity", "AR Foundation", "C#", "ARKit", "ARCore"], keywords: ["ar", "augmented reality", "unity", "furniture", "placement", "3d"], structure: ["/ar-furniture/Assets/Scripts/PlacementManager.cs", "/ar-furniture/Assets/Scripts/ARController.cs", "/ar-furniture/Assets/Scripts/UIManager.cs", "/ar-furniture/Packages/manifest.json", "/ar-furniture/ProjectSettings/ProjectSettings.asset", "/ar-furniture/README.md"] },
  { title: "ESP32 IoT Sensor Network", description: "An ESP32-based IoT sensor network with MQTT communication, data logging to InfluxDB, and real-time dashboard.", techStack: ["ESP32", "MQTT", "InfluxDB", "Node-RED", "C++"], keywords: ["esp32", "sensor", "mqtt", "embedded", "firmware", "microcontroller"], structure: ["/esp32-sensor/firmware/main.ino", "/esp32-sensor/firmware/wifi_mqtt.h", "/esp32-sensor/backend/main.py", "/esp32-sensor/dashboard/index.html", "/esp32-sensor/docker-compose.yml", "/esp32-sensor/README.md"] },
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
      ? lower.includes(category.toLowerCase().slice(0, 6))
      : true
    if (kwMatch || catMatch) {
      matched.push(project)
    }
  }

  if (matched.length === 0) {
    const categoryMap: Record<string, number[]> = {
      "Mobile Apps": [2, 12], "Web Apps": [1, 16], "AI Agents": [0], "Agentic AI": [3], "AGI": [11],
      "Quantum AI": [4], "AI Robotics": [5], "AI Semiconductors": [9], "AIoT": [8],
      "AI + Biotechnology": [9, 6], "AI + Neural Science": [7], "Blockchain / Web3": [14],
      "Game Development": [15], "AR / VR": [17], "Data Engineering": [15, 16], "DevOps / Cloud Infrastructure": [13],
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

  const demoFiles = base.structure.map((path: string) => {
    const fileName = path.split("/").pop() || ""
    const ext = fileName.split(".").pop() || ""
    let content = ""

    if (ext === "py") {
      content = `"""\n${base.title}\n${base.description}\n"""\n\nimport os\nimport sys\nfrom typing import Optional, List, Dict, Any\n\n\ndef main():\n    print("${base.title} initialized")\n    # TODO: implement core functionality\n    pass\n\n\nif __name__ == "__main__":\n    main()\n`
    } else if (ext === "ts" || ext === "tsx") {
      if (path.includes("page")) {
        content = `import { useState, useEffect } from "react"\n\nexport default function Page() {\n  return (\n    <div className="min-h-screen p-8">\n      <h1 className="text-2xl font-bold">${base.title}</h1>\n      <p className="mt-4 text-zinc-600">${base.description}</p>\n    </div>\n  )\n}\n`
      } else if (path.includes("Component") || path.includes("component")) {
        content = `interface Props {}\n\nexport default function Component(props: Props) {\n  return <div className="rounded-xl border p-4">${base.title}</div>\n}\n`
      } else if (path.includes("route")) {
        content = `import { NextResponse } from "next/server"\n\nexport async function GET() {\n  return NextResponse.json({ message: "${base.title} API" })\n}\n\nexport async function POST(req: Request) {\n  const body = await req.json()\n  return NextResponse.json({ received: body })\n}\n`
      } else if (path.includes("api") || path.includes("service")) {
        content = `const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"\n\nexport async function fetchData(endpoint: string) {\n  const res = await fetch(\`\${API_BASE}/\${endpoint}\`)\n  if (!res.ok) throw new Error("API error")\n  return res.json()\n}\n`
      } else {
        content = `// ${fileName}\n// ${base.title}\n\nexport function ${fileName.replace(/\.\w+$/, "").replace(/[^a-zA-Z0-9]/g, "_")}() {\n  return { status: "ok" }\n}\n`
      }
    } else if (ext === "sol") {
      content = `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract ${fileName.replace(".sol", "")} {\n    address public owner;\n    \n    constructor() {\n        owner = msg.sender;\n    }\n    \n    modifier onlyOwner() {\n        require(msg.sender == owner, "Not owner");\n        _;\n    }\n}\n`
    } else if (ext === "cpp" || ext === "h" || ext === "hpp") {
      content = `// ${fileName}\n#include <iostream>\n#include <string>\n#include <vector>\n\nusing namespace std;\n\nclass ${fileName.replace(/\.\w+$/, "").replace(/[^a-zA-Z0-9]/g, "_")} {\npublic:\n    ${fileName.replace(/\.\w+$/, "").replace(/[^a-zA-Z0-9]/g, "_")}() {}\n    ~${fileName.replace(/\.\w+$/, "").replace(/[^a-zA-Z0-9]/g, "_")}() {}\n};\n`
    } else if (ext === "go") {
      content = `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("${base.title}")\n}\n`
    } else if (ext === "rs") {
      content = `fn main() {\n    println!("${base.title}");\n}\n\n#[cfg(test)]\nmod tests {\n    #[test]\n    fn test_init() {\n        assert_eq!(1, 1);\n    }\n}\n`
    } else if (ext === "json" && (path.includes("package") || path.includes("manifest"))) {
      content = JSON.stringify({ name: base.title.toLowerCase().replace(/\s+/g, "-"), version: "1.0.0", private: true, scripts: { dev: "next dev", build: "next build", start: "next start" }, dependencies: { "next": "^14.0.0", "react": "^18.0.0", "react-dom": "^18.0.0" }, devDependencies: { "typescript": "^5.0.0" } }, null, 2)
    } else if (ext === "yaml" || ext === "yml") {
      if (path.includes("docker-compose")) {
        content = `version: "3.8"\n\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n`
      } else if (path.includes("deployment")) {
        content = `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${base.title.toLowerCase().replace(/\s+/g, "-")}\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: ${base.title.toLowerCase().replace(/\s+/g, "-")}\n  template:\n    metadata:\n      labels:\n        app: ${base.title.toLowerCase().replace(/\s+/g, "-")}\n    spec:\n      containers:\n        - name: app\n          image: ${base.title.toLowerCase().replace(/\s+/g, "-")}:latest\n          ports:\n            - containerPort: 3000\n`
      } else {
        content = `# ${fileName}\n# Configuration for ${base.title}\n`
      }
    } else if (ext === "txt" || path.includes("requirements")) {
      content = "# Core dependencies\nfastapi>=0.104.0\nuvicorn>=0.24.0\npython-dotenv>=1.0.0\npydantic>=2.5.0\n\n# Project-specific\n" + stackOverride.map((s: string) => `# ${s.toLowerCase().replace(/\s+/g, "-")}\n`).join("")
    } else if (ext === "md") {
      content = `# ${base.title}\n\n${base.description}\n\n## Tech Stack\n${stackOverride.map((s: string) => `- ${s}`).join("\n")}\n\n## Getting Started\n1. Clone the repo\n2. Install dependencies\n3. Run \`npm run dev\` or \`python main.py\`\n4. Open http://localhost:3000\n\n## Structure\n\`\`\`\n${base.structure.map(s => s.replace(rootDir, ".")).join("\n")}\n\`\`\`\n`
    } else if (ext === "css" || ext === "scss") {
      content = `/* ${fileName} */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root {\n  --primary: #3b82f6;\n  --background: #ffffff;\n}\n`
    } else if (ext === "html") {
      content = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${base.title}</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>\n`
    } else if (ext === "prisma") {
      content = `generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel User {\n  id        String   @id @default(cuid())\n  email     String   @unique\n  name      String?\n  createdAt DateTime @default(now())\n}\n`
    } else if (ext === "ino" || ext === "cpp") {
      content = `#include <WiFi.h>\n#include <PubSubClient.h>\n\nconst char* ssid = "YOUR_SSID";\nconst char* password = "YOUR_PASSWORD";\nconst char* mqtt_server = "broker.example.com";\n\nWiFiClient espClient;\nPubSubClient client(espClient);\n\nvoid setup() {\n  Serial.begin(115200);\n  setup_wifi();\n  client.setServer(mqtt_server, 1883);\n}\n\nvoid loop() {\n  if (!client.connected()) reconnect();\n  client.loop();\n}\n`
    } else if (ext === "cs") {
      content = `using UnityEngine;\n\npublic class ${fileName.replace(".cs", "").replace(/[^a-zA-Z0-9]/g, "_")} : MonoBehaviour {\n    void Start() {\n        Debug.Log("${base.title} initialized");\n    }\n\n    void Update() {\n        \n    }\n}\n`
    } else {
      content = `// ${path}\n// ${base.title}\n// ${base.description}\n`
    }
    return { path: `${rootDir}${path.startsWith("/") ? path : "/" + path}`, content }
  })

  return {
    title: base.title,
    description: base.description,
    techStack: stackOverride,
    structure: base.structure.map(s => `${rootDir}${s.startsWith("/") ? s : "/" + s}`),
    files: demoFiles,
  }
}
