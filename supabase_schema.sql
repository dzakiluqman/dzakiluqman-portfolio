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
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration helper: Ensure 'images' column exists on existing projects table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'images') THEN
    ALTER TABLE public.projects ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
END $$;

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
  key_focus TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration helper for educations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'educations' AND column_name = 'key_focus') THEN
    ALTER TABLE public.educations ADD COLUMN key_focus TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'educations' AND column_name = 'description') THEN
    ALTER TABLE public.educations ADD COLUMN description TEXT;
  END IF;
END $$;

-- 5. SKILLS / COMPETENCIES TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Code',
  order_index INT DEFAULT 0,
  -- Backwards-compatibility columns
  name TEXT,
  level TEXT DEFAULT 'Expert',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration helper: in case table already exists with legacy columns (name, sort_order)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'title') THEN
    ALTER TABLE public.skills ADD COLUMN title TEXT;
    UPDATE public.skills SET title = name WHERE title IS NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'subtitle') THEN
    ALTER TABLE public.skills ADD COLUMN subtitle TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'order_index') THEN
    ALTER TABLE public.skills ADD COLUMN order_index INT DEFAULT 0;
    UPDATE public.skills SET order_index = sort_order WHERE order_index IS NULL OR order_index = 0;
  END IF;
END $$;


-- 6. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  skills TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration helper for certifications
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'credential_id') THEN
    ALTER TABLE public.certifications ADD COLUMN credential_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'skills') THEN
    ALTER TABLE public.certifications ADD COLUMN skills TEXT;
  END IF;
END $$;

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
  'Dzakii Luqman Faid',
  'Junior Software Developer',
  'An enthusiastic, fast-learning Junior Software Developer passionate about building modern, interactive web applications with React, Tailwind CSS, and cloud backends.',
  'Kota Magelang, Indonesia',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  '{"github": "https://github.com/dzakiluqman", "linkedin": "https://linkedin.com/in/dzakiluqman", "instagram": "https://www.instagram.com/dzak.ii_/", "medium": "https://medium.com/@dzakiluqman275", "email": "dzakiluqman275@gmail.com"}'::jsonb
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
INSERT INTO public.skills (category, title, subtitle, icon_name, order_index, name, level, sort_order)
VALUES
('frontend', 'React / Next.js', 'UI Architecture & SSR', 'Code', 1, 'React / Next.js', 'Expert', 1),
('frontend', 'TypeScript', 'Strict Static Typing', 'FileCode', 2, 'TypeScript', 'Expert', 2),
('frontend', 'Three.js / R3F', 'WebGL & Spatial 3D', 'Sparkles', 3, 'Three.js / R3F', 'Expert', 3),
('frontend', 'Tailwind CSS', 'Design Tokens & Utility', 'Palette', 4, 'Tailwind CSS', 'Expert', 4),
('backend', 'Node.js & Express', 'High-Throughput APIs', 'Server', 5, 'Node.js & Express', 'Expert', 5),
('backend', 'Supabase & PostgreSQL', 'Relational Data & Realtime', 'Database', 6, 'Supabase & PostgreSQL', 'Expert', 6),
('backend', 'Go / Golang', 'Concurrent Microservices', 'Cpu', 7, 'Go / Golang', 'Intermediate', 7),
('devops', 'Docker & Kubernetes', 'Containers & Orchestration', 'Boxes', 8, 'Docker & Kubernetes', 'Advanced', 8),
('devops', 'AWS & Cloudflare', 'Serverless & Global Edge', 'Cloud', 9, 'AWS & Cloudflare', 'Advanced', 9),
('devops', 'CI/CD GitHub Actions', 'Automated Deployment Pipelines', 'GitBranch', 10, 'CI/CD GitHub Actions', 'Expert', 10)
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

-- ==============================================================================
-- 8. STORAGE BUCKET FOR PROJECT IMAGES ('projects')
-- ==============================================================================

-- Create public 'projects' bucket if not already existing
INSERT INTO storage.buckets (id, name, public) 
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access to all objects in 'projects' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for Projects Storage'
  ) THEN
    CREATE POLICY "Public Access for Projects Storage" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'projects');
  END IF;
END $$;

-- Authenticated users can insert/upload objects into 'projects' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can upload to projects'
  ) THEN
    CREATE POLICY "Authenticated users can upload to projects" 
    ON storage.objects FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'projects');
  END IF;
END $$;

-- Authenticated users can update/delete objects in 'projects' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can manage projects storage'
  ) THEN
    CREATE POLICY "Authenticated users can manage projects storage" 
    ON storage.objects FOR ALL TO authenticated 
    USING (bucket_id = 'projects');
  END IF;
END $$;

-- ==============================================================================
-- 9. TRACKS TABLE (FOR SCROLL-TRIGGERED FLOATING AUDIO PLAYER)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'Dzaki Luqman',
  audio_url TEXT NOT NULL,
  duration TEXT DEFAULT '03:00',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast ordering and filtering
CREATE INDEX IF NOT EXISTS idx_tracks_active_order ON public.tracks (is_active, order_index);

-- Enable Row Level Security
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Public read access to active tracks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'tracks' AND policyname = 'Public read access for active tracks'
  ) THEN
    CREATE POLICY "Public read access for active tracks" 
    ON public.tracks FOR SELECT 
    USING (is_active = true);
  END IF;
END $$;

-- Authenticated users (admin) can perform all operations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'tracks' AND policyname = 'Authenticated admin full access to tracks'
  ) THEN
    CREATE POLICY "Authenticated admin full access to tracks" 
    ON public.tracks FOR ALL TO authenticated 
    USING (true);
  END IF;
END $$;

-- ==============================================================================
-- 10. STORAGE BUCKET FOR AUDIO TRACKS ('audio-tracks')
-- ==============================================================================

-- Create public 'audio-tracks' bucket if not already existing
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-tracks', 'audio-tracks', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access to all audio objects in 'audio-tracks' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for Audio Tracks'
  ) THEN
    CREATE POLICY "Public Access for Audio Tracks" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'audio-tracks');
  END IF;
END $$;

-- Authenticated users can upload audio objects into 'audio-tracks' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can upload audio tracks'
  ) THEN
    CREATE POLICY "Authenticated users can upload audio tracks" 
    ON storage.objects FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'audio-tracks');
  END IF;
END $$;

-- Authenticated users can update/delete audio objects in 'audio-tracks' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can manage audio tracks storage'
  ) THEN
    CREATE POLICY "Authenticated users can manage audio tracks storage" 
    ON storage.objects FOR ALL TO authenticated 
    USING (bucket_id = 'audio-tracks');
  END IF;
END $$;



