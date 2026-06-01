"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

interface Message {
  role: "user" | "assistant"
  content: string
}

interface GeneratedFile {
  path: string
  content: string
}

interface ProjectResult {
  id: string
  title: string
  description: string
  techStack: string[]
  structure: string[]
  files: GeneratedFile[]
  createdAt: string
}

const INDUSTRIES = [
  { value: "all", label: "All Industries" },
  { value: "ai-ml", label: "🤖 AI / ML & Agents" },
  { value: "mobile", label: "📱 Mobile Development" },
  { value: "web", label: "🌐 Web Development" },
  { value: "enterprise", label: "🏢 Enterprise Software" },
  { value: "fintech", label: "💰 FinTech" },
  { value: "healthtech", label: "🧬 HealthTech / Biotech" },
  { value: "robotics", label: "🦾 Robotics / Hardware" },
  { value: "quantum", label: "⚛️ Quantum Computing" },
  { value: "semiconductor", label: "💠 Semiconductor / Chip Design" },
  { value: "iot", label: "🔗 IoT / Embedded Systems" },
  { value: "blockchain", label: "🔗 Blockchain / Web3" },
  { value: "gaming", label: "🎮 Game Development" },
  { value: "arvr", label: "🥽 AR / VR" },
  { value: "data", label: "📊 Data Engineering / Analytics" },
  { value: "devops", label: "☁️ DevOps / Cloud Infrastructure" },
]

const MODEL_TIERS = [
  { value: "auto", label: "Auto-detect by AI 🎯" },
  { value: "premium", label: "Premium — GPT-4o, Claude Opus 4, Gemini 2.5 Pro, DeepSeek-R1" },
  { value: "standard", label: "Standard — GPT-4o-mini, Claude Haiku, Gemini Flash, Mistral Small" },
  { value: "open-source", label: "Open-Source — Llama 4, Mistral, Qwen, DeepSeek-V3 (self-hosted)" },
  { value: "mixed", label: "Mixed — Premium orchestration + Open-Source inference" },
]

const ADOPTION_OPTIONS = [
  { value: "auto", label: "Auto-detect by industry 🎯" },
  { value: "Very High (>60%)", label: "Very High (>60%) — ICT, Finance, Telecom, Media, E-commerce, Healthcare, Cybersecurity" },
  { value: "High (40-60%)", label: "High (40-60%) — Professional Services, Education, Real Estate" },
  { value: "Medium (25-50%)", label: "Medium (25-50%) — Manufacturing, Utilities, Wholesale" },
  { value: "Low (10-25%)", label: "Low (10-25%) — Transportation, Accommodation, Admin" },
  { value: "Very Low (<11%)", label: "Very Low (<11%) — Construction, Agriculture, Mining" },
]

const ADOPTION_BY_INDUSTRY: Record<string, string> = {
  all: "Auto-detect by industry 🎯",
  "ai-ml": "Very High (>60%)",
  mobile: "Very High (>60%)",
  web: "Very High (>60%)",
  enterprise: "Very High (>60%)",
  fintech: "Very High (>60%)",
  healthtech: "High (40-60%)",
  robotics: "Medium (25-50%)",
  quantum: "Medium (25-50%)",
  semiconductor: "Medium (25-50%)",
  iot: "Medium (25-50%)",
  blockchain: "Very High (>60%)",
  gaming: "Medium (25-50%)",
  arvr: "Medium (25-50%)",
  data: "Very High (>60%)",
  devops: "Very High (>60%)",
}

const CATEGORIES: Record<string, { value: string; emoji: string }[]> = {
  all: [
    { value: "All", emoji: "🏗️" },
    { value: "Mobile Apps", emoji: "📱" },
    { value: "Web Apps", emoji: "🌐" },
    { value: "AI Agents", emoji: "🤖" },
    { value: "Agentic AI", emoji: "🧠" },
    { value: "AGI", emoji: "✨" },
    { value: "Quantum AI", emoji: "⚛️" },
    { value: "AI Robotics", emoji: "🦾" },
    { value: "AI Semiconductors", emoji: "💠" },
    { value: "AIoT", emoji: "🔗" },
    { value: "AI + Biotechnology", emoji: "🧬" },
    { value: "AI + Neural Science", emoji: "🔬" },
    { value: "Data Engineering", emoji: "📊" },
    { value: "RAG Pipelines", emoji: "🔍" },
    { value: "Fine-Tuning / Training", emoji: "🎯" },
    { value: "LLM Ops / Inference", emoji: "⚡" },
    { value: "Blockchain / Web3", emoji: "🔗" },
    { value: "Game Development", emoji: "🎮" },
    { value: "AR / VR", emoji: "🥽" },
    { value: "Realtime AI Applications", emoji: "⚡" },
  ],
  "ai-ml": [
    { value: "AI Agents", emoji: "🤖" },
    { value: "Agentic AI", emoji: "🧠" },
    { value: "AGI", emoji: "✨" },
    { value: "RAG Pipelines", emoji: "🔍" },
    { value: "Fine-Tuning / Training", emoji: "🎯" },
    { value: "LLM Ops / Inference", emoji: "⚡" },
    { value: "Quantum AI", emoji: "⚛️" },
    { value: "Data Engineering", emoji: "📊" },
  ],
  mobile: [
    { value: "Mobile Apps", emoji: "📱" },
    { value: "AI Agents", emoji: "🤖" },
  ],
  web: [
    { value: "Web Apps", emoji: "🌐" },
    { value: "AI Agents", emoji: "🤖" },
    { value: "RAG Pipelines", emoji: "🔍" },
  ],
  enterprise: [
    { value: "Web Apps", emoji: "🌐" },
    { value: "AI Agents", emoji: "🤖" },
    { value: "RAG Pipelines", emoji: "🔍" },
    { value: "Data Engineering", emoji: "📊" },
  ],
  fintech: [
    { value: "Mobile Apps", emoji: "📱" },
    { value: "Web Apps", emoji: "🌐" },
    { value: "AI Agents", emoji: "🤖" },
    { value: "Data Engineering", emoji: "📊" },
    { value: "RAG Pipelines", emoji: "🔍" },
  ],
  healthtech: [
    { value: "AI + Biotechnology", emoji: "🧬" },
    { value: "AI + Neural Science", emoji: "🔬" },
    { value: "Mobile Apps", emoji: "📱" },
    { value: "Data Engineering", emoji: "📊" },
  ],
  robotics: [
    { value: "AI Robotics", emoji: "🦾" },
    { value: "AIoT", emoji: "🔗" },
    { value: "AI Semiconductors", emoji: "💠" },
  ],
  quantum: [
    { value: "Quantum AI", emoji: "⚛️" },
    { value: "AI Semiconductors", emoji: "💠" },
    { value: "AGI", emoji: "✨" },
  ],
  semiconductor: [
    { value: "AI Semiconductors", emoji: "💠" },
    { value: "AI Robotics", emoji: "🦾" },
    { value: "Quantum AI", emoji: "⚛️" },
  ],
  iot: [
    { value: "AIoT", emoji: "🔗" },
    { value: "AI Robotics", emoji: "🦾" },
    { value: "Mobile Apps", emoji: "📱" },
  ],
  blockchain: [
    { value: "Web Apps", emoji: "🌐" },
    { value: "Mobile Apps", emoji: "📱" },
    { value: "AI Agents", emoji: "🤖" },
  ],
  gaming: [
    { value: "Mobile Apps", emoji: "📱" },
    { value: "AR / VR", emoji: "🥽" },
    { value: "AI Agents", emoji: "🤖" },
  ],
  arvr: [
    { value: "AR / VR", emoji: "🥽" },
    { value: "Mobile Apps", emoji: "📱" },
    { value: "AI Robotics", emoji: "🦾" },
    { value: "AI Agents", emoji: "🤖" },
  ],
  data: [
    { value: "Data Engineering", emoji: "📊" },
    { value: "Web Apps", emoji: "🌐" },
    { value: "AI Agents", emoji: "🤖" },
  ],
  devops: [
    { value: "Web Apps", emoji: "🌐" },
    { value: "Data Engineering", emoji: "📊" },
    { value: "AI Agents", emoji: "🤖" },
  ],
}

const TECH_STACKS: Record<string, Record<string, string[]>> = {
  all: {
    "All": ["Auto-detect by AI", "Next.js + TypeScript + Tailwind", "React + Python + FastAPI", "Flutter + Firebase", "LangChain + OpenAI + Pinecone", "React Native + Node.js", "Python + FastAPI + PostgreSQL", "Rust + WASM", "Go + PostgreSQL + Redis", "PyTorch + JAX + CUDA"],
    "Mobile Apps": ["Flutter + Firebase", "React Native + Node.js", "SwiftUI + Firebase", "Jetpack Compose + Kotlin", "Flutter + Supabase", "Xamarin + Azure"],
    "Web Apps": ["Next.js + TypeScript + PostgreSQL", "React + Python + FastAPI", "Vue + Node.js + MongoDB", "Svelte + Go + SQLite", "Angular + C# + SQL Server", "Nuxt + Prisma + PostgreSQL"],
    "AI Agents": ["LangChain + OpenAI + Pinecone", "CrewAI + GPT-4o + Weaviate", "AutoGen + LangGraph + Qdrant", "LangChain + Claude + ChromaDB", "Semantic Kernel + Azure OpenAI", "Haystack + Mistral + Milvus", "MCP + LangChain + FastAPI", "LangGraph + MCP + Neo4j"],
    "Agentic AI": ["CrewAI + LangGraph + GPT-4o", "AutoGen + LangChain + Neo4j", "Temporal + LangGraph + Python", "Multi-Agent + FastAPI + Redis", "Semantic Kernel + AutoGen", "CrewAI + MCP + LangGraph", "AutoGen + MCP + FastAPI"],
    "RAG Pipelines": ["LangChain + Cohere + Weaviate", "Haystack + OpenAI + Pinecone", "LlamaIndex + GPT-4o + ChromaDB", "LangChain + Claude + Milvus", "RAG + Hybrid Search + Qdrant", "MCP + LangChain + VectorDB"],
    "Fine-Tuning / Training": ["LoRA + PEFT + PyTorch", "QLoRA + Transformers + Axolotl", "Unsloth + DeepSpeed + vLLM", "SFT + DPO + TRL", "Axolotl + FSDP + HuggingFace", "Fine-Tuning + ONNX + TensorRT"],
    "LLM Ops / Inference": ["vLLM + FastAPI + Docker", "Ollama + LangChain + GPU", "llama.cpp + TensorRT-LLM + CUDA", "TGI + vLLM + Kubernetes", "BentoML + MLflow + GPU Cluster"],
    AGI: ["PyTorch + DeepSpeed + vLLM", "JAX + TensorFlow + ONNX", "Rust + Python + Neo4j", "PyTorch + JAX + Ray", "DeepSpeed + Megatron + Apex"],
    "Quantum AI": ["Qiskit + Pennylane + Python", "Cirq + CUDA-Q + NumPy", "D-Wave Ocean + Qiskit + AWS Braket", "Pennylane + JAX + scikit-learn", "IBM Quantum + Qiskit + Python"],
    "AI Robotics": ["ROS 2 + OpenCV + PyTorch", "ROS 2 + Gazebo + TensorFlow", "NVIDIA Jetson + C++ + MQTT", "Isaac Gym + PyTorch + ROS 2", "MoveIt + OpenCV + C++"],
    "AI Semiconductors": ["GNN + PyTorch + EDA Tools", "Verilog + Spiking Neural Nets", "Reinforcement Learning + Verilog", "Python + Verilog + SPICE", "Chisel + FIRRTL + Scala"],
    AIoT: ["Edge Impulse + TensorFlow Lite", "MQTT + InfluxDB + AWS IoT", "LoRaWAN + Edge Impulse + TimescaleDB", "AWS IoT Greengrass + TensorFlow", "ESP32 + MQTT + Node-RED"],
    "AI + Biotechnology": ["RDKit + DeepChem + PyTorch", "AlphaFold + ESM-2 + PyTorch", "GATK + DeepVariant + TensorFlow", "BioPython + PyTorch + TensorFlow", "Cellpose + PyTorch + CUDA"],
    "AI + Neural Science": ["MNE-Python + PyTorch + EEGLAB", "FreeSurfer + MRtrix + PyTorch", "Open Ephys + Python + SIMNIBS", "FSL + ANTs + Python", "Kilosort + PyTorch + CUDA"],
    "Data Engineering": ["Apache Spark + Python + SQL", "Kafka + Flink + PostgreSQL", "Airflow + dbt + BigQuery", "Snowflake + dbt + Python", "Databricks + Spark + MLflow"],
    "Blockchain / Web3": ["Solidity + Hardhat + Ethers.js", "Rust + Solana + Anchor", "Go + Ethereum + Web3.js", "Python + Brownie + Web3.py", "TypeScript + Wagmi + Viem"],
    "Game Development": ["Unity + C# + Blender", "Unreal Engine + C++ + Blueprints", "Godot + GDScript + Blender", "Phaser + TypeScript + WebGL", "Three.js + React + WebGL"],
    "Realtime AI Applications": ["FastAPI + WebSockets + React", "Node.js + Socket.IO + Next.js", "Python + WebSocket + React", "Go + WebSocket + Vue", "FastAPI + SSE + Svelte", "Express + Socket.IO + React Native"],
    "AR / VR": ["Unity + AR Foundation + C#", "Three.js + WebXR + TypeScript", "Unreal Engine + VR + C++", "ARKit + Swift + RealityKit", "ARCore + Kotlin + Sceneform"],
  },
  "ai-ml": {
    "All": ["Auto-detect by AI", "Python + PyTorch + CUDA", "Python + TensorFlow + TPU", "JAX + Flax + TPU", "Rust + ONNX + Python"],
    "AI Agents": ["LangChain + OpenAI + Pinecone", "CrewAI + GPT-4o + Weaviate", "AutoGen + LangGraph + Qdrant", "LangChain + Claude + ChromaDB", "Semantic Kernel + Azure OpenAI", "MCP + LangChain + FastAPI"],
    "Agentic AI": ["CrewAI + LangGraph + GPT-4o", "AutoGen + LangChain + Neo4j", "Temporal + LangGraph + Python", "Multi-Agent + FastAPI + Redis", "Semantic Kernel + AutoGen", "CrewAI + MCP + LangGraph"],
    "RAG Pipelines": ["LangChain + Cohere + Weaviate", "Haystack + OpenAI + Pinecone", "LlamaIndex + GPT-4o + ChromaDB", "LangChain + Claude + Milvus", "RAG + Hybrid Search + Qdrant", "MCP + LangChain + VectorDB"],
    "Fine-Tuning / Training": ["LoRA + PEFT + PyTorch", "QLoRA + Transformers + Axolotl", "Unsloth + DeepSpeed + vLLM", "SFT + DPO + TRL", "Axolotl + FSDP + HuggingFace"],
    "LLM Ops / Inference": ["vLLM + FastAPI + Docker", "Ollama + LangChain + GPU", "llama.cpp + TensorRT-LLM + CUDA", "TGI + vLLM + Kubernetes", "BentoML + MLflow + GPU Cluster"],
    AGI: ["PyTorch + DeepSpeed + vLLM", "JAX + TensorFlow + ONNX", "Rust + Python + Neo4j", "PyTorch + JAX + Ray"],
    "Realtime AI Applications": ["FastAPI + WebSockets + React", "Node.js + Socket.IO + Next.js", "Python + WebSocket + React", "Go + WebSocket + Vue", "FastAPI + SSE + Svelte", "Express + Socket.IO + React Native"],
    "Quantum AI": ["Qiskit + Pennylane + Python", "Cirq + CUDA-Q + NumPy", "D-Wave Ocean + Qiskit + AWS Braket", "Pennylane + JAX + scikit-learn"],
    "Data Engineering": ["Apache Spark + Python + SQL", "Kafka + Flink + PostgreSQL", "Airflow + dbt + BigQuery", "Databricks + Spark + MLflow"],
  },
  mobile: {
    "All": ["Auto-detect by AI", "Flutter + Firebase", "React Native + Node.js", "SwiftUI + Firebase", "Jetpack Compose + Kotlin", "Flutter + Supabase", "Kotlin Multiplatform + Compose"],
    "Mobile Apps": ["Flutter + Firebase", "React Native + Node.js", "SwiftUI + Firebase", "Jetpack Compose + Kotlin", "Flutter + Supabase", "Xamarin + Azure", "Kotlin Multiplatform + Compose"],
    "AI Agents": ["LangChain + OpenAI + On-Device ML", "ML Kit + Firebase + Flutter", "CoreML + Swift + Vision", "TensorFlow Lite + React Native", "MediaPipe + Flutter + Edge TPU"],
  },
  web: {
    "All": ["Auto-detect by AI", "Next.js + TypeScript + PostgreSQL", "React + Python + FastAPI", "Vue + Node.js + MongoDB", "Svelte + Go + SQLite", "Angular + C# + SQL Server", "Nuxt + Prisma + PostgreSQL", "Remix + Prisma + SQLite"],
    "Web Apps": ["Next.js + TypeScript + PostgreSQL", "React + Python + FastAPI", "Vue + Node.js + MongoDB", "Svelte + Go + SQLite", "Angular + C# + SQL Server", "Nuxt + Prisma + PostgreSQL", "Remix + Prisma + SQLite"],
    "AI Agents": ["LangChain + OpenAI + Next.js", "CrewAI + Python + WebSocket", "AutoGen + FastAPI + React", "MCP + LangChain + TypeScript"],
    "RAG Pipelines": ["LangChain + Vercel AI SDK + ChromaDB", "Haystack + Next.js + Pinecone", "LlamaIndex + Node.js + Qdrant"],
  },
  fintech: {
    "All": ["Auto-detect by AI", "Next.js + TypeScript + PostgreSQL", "React + Python + FastAPI", "Flutter + Firebase", "React Native + Node.js", "Rust + Actix + PostgreSQL"],
    "Mobile Apps": ["Flutter + Firebase", "React Native + Node.js", "SwiftUI + Firebase", "Jetpack Compose + Kotlin"],
    "Web Apps": ["Next.js + TypeScript + PostgreSQL", "React + Python + FastAPI", "Angular + C# + SQL Server", "Svelte + Go + SQLite"],
    "AI Agents": ["LangChain + OpenAI + Pinecone", "CrewAI + GPT-4o + Weaviate", "AutoGen + LangGraph + Qdrant", "Semantic Kernel + Azure OpenAI"],
    "RAG Pipelines": ["LangChain + Cohere + Weaviate", "Haystack + OpenAI + Pinecone", "LlamaIndex + GPT-4o + ChromaDB"],
    "Data Engineering": ["Apache Spark + Python + SQL", "Kafka + Flink + PostgreSQL", "Airflow + dbt + BigQuery"],
  },
  healthtech: {
    "All": ["Auto-detect by AI", "Python + PyTorch + CUDA", "Python + TensorFlow + TPU", "RDKit + DeepChem + PyTorch", "Flutter + Firebase", "Next.js + TypeScript + PostgreSQL"],
    "AI + Biotechnology": ["RDKit + DeepChem + PyTorch", "AlphaFold + ESM-2 + PyTorch", "GATK + DeepVariant + TensorFlow", "BioPython + PyTorch + TensorFlow", "Cellpose + PyTorch + CUDA"],
    "AI + Neural Science": ["MNE-Python + PyTorch + EEGLAB", "FreeSurfer + MRtrix + PyTorch", "Open Ephys + Python + SIMNIBS", "FSL + ANTs + Python"],
    "AI Agents": ["LangChain + OpenAI + HIPAA", "CrewAI + GPT-4o + FHIR", "AutoGen + LangGraph + MedSync"],
    "Mobile Apps": ["Flutter + Firebase", "React Native + Node.js", "SwiftUI + HealthKit"],
    "Data Engineering": ["Apache Spark + Python + SQL", "Airflow + dbt + BigQuery"],
  },
  robotics: {
    "All": ["Auto-detect by AI", "ROS 2 + OpenCV + PyTorch", "ROS 2 + Gazebo + TensorFlow", "NVIDIA Jetson + C++ + MQTT", "Isaac Gym + PyTorch + ROS 2", "C++ + Python + OpenCV"],
    "AI Robotics": ["ROS 2 + OpenCV + PyTorch", "ROS 2 + Gazebo + TensorFlow", "NVIDIA Jetson + C++ + MQTT", "Isaac Gym + PyTorch + ROS 2", "MoveIt + OpenCV + C++"],
    AIoT: ["Edge Impulse + TensorFlow Lite", "MQTT + InfluxDB + AWS IoT", "ESP32 + MQTT + Node-RED"],
    "AI Semiconductors": ["GNN + PyTorch + EDA Tools", "Verilog + Spiking Neural Nets"],
  },
  quantum: {
    "All": ["Auto-detect by AI", "Qiskit + Pennylane + Python", "Cirq + CUDA-Q + NumPy", "D-Wave Ocean + Qiskit + AWS Braket", "Pennylane + JAX + scikit-learn", "IBM Quantum + Qiskit + Python"],
    "Quantum AI": ["Qiskit + Pennylane + Python", "Cirq + CUDA-Q + NumPy", "D-Wave Ocean + Qiskit + AWS Braket", "Pennylane + JAX + scikit-learn", "IBM Quantum + Qiskit + Python"],
    "AI Semiconductors": ["GNN + PyTorch + EDA Tools", "Verilog + Spiking Neural Nets", "Reinforcement Learning + Verilog"],
    AGI: ["PyTorch + DeepSpeed + vLLM", "JAX + TensorFlow + ONNX"],
  },
  semiconductor: {
    "All": ["Auto-detect by AI", "Python + Verilog + SPICE", "GNN + PyTorch + EDA Tools", "Verilog + Spiking Neural Nets", "Reinforcement Learning + Verilog", "Chisel + FIRRTL + Scala"],
    "AI Semiconductors": ["GNN + PyTorch + EDA Tools", "Verilog + Spiking Neural Nets", "Reinforcement Learning + Verilog", "Python + Verilog + SPICE", "Chisel + FIRRTL + Scala"],
    "AI Robotics": ["ROS 2 + OpenCV + PyTorch", "NVIDIA Jetson + C++ + MQTT"],
    "Quantum AI": ["Qiskit + Pennylane + Python", "Cirq + CUDA-Q + NumPy"],
  },
  iot: {
    "All": ["Auto-detect by AI", "ESP32 + MQTT + Node-RED", "Edge Impulse + TensorFlow Lite", "MQTT + InfluxDB + AWS IoT", "LoRaWAN + Edge Impulse + TimescaleDB", "AWS IoT Greengrass + TensorFlow", "Rust + MQTT + Embedded"],
    AIoT: ["Edge Impulse + TensorFlow Lite", "MQTT + InfluxDB + AWS IoT", "LoRaWAN + Edge Impulse + TimescaleDB", "AWS IoT Greengrass + TensorFlow", "ESP32 + MQTT + Node-RED"],
    "AI Robotics": ["ROS 2 + OpenCV + PyTorch", "NVIDIA Jetson + C++ + MQTT"],
    "Mobile Apps": ["Flutter + Firebase", "React Native + Node.js"],
  },
  blockchain: {
    "All": ["Auto-detect by AI", "Solidity + Hardhat + Ethers.js", "Rust + Solana + Anchor", "Go + Ethereum + Web3.js", "Python + Brownie + Web3.py", "TypeScript + Wagmi + Viem", "Rust + Substrate + Polkadot"],
    "Blockchain / Web3": ["Solidity + Hardhat + Ethers.js", "Rust + Solana + Anchor", "Go + Ethereum + Web3.js", "Python + Brownie + Web3.py", "TypeScript + Wagmi + Viem", "Rust + Substrate + Polkadot"],
    "Web Apps": ["Next.js + TypeScript + PostgreSQL", "React + Python + FastAPI"],
    "Mobile Apps": ["Flutter + Firebase", "React Native + Node.js"],
    "AI Agents": ["LangChain + OpenAI + Solana", "CrewAI + GPT-4o + Web3", "AutoGen + LangGraph + Smart Contracts"],
  },
  gaming: {
    "All": ["Auto-detect by AI", "Unity + C# + Blender", "Unreal Engine + C++ + Blueprints", "Godot + GDScript + Blender", "Phaser + TypeScript + WebGL", "Three.js + React + WebGL", "Bevy + Rust + WASM"],
    "Game Development": ["Unity + C# + Blender", "Unreal Engine + C++ + Blueprints", "Godot + GDScript + Blender", "Phaser + TypeScript + WebGL", "Three.js + React + WebGL", "Bevy + Rust + WASM"],
    "AR / VR": ["Unity + AR Foundation + C#", "Three.js + WebXR + TypeScript", "Unreal Engine + VR + C++"],
    "Mobile Apps": ["Flutter + Firebase", "React Native + Node.js"],
    "AI Agents": ["LangChain + OpenAI + Game Engine", "CrewAI + GPT-4o + NPC Logic", "AutoGen + LangGraph + Unity ML-Agents"],
  },
  arvr: {
    "All": ["Auto-detect by AI", "Unity + AR Foundation + C#", "Three.js + WebXR + TypeScript", "Unreal Engine + VR + C++", "ARKit + Swift + RealityKit", "ARCore + Kotlin + Sceneform", "Unity + OpenXR + C#"],
    "AR / VR": ["Unity + AR Foundation + C#", "Three.js + WebXR + TypeScript", "Unreal Engine + VR + C++", "ARKit + Swift + RealityKit", "ARCore + Kotlin + Sceneform", "Unity + OpenXR + C#"],
    "Game Development": ["Unity + C# + Blender", "Unreal Engine + C++ + Blueprints", "Three.js + React + WebGL"],
    "Mobile Apps": ["Flutter + Firebase", "SwiftUI + Firebase", "Jetpack Compose + Kotlin"],
    "AI Agents": ["LangChain + OpenAI + AR Cloud", "CrewAI + GPT-4o + Spatial Computing", "AutoGen + LangGraph + RealityKit"],
  },
  data: {
    "All": ["Auto-detect by AI", "Apache Spark + Python + SQL", "Kafka + Flink + PostgreSQL", "Airflow + dbt + BigQuery", "Snowflake + dbt + Python", "Databricks + Spark + MLflow", "Python + Pandas + Jupyter"],
    "Data Engineering": ["Apache Spark + Python + SQL", "Kafka + Flink + PostgreSQL", "Airflow + dbt + BigQuery", "Snowflake + dbt + Python", "Databricks + Spark + MLflow", "Python + Pandas + Jupyter"],
    "Web Apps": ["Next.js + TypeScript + PostgreSQL", "React + Python + FastAPI"],
    "AI Agents": ["LangChain + OpenAI + Spark", "CrewAI + GPT-4o + Data Pipeline", "AutoGen + LangGraph + dbt"],
    "RAG Pipelines": ["LangChain + Cohere + Weaviate", "Haystack + OpenAI + Pinecone", "LlamaIndex + GPT-4o + ChromaDB"],
  },
  devops: {
    "All": ["Auto-detect by AI", "Docker + Kubernetes + Terraform", "AWS + Terraform + Ansible", "GCP + Pulumi + Cloud Run", "Azure + Bicep + DevOps", "GitHub Actions + ArgoCD + Helm", "Prometheus + Grafana + Loki"],
    "Web Apps": ["Next.js + TypeScript + PostgreSQL", "React + Python + FastAPI"],
    "Data Engineering": ["Apache Spark + Python + SQL", "Kafka + Flink + PostgreSQL"],
    "AI Agents": ["LangChain + OpenAI + Pinecone", "CrewAI + GPT-4o + Weaviate", "AutoGen + LangGraph + Kubernetes"],
    "LLM Ops / Inference": ["vLLM + FastAPI + Docker", "Ollama + LangChain + GPU", "llama.cpp + TensorRT-LLM + CUDA", "TGI + vLLM + Kubernetes", "BentoML + MLflow + GPU Cluster"],
  },
  enterprise: {
    "All": ["Auto-detect by AI", "Next.js + TypeScript + PostgreSQL", "React + Python + FastAPI", "Angular + C# + SQL Server", "Java + Spring Boot + PostgreSQL", "Go + PostgreSQL + gRPC", "Kubernetes + Docker + Terraform"],
    "Web Apps": ["Next.js + TypeScript + PostgreSQL", "React + Python + FastAPI", "Angular + C# + SQL Server", "Java + Spring Boot + PostgreSQL"],
    "AI Agents": ["LangChain + OpenAI + Pinecone", "CrewAI + GPT-4o + Weaviate", "Semantic Kernel + Azure OpenAI", "MCP + LangChain + Enterprise SSO"],
    "RAG Pipelines": ["LangChain + Azure AI Search + Redis", "Haystack + Cohere + Weaviate", "LlamaIndex + GPT-4o + Pinecone", "MCP + LangChain + VectorDB"],
    "Data Engineering": ["Apache Spark + Python + SQL", "Kafka + Flink + PostgreSQL", "Airflow + dbt + BigQuery"],
  },
}

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  all: [
    "A React e-commerce dashboard with real-time sales analytics and inventory forecasting",
    "A Flutter cross-platform social media app with AI feed personalization",
    "A LangChain multi-agent customer support system with RAG knowledge base",
    "A Next.js SaaS analytics platform with real-time dashboards and user management",
    "A Python FastAPI microservice gateway with rate limiting and observability",
    "A React Native health tracker with wearable device integration",
    "A real-time AI chat application with WebSocket streaming and live inference",
  ],
  "ai-ml": [
    "A CrewAI multi-agent research system with autonomous web research and report generation",
    "A PyTorch transformer model for multilingual text classification with ONNX deployment",
    "An AutoGen code generation agent with integrated testing and review workflow",
    "A LangGraph stateful agent with memory, tools, and human-in-the-loop approval",
    "A RAG pipeline with hybrid search (semantic + keyword) and reranking",
    "A fine-tuning platform for open-source LLMs with LoRA and quantization support",
  ],
  mobile: [
    "A Flutter cross-platform ride-sharing app with real-time maps and payment integration",
    "A React Native food delivery app with order tracking and push notifications",
    "A Flutter fitness app with AI workout generation and progress tracking",
    "A SwiftUI meditation app with guided sessions and mood analytics dashboard",
    "A Kotlin Multiplatform expense tracker with offline-first sync architecture",
    "A Flutter e-commerce app with AR product preview and one-tap checkout",
  ],
  web: [
    "A Next.js real-time collaboration tool with WebSocket sync and presence indicators",
    "A React project management dashboard with Kanban boards and Gantt charts",
    "A Python FastAPI e-learning platform with video streaming and quiz engine",
    "A Vue 3 + Node.js inventory management system with barcode scanning",
    "A SvelteKit analytics dashboard with real-time data streaming and charts",
    "A Remix + Prisma booking platform with calendar integration and payments",
  ],
  enterprise: [
    "A Next.js ERP dashboard with modular plugin system for finance, HR, and inventory",
    "A React enterprise resource planning system with role-based access and audit logs",
    "A Java Spring Boot microservice gateway with OAuth2 and API versioning",
    "An Angular + C# enterprise contract management platform with e-signature workflow",
    "A Go + PostgreSQL service mesh for inter-service communication and monitoring",
    "A Next.js B2B portal with multi-tenant architecture and custom branding per client",
  ],
  fintech: [
    "A React Native mobile banking app with biometric auth and real-time transactions",
    "A Next.js investment portfolio tracker with AI-powered market insights",
    "A Python fraud detection pipeline using ML with real-time scoring and alerts",
    "A Flutter digital wallet with P2P payments, QR scanning, and transaction history",
    "A React stock trading platform with real-time charts and paper trading mode",
    "A Python risk assessment engine for loan underwriting with explainable AI",
  ],
  healthtech: [
    "A Flutter telemedicine app with video consultation, prescriptions, and EHR integration",
    "A React Native mental health tracking app with mood patterns and therapist matching",
    "A Python drug discovery pipeline using deep learning for molecular property prediction",
    "A Next.js patient portal with appointment scheduling, records, and billing",
    "A Flutter medication adherence app with reminders, tracking, and family sharing",
    "A Python medical image analysis platform using vision transformers for diagnosis support",
  ],
  robotics: [
    "A ROS 2 robot perception stack with YOLO object detection and SLAM navigation",
    "A PyTorch reinforcement learning controller for 6-DOF robotic arm manipulation",
    "An NVIDIA Jetson edge perception system with real-time object tracking and classification",
    "A ROS 2 multi-robot coordination system for warehouse automation and path planning",
    "A Gazebo simulation environment for testing robot navigation and obstacle avoidance",
    "A MoveIt grasping pipeline with point cloud processing and grasp planning",
  ],
  quantum: [
    "A Qiskit hybrid quantum-classical classifier for high-energy physics data analysis",
    "A Pennylane VQE optimizer for molecular ground state energy estimation",
    "A Cirq QAOA solver for supply chain logistics optimization problems",
    "An IBM Quantum error mitigation toolkit with zero-noise extrapolation",
    "A D-Wave quantum annealing solver for portfolio optimization in finance",
    "A hybrid quantum GAN for generating molecular structures with desirable properties",
  ],
  gaming: [
    "A Unity 3D open-world platformer with procedural terrain generation and day-night cycle",
    "An Unreal Engine 5 FPS multiplayer game with replicated physics and matchmaking",
    "A Phaser 2D puzzle game with 100+ levels, power-ups, and leaderboard system",
    "A Godot 4 RPG with inventory system, quest tracking, and dialogue trees",
    "A Three.js WebGL browser game with multiplayer support and WebRTC voice chat",
    "A Unity AR mobile game with location-based mechanics and social features",
  ],
  blockchain: [
    "A Solidity ERC-721 NFT marketplace with auctions, royalties, and lazy minting",
    "A Rust Solana DeFi lending protocol with liquidation engine and yield farming",
    "A Next.js dApp dashboard with Wagmi hooks, wallet connection, and on-chain data",
    "A Go Ethereum indexer for real-time blockchain data ingestion and analytics",
    "A Solidity DAO governance platform with proposal voting and treasury management",
    "A Rust Substrate parachain for cross-chain asset transfers and smart contracts",
  ],
  iot: [
    "An ESP32 MQTT sensor network with temperature, humidity, and air quality monitoring",
    "A LoRaWAN agriculture soil monitoring system with predictive irrigation control",
    "An Edge Impulse anomaly detection model for predictive industrial maintenance",
    "An AWS IoT Greengrass pipeline with edge inference and cloud data lake sync",
    "A Raspberry Pi camera system with TensorFlow Lite for real-time object detection",
    "A digital twin platform with IoT sensor integration and 3D visualization",
  ],
  arvr: [
    "A Unity AR Foundation furniture placement app with plane detection and lighting estimation",
    "A Three.js WebXR virtual art gallery with multi-user presence and spatial audio",
    "An ARKit face tracking experience with expression detection and avatar animation",
    "An Unreal Engine VR training simulator with hand tracking and haptic feedback",
    "An ARCore location-based AR navigation app with POI markers and route overlay",
    "A Unity OpenXR cross-platform VR meeting space with shared whiteboard and file sharing",
  ],
  semiconductor: [
    "A GNN-based chip placement optimizer for macro placement with wirelength minimization",
    "An SNN accelerator design with Verilog RTL and spike-timing-dependent plasticity",
    "An RL-based chip floorplanning engine with thermal-aware optimization",
    "A Python + SPICE circuit simulation framework with ML-accelerated parameter sweeps",
    "A Chisel + FIRRTL hardware generator for configurable neural network accelerators",
    "A Verilog formal verification tool with assertion-based property checking",
  ],
  data: [
    "An Apache Spark ETL pipeline for petabyte-scale data processing with Delta Lake",
    "A Kafka real-time streaming platform with Flink processing and sink to data lake",
    "An Airflow DAG orchestration framework with data quality checks and lineage tracking",
    "A dbt + BigQuery analytics transformation pipeline with documentation and testing",
    "A Snowflake data warehouse with ELT pipelines, streams, and tasks for CDC",
    "A Databricks MLflow platform for experiment tracking, model registry, and deployment",
  ],
  devops: [
    "A Kubernetes microservice deployment with Istio service mesh and mTLS security",
    "A Terraform multi-cloud infrastructure stack with modular components and remote state",
    "A Prometheus + Grafana monitoring stack with custom dashboards and alertmanager rules",
    "A GitHub Actions CI/CD pipeline with matrix builds, caching, and deployment gates",
    "An ArgoCD GitOps workflow with progressive delivery and canary deployments",
    "A Helm chart repository for standardized Kubernetes application deployments",
  ],
}

const INDUSTRY_ICONS: Record<string, string> = {
  "ai-ml": "🤖", mobile: "📱", web: "🌐", enterprise: "🏢", fintech: "💰",
  healthtech: "🧬", robotics: "🦾", quantum: "⚛️", semiconductor: "💠", iot: "🔗",
  blockchain: "🔗", gaming: "🎮", arvr: "🥽", data: "📊", devops: "☁️",
}

const COUNTRIES_BY_INDUSTRY: Record<string, string[]> = {
  all: ["Auto-detect by industry 🎯"],
  "ai-ml": ["Denmark", "Finland", "Sweden", "Belgium", "Netherlands", "Singapore", "UAE", "US", "UK", "Israel", "South Korea", "Estonia"],
  mobile: ["Denmark", "Finland", "Sweden", "Belgium", "Netherlands", "Singapore", "UAE", "US", "UK", "Israel", "South Korea", "Estonia"],
  web: ["Denmark", "Finland", "Sweden", "Belgium", "Netherlands", "Singapore", "UAE", "US", "UK", "Israel", "South Korea", "Estonia"],
  enterprise: ["Denmark", "Finland", "Sweden", "Belgium", "Netherlands", "Singapore", "UAE", "US", "UK", "Israel", "South Korea", "Estonia"],
  fintech: ["Singapore", "Switzerland", "UK", "US", "Canada", "Netherlands", "Sweden", "UAE", "France", "Germany", "Hong Kong"],
  healthtech: ["Denmark", "Sweden", "Finland", "Israel", "Singapore", "UK", "US", "Netherlands", "Germany", "Canada"],
  robotics: ["Germany", "China", "South Korea", "Japan", "Sweden", "Finland", "Denmark", "Singapore", "Taiwan", "Switzerland"],
  quantum: ["Germany", "China", "South Korea", "Japan", "Sweden", "Finland", "Denmark", "Singapore", "Taiwan", "Switzerland"],
  semiconductor: ["Germany", "China", "South Korea", "Japan", "Sweden", "Finland", "Denmark", "Singapore", "Taiwan", "Switzerland"],
  iot: ["Germany", "China", "South Korea", "Japan", "Sweden", "Finland", "Denmark", "Singapore", "Taiwan", "Switzerland"],
  blockchain: ["Singapore", "Switzerland", "UK", "US", "Canada", "Netherlands", "Sweden", "UAE", "France", "Germany", "Hong Kong"],
  gaming: ["US", "UK", "Sweden", "Netherlands", "Denmark", "Norway", "Ireland", "Spain", "New Zealand"],
  arvr: ["US", "UK", "Sweden", "Netherlands", "Denmark", "Norway", "Ireland", "Spain", "New Zealand"],
  data: ["Netherlands", "Sweden", "Denmark", "Finland", "Belgium", "UK", "Germany", "Switzerland", "Ireland", "Austria"],
  devops: ["Netherlands", "Sweden", "Denmark", "Finland", "Belgium", "UK", "Germany", "Switzerland", "Ireland", "Austria"],
}

const DEVELOPED_COUNTRIES = [
  "Auto-detect by industry 🎯",
  "United States", "Canada", "Mexico",
  "United Kingdom", "Germany", "France", "Netherlands", "Belgium", "Luxembourg", "Switzerland",
  "Austria", "Sweden", "Norway", "Denmark", "Finland", "Iceland", "Ireland",
  "Spain", "Portugal", "Italy", "Greece",
  "Poland", "Czech Republic", "Slovakia", "Hungary", "Romania", "Bulgaria",
  "Estonia", "Latvia", "Lithuania", "Slovenia", "Croatia",
  "Japan", "South Korea", "China", "Taiwan", "Hong Kong", "Singapore",
  "India", "Israel", "UAE", "Saudi Arabia", "Qatar", "Turkey",
  "Malaysia", "Thailand", "Vietnam", "Indonesia", "Philippines",
  "Australia", "New Zealand",
  "Brazil", "Argentina", "Chile", "Colombia", "Uruguay", "Costa Rica",
  "South Africa", "Kenya", "Nigeria", "Ghana", "Morocco", "Egypt", "Rwanda",
]

const STACK_INFO: Record<string, string> = {
  "Auto-detect by AI": "Let AI choose the best stack based on your project description",
  "Next.js + TypeScript + PostgreSQL": "Full-stack React with server components, type safety, and relational DB — best for SaaS, dashboards, content platforms",
  "React + Python + FastAPI": "Frontend SPA with Python async backend — best for data-heavy apps, AI integrations, real-time APIs",
  "Flutter + Firebase": "Cross-platform mobile with serverless backend — best for social apps, MVPs, consumer apps",
  "React Native + Node.js": "Cross-platform mobile with JavaScript backend — best for mobile-first products, real-time apps",
  "SwiftUI + Firebase": "Native iOS with serverless backend — best for Apple-exclusive apps, health/fitness trackers",
  "Jetpack Compose + Kotlin": "Native Android with modern declarative UI — best for Android-exclusive apps, enterprise mobile tools",
  "LangChain + OpenAI + Pinecone": "LLM app with vector search — best for RAG chatbots, knowledge bases, document Q&A",
  "CrewAI + GPT-4o + Weaviate": "Multi-agent AI orchestration with vector DB — best for autonomous research, complex workflows",
  "AutoGen + LangGraph + Qdrant": "Conversational multi-agent system with state graphs — best for agentic workflows, code generation",
  "LangChain + Claude + ChromaDB": "LLM app with Anthropic + local vector DB — best for privacy-sensitive AI, document analysis",
  "Semantic Kernel + Azure OpenAI": "Microsoft enterprise AI framework — best for Azure shops, enterprise Copilot-style apps",
  "Python + PyTorch + CUDA": "Deep learning training & inference — best for custom model training, research, fine-tuning",
  "Python + TensorFlow + TPU": "ML at scale on Google hardware — best for production ML, computer vision, NLP pipelines",
  "Vue + Node.js + MongoDB": "SPA with NoSQL backend — best for content management, e-commerce, real-time dashboards",
  "Svelte + Go + SQLite": "Lightweight full-stack with compiled frontend — best for fast MVPs, edge apps, small tools",
  "Angular + C# + SQL Server": "Enterprise full-stack with Microsoft ecosystem — best for enterprise apps, intranets, finance systems",
  "Rust + Actix + PostgreSQL": "High-performance backend with memory safety — best for fintech, low-latency APIs, systems programming",
  "Docker + Kubernetes + Terraform": "Container orchestration with IaC — best for microservices, cloud-native deployments, DevOps pipelines",
  "Apache Spark + Python + SQL": "Big data processing & analytics — best for ETL, data lakes, large-scale data analysis",
  "Unity + C# + Blender": "Game development with 3D asset pipeline — best for mobile/desktop games, interactive 3D apps",
  "Unreal Engine + C++ + Blueprints": "High-fidelity 3D games and simulations — best for AAA-quality games, architectural viz, film",
  "ROS 2 + OpenCV + PyTorch": "Robot perception and control — best for autonomous robots, computer vision, manipulation",
  "Solidity + Hardhat + Ethers.js": "Ethereum smart contract development — best for DeFi, NFTs, on-chain apps",
  "Qiskit + Pennylane + Python": "Quantum computing algorithms — best for quantum ML, optimization, chemistry simulation",
  "RDKit + DeepChem + PyTorch": "AI drug discovery pipeline — best for molecular modeling, virtual screening, bioactivity prediction",
  "Edge Impulse + TensorFlow Lite": "TinyML on edge devices — best for IoT sensors, wearable AI, embedded ML",
  "Go + PostgreSQL + Redis": "High-concurrency backend with caching — best for APIs, real-time services, microservices",
  "MCP + LangChain + FastAPI": "Model Context Protocol server — best for AI tool integration, function calling, agent toolkits",
  "LangGraph + MCP + Neo4j": "Stateful agent workflows with graph DB — best for complex multi-step reasoning, knowledge graphs",
  "LoRA + PEFT + PyTorch": "Efficient LLM fine-tuning — best for domain-adapting LLMs, custom model tuning",
  "vLLM + FastAPI + Docker": "LLM inference serving — best for self-hosted LLM APIs, production inference",
  "Ollama + LangChain + GPU": "Local LLM deployment — best for on-premise AI, privacy-first applications, offline inference",
  "CrewAI + LangGraph + GPT-4o": "Production multi-agent orchestration — best for autonomous workflows, research agents",
  "Haystack + Mistral + Milvus": "Open-source RAG pipeline — best for document search, enterprise knowledge retrieval",
}

export default function BuilderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! Pick an industry, category, and tech stack below, then click a suggestion or type what you want to build." },
  ])
  const [input, setInput] = useState("")
  const [generating, setGenerating] = useState(false)
  const [project, setProject] = useState<ProjectResult | null>(null)
  const [exporting, setExporting] = useState<"zip" | null>(null)
  const [industry, setIndustry] = useState("all")
  const [category, setCategory] = useState("All")
  const [techStack, setTechStack] = useState("")
  const [customStack, setCustomStack] = useState("")
  const [adoptionLevel, setAdoptionLevel] = useState("auto")
  const [modelTier, setModelTier] = useState("auto")
  const [country, setCountry] = useState("Auto-detect by industry 🎯")
  const [copied, setCopied] = useState(false)
  const [activeFileTab, setActiveFileTab] = useState<string>("")
  const [fileContents, setFileContents] = useState<Record<string, string>>({})
  const [activeViewTab, setActiveViewTab] = useState<"files" | "preview" | "instructions" | "design" | "contact">("files")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const availableCategories = CATEGORIES[industry] || CATEGORIES.all
  const currentCategoryValue = availableCategories.some(c => c.value === category) ? category : "All"
  const stacksForIndustry = TECH_STACKS[industry] || TECH_STACKS.all
  const availableStacks = stacksForIndustry[currentCategoryValue] || stacksForIndustry.All || TECH_STACKS.all.All
  const suggestionsForIndustry = CATEGORY_SUGGESTIONS[industry] || CATEGORY_SUGGESTIONS.all || []
  const availableCountries = DEVELOPED_COUNTRIES

  useEffect(() => {
    if (!availableCategories.some(c => c.value === category)) {
      setCategory("All")
    }
  }, [industry])

  useEffect(() => {
    setTechStack("")
    setCustomStack("")
    setAdoptionLevel("auto")
    setModelTier("auto")
    setCountry("Auto-detect by industry 🎯")
  }, [category, industry])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || generating) return

    const effectiveStack = techStack === "__custom__" ? customStack : techStack || "auto"
    const industryLabel = INDUSTRIES.find(i => i.value === industry)?.label.replace(/^[^\s]+\s/, "") || industry
    const categoryLabel = currentCategoryValue === "All" ? "" : currentCategoryValue
    const effectiveAdoption = adoptionLevel === "auto" ? ADOPTION_BY_INDUSTRY[industry] || "Auto-detect" : adoptionLevel
    const effectiveModelTier = modelTier === "auto" ? "auto" : MODEL_TIERS.find(t => t.value === modelTier)?.label.split(" —")[0] || "auto"
    const effectiveCountry = country === "Auto-detect by industry 🎯" ? COUNTRIES_BY_INDUSTRY[industry]?.slice(0, 3).join("/") || "auto" : country
    const fullPrompt = categoryLabel
      ? `[${industryLabel}] [${categoryLabel}] [Adoption: ${effectiveAdoption}] [Tier: ${effectiveModelTier}] [Country: ${effectiveCountry}] [Stack: ${effectiveStack}] ${input.trim()}`
      : `[${industryLabel}] [Adoption: ${effectiveAdoption}] [Tier: ${effectiveModelTier}] [Country: ${effectiveCountry}] [Stack: ${effectiveStack}] ${input.trim()}`

    const userMessage: Message = { role: "user", content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setGenerating(true)
    setProject(null)

    setMessages(prev => [...prev, { role: "assistant", content: "Analyzing your requirements and generating your project..." }])

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, category: categoryLabel || industryLabel, techStack: effectiveStack }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: "assistant", content: `Error: ${data.error}` },
        ])
        return
      }

      setProject(data)
      const contents: Record<string, string> = {}
      data.files.forEach((f: GeneratedFile) => { contents[f.path] = f.content })
      setFileContents(contents)
      setActiveFileTab(data.files[0]?.path || "")
      setActiveViewTab("files")
      setPreviewUrl(null)

      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: `## ${data.title}\n\n${data.description}\n\n**Tech Stack:** ${(data.techStack || []).join(", ")}\n\n**Structure:** ${(data.structure || []).length} files generated\n\nYour project is ready! You can download it as a ZIP or view the files below.`,
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Network error. Please check your connection and try again." },
      ])
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyFile = async (path: string, content: string) => {
    const text = `// ${path}\n${content}`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = text
      ta.style.cssText = "position:fixed;left:-9999px;top:0"
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
  }

  const handleCopyCode = async () => {
    if (!project) return
    const code = project.files.map(f => `// ${f.path}\n${f.content}`).join("\n\n")
    setCopied(true)
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = code
      ta.style.cssText = "position:fixed;left:-9999px;top:0"
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      try {
        document.execCommand("copy")
      } catch (e2) { console.error("Copy fallback failed:", e2) }
      document.body.removeChild(ta)
    }
    setTimeout(() => setCopied(false), 2000)
  }

  const getProjectPreviewType = useCallback((techStack: string[]): { type: string; reason: string } => {
    const joined = techStack.join(" ").toLowerCase()
    if (/next\.?js|react|vue|svelte|angular|html|css|tailwind/.test(joined))
      return { type: "web", reason: "Web application — live preview available in browser" }
    if (/python|fastapi|flask|django/.test(joined))
      return { type: "python", reason: "Python backend — simulated terminal output shown below" }
    if (/flutter|dart|react native|swiftui/.test(joined))
      return { type: "mobile", reason: "Mobile app — run instructions and file preview available" }
    if (/esp32|arduino|firmware|embedded/.test(joined))
      return { type: "embedded", reason: "Embedded / IoT firmware — deployment instructions and file preview below" }
    if (/unity|unreal|godot|blender/.test(joined))
      return { type: "game", reason: "Game project — project files and build instructions below" }
    if (/solidity|hardhat|ethereum/.test(joined))
      return { type: "blockchain", reason: "Blockchain / smart contract project — deployment instructions and file preview below" }
    return { type: "other", reason: "Project files and run instructions available below" }
  }, [])

  const generatePythonSimulation = useCallback((): string => {
    if (!project) return ""
    const files = Object.entries(fileContents)
    const pyFiles = files.filter(([p]) => p.endsWith(".py"))
    const hasFastAPI = project.techStack.some(t => /fastapi/i.test(t))

    const lines: string[] = []
    lines.push(`$ cd ${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)
    lines.push(`$ python -m venv venv && source venv/bin/activate`)
    lines.push(`$ pip install -r requirements.txt`)
    lines.push("")
    lines.push(`🚀 Starting ${project.title}...`)
    lines.push("")

    if (hasFastAPI) {
      lines.push("INFO:     Uvicorn running on http://0.0.0.0:8000")
      lines.push("INFO:     Application startup complete.")
      lines.push("")
      lines.push("GET / => 200 OK")
      lines.push(`  {"message": "${project.title} API", "status": "running", "version": "1.0.0"}`)
      lines.push("")
      lines.push("GET /api/items => 200 OK")
      lines.push(`  {"data": [{"id": 1, "name": "Sample Item A"}, {"id": 2, "name": "Sample Item B"}], "count": 2}`)
      lines.push("")
      lines.push("GET /api/stats => 200 OK")
      lines.push(`  {"total_items": 3, "active_items": 2, "average_value": 150.0}`)
    } else {
      lines.push(`🏗️  ${project.title}`)
      lines.push(`   ${project.description}`)
      lines.push("")
      lines.push("📋 Tech Stack: " + project.techStack.join(", "))
      lines.push("")
      lines.push("✅ Application started successfully")
      lines.push("   Processing mock data...")
      lines.push("   Results saved to output/")
      lines.push("   Time: " + new Date().toLocaleTimeString())
    }
    lines.push("")
    lines.push("📦 Generated Files:")
    pyFiles.slice(0, 5).forEach(([p]) => lines.push(`   📄 ${p}`))
    lines.push("")
    lines.push("Press Ctrl+C to stop")

    return lines.join("\n")
  }, [project, fileContents])

  const generateEmbeddedSimulation = useCallback((): string => {
    if (!project) return ""
    const lines: string[] = []
    lines.push(`$ cd ${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)
    lines.push(`$ platformio run --target upload`)
    lines.push("")
    lines.push("Compiling .pio/build/esp32dev/firmware.ino...")
    lines.push("Linking .pio/build/esp32dev/firmware.elf")
    lines.push("Calculating size...")
    lines.push("")
    lines.push("Connecting to COM3...")
    lines.push("Uploading 524288 bytes...")
    lines.push("████████████████████████████████ 100%")
    lines.push("")
    lines.push("🚀 ${project.title} initialized")
    lines.push("WiFi connected: MyNetwork (192.168.1.42)")
    lines.push("MQTT connected: broker.example.com:1883")
    lines.push("")
    lines.push("[Sensor] Temperature: 24.5°C")
    lines.push("[Sensor] Humidity: 62.3%")
    lines.push("[Sensor] Pressure: 1013.2 hPa")
    lines.push("[MQTT] Published to sensors/temperature")
    lines.push("")
    lines.push("Loop interval: 5000ms")
    lines.push("Press RESET button to restart")
    return lines.join("\n")
  }, [project])

  const generateBlockchainSimulation = useCallback((): string => {
    if (!project) return ""
    const lines: string[] = []
    lines.push(`$ cd ${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)
    lines.push(`$ npx hardhat compile`)
    lines.push("")
    lines.push("Compiling 2 contracts with Solidity 0.8.20...")
    lines.push("  Compiled Token.sol")
    lines.push("  Compiled Pool.sol")
    lines.push("")
    lines.push("$ npx hardhat test")
    lines.push("")
    lines.push("  Token contract")
    lines.push("    ✓ Should deploy with correct name and symbol")
    lines.push("    ✓ Should mint initial supply to deployer")
    lines.push("    ✓ Should allow transfers between accounts")
    lines.push("")
    lines.push("  3 passing (1.2s)")
    lines.push("")
    lines.push("📄 Deployed to localhost:8545")
    lines.push(`   Token: 0x1234...5678`)
    lines.push(`   Pool:  0x8765...4321`)
    lines.push("")
    lines.push("🌐 Frontend: http://localhost:3000")
    return lines.join("\n")
  }, [project])

  const generateGameSimulation = useCallback((): string => {
    if (!project) return ""
    const lines: string[] = []
    lines.push(`📦 ${project.title}`)
    lines.push("=" .repeat(project.title.length + 4))
    lines.push("")
    lines.push("🎮 Project Type: " + (project.techStack.some(t => /unity/i.test(t)) ? "Unity 3D" : project.techStack.some(t => /unreal/i.test(t)) ? "Unreal Engine" : "Game Engine"))
    lines.push("")
    lines.push("📋 Scenes:")
    lines.push("   MainMenu.unity")
    lines.push("   Level1.unity")
    lines.push("   Level2.unity")
    lines.push("   GameOver.unity")
    lines.push("")
    lines.push("🔧 Build Settings:")
    lines.push("   Platform: WebGL / Windows / macOS")
    lines.push("   Resolution: 1920x1080")
    lines.push("   Quality: High")
    lines.push("")
    lines.push("📄 Key Scripts:")
    project.files.filter(f => f.path.endsWith(".cs") || f.path.endsWith(".cpp")).slice(0, 5).forEach(f => {
      lines.push(`   📄 ${f.path}`)
    })
    lines.push("")
    lines.push("▶ Press Play to test in Editor")
    return lines.join("\n")
  }, [project])

  const generateMobileSimulation = useCallback((): string => {
    if (!project) return ""
    const lines: string[] = []
    const isFlutter = project.techStack.some(t => /flutter/i.test(t))
    const isRN = project.techStack.some(t => /react native/i.test(t))

    lines.push(`$ cd ${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)
    if (isFlutter) {
      lines.push(`$ flutter pub get`)
      lines.push("Running \"flutter pub get\" in project...")
      lines.push("  https://pub.dev/api/packages/cupertino_icons 1.0.6")
      lines.push("  https://pub.dev/api/packages/provider 6.1.1")
      lines.push("  Downloaded 3 packages (1.2s)")
      lines.push("")
      lines.push(`$ flutter run`)
      lines.push("Launching lib/main.dart on iPhone 15 Pro in debug mode...")
      lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  45.2s")
      lines.push("✓ Built build/ios/iphoneos/Runner.app")
      lines.push("")
      lines.push("🚀 ${project.title} running on iPhone 15 Pro")
      lines.push("   Debug service: http://localhost:5555")
    } else {
      lines.push(`$ npm install`)
      lines.push("added 1852 packages in 15.3s")
      lines.push("")
      lines.push(`$ npx react-native start`)
      lines.push("")
      lines.push("📱 Running Metro Bundler on port 8081...")
      lines.push("")
      lines.push("To run the app:")
      lines.push("  • Press 'a' for Android emulator")
      lines.push("  • Press 'i' for iOS simulator")
      lines.push("  • Press 'w' for web browser")
      lines.push("")
      lines.push("🚀 ${project.title} ready")
      lines.push("   http://localhost:8081")
    }
    return lines.join("\n")
  }, [project])

  const generateLivePreview = useCallback(() => {
    if (!project || !fileContents) { setActiveViewTab("instructions"); return }
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null) }

    const files = Object.entries(fileContents)
    const previewType = getProjectPreviewType(project.techStack)

    if (previewType.type === "web") {
      // Live HTML/iframe preview for web projects
      const htmlFile = files.find(([p]) => /index\.html$/.test(p))
      const allCss = files.filter(([p]) => /\.css$/.test(p)).map(([, c]) => c).join("\n")
      const allJs = files.filter(([p]) => /\.(js|ts)$/.test(p) && !/\.config/.test(p) && !/\.test/.test(p)).map(([, c]) => c).join("\n\n")

      let html = ""
      if (htmlFile) {
        html = htmlFile[1]
      } else {
        const title = project.title
        html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${allCss}</style>
</head>
<body class="bg-zinc-50 min-h-screen">
  <div id="root">
    <header class="bg-white shadow-sm border-b border-zinc-200">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-zinc-800">${title}</h1>
        <div class="flex gap-4 text-sm text-zinc-600">
          <span>Dashboard</span>
          <span>Analytics</span>
          <span>Settings</span>
        </div>
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-zinc-800 mb-2">${title}</h2>
        <p class="text-zinc-600">${project.description}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
          <p class="text-sm text-zinc-500">Status</p>
          <p class="text-2xl font-bold text-emerald-600 mt-1">Running</p>
          <p class="text-xs text-zinc-400 mt-2">All systems operational</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
          <p class="text-sm text-zinc-500">Files</p>
          <p class="text-2xl font-bold text-blue-600 mt-1">${project.files.length}</p>
          <p class="text-xs text-zinc-400 mt-2">Source files generated</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
          <p class="text-sm text-zinc-500">Tech Stack</p>
          <div class="mt-2 flex flex-wrap gap-1.5">
            ${project.techStack.map(t => `<span class="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">${t}</span>`).join("\n            ")}
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 class="font-semibold text-zinc-800 mb-4">Project Structure</h3>
        <div class="space-y-1 text-sm font-mono text-zinc-600">
          ${project.files.slice(0, 10).map(f => `<div>📄 ${f.path}</div>`).join("\n          ")}
          ${project.files.length > 10 ? `<div class="text-zinc-400">...and ${project.files.length - 10} more files</div>` : ""}
        </div>
      </div>
    </main>
  </div>
  <script>${allJs}</script>
</body>
</html>`
      }

      const blob = new Blob([html], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      setActiveViewTab("preview")
    } else {
      // For non-web projects: show a simulated output as the preview
      setActiveViewTab("preview")
    }
  }, [project, fileContents, previewUrl, getProjectPreviewType])

  const getSimulatedOutput = useCallback((): string => {
    if (!project) return ""
    const previewType = getProjectPreviewType(project.techStack)
    switch (previewType.type) {
      case "python": return generatePythonSimulation()
      case "embedded": return generateEmbeddedSimulation()
      case "blockchain": return generateBlockchainSimulation()
      case "game": return generateGameSimulation()
      case "mobile": return generateMobileSimulation()
      default: return `# ${project.title}\n# Run Instructions\n\n1. Extract the ZIP\n2. Install dependencies\n3. Run the project\n\nSee README.md for detailed setup.`
    }
  }, [project, getProjectPreviewType, generatePythonSimulation, generateEmbeddedSimulation, generateBlockchainSimulation, generateGameSimulation, generateMobileSimulation])

  const handleExportZip = async () => {
    if (!project) return
    setExporting("zip")
    try {
      const res = await fetch(`/api/download/${project.id}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Download failed")
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${project.title.replace(/[^a-zA-Z0-9-_]/g, "-")}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download error:", err)
      alert("Download failed: " + (err instanceof Error ? err.message : "Please try again."))
    } finally {
      setExporting(null)
    }
  }

  const getFileExtension = (path: string): string => {
    const ext = path.split(".").pop() || ""
    const langMap: Record<string, string> = {
      ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript",
      py: "python", rs: "rust", go: "go", java: "java",
      html: "html", css: "css", json: "json", yml: "yaml",
      yaml: "yaml", md: "markdown", sql: "sql", prisma: "prisma",
      toml: "toml", cfg: "config", env: "dotenv", lock: "json",
    }
    return langMap[ext] || ext
  }

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <span className="text-5xl">🔒</span>
        <h1 className="mt-6 text-3xl font-bold">Sign in to Build</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          The App Builder lets you generate full projects with AI &mdash; including industry-aware
          tech stacks, model tiers, country targeting, and AI adoption levels.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/login?redirect=/builder" className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">
            Sign In
          </Link>
          <Link href="/signup?redirect=/builder" className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
            Create Account
          </Link>
        </div>
        <div className="mt-10 grid gap-3 text-left text-sm text-zinc-500">
          <p>✅ Browse industries, categories, and tech stacks</p>
          <p>✅ See AI adoption rates by industry</p>
          <p>🔒 Generate full project with code files &mdash; requires sign in</p>
          <p>🔒 Download ZIP &amp; copy code &mdash; requires sign in</p>
          <p>🔒 Save projects to your dashboard &mdash; requires sign in</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">App Builder</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Choose industry, category, and tech stack &mdash; then describe what to build
        </p>
      </div>

      {/* Row 1: Industry + Category + Model Tier + Country + AI Adoption */}
      <div className="mb-2 grid gap-3 sm:grid-cols-5">
        <div className="relative">
          <label className="mb-1.5 block text-xs font-medium text-zinc-500 uppercase tracking-wider">Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-[38px] text-zinc-400">▼</span>
        </div>
        <div className="relative">
          <label className="mb-1.5 block text-xs font-medium text-zinc-500 uppercase tracking-wider">Category</label>
          <select
            value={currentCategoryValue}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {availableCategories.map((c) => (
              <option key={c.value} value={c.value}>{c.emoji} {c.value}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-[38px] text-zinc-400">▼</span>
        </div>
        <div className="relative">
          <label className="mb-1.5 block text-xs font-medium text-zinc-500 uppercase tracking-wider">Model Tier</label>
          <select
            value={modelTier}
            onChange={(e) => setModelTier(e.target.value)}
            className="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {MODEL_TIERS.map((t) => (
              <option key={t.value} value={t.value}>{t.label.split(" —")[0]}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-[38px] text-zinc-400">▼</span>
          <p className="mt-1 text-[10px] text-zinc-400">Choose your AI model budget tier</p>
        </div>
        <div className="relative">
          <label className="mb-1.5 block text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {availableCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-[38px] text-zinc-400">▼</span>
          <p className="mt-1 text-[10px] text-zinc-400">Country-specific regulations & market focus</p>
        </div>
        <div className="relative">
          <label className="mb-1.5 block text-xs font-medium text-zinc-500 uppercase tracking-wider">
            AI Adoption
          </label>
          <select
            value={adoptionLevel}
            onChange={(e) => setAdoptionLevel(e.target.value)}
            className="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {ADOPTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label.split(" —")[0]}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-[38px] text-zinc-400">▼</span>
          <p className="mt-1 text-[10px] text-zinc-400">Default: {ADOPTION_BY_INDUSTRY[industry]?.split(" (")[0] || "auto"} for {INDUSTRIES.find(i => i.value === industry)?.label.replace(/^[^\s]+\s/, "") || industry}</p>
        </div>
      </div>

      {/* Row 2: Tech Stack (full width) */}
      <div className="relative mb-4">
        <label className="mb-1.5 block text-xs font-medium text-zinc-500 uppercase tracking-wider">Tech Stack</label>
        <div className="sm:flex sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <select
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900"
            >
              {availableStacks.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="__custom__">✏️ Custom / Add your own...</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-3 text-zinc-400">▼</span>
          </div>
          {techStack === "__custom__" && (
            <input
              value={customStack}
              onChange={(e) => setCustomStack(e.target.value)}
              placeholder="e.g. LangChain + GPT-4o + Pinecone + Next.js..."
              className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-900 sm:mt-0 sm:w-72 dark:border-zinc-700 dark:bg-zinc-900"
            />
          )}
        </div>
        {techStack && techStack !== "__custom__" && techStack !== "Auto-detect by AI" && STACK_INFO[techStack] && (
          <p className="mt-1 text-[10px] text-zinc-400 leading-relaxed">{STACK_INFO[techStack]}</p>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-0" style={{ maxHeight: "calc(100vh - 460px)" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                }`}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 prose-code:bg-zinc-200 dark:prose-code:bg-zinc-700 prose-code:px-1 prose-code:rounded">
                  <RenderMessage content={msg.content} />
                </div>
              </div>
            </div>
          ))}

          {project && project.files && project.files.length > 0 && (
            <div className="flex justify-start">
              <div className="w-full max-w-[90%] rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
                {/* Tab bar */}
                <div className="mb-3 flex items-center gap-1 border-b border-zinc-200 pb-2 dark:border-zinc-700">
                  <button
                    onClick={() => setActiveViewTab("files")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-t transition ${activeViewTab === "files" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                    📄 Files
                  </button>
                  <button
                    onClick={() => { if (!previewUrl) generateLivePreview(); else setActiveViewTab("preview") }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-t transition ${activeViewTab === "preview" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                    👁️ Preview
                  </button>
                  <button
                    onClick={() => setActiveViewTab("design")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-t transition ${activeViewTab === "design" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                    🏗️ Design
                  </button>
                  <button
                    onClick={() => setActiveViewTab("instructions")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-t transition ${activeViewTab === "instructions" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                    📖 Run Instructions
                  </button>
                  <button
                    onClick={() => setActiveViewTab("contact")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-t transition ${activeViewTab === "contact" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                    📞 Contact
                  </button>
                </div>

                {/* Files Tab */}
                {activeViewTab === "files" && (
                  <>
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {project.files.map((file) => (
                        <button
                          key={file.path}
                          onClick={() => setActiveFileTab(file.path)}
                          className={`truncate rounded px-2.5 py-1 text-xs font-mono transition ${
                            activeFileTab === file.path
                              ? "bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
                              : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-400"
                          }`}
                        >
                          {file.path.split("/").pop()}
                        </button>
                      ))}
                    </div>
                    {activeFileTab && fileContents[activeFileTab] !== undefined && (
                      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex h-[400px]">
                          <div className="hidden w-48 flex-shrink-0 overflow-y-auto border-r border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-800 sm:block">
                            {project.files.map((file) => (
                              <button
                                key={file.path}
                                onClick={() => setActiveFileTab(file.path)}
                                className={`block w-full truncate rounded px-2 py-1.5 text-left text-xs font-mono transition ${
                                  activeFileTab === file.path
                                    ? "bg-white font-medium text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                                    : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                }`}
                              >
                                {file.path.split("/").pop()}
                              </button>
                            ))}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800">
                              <span className="truncate text-xs font-mono text-zinc-500">{activeFileTab}</span>
                              <button
                                onClick={() => handleCopyFile(activeFileTab, fileContents[activeFileTab] || "")}
                                className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                              >
                                Copy
                              </button>
                            </div>
                            <MonacoEditor
                              height="360px"
                              language={getFileExtension(activeFileTab)}
                              theme="vs-dark"
                              value={fileContents[activeFileTab] || ""}
                              onChange={(val) => {
                                setFileContents(prev => ({ ...prev, [activeFileTab]: val || "" }))
                              }}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 12,
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                wordWrap: "on",
                                automaticLayout: true,
                                readOnly: false,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={handleExportZip}
                        disabled={exporting === "zip"}
                        className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                      >
                        {exporting === "zip" ? "Packaging..." : "Download ZIP"}
                      </button>
                      <button
                        onClick={handleCopyCode}
                        className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                      >
                        {copied ? "Copied!" : "Copy All Code"}
                      </button>
                      <button
                        onClick={() => {
                          const pt = getProjectPreviewType(project.techStack)
                          if (pt.type === "web") {
                            if (!previewUrl) generateLivePreview(); else setActiveViewTab("preview")
                          } else {
                            setActiveViewTab("preview")
                          }
                        }}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500"
                      >
                        ▶ Run Preview
                      </button>
                    </div>
                  </>
                )}

                {/* Preview Tab */}
                {activeViewTab === "preview" && (
                  <div>
                    {/* Preview content based on project type */}
                    {previewUrl ? (
                      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between bg-zinc-100 px-3 py-1.5 dark:bg-zinc-800">
                          <span className="text-xs text-zinc-500">🌐 Live Preview</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); generateLivePreview() }}
                              className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                            >
                              Refresh
                            </button>
                            <button
                              onClick={() => { setActiveViewTab("files") }}
                              className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                            >
                              Back to Files
                            </button>
                          </div>
                        </div>
                        <iframe
                          src={previewUrl}
                          className="h-[500px] w-full bg-white"
                          title="Project Preview"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    ) : project && getProjectPreviewType(project.techStack).type === "web" ? (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-12 dark:border-zinc-700">
                        <span className="text-3xl">🌐</span>
                        <p className="mt-3 text-sm text-zinc-500">Click below to generate a live web preview</p>
                        <button
                          onClick={generateLivePreview}
                          className="mt-4 rounded-full bg-emerald-600 px-5 py-2 text-xs font-medium text-white hover:bg-emerald-500"
                        >
                          Generate Preview
                        </button>
                      </div>
                    ) : project && (
                      <div className="rounded-lg border border-zinc-200 bg-zinc-950 overflow-hidden dark:border-zinc-700">
                        <div className="flex items-center justify-between bg-zinc-900 px-3 py-2 border-b border-zinc-800">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-400">●</span>
                            <span className="text-xs text-zinc-400 font-mono">
                              {getProjectPreviewType(project.techStack).type === "python" ? "🐍 Python Terminal" :
                               getProjectPreviewType(project.techStack).type === "mobile" ? "📱 Mobile Simulator" :
                               getProjectPreviewType(project.techStack).type === "embedded" ? "🔌 Serial Monitor" :
                               getProjectPreviewType(project.techStack).type === "blockchain" ? "⛓️ Blockchain Console" :
                               getProjectPreviewType(project.techStack).type === "game" ? "🎮 Game Console" :
                               "💻 Terminal"}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                          </div>
                        </div>
                        <pre className="overflow-auto p-4 text-xs leading-relaxed text-green-400 font-mono" style={{ maxHeight: "500px", minHeight: "300px" }}>
{getSimulatedOutput()}</pre>
                        <div className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-900 px-4 py-2">
                          <span className="text-xs text-zinc-500">{getProjectPreviewType(project.techStack).reason}</span>
                          <span className="ml-auto text-xs text-zinc-600">Simulated output — run locally for actual execution</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Design Tab */}
                {activeViewTab === "design" && project && (
                  <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">🏗️ Project Architecture & Design</h3>
                      <p className="mt-1 text-xs text-zinc-500">{project.title} — Architecture overview, module diagram, and business flows</p>
                    </div>

                    {/* Architecture Diagram */}
                    <div className="mb-6">
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">📐 System Architecture</h4>
                      <div className="flex flex-wrap items-start gap-3">
                        {generateArchitectureLayers(project).map((layer, i) => (
                          <div key={i} className="flex-1 min-w-[140px]">
                            <div className={`rounded-lg border-2 px-3 py-2 text-center text-xs font-semibold ${layer.color}`}>
                              {layer.label}
                            </div>
                            <div className="mt-1.5 space-y-1">
                              {layer.components.map((comp, j) => (
                                <div key={j} className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[10px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                  {comp}
                                </div>
                              ))}
                            </div>
                            {i < generateArchitectureLayers(project).length - 1 && (
                              <div className="my-1 flex justify-center">
                                <span className="text-zinc-300 text-xs">↓</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business Flow */}
                    <div className="mb-6">
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">🔀 Business Function Flow</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        {generateBusinessFlows(project).map((step, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                              <span className="text-sm">{step.icon}</span>
                              <div>
                                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{step.label}</p>
                                <p className="text-[10px] text-zinc-500">{step.desc}</p>
                              </div>
                            </div>
                            {i < generateBusinessFlows(project).length - 1 && (
                              <span className="text-zinc-300 text-lg">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack Breakdown */}
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">⚙️ Tech Stack Breakdown</h4>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {categorizeTechStack(project.techStack).map((cat, i) => (
                          <div key={i} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                            <div className="mb-1.5 flex items-center gap-1.5">
                              <span>{cat.icon}</span>
                              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{cat.category}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {cat.items.map((item, j) => (
                                <span key={j} className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* File Structure Tree */}
                    <div className="mt-6">
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">📁 Module Structure</h4>
                      <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs leading-relaxed text-green-400 font-mono">
{generateFileTree(project)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Contact Tab */}
                {activeViewTab === "contact" && (
                  <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-950">
                    <div className="mb-6 text-center">
                      <span className="text-4xl">🤖</span>
                      <h3 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">Let's Build Something Intelligent</h3>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
                        Have a project involving mobile apps, AI agents, AGI, quantum ML, semiconductors, robotics, AIoT, biotechnology, or neural science? Let's discuss how cutting-edge AI can transform your product.
                      </p>
                    </div>

                    <div className="mx-auto max-w-md space-y-4">
                      <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">Phone</p>
                          <a href="tel:+6581765178" className="text-sm font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400">+65 8176 5178</a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">Email</p>
                          <a href="mailto:npoluri5@gmail.com" className="text-sm font-semibold text-zinc-900 hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400">npoluri5@gmail.com</a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">Location</p>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Singapore</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">Expertise</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {["AI Agents", "Mobile Apps", "Quantum ML", "Semiconductors", "Robotics", "AIoT", "Biotech", "Neural Science"].map((tag) => (
                              <span key={tag} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <a
                        href="mailto:npoluri5@gmail.com?subject=Project%20Inquiry&body=Hi%2C%20I'd%20like%20to%20discuss%20a%20project..."
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                      >
                        ✉️ Send a Message
                      </a>
                    </div>
                  </div>
                )}

                {/* Instructions Tab */}
                {activeViewTab === "instructions" && (
                  <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
                    <h3 className="mb-3 text-sm font-semibold">🚀 How to Run This Project</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">1. Extract the ZIP</p>
                        <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">unzip {project.title.replace(/[^a-zA-Z0-9-_]/g, "-")}.zip && cd {project.title.replace(/[^a-zA-Z0-9-_]/g, "-")}</pre>
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">2. Install dependencies</p>
                        {project.techStack.some(t => /node|next|react|vue|svelte|angular/i.test(t)) && (
                          <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">npm install</pre>
                        )}
                        {project.techStack.some(t => /python|fastapi|flask|django|langchain/i.test(t)) && (
                          <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">pip install -r requirements.txt</pre>
                        )}
                        {project.techStack.some(t => /flutter|dart/i.test(t)) && (
                          <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">flutter pub get</pre>
                        )}
                        {project.techStack.some(t => /go/i.test(t) && !/dart/i.test(t)) && (
                          <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">go mod download</pre>
                        )}
                        {project.techStack.some(t => /rust|cargo/i.test(t)) && (
                          <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">cargo build</pre>
                        )}
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">3. Run the project</p>
                        {project.techStack.some(t => /next|react|vue|svelte|angular/i.test(t)) && (
                          <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">npm run dev</pre>
                        )}
                        {project.techStack.some(t => /python|fastapi/i.test(t)) && (
                          <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">uvicorn main:app --reload</pre>
                        )}
                        {project.techStack.some(t => /flask/i.test(t)) && (
                          <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">python app.py</pre>
                        )}
                        {project.techStack.some(t => /flutter|dart/i.test(t)) && (
                          <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">flutter run</pre>
                        )}
                        {project.techStack.some(t => /react native/i.test(t)) && (
                          <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">npx react-native start</pre>
                        )}
                        {project.techStack.some(t => /docker/i.test(t)) && (
                          <>
                            <p className="my-1 text-xs text-zinc-500">Or use Docker:</p>
                            <pre className="rounded bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">docker-compose up</pre>
                          </>
                        )}
                      </div>
                      <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
                        <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">Tech Stack</p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((t) => (
                            <span key={t} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {generating && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          {messages.length === 1 && suggestionsForIndustry.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestionsForIndustry.slice(0, 6).map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(s); document.getElementById("chat-input")?.focus() }}
                  className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  {s.length > 55 ? s.slice(0, 55) + "..." : s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                currentCategoryValue === "All"
                  ? "Describe what you want to build..."
                  : `Describe your ${currentCategoryValue.toLowerCase()} project...`
              }
              disabled={generating}
              className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-900 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
            />
            <button
              type="submit"
              disabled={generating || !input.trim() || (techStack === "__custom__" && !customStack.trim())}
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Generate
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ---------- Design Tab Helpers ---------- */

interface ArchLayer {
  label: string
  color: string
  components: string[]
}

interface BusinessStep {
  icon: string
  label: string
  desc: string
}

interface TechCategory {
  icon: string
  category: string
  items: string[]
}

function generateArchitectureLayers(project: ProjectResult): ArchLayer[] {
  const ts = project.techStack.map(t => t.toLowerCase())
  const files = project.structure || []

  const layers: ArchLayer[] = []

  // Frontend / UI Layer
  const hasUI = ts.some(t => /next|react|vue|svelte|angular|flutter|html|css|tailwind/.test(t))
  if (hasUI) {
    layers.push({
      label: "🎨 Presentation / UI Layer",
      color: "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700",
      components: project.techStack.filter(t => /next|react|vue|svelte|angular|flutter|html|css|tailwind|typescript/i.test(t)),
    })
  }

  // API / Backend Layer
  const hasBackend = ts.some(t => /fastapi|flask|django|node|express|spring|go|rust|python/.test(t))
  if (hasBackend) {
    layers.push({
      label: "🔌 API / Backend Layer",
      color: "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700",
      components: project.techStack.filter(t => /fastapi|flask|django|node|express|spring|python|go|rust|socket/i.test(t)),
    })
  }

  // AI / ML Layer
  const hasAI = ts.some(t => /langchain|crewai|autogen|pytorch|tensorflow|openai|llm|rag|gpt|agent/.test(t))
  if (hasAI) {
    layers.push({
      label: "🧠 AI / ML Engine",
      color: "border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-700",
      components: project.techStack.filter(t => /langchain|crewai|autogen|pytorch|tensorflow|openai|llm|rag|gpt|agent|chroma|pinecone|weaviate/i.test(t)),
    })
  }

  // Data / Database Layer
  const hasData = ts.some(t => /postgres|mongo|sql|prisma|redis|firebase|supabase|influx|spark|kafka/.test(t))
  if (hasData) {
    layers.push({
      label: "💾 Data / Storage Layer",
      color: "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700",
      components: project.techStack.filter(t => /postgres|mongo|sql|prisma|redis|firebase|supabase|influx|spark|kafka|bigquery|snowflake/i.test(t)),
    })
  }

  // Infrastructure / DevOps
  const hasInfra = ts.some(t => /docker|kubernetes|terraform|aws|gcp|azure|helm|prometheus|grafana/.test(t))
  if (hasInfra) {
    layers.push({
      label: "☁️ Infrastructure / DevOps",
      color: "border-zinc-400 bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600",
      components: project.techStack.filter(t => /docker|kubernetes|terraform|aws|gcp|azure|helm|prometheus|grafana|github/i.test(t)),
    })
  }

  // Mobile / Embedded Layer
  const hasMobile = ts.some(t => /flutter|dart|react native|swiftui|kotlin|esp32|arduino/.test(t))
  if (hasMobile && !hasUI) {
    layers.push({
      label: "📱 Mobile / Embedded",
      color: "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700",
      components: project.techStack.filter(t => /flutter|dart|react native|swiftui|kotlin|esp32|arduino|nvidia/i.test(t)),
    })
  }

  if (layers.length === 0) {
    layers.push({
      label: "📦 Application",
      color: "border-zinc-400 bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600",
      components: project.techStack,
    })
  }

  return layers
}

function generateBusinessFlows(project: ProjectResult): BusinessStep[] {
  const allStack = project.techStack.join(" ").toLowerCase()

  const flows: BusinessStep[] = []

  flows.push({ icon: "👤", label: "User Request", desc: "Client sends request via UI / API" })

  if (/langchain|crewai|autogen|openai|llm|agent/.test(allStack)) {
    flows.push({ icon: "🧠", label: "AI Processing", desc: "LLM inference / agent orchestration" })
  }

  if (/fastapi|flask|node|express|spring/.test(allStack)) {
    flows.push({ icon: "⚡", label: "API Gateway", desc: "Route handling, auth, rate limiting" })
  }

  if (/postgres|mongo|sql|prisma|redis|firebase/.test(allStack)) {
    flows.push({ icon: "💾", label: "Data Access", desc: "CRUD operations, caching, storage" })
  }

  if (/docker|kubernetes|aws|gcp|azure/.test(allStack)) {
    flows.push({ icon: "☁️", label: "Deploy / Scale", desc: "Container orchestration, auto-scaling" })
  }

  if (/react|vue|svelte|next|flutter/.test(allStack)) {
    flows.push({ icon: "🎨", label: "Render UI", desc: "Update view with response data" })
  } else {
    flows.push({ icon: "✅", label: "Return Response", desc: "Send processed result back to client" })
  }

  return flows
}

function categorizeTechStack(techStack: string[]): TechCategory[] {
  const categories: TechCategory[] = [
    { icon: "🎨", category: "Frontend / UI", items: [] },
    { icon: "🔧", category: "Backend / API", items: [] },
    { icon: "🤖", category: "AI / ML", items: [] },
    { icon: "🗄️", category: "Database / Storage", items: [] },
    { icon: "☁️", category: "Infrastructure / DevOps", items: [] },
    { icon: "📱", category: "Mobile / Embedded", items: [] },
    { icon: "🔗", category: "Blockchain / Web3", items: [] },
    { icon: "🎮", category: "Game / AR/VR", items: [] },
    { icon: "⚛️", category: "Quantum / Research", items: [] },
    { icon: "🔧", category: "Other", items: [] },
  ]

  for (const t of techStack) {
    const lower = t.toLowerCase()
    if (/next|react|vue|svelte|angular|html|css|tailwind|typescript/.test(lower)) {
      categories[0].items.push(t)
    } else if (/fastapi|flask|django|node|express|spring|python|go|rust/.test(lower)) {
      categories[1].items.push(t)
    } else if (/langchain|crewai|autogen|pytorch|tensorflow|openai|llm|gpt|agent|rag|chroma|pinecone|weaviate|haystack|llamaindex/.test(lower)) {
      categories[2].items.push(t)
    } else if (/postgres|mongo|sql|prisma|redis|firebase|supabase|influx|spark|kafka|bigquery|snowflake|sqlite/.test(lower)) {
      categories[3].items.push(t)
    } else if (/docker|kubernetes|terraform|aws|gcp|azure|helm|prometheus|grafana|github|gitlab/.test(lower)) {
      categories[4].items.push(t)
    } else if (/flutter|dart|react native|swiftui|kotlin|esp32|arduino|nvidia|xamarin/.test(lower)) {
      categories[5].items.push(t)
    } else if (/solidity|hardhat|ethereum|web3|solana|anchor|defi|nft|brownie/.test(lower)) {
      categories[6].items.push(t)
    } else if (/unity|unreal|godot|blender|arkit|arcore|webxr/.test(lower)) {
      categories[7].items.push(t)
    } else if (/qiskit|pennylane|quantum|cirq/.test(lower)) {
      categories[8].items.push(t)
    } else {
      categories[9].items.push(t)
    }
  }

  return categories.filter(c => c.items.length > 0)
}

function generateFileTree(project: ProjectResult): string {
  const structure = project.structure || []
  if (structure.length === 0) return "(no files)"

  const root = structure[0].split("/")[1] || "project"
  const lines: string[] = []
  lines.push(`${root}/`)

  const tree: Record<string, string[]> = {}
  for (const path of structure) {
    const parts = path.split("/").filter(Boolean)
    if (parts.length < 2) continue
    const dir = parts.slice(1, -1).join("/") || "."
    const file = parts[parts.length - 1]
    if (!tree[dir]) tree[dir] = []
    tree[dir].push(file)
  }

  const sortedDirs = Object.keys(tree).sort()
  for (let i = 0; i < sortedDirs.length; i++) {
    const dir = sortedDirs[i]
    const files = tree[dir]
    const isLast = i === sortedDirs.length - 1
    const prefix = isLast ? "└── " : "├── "
    const childPrefix = isLast ? "    " : "│   "

    if (dir === ".") {
      for (let j = 0; j < files.length; j++) {
        const fIsLast = j === files.length - 1
        lines.push(`${fIsLast ? "└── " : "├── "}${files[j]}`)
      }
    } else {
      lines.push(`${prefix}${dir}/`)
      for (let j = 0; j < files.length; j++) {
        const fIsLast = j === files.length - 1
        lines.push(`${childPrefix}${fIsLast ? "└── " : "├── "}${files[j]}`)
      }
    }
  }

  return lines.join("\n")
}

function RenderMessage({ content }: { content: string }) {
  const lines = content.split("\n")
  const rendered = lines.map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} className="text-base font-semibold">{line.slice(3)}</h2>
    if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>
    if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>
    if (line.trim() === "") return <br key={i} />
    return <p key={i} className="whitespace-pre-wrap">{line}</p>
  })
  return <>{rendered}</>
}
