import { NextResponse } from "next/server"

const KNOWLEDGE_BASE: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["service", "offer", "build", "develop", "create", "make"],
    reply:
      "We offer AI-powered development services across 11 domains: Mobile Apps, Web Apps, AI Agents, Agentic AI, AGI, Quantum AI, AI Robotics, AI Semiconductors, AIoT, AI + Biotechnology, and AI + Neural Science. We also provide consulting, API integration, and ML model deployment. Which area interests you?",
  },
  {
    keywords: ["price", "cost", "pricing", "plan", "pay", "subscription", "pro max", "free", "starter", "how much"],
    reply:
      "Our pricing starts with a Free tier (basic consultation). The Starter plan is $29/mo, Pro is $99/mo, and Pro Max is $299/mo with priority support. We also offer one-time builds starting from $499. Check our /pricing page for full details!",
  },
  {
    keywords: ["tech", "technology", "stack", "framework", "language", "react", "python", "typescript", "next.js", "node"],
    reply:
      "Our tech stack includes Next.js, React, TypeScript, Node.js, Python, Tailwind CSS, PostgreSQL, MongoDB, AWS, Docker, Kubernetes, and various AI/ML frameworks including TensorFlow, PyTorch, and LangChain. We also work with Solace PubSub+, IBM MQ, and enterprise systems for LTA/GovTech projects.",
  },
  {
    keywords: ["start", "get started", "begin", "how to", "process", "onboard"],
    reply:
      "Getting started is easy! 1) Reach out via our Contact form or email npoluri5@gmail.com. 2) We'll schedule a free consultation to understand your project. 3) We'll provide a proposal with timeline and pricing. 4) Once approved, development begins with regular updates. Ready to start? Just say the word!",
  },
  {
    keywords: ["portfolio", "work", "project", "past", "example", "case study", "client"],
    reply:
      "We've completed 110+ projects across e-commerce, gaming, fintech, healthcare, SaaS, and education. Notable clients include DBS Bank, Singtel, Sea Limited, and GovTech SG. Our Work section showcases case studies in fashion retail, mobile gaming, and B2B SaaS platforms.",
  },
  {
    keywords: ["contact", "email", "reach", "support", "help", "phone", "call"],
    reply:
      "You can reach us at npoluri5@gmail.com or call +65 8176 5178. Our team typically responds within 24 hours. For urgent matters, we recommend calling directly during business hours (Singapore time, GMT+8).",
  },
  {
    keywords: ["timeline", "delivery", "how long", "deadline", "eta", "duration"],
    reply:
      "Most projects show initial results within 2-3 weeks, with optimal performance achieved after 4-6 weeks. Simple web apps typically take 2-4 weeks, while complex AI-powered solutions may take 6-12 weeks. Timeline depends on scope and complexity. Let's discuss your specific needs!",
  },
  {
    keywords: ["industry", "specialize", "sector", "e-commerce", "fintech", "healthcare", "gaming", "education", "saas"],
    reply:
      "We specialize across 6 key sectors: E-commerce, Gaming, Finance (Fintech), Healthcare, Tech/SaaS, and Education. Each solution is adapted to industry-specific regulations and requirements while maintaining our AI-powered approach.",
  },
  {
    keywords: ["data", "privacy", "security", "secure", "gdpr", "pdcp", "pii", "encrypt"],
    reply:
      "We take security seriously. All data is encrypted in transit (256-bit SSL/TLS) and at rest (AES-256). We follow GDPR, PDPA (Singapore), and industry-specific regulations. Our systems undergo regular third-party security audits. For full details, see our Privacy Policy.",
  },
  {
    keywords: ["refund", "cancel", "cancellation", "money back", "guarantee"],
    reply:
      "We offer a 14-day refund policy for subscription plans. One-time build projects are non-refundable once development has commenced. You can cancel your subscription at any time from your Payments dashboard — access continues through the end of your paid period.",
  },
  {
    keywords: ["payment", "pay", "credit card", "paypal", "google pay", "crypto", "bitcoin", "eth", "usdt", "sol"],
    reply:
      "We accept multiple payment methods: credit/debit cards, PayPal, Google Pay, and cryptocurrency (BTC, ETH, USDT, SOL). We also support country-specific local payment methods depending on your location. All payments are processed securely.",
  },
  {
    keywords: ["singapore", "sg", "location", "office", "hq", "based"],
    reply:
      "We're headquartered in Singapore and proudly serve Singapore-based clients including DBS Bank, Singtel, Sea Limited, and GovTech SG. Our team operates in the Singapore timezone (GMT+8) and understands local business requirements.",
  },
  {
    keywords: ["mobile app", "mobile apps", "ios", "android", "flutter", "react native", "swift", "kotlin"],
    reply:
      "We build cross-platform mobile apps using React Native and Flutter, as well as native iOS (Swift) and Android (Kotlin) apps. Our mobile solutions integrate AI features like smart search, recommendation engines, computer vision, and NLP chatbots. We have delivered 30+ mobile apps for clients across e-commerce, fintech, and healthcare sectors.",
  },
  {
    keywords: ["web app", "web apps", "website", "web application", "next.js", "react", "full stack", "frontend"],
    reply:
      "We specialize in modern web applications using Next.js, React, and TypeScript. From SaaS platforms to e-commerce sites, we build responsive, performant web apps with SEO optimization and server-side rendering. All our web apps include AI integration where it adds value — chatbots, personalization, analytics, and more.",
  },
  {
    keywords: ["ai agent", "ai agents", "autonomous agent", "multi-agent", "agentic", "crew ai", "langgraph", "autogpt"],
    reply:
      "We build autonomous AI agents and multi-agent systems using LangChain, CrewAI, AutoGPT, and custom frameworks. Our AI agents can handle tasks like customer support automation, data extraction, content generation, code review, and business process automation. We also build agent orchestration systems where multiple agents collaborate on complex workflows.",
  },
  {
    keywords: ["agi", "artificial general intelligence", "general intelligence"],
    reply:
      "AGI research and development is one of our frontier areas. We work on systems that combine multiple AI capabilities — reasoning, planning, memory, tool use — into unified architectures. While true AGI remains a research challenge, we build progressively more autonomous systems that approach general problem-solving capabilities for specific domains.",
  },
  {
    keywords: ["quantum", "quantum ai", "quantum computing", "qml"],
    reply:
      "We explore quantum machine learning (QML) and quantum-classical hybrid algorithms. Our work includes quantum-enhanced optimization, quantum neural networks using simulators and available quantum hardware (IBM Q, Rigetti), and quantum-safe cryptography for enterprise applications.",
  },
  {
    keywords: ["robotics", "ai robotics", "robot", "automation", "ros", "computer vision", "ros2"],
    reply:
      "We develop AI-powered robotics solutions combining computer vision, SLAM, path planning, and manipulation. Our work spans industrial automation (warehouse robots, pick-and-place), service robots (delivery, inspection), and research platforms using ROS 2 and simulation environments like Isaac Sim.",
  },
  {
    keywords: ["semiconductor", "semiconductors", "chip", "vlsi", "fpga", "asic", "hardware ai"],
    reply:
      "We provide AI-driven semiconductor design services including RTL design, verification, physical design, and DFT. Our AI/ML models optimize chip layout, power analysis, and timing closure. We work with both FPGA prototyping and ASIC flows for AI accelerator chips.",
  },
  {
    keywords: ["aiot", "internet of things", "iot", "edge ai", "edge computing", "sensor", "embedded"],
    reply:
      "We build AIoT (AI + IoT) solutions that bring intelligence to edge devices. Our systems combine sensor data collection, edge inference, cloud backends, and real-time dashboards. Use cases include smart manufacturing (predictive maintenance), smart buildings (energy optimization), and agricultural monitoring.",
  },
  {
    keywords: ["biotech", "biotechnology", "bioinformatics", "drug discovery", "genomics", "protein", "healthcare ai"],
    reply:
      "We apply AI to biotechnology challenges including drug discovery (molecular docking, virtual screening), genomics (variant calling, sequence analysis), protein folding prediction, medical imaging diagnostics, and clinical trial optimization. Our biotech AI solutions accelerate research timelines by 40-60%.",
  },
  {
    keywords: ["neural science", "neural", "brain", "bci", "brain computer", "neuromorphic", "neuroscience"],
    reply:
      "We work at the intersection of AI and neural science, developing brain-computer interfaces (BCI), neuromorphic computing systems, and neural network architectures inspired by biological neural systems. Our projects include EEG signal processing, neural decoding, and spiking neural networks for energy-efficient AI.",
  },
]

const FALLBACK =
  "I'm not sure I understand. Could you rephrase that? I can help with questions about our services (mobile apps, web apps, AI agents, etc.), pricing, technology stack, process, and more. You can also try: 'What services do you offer?', 'How much does it cost?', 'What technologies do you use?', or 'How do I get started?'. Or feel free to email npoluri5@gmail.com for detailed inquiries!"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Please provide a valid message." }, { status: 400 })
    }

    const lower = message.toLowerCase()
    let bestScore = 0
    let bestReply = FALLBACK

    for (const entry of KNOWLEDGE_BASE) {
      const score = entry.keywords.filter((kw) => lower.includes(kw)).length
      if (score > bestScore) {
        bestScore = score
        bestReply = entry.reply
      }
    }

    if (bestScore === 0) {
      const greetingWords = ["hi", "hello", "hey", "good morning", "good evening", "sup", "yo"]
      if (greetingWords.some((g) => lower.includes(g))) {
        bestReply =
          "Hello! Welcome to BlueprintAI. I'm your virtual assistant. I can tell you about our AI development services, pricing, technology stack, portfolio, and more. What would you like to know?"
      }
    }

    return NextResponse.json({ reply: bestReply })
  } catch (e) {
    console.error("Chat API error:", e)
    return NextResponse.json({ reply: "Sorry, something went wrong. Please try again later or email npoluri5@gmail.com." }, { status: 500 })
  }
}
