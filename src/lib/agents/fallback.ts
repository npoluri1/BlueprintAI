const RESPONSES: Record<string, { style: string; replies: string[] }> = {
  CEO: {
    style: "Visionary, strategic, big-picture. Talks about vision, market, growth, team motivation.",
    replies: [
      "Great question. From a strategic standpoint, this aligns perfectly with our Q4 vision of expanding into AI-driven automation. I'd like to see us move fast on this — let's have the CTO evaluate the technical feasibility and the CFO run a quick ROI analysis. I believe this could open up a whole new revenue stream for us.",
      "I've been thinking about this direction for a while now. The market is shifting, and we have a unique opportunity to lead rather than follow. Let's allocate resources to explore this — I want to see a proposal from the team by end of week.",
      "That's exactly the kind of thinking we need. I'm going to champion this initiative. Let me talk to the board about increasing our innovation budget. We need to strike while the iron is hot and the market is ready for what we're building.",
      "I appreciate you bringing this up. Let me share some context — our investors are very excited about our AI capabilities. If we can execute on this well, I see a clear path to Series B. Let's make this a priority across all departments.",
      "Looking at this from 30,000 feet, I see three key opportunities: market differentiation, operational efficiency, and talent attraction. This checks all three boxes. I'm giving this my full support. CTO, what are your thoughts on the technical roadmap?",
    ],
  },
  CTO: {
    style: "Technical, precise, architecture-focused. Talks about tech stack, scalability, system design, implementation details.",
    replies: [
      "Technically speaking, this is an interesting challenge. I'd recommend we use a microservices architecture with event-driven communication. For the AI pipeline, we should consider LangChain with a vector store for RAG. I can draft an architecture proposal. The key challenge will be latency — we need to design for it from day one.",
      "Let me break down the technical requirements here. We'll need three main components: a data ingestion layer, an ML inference pipeline, and an API gateway. For the tech stack, I'd go with FastAPI for the backend, PostgreSQL for persistence, and Redis for caching. The AI layer can use GPT-4o with proper prompt engineering.",
      "I've evaluated a few approaches for this. Option A is using a monolithic architecture with modular components — faster to build but harder to scale. Option B is fully distributed with event sourcing — more robust but longer development time. I recommend we start with Option A and plan the migration to B in Q2.",
      "From a scalability perspective, this needs to handle at least 10x our current load. I propose we use Kubernetes for orchestration, with horizontal pod autoscaling based on custom metrics. We should also implement circuit breakers and rate limiting from the start.",
      "The architecture should be event-driven with Apache Kafka or Redis Streams for message brokering. Each microservice will own its data store. For our AI components, I recommend a hybrid approach — on-device inference for real-time features and cloud inference for complex tasks.",
    ],
  },
  CFO: {
    style: "Analytical, data-driven, financially focused. Talks about ROI, budget, cost optimization, revenue models.",
    replies: [
      "Let me run the numbers on this. Based on my preliminary analysis, we're looking at a development cost of approximately $150K-200K with a 6-month timeline. The revenue projection suggests we could break even within 12 months at current market rates. I'd recommend we allocate a portion of our innovation fund to de-risk this.",
      "I've reviewed the financial implications. Our burn rate allows for one major initiative this quarter. This project has a projected ROI of 3.5x over 24 months, which is solid. However, I'd suggest a phased approach — start with an MVP at $80K, validate the market, then scale.",
      "From a fiscal perspective, I see two paths. Path one is fully funded from our operating budget — slower but safer. Path two involves seeking a strategic partnership for co-funding — faster but dilutes ownership. I've prepared a sensitivity analysis showing both scenarios.",
      "The unit economics look promising. Our customer acquisition cost would be around $45 with a projected LTV of $600. That's a 13:1 ratio, which is healthy. The key risk is the 8-month payback period — we need to ensure we have the runway to support this.",
      "I've benchmarked this against industry standards. Our competitors are spending 15-20% of revenue on similar initiatives. I recommend we match that investment but with strict milestone-based funding. We review at each gate — if the metrics aren't there, we pivot or kill it.",
    ],
  },
  COO: {
    style: "Practical, process-oriented, operational. Talks about workflows, timelines, KPIs, execution, coordination.",
    replies: [
      "I've mapped out the operational workflow for this. We'll need updates to three core processes: intake, development, and delivery. I can have the SOPs drafted by tomorrow. The key bottleneck will be cross-team coordination — I suggest we set up a weekly sync across all departments involved.",
      "Operationally, this requires changes to our current sprint planning. We need to allocate at least 40% of engineering capacity for the next two quarters. I've already spoken with the team leads, and they're onboard, but we'll need to descope some lower-priority items.",
      "Let me outline the operational timeline. Phase 1 (Weeks 1-4): Requirements gathering and architecture. Phase 2 (Weeks 5-12): Core development. Phase 3 (Weeks 13-16): Testing and QA. Phase 4 (Weeks 17-20): Deployment and monitoring. I'll set up milestone tracking in our project management system.",
      "I've identified three operational risks: resource contention, dependency on external APIs, and knowledge silos. To mitigate these, I suggest we implement a resource allocation matrix, establish SLA agreements with vendors, and set up pair programming sessions for knowledge sharing.",
      "From an execution standpoint, this is achievable but requires discipline. I'll establish KPIs: sprint velocity, deployment frequency, and incident response time. We'll track these in our dashboard and review them during our weekly operations review. Quality gates will be enforced at each milestone.",
    ],
  },
  CPO: {
    style: "User-centric, design-minded, product-focused. Talks about UX, user research, feature prioritization, product-market fit.",
    replies: [
      "From a product perspective, this addresses a real pain point I've heard in our user interviews. Customers have been asking for this capability. I'd like to run a quick concept test with our design partner program before we commit to full development. Let me set up three user sessions this week.",
      "I love this direction. The key question is: how do we make this intuitive for our users? I'm thinking a clean, minimal interface with progressive disclosure — surface the basic features first, then reveal more advanced capabilities as users become comfortable.",
      "I've reviewed this against our product roadmap. It aligns well with our Q3 goal of expanding enterprise features. However, I'd prioritize it slightly differently — let's start with the core workflow, validate with power users, then expand to the full feature set based on feedback.",
      "User research indicates that simplicity is our biggest competitive advantage. For this feature, I propose we follow the 'three-click rule' — users should be able to accomplish their goal within three clicks. Let me work with the design team on some wireframes and run a usability test.",
      "The competitive landscape analysis shows that most solutions in this space are overly complex. Our opportunity is to make this accessible to non-technical users. I'm thinking of a wizard-based interface that guides users through setup. We can use progressive profiling to learn about user needs.",
    ],
  },
  CMO: {
    style: "Creative, growth-oriented, market-aware. Talks about positioning, campaigns, brand, acquisition channels.",
    replies: [
      "From a marketing perspective, this is gold. The positioning writes itself — 'AI-powered solutions for modern enterprises.' I can see a three-channel launch strategy: content marketing (white papers, case studies), paid acquisition (LinkedIn, industry pubs), and partner marketing (co-branded webinars).",
      "I've already got some ideas for the go-to-market. We should lead with a strong narrative about how this solves the #1 pain point in the industry. I'll draft three positioning angles and test them with our customer advisory board. The messaging needs to resonate with both technical buyers and business decision-makers.",
      "The market timing is perfect. Our competitors are weak in this area — I've analyzed their messaging and there's a clear gap we can exploit. Let me prepare a competitive battle card and a differentiated messaging framework. We can own this space if we move quickly.",
      "My team is ready to support this launch. I recommend a phased campaign: teaser content (2 weeks), launch event with customer stories (1 week), and sustained demand gen (ongoing). I'll need a budget of $50K for paid channels and content production. Expected CAC: $35-45 with a 4x multiplier on pipeline.",
      "Brand perception is key here. I suggest we position this as 'Enterprise AI, Simplified' — focusing on accessibility and ROI. I'll create a content hub with case studies, technical deep-dives, and ROI calculators. Let's also identify 3-5 key industry events where we can showcase this.",
    ],
  },
  CIO: {
    style: "Innovative, future-focused, research-oriented. Talks about emerging tech, innovation trends, R&D, competitive differentiation.",
    replies: [
      "This is exactly the kind of moonshot thinking I love to see. I've been tracking similar developments in the AI research community and there's some fascinating progress in this area. I'd like to spin up an innovation sprint — two weeks of focused exploration with our R&D lab to validate the core concepts.",
      "From an innovation standpoint, this has massive potential. I see three emerging technologies we could leverage: federated learning for privacy, edge AI for real-time processing, and multimodal models for richer interactions. Let me research the feasibility and report back with a innovation brief.",
      "I've been following the research trends, and this aligns well with where the industry is heading. Our competitors are investing heavily in similar capabilities, but I think we can leapfrog them by combining this with our existing AI infrastructure. Let me schedule a tech radar session to explore the possibilities.",
      "There's an opportunity to patent several aspects of this approach. I've identified at least three novel techniques that would be strong IP candidates: our unique data processing pipeline, the AI orchestration method, and the user interaction model. Let me engage our patent counsel to explore provisional filings.",
      "I'd like to establish a partnership with a university research lab to explore the advanced aspects of this. We could co-publish papers, get access to cutting-edge research, and attract top PhD talent. I have a contact at MIT's CSAIL who would be interested in discussing collaboration.",
    ],
  },
  CHRO: {
    style: "Empathetic, people-focused, culturally aware. Talks about team dynamics, hiring, culture, growth, collaboration.",
    replies: [
      "I'm excited about what this means for our team! To execute this well, we need to think about talent. I recommend we start a hiring push for three key roles: an AI/ML engineer, a product designer, and a technical writer for documentation. I'll have the job descriptions ready in 48 hours.",
      "From a people perspective, this initiative will require strong cross-functional collaboration. I suggest we create a dedicated team with representatives from engineering, product, and marketing. Let me set up a kickoff workshop to align everyone on the vision and build team cohesion.",
      "I've been thinking about how this impacts our culture. Innovation requires psychological safety — people need to feel safe taking risks and sharing ideas. I'll run a few workshops on fostering an innovation culture and make sure our recognition programs celebrate both successes and learnings from failures.",
      "Team health is critical for ambitious projects. I recommend we implement structured check-ins, maintain sustainable work hours, and build in buffer time for creative exploration. Our best work comes from energized, motivated teams — not burned-out ones. Let me create a wellness plan for this initiative.",
      "This is a fantastic growth opportunity for our team members. I'd like to pair junior engineers with senior mentors on this project to build capability. I'll also set up a learning budget for certifications and courses related to the technologies we'll be using. Investing in our people is investing in our future.",
    ],
  },
  "VP Engineering": {
    style: "Execution-focused, team-oriented, delivery-driven. Talks about sprints, engineering capacity, code quality, build plans.",
    replies: [
      "I've assessed this against our current engineering capacity. We have two teams available starting next sprint. I estimate 3-4 sprints for the core implementation with a team of 4 engineers. Let me break down the work into epics and get a rough timeline together by end of day.",
      "From an engineering execution perspective, this is feasible but we need to be smart about sequencing. I'd recommend we build the foundation first — data layer, then API, then UI. We can parallelize the frontend and backend once the interfaces are defined. Let me draft a technical spec.",
      "My teams are aligned and ready. However, I want to flag a dependency on the platform team for the new infrastructure. I'll set up a working group with cross-team representation to ensure we unblock any dependencies quickly. Code reviews will be mandatory for every PR.",
      "Looking at the codebase, we'll need to refactor a few modules to accommodate this cleanly. I suggest we allocate 20% of our capacity to technical debt reduction alongside this feature work. We can't build a skyscraper on a shaky foundation.",
      "I've reviewed the engineering requirements with my leads. The key challenge is testing — we need comprehensive integration tests for the AI components. I propose we adopt a test-driven approach for this project. Mock the AI service responses for unit tests, and run nightly integration tests against the actual endpoints.",
    ],
  },
  "Data Scientist": {
    style: "Analytical, rigorous, evidence-based. Talks about data quality, model selection, experiments, statistical significance.",
    replies: [
      "I've run an initial exploratory data analysis on this. The data quality is good but there are some interesting patterns in the feature distributions. I recommend we start with a baseline model using gradient boosting, then experiment with deep learning approaches if we need more capacity. The key metric we should optimize for is F1 score given the class imbalance.",
      "From a data science perspective, this is a well-defined supervised learning problem. I'd suggest we frame it as a multi-class classification task. I'll run a feature importance analysis to identify the top predictors and set up an experiment tracking pipeline with MLflow. We should also implement proper cross-validation.",
      "I've been looking at the data pipeline requirements. We need three things: a feature store for consistent feature engineering, an experiment tracker for reproducibility, and a model registry for versioning. I'd recommend Feast for the feature store and MLflow for tracking and registry.",
      "The modeling approach I'd recommend is an ensemble of transformer-based models with a lightGBM meta-learner. This gives us the representational power of deep learning with the interpretability of tree-based methods. I'll set up a baseline and iterate from there.",
      "I've crunched the numbers on this use case. With our current data volume (~500K samples), we can achieve strong results. The critical path is data labeling — we need domain experts to annotate at least 10K samples for the supervised approach. Alternatively, we can explore a semi-supervised approach with active learning to reduce labeling cost by 60%.",
    ],
  },
  "ML Engineer": {
    style: "Systems-minded, operational, pragmatic. Talks about model deployment, inference optimization, MLOps, monitoring.",
    replies: [
      "From an MLOps standpoint, this model needs to serve predictions with sub-100ms latency at 95th percentile. I recommend we containerize the model with Docker, serve it via TorchServe or TF Serving, and set up autoscaling based on request volume. We also need a fallback mechanism for when the model is unavailable.",
      "I've mapped out the deployment pipeline. We'll need: a training pipeline (triggered on new data), an evaluation pipeline (validates against holdout set), a promotion pipeline (staging → production), and a monitoring pipeline (drift detection + performance tracking). Let me set this up in our CI/CD system.",
      "For inference optimization, I recommend we quantize the model to FP16 or INT8, which should give us a 2-4x speedup with minimal accuracy loss. We can also batch requests for higher throughput. If latency is still an issue, we can explore model distillation or on-device deployment with TensorFlow Lite.",
      "I've been monitoring the production models and I noticed some drift in the input distribution over the last week. I'd recommend we set up automated retraining triggers based on data drift metrics and deploy a champion/challenger pattern so we can A/B test model versions in production.",
      "From an infrastructure perspective, this model needs GPU resources for training but can run on CPU for inference if we optimize properly. I estimate we need 4xA100 GPUs for training (2-3 hours per run) and 8 CPU cores + 16GB RAM for production inference. Let me provision this in our cloud environment.",
    ],
  },
  "Software Engineer": {
    style: "Hands-on, practical, quality-focused. Talks about implementation, testing, debugging, code architecture.",
    replies: [
      "I've started looking at the implementation approach. I think we should use a clean architecture pattern with clear separation between the API layer, business logic, and data access. I'll create the project structure and set up the core modules. The key decision is whether we use REST or GraphQL for the API.",
      "From a code perspective, this feature touches several existing modules. I recommend we extract a shared library for the common functionality to avoid duplication. I've already identified three places where we can consolidate logic. Let me submit a refactoring PR first, then build the feature on top.",
      "I've prototyped the core algorithm and it's looking promising. The implementation complexity is moderate — the main challenge is handling edge cases in the data processing pipeline. I'll write comprehensive unit tests covering the edge cases and set up integration tests for the end-to-end flow.",
      "For the implementation, I recommend we use TypeScript with strict mode enabled. We should also set up ESLint with strict rules and Prettier for code formatting. I'll configure the project with a monorepo structure using Turborepo for efficient builds and dependency management.",
      "I've reviewed the existing codebase and this feature integrates cleanly with our current architecture. The main change is adding a new module with its own database tables and API endpoints. I estimate 2-3 weeks of development time for a team of two engineers. Let me break this down into actionable tickets.",
    ],
  },
  "Product Manager": {
    style: "Strategic, user-obsessed, collaborative. Talks about requirements, prioritization, user research, success metrics.",
    replies: [
      "I've been thinking about the product requirements for this. The key user need is simple: they want to accomplish their goal in the shortest time possible. I'll write a product spec with clear acceptance criteria and success metrics. The north star metric should be task completion rate with a target of >85%.",
      "From a product perspective, this feature scores high on both user impact and business value. I'd recommend we prioritize it for the next quarter. Let me run a quick validation with 5-10 target users to confirm our assumptions before we commit engineering resources.",
      "I've conducted user research on this topic and the feedback is clear: users want simplicity and speed. Our current solution is too complex. I propose we simplify the user flow from 5 steps to 2 steps and reduce the time-to-completion by 60%. Let me share the research findings with the team.",
      "The competitive landscape shows that our competitors have similar features but with poor UX. Our differentiator is ease of use. I'll write user stories and acceptance criteria that prioritize the user experience above all else. We should benchmark our solution against the best-in-class consumer apps.",
      "I've prioritized this against our roadmap and I think it should be a Q2 deliverable. The business case is strong — projected 15% increase in user engagement and 10% reduction in churn. I'll create a PRD with success metrics, target users, and a phased rollout plan starting with a beta to power users.",
    ],
  },
  "UX Designer": {
    style: "Empathetic, creative, user-centered. Talks about design systems, wireframes, usability testing, accessibility.",
    replies: [
      "I've sketched out some initial wireframes for this feature. The user flow is clean: discover → configure → preview → confirm. I'd like to run a quick usability test with 5 users to validate the flow before we move to high-fidelity designs. The key design decision is whether to use a wizard or a single-page interface.",
      "From a design perspective, this needs to be intuitive and accessible. I'll create a design system component for this pattern so it's reusable across the product. I'm thinking of a card-based layout with progressive disclosure — show the essential information first, then allow users to drill down for details.",
      "I've analyzed the user journey and identified three pain points in the current flow. The main issue is cognitive overload — too many options presented at once. I recommend we implement a step-by-step guided experience with clear progress indicators and contextual help.",
      "For the visual design, I'm going with a clean, modern aesthetic with plenty of white space and a focused color palette. The typography should be highly readable with clear hierarchy. I'll also ensure the design meets WCAG 2.1 AA accessibility standards — proper contrast ratios, keyboard navigation, and screen reader support.",
      "I've created an interactive prototype in Figma and would love to get feedback from the team. The design uses a bottom sheet pattern for the configuration panel, which works well on both mobile and desktop. I'll hand off the specs with detailed annotations for the engineering team once we've validated the design.",
    ],
  },
  "DevOps Engineer": {
    style: "Automation-obsessed, reliability-focused. Talks about infrastructure, CI/CD, monitoring, cost optimization, security.",
    replies: [
      "From an infrastructure perspective, I recommend we deploy this on Kubernetes with a GitOps workflow using ArgoCD. The application stack needs: a web service, a worker for async jobs, and a Redis instance for caching. I'll write the Helm charts and Terraform configs. Estimated cloud cost: $400-600/month.",
      "I've designed the CI/CD pipeline for this. Every PR triggers: lint → typecheck → unit tests → build → integration tests. Merges to main trigger: build → staging deploy → E2E tests → production deploy (with manual approval gate). Total pipeline time should be under 15 minutes.",
      "For monitoring, I'll set up Prometheus for metrics collection, Grafana for dashboards, and PagerDuty for alerting. The key SLOs are: 99.9% uptime, p95 latency <200ms, and error rate <0.1%. I'll also set up structured logging with Loki for centralized log management.",
      "I've audited the infrastructure requirements. We'll need to provision: a Kubernetes cluster (3 nodes), a managed PostgreSQL database, a Redis instance, and an object storage bucket. I'll use Terraform for infrastructure-as-code and store the state in a remote backend. Everything is reproducible and version-controlled.",
      "Security is a top priority. I'll implement: network policies for microsegmentation, secrets management with HashiCorp Vault, TLS everywhere, regular dependency scanning with Trivy, and runtime container security with Falco. I'll also set up automated penetration testing as part of our release pipeline.",
    ],
  },
  "Security Engineer": {
    style: "Vigilant, thorough, risk-aware. Talks about threat modeling, access controls, encryption, compliance, vulnerabilities.",
    replies: [
      "I've done a preliminary security review of this feature. The main risks are: injection attacks via user input, insufficient authorization checks on API endpoints, and potential data leakage through error messages. I recommend we implement parameterized queries, role-based access control with server-side enforcement, and sanitized error responses.",
      "From a security perspective, we need to ensure this feature follows our zero-trust architecture principles. Every request must be authenticated, authorized, and encrypted. I recommend we use OAuth 2.0 with short-lived tokens, implement rate limiting per user, and add audit logging for all sensitive operations.",
      "I've identified a few security concerns that need to be addressed before launch. First, we need to add input validation and output encoding to prevent XSS. Second, the API endpoints need proper CORS configuration. Third, we need to implement CSRF protection. Let me create security requirements tickets for each item.",
      "For data protection, we need to classify the data this feature handles and apply appropriate controls. If it processes PII, we need encryption at rest and in transit, data minimization, and proper retention policies. I'll also ensure we have an incident response plan in place before going live.",
      "I've run a threat modeling session for this feature using the STRIDE methodology. We identified 8 potential threats, 3 of which are high severity. The most critical is privilege escalation through the role management API. I'll work with the engineering team to implement proper access controls and add penetration testing to the release checklist.",
    ],
  },
}

function getAgentRolePerMessage(role: string, userMessage: string): string {
  const topics: Record<string, string> = {
    tech: role === "CTO" ? "architecture" : role === "VP Engineering" ? "engineering execution" : role === "ML Engineer" ? "model deployment" : role === "Data Scientist" ? "data science" : role === "CEO" ? "strategy" : "approach",
    build: role === "VP Engineering" ? "build execution" : role === "Software Engineer" ? "implementation" : role === "CTO" ? "system design" : role === "COO" ? "execution plan" : role === "CEO" ? "vision" : "planning",
    code: role === "Software Engineer" ? "code architecture" : role === "VP Engineering" ? "code quality" : role === "CTO" ? "technical standards" : "development",
    deploy: role === "DevOps Engineer" ? "deployment pipeline" : role === "ML Engineer" ? "model serving" : role === "CTO" ? "infrastructure" : "release",
    idea: role === "CIO" ? "innovation" : role === "CEO" ? "strategy" : role === "CTO" ? "feasibility" : "assessment",
    help: role === "CHRO" ? "team support" : role === "COO" ? "process" : role === "VP Engineering" ? "engineering support" : "support",
    plan: role === "CEO" ? "strategic planning" : role === "COO" ? "operational planning" : role === "CFO" ? "financial planning" : role === "Product Manager" ? "roadmap planning" : "planning",
    market: role === "CMO" ? "market analysis" : role === "CEO" ? "market strategy" : role === "CFO" ? "market economics" : role === "Product Manager" ? "competitive analysis" : "analysis",
    cost: role === "CFO" ? "cost analysis" : role === "COO" ? "resource optimization" : role === "CEO" ? "investment" : role === "DevOps Engineer" ? "infra cost" : "budget",
    team: role === "CHRO" ? "team dynamics" : role === "VP Engineering" ? "engineering team" : role === "COO" ? "team coordination" : role === "CEO" ? "leadership" : "collaboration",
    user: role === "UX Designer" ? "user experience" : role === "CPO" ? "product experience" : role === "Product Manager" ? "user needs" : role === "CMO" ? "customer research" : "user experience",
    data: role === "Data Scientist" ? "data analysis" : role === "ML Engineer" ? "data pipeline" : role === "CTO" ? "data architecture" : role === "CIO" ? "data innovation" : "data driven decisions",
    security: role === "Security Engineer" ? "security review" : role === "DevOps Engineer" ? "infra security" : role === "CTO" ? "security architecture" : "protection",
    design: role === "UX Designer" ? "interaction design" : role === "CPO" ? "product design" : role === "Software Engineer" ? "UI implementation" : "design approach",
    test: role === "Software Engineer" ? "testing strategy" : role === "DevOps Engineer" ? "CI testing" : role === "VP Engineering" ? "quality assurance" : "testing",
    model: role === "ML Engineer" ? "model serving" : role === "Data Scientist" ? "model selection" : role === "CTO" ? "AI architecture" : "ML approach",
    product: role === "Product Manager" ? "product strategy" : role === "CPO" ? "product vision" : role === "CEO" ? "business strategy" : "product direction",
    feature: role === "Product Manager" ? "feature prioritization" : role === "Software Engineer" ? "feature implementation" : role === "UX Designer" ? "feature design" : "feature planning",
  }

  const lower = userMessage.toLowerCase()
  for (const [keyword, response] of Object.entries(topics)) {
    if (lower.includes(keyword)) return response
  }

  const roleIntro: Record<string, string> = {
    CEO: "strategic direction",
    CTO: "technical architecture",
    CFO: "financial analysis",
    COO: "operational planning",
    CPO: "product strategy",
    CMO: "market positioning",
    CIO: "innovation research",
    CHRO: "team development",
    "VP Engineering": "engineering execution",
    "Data Scientist": "data analysis",
    "ML Engineer": "machine learning operations",
    "Software Engineer": "software implementation",
    "Product Manager": "product management",
    "UX Designer": "user experience design",
    "DevOps Engineer": "infrastructure and operations",
    "Security Engineer": "security and compliance",
  }
  return roleIntro[role] || "general assessment"
}

export function generateFallbackResponse(role: string, name: string, companyName: string, userMessage: string): string {
  const roleData = RESPONSES[role]
  if (!roleData) {
    return `Hi! I'm the ${role} at ${companyName}. Thanks for reaching out. Let me look into that and get back to you with some thoughts.`
  }

  const topic = getAgentRolePerMessage(role, userMessage)
  const replies = roleData.replies
  const index = (userMessage.length + role.length + companyName.length) % replies.length

  let response = replies[index]

  const lower = userMessage.toLowerCase()
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    response = `Hi there! Great to connect. ${replies[(index + 1) % replies.length].split(".")[0]}. How can I help from a ${role} perspective today?`
  }

  if (lower.includes("thank")) {
    response = `You're welcome! I'm always here to help. ${replies[(index + 2) % replies.length].split("\n")[0]}`
  }

  if (lower.includes("bye") || lower.includes("goodbye")) {
    response = `It was great talking with you! Remember, my door is always open. Let's continue this conversation whenever you need me. Have a productive day!`
  }

  if (lower.includes("?")) {
    const questionResponses: Record<string, string> = {
      CEO: `Great question. Let me think about this from a strategic lens. Based on where we're heading as a company, I'd say ${topic} is absolutely critical right now. I'd love to hear the CTO's perspective on the technical implications as well.`,
      CTO: `Excellent technical question. From an architecture standpoint, ${topic} requires careful consideration of our current infrastructure and future scale needs. I recommend we schedule a technical deep-dive to explore the options in detail.`,
      CFO: `That's a great financial question. Let me run some numbers on ${topic}. Based on preliminary analysis, I think we have multiple viable paths here, each with different risk profiles and return expectations.`,
      COO: `Good operational question. For ${topic}, I'd recommend we look at our current workflows and identify where we can optimize. I'll have a process improvement proposal ready for review by our next ops meeting.`,
      CPO: `Love this product question! ${topic} is something I've been thinking deeply about. Let me share some user research insights that inform our approach.`,
      CMO: `Great marketing question! ${topic} is exactly where we should be focusing our efforts. Let me share some market data that supports this direction.`,
      CIO: `Fascinating question! ${topic} is an area where we have significant innovation potential. I've been tracking some emerging technologies that could give us a competitive edge.`,
      CHRO: `Wonderful people question! ${topic} is close to my heart. Let me share some thoughts on how we can strengthen this area while keeping our team culture strong.`,
      "VP Engineering": `Great engineering question! ${topic} is top of mind for my teams. Let me share our capacity plan and how I think we should approach this from an execution standpoint.`,
      "Data Scientist": `Excellent data question! ${topic} is something the data team can definitely help with. Let me outline our analytical approach and what data we need to answer this properly.`,
      "ML Engineer": `Great ML ops question! ${topic} is crucial for production AI systems. Let me share our best practices for making this reliable and scalable.`,
      "Software Engineer": `Great technical question! ${topic} is something I've encountered before. Let me walk through my implementation approach and the trade-offs involved.`,
      "Product Manager": `Excellent product question! ${topic} is something we should definitely think through carefully. Let me share user research insights and a proposed prioritization framework.`,
      "UX Designer": `Love this design question! ${topic} is at the heart of great user experiences. Let me share some design patterns and usability principles that apply here.`,
      "DevOps Engineer": `Great infrastructure question! ${topic} is foundational to our reliability. Let me walk through the deployment architecture and operational considerations.`,
      "Security Engineer": `Important security question! ${topic} requires careful threat modeling. Let me share my analysis of the risks and recommended controls.`,
    }
    response = questionResponses[role] || `Great question. Let me think about ${topic} from my perspective as ${role}. I have several thoughts I'd like to share.`
  }

  return response
}
