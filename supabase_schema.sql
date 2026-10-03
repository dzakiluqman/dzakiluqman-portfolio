-- ==============================================================================
-- DZAKI LUQMAN PORTFOLIO & CMS - SUPABASE DATABASE SCHEMA & SEED DATA
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  full_name TEXT NOT NULL,
  headline TEXT NOT NULL,
  bio TEXT NOT NULL,
  location TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  category TEXT DEFAULT 'Fullstack',
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  employment_type TEXT DEFAULT 'Full-time',
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EDUCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_year INT NOT NULL,
  end_year INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  level TEXT DEFAULT 'Expert',
  icon_name TEXT DEFAULT 'Code',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  credential_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, Authenticated write
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert/update profile" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Projects: Public read published, Authenticated full CRUD
CREATE POLICY "Published projects viewable by everyone" ON public.projects FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Authenticated users manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Experiences: Public read, Authenticated full CRUD
CREATE POLICY "Public experiences viewable" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Authenticated users manage experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Educations: Public read, Authenticated full CRUD
CREATE POLICY "Public educations viewable" ON public.educations FOR SELECT USING (true);
CREATE POLICY "Authenticated users manage educations" ON public.educations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Skills: Public read, Authenticated full CRUD
CREATE POLICY "Public skills viewable" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Certifications: Public read, Authenticated full CRUD
CREATE POLICY "Public certifications viewable" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Authenticated users manage certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Messages: Anyone can insert a contact message, Authenticated can read/update/delete
CREATE POLICY "Anyone can submit a message" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can manage messages" ON public.messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Profile
INSERT INTO public.profiles (full_name, headline, bio, location, avatar_url, social_links)
VALUES (
  'Dzaki Luqman',
  'Senior Fullstack Software Engineer & Cloud Architect',
  'Passionate full-stack developer with 5+ years of experience engineering scalable web applications, real-time distributed systems, and intuitive user experiences. Specialized in React, Node.js, TypeScript, and modern cloud databases.',
  'Jakarta, Indonesia',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  '{"github": "https://github.com/dzakiluqman", "linkedin": "https://linkedin.com/in/dzakiluqman", "twitter": "https://twitter.com/dzakiluqman", "email": "dzakiluqman@example.com"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (title, slug, description, content, category, tech_stack, github_url, demo_url, thumbnail_url, is_featured, is_published, sort_order)
VALUES
(
  'CloudScale - Autonomous Cloud Infrastructure Monitor',
  'cloudscale-infra-monitor',
  'High-throughput real-time telemetry dashboard monitoring Kubernetes clusters with AI anomaly detection and automated scaling triggers.',
  'Full description of CloudScale project detailing the architecture, microservices orchestrated with Kubernetes, Go collectors, and a React + WebGL visualization front-end.',
  'DevOps & Cloud',
  ARRAY['React', 'TypeScript', 'Go', 'Kubernetes', 'Supabase', 'TailwindCSS'],
  'https://github.com/dzakiluqman/cloudscale',
  'https://cloudscale.example.com',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
  true,
  true,
  1
),
(
  'NexusFlow - Multi-tenant Project Management SaaS',
  'nexusflow-saas',
  'Collaborative project execution workspace featuring Kanban boards, live presence cursor sync, automated sprint retros, and Stripe billing.',
  'NexusFlow handles over 10,000 active team tasks with sub-50ms optimistic updates, WebSocket state sync, and role-based workspace permissions.',
  'Fullstack Web App',
  ARRAY['React', 'Next.js', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'],
  'https://github.com/dzakiluqman/nexusflow',
  'https://nexusflow.example.com',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  true,
  true,
  2
),
(
  'PulseCrypto - Ultra-fast Algorithmic Trading Analytics',
  'pulsecrypto-analytics',
  'Real-time order book visualizer, volume heatmaps, and customizable algorithmic signal alerts connected to WebSocket crypto feeds.',
  'Deep dive into algorithmic order processing, WebSocket stream handling, and client-side web workers for high-frequency chart rendering.',
  'Fintech & Web3',
  ARRAY['React', 'Vite', 'Tailwind CSS', 'WebSockets', 'Chart.js'],
  'https://github.com/dzakiluqman/pulsecrypto',
  'https://pulsecrypto.example.com',
  'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
  true,
  true,
  3
),
(
  'SynthGen - Multimodal AI Content Studio',
  'synthgen-ai-studio',
  'Generative AI suite combining text, voice synthesis, and image generation into unified collaborative creative workflows.',
  'Created using LLM orchestration, vector embeddings with pgvector on Supabase, and responsive audio waveform streaming.',
  'Artificial Intelligence',
  ARRAY['React', 'Python', 'FastAPI', 'OpenAI', 'Supabase'],
  'https://github.com/dzakiluqman/synthgen',
  'https://synthgen.example.com',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  false,
  true,
  4
) ON CONFLICT DO NOTHING;

-- Seed Experiences
INSERT INTO public.experiences (company, role, location, employment_type, start_date, end_date, is_current, description, achievements, sort_order)
VALUES
(
  'TechNovation Labs',
  'Lead Fullstack Engineer',
  'Jakarta, Indonesia (Hybrid)',
  'Full-time',
  '2022-03-01',
  null,
  true,
  'Leading a squad of 8 engineers delivering enterprise cloud platforms and micro-frontend architectures.',
  ARRAY[
    'Architected resilient microservices ecosystem processing 4M+ daily API transactions with 99.98% uptime',
    'Spearheaded frontend migration to Vite + React and Tailwind CSS, slashing build times by 65%',
    'Mentored 6 junior and mid-level developers in testing best practices and CI/CD automation'
  ],
  1
),
(
  'FinStack Solutions',
  'Senior Software Engineer',
  'Singapore (Remote)',
  'Full-time',
  '2020-06-01',
  '2022-02-28',
  false,
  'Built high-security payment gateways and multi-currency ledger reconciliation engines.',
  ARRAY[
    'Designed real-time fraud detection pipeline reducing fraudulent checkout attempts by 42%',
    'Optimized PostgreSQL queries and database indices resulting in 3x faster report generation',
    'Implemented automated end-to-end testing suite achieving 92% code coverage'
  ],
  2
),
(
  'Global Digital Agency',
  'Frontend Developer',
  'Bandung, Indonesia',
  'Full-time',
  '2018-09-01',
  '2020-05-31',
  false,
  'Crafted dynamic, responsive client web applications and interactive marketing landing pages.',
  ARRAY[
    'Shipped over 25 custom client portals with bespoke CMS integrations',
    'Standardized component library in React, cutting project delivery cycle by 3 weeks'
  ],
  3
) ON CONFLICT DO NOTHING;

-- Seed Educations
INSERT INTO public.educations (institution, degree, field_of_study, start_year, end_year)
VALUES
(
  'Bandung Institute of Technology (ITB)',
  'Bachelor of Science',
  'Informatics / Computer Science',
  2014,
  2018
) ON CONFLICT DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (category, name, level, icon_name, sort_order)
VALUES
('Frontend', 'React / Next.js', 'Expert', 'Code', 1),
('Frontend', 'TypeScript', 'Expert', 'FileCode', 2),
('Frontend', 'Tailwind CSS', 'Expert', 'Palette', 3),
('Frontend', 'Framer Motion', 'Advanced', 'Sparkles', 4),
('Backend', 'Node.js & Express', 'Expert', 'Server', 5),
('Backend', 'Supabase & PostgreSQL', 'Expert', 'Database', 6),
('Backend', 'Go / Golang', 'Intermediate', 'Cpu', 7),
('DevOps', 'Docker & Kubernetes', 'Advanced', 'Container', 8),
('DevOps', 'AWS & Cloudflare', 'Advanced', 'Cloud', 9),
('DevOps', 'CI/CD GitHub Actions', 'Expert', 'GitBranch', 10)
ON CONFLICT DO NOTHING;

-- Seed Certifications
INSERT INTO public.certifications (title, issuer, issue_date, credential_url)
VALUES
(
  'AWS Certified Solutions Architect – Associate',
  'Amazon Web Services',
  '2023-08-15',
  'https://aws.amazon.com/verification'
),
(
  'Meta Certified Front-End Developer',
  'Meta / Coursera',
  '2022-11-20',
  'https://coursera.org/verify'
) ON CONFLICT DO NOTHING;
