export const mockProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  full_name: 'Dzakii Luqman Faid',
  headline: 'Junior Software Developer',
  bio: 'An enthusiastic, fast-learning Junior Software Developer passionate about building modern, interactive web applications with React, Tailwind CSS, and cloud backends.',
  location: 'Kota Magelang, Indonesia',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  social_links: {
    github: 'https://github.com/dzakiluqman',
    linkedin: 'https://linkedin.com/in/dzakiluqman',
    twitter: 'https://twitter.com/dzakiluqman',
    email: 'dzakiluqman275@gmail.com'
  }
}

export const mockProjects = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    title: 'CloudScale - Autonomous Cloud Infrastructure Monitor',
    slug: 'cloudscale-infra-monitor',
    description: 'High-throughput real-time telemetry dashboard monitoring Kubernetes clusters with AI anomaly detection and automated scaling triggers.',
    content: 'Full description of CloudScale project detailing the architecture, microservices orchestrated with Kubernetes, Go collectors, and a React + WebGL visualization front-end.',
    category: 'DevOps & Cloud',
    tech_stack: ['React', 'TypeScript', 'Go', 'Kubernetes', 'Supabase', 'TailwindCSS'],
    github_url: 'https://github.com/dzakiluqman/cloudscale',
    demo_url: 'https://cloudscale.example.com',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
    ],
    is_featured: true,
    is_published: true,
    sort_order: 1
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    title: 'NexusFlow - Multi-tenant Project Management SaaS',
    slug: 'nexusflow-saas',
    description: 'Collaborative project execution workspace featuring Kanban boards, live presence cursor sync, automated sprint retros, and Stripe billing.',
    content: 'NexusFlow handles over 10,000 active team tasks with sub-50ms optimistic updates, WebSocket state sync, and role-based workspace permissions.',
    category: 'Fullstack Web App',
    tech_stack: ['React', 'Next.js', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'],
    github_url: 'https://github.com/dzakiluqman/nexusflow',
    demo_url: 'https://nexusflow.example.com',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80'
    ],
    is_featured: true,
    is_published: true,
    sort_order: 2
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    title: 'PulseCrypto - Ultra-fast Algorithmic Trading Analytics',
    slug: 'pulsecrypto-analytics',
    description: 'Real-time order book visualizer, volume heatmaps, and customizable algorithmic signal alerts connected to WebSocket crypto feeds.',
    content: 'Deep dive into algorithmic order processing, WebSocket stream handling, and client-side web workers for high-frequency chart rendering.',
    category: 'Fintech & Web3',
    tech_stack: ['React', 'Vite', 'Tailwind CSS', 'WebSockets', 'Chart.js'],
    github_url: 'https://github.com/dzakiluqman/pulsecrypto',
    demo_url: 'https://pulsecrypto.example.com',
    thumbnail_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&auto=format&fit=crop&q=80'
    ],
    is_featured: true,
    is_published: true,
    sort_order: 3
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    title: 'SynthGen - Multimodal AI Content Studio',
    slug: 'synthgen-ai-studio',
    description: 'Generative AI suite combining text, voice synthesis, and image generation into unified collaborative creative workflows.',
    content: 'Created using LLM orchestration, vector embeddings with pgvector on Supabase, and responsive audio waveform streaming.',
    category: 'Artificial Intelligence',
    tech_stack: ['React', 'Python', 'FastAPI', 'OpenAI', 'Supabase'],
    github_url: 'https://github.com/dzakiluqman/synthgen',
    demo_url: 'https://synthgen.example.com',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80'
    ],
    is_featured: false,
    is_published: true,
    sort_order: 4
  }
]

export const mockExperiences = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    company: 'TechNovation Labs',
    role: 'Lead Fullstack Engineer',
    location: 'Jakarta, Indonesia (Hybrid)',
    employment_type: 'Full-time',
    start_date: '2022-03-01',
    end_date: null,
    is_current: true,
    description: 'Leading a squad of 8 engineers delivering enterprise cloud platforms and micro-frontend architectures.',
    achievements: [
      'Architected resilient microservices ecosystem processing 4M+ daily API transactions with 99.98% uptime',
      'Spearheaded frontend migration to Vite + React and Tailwind CSS, slashing build times by 65%',
      'Mentored 6 junior and mid-level developers in testing best practices and CI/CD automation'
    ]
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    company: 'FinStack Solutions',
    role: 'Senior Software Engineer',
    location: 'Singapore (Remote)',
    employment_type: 'Full-time',
    start_date: '2020-06-01',
    end_date: '2022-02-28',
    is_current: false,
    description: 'Built high-security payment gateways and multi-currency ledger reconciliation engines.',
    achievements: [
      'Designed real-time fraud detection pipeline reducing fraudulent checkout attempts by 42%',
      'Optimized PostgreSQL queries and database indices resulting in 3x faster report generation',
      'Implemented automated end-to-end testing suite achieving 92% code coverage'
    ]
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    company: 'Global Digital Agency',
    role: 'Frontend Developer',
    location: 'Bandung, Indonesia',
    employment_type: 'Full-time',
    start_date: '2018-09-01',
    end_date: '2020-05-31',
    is_current: false,
    description: 'Crafted dynamic, responsive client web applications and interactive marketing landing pages.',
    achievements: [
      'Shipped over 25 custom client portals with bespoke CMS integrations',
      'Standardized component library in React, cutting project delivery cycle by 3 weeks'
    ]
  }
]

export const mockEducations = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    institution: 'Bandung Institute of Technology (ITB)',
    degree: 'Bachelor of Science (S.Kom.)',
    field_of_study: 'Informatics / Computer Science',
    start_year: 2014,
    end_year: 2018,
    key_focus: 'Distributed Systems & Software Engineering',
    description: 'Graduated with honors (Cum Laude). Core research on high-throughput event streaming protocols and distributed consistency models. Led ITB Open Source Community.'
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    institution: 'National University of Singapore (NUS)',
    degree: 'Global Academic Immersion',
    field_of_study: 'Cloud Infrastructure & High-Performance Computing',
    start_year: 2017,
    end_year: 2017,
    key_focus: 'Cloud Architecture & Microservices Resilience',
    description: 'Intensive academic immersion on cloud native paradigms, distributed consensus (Raft/Paxos), and container virtualization pipelines.'
  }
]

export const mockSkills = [
  { id: '40000000-0000-0000-0000-000000000001', category: 'frontend', title: 'React / Next.js', name: 'React / Next.js', subtitle: 'UI Architecture & SSR', level: 'Expert', icon_name: 'Code', order_index: 1, sort_order: 1 },
  { id: '40000000-0000-0000-0000-000000000002', category: 'frontend', title: 'TypeScript', name: 'TypeScript', subtitle: 'Strict Static Typing', level: 'Expert', icon_name: 'FileCode', order_index: 2, sort_order: 2 },
  { id: '40000000-0000-0000-0000-000000000003', category: 'frontend', title: 'Three.js / R3F', name: 'Three.js / R3F', subtitle: 'WebGL & Spatial 3D', level: 'Expert', icon_name: 'Sparkles', order_index: 3, sort_order: 3 },
  { id: '40000000-0000-0000-0000-000000000004', category: 'frontend', title: 'Tailwind CSS', name: 'Tailwind CSS', subtitle: 'Design Tokens & Utility', level: 'Expert', icon_name: 'Palette', order_index: 4, sort_order: 4 },
  { id: '40000000-0000-0000-0000-000000000005', category: 'backend', title: 'Node.js & Express', name: 'Node.js & Express', subtitle: 'High-Throughput APIs', level: 'Expert', icon_name: 'Server', order_index: 5, sort_order: 5 },
  { id: '40000000-0000-0000-0000-000000000006', category: 'backend', title: 'Supabase & PostgreSQL', name: 'Supabase & PostgreSQL', subtitle: 'Relational Data & Realtime', level: 'Expert', icon_name: 'Database', order_index: 6, sort_order: 6 },
  { id: '40000000-0000-0000-0000-000000000007', category: 'backend', title: 'Go / Golang', name: 'Go / Golang', subtitle: 'Concurrent Microservices', level: 'Intermediate', icon_name: 'Cpu', order_index: 7, sort_order: 7 },
  { id: '40000000-0000-0000-0000-000000000008', category: 'devops', title: 'Docker & Kubernetes', name: 'Docker & Kubernetes', subtitle: 'Containers & Orchestration', level: 'Advanced', icon_name: 'Boxes', order_index: 8, sort_order: 8 },
  { id: '40000000-0000-0000-0000-000000000009', category: 'devops', title: 'AWS & Cloudflare', name: 'AWS & Cloudflare', subtitle: 'Serverless & Global Edge', level: 'Advanced', icon_name: 'Cloud', order_index: 9, sort_order: 9 },
  { id: '40000000-0000-0000-0000-000000000010', category: 'devops', title: 'CI/CD GitHub Actions', name: 'CI/CD GitHub Actions', subtitle: 'Automated Deployment Pipelines', level: 'Expert', icon_name: 'GitBranch', order_index: 10, sort_order: 10 }
]

export const mockCertifications = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    issue_date: '2023-08-15',
    credential_id: 'AWS-SAA-904218',
    credential_url: 'https://aws.amazon.com/verification',
    skills: 'High-Availability VPC, S3 Lifecycle, IAM, Multi-tier Architecture'
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    title: 'Meta Certified Front-End Developer',
    issuer: 'Meta / Coursera',
    issue_date: '2022-11-20',
    credential_id: 'META-FED-772910',
    credential_url: 'https://coursera.org/verify',
    skills: 'Advanced React Architecture, Client-side Optimization, WCAG Accessibility'
  },
  {
    id: '50000000-0000-0000-0000-000000000003',
    title: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation (CNCF)',
    issue_date: '2024-03-10',
    credential_id: 'CKA-2403-8821',
    credential_url: 'https://www.cncf.io/certification/cka/',
    skills: 'Cluster Architecture, Production Ingress, Workload Troubleshooting'
  }
]

export const mockMessages = [
  {
    id: '60000000-0000-0000-0000-000000000001',
    sender_name: 'Sarah Jenkins',
    sender_email: 'sarah.j@venturecapital.io',
    subject: 'Potential Tech Advisory Role & Partnership',
    message: 'Hi Dzakii, I came across your CloudScale project and was extremely impressed by the telemetry architecture. We are building a high-growth fintech startup and would love to discuss advisory or engineering consulting opportunities.',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: '60000000-0000-0000-0000-000000000002',
    sender_name: 'David Chen',
    sender_email: 'david@enterprisecloud.com',
    subject: 'Speaking invitation: Cloud Architecture Summit',
    message: 'Hello Dzakii! Would you be interested in delivering a keynote session on Supabase + React real-time patterns at our upcoming virtual developer summit in November?',
    is_read: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
]
