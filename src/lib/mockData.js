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
    email: 'dzakiluqman@example.com'
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
    degree: 'Bachelor of Science',
    field_of_study: 'Informatics / Computer Science',
    start_year: 2014,
    end_year: 2018
  }
]

export const mockSkills = [
  { id: '40000000-0000-0000-0000-000000000001', category: 'Frontend', name: 'React / Next.js', level: 'Expert', icon_name: 'Code' },
  { id: '40000000-0000-0000-0000-000000000002', category: 'Frontend', name: 'TypeScript', level: 'Expert', icon_name: 'FileCode' },
  { id: '40000000-0000-0000-0000-000000000003', category: 'Frontend', name: 'Three.js / R3F', level: 'Expert', icon_name: 'Sparkles' },
  { id: '40000000-0000-0000-0000-000000000004', category: 'Frontend', name: 'Tailwind CSS', level: 'Expert', icon_name: 'Palette' },
  { id: '40000000-0000-0000-0000-000000000005', category: 'Backend', name: 'Node.js & Express', level: 'Expert', icon_name: 'Server' },
  { id: '40000000-0000-0000-0000-000000000006', category: 'Backend', name: 'Supabase & PostgreSQL', level: 'Expert', icon_name: 'Database' },
  { id: '40000000-0000-0000-0000-000000000007', category: 'Backend', name: 'Go / Golang', level: 'Intermediate', icon_name: 'Cpu' },
  { id: '40000000-0000-0000-0000-000000000008', category: 'DevOps', name: 'Docker & Kubernetes', level: 'Advanced', icon_name: 'Container' },
  { id: '40000000-0000-0000-0000-000000000009', category: 'DevOps', name: 'AWS & Cloudflare', level: 'Advanced', icon_name: 'Cloud' },
  { id: '40000000-0000-0000-0000-000000000010', category: 'DevOps', name: 'CI/CD GitHub Actions', level: 'Expert', icon_name: 'GitBranch' }
]

export const mockCertifications = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    issue_date: '2023-08-15',
    credential_url: 'https://aws.amazon.com/verification'
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    title: 'Meta Certified Front-End Developer',
    issuer: 'Meta / Coursera',
    issue_date: '2022-11-20',
    credential_url: 'https://coursera.org/verify'
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
