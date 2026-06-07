"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"

const FAQ_DATA = [
  { q: "How long does it take to see results from your AI solutions?", a: "Most clients see initial improvements within 2–3 weeks. Our AI systems typically achieve optimal performance after 4–6 weeks of learning and optimization, though some improvements can be visible within the first few days." },
  { q: "What industries do you specialize in?", a: "We work across e-commerce, gaming, fintech, healthcare, SaaS, education, and more. Our AI-powered approach adapts to the unique requirements and regulations of each sector while maintaining compliance and effectiveness." },
  { q: "Do you work with startups or only enterprise clients?", a: "We work with businesses of all sizes. Our scalable solutions can be customized for startups with modest budgets as well as enterprise clients with complex requirements, offering tiered pricing to ensure accessibility." },
  { q: "How do you ensure data privacy and security?", a: "We follow GDPR, CCPA, and relevant privacy regulations. All data is encrypted in transit and at rest, using privacy-preserving AI techniques. Our security protocols are audited regularly by third-party firms." },
  { q: "Can you integrate with our existing tools and platforms?", a: "Yes, we offer extensive integrations with platforms including Google Cloud, OpenAI, AWS, and many others. Our API-first approach ensures seamless data flow between your existing stack and our AI solutions." },
  { q: "What kind of support do you provide after delivery?", a: "We provide 24/7 monitoring, weekly performance reports, monthly strategy reviews, and dedicated account management. Our support team is available via email for immediate assistance, plus training sessions for your team." },
]

const CATEGORIES = ["All", "Mobile Apps", "Web Apps", "AI Agents", "Agentic AI", "AGI", "Quantum AI", "AI Robotics", "AI Semiconductors", "AIoT", "AI + Biotechnology", "AI + Neural Science"] as const
type Category = (typeof CATEGORIES)[number]

const CATEGORY_ICONS: Record<string, string> = {
  All: "🏗️",
  "Mobile Apps": "📱",
  "Web Apps": "🌐",
  "AI Agents": "🤖",
  "Agentic AI": "🧠",
  AGI: "✨",
  "Quantum AI": "⚛️",
  "AI Robotics": "🦾",
  "AI Semiconductors": "💠",
  AIoT: "🔗",
  "AI + Biotechnology": "🧬",
  "AI + Neural Science": "🔬",
}

const HERO_STATS = [
  { value: "11", label: "AI Domains Covered" },
  { value: "110+", label: "Projects Portfolio" },
  { value: "50+", label: "AI/ML Frameworks" },
  { value: "100%", label: "Production Ready" },
]

interface Project {
  category: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  tags: string[]
  gradient: string
}

const PROJECTS: Project[] = [
  { category: "Mobile Apps", title: "ShopEase", subtitle: "E-Commerce / Android & iOS", description: "Full-featured e-commerce app with AI-powered recommendations, real-time inventory, and seamless checkout.", highlights: ["AI product recommendations using collaborative filtering", "Real-time inventory sync with supplier systems", "Stripe payments, Apple Pay, Google Pay"], tags: ["Flutter", "Firebase", "TensorFlow Lite", "Stripe", "Google Maps"], gradient: "from-emerald-500 to-teal-600" },
  { category: "Mobile Apps", title: "HealthTrack Pro", subtitle: "Health & Fitness / Android & iOS", description: "AI-driven health tracking app with workout plans, diet recommendations, and progress analytics.", highlights: ["AI workout generation based on user goals", "Real-time health metrics sync with wearables", "Social features with challenges and leaderboards"], tags: ["React Native", "Node.js", "OpenAI", "MongoDB", "WebSockets"], gradient: "from-blue-500 to-cyan-600" },
  { category: "Web Apps", title: "CloudDash", subtitle: "SaaS Dashboard / Web", description: "Modern SaaS dashboard with real-time analytics, team collaboration, and AI-powered business intelligence.", highlights: ["Real-time data visualization with WebSocket updates", "AI-powered anomaly detection on metrics", "Multi-tenant architecture with role-based access"], tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"], gradient: "from-orange-500 to-red-600" },
  { category: "Web Apps", title: "DevForge", subtitle: "Developer Platform / Web", description: "AI-augmented development platform with automated code reviews, documentation generation, and CI/CD pipelines.", highlights: ["AI code review with style enforcement", "Auto-generated API documentation", "Integrated CI/CD with GitHub Actions"], tags: ["React", "Python", "FastAPI", "Redis", "Docker"], gradient: "from-sky-500 to-blue-600" },
  { category: "AI Agents", title: "AutoBiz Assistant", subtitle: "AI Agent / Multi-Platform", description: "Autonomous AI agent that handles customer inquiries, schedules appointments, and processes orders 24/7.", highlights: ["LLM-powered conversation with context retention", "Autonomous task execution (scheduling, ordering)", "Integration with CRM, calendar, and payment systems"], tags: ["LangChain", "OpenAI", "Pinecone", "FastAPI", "Twilio"], gradient: "from-purple-500 to-pink-600" },
  { category: "AI Agents", title: "DataPulse Analytics", subtitle: "AI Agent / Data Platform", description: "Intelligent data analysis agent that connects to your databases and generates insights, charts, and reports on demand.", highlights: ["Natural language to SQL query generation", "Automated report generation with insights", "Multi-source data aggregation (SQL, NoSQL, APIs)"], tags: ["LangGraph", "GPT-4", "PostgreSQL", "ChromaDB", "Streamlit"], gradient: "from-violet-500 to-indigo-600" },
  { category: "AI Agents", title: "MarketMind Agent", subtitle: "Marketing Agent / Cloud", description: "Autonomous marketing agent that creates campaigns, analyzes performance, and optimizes ad spend across channels.", highlights: ["Automated campaign creation with A/B testing", "Cross-channel ad spend optimization with RL", "Performance analysis with natural language reports"], tags: ["LangChain", "OpenAI", "Facebook API", "Google Ads", "Python"], gradient: "from-rose-500 to-pink-600" },
  { category: "AI Agents", title: "SupportBot Pro", subtitle: "Customer Support Agent / Cloud", description: "Enterprise customer support agent with context-aware conversation, multi-language support, and human handoff.", highlights: ["Context-aware conversations with full history", "Multi-language support with real-time translation", "Intelligent human handoff with context transfer"], tags: ["LangChain", "GPT-4", "Pinecone", "Twilio", "Node.js"], gradient: "from-amber-500 to-orange-600" },
  { category: "AI Agents", title: "RecruitBot", subtitle: "Recruitment Agent / Cloud", description: "Autonomous recruitment agent that sources candidates, screens resumes, and schedules interviews end-to-end.", highlights: ["Automated candidate sourcing from job boards", "Resume screening with skill-based ranking", "End-to-end interview scheduling with email automation"], tags: ["LangChain", "OpenAI", "LinkedIn API", "PostgreSQL", "Python"], gradient: "from-cyan-500 to-blue-600" },
  { category: "AI Agents", title: "TradeAgent", subtitle: "Trading Agent / Cloud", description: "Autonomous trading agent with multi-asset portfolio management, risk analysis, and market sentiment monitoring.", highlights: ["Multi-asset portfolio rebalancing with RL", "Market sentiment analysis from news & social media", "Risk management with VaR and stress testing"], tags: ["LangGraph", "OpenAI", "Python", "Redis", "Alpha Vantage"], gradient: "from-green-500 to-emerald-600" },
  { category: "AI Agents", title: "ComplianceGuard", subtitle: "Compliance Agent / Cloud", description: "AI compliance monitoring agent that scans communications, flags violations, and generates audit reports.", highlights: ["Real-time communication monitoring with NLP", "Regulatory violation flagging with rule engine", "Automated audit trail and report generation"], tags: ["LangChain", "GPT-4", "ChromaDB", "Python", "PostgreSQL"], gradient: "from-slate-500 to-zinc-600" },
  { category: "AI Agents", title: "ResearchRover", subtitle: "Research Agent / Cloud", description: "Autonomous research agent that conducts literature reviews, extracts findings, and generates research summaries.", highlights: ["Automated literature search across 100M+ papers", "Finding extraction with citation management", "Research summary generation with key insights"], tags: ["LangChain", "OpenAI", "Pinecone", "Python", "FastAPI"], gradient: "from-indigo-500 to-purple-600" },
  { category: "AI Agents", title: "DevOpsBot", subtitle: "DevOps Agent / Cloud", description: "Autonomous DevOps agent that monitors infrastructure, diagnoses issues, and executes remediation actions.", highlights: ["Infrastructure monitoring with anomaly detection", "Automated root cause analysis from logs", "Self-healing remediation with rollback safety"], tags: ["LangChain", "Python", "Docker", "Kubernetes", "Prometheus"], gradient: "from-teal-500 to-cyan-600" },
  { category: "AI Agents", title: "TravelAgent AI", subtitle: "Travel Planning Agent / Cloud", description: "End-to-end travel planning agent that books flights, hotels, and creates personalized itineraries.", highlights: ["Multi-city itinerary optimization", "Real-time price monitoring and booking", "Personalized activity recommendations"], tags: ["LangChain", "OpenAI", "Amadeus API", "Python", "Redis"], gradient: "from-sky-500 to-indigo-600" },
  { category: "AI Agents", title: "LegalLens", subtitle: "Legal Agent / Cloud", description: "AI legal research agent that analyzes contracts, identifies clauses, and generates legal memoranda.", highlights: ["Contract clause extraction and classification", "Risk clause identification with legal ontology", "Legal memo generation with citation support"], tags: ["LangChain", "GPT-4", "ChromaDB", "Python", "FastAPI"], gradient: "from-zinc-500 to-gray-600" },
  { category: "AI Agents", title: "MedAgent", subtitle: "Medical Agent / Cloud", description: "AI medical assistant agent for clinical decision support, patient triage, and medical literature retrieval.", highlights: ["Clinical decision support with evidence-based recommendations", "Patient triage with severity assessment", "Medical literature retrieval with RAG pipeline"], tags: ["LangChain", "GPT-4", "Pinecone", "FHIR API", "Python"], gradient: "from-red-500 to-rose-600" },
  { category: "Agentic AI", title: "OrchestraNet", subtitle: "Multi-Agent Orchestrator / Cloud", description: "Hierarchical multi-agent system where specialized sub-agents collaborate under a super-agent to solve complex business workflows autonomously.", highlights: ["Supervisor agent delegating to specialist sub-agents", "Dynamic tool-use planning and recursive task decomposition", "Self-healing agent loops with error recovery and re-planning"], tags: ["CrewAI", "LangGraph", "GPT-4o", "Weaviate", "Temporal"], gradient: "from-rose-500 to-purple-600" },
  { category: "Agentic AI", title: "CodeForge Agent", subtitle: "Autonomous Dev Agent / Cloud", description: "End-to-end software development agent that writes code, runs tests, debugs, and deploys applications from natural language requirements.", highlights: ["Autonomous code generation with multi-file editing", "Self-testing and iterative bug fixing loop", "Auto-deployment to cloud with infrastructure-as-code"], tags: ["Claude", "Code Interpreter", "Docker", "Kubernetes", "GitHub"], gradient: "from-pink-500 to-rose-600" },
  { category: "Agentic AI", title: "SynthraNet", subtitle: "Agentic Workflow Engine / Cloud", description: "Visual agent orchestration platform for designing, testing, and deploying complex multi-agent workflows with drag-and-drop.", highlights: ["Visual workflow builder with drag-and-drop agent nodes", "Real-time agent collaboration monitoring", "Built-in evaluation and performance analytics"], tags: ["AutoGen", "LangGraph", "React", "Python", "Neo4j"], gradient: "from-fuchsia-500 to-purple-600" },
  { category: "Agentic AI", title: "AgentForge Studio", subtitle: "Agent Builder IDE / Web", description: "Full IDE for building, testing, and deploying custom AI agents with integrated debugging and version control.", highlights: ["Visual agent state machine designer", "Step-through debugging with breakpoints", "Agent registry with versioning and rollback"], tags: ["LangChain", "Next.js", "FastAPI", "Docker", "Git"], gradient: "from-violet-500 to-fuchsia-600" },
  { category: "Agentic AI", title: "CogniFlow", subtitle: "Agent Pipeline / Cloud", description: "Event-driven agent pipeline for processing complex business workflows with human-in-the-loop approval gates.", highlights: ["Event-driven agent chain execution", "Human-in-the-loop approval with Slack integration", "Audit logging with full traceability"], tags: ["Temporal", "LangGraph", "TypeScript", "PostgreSQL", "Slack API"], gradient: "from-indigo-500 to-violet-600" },
  { category: "Agentic AI", title: "MultiMind", subtitle: "Agent Ensemble / Cloud", description: "Ensemble of specialized AI agents collaborating via debate and consensus to solve complex reasoning tasks.", highlights: ["Multi-agent debate with structured argumentation", "Consensus-building with weighted voting", "Self-improving agents with learned collaboration"], tags: ["CrewAI", "GPT-4o", "Claude", "Weaviate", "Python"], gradient: "from-blue-500 to-indigo-600" },
  { category: "AGI", title: "CogniCore AGI Sandbox", subtitle: "AGI Research Platform / Cloud", description: "Experimental AGI architecture combining system-2 reasoning, self-reflection, memory consolidation, and chain-of-thought planning.", highlights: ["Meta-cognition layer with self-reflection and correction", "Episodic memory with recall and consolidation pipelines", "Multi-step reasoning with verifiable intermediate steps"], tags: ["PyTorch", "DeepSpeed", "vLLM", "Qdrant", "Neo4j"], gradient: "from-amber-500 to-orange-600" },
  { category: "AGI", title: "OmniReasoner", subtitle: "AGI Reasoning Engine / Edge + Cloud", description: "Hybrid symbolic-neural reasoning system that combines probabilistic inference with logical deduction for transparent decision-making.", highlights: ["Neuro-symbolic reasoning with differentiable logic", "Explainable AI with traceable decision graphs", "Continuous learning with online knowledge updates"], tags: ["TensorFlow", "Rust", "ONNX", "SPARQL", "JAX"], gradient: "from-yellow-500 to-amber-600" },
  { category: "AGI", title: "MetaThink", subtitle: "Meta-Cognition Engine / Cloud", description: "Self-aware reasoning system with recursive self-improvement, theory of mind modeling, and introspection capabilities.", highlights: ["Recursive self-improvement with automated architecture search", "Theory of mind modeling for human interaction", "Introspection with confidence calibration"], tags: ["PyTorch", "JAX", "DeepSpeed", "vLLM", "Redis"], gradient: "from-orange-500 to-yellow-600" },
  { category: "AGI", title: "UniLearn", subtitle: "Universal Learner / Cloud", description: "Continuous learning system that accumulates knowledge across tasks without catastrophic forgetting using elastic weight consolidation.", highlights: ["Lifelong learning with elastic weight consolidation", "Cross-task knowledge transfer with skill composition", "Automatic curriculum learning with difficulty progression"], tags: ["PyTorch", "JAX", "TensorFlow", "Weaviate", "Python"], gradient: "from-yellow-500 to-lime-600" },
  { category: "AGI", title: "ReasonNet", subtitle: "Reasoning Graph Network / Cloud", description: "Graph-based reasoning engine that constructs dynamic knowledge graphs from unstructured text for multi-hop inference.", highlights: ["Dynamic knowledge graph construction from text", "Multi-hop reasoning with graph traversal", "Causal inference with counterfactual reasoning"], tags: ["PyTorch", "Neo4j", "SPARQL", "Qdrant", "Python"], gradient: "from-lime-500 to-green-600" },
  { category: "AGI", title: "WorldModeler", subtitle: "World Simulation / Cloud", description: "World modeling system that builds internal generative models of environments for planning, simulation, and counterfactual reasoning.", highlights: ["Generative world model with environment simulation", "Planning with Monte Carlo tree search", "Counterfactual reasoning for decision analysis"], tags: ["PyTorch", "JAX", "DeepSpeed", "MuJoCo", "Python"], gradient: "from-green-500 to-emerald-600" },
  { category: "Quantum AI", title: "QubitML", subtitle: "Quantum ML Platform / Hybrid Cloud", description: "Hybrid quantum-classical machine learning platform for solving high-dimensional optimization and feature mapping problems.", highlights: ["Variational quantum eigensolver for feature selection", "Quantum kernel methods for SVM acceleration", "Hybrid classical-quantum neural network training"], tags: ["Qiskit", "Pennylane", "Cirq", "CUDA-Q", "scikit-learn"], gradient: "from-cyan-500 to-blue-600" },
  { category: "Quantum AI", title: "QuantumOptim", subtitle: "Quantum Optimization Suite / Hybrid", description: "Quantum annealing and QAOA-based optimization solver for logistics, portfolio optimization, and supply chain routing problems.", highlights: ["QAOA for combinatorial optimization (TSP, knapsack)", "Quantum annealing integration with D-Wave systems", "Classical-quantum hybrid solver with fallback modes"], tags: ["D-Wave Ocean", "Qiskit", "IBM Quantum", "AWS Braket", "NumPy"], gradient: "from-teal-500 to-cyan-600" },
  { category: "Quantum AI", title: "QuantumML Suite", subtitle: "Quantum ML Library / Hybrid", description: "Comprehensive library of quantum machine learning algorithms with classical fallbacks and automatic hardware selection.", highlights: ["30+ QML algorithms with unified API", "Automatic quantum hardware selection", "Classical fallback with transparent switching"], tags: ["Pennylane", "Qiskit", "Cirq", "JAX", "scikit-learn"], gradient: "from-blue-500 to-teal-600" },
  { category: "Quantum AI", title: "QBoost", subtitle: "Quantum Boosting / Hybrid", description: "Quantum-enhanced gradient boosting framework that uses quantum annealing for optimal tree structure discovery.", highlights: ["Quantum annealing for optimal decision tree splits", "Hybrid classical-quantum ensemble training", "Speedup over classical XGBoost on large feature sets"], tags: ["D-Wave Ocean", "XGBoost", "scikit-learn", "NumPy", "Python"], gradient: "from-sky-500 to-cyan-600" },
  { category: "Quantum AI", title: "QuantumChem", subtitle: "Quantum Chemistry Sim / Hybrid", description: "Quantum chemistry simulation platform using VQE and quantum phase estimation for molecular energy calculations.", highlights: ["VQE for ground state energy estimation", "Quantum phase estimation for precision chemistry", "Molecular Hamiltonian construction and optimization"], tags: ["Qiskit", "Pennylane", "Cirq", "Psi4", "Python"], gradient: "from-indigo-500 to-blue-600" },
  { category: "Quantum AI", title: "QryptoNet", subtitle: "Quantum Cryptography / Hybrid", description: "Quantum-safe cryptography platform with QKD simulation, post-quantum crypto algorithms, and security analysis tools.", highlights: ["Quantum key distribution (QKD) simulation", "Post-quantum cryptographic algorithm suite", "Security analysis with quantum attack simulation"], tags: ["Qiskit", "Cirq", "Python", "OpenSSL", "Rust"], gradient: "from-violet-500 to-indigo-600" },
  { category: "AI Robotics", title: "RoboVision AI", subtitle: "Computer Vision Robotics / Edge", description: "AI-powered robotic perception system with real-time object detection, SLAM navigation, and adaptive grasping for industrial automation.", highlights: ["Real-time YOLO-based object detection and tracking", "Simultaneous localization and mapping (SLAM)", "Adaptive robotic arm control with reinforcement learning"], tags: ["ROS 2", "OpenCV", "PyTorch", "NVIDIA Jetson", "MoveIt"], gradient: "from-green-500 to-emerald-600" },
  { category: "AI Robotics", title: "SwarmLogic", subtitle: "Multi-Robot Swarm System / Edge", description: "Decentralized multi-robot swarm coordination system with AI-driven task allocation, collision avoidance, and collective decision-making.", highlights: ["Swarm intelligence with decentralized consensus", "Multi-robot path planning with conflict resolution", "AI-driven task allocation based on robot capabilities"], tags: ["ROS 2", "Gazebo", "TensorFlow", "C++", "MQTT"], gradient: "from-lime-500 to-green-600" },
  { category: "AI Robotics", title: "GraspMaster", subtitle: "Robotic Manipulation / Edge", description: "Learning-based robotic grasping system that adapts to novel objects through simulation-to-real transfer with domain randomization.", highlights: ["Sim-to-real transfer with domain randomization", "Adaptive grasping for novel object geometries", "Force-sensitive grip control with tactile feedback"], tags: ["PyTorch", "Isaac Gym", "ROS 2", "MoveIt", "C++"], gradient: "from-teal-500 to-emerald-600" },
  { category: "AI Robotics", title: "NavCore", subtitle: "Autonomous Navigation / Edge", description: "End-to-end autonomous navigation stack with deep reinforcement learning for dynamic obstacle avoidance and path planning.", highlights: ["DRL-based navigation with dynamic obstacle avoidance", "Semantic mapping with scene understanding", "Multi-terrain adaptation with learned locomotion"], tags: ["ROS 2", "PyTorch", "Gazebo", "NVIDIA Jetson", "C++"], gradient: "from-sky-500 to-teal-600" },
  { category: "AI Robotics", title: "Humanoid Pilot", subtitle: "Humanoid Control / Edge", description: "Whole-body control system for humanoid robots using deep reinforcement learning with imitation from human motion capture.", highlights: ["Whole-body control with 30+ DOF coordination", "Imitation learning from human motion capture", "Dynamic balance recovery with fall prevention"], tags: ["PyTorch", "MuJoCo", "ROS 2", "C++", "NVIDIA Isaac"], gradient: "from-blue-500 to-sky-600" },
  { category: "AI Semiconductors", title: "ChipSense AI", subtitle: "AI Chip Design / EDA + ML", description: "ML-driven semiconductor design platform that optimizes transistor placement, thermal distribution, and routing using reinforcement learning and graph neural networks.", highlights: ["GNN-based placement optimization for 3nm node designs", "RL-driven routing with DRC violation reduction", "Thermal-aware floorplanning with AI prediction models"], tags: ["GNN", "Reinforcement Learning", "PyTorch", "EDA Tools", "SkyWater PDK"], gradient: "from-slate-500 to-zinc-600" },
  { category: "AI Semiconductors", title: "NeuromorphicCore", subtitle: "Neuromorphic Computing / Silicon", description: "Event-driven neuromorphic processor design with spiking neural networks for ultra-low-power edge AI inference, targeting always-on sensor applications.", highlights: ["SNN-based accelerator with 100x power efficiency vs CMOS", "On-chip learning with STDP plasticity rules", "Event-driven architecture for always-on sensor processing"], tags: ["Spiking Neural Nets", "Lava", "Nengo", "Verilog", "Intel Loihi 2"], gradient: "from-gray-500 to-slate-600" },
  { category: "AI Semiconductors", title: "PhotoFlow", subtitle: "Photonic Computing / Silicon", description: "Silicon photonic AI accelerator design using integrated photonic circuits for ultra-fast matrix multiplication with minimal power consumption.", highlights: ["Integrated photonic tensor cores for matrix multiply", "WDM-based analog compute with wavelength parallelism", "CMOS-compatible photonic foundry process"], tags: ["Verilog", "Python", "Lumerical", "SkyWater PDK", "Spiking Neural Nets"], gradient: "from-zinc-500 to-gray-600" },
  { category: "AI Semiconductors", title: "ThermaCool AI", subtitle: "Thermal Management / Silicon", description: "AI-driven thermal management system for semiconductor chips that predicts hotspots and dynamically adjusts voltage/frequency for optimal performance.", highlights: ["Hotspot prediction with spatiotemporal graph networks", "Dynamic DVFS with reinforcement learning", "Multi-core thermal balancing with workload migration"], tags: ["GNN", "Reinforcement Learning", "PyTorch", "Verilog", "SPICE"], gradient: "from-stone-500 to-zinc-600" },
  { category: "AI Semiconductors", title: "RouteOptim", subtitle: "Chip Routing Engine / Silicon", description: "Learning-based chip routing engine that uses attention mechanisms to find optimal routing paths with DRC closure guarantees.", highlights: ["Attention-based global routing with congestion prediction", "DRC-aware detailed routing with automated fixing", "Parallel routing with hierarchical decomposition"], tags: ["PyTorch", "GNN", "EDA Tools", "C++", "Python"], gradient: "from-neutral-500 to-stone-600" },
  { category: "Mobile Apps", title: "RideFlow", subtitle: "Ride Hailing / Android & iOS", description: "Complete ride-hailing app with AI-based demand prediction, dynamic pricing, and real-time driver matching.", highlights: ["AI demand forecasting for driver allocation", "Dynamic surge pricing engine with ML", "Real-time ETA prediction with traffic data"], tags: ["Flutter", "Firebase", "TensorFlow", "Google Maps", "Stripe"], gradient: "from-yellow-500 to-orange-600" },
  { category: "Mobile Apps", title: "FitMind", subtitle: "Mental Wellness / Android & iOS", description: "AI-powered mental wellness app with personalized meditation, mood tracking, and cognitive behavioral therapy exercises.", highlights: ["Personalized meditation with mood-based AI selection", "Mood pattern recognition with journal analysis", "CBT exercise recommendations with progress tracking"], tags: ["React Native", "OpenAI", "Node.js", "MongoDB", "Firebase"], gradient: "from-purple-500 to-indigo-600" },
  { category: "Mobile Apps", title: "Foodie AI", subtitle: "Food Delivery / Android & iOS", description: "AI-powered food delivery app with personalized meal recommendations, dietary preference learning, and smart ordering.", highlights: ["Personalized meal recommendations with collaborative filtering", "Dietary preference learning from order history", "Smart reorder with one-tap checkout"], tags: ["Flutter", "Firebase", "TensorFlow Lite", "Stripe", "Google Maps"], gradient: "from-red-500 to-pink-600" },
  { category: "Mobile Apps", title: "TravelBuddy", subtitle: "Travel Planning / Android & iOS", description: "AI travel planning app with itinerary optimization, price prediction, and personalized destination recommendations.", highlights: ["AI itinerary optimization with time/distance constraints", "Flight price prediction with ML models", "Personalized destination recommendations"], tags: ["React Native", "Python", "Node.js", "MongoDB", "Google Maps"], gradient: "from-sky-500 to-blue-600" },
  { category: "Mobile Apps", title: "PayMate", subtitle: "FinTech / Android & iOS", description: "AI-driven personal finance app with spending categorization, savings optimization, and fraud detection.", highlights: ["Automatic spending categorization with NLP", "AI-powered savings goal optimization", "Real-time fraud detection with anomaly detection"], tags: ["Flutter", "Python", "TensorFlow", "PostgreSQL", "Plaid"], gradient: "from-blue-500 to-indigo-600" },
  { category: "Mobile Apps", title: "StudyMate AI", subtitle: "EdTech / Android & iOS", description: "AI tutoring app with personalized learning paths, adaptive quizzes, and progress tracking for students.", highlights: ["Adaptive learning paths based on knowledge gaps", "AI-generated practice questions with difficulty scaling", "Progress analytics with mastery tracking"], tags: ["React Native", "OpenAI", "Firebase", "Node.js", "Python"], gradient: "from-green-500 to-teal-600" },
  { category: "Mobile Apps", title: "EventHub Pro", subtitle: "Event Management / Android & iOS", description: "All-in-one event management app with AI-powered attendee matching, schedule optimization, and networking features.", highlights: ["AI attendee matching based on interests and goals", "Smart schedule optimization with conflict resolution", "Virtual networking with icebreaker suggestions"], tags: ["Flutter", "Node.js", "OpenAI", "MongoDB", "WebSockets"], gradient: "from-pink-500 to-rose-600" },
  { category: "Mobile Apps", title: "PetCare AI", subtitle: "Pet Wellness / Android & iOS", description: "AI-powered pet care app with health monitoring, diet tracking, and veterinary appointment management.", highlights: ["AI health monitoring from activity patterns", "Personalized diet recommendations based on breed/age", "Veterinary telemedicine with symptom analysis"], tags: ["React Native", "TensorFlow Lite", "Firebase", "Node.js", "MongoDB"], gradient: "from-amber-500 to-yellow-600" },
  { category: "Mobile Apps", title: "FitSocial", subtitle: "Social Fitness / Android & iOS", description: "Gamified fitness social network with AI coaching, workout challenges, and community-driven motivation.", highlights: ["AI personal trainer with form correction via camera", "Gamified challenges with leaderboards and rewards", "Social feed with workout sharing and motivation"], tags: ["Flutter", "TensorFlow Lite", "Firebase", "OpenAI", "Stripe"], gradient: "from-lime-500 to-green-600" },
  { category: "Mobile Apps", title: "HabitForge", subtitle: "Habit Building / Android & iOS", description: "AI-powered habit formation app with personalized reminders, streak tracking, and behavioral psychology insights.", highlights: ["AI habit recommendations based on personality type", "Streak-based gamification with reward system", "Behavioral analytics with relapse prediction"], tags: ["React Native", "Node.js", "OpenAI", "MongoDB", "Firebase"], gradient: "from-teal-500 to-cyan-600" },
  { category: "Web Apps", title: "AnalytixPro", subtitle: "Analytics Platform / Web", description: "Enterprise analytics platform with AI-powered insights, customizable dashboards, and real-time data pipeline monitoring.", highlights: ["AI insight generation from data patterns", "Custom dashboard builder with drag-and-drop", "Real-time data pipeline monitoring with alerts"], tags: ["Next.js", "Python", "FastAPI", "PostgreSQL", "D3.js"], gradient: "from-blue-500 to-indigo-600" },
  { category: "Web Apps", title: "DocuMind", subtitle: "Document Intelligence / Web", description: "AI-powered document processing platform that extracts, classifies, and analyzes information from PDFs, images, and scanned documents.", highlights: ["Intelligent document parsing with layout understanding", "Automated classification with custom taxonomies", "Data extraction with confidence scoring and review"], tags: ["React", "Python", "GPT-4", "PostgreSQL", "Redis"], gradient: "from-cyan-500 to-blue-600" },
  { category: "Web Apps", title: "CollabSpace", subtitle: "Team Collaboration / Web", description: "Modern team collaboration platform with AI meeting summaries, smart document editing, and integrated project management.", highlights: ["AI meeting transcription and summary generation", "Real-time collaborative document editing", "Integrated project management with timeline view"], tags: ["Next.js", "WebSockets", "OpenAI", "PostgreSQL", "Redis"], gradient: "from-indigo-500 to-purple-600" },
  { category: "Web Apps", title: "MarketPulse", subtitle: "Market Intelligence / Web", description: "Real-time market intelligence platform with AI trend detection, competitor analysis, and automated report generation.", highlights: ["AI trend detection from news and social media", "Automated competitor analysis with monitoring", "Custom report generation with scheduled delivery"], tags: ["React", "Python", "FastAPI", "MongoDB", "D3.js"], gradient: "from-rose-500 to-red-600" },
  { category: "Web Apps", title: "WorkflowPro", subtitle: "Process Automation / Web", description: "Business process automation platform with AI workflow design, drag-and-drop builder, and integration with 200+ services.", highlights: ["AI workflow design from natural language description", "Visual drag-and-drop process builder", "Integration marketplace with 200+ connectors"], tags: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Docker"], gradient: "from-purple-500 to-violet-600" },
  { category: "Web Apps", title: "LearnPath", subtitle: "Learning Management / Web", description: "AI-powered learning management system with personalized course recommendations, auto-generated quizzes, and progress analytics.", highlights: ["Personalized learning paths with adaptive difficulty", "Auto-generated quizzes from course material", "Engagement analytics with dropout prediction"], tags: ["React", "Python", "OpenAI", "PostgreSQL", "Redis"], gradient: "from-emerald-500 to-teal-600" },
  { category: "Web Apps", title: "ContentForge", subtitle: "Content Management / Web", description: "AI-augmented CMS with auto-generated content, intelligent SEO optimization, and multi-channel publishing.", highlights: ["AI content generation with brand voice consistency", "Real-time SEO scoring with actionable suggestions", "Multi-channel publishing with scheduling"], tags: ["Next.js", "GPT-4", "PostgreSQL", "Redis", "Tailwind"], gradient: "from-orange-500 to-amber-600" },
  { category: "Web Apps", title: "BudgetFlow", subtitle: "Financial Planning / Web", description: "AI-driven financial planning platform with cash flow forecasting, scenario modeling, and automated budget optimization.", highlights: ["Cash flow forecasting with ML", "Scenario modeling with Monte Carlo simulation", "Automated budget optimization with goal tracking"], tags: ["React", "Python", "FastAPI", "PostgreSQL", "D3.js"], gradient: "from-green-500 to-emerald-600" },
  { category: "AIoT", title: "SmartFactory AI", subtitle: "Industrial AIoT / Edge + Cloud", description: "End-to-end AIoT platform for smart manufacturing with predictive maintenance, quality inspection, and production optimization.", highlights: ["Predictive maintenance with vibration analysis", "AI visual quality inspection on production line", "Production optimization with digital twin simulation"], tags: ["Edge Impulse", "TensorFlow Lite", "MQTT", "InfluxDB", "AWS IoT"], gradient: "from-cyan-500 to-teal-600" },
  { category: "AIoT", title: "AgriSense", subtitle: "Smart Agriculture / Edge + Cloud", description: "AI-powered agricultural IoT system with soil monitoring, crop health analysis, and automated irrigation control.", highlights: ["Soil nutrient monitoring with multi-sensor fusion", "Crop health analysis from multispectral imagery", "AI-optimized irrigation scheduling with weather data"], tags: ["LoRaWAN", "Edge Impulse", "TensorFlow Lite", "InfluxDB", "AWS IoT"], gradient: "from-green-500 to-lime-600" },
  { category: "AIoT", title: "CityPulse", subtitle: "Smart City IoT / Edge + Cloud", description: "Smart city IoT platform integrating traffic, air quality, waste management, and energy monitoring with AI-driven optimization.", highlights: ["Multi-domain city sensor integration", "Traffic flow optimization with reinforcement learning", "Energy consumption optimization for street lighting"], tags: ["MQTT", "LoRaWAN", "TimescaleDB", "TensorFlow", "AWS IoT"], gradient: "from-blue-500 to-cyan-600" },
  { category: "AIoT", title: "EnergyWise", subtitle: "Energy Management IoT / Edge", description: "AIoT energy management system for buildings with real-time monitoring, demand forecasting, and automated HVAC optimization.", highlights: ["Real-time energy monitoring with sub-metering", "HVAC optimization with reinforcement learning", "Demand response automation with utility integration"], tags: ["Edge Impulse", "MQTT", "InfluxDB", "TensorFlow Lite", "AWS IoT"], gradient: "from-amber-500 to-yellow-600" },
  { category: "AIoT", title: "FleetPilot AI", subtitle: "Fleet Management IoT / Edge", description: "AI-powered fleet management platform with real-time tracking, predictive maintenance, and route optimization for logistics.", highlights: ["Real-time GPS tracking with geofencing", "Predictive maintenance from vehicle telemetry", "AI route optimization with traffic prediction"], tags: ["MQTT", "InfluxDB", "TensorFlow", "AWS IoT", "TimescaleDB"], gradient: "from-indigo-500 to-blue-600" },
  { category: "AI + Biotechnology", title: "MolecuLearn", subtitle: "Drug Discovery / Cloud", description: "Deep learning platform for drug discovery with molecular generation, property prediction, and virtual screening.", highlights: ["De novo molecular generation with reinforcement learning", "ADMET property prediction with graph neural networks", "Virtual screening with docking score prediction"], tags: ["RDKit", "DeepChem", "PyTorch", "AlphaFold", "Python"], gradient: "from-red-500 to-rose-600" },
  { category: "AI + Biotechnology", title: "GenomePilot", subtitle: "Genomic Analysis / Cloud", description: "AI-powered genomic analysis platform for variant calling, interpretation, and clinical reporting with population-scale processing.", highlights: ["Deep learning variant calling from WGS data", "Clinical variant interpretation with ACMG guidelines", "Population-scale processing with distributed computing"], tags: ["GATK", "DeepVariant", "TensorFlow", "PyTorch", "Python"], gradient: "from-purple-500 to-pink-600" },
  { category: "AI + Biotechnology", title: "CRISPR Design AI", subtitle: "Gene Editing / Cloud", description: "AI platform for CRISPR guide RNA design with off-target prediction, knockout efficiency scoring, and multiplex editing optimization.", highlights: ["Guide RNA design with on-target efficiency prediction", "Off-target prediction with deep learning", "Multiplex editing optimization with combinatorial design"], tags: ["DeepCRISPR", "PyTorch", "Python", "TensorFlow", "RDKit"], gradient: "from-blue-500 to-indigo-600" },
  { category: "AI + Biotechnology", title: "ProtFold", subtitle: "Protein Design / Cloud", description: "Deep learning platform for protein structure prediction, de novo protein design, and protein-protein interaction analysis.", highlights: ["Protein structure prediction with ESM-2", "De novo protein design with inverse folding", "Protein-protein interaction prediction with GNNs"], tags: ["AlphaFold", "ESM-2", "PyTorch", "RDKit", "Python"], gradient: "from-cyan-500 to-blue-600" },
  { category: "AI + Biotechnology", title: "MetaBiome", subtitle: "Microbiome Analysis / Cloud", description: "AI platform for metagenomic analysis with taxonomic classification, functional profiling, and biomarker discovery from microbiome data.", highlights: ["Metagenomic taxonomic classification with deep learning", "Functional profiling with pathway enrichment", "Microbiome biomarker discovery for disease diagnosis"], tags: ["MetaPhlan", "PyTorch", "TensorFlow", "BioPython", "Python"], gradient: "from-teal-500 to-cyan-600" },
  { category: "AI + Neural Science", title: "BrainDecode", subtitle: "EEG Decoding / Edge + Cloud", description: "Deep learning platform for EEG/ECoG signal decoding with real-time brain activity classification and cognitive state monitoring.", highlights: ["EEG signal decoding with convolutional neural networks", "Real-time cognitive state monitoring", "Brain-computer interface with closed-loop feedback"], tags: ["MNE-Python", "PyTorch", "TensorFlow", "EEGLAB", "Python"], gradient: "from-violet-500 to-purple-600" },
  { category: "AI + Neural Science", title: "ConnectoViz", subtitle: "Connectomics / Cloud", description: "AI-powered connectomics platform for whole-brain tractography, neural circuit reconstruction, and network analysis.", highlights: ["Whole-brain tractography with deep learning", "Neural circuit reconstruction from electron microscopy", "Brain network analysis with graph theory"], tags: ["FreeSurfer", "MRtrix", "PyTorch", "TensorFlow", "Python"], gradient: "from-pink-500 to-purple-600" },
  { category: "AI + Neural Science", title: "OptoLoop", subtitle: "Optogenetics Control / Edge", description: "Closed-loop optogenetics control system with real-time neural activity monitoring and adaptive light stimulation. ", highlights: ["Real-time neural activity monitoring with calcium imaging", "Adaptive light stimulation with closed-loop control", "Multi-site optogenetic targeting with spatial precision"], tags: ["Open Ephys", "Python", "PyTorch", "SIMNIBS", "C++"], gradient: "from-rose-500 to-pink-600" },
  { category: "AI + Neural Science", title: "BrainAtlas AI", subtitle: "Brain Atlas / Cloud", description: "AI platform for brain atlas registration, segmentation, and analysis with cross-species atlas alignment capabilities.", highlights: ["Automated brain atlas registration with deep learning", "Multi-region segmentation with sub-millimeter precision", "Cross-species atlas alignment for translational research"], tags: ["FreeSurfer", "ANTs", "PyTorch", "TensorFlow", "Python"], gradient: "from-indigo-500 to-violet-600" },
  { category: "AI + Neural Science", title: "NeuroCog", subtitle: "Cognitive Assessment / Cloud", description: "AI-powered cognitive assessment platform with adaptive testing, cognitive decline prediction, and personalized intervention recommendations.", highlights: ["Adaptive cognitive testing with item response theory", "Cognitive decline prediction with longitudinal analysis", "Personalized intervention recommendations with ML"], tags: ["PyTorch", "Python", "TensorFlow", "Redis", "PostgreSQL"], gradient: "from-fuchsia-500 to-pink-600" },
  { category: "AI + Neural Science", title: "DeepStim", subtitle: "Neurostimulation / Edge", description: "AI-optimized neurostimulation platform for TMS/tDCS with personalized stimulation parameters and real-time EEG feedback.", highlights: ["Personalized stimulation parameter optimization", "Real-time EEG feedback for closed-loop adjustment", "Electric field simulation with finite element modeling"], tags: ["SIMNIBS", "MNE-Python", "Python", "PyTorch", "Open Ephys"], gradient: "from-purple-500 to-fuchsia-600" },
]

const STRENGTHS = [
  { emoji: "🧠", title: "Agentic AI & Multi-Agent Systems", desc: "Autonomous agent orchestration with supervisor/sub-agent patterns, tool-use planning, recursive decomposition, and self-healing loops using CrewAI, LangGraph, and AutoGen." },
  { emoji: "✨", title: "AGI & Advanced Reasoning", desc: "Architectures approaching general intelligence: meta-cognition, system-2 reasoning, neuro-symbolic integration, episodic memory, and self-reflection pipelines." },
  { emoji: "⚛️", title: "Quantum + Classical AI", desc: "Hybrid quantum-classical ML with VQE, QAOA solvers, quantum kernel methods, and integration with Qiskit, Pennylane, Cirq, D-Wave, and AWS Braket." },
  { emoji: "🦾", title: "AI Robotics & Edge AI", desc: "ROS 2 perception stacks, real-time computer vision, SLAM navigation, swarm intelligence, and reinforcement learning on NVIDIA Jetson and edge devices." },
  { emoji: "💠", title: "AI Chip & Semiconductor Design", desc: "ML-driven EDA optimization with GNNs for placement/routing, neuromorphic SNN architectures, RL-based floorplanning, and event-driven silicon design." },
  { emoji: "🔗", title: "AI + IoT (AIoT) Systems", desc: "End-to-end AIoT pipelines with edge ML inference, sensor fusion, LPWAN protocols, predictive maintenance, and real-time anomaly detection on gateways." },
  { emoji: "🧬", title: "AI + Biotechnology", desc: "Deep learning for drug discovery, genomic analysis, protein folding, CRISPR design, metagenomics, and RNA therapeutics." },
  { emoji: "🔬", title: "AI + Neural Science", desc: "EEG/ECoG decoding, connectomics, optogenetics, brain atlasing, neurostimulation optimization, and cognitive assessment." },
  { emoji: "📱", title: "Cross-Platform Mobile", desc: "Flutter and React Native apps for Android & iOS with shared codebases, native performance, AI inference on-device, and rich UX." },
  { emoji: "☁️", title: "Full-Stack & Cloud", desc: "Next.js, React, Python, FastAPI, databases, real-time systems, Docker, K8s, and CI/CD. Production-grade SaaS platforms and AI-powered web apps." },
]

const SERVICES = [
  { emoji: "📱", title: "Mobile & Web App Development", items: ["Cross-platform mobile apps (Flutter / React Native)", "Full-stack web apps (Next.js / React / Python)", "On-device AI inference with TensorFlow Lite / ML Kit", "Real-time features, maps, payments, push notifications", "App Store & Play Store deployment & maintenance"] },
  { emoji: "🤖", title: "AI Agent & Agentic AI Systems", items: ["Custom LLM-powered autonomous agents & chatbots", "Multi-agent orchestration (CrewAI / LangGraph / AutoGen)", "RAG pipelines with vector databases & memory systems", "Autonomous workflow automation with tool-use & planning", "Self-healing agent loops with error recovery & re-planning"] },
  { emoji: "✨", title: "AGI & Advanced AI Research", items: ["Neuro-symbolic reasoning & system-2 thinking pipelines", "Meta-cognition layers with self-reflection & correction", "Episodic memory consolidation & recall architectures", "Multi-step reasoning with verifiable intermediate steps", "Continuous learning with online knowledge updates"] },
  { emoji: "⚛️", title: "Quantum AI & Optimization", items: ["Hybrid quantum-classical ML model development", "QAOA & quantum annealing for combinatorial optimization", "Quantum kernel methods & feature mapping", "Integration with Qiskit, Pennylane, Cirq, D-Wave", "Quantum-classical hybrid solver with fallback modes"] },
  { emoji: "🦾", title: "AI Robotics & Edge Intelligence", items: ["ROS 2-based robotic perception & navigation stacks", "Real-time computer vision (YOLO / OpenCV) on edge", "Swarm intelligence & multi-robot coordination", "Reinforcement learning for robotic control", "Edge deployment on NVIDIA Jetson / Raspberry Pi"] },
  { emoji: "💠", title: "AI Chip & Semiconductor Solutions", items: ["ML-driven EDA with GNN-based placement & routing", "Neuromorphic SNN architecture design & simulation", "RL-based floorplanning & thermal optimization", "Event-driven processor design for edge inference", "Custom ASIC / FPGA accelerator co-design"] },
  { emoji: "🧬", title: "AI + Biotechnology Solutions", items: ["Drug discovery with GNNs & deep molecular learning", "Genomic analysis & variant interpretation pipelines", "Protein structure prediction & de novo design", "CRISPR guide RNA design & off-target prediction", "Metagenomics & microbiome biomarker discovery"] },
  { emoji: "🔬", title: "AI + Neural Science Systems", items: ["EEG/ECoG signal decoding with deep learning", "Connectomics & whole-brain tractography", "Optogenetics closed-loop control optimization", "Brain atlas registration & segmentation", "Cognitive assessment & neurostimulation optimization"] },
  { emoji: "🔗", title: "AI + IoT (AIoT) Systems", items: ["End-to-end AIoT pipeline with edge ML inference", "Multi-sensor fusion & real-time anomaly detection", "LPWAN protocol integration (LoRaWAN, NB-IoT, MQTT)", "Predictive maintenance with digital twin models", "Autonomous control loops with AI-driven decisions"] },
  { emoji: "☁️", title: "Cloud, DevOps & AI Infrastructure", items: ["AWS / GCP / Azure cloud architecture", "Docker / Kubernetes container orchestration", "CI/CD pipelines with GitHub Actions & GitLab", "Model serving with vLLM / Triton / ONNX Runtime", "Infrastructure-as-code (Terraform / Pulumi)"] },
]

const TECH_CATEGORIES = [
  { label: "Large Language Models", items: "GPT-4o, Claude, Gemini, LLaMA 3, Mistral, DeepSeek, Mixtral, Qwen 2.5" },
  { label: "Agentic AI Frameworks", items: "LangChain, LangGraph, CrewAI, AutoGen, Semantic Kernel, Dify, Haystack, Temporal" },
  { label: "AGI & Advanced Reasoning", items: "Neuro-Symbolic AI, DeepSpeed, vLLM, JAX, PyTorch, TensorFlow, ONNX, Rust (reasoning engine)" },
  { label: "Quantum Computing", items: "Qiskit, Pennylane, Cirq, D-Wave Ocean, CUDA-Q, AWS Braket, IBM Quantum, QAOA" },
  { label: "AI Robotics & Edge", items: "ROS 2, Gazebo, OpenCV, YOLO, NVIDIA Jetson, MoveIt, MQTT, C++, SLAM Navigation" },
  { label: "AI Semiconductors & Chips", items: "GNNs for EDA, Intel Loihi 2, SkyWater PDK, Verilog, Spiking Neural Nets, Lava, Nengo, CUDA-Q, FPGA (Xilinx/Intel)" },
  { label: "AIoT & Embedded ML", items: "TensorFlow Lite, Edge Impulse, AWS IoT Greengrass, LoRaWAN, MQTT, InfluxDB, TimescaleDB, AWS IoT Core, NVIDIA Jetson" },
  { label: "Vector & Knowledge Stores", items: "Pinecone, ChromaDB, Weaviate, Qdrant, Neo4j (Graph), Milvus, Redis Stack, MongoDB Atlas Vector" },
  { label: "Frontend & Mobile", items: "Flutter, React Native, Next.js, React, TypeScript, Tailwind CSS, SwiftUI, Jetpack Compose" },
  { label: "Backend & Cloud", items: "Python, FastAPI, Node.js, Go, Rust, PostgreSQL, Docker, Kubernetes, AWS, GCP, Terraform" },
  { label: "AI + Biotechnology", items: "RDKit, DeepChem, AlphaFold, ESM-2, Cellpose, GATK, BioPython, CRISPR Design, ImmuneML, MetaPhlan" },
  { label: "AI + Neural Science", items: "MNE-Python, EEGLAB, Kilosort, FreeSurfer, MRtrix, FSL, ANTs, FieldTrip, SIMNIBS, Open Ephys" },
  { label: "Model Serving & MLOps", items: "vLLM, Triton Inference Server, BentoML, MLflow, Weights & Biases, Hugging Face, Replicate" },
]

const FEATURES = [
  { emoji: "🤖", title: "AI Builder Chat", desc: "Describe your app idea in plain English and let AI generate the full project — structure, files, and code.", href: "/builder" },
  { emoji: "🏢", title: "AI Company", desc: "Create AI-powered companies with 8 role-based agent employees (CEO, CTO, CFO, etc.) and chat with them.", href: "/company" },
  { emoji: "📦", title: "Project Dashboard", desc: "Browse, manage, and download all your AI-generated projects in one place.", href: "/projects" },
]

interface DbProject {
  id: string
  title: string
  description: string
  prompt: string
  techStack: string[]
  createdAt: string
}

interface DbCompany {
  id: string
  name: string
  description: string
  industry: string
  createdAt: string
  _count: { agents: number }
}

export default function HomePage() {
  const { user, loading, login, signup } = useAuth()
  const [dbProjects, setDbProjects] = useState<DbProject[]>([])
  const [companies, setCompanies] = useState<DbCompany[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category>("All")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    if (loading) return
    if (!user) { setDataLoaded(true); return }
    const fetchData = async () => {
      try {
        const [projRes, compRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/company"),
        ])
        if (projRes.ok) {
          const data = await projRes.json()
          setDbProjects(data.projects.slice(0, 4))
        }
        if (compRes.ok) {
          const data = await compRes.json()
          setCompanies(data.companies.slice(0, 4))
        }
      } catch (err) { console.error("Homepage fetch error:", err) }
      setDataLoaded(true)
    }
    fetchData()
  }, [user, loading])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const err = await login(loginEmail, loginPassword)
    if (err) setError(err)
    else setShowLogin(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const err = await signup(signupName, signupEmail, signupPassword)
    if (err) setError(err)
    else setShowSignup(false)
  }

  const filtered = useMemo(() => {
    if (selectedCategory === "All") return PROJECTS
    return PROJECTS.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      </div>
    )
  }

  return (
    <>
      {/* Auth Modals */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-2xl font-bold text-center">Sign In</h2>
            <p className="mt-1 text-sm text-center text-zinc-500">Welcome back</p>
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input type="email" required className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input type="password" required className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" placeholder="Your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Sign In</button>
            </form>
            <p className="mt-4 text-center text-sm text-zinc-500">
              No account?{" "}
              <button onClick={() => { setShowLogin(false); setShowSignup(true); setError("") }} className="font-medium text-zinc-900 underline dark:text-zinc-100">Sign up</button>
            </p>
            <button onClick={() => setShowLogin(false)} className="mt-3 w-full text-xs text-zinc-400 hover:text-zinc-600">Close</button>
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-2xl font-bold text-center">Create Account</h2>
            <p className="mt-1 text-sm text-center text-zinc-500">Join to build AI-powered projects</p>
            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input type="text" required className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" placeholder="John Doe" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input type="email" required className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" placeholder="you@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input type="password" required minLength={6} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900" placeholder="At least 6 characters" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Create Account</button>
            </form>
            <p className="mt-4 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <button onClick={() => { setShowSignup(false); setShowLogin(true); setError("") }} className="font-medium text-zinc-900 underline dark:text-zinc-100">Sign in</button>
            </p>
            <button onClick={() => setShowSignup(false)} className="mt-3 w-full text-xs text-zinc-400 hover:text-zinc-600">Close</button>
          </div>
        </div>
      )}

      {/* BlueprintAI Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 px-6 pb-24 pt-20 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Build Apps with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Describe your app idea in plain English and let AI generate the full project.
            Create AI-powered companies with autonomous agent employees. All in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            {user ? (
              <>
                <Link href="/builder" className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Start Building</Link>
                <Link href="/company" className="rounded-full border border-zinc-300 px-8 py-3 text-sm font-medium transition hover:border-zinc-400 dark:border-zinc-700">Create Company</Link>
              </>
            ) : (
              <>
                <button onClick={() => setShowSignup(true)} className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Get Started Free</button>
                <button onClick={() => setShowLogin(true)} className="rounded-full border border-zinc-300 px-8 py-3 text-sm font-medium transition hover:border-zinc-400 dark:border-zinc-700">Sign In</button>
              </>
            )}
          </div>
        </div>
        <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </section>

      {/* BlueprintAI Features */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tight text-center">Everything you need</h2>
          <p className="mt-3 text-center text-zinc-600 dark:text-zinc-400">Three powerful tools to turn your ideas into reality.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <Link key={f.title} href={user ? f.href : "#"} onClick={(e) => { if (!user) { e.preventDefault(); setShowSignup(true) } }} className="group rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600">
                <span className="text-3xl">{f.emoji}</span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Authenticated Dashboard */}
      {user && dataLoaded && (
        <>
          <section className="border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold">Welcome back, {user.name}</h2>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">Here&apos;s your workspace overview.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                  <span className="text-2xl">📦</span>
                  <p className="mt-2 text-2xl font-bold">{dbProjects.length}</p>
                  <p className="text-sm text-zinc-500">Projects</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                  <span className="text-2xl">🏢</span>
                  <p className="mt-2 text-2xl font-bold">{companies.length}</p>
                  <p className="text-sm text-zinc-500">Companies</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                  <span className="text-2xl">🤖</span>
                  <p className="mt-2 text-2xl font-bold">{companies.reduce((sum, c) => sum + c._count.agents, 0)}</p>
                  <p className="text-sm text-zinc-500">AI Agents</p>
                </div>
              </div>
            </div>
          </section>

          {dbProjects.length > 0 && (
            <section className="border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
              <div className="mx-auto max-w-5xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Recent Projects</h2>
                  <Link href="/projects" className="text-sm font-medium text-blue-600 hover:underline">View all</Link>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {dbProjects.map((p) => (
                    <Link key={p.id} href={`/builder?project=${p.id}`} className="rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600">
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="mt-1 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">{p.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.techStack.map((t) => (
                          <span key={t} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{t}</span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {companies.length > 0 && (
            <section className="border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
              <div className="mx-auto max-w-5xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Your AI Companies</h2>
                  <Link href="/company" className="text-sm font-medium text-blue-600 hover:underline">View all</Link>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {companies.map((c) => (
                    <Link key={c.id} href={`/company/${c.id}`} className="rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🏢</span>
                        <div>
                          <h3 className="font-semibold">{c.name}</h3>
                          <p className="text-xs text-zinc-500">{c.industry} &middot; {c._count.agents} agents</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">{c.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="border-t border-zinc-200 px-6 py-16 dark:border-zinc-800">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-xl font-bold">Quick Actions</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Link href="/builder" className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
                  <span className="text-xl">🤖</span>
                  <div>
                    <p className="font-medium text-sm">New Project</p>
                    <p className="text-xs text-zinc-500">Chat with AI to build</p>
                  </div>
                </Link>
                <Link href="/company" className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
                  <span className="text-xl">🏢</span>
                  <div>
                    <p className="font-medium text-sm">New Company</p>
                    <p className="text-xs text-zinc-500">Create AI employees</p>
                  </div>
                </Link>
                <Link href="/projects" className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
                  <span className="text-xl">📁</span>
                  <div>
                    <p className="font-medium text-sm">My Projects</p>
                    <p className="text-xs text-zinc-500">Browse & download</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Hero / Portfolio */}
      <section className="px-6 pb-24 pt-20 text-center">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            BlueprintAI
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            AI-Powered App Development | Agentic Systems | Quantum ML | Chips | Robotics | AIoT | Biotech | Neural
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-zinc-600 dark:text-zinc-400">
            Building Across All AI Frontiers &mdash; mobile apps, web platforms, autonomous AI agents,
            AGI research, quantum-classical ML, AI semiconductors, AI-powered robotics, intelligent
            IoT, biotechnology, and neural science &mdash; all with the latest cutting-edge tech stacks.
            From idea to production.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a href="#work" className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">View Our Work</a>
            <a href="#contact" className="rounded-full border border-zinc-300 px-8 py-3 text-sm font-medium transition hover:border-zinc-400 dark:border-zinc-700">Contact Us</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-200 px-6 py-16 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 text-center">About Us</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-center sm:text-4xl">Technology Solutions &amp; Innovation</h2>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Headquartered in Singapore, BlueprintAI is a pioneering force in AI-powered software
            development and digital innovation. We specialize in transforming bold ideas into
            market-ready applications &mdash; from MVP development to full-scale production systems.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="text-2xl">🎯</span>
              <h3 className="mt-3 text-lg font-bold">Our Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                To revolutionize the digital sphere by creating intelligent, engaging solutions that
                empower businesses and individuals to thrive in the AI era. We believe technology
                should be a value multiplier, not just a tool.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="text-2xl">🔭</span>
              <h3 className="mt-3 text-lg font-bold">Our Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                A future where AI-powered solutions are accessible, practical, and transformative
                for every business &mdash; from startups launching their first MVP to enterprises
                scaling across the globe.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold">11</p>
              <p className="mt-1 text-sm text-zinc-500">AI Domains Covered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">110+</p>
              <p className="mt-1 text-sm text-zinc-500">Projects Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">50+</p>
              <p className="mt-1 text-sm text-zinc-500">Technologies Mastered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">16</p>
              <p className="mt-1 text-sm text-zinc-500">AI Agent Roles</p>
            </div>
          </div>
          <div className="mt-12 rounded-2xl border border-zinc-200 p-8 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-center">Our Values</h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-4">
              <div className="text-center">
                <span className="text-2xl">💡</span>
                <h4 className="mt-2 font-semibold text-sm">Innovation First</h4>
                <p className="mt-1 text-xs text-zinc-500">Pushing boundaries across every AI frontier</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">🎨</span>
                <h4 className="mt-2 font-semibold text-sm">User-Centric Design</h4>
                <p className="mt-1 text-xs text-zinc-500">Every solution prioritizes the user experience</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">📊</span>
                <h4 className="mt-2 font-semibold text-sm">Data-Driven Excellence</h4>
                <p className="mt-1 text-xs text-zinc-500">Leveraging ML to optimize every outcome</p>
              </div>
              <div className="text-center">
                <span className="text-2xl">🤝</span>
                <h4 className="mt-2 font-semibold text-sm">Collaborative Growth</h4>
                <p className="mt-1 text-xs text-zinc-500">Long-term partnerships built on trust and success</p>
              </div>
            </div>
          </div>

          {/* Our Journey */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-center">Our Journey</h3>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-zinc-500">From game development roots to AI-powered innovation</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
                <span className="text-2xl">🎮</span>
                <h4 className="mt-3 font-bold">Gaming Heritage</h4>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">Founded with expertise in immersive user experiences, real-time graphics, and interactive storytelling across global platforms.</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
                <span className="text-2xl">📈</span>
                <h4 className="mt-3 font-bold">Technical Evolution</h4>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">Applied gaming technology—engagement algorithms, behavioral analytics, and creative automation—to solve real-world problems.</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
                <span className="text-2xl">🧠</span>
                <h4 className="mt-3 font-bold">AI Integration</h4>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">Pioneered the integration of artificial intelligence with gamification to create intelligent, engaging digital solutions.</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
                <span className="text-2xl">🚀</span>
                <h4 className="mt-3 font-bold">AI Revolution</h4>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">Leading the industry in AI-powered automation, helping brands create experiences that are intelligent, engaging, and transformative.</p>
              </div>
            </div>
          </div>

          {/* Our Team */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-center">Our Team</h3>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-zinc-500">Creative minds and skilled engineers crafting the future of AI-powered development</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white">SC</div>
                <h4 className="mt-4 font-bold">Sarah Chen</h4>
                <p className="text-xs font-medium text-zinc-500">Chief Technology Officer</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">Former game engine architect with 12+ years in real-time systems and AI integration.</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-xl font-bold text-white">MR</div>
                <h4 className="mt-4 font-bold">Marcus Rodriguez</h4>
                <p className="text-xs font-medium text-zinc-500">Head of AI Research</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">Machine learning specialist pioneering conversational AI, agentic systems, and predictive analytics.</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-xl font-bold text-white">EK</div>
                <h4 className="mt-4 font-bold">Elena Kowalski</h4>
                <p className="text-xs font-medium text-zinc-500">Creative Director</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">Award-winning designer bridging AI capabilities with brand storytelling and user experience.</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white">DK</div>
                <h4 className="mt-4 font-bold">David Kim</h4>
                <p className="text-xs font-medium text-zinc-500">Data Science Lead</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">Analytics expert transforming user behavior insights into actionable AI-driven strategies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work */}
      <section id="work" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Selected Work</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Production Apps &amp; AI Solutions
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Explore {PROJECTS.length} projects across 11 AI domains &mdash; mobile apps, web platforms,
            AI agents, agentic AI, AGI, quantum ML, semiconductors, robotics, AIoT, biotechnology,
            and neural science. Filter by category to find what interests you.
          </p>

          {/* Category Dropdown Filter */}
          <div className="mt-10">
            <div className="relative inline-block w-full max-w-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Category)}
                className="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm font-medium outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_ICONS[cat]} {cat}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">▼</span>
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              {CATEGORY_ICONS[selectedCategory]} {selectedCategory} &mdash; Showing {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Project Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {filtered.map((project) => (
              <Link
                key={project.title}
                href={user ? `/builder?input=${encodeURIComponent(`Build a ${project.title} app: ${project.description} using ${project.tags.join(", ")}`)}` : "#"}
                onClick={(e) => { if (!user) { e.preventDefault(); setShowSignup(true) } }}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 transition hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{project.subtitle}</p>
                      <h3 className="mt-1 text-xl font-bold">{project.title}</h3>
                    </div>
                    <span className="shrink-0 text-2xl opacity-50">{CATEGORY_ICONS[project.category] || "🚀"}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{project.description}</p>
                  <ul className="mt-4 space-y-2">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clients */}
      <section className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Our Clients</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Trusted by Industry Leaders</h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
              We&apos;ve partnered with innovative companies across every sector — from startups to global enterprises.
              Our AI-powered solutions have delivered measurable results for 25+ clients worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 text-center dark:border-zinc-800 dark:from-blue-950/30 dark:to-indigo-950/30">
              <p className="text-3xl font-bold text-blue-600">25+</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">Clients Served</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-center dark:border-zinc-800 dark:from-emerald-950/30 dark:to-teal-950/30">
              <p className="text-3xl font-bold text-emerald-600">110+</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">Projects Delivered</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-purple-50 to-pink-50 p-5 text-center dark:border-zinc-800 dark:from-purple-950/30 dark:to-pink-950/30">
              <p className="text-3xl font-bold text-purple-600">98%</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">Client Satisfaction</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 text-center dark:border-zinc-800 dark:from-amber-950/30 dark:to-orange-950/30">
              <p className="text-3xl font-bold text-amber-600">6</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">Industry Verticals</p>
            </div>
          </div>

          {/* Industry Logo Grid */}
          <div className="mt-16">
            <p className="mb-8 text-center text-sm font-medium text-zinc-400">Serving across every major industry</p>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
              {[
                { name: "E-Commerce", emoji: "🛍️", color: "from-pink-100 to-rose-100 dark:from-pink-950/20 dark:to-rose-950/20", border: "border-pink-200 dark:border-pink-900" },
                { name: "Fintech", emoji: "💰", color: "from-emerald-100 to-teal-100 dark:from-emerald-950/20 dark:to-teal-950/20", border: "border-emerald-200 dark:border-emerald-900" },
                { name: "Gaming", emoji: "🎮", color: "from-violet-100 to-purple-100 dark:from-violet-950/20 dark:to-purple-950/20", border: "border-violet-200 dark:border-violet-900" },
                { name: "Healthcare", emoji: "🏥", color: "from-blue-100 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-950/20", border: "border-blue-200 dark:border-blue-900" },
                { name: "Education", emoji: "📚", color: "from-amber-100 to-yellow-100 dark:from-amber-950/20 dark:to-yellow-950/20", border: "border-amber-200 dark:border-amber-900" },
                { name: "Tech/SaaS", emoji: "☁️", color: "from-sky-100 to-indigo-100 dark:from-sky-950/20 dark:to-indigo-950/20", border: "border-sky-200 dark:border-sky-900" },
              ].map((ind) => (
                <div key={ind.name} className={`flex flex-col items-center gap-2 rounded-xl border bg-gradient-to-br p-5 text-center ${ind.color} ${ind.border}`}>
                  <span className="text-2xl">{ind.emoji}</span>
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">{ind.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Clients */}
          <div className="mt-16">
            <p className="mb-8 text-center text-sm font-medium text-zinc-400">Featured partnerships</p>
            <div className="grid gap-6 md:grid-cols-2">
              {/* DBS Bank */}
              <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇸🇬</span>
                      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">DBS Bank</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-blue-600">Financial Services</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  &ldquo;BlueprintAI transformed our customer service operations with an AI-powered chatbot that handles 40% of inquiries automatically. The integration was seamless and the ROI was immediate. A true game-changer for our digital banking division.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white">PL</div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Peter Lim</p>
                    <p className="text-xs text-zinc-500">VP of Digital Innovation, DBS Bank</p>
                  </div>
                </div>
              </div>

              {/* Singtel */}
              <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-purple-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-purple-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇸🇬</span>
                      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Singtel</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-purple-600">Telecommunications</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  &ldquo;The AI-driven network analytics platform built by BlueprintAI helped us reduce service disruptions by 35%. Their deep technical expertise and understanding of telecom infrastructure made them the ideal partner for this mission-critical project.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-sm font-bold text-white">MT</div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Michelle Tan</p>
                    <p className="text-xs text-zinc-500">CTO, Singtel Enterprise</p>
                  </div>
                </div>
              </div>

              {/* Sea Limited */}
              <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-green-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇸🇬</span>
                      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Sea Limited</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-green-600">E-Commerce & Gaming</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  &ldquo;BlueprintAI developed a real-time inventory optimization engine that boosted our fulfillment efficiency by 28% across Shopee&apos;s Southeast Asian markets. Their AI team understood our scale and delivered a robust solution that handles millions of transactions daily.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">JW</div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">James Wong</p>
                    <p className="text-xs text-zinc-500">Director of Engineering, Sea Limited</p>
                  </div>
                </div>
              </div>

              {/* GovTech SG */}
              <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-red-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-red-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇸🇬</span>
                      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">GovTech SG</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-red-600">Government Technology</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  &ldquo;Working with BlueprintAI on the ERP2 project was an exceptional experience. They delivered a secure, scalable message queuing system that handles critical tolling operations. Their understanding of government-grade security and compliance requirements is outstanding.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center text-sm font-bold text-white">SK</div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Siti Khadijah</p>
                    <p className="text-xs text-zinc-500">Senior Director, GovTech Singapore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logos Strip */}
          <div className="mt-16">
            <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-zinc-400">Additional clients who trust us</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {["OCBC Bank", "Grab", "Lazada", "ST Engineering", "NTUC Enterprise", "SingHealth", "NCS Group", "FoodPanda"].map((c) => (
                <div key={c} className="rounded-lg border border-zinc-200 px-5 py-3 dark:border-zinc-800">
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-center text-white sm:p-12 dark:from-zinc-800 dark:to-zinc-900">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Join 25+ Industry Leaders</h3>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-300">
              Ready to transform your business with AI-powered solutions? Let&apos;s build something extraordinary together.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="/#contact" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100">Start a Project</a>
              <a href="/pricing" className="rounded-full border border-zinc-500 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-700">View Pricing</a>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Strengths */}
      <section id="strengths" className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Technical Strengths</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What We Bring</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {STRENGTHS.map((s) => (
              <div key={s.title} className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
                <span className="text-2xl">{s.emoji}</span>
                <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 text-center">Services</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-center sm:text-4xl">What We Can Build For You</h2>
          <p className="mx-auto mt-3 max-w-3xl text-center text-zinc-600 dark:text-zinc-400">
            From MVP development to full-scale production applications &mdash; we provide end-to-end
            solutions that help startups launch faster, validate ideas quickly, and scale efficiently.
            Our client-centric approach ensures each solution is meticulously tailored to your challenges.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <div key={service.title} className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
                <span className="text-2xl">{service.emoji}</span>
                <h3 className="mt-3 text-lg font-bold">{service.title}</h3>
                <ul className="mt-5 space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 text-center">Our Process</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-center sm:text-4xl">How We Deliver</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">
            A proven methodology to take your idea from concept to production with speed and quality.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">01</span>
              <h3 className="mt-4 font-bold">Discovery &amp; Strategy</h3>
              <p className="mt-2 text-sm text-zinc-500">We analyze your vision, audience, and objectives to create a tailored strategy.</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">02</span>
              <h3 className="mt-4 font-bold">Design &amp; Prototype</h3>
              <p className="mt-2 text-sm text-zinc-500">Rapid prototyping with user-centric design thinking and iterative feedback.</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">03</span>
              <h3 className="mt-4 font-bold">Build &amp; Integrate</h3>
              <p className="mt-2 text-sm text-zinc-500">Agile development with AI-powered tooling, continuous integration, and testing.</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">04</span>
              <h3 className="mt-4 font-bold">Deploy &amp; Scale</h3>
              <p className="mt-2 text-sm text-zinc-500">Production deployment with monitoring, optimization, and ongoing support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 text-center">Industry Solutions</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-center sm:text-4xl">Solutions for Every Sector</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">
            Tailored AI strategies designed for your industry — from e-commerce and gaming to healthcare, finance, and beyond.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="text-2xl">🛍️</span>
              <h3 className="mt-3 text-lg font-bold">E-commerce & Retail</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Boost online sales with personalized product recommendations, dynamic pricing, and gamified shopping experiences.</p>
              <div className="mt-4 flex gap-4">
                <div><p className="text-lg font-bold text-green-600">+240%</p><p className="text-xs text-zinc-500">Conversion</p></div>
                <div><p className="text-lg font-bold text-blue-600">3.8x</p><p className="text-xs text-zinc-500">ROAS</p></div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="text-2xl">🎮</span>
              <h3 className="mt-3 text-lg font-bold">Gaming & Entertainment</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Native in-game experiences, rewarded video ads, and interactive brand integrations that enhance gameplay.</p>
              <div className="mt-4 flex gap-4">
                <div><p className="text-lg font-bold text-green-600">+85%</p><p className="text-xs text-zinc-500">Engagement</p></div>
                <div><p className="text-lg font-bold text-blue-600">4.2x</p><p className="text-xs text-zinc-500">Brand Recall</p></div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="text-2xl">🏦</span>
              <h3 className="mt-3 text-lg font-bold">Financial Services</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Build trust through educational content, interactive calculators, and personalized financial planning tools.</p>
              <div className="mt-4 flex gap-4">
                <div><p className="text-lg font-bold text-green-600">+160%</p><p className="text-xs text-zinc-500">Lead Quality</p></div>
                <div><p className="text-lg font-bold text-blue-600">-45%</p><p className="text-xs text-zinc-500">Cost</p></div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="text-2xl">🏥</span>
              <h3 className="mt-3 text-lg font-bold">Healthcare & Wellness</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Compliant solutions that educate patients, promote preventive care, and connect people with health resources.</p>
              <div className="mt-4 flex gap-4">
                <div><p className="text-lg font-bold text-green-600">92%</p><p className="text-xs text-zinc-500">Compliance</p></div>
                <div><p className="text-lg font-bold text-blue-600">3.1x</p><p className="text-xs text-zinc-500">Engagement</p></div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="text-2xl">💻</span>
              <h3 className="mt-3 text-lg font-bold">Technology & SaaS</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Interactive demos, free trial gamification, and AI-powered feature highlighting that drives B2B conversions.</p>
              <div className="mt-4 flex gap-4">
                <div><p className="text-lg font-bold text-green-600">+180%</p><p className="text-xs text-zinc-500">Trial Conv.</p></div>
                <div><p className="text-lg font-bold text-blue-600">5.4x</p><p className="text-xs text-zinc-500">Demo Req.</p></div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <span className="text-2xl">📚</span>
              <h3 className="mt-3 text-lg font-bold">Education & E-learning</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Interactive curriculum previews, skill assessment games, and personalized learning path recommendations.</p>
              <div className="mt-4 flex gap-4">
                <div><p className="text-lg font-bold text-green-600">+220%</p><p className="text-xs text-zinc-500">Enrollment</p></div>
                <div><p className="text-lg font-bold text-blue-600">67%</p><p className="text-xs text-zinc-500">Completion</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 text-center">Success Stories</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-center sm:text-4xl">Real Results, Real Impact</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">
            See how our AI-powered solutions have transformed businesses across industries.
          </p>
          <div className="mt-12 grid gap-8">
            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🛍️</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">E-commerce Growth</p>
                      <h3 className="mt-1 text-xl font-bold">Global Fashion Retailer</h3>
                    </div>
                    <span className="hidden rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 sm:inline-block dark:bg-green-900/30 dark:text-green-400">+240% Conversion</span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">A leading online fashion retailer partnered with us to revolutionize their digital strategy using AI-powered personalization and intelligent automation.</p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">The Challenge</p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">High cart abandonment rates (73%) and low customer lifetime value despite strong brand recognition and quality products.</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-semibold">Our Solution</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">AI Personalization Engine</span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Smart Recommendations</span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Dynamic Pricing</span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Behavioral Analytics</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-green-600">+240%</p><p className="text-xs text-zinc-500">Conversion Rate</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-blue-600">+180%</p><p className="text-xs text-zinc-500">Customer LTV</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-green-600">-45%</p><p className="text-xs text-zinc-500">Cart Abandonment</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-blue-600">4.8x</p><p className="text-xs text-zinc-500">ROAS</p></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎮</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Gaming Engagement</p>
                      <h3 className="mt-1 text-xl font-bold">Mobile Gaming Studio</h3>
                    </div>
                    <span className="hidden rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 sm:inline-block dark:bg-green-900/30 dark:text-green-400">+320% Ad Revenue</span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">A mobile game developer sought to monetize their free-to-play titles without compromising user experience through native AI integration.</p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">The Challenge</p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Traditional monetization was causing 35% user churn while contributing minimal revenue to their freemium gaming model.</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-semibold">Our Solution</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Native AI Integrations</span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Rewarded Experiences</span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">AI-Optimized Timing</span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">User Behavior Analysis</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-green-600">+320%</p><p className="text-xs text-zinc-500">Ad Revenue</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-blue-600">+85%</p><p className="text-xs text-zinc-500">User Engagement</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-green-600">-60%</p><p className="text-xs text-zinc-500">User Churn</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-blue-600">92%</p><p className="text-xs text-zinc-500">Satisfaction</p></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex items-start gap-4">
                <span className="text-3xl">💻</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">SaaS Conversion</p>
                      <h3 className="mt-1 text-xl font-bold">B2B SaaS Platform</h3>
                    </div>
                    <span className="hidden rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 sm:inline-block dark:bg-green-900/30 dark:text-green-400">+280% Trial Conv.</span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">A project management SaaS company needed to improve free trial conversion rates and reduce acquisition costs in a competitive market.</p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">The Challenge</p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Complex software features were difficult to communicate effectively, resulting in low trial-to-paid conversion (12%) and high CAC.</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-semibold">Our Solution</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Interactive Demos</span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">AI-Powered Onboarding</span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Feature Highlighting</span>
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Personalized Demos</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-green-600">+280%</p><p className="text-xs text-zinc-500">Trial Conversion</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-blue-600">+540%</p><p className="text-xs text-zinc-500">Demo Requests</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-green-600">-55%</p><p className="text-xs text-zinc-500">Customer CAC</p></div>
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-900"><p className="text-lg font-bold text-blue-600">6.2x</p><p className="text-xs text-zinc-500">ROI</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech-stack" className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Tech Stack</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Best AI Tech Stack</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Cutting-edge tools across LLMs, agentic frameworks, AGI research, quantum computing,
            semiconductors, robotics, AIoT, biotechnology, neural science, and cloud
            infrastructure for production-grade AI-powered applications.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_CATEGORIES.map((cat) => (
              <div key={cat.label} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">{cat.label}</h3>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{cat.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Contact</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Let&apos;s Build Something Intelligent</h2>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
            Have a project involving mobile apps, AI agents, AGI, quantum ML, semiconductors,
            robotics, AIoT, biotechnology, or neural science? Let&apos;s discuss how cutting-edge AI
            can transform your product.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="mailto:npoluri5@gmail.com" className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">Contact Us</a>
            <a href="tel:+6581765178" className="rounded-full border border-zinc-300 px-8 py-3 text-sm font-medium transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500">+65 8176 5178</a>
          </div>
          <div className="mt-8 flex flex-col items-center gap-2 text-sm text-zinc-500">
            <a href="mailto:npoluri5@gmail.com" className="hover:text-zinc-700 dark:hover:text-zinc-300">npoluri5@gmail.com</a>
            <span>+65 8176 5178</span>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Join Our Team</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Shape the Future of AI</h2>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
            We are always looking for creative minds and skilled developers to push the boundaries of what&apos;s possible.
          </p>
          <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <span className="text-lg">🧠</span>
              <div><p className="text-sm font-semibold">Cutting-Edge AI</p><p className="text-xs text-zinc-500">Work on LLMs, agentic systems, quantum ML, and more</p></div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <span className="text-lg">🌍</span>
              <div><p className="text-sm font-semibold">Remote & Hybrid</p><p className="text-xs text-zinc-500">Flexible work options across global time zones</p></div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <span className="text-lg">💰</span>
              <div><p className="text-sm font-semibold">Competitive Equity</p><p className="text-xs text-zinc-500">Compensation packages that reward impact</p></div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <span className="text-lg">📈</span>
              <div><p className="text-sm font-semibold">Growth & Learning</p><p className="text-xs text-zinc-500">Professional development and learning opportunities</p></div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="mailto:npoluri5@gmail.com" className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">Send Your Resume</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 text-center">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-center sm:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-12 space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between px-6 py-4 text-left">
                  <span className="text-sm font-medium pr-4">{faq.q}</span>
                  <span className={`shrink-0 text-zinc-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}>▼</span>
                </button>
                {openFaq === i && <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800"><p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 px-6 py-8 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-zinc-500 sm:flex-row">
          <p>&copy; 2026 BlueprintAI &mdash; AI-Powered Development | 11 Domains | 110+ Projects.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">Privacy</Link>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300">Terms</Link>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <a href="mailto:npoluri5@gmail.com" className="hover:text-zinc-700 dark:hover:text-zinc-300">npoluri5@gmail.com</a>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span>Singapore HQ</span>
          </div>
        </div>
      </footer>
    </>
  )
}
